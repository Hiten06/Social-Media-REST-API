const mongoose = require('mongoose');

const postSch= new mongoose.Schema({
     
    userid:{
         type:String,
         require:true,
    },
    desc:{
        type:String,
        max:500,
    },
    img:{
        type:String,
    },
    like:{
        type:Array,
        default:[],
    }
},{timestamps : true});


const PostModel = mongoose.model("post",postSch);
module.exports = PostModel;