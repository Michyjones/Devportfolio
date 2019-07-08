const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');
const User = require('../../model/User');
const config = require('config');

router.get('/',auth, async(req, res) =>{

try{
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

}catch(err){
    console.error(err.message);
    res.status(500).send('Internal server error');

}
});


router.post(
    '/',
    [
      check('email', 'Enter a valid email address').isEmail(),
      check('password', 'Password must have atleast 8 characters').exists()
      
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid credentials' }] });
        }
       
  
      const match = await bycrypt.compare(password, user.password);

      if(!match){
        return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
  
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
  
      } catch (err) {
        console.log(err.message);
        res.status(500).send('InternalServer Error');
      }
    }
  );
module.exports = router;
