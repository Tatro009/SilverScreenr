const User = require("./User");
const Movie = require("./Movie");

// TODO: USER has many Movie

User.hasMany(Movie, {
  foreignKey: "user_id",
});

// // TODO: Movie has one User
Movie.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { User, Movie };
