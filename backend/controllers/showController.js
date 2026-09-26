const db = require('../config/db');

exports.getAllShows = async (req, res) => {
  try {
    const { movie_id, theatre_id, date } = req.query;

    if (db.isMySQL && db.pool) {
      let query = `
        SELECT s.*, 
               m.title as movie_title, m.poster as movie_poster, m.duration, m.language, m.rating,
               t.name as theatre_name, t.location as theatre_location, t.city,
               sc.screen_name
        FROM shows s
        JOIN movies m ON s.movie_id = m.id
        JOIN theatres t ON s.theatre_id = t.id
        JOIN screens sc ON s.screen_id = sc.id
        WHERE s.status = 'ACTIVE'
      `;
      const params = [];

      if (movie_id) {
        query += ' AND s.movie_id = ?';
        params.push(movie_id);
      }
      if (theatre_id) {
        query += ' AND s.theatre_id = ?';
        params.push(theatre_id);
      }
      if (date) {
        query += ' AND s.show_date = ?';
        params.push(date);
      }

      query += ' ORDER BY s.show_date ASC, s.show_time ASC';
      const [shows] = await db.pool.query(query, params);
      return res.json({ success: true, count: shows.length, shows });
    } else {
      let shows = [...db.memoryDb.data.shows].filter(s => s.status === 'ACTIVE');

      if (movie_id) {
        shows = shows.filter(s => s.movie_id === Number(movie_id));
      }
      if (theatre_id) {
        shows = shows.filter(s => s.theatre_id === Number(theatre_id));
      }
      if (date) {
        shows = shows.filter(s => s.show_date === date);
      }

      const populated = shows.map(s => {
        const movie = db.memoryDb.data.movies.find(m => m.id === s.movie_id) || {};
        const theatre = db.memoryDb.data.theatres.find(t => t.id === s.theatre_id) || {};
        const screen = db.memoryDb.data.screens.find(sc => sc.id === s.screen_id) || {};
        return {
          ...s,
          movie_title: movie.title,
          movie_poster: movie.poster,
          duration: movie.duration,
          language: movie.language,
          rating: movie.rating,
          theatre_name: theatre.name,
          theatre_location: theatre.location,
          city: theatre.city,
          screen_name: screen.screen_name
        };
      });

      return res.json({ success: true, count: populated.length, shows: populated });
    }
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve shows.' });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const showId = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      const [rows] = await db.pool.query(
        `SELECT s.*, 
                m.title as movie_title, m.poster as movie_poster, m.genre, m.language, m.rating, m.duration,
                t.name as theatre_name, t.location as theatre_location, t.address as theatre_address, t.city,
                sc.screen_name, sc.total_seats
         FROM shows s
         JOIN movies m ON s.movie_id = m.id
         JOIN theatres t ON s.theatre_id = t.id
         JOIN screens sc ON s.screen_id = sc.id
         WHERE s.id = ?`,
        [showId]
      );
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Show not found.' });
      return res.json({ success: true, show: rows[0] });
    } else {
      const s = db.memoryDb.data.shows.find(item => item.id === showId);
      if (!s) return res.status(404).json({ success: false, message: 'Show not found.' });

      const movie = db.memoryDb.data.movies.find(m => m.id === s.movie_id) || {};
      const theatre = db.memoryDb.data.theatres.find(t => t.id === s.theatre_id) || {};
      const screen = db.memoryDb.data.screens.find(sc => sc.id === s.screen_id) || {};

      return res.json({
        success: true,
        show: {
          ...s,
          movie_title: movie.title,
          movie_poster: movie.poster,
          genre: movie.genre,
          language: movie.language,
          rating: movie.rating,
          duration: movie.duration,
          theatre_name: theatre.name,
          theatre_location: theatre.location,
          theatre_address: theatre.address,
          city: theatre.city,
          screen_name: screen.screen_name,
          total_seats: screen.total_seats
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving show details.' });
  }
};

exports.getShowSeats = async (req, res) => {
  try {
    const showId = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      // Get show screen_id
      const [shows] = await db.pool.query('SELECT screen_id, ticket_price FROM shows WHERE id = ?', [showId]);
      if (shows.length === 0) return res.status(404).json({ success: false, message: 'Show not found.' });

      const { screen_id } = shows[0];

      // Get seats for screen
      const [seats] = await db.pool.query('SELECT * FROM seats WHERE screen_id = ? ORDER BY row_name, seat_number', [screen_id]);

      // Get booked seat ids for this show
      const [bookedRows] = await db.pool.query(
        `SELECT bs.seat_id 
         FROM booking_seats bs
         JOIN bookings b ON bs.booking_id = b.id
         WHERE b.show_id = ? AND b.booking_status = 'CONFIRMED'`,
        [showId]
      );

      const bookedSeatIds = new Set(bookedRows.map(b => b.seat_id));

      const updatedSeats = seats.map(s => ({
        ...s,
        isBooked: bookedSeatIds.has(s.id)
      }));

      return res.json({ success: true, count: updatedSeats.length, seats: updatedSeats });
    } else {
      const show = db.memoryDb.data.shows.find(s => s.id === showId);
      if (!show) return res.status(404).json({ success: false, message: 'Show not found.' });

      const screenSeats = db.memoryDb.data.seats.filter(s => s.screen_id === show.screen_id);

      // Booked seats for show in memory DB
      const confirmedBookings = db.memoryDb.data.bookings.filter(b => b.show_id === showId && b.booking_status === 'CONFIRMED');
      const confirmedBookingIds = new Set(confirmedBookings.map(b => b.id));

      const bookedSeatIds = new Set(
        db.memoryDb.data.booking_seats
          .filter(bs => confirmedBookingIds.has(bs.booking_id))
          .map(bs => bs.seat_id)
      );

      const updatedSeats = screenSeats.map(s => ({
        ...s,
        isBooked: bookedSeatIds.has(s.id)
      }));

      return res.json({ success: true, count: updatedSeats.length, seats: updatedSeats });
    }
  } catch (error) {
    console.error('Error fetching seats for show:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch seats for show.' });
  }
};

exports.createShow = async (req, res) => {
  try {
    const { movie_id, theatre_id, screen_id, show_date, show_time, ticket_price } = req.body;

    if (!movie_id || !theatre_id || !screen_id || !show_date || !show_time || !ticket_price) {
      return res.status(400).json({ success: false, message: 'Please provide all show details.' });
    }

    if (db.isMySQL && db.pool) {
      const [resOut] = await db.pool.query(
        'INSERT INTO shows (movie_id, theatre_id, screen_id, show_date, show_time, ticket_price, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Number(movie_id), Number(theatre_id), Number(screen_id), show_date, show_time, Number(ticket_price), 'ACTIVE']
      );
      return res.status(201).json({ success: true, message: 'Show scheduled successfully!', showId: resOut.insertId });
    } else {
      const newId = db.memoryDb.getNextId('shows');
      const newShow = {
        id: newId,
        movie_id: Number(movie_id),
        theatre_id: Number(theatre_id),
        screen_id: Number(screen_id),
        show_date,
        show_time,
        ticket_price: Number(ticket_price),
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      db.memoryDb.data.shows.push(newShow);
      return res.status(201).json({ success: true, message: 'Show scheduled successfully!', show: newShow });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to schedule show.' });
  }
};

exports.deleteShow = async (req, res) => {
  try {
    const showId = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      await db.pool.query('DELETE FROM shows WHERE id = ?', [showId]);
      return res.json({ success: true, message: 'Show deleted successfully.' });
    } else {
      const idx = db.memoryDb.data.shows.findIndex(s => s.id === showId);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Show not found.' });
      db.memoryDb.data.shows.splice(idx, 1);
      return res.json({ success: true, message: 'Show deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete show.' });
  }
};
