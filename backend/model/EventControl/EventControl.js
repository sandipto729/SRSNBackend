const mongoose=require('mongoose');

const eventControlSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isOngoing:{
        type:Boolean,
        default:false
    },
    changes:{
        type:Array,
        default:[]
    }
});
const eventControl=mongoose.model('eventControl',eventControlSchema);
module.exports=eventControl