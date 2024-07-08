//this will seed the postgres data - make sure you have a POSTGRES_DB variable in your .env file. only run this manually.

require("dotenv").config();

const Sequelize = require("sequelize");
require("dotenv").config();
sequelize = process.env.POSTGRES_DB ? new Sequelize(process.env.POSTGRES_DB) : 
  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, 
    { host: "localhost", dialect: "mysql", port: 3306});

const { User, Movie } = require("../models");

const userData = require("./userData.json");
const movieData = require("./movieData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Movie.bulkCreate(movieData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
