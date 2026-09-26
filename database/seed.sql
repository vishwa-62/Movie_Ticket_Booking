-- Seed Data for Movie Ticket Booking Application
USE movie_ticket_booking;

-- Passwords hashed with bcrypt for demo (Password: 'admin123' and 'user123')
-- admin123 -> $2a$10$wTzZJzYJ5PZ5V5Z5V5Z5VuZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z (or generated at app startup if needed)
-- We will seed users:

INSERT INTO users (id, name, email, phone, password, role) VALUES
(1, 'Admin System', 'admin@cinepass.com', '9876543210', '$2a$10$X8m1D5gZgO19tM2F.1234.W1p3K5zN7e9X1m3K5zN7e9X1m3K5zN7e', 'ADMIN'),
(2, 'Alex Morgan', 'user@cinepass.com', '9876543211', '$2a$10$X8m1D5gZgO19tM2F.1234.W1p3K5zN7e9X1m3K5zN7e9X1m3K5zN7e', 'CUSTOMER');

-- Movies
INSERT INTO movies (id, title, description, genre, language, duration, release_date, poster, banner, trailer_url, director, cast, rating, status) VALUES
(1, 'Avengers: Endgame', 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance.', 'Action/Sci-Fi', 'English', 181, '2026-04-26', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson', 9.2, 'NOW_SHOWING'),

(2, 'Interstellar', 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.', 'Sci-Fi/Drama', 'English', 169, '2026-11-07', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'Christopher Nolan', 'Matthew McConaughey, Anne Hathaway, Jessica Chastain', 9.5, 'NOW_SHOWING'),

(3, 'Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'Action/Sci-Fi', 'English', 148, '2026-07-16', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'Christopher Nolan', 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page', 9.0, 'NOW_SHOWING'),

(4, 'Leo', 'Parthi, a mild-mannered cafe owner in Himachal Pradesh, gets drawn into a bloodbath when violent gangsters mistake him for a ruthless drug lord from their past.', 'Action/Thriller', 'Tamil', 164, '2026-10-19', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=Po3jStA673E', 'Lokesh Kanagaraj', 'Vijay, Sanjay Dutt, Trisha Krishnan, Arjun Sarja', 8.8, 'NOW_SHOWING'),

(5, 'Vikram', 'A high-octane action thriller where a special agent investigates a murder committed by a masked group of serial killers, unraveling a deep narcotics syndicate.', 'Action/Crime', 'Tamil', 175, '2026-06-03', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=OKBMCL-frPU', 'Lokesh Kanagaraj', 'Kamal Haasan, Vijay Sethupathi, Fahadh Faasil', 8.9, 'NOW_SHOWING'),

(6, 'Jailer', 'Muthuvel Pandian, a retired prison warden, goes on a crusade to rescue his police officer son from a ruthless gang involved in smuggling stolen temple idols.', 'Action/Comedy', 'Tamil', 168, '2026-08-10', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=xenOE1Tma0A', 'Nelson Dilipkumar', 'Rajinikanth, Mohanlal, Shiva Rajkumar, Jackie Shroff', 8.7, 'NOW_SHOWING'),

(7, 'Dragon', 'An upcoming epic action spectacle featuring breathtaking visual effects, intense combat sequences, and a gripping storyline set in an ancient fantastical realm.', 'Fantasy/Action', 'Tamil', 155, '2026-12-15', 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'Ashwath Marimuthu', 'Pradeep Ranganathan, Anupama Parameswaran', 8.5, 'COMING_SOON'),

(8, 'Coolie', 'An upcoming action thriller drama centered around gold smuggling, harbor operations, and high-stakes criminal warfare.', 'Action/Drama', 'Tamil', 160, '2026-11-20', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', 'https://www.youtube.com/watch?v=Po3jStA673E', 'Lokesh Kanagaraj', 'Rajinikanth, Nagarjuna, Soubin Shahir', 9.1, 'COMING_SOON');

-- Theatres
INSERT INTO theatres (id, name, location, address, city) VALUES
(1, 'PVR Cinemas - Brookefields', 'Brookefields Mall', 'Krishnaswamy Road, RS Puram', 'Coimbatore'),
(2, 'INOX - Prozone Mall', 'Prozone Mall', 'Sathy Road, Saravanampatti', 'Coimbatore'),
(3, 'Cinepolis - Fun Republic', 'Fun Republic Mall', 'Avinashi Road, Peelamedu', 'Coimbatore');

-- Screens
INSERT INTO screens (id, theatre_id, screen_name, total_seats) VALUES
(1, 1, 'Screen 1 (IMAX 4K)', 56),
(2, 1, 'Screen 2 (Dolby Atmos)', 56),
(3, 2, 'Screen 1 (Laser 3D)', 56),
(4, 3, 'Screen 1 (VIP Luxe)', 56);

-- Shows
INSERT INTO shows (id, movie_id, theatre_id, screen_id, show_date, show_time, ticket_price, status) VALUES
(1, 1, 1, 1, '2026-09-26', '10:00 AM', 220.00, 'ACTIVE'),
(2, 1, 1, 1, '01:30 PM', '180.00', 180.00, 'ACTIVE'),
(3, 1, 1, 1, '2026-09-26', '07:30 PM', 250.00, 'ACTIVE'),
(4, 2, 2, 3, '2026-09-26', '04:30 PM', 190.00, 'ACTIVE'),
(5, 4, 1, 2, '2026-09-26', '06:45 PM', 200.00, 'ACTIVE'),
(6, 5, 3, 4, '2026-09-26', '10:00 PM', 240.00, 'ACTIVE');

-- Bookings
INSERT INTO bookings (id, user_id, show_id, booking_code, total_amount, booking_status, payment_status, booked_at) VALUES
(1, 2, 3, 'MB-782914', 530.00, 'CONFIRMED', 'SUCCESS', CURRENT_TIMESTAMP);

-- Booking Seats
INSERT INTO booking_seats (id, booking_id, seat_id, price) VALUES
(1, 1, 15, 250.00),
(2, 1, 16, 250.00);

-- Payments
INSERT INTO payments (id, booking_id, payment_method, transaction_id, amount, payment_status) VALUES
(1, 1, 'UPI', 'TXN_98712365412', 530.00, 'SUCCESS');
