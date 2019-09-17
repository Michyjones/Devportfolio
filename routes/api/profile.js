const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../model/Profile');
const User = require('../../model/User');
const auth = require('../../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'No user with that profile' });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('InternalServer Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skill is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

    // const = {
        

    // }
  }
);

module.exports = router;
