const mongoose=require('mongoose');

const newsSchema=new mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    sendbody:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('News',newsSchema);