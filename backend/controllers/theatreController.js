const db = require('../config/db');

exports.getAllTheatres = async (req, res) => {
  try {
    const { city, search } = req.query;

    if (db.isMySQL && db.pool) {
      let query = 'SELECT * FROM theatres WHERE 1=1';
      const params = [];

      if (city) {
        query += ' AND city = ?';
        params.push(city);
      }
      if (search) {
        query += ' AND (name LIKE ? OR location LIKE ? OR address LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY id DESC';
      const [theatres] = await db.pool.query(query, params);
      return res.json({ success: true, count: theatres.length, theatres });
    } else {
      let list = [...db.memoryDb.data.theatres];

      if (city) {
        list = list.filter(t => t.city.toLowerCase() === city.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(t => 
          t.name.toLowerCase().includes(q) || 
          t.location.toLowerCase().includes(q) || 
          t.address.toLowerCase().includes(q)
        );
      }

      return res.json({ success: true, count: list.length, theatres: list });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve theatres.' });
  }
};

exports.getTheatreById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      const [rows] = await db.pool.query('SELECT * FROM theatres WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ success: false, message: 'Theatre not found.' });

      const [screens] = await db.pool.query('SELECT * FROM screens WHERE theatre_id = ?', [id]);
      return res.json({ success: true, theatre: { ...rows[0], screens } });
    } else {
      const theatre = db.memoryDb.data.theatres.find(t => t.id === id);
      if (!theatre) return res.status(404).json({ success: false, message: 'Theatre not found.' });

      const screens = db.memoryDb.data.screens.filter(s => s.theatre_id === id);
      return res.json({ success: true, theatre: { ...theatre, screens } });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching theatre details.' });
  }
};

exports.createTheatre = async (req, res) => {
  try {
    const { name, location, address, city } = req.body;
    if (!name || !location || !address || !city) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    if (db.isMySQL && db.pool) {
      const [resOut] = await db.pool.query(
        'INSERT INTO theatres (name, location, address, city) VALUES (?, ?, ?, ?)',
        [name, location, address, city]
      );
      const newTheatreId = resOut.insertId;
      // Auto-create default Screen 1 with 56 seats
      const [screenRes] = await db.pool.query('INSERT INTO screens (theatre_id, screen_name, total_seats) VALUES (?, ?, ?)', [newTheatreId, 'Screen 1 (Dolby Atmos)', 56]);
      const screenId = screenRes.insertId;

      // Create seats A-G 1-8
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      for (let rIndex = 0; rIndex < rows.length; rIndex++) {
        const rowName = rows[rIndex];
        const seatType = rIndex >= 5 ? 'VIP' : rIndex >= 3 ? 'PREMIUM' : 'STANDARD';
        const price = seatType === 'VIP' ? 250 : seatType === 'PREMIUM' ? 200 : 150;
        for (let col = 1; col <= 8; col++) {
          await db.pool.query('INSERT INTO seats (screen_id, seat_number, row_name, seat_type, price) VALUES (?, ?, ?, ?, ?)', [screenId, `${rowName}${col}`, rowName, seatType, price]);
        }
      }

      return res.status(201).json({ success: true, message: 'Theatre created successfully!', id: newTheatreId });
    } else {
      const id = db.memoryDb.getNextId('theatres');
      const newT = { id, name, location, address, city, created_at: new Date().toISOString() };
      db.memoryDb.data.theatres.push(newT);

      const screenId = db.memoryDb.getNextId('screens');
      db.memoryDb.data.screens.push({
        id: screenId,
        theatre_id: id,
        screen_name: 'Screen 1 (Dolby Atmos)',
        total_seats: 56,
        created_at: new Date().toISOString()
      });

      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
      for (let rIndex = 0; rIndex < rows.length; rIndex++) {
        const rowName = rows[rIndex];
        const seatType = rIndex >= 5 ? 'VIP' : rIndex >= 3 ? 'PREMIUM' : 'STANDARD';
        const price = seatType === 'VIP' ? 250 : seatType === 'PREMIUM' ? 200 : 150;
        for (let col = 1; col <= 8; col++) {
          db.memoryDb.data.seats.push({
            id: db.memoryDb.getNextId('seats'),
            screen_id: screenId,
            seat_number: `${rowName}${col}`,
            row_name: rowName,
            seat_type: seatType,
            price
          });
        }
      }

      return res.status(201).json({ success: true, message: 'Theatre created successfully!', theatre: newT });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create theatre.' });
  }
};

exports.updateTheatre = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, location, address, city } = req.body;

    if (db.isMySQL && db.pool) {
      await db.pool.query('UPDATE theatres SET name = ?, location = ?, address = ?, city = ? WHERE id = ?', [name, location, address, city, id]);
      return res.json({ success: true, message: 'Theatre updated successfully.' });
    } else {
      const idx = db.memoryDb.data.theatres.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Theatre not found.' });
      db.memoryDb.data.theatres[idx] = { ...db.memoryDb.data.theatres[idx], name, location, address, city };
      return res.json({ success: true, message: 'Theatre updated successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update theatre.' });
  }
};

exports.deleteTheatre = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (db.isMySQL && db.pool) {
      await db.pool.query('DELETE FROM theatres WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Theatre deleted successfully.' });
    } else {
      const idx = db.memoryDb.data.theatres.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Theatre not found.' });
      db.memoryDb.data.theatres.splice(idx, 1);
      return res.json({ success: true, message: 'Theatre deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete theatre.' });
  }
};
