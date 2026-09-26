const db = require('../config/db');

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { show_id, seat_ids, payment_method } = req.body;

    if (!show_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid show or seat selection.' });
    }

    const showId = Number(show_id);
    const method = payment_method || 'UPI';

    if (db.isMySQL && db.pool) {
      const conn = await db.pool.getConnection();
      try {
        await conn.beginTransaction();

        // 1. Check show
        const [shows] = await conn.query('SELECT * FROM shows WHERE id = ?', [showId]);
        if (shows.length === 0) {
          await conn.rollback();
          return res.status(404).json({ success: false, message: 'Selected show was not found.' });
        }
        const show = shows[0];

        // 2. Check if any seat is already booked
        const placeholders = seat_ids.map(() => '?').join(',');
        const [alreadyBooked] = await conn.query(
          `SELECT bs.seat_id 
           FROM booking_seats bs
           JOIN bookings b ON bs.booking_id = b.id
           WHERE b.show_id = ? AND b.booking_status = 'CONFIRMED' AND bs.seat_id IN (${placeholders})`,
          [showId, ...seat_ids]
        );

        if (alreadyBooked.length > 0) {
          await conn.rollback();
          return res.status(400).json({ success: false, message: 'One or more of your selected seats are no longer available.' });
        }

        // 3. Get seat prices
        const [seats] = await conn.query(`SELECT * FROM seats WHERE id IN (${placeholders})`, seat_ids);
        let subtotal = 0;
        seats.forEach(s => { subtotal += Number(s.price || show.ticket_price); });
        const convenienceFee = 30.00;
        const totalAmount = subtotal + convenienceFee;

        // 4. Generate unique Booking Code & Transaction ID
        const bookingCode = 'MB-' + Math.floor(100000 + Math.random() * 900000);
        const transactionId = 'TXN_' + Date.now() + Math.floor(1000 + Math.random() * 9000);

        // 5. Insert Booking
        const [bRes] = await conn.query(
          'INSERT INTO bookings (user_id, show_id, booking_code, total_amount, booking_status, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, showId, bookingCode, totalAmount, 'CONFIRMED', 'SUCCESS']
        );
        const bookingId = bRes.insertId;

        // 6. Insert Booking Seats
        for (const seat of seats) {
          await conn.query(
            'INSERT INTO booking_seats (booking_id, seat_id, price) VALUES (?, ?, ?)',
            [bookingId, seat.id, Number(seat.price || show.ticket_price)]
          );
        }

        // 7. Insert Payment
        await conn.query(
          'INSERT INTO payments (booking_id, payment_method, transaction_id, amount, payment_status) VALUES (?, ?, ?, ?, ?)',
          [bookingId, method, transactionId, totalAmount, 'SUCCESS']
        );

        await conn.commit();
        conn.release();

        return res.status(201).json({
          success: true,
          message: 'Booking confirmed successfully!',
          bookingId,
          booking_code: bookingCode,
          total_amount: totalAmount
        });
      } catch (err) {
        await conn.rollback();
        conn.release();
        throw err;
      }
    } else {
      // Memory DB Implementation
      const show = db.memoryDb.data.shows.find(s => s.id === showId);
      if (!show) return res.status(404).json({ success: false, message: 'Selected show was not found.' });

      // Check double booking
      const confirmedBookings = db.memoryDb.data.bookings.filter(b => b.show_id === showId && b.booking_status === 'CONFIRMED');
      const confirmedIds = new Set(confirmedBookings.map(b => b.id));
      const bookedSeatIds = new Set(
        db.memoryDb.data.booking_seats.filter(bs => confirmedIds.has(bs.booking_id)).map(bs => bs.seat_id)
      );

      const isConflict = seat_ids.some(id => bookedSeatIds.has(Number(id)));
      if (isConflict) {
        return res.status(400).json({ success: false, message: 'One or more selected seats are no longer available.' });
      }

      // Calculate total
      const seats = db.memoryDb.data.seats.filter(s => seat_ids.includes(s.id));
      let subtotal = 0;
      seats.forEach(s => { subtotal += Number(s.price || show.ticket_price); });
      const totalAmount = subtotal + 30.00;

      const bookingCode = 'MB-' + Math.floor(100000 + Math.random() * 900000);
      const transactionId = 'TXN_' + Date.now() + Math.floor(1000 + Math.random() * 9000);

      const bookingId = db.memoryDb.getNextId('bookings');
      const newBooking = {
        id: bookingId,
        user_id: userId,
        show_id: showId,
        booking_code: bookingCode,
        total_amount: totalAmount,
        booking_status: 'CONFIRMED',
        payment_status: 'SUCCESS',
        booked_at: new Date().toISOString()
      };

      db.memoryDb.data.bookings.push(newBooking);

      seats.forEach(s => {
        db.memoryDb.data.booking_seats.push({
          id: db.memoryDb.getNextId('booking_seats'),
          booking_id: bookingId,
          seat_id: s.id,
          price: Number(s.price || show.ticket_price)
        });
      });

      db.memoryDb.data.payments.push({
        id: db.memoryDb.getNextId('payments'),
        booking_id: bookingId,
        payment_method: method,
        transaction_id: transactionId,
        amount: totalAmount,
        payment_status: 'SUCCESS',
        paid_at: new Date().toISOString()
      });

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully!',
        bookingId,
        booking_code: bookingCode,
        total_amount: totalAmount
      });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Failed to complete booking.' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    if (db.isMySQL && db.pool) {
      const [bookings] = await db.pool.query(
        `SELECT b.*, 
                s.show_date, s.show_time, s.ticket_price,
                m.title as movie_title, m.poster as movie_poster, m.language, m.genre,
                t.name as theatre_name, t.location as theatre_location,
                sc.screen_name
         FROM bookings b
         JOIN shows s ON b.show_id = s.id
         JOIN movies m ON s.movie_id = m.id
         JOIN theatres t ON s.theatre_id = t.id
         JOIN screens sc ON s.screen_id = sc.id
         WHERE b.user_id = ?
         ORDER BY b.booked_at DESC`,
        [userId]
      );

      // Populate seats for each booking
      for (const b of bookings) {
        const [seats] = await db.pool.query(
          `SELECT s.seat_number, s.row_name, s.seat_type 
           FROM booking_seats bs 
           JOIN seats s ON bs.seat_id = s.id 
           WHERE bs.booking_id = ?`,
          [b.id]
        );
        b.seats = seats;
      }

      return res.json({ success: true, count: bookings.length, bookings });
    } else {
      const userBookings = db.memoryDb.data.bookings.filter(b => b.user_id === userId);

      const populated = userBookings.map(b => {
        const show = db.memoryDb.data.shows.find(s => s.id === b.show_id) || {};
        const movie = db.memoryDb.data.movies.find(m => m.id === show.movie_id) || {};
        const theatre = db.memoryDb.data.theatres.find(t => t.id === show.theatre_id) || {};
        const screen = db.memoryDb.data.screens.find(sc => sc.id === show.screen_id) || {};

        const bSeats = db.memoryDb.data.booking_seats.filter(bs => bs.booking_id === b.id);
        const seats = bSeats.map(bs => {
          const seatObj = db.memoryDb.data.seats.find(st => st.id === bs.seat_id) || {};
          return {
            seat_number: seatObj.seat_number || 'A1',
            row_name: seatObj.row_name || 'A',
            seat_type: seatObj.seat_type || 'STANDARD'
          };
        });

        return {
          ...b,
          show_date: show.show_date,
          show_time: show.show_time,
          ticket_price: show.ticket_price,
          movie_title: movie.title,
          movie_poster: movie.poster,
          language: movie.language,
          genre: movie.genre,
          theatre_name: theatre.name,
          theatre_location: theatre.location,
          screen_name: screen.screen_name,
          seats
        };
      });

      populated.sort((a, b) => new Date(b.booked_at) - new Date(a.booked_at));
      return res.json({ success: true, count: populated.length, bookings: populated });
    }
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const id = req.params.id;

    if (db.isMySQL && db.pool) {
      const isCode = isNaN(Number(id));
      const whereClause = isCode ? 'b.booking_code = ?' : 'b.id = ?';

      const [rows] = await db.pool.query(
        `SELECT b.*, 
                s.show_date, s.show_time, s.ticket_price,
                m.title as movie_title, m.poster as movie_poster, m.language, m.genre, m.duration,
                t.name as theatre_name, t.location as theatre_location, t.address as theatre_address, t.city,
                sc.screen_name,
                p.payment_method, p.transaction_id, p.paid_at
         FROM bookings b
         JOIN shows s ON b.show_id = s.id
         JOIN movies m ON s.movie_id = m.id
         JOIN theatres t ON s.theatre_id = t.id
         JOIN screens sc ON s.screen_id = sc.id
         LEFT JOIN payments p ON b.id = p.booking_id
         WHERE ${whereClause}`,
        [id]
      );

      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Booking details not found.' });

      const booking = rows[0];
      const [seats] = await db.pool.query(
        `SELECT s.seat_number, s.row_name, s.seat_type, bs.price 
         FROM booking_seats bs 
         JOIN seats s ON bs.seat_id = s.id 
         WHERE bs.booking_id = ?`,
        [booking.id]
      );
      booking.seats = seats;

      return res.json({ success: true, booking });
    } else {
      const booking = db.memoryDb.data.bookings.find(b => b.id === Number(id) || b.booking_code === id);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking details not found.' });

      const show = db.memoryDb.data.shows.find(s => s.id === booking.show_id) || {};
      const movie = db.memoryDb.data.movies.find(m => m.id === show.movie_id) || {};
      const theatre = db.memoryDb.data.theatres.find(t => t.id === show.theatre_id) || {};
      const screen = db.memoryDb.data.screens.find(sc => sc.id === show.screen_id) || {};
      const payment = db.memoryDb.data.payments.find(p => p.booking_id === booking.id) || {};

      const bSeats = db.memoryDb.data.booking_seats.filter(bs => bs.booking_id === booking.id);
      const seats = bSeats.map(bs => {
        const s = db.memoryDb.data.seats.find(st => st.id === bs.seat_id) || {};
        return {
          seat_number: s.seat_number || 'A1',
          row_name: s.row_name || 'A',
          seat_type: s.seat_type || 'STANDARD',
          price: bs.price
        };
      });

      return res.json({
        success: true,
        booking: {
          ...booking,
          show_date: show.show_date,
          show_time: show.show_time,
          ticket_price: show.ticket_price,
          movie_title: movie.title,
          movie_poster: movie.poster,
          language: movie.language,
          genre: movie.genre,
          duration: movie.duration,
          theatre_name: theatre.name,
          theatre_location: theatre.location,
          theatre_address: theatre.address,
          city: theatre.city,
          screen_name: screen.screen_name,
          payment_method: payment.payment_method || 'UPI',
          transaction_id: payment.transaction_id || 'TXN_SIMULATED',
          paid_at: payment.paid_at || booking.booked_at,
          seats
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving booking.' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const userId = req.user.id;

    if (db.isMySQL && db.pool) {
      const [bookings] = await db.pool.query('SELECT * FROM bookings WHERE id = ? AND user_id = ?', [bookingId, userId]);
      if (bookings.length === 0) {
        return res.status(404).json({ success: false, message: 'Booking not found or unauthorized.' });
      }

      await db.pool.query("UPDATE bookings SET booking_status = 'CANCELLED' WHERE id = ?", [bookingId]);
      await db.pool.query("UPDATE payments SET payment_status = 'REFUNDED' WHERE booking_id = ?", [bookingId]);

      return res.json({ success: true, message: 'Booking cancelled successfully. Refund initiated.' });
    } else {
      const booking = db.memoryDb.data.bookings.find(b => b.id === bookingId && b.user_id === userId);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found or unauthorized.' });
      }

      booking.booking_status = 'CANCELLED';
      const payment = db.memoryDb.data.payments.find(p => p.booking_id === bookingId);
      if (payment) payment.payment_status = 'REFUNDED';

      return res.json({ success: true, message: 'Booking cancelled successfully. Refund initiated.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};
