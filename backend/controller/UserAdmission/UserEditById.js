const UserModel=require('../../model/User/UserAdmissionModel');

const UserEditById=async(req,res)=>{
    try{
        const {_id}=req.body;
        const user=await UserModel.findByIdAndUpdate(_id,req.body);
        res.status(200).json({success:true,user});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=UserEditById;