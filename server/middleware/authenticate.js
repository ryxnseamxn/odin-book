const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const dataSource = require("../db/dataSource");
const User = require("../db/entities/User");


const setupAuth = (app) => {
  
  app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      sameSite: "lax"
    }
  }));
  
  
  app.use(passport.initialize());
  app.use(passport.session());

  const userRepository = dataSource.getRepository(User);

  
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        
        const user = await userRepository.findOne({
          where: {
            username: username,
          }
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userRepository.findOne({
        where: { id: id }
      });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};


const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};


module.exports = {
  setupAuth,
  isAuthenticated,
  authenticate: passport.authenticate('local')
};