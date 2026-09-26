const db = require('../config/db');

exports.getAllMovies = async (req, res) => {
  try {
    const { status, genre, language, search } = req.query;

    if (db.isMySQL && db.pool) {
      let query = 'SELECT * FROM movies WHERE 1=1';
      const params = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (genre) {
        query += ' AND genre LIKE ?';
        params.push(`%${genre}%`);
      }
      if (language) {
        query += ' AND language = ?';
        params.push(language);
      }
      if (search) {
        query += ' AND (title LIKE ? OR cast LIKE ? OR director LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      query += ' ORDER BY id DESC';
      const [movies] = await db.pool.query(query, params);
      return res.json({ success: true, count: movies.length, movies });
    } else {
      let movies = [...db.memoryDb.data.movies];
      if (status) {
        movies = movies.filter(m => m.status === status);
      }
      if (genre) {
        movies = movies.filter(m => m.genre.toLowerCase().includes(genre.toLowerCase()));
      }
      if (language) {
        movies = movies.filter(m => m.language.toLowerCase() === language.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        movies = movies.filter(m => 
          m.title.toLowerCase().includes(q) || 
          m.cast.toLowerCase().includes(q) || 
          m.director.toLowerCase().includes(q)
        );
      }

      movies.sort((a, b) => b.id - a.id);
      return res.json({ success: true, count: movies.length, movies });
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve movies.' });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      const [movies] = await db.pool.query('SELECT * FROM movies WHERE id = ?', [movieId]);
      if (movies.length === 0) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.json({ success: true, movie: movies[0] });
    } else {
      const movie = db.memoryDb.data.movies.find(m => m.id === movieId);
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      return res.json({ success: true, movie });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving movie details.' });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const { title, description, genre, language, duration, release_date, poster, banner, trailer_url, director, cast, rating, status } = req.body;

    if (!title || !description || !genre || !language || !duration || !release_date) {
      return res.status(400).json({ success: false, message: 'Missing required movie fields.' });
    }

    const posterUrl = req.file ? `/uploads/${req.file.filename}` : (poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop');

    if (db.isMySQL && db.pool) {
      const [result] = await db.pool.query(
        `INSERT INTO movies (title, description, genre, language, duration, release_date, poster, banner, trailer_url, director, cast, rating, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, genre, language, Number(duration), release_date, posterUrl, banner || posterUrl, trailer_url || '', director || '', cast || '', Number(rating || 8.0), status || 'NOW_SHOWING']
      );
      
      const newId = result.insertId;
      return res.status(201).json({ success: true, message: 'Movie added successfully!', movieId: newId });
    } else {
      const newId = db.memoryDb.getNextId('movies');
      const newMovie = {
        id: newId,
        title,
        description,
        genre,
        language,
        duration: Number(duration),
        release_date,
        poster: posterUrl,
        banner: banner || posterUrl,
        trailer_url: trailer_url || '',
        director: director || '',
        cast: cast || '',
        rating: Number(rating || 8.0),
        status: status || 'NOW_SHOWING',
        created_at: new Date().toISOString()
      };

      db.memoryDb.data.movies.push(newMovie);
      return res.status(201).json({ success: true, message: 'Movie added successfully!', movie: newMovie });
    }
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ success: false, message: 'Failed to create movie.' });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieId = Number(req.params.id);
    const { title, description, genre, language, duration, release_date, poster, banner, trailer_url, director, cast, rating, status } = req.body;

    const posterUrl = req.file ? `/uploads/${req.file.filename}` : poster;

    if (db.isMySQL && db.pool) {
      await db.pool.query(
        `UPDATE movies SET title=?, description=?, genre=?, language=?, duration=?, release_date=?, 
         poster=COALESCE(?, poster), banner=COALESCE(?, banner), trailer_url=?, director=?, cast=?, rating=?, status=?
         WHERE id=?`,
        [title, description, genre, language, Number(duration), release_date, posterUrl, banner, trailer_url, director, cast, Number(rating), status, movieId]
      );
      return res.json({ success: true, message: 'Movie updated successfully!' });
    } else {
      const idx = db.memoryDb.data.movies.findIndex(m => m.id === movieId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }

      const existing = db.memoryDb.data.movies[idx];
      db.memoryDb.data.movies[idx] = {
        ...existing,
        title: title || existing.title,
        description: description || existing.description,
        genre: genre || existing.genre,
        language: language || existing.language,
        duration: duration ? Number(duration) : existing.duration,
        release_date: release_date || existing.release_date,
        poster: posterUrl || existing.poster,
        banner: banner || existing.banner,
        trailer_url: trailer_url !== undefined ? trailer_url : existing.trailer_url,
        director: director || existing.director,
        cast: cast || existing.cast,
        rating: rating ? Number(rating) : existing.rating,
        status: status || existing.status
      };

      return res.json({ success: true, message: 'Movie updated successfully!', movie: db.memoryDb.data.movies[idx] });
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ success: false, message: 'Failed to update movie.' });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = Number(req.params.id);

    if (db.isMySQL && db.pool) {
      await db.pool.query('DELETE FROM movies WHERE id = ?', [movieId]);
      return res.json({ success: true, message: 'Movie deleted successfully.' });
    } else {
      const idx = db.memoryDb.data.movies.findIndex(m => m.id === movieId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Movie not found.' });
      }
      db.memoryDb.data.movies.splice(idx, 1);
      return res.json({ success: true, message: 'Movie deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete movie.' });
  }
};
