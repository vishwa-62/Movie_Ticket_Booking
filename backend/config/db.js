const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// In-Memory/Local JSON Store Fallback Data
let isUsingMySQL = false;
let pool = null;

// Default initial data for zero-setup execution
const defaultData = {
  users: [
    {
      id: 1,
      name: 'Admin System',
      email: 'admin@cinepass.com',
      phone: '9876543210',
      password: '', // will set hash
      role: 'ADMIN',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Alex Morgan',
      email: 'user@cinepass.com',
      phone: '9876543211',
      password: '', // will set hash
      role: 'CUSTOMER',
      created_at: new Date().toISOString()
    }
  ],
  movies: [
    {
      id: 1,
      title: 'Avengers: Endgame',
      description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance.',
      genre: 'Action/Sci-Fi',
      language: 'English',
      duration: 181,
      release_date: '2026-04-26',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      director: 'Anthony Russo, Joe Russo',
      cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson',
      rating: 9.2,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Interstellar',
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
      genre: 'Sci-Fi/Drama',
      language: 'English',
      duration: 169,
      release_date: '2026-11-07',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      director: 'Christopher Nolan',
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      rating: 9.5,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      genre: 'Action/Sci-Fi',
      language: 'English',
      duration: 148,
      release_date: '2026-07-16',
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      director: 'Christopher Nolan',
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
      rating: 9.0,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Leo',
      description: 'Parthi, a mild-mannered cafe owner in Himachal Pradesh, gets drawn into a bloodbath when violent gangsters mistake him for a ruthless drug lord from their past.',
      genre: 'Action/Thriller',
      language: 'Tamil',
      duration: 164,
      release_date: '2026-10-19',
      poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=Po3jStA673E',
      director: 'Lokesh Kanagaraj',
      cast: 'Vijay, Sanjay Dutt, Trisha Krishnan, Arjun Sarja',
      rating: 8.8,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Vikram',
      description: 'A high-octane action thriller where a special agent investigates a murder committed by a masked group of serial killers, unraveling a deep narcotics syndicate.',
      genre: 'Action/Crime',
      language: 'Tamil',
      duration: 175,
      release_date: '2026-06-03',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=OKBMCL-frPU',
      director: 'Lokesh Kanagaraj',
      cast: 'Kamal Haasan, Vijay Sethupathi, Fahadh Faasil',
      rating: 8.9,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Jailer',
      description: 'Muthuvel Pandian, a retired prison warden, goes on a crusade to rescue his police officer son from a ruthless gang involved in smuggling stolen temple idols.',
      genre: 'Action/Comedy',
      language: 'Tamil',
      duration: 168,
      release_date: '2026-08-10',
      poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=xenOE1Tma0A',
      director: 'Nelson Dilipkumar',
      cast: 'Rajinikanth, Mohanlal, Shiva Rajkumar, Jackie Shroff',
      rating: 8.7,
      status: 'NOW_SHOWING',
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      title: 'Dragon',
      description: 'An upcoming epic action spectacle featuring breathtaking visual effects, intense combat sequences, and a gripping storyline set in an ancient fantastical realm.',
      genre: 'Fantasy/Action',
      language: 'Tamil',
      duration: 155,
      release_date: '2026-12-15',
      poster: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      director: 'Ashwath Marimuthu',
      cast: 'Pradeep Ranganathan, Anupama Parameswaran',
      rating: 8.5,
      status: 'COMING_SOON',
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      title: 'Coolie',
      description: 'An upcoming action thriller drama centered around gold smuggling, harbor operations, and high-stakes criminal warfare.',
      genre: 'Action/Drama',
      language: 'Tamil',
      duration: 160,
      release_date: '2026-11-20',
      poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
      trailer_url: 'https://www.youtube.com/watch?v=Po3jStA673E',
      director: 'Lokesh Kanagaraj',
      cast: 'Rajinikanth, Nagarjuna, Soubin Shahir',
      rating: 9.1,
      status: 'COMING_SOON',
      created_at: new Date().toISOString()
    }
  ],
  theatres: [
    { id: 1, name: 'PVR Cinemas - Brookefields', location: 'Brookefields Mall', address: 'Krishnaswamy Road, RS Puram', city: 'Coimbatore', created_at: new Date().toISOString() },
    { id: 2, name: 'INOX - Prozone Mall', location: 'Prozone Mall', address: 'Sathy Road, Saravanampatti', city: 'Coimbatore', created_at: new Date().toISOString() },
    { id: 3, name: 'Cinepolis - Fun Republic', location: 'Fun Republic Mall', address: 'Avinashi Road, Peelamedu', city: 'Coimbatore', created_at: new Date().toISOString() }
  ],
  screens: [
    { id: 1, theatre_id: 1, screen_name: 'Screen 1 (IMAX 4K)', total_seats: 56, created_at: new Date().toISOString() },
    { id: 2, theatre_id: 1, screen_name: 'Screen 2 (Dolby Atmos)', total_seats: 56, created_at: new Date().toISOString() },
    { id: 3, theatre_id: 2, screen_name: 'Screen 1 (Laser 3D)', total_seats: 56, created_at: new Date().toISOString() },
    { id: 4, theatre_id: 3, screen_name: 'Screen 1 (VIP Luxe)', total_seats: 56, created_at: new Date().toISOString() }
  ],
  seats: [],
  shows: [
    { id: 1, movie_id: 1, theatre_id: 1, screen_id: 1, show_date: '2026-09-26', show_time: '10:00 AM', ticket_price: 220.00, status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 2, movie_id: 1, theatre_id: 1, screen_id: 1, show_date: '2026-09-26', show_time: '01:30 PM', ticket_price: 180.00, status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 3, movie_id: 1, theatre_id: 1, screen_id: 1, show_date: '2026-09-26', show_time: '07:30 PM', ticket_price: 250.00, status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 4, movie_id: 2, theatre_id: 2, screen_id: 3, show_date: '2026-09-26', show_time: '04:30 PM', ticket_price: 190.00, status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 5, movie_id: 4, theatre_id: 1, screen_id: 2, show_date: '2026-09-26', show_time: '06:45 PM', ticket_price: 200.00, status: 'ACTIVE', created_at: new Date().toISOString() },
    { id: 6, movie_id: 5, theatre_id: 3, screen_id: 4, show_date: '2026-09-26', show_time: '10:00 PM', ticket_price: 240.00, status: 'ACTIVE', created_at: new Date().toISOString() }
  ],
  bookings: [
    {
      id: 1,
      user_id: 2,
      show_id: 3,
      booking_code: 'MB-782914',
      total_amount: 530.00,
      booking_status: 'CONFIRMED',
      payment_status: 'SUCCESS',
      booked_at: new Date().toISOString()
    }
  ],
  booking_seats: [
    { id: 1, booking_id: 1, seat_id: 15, price: 250.00 },
    { id: 2, booking_id: 1, seat_id: 16, price: 250.00 }
  ],
  payments: [
    {
      id: 1,
      booking_id: 1,
      payment_method: 'UPI',
      transaction_id: 'TXN_98712365412',
      amount: 530.00,
      payment_status: 'SUCCESS',
      paid_at: new Date().toISOString()
    }
  ]
};

// Generate standard seat grid (Rows A-G, Columns 1-8 => 56 seats per screen)
function generateSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  let seatId = 1;
  for (let screenId = 1; screenId <= 4; screenId++) {
    for (let rIndex = 0; rIndex < rows.length; rIndex++) {
      const rowName = rows[rIndex];
      const seatType = rIndex >= 5 ? 'VIP' : rIndex >= 3 ? 'PREMIUM' : 'STANDARD';
      const basePrice = seatType === 'VIP' ? 250 : seatType === 'PREMIUM' ? 200 : 150;
      
      for (let col = 1; col <= 8; col++) {
        defaultData.seats.push({
          id: seatId++,
          screen_id: screenId,
          seat_number: `${rowName}${col}`,
          row_name: rowName,
          seat_type: seatType,
          price: basePrice
        });
      }
    }
  }
}

async function initDB() {
  // Hash default passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('user123', 10);
  defaultData.users[0].password = adminHash;
  defaultData.users[1].password = userHash;
  generateSeats();

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'movie_ticket_booking';
  const dbPort = process.env.DB_PORT || 3306;

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();

    pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    if (rows) {
      isUsingMySQL = true;
      console.log('✅ Connected to MySQL Database successfully!');
      await setupMySQLSchemaAndSeed();
    }
  } catch (err) {
    console.log('ℹ️ MySQL not available or connection refused. Operating in Portable High-Performance Memory/JSON Mode.');
    isUsingMySQL = false;
  }
}

async function setupMySQLSchemaAndSeed() {
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
      for (const stmt of statements) {
        try {
          await pool.query(stmt);
        } catch (e) {
          // ignore table creation warnings
        }
      }
      
      // Check if movies seeded
      const [movies] = await pool.query('SELECT count(*) as count FROM movies');
      if (movies[0].count === 0) {
        console.log('Seeding initial data into MySQL...');
        for (const user of defaultData.users) {
          await pool.query(
            'INSERT INTO users (id, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
            [user.id, user.name, user.email, user.phone, user.password, user.role]
          );
        }
        for (const movie of defaultData.movies) {
          await pool.query(
            'INSERT INTO movies (id, title, description, genre, language, duration, release_date, poster, banner, trailer_url, director, cast, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [movie.id, movie.title, movie.description, movie.genre, movie.language, movie.duration, movie.release_date, movie.poster, movie.banner, movie.trailer_url, movie.director, movie.cast, movie.rating, movie.status]
          );
        }
        for (const t of defaultData.theatres) {
          await pool.query('INSERT INTO theatres (id, name, location, address, city) VALUES (?, ?, ?, ?, ?)', [t.id, t.name, t.location, t.address, t.city]);
        }
        for (const s of defaultData.screens) {
          await pool.query('INSERT INTO screens (id, theatre_id, screen_name, total_seats) VALUES (?, ?, ?, ?)', [s.id, s.theatre_id, s.screen_name, s.total_seats]);
        }
        for (const seat of defaultData.seats) {
          await pool.query('INSERT INTO seats (id, screen_id, seat_number, row_name, seat_type, price) VALUES (?, ?, ?, ?, ?, ?)', [seat.id, seat.screen_id, seat.seat_number, seat.row_name, seat.seat_type, seat.price]);
        }
        for (const sh of defaultData.shows) {
          await pool.query('INSERT INTO shows (id, movie_id, theatre_id, screen_id, show_date, show_time, ticket_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [sh.id, sh.movie_id, sh.theatre_id, sh.screen_id, sh.show_date, sh.show_time, sh.ticket_price, sh.status]);
        }
        for (const b of defaultData.bookings) {
          await pool.query('INSERT INTO bookings (id, user_id, show_id, booking_code, total_amount, booking_status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)', [b.id, b.user_id, b.show_id, b.booking_code, b.total_amount, b.booking_status, b.payment_status]);
        }
        for (const bs of defaultData.booking_seats) {
          await pool.query('INSERT INTO booking_seats (id, booking_id, seat_id, price) VALUES (?, ?, ?, ?)', [bs.id, bs.booking_id, bs.seat_id, bs.price]);
        }
        for (const p of defaultData.payments) {
          await pool.query('INSERT INTO payments (id, booking_id, payment_method, transaction_id, amount, payment_status) VALUES (?, ?, ?, ?, ?, ?)', [p.id, p.booking_id, p.payment_method, p.transaction_id, p.amount, p.payment_status]);
        }
        console.log('✅ Seed data successfully inserted into MySQL.');
      }
    }
  } catch (err) {
    console.error('Error in setupMySQLSchemaAndSeed:', err);
  }
}

// Memory DB Helper
const memoryDb = {
  data: defaultData,
  getNextId(tableName) {
    const list = this.data[tableName] || [];
    return list.length > 0 ? Math.max(...list.map(item => Number(item.id))) + 1 : 1;
  }
};

initDB();

module.exports = {
  get isMySQL() { return isUsingMySQL; },
  get pool() { return pool; },
  memoryDb,
  query: async (sql, params = []) => {
    if (isUsingMySQL && pool) {
      const [rows] = await pool.query(sql, params);
      return rows;
    }
    return null; // Controller will fall back to memoryDb if returns null
  }
};
