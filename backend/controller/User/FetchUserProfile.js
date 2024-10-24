const UserModle=require('../../model/User/UserModel');

const fetchUserProfile=async(req,res)=>{
    try{
        const UserId=req.user._id;
        if(!UserId){
            return res.status(400).json({success:false,message:'User not found'});
        }
        const user=await UserModle.findById(UserId);
        res.status(200).json({success:true,user});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=fetchUserProfile