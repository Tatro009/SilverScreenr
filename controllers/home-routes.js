const router = require("express").Router();
const { Movie, User } = require("../models");

const express = require("express");
const { authCheck } = require("../utils/auth");
const { getUserMovies } = require("../utils/data");
const tmdbBaseUrl = "https://api.themoviedb.org/3";

const axios = require("axios");
const apiKey = process.env.API_KEY;

//route to homepage
router.get("/", async (req, res) => {
  let userRatings = [];
  // render in handlebars;
  const getRatings = async (user) => {
    try {
      const userMovies = await Movie.findAll({
        where: {
          user_id: user,
        },
      });

      const allUserMovies = userMovies.map((movie) =>
        movie.get({ plain: true })
      );

      return allUserMovies;
    } catch (err) {
      return err;
    }
  };
  if (req.session.loggedIn) {
    userRatings = await getRatings(req.session.userData.id);
  }
  // console.log(userRatings);
  if (userRatings.length) {
    userRatings.forEach((el) => {
      el.movie_data = JSON.parse(el.movie_data);
    });
  }

  // console.log("user data", req.session.userData);
  // console.log("user ratings", userRatings);
  res.render("homepage", {
    userRatings,
    user: req.session.userData,
    loggedIn: req.session.loggedIn,
  });
});

// public page with all public movies
router.get("/public", async (req, res) => {
  try {
    const response = await axios.get("${tmdbBaseUrl}/movie/popular", {
      params: {
        api_key: apiKey,
      },
    });

    const tmdbMovies = response.data.results;
    res.render("homepage", {
      tmdbMovies,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/public", async (req, res) => {
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

    console.log(publicMovies);

    const allPublicMovies = publicMovies.map((movie) =>
      movie.get({ plain: true })
    );

    //render in handlebars
    // res.render("homepage", {
    //   allPublicMovies,
    //   loggedIn: req.session.loggedIn,
    // });

    //comment this out if rendering in handlebars
    console.log(allPublicMovies);
    res.status(200).json(allPublicMovies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//route to get all movies from a single user. authCheck should be used,
router.get(
  "/user/:id",
  // authCheck, //turned off for testing
  async (req, res) => {
    try {
      const userMovies = await Movie.findAll({
        where: {
          user_id: req.params.id,
        },
      });

      const allUserMovies = userMovies.map((movie) =>
        movie.get({ plain: true })
      );

      // render in handlebars;
      res.render("homepage", {
        allUserMovies,
        loggedIn: req.session.loggedIn,
      });

      //comment this out if rendering in handlebars
      // console.log(allUserMovies);
      // res.status(200).json(allUserMovies);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

//TODO: Login
router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

//TODO: Sign Up  Page
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("signup"); // Added "signup" - Chris R
    return;
  }

  res.render("signup");
});

// router.use((req, res) => {
//   res.render("errorpage", {
//     loggedIn: req.session.loggedIn,
//   });
// });

//TODO: User Preferences  - auth required

//TODO: routes for sorted movie data? added on date, watched/reviewed date

//route for search

router.get("/search/:query", async (req, res) => {
  let searchResults = {};
  try {
    const apiKey = process.env.API_READ_ACCESS_TOKEN || API_READ_ACCESS_TOKEN;
    const query = req.params.query;

    await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        searchResults = data.results;
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

  console.log(req.session.loggedIn);
  res.render("searchpage", {
    searchResults,

    loggedIn: req.session.loggedIn,
  });
});

router.get("/add/:id", authCheck, async (req, res) => {
  const userID = req.session.userData.id;
  const tmdbID = req.params.id;
  try {
    const matchCheck = await Movie.findAndCountAll({
      where: { tmdb_id: tmdbID, user_id: userID },
    });
    console.log(matchCheck);
    if (matchCheck.count > 0) {
      res.status(400).json("Movie Already Exists");
      return;
    }

    const publicSettingData = await User.findByPk(userID, {
      attributes: ["default_public"],
    });
    const publicSetting = publicSettingData.get({ plain: true });
    console.log(publicSetting);

    //   TODO: create API call that uses tmdb_id to pull an object for the movie
    const movieByIDUrl = "/movie/" + tmdbID;
    const fullURL = tmdbBaseUrl + movieByIDUrl + "?api_key=" + apiKey;
    let movieData = [];
    await fetch(fullURL, {
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
      tmdb_id: tmdbID,
      user_id: userID,
      is_public: publicSetting.default_public,
    };
    console.log(newMovie);
    await Movie.create(newMovie);

    res.status(200).redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
