const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const shortid = require('shortid');
// Load input validation
const validateRegisterInput = require("../../models/validation/register");
const validateLoginInput = require("../../models/validation/login");
// Load User model
const User = require("../../models/User");
const Post =require("../../models/post")
const gravatar = require('gravatar');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } 
      var id=shortid.generate();
      var avatar = gravatar.url('req.body.name', {s: '200', r: 'pg', d: '404'});
  const newUser = new User({
          id,
          name: req.body.name,
          email:req.body.email,
          password: req.body.password,
          title:req.body. title,
          firstName:req.body.firstName ,
          lastName:req.body. lastName ,
          userLevel:req.body.userLevel ,
          avatar,
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      });
    });

    // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const email = req.body.email;
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token:  token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  router.post("/post/:id/:postID", (req, res) => {
    var token = req.headers['x-access-token'];
   
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, keys.secretOrKey, function(err, decoded) {
      if (err){
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // if everything good, save to request for use in other routes
      req.userId = decoded.id;
      }
      else{
        console.log("success");
        const newPost = new Post({
         
          title: req.body.title,
          content: req.body.content,
          postID:req.body. postID,
          categoryID:req.body.categoryID,
          remarks:req.body. remarks,
         
         
        });
        newPost
              .save()
              .then(post => res.json(post))
              .catch(err => console.log(err));
      }
    });
  } );

  router.post("/getuser", (req, res) => {

  const email = req.body.email;
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  
        
          const payload = {
            id: user.id,
            name: user.name,
            firstname:user.firstName,
            lastname:user.lastName,
          };
  
          res.json({
            success: true,
           payload: payload
          });
      
    });
  });
  router.get('/getuserdata/:id', function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        res.json({ message: 'User Found', user: user });
      }
    });
  });

  module.exports = router;
 