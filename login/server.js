const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://Saurabh:Saurabh@cluster0.vjeddwd.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect email' });
        if (!user.validatePassword(password))
          return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email });
  user.setPassword(password);
  user.save((err) => {
    if (err) return res.status(500).json({ message: 'Error saving user' });
    res.redirect('/');
  });
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
  })
);

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to the dashboard!');
  } else {
    res.redirect('/');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
