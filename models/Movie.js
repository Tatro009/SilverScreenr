const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Movie extends Model {}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      set: function (value) {
        if (value === "true") value = true;
        if (value === "false") value = false;
        this.setDataValue("is_public", value);
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "movie",
  }
);

module.exports = Movie;
