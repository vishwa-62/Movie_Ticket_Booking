const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const userRole = role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';

    // Check existing email
    if (db.isMySQL && db.pool) {
      const [existing] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email address is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await db.pool.query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone, hashedPassword, userRole]
      );

      const userId = result.insertId;
      const token = jwt.sign({ id: userId, email, role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: { id: userId, name, email, phone, role: userRole }
      });
    } else {
      // Memory DB fallback
      const existing = db.memoryDb.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email address is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newId = db.memoryDb.getNextId('users');
      const newUser = {
        id: newId,
        name,
        email,
        phone,
        password: hashedPassword,
        role: userRole,
        created_at: new Date().toISOString()
      };

      db.memoryDb.data.users.push(newUser);
      const token = jwt.sign({ id: newId, email, role: userRole, name }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: { id: newId, name, email, phone, role: userRole }
      });
    }
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user = null;

    if (db.isMySQL && db.pool) {
      const [rows] = await db.pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) user = rows[0];
    } else {
      user = db.memoryDb.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let user = null;

    if (db.isMySQL && db.pool) {
      const [rows] = await db.pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [userId]);
      if (rows.length > 0) user = rows[0];
    } else {
      const u = db.memoryDb.data.users.find(item => item.id === userId);
      if (u) {
        user = { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, created_at: u.created_at };
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    if (db.isMySQL && db.pool) {
      await db.pool.query('UPDATE users SET name = ?, phone = ? WHERE id = ?', [name, phone, userId]);
    } else {
      const idx = db.memoryDb.data.users.findIndex(u => u.id === userId);
      if (idx !== -1) {
        db.memoryDb.data.users[idx].name = name || db.memoryDb.data.users[idx].name;
        db.memoryDb.data.users[idx].phone = phone || db.memoryDb.data.users[idx].phone;
      }
    }

    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};
