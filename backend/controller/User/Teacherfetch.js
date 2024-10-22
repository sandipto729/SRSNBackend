const UserModel=require('../../model/User/UserModel');

const teacherFetch = async (req, res) => {
    try{
        const user=await UserModel.find({ role: { $regex: /teacher/i } });
        res.status(200).json({success:true,teacher:user});
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=teacherFetch;