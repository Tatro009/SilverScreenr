const Sequelize = require("sequelize");
require("dotenv").config();
let sequelize;
//POSTGRES_DB will only be included in render
//Create the Postgres Instance: in Render, reveal/copy the "External Database URL"
//Add "?ssl=true" to  end of  "External Database URL"
//Add to Environment in Render POSTGRES_DB = "External Database URL"

if (process.env.POSTGRES_DB) {
  sequelize = new Sequelize(process.env.POSTGRES_DB);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "mysql",
      port: 3306,
    }
  );
}

module.exports = sequelize;
