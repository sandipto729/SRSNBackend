const UserAdmissionModel=require('../../model/User/UserAdmissionModel');

const userAdmissionSignUp=async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await UserAdmissionModel.findOne({email:email});
        if(user){
            return res.status(400).json({success:false,message:'User already exists'});
        }
        const userAdmission=await UserAdmissionModel.create(req.body);
        res.status(200).json({success:true,userAdmission});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=userAdmissionSignUp