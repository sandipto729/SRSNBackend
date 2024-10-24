const UserModel=require('../../model/User/UserModel');
const bcrypt=require('bcrypt');

const userSignUp = async (req, res) => {
    const {aadharNo}=req.body;
    const {email}=req.body;

    const password = aadharNo.slice(-5);
    try{
        const user=await UserModel.findOne({email:email});
        if(user){
            return res.status(400).json({success:false,message:'User already exists'});
        }
        const bcriptPassword=await bcrypt.hash(password,10);
        const userSignUp=await UserModel.create({...req.body,password:bcriptPassword});
        res.status(200).json({success:true,userSignUp});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=userSignUp