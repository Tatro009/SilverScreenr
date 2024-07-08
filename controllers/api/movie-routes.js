const router = require("express").Router();
const { Movie, User } = require("../../models");
const axios = require("axios");

const express = require("express");
const { authCheck } = require("../../utils/auth");

const apiKey = process.env.API_KEY || API_KEY;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

//find all
router.get("/", async (req, res) => {
  try {
    const publicMovies = await Movie.findAll({
      where: {
        is_public: true,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    // console.log(publicMovies);

    const allPublicMovies = publicMovies.map((movie) =>
      movie.get({ plain: true })
    );

    // console.log(allPublicMovies);
    res.status(200).json(allPublicMovies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//TODO: Add movie to watchlist - auth required
// example JSON format for req object
//{
//  tmdb_id: INTEGER,
//  user_id: INTEGER,
// }

router.post("/", async (req, res) => {
  try {
    const matchCheck = await Movie.findAndCountAll({
      where: { tmdb_id: req.body.tmdb_id, user_id: req.body.user_id },
    });
    console.log(matchCheck);
    if (matchCheck.count > 0) {
      res.status(400).json("Movie Already Exists");
      return;
    }

    const publicSettingData = await User.findByPk(req.body.user_id, {
      attributes: ["default_public"],
    });
    const publicSetting = publicSettingData.get({ plain: true });
    console.log(publicSetting);

    //   TODO: create API call that uses tmdb_id to pull an object for the movie
    const movieByIDUrl = "/movie/" + req.body.tmdb_id;
    const fullURL = tmdbBaseUrl + movieByIDUrl + "?api_key=" + apiKey;
    let movieData = [];
    const movieAPIdata = await fetch(fullURL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        movieData = data;
      });
    const movieDataString = JSON.stringify(movieData);

    console.log(movieData);

    const newMovie = {
      movie_data: movieDataString,
      tmdb_id: req.body.tmdb_id,
      user_id: req.body.user_id,
      is_public: publicSetting.default_public,
    };
    await Movie.create(newMovie);

    res.status(200).json(newMovie);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post(":id/:userId", async (req, res) => {
  try {
    const matchCheck = await Movie.findAndCountAll({
      where: { tmdb_id: req.params.id, user_id: req.params.userId },
    });
    console.log(matchCheck);
    if (matchCheck.count > 0) {
      res.status(400).json("Movie Already Exists");
      return;
    }

    const publicSettingData = await User.findByPk(req.body.user_id, {
      attributes: ["default_public"],
    });
    const publicSetting = publicSettingData.get({ plain: true });
    console.log(publicSetting);

    //   TODO: create API call that uses tmdb_id to pull an object for the movie
    const movieByIDUrl = "/movie/" + req.body.tmdb_id;
    const fullURL = tmdbBaseUrl + movieByIDUrl + "?api_key=" + apiKey;
    let movieData = [];
    const movieAPIdata = await fetch(fullURL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        movieData = data;
      });
    const movieDataString = JSON.stringify(movieData);

    console.log(movieData);

    const newMovie = {
      movie_data: movieDataString,
      tmdb_id: req.body.tmdb_id,
      user_id: req.body.user_id,
      is_public: publicSetting.default_public,
    };
    await Movie.create(newMovie);

    res.status(200).json(newMovie);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//TODO: add rating and review to movie - auth required
//TODO: update rating/movie - auth required
//TODO: mark public/not public - auth required

//All of these can be one route, only include the parameters that need to be updated in the req.body
//
//Example of update with ALL params
//{
//  user_rating: INTEGER,
//  user_comment: TEXT,
//  is_public: BOOLEAN
// }
router.put("/:id", async (req, res) => {
  try {
    const updateMovie = await Movie.findByPk(req.params.id);

    if (req.body.user_rating) {
      updateMovie.user_rating = req.body.user_rating;
    }
    if (req.body.user_comment) {
      updateMovie.user_comment = req.body.user_comment;
    }
    if (req.body.is_public === true || req.body.is_public === false) {
      updateMovie.is_public - req.body.is_public;
    }

    await updateMovie.save();
    res.status(200).json(updateMovie);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//TODO: remove review/rating from movie (leave on watchlist) - auth required
router.put("/unwatch/:id", async (req, res) => {
  try {
    const updateMovie = await Movie.findByPk(req.params.id);
    updateMovie.user_rating = null;
    updateMovie.user_comment = null;

    await updateMovie.save();
    res.status(200).json(updateMovie);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

//TODO: remove/delete movie from watchlist - auth required

router.delete("/unwatch/:id", async (req, res) => {
  Movie.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((movieDeleted) => {
      // returns true or false
      res.status(200).json(movieDeleted);
    })
    .catch((err) => res.json(err));
});

//New route for searching movies

module.exports = router;
