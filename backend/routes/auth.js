const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator'); 
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middleware/fetchuser');
const JWT_SECRET= 'puruisagoodboy';

// Route:1 create-user using:post"/api/auth/createuser".No login required
router.post('/createuser',[
    body('name',"enter a valid name").isLength({min:3}),
    body('email',"enter a valid email").isEmail(),
    body('password',"enter a password of atleast 5 characters").isLength({ min: 5 }),
], async(req,res)=>{
    let success=false;
    // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success,errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    success=true;
    res.json({ success,authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
// Route:2 Authenticate a user using:post"/api/auth/createuser".No login required
router.post('/login',[
    body('email',"enter a valid email").isEmail(),
    body('password',"password cannot be blank").exists(),
], async(req,res)=>{
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please enter the right credentials"});
        }
        // now comparing the password
        const passwordcompare=await bcrypt.compare(password,user.password);//password->indicates the password enter by the user,user.pass=> indicates the password avaliable in the databse
        if(!passwordcompare){
            success=false
            return res.status(400).json({ error:"Please enter the right credentials"});

        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken}); 
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
    })

    // Route:3 Get loggedin user details using:post"/api/auth/createuser". login required
    router.post('/getuser',fetchuser, async(req,res)=>{

    try{
         userId=req.user.id;
        const user=await User.findById(userId).select("-password")
        res.send(user);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server occured");
    }
})


module.exports=router