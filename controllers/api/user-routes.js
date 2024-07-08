const router = require("express").Router();
const { Movie, User } = require("../../models");

const express = require("express");
const { authCheck } = require("../../utils/auth");

router.get(
  "/:id",
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

      console.log(allUserMovies);
      res.status(200).json(allUserMovies);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

//TODO: UPDATE user pref (public/private, update all movies) - auth required

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userData = dbUserData;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password. Please try again!" });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password. Please try again!" });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userData = dbUserData;
      res
        .status(200)
        .json({ user: dbUserData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
