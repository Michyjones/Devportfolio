const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../model/User');
const config = require('config');

router.post(
  '/',
  [
    check('name', 'Enter a valid name')
      .not()
      .isEmpty(),
    check('email', 'Enter a valid email address').isEmail(),
    check('password', 'Password must have atleast 8 characters').isLength({
      min: 8
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(409)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      user = new User({
        name,
        email,
        password,
        avatar
      });

      const salt = await bycrypt.genSalt(10);
      user.password = await bycrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(payload, config.get('secretKey'),
    {expiresIn:360000}, (error, token) => {
      if(error) throw error;
      res.send({token});
    });

      // res.send('User Registed Successfully');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('InternalServer Error');
    }
  }
);

module.exports = router;
