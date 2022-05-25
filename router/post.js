const router = require('express').Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a post
router.post('/',async(req,res)=>{
    const newPost = new Post(req.body);
    try{
         
          const savedPost = await newPost.save();
          res.status(200).json(savedPost);
    }
    catch(err){
        res.status(500).json(err);
    }

});
//update a post
router.put("/:id",async(req,res)=>{

 
     try{
        const post = await Post.findById(req.params.id);
        if(req.body.userid === req.params.id){
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated");
        }
        else{
           return res.status(403).json("you cant update anyone other post");
        }
         
        

     }catch(err){
         return res.status(500).json(err);
     }
    
});
//delete a post

router.delete("/:id",async(req,res)=>{

    try{
       const post = await Post.findById(req.params.id);
       if(req.body.userid === req.params.id){
           await post.deleteOne();
           res.status(200).json("Post has been deleted");
       }
       else{
          return res.status(403).json("you cant delete anyone other post");
       }        
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
   
});

//like a post 
router.put("/:id/like",async(req,res)=>{
        try{
             const post = await Post.findById(req.params.id);
             if(!post.like.includes(req.body.userid)){
                   await post.updateOne({$push:{like:req.body.userid}});
                   res.status(200).json("your post has been liked by someone");
             }
             else{
                 await post.updateOne({$pull:{like:req.body.userid}});
                 res.status(200).json("your post has been disliked by someone");
             }   
       
        }catch(err)
        {res.status(500).json(err);}
})
//get a post
router.get("/:id",async(req,res)=>{
    try{
        const post =  await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        console.log(err);
        res.status(500).json(err);}
})

//get timeline posts
router.get("/timeline",async (req,res)=>{
      let postArray=[];
      try{
          const currentUser = await User.findById(req.body.userid);
          const userPosts = await Post.find({userid:currentUser._id});
          const friendPost = Promise.all(
                 currentUser.following.map((friendId)=>{
                        return Post.find({ userid:friendId });
                 })
          );

          res.json(userPosts.concat(...friendPost));  
      }
      catch(err){res.status(500).json(err);}
});





module.exports = router;