const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require('./auth-middleware');

router.post(
  '/register',
  checkPasswordLength,
  checkUsernameFree,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 8);
      const newUser = { username, password: hash };
      const createdUser = await User.add(newUser);
      res.json(createdUser);
    } catch (err) {
      next(err);
    }
  }
);

// router.post(
//   '/register',
//   checkPasswordLength,
//   checkUsernameFree,
//   (req, res, next) => {
//     const { username, password } = req.body;
//     const hash = bcrypt.hashSync(password, 8);
//     User.add({ username, password: hash })
//       .then((createdUser) => {
//         res.status(201).json(createdUser);
//       })
//       .catch(next);
//   }
// );

// router.post('/login', async (req, res, next) => {
//   try {
//     const { username, password } = req.body;
//     const [user] = await User.findBy({ username });
//     if (user && bcrypt.compareSync(password, user.password)) {
//       req.session.user = user;
//       res.json(`Welcome ${user.username}!`);
//     } else {
//       next({ status: 401, message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    // make it so the cookie is set on the client
    // make it so server stores a session with a session id
    req.session.user = req.user;
    res.json({ message: `Welcome ${req.user.username}!` });
  } else {
    next({ status: 401, message: 'Invalid credentials' });
  }
});

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.json({ message: 'logged out' });
      }
    });
  } else {
    res.json({ message: 'no session' });
  }
});

// router.get('/logout', async (req, res, next) => {
//   if (req.session.user) {
//     req.session.destroy((err) => {
//       if (err) res.json({ message: 'no session' });
//       else res.json({ message: 'logged out' });
//     });
//   } else {
//     res.json({ message: 'no session' });
//   }
// });

module.exports = router;

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

// Don't forget to add the router to the `exports` object so it can be required in other modules
