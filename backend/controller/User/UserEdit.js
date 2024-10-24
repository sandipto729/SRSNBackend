const userModel=require('../../model/User/UserModel');

const userEdit=async(req,res)=>{
    try{
        const UserId=req.user._id;
        if(!UserId){
            return res.status(400).json({success:false,message:'User not found'});
        }
        const user=await userModel.findByIdAndUpdate(UserId,req.body);
        res.status(200).json({success:true,user});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=userEdit