const { ObjectId } = require('mongodb');

// We’ll pass `connection.db` from server.js to each controller function
// ✅ GET movies with multi-field sorting, pagination, and search
exports.getMovies = async (req, res, db) => {
  try {
    const collection = db.collection('movies');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'title';
    const sortOrder = req.query.sortOrder || 'asc';

    const sortFields = sortBy.split(',');
    const sortDirections = sortOrder.split(',');
    const sort = {};

    sortFields.forEach((field, idx) => {
      const direction = sortDirections[idx] || 'asc';
      sort[field] = direction.toLowerCase() === 'desc' ? -1 : 1;
    });

    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};

    const totalMovies = await collection.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    const movies = await collection
      .aggregate([
        { $match: query },
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ], { allowDiskUse: true })
      .toArray();

    res.json({ movies, totalPages });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

// ✅ GET movie by ID
exports.getMovieById = async (req, res, db) => {
  try {
    const movieId = req.params.id;
    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
};

// ✅ UPDATE movie by ID
exports.updateMovie = async (req, res, db) => {
  try {
    const movieId = req.params.id;
    const updateData = req.body;

    if (!ObjectId.isValid(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const result = await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
};
