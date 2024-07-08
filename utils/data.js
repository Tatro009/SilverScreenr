const { Movie, User } = require("../models/");

const getUserMovies = async (user) => {
  try {
    const userMovies = await Movie.findAll({
      where: {
        user_id: user,
      },
    });

    const allUserMovies = userMovies.map((movie) => movie.get({ plain: true }));

    return allUserMovies;
  } catch (err) {
    return err;
  }
};

exports.getUserMovies = getUserMovies;
