const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
router.post("/register",async (req,res)=>{

    try{
        // create the encrypted password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        //create the new User
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })
        // save user and return the response 
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).send(err);
    }

});

router.post("/login",async (req,res)=>{
      try{
         const resgisteredusr = await User.findOne({email:req.body.email})
         !resgisteredusr && res.status(404).json("User not found");

         const validPassword = await bcrypt.compare(req.body.password,resgisteredusr.password);
         !validPassword && res.status(400).json("Wrong Password");

         res.status(200).json(resgisteredusr);
      }catch(err){
          res.status(500).send(err);
      }
})
module.exports = router;