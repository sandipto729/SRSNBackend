const AlumniModel = require('../../model/Alumni/alumniVeriModel');
const fetchUserProfile=async(req,res)=>{
    try{
        const UserId=req.alumniuser._id;
        console.log(UserId);
        if(!UserId){
            return res.status(400).json({success:false,message:'User not found'});
        }
        const user=await AlumniModel.findById(UserId);
        res.status(200).json({success:true,user});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=fetchUserProfile