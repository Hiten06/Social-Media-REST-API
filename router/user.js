

const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update the user

router.put("/:id", async(req,res)=>{
    if(req.body.userid === req.params.id || req.body.isAdmin ){
        if(req.body.password){
            try{
                const salt= await bcrypt.genSalt(10);
                req.body.password= await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                return res .status(500).json(err);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("Accnt has been updated");
        }
        catch(err){
            return res.status(403).json(err);
        }
    }
    else{
        return res.status(403).json("u can update one accnt");
    }
});
//delete the user

router.delete("/:id",async (req,res)=>{
    if(req.body.userid === req.params.id || req.body.isAdmin){

        try{
               const user = await User.findByIdAndDelete(req.params.id);
               return res.status(200).json("accnt with specified user has been deleted");
        }catch(err){
            return res.status(500).json(err);
        }
    }
    else{
        return res.status(403).json("U have deleted ur accnt successfully");
    }
});

//get a user
router.get("/:id", async (req,res)=>{

        try{
                const user = await User.findById(req.params.id);
                const {password,updatedAt, ...other} = user._doc;
                return res.status(200).json(other);
        }catch(err){
            return res.status(500).json(err);
        }
});
//follow the user
router.put("/:id/follow",async(req,res)=>{
    if(req.body.userid !== req.params.id ){
         try{
             const user = await User.findById(req.params.id);
             var follower = user.follower;
             follower =[];
            
             const currentUser = await User.findById(req.body.userid);
             if(!follower.includes(req.body.userid)){
                  await user.updateOne({ $push:{follower: req.body.userid } });
                  await currentUser.updateOne({ $push:{following:req.params.id} });
                  res.status(200).json("user has been followed");
             }
             else{
                 res.status(403).json("you already follows this user");
             }
          
         } catch(err){
             console.log(err);
             return res.status(500).json(err);
         }
    }
    else{
        return res.status(403).json("u cant follow yourself");
    }
})

//unfollow the user
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userid !== req.params.id){
          try{
              const user = await User.findById(req.params.id);
            
             
              const currentUser = await User.findById(req.body.userid);

              if(user.follower.includes(req.body.userid)){
                      await user.updateOne({$pull:{follower:req.body.userid}});
                      await currentUser.updateOne({$pull:{following:req.params.id}});
                      res.status(200).json("User has been unfollowed");
              }
              else{
                  return res.status(403).json("u cant unfollow yourself");
              }

             
          }
          catch(err){
              console.log(err);
              return  res.status(500).json(err);
          }
    }
    else{
        return res.status(403).json("you can't unfollow youself");
    }
});

router.use("/",(req,res)=>{
    res.send("Hy it is just user route");
})
module.exports=router;