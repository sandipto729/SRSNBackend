const UserModel=require('../../model/User/UserModel');
const RedisClient = require('../../config/Redis');
const DEFAULT_EXPIRATION = 60 * 2;

const teacherFetch = async (req, res) => {
    try{
        const catchedTeacher = await RedisClient.get('teachers');
        if(catchedTeacher){
            // console.log('Using Redis cache getting teachers',JSON.parse(catchedTeacher));
            return res.json({success:true,teacher:JSON.parse(catchedTeacher)});
        }
        const user=await UserModel.find({ role: { $regex: /teacher/i } });
        res.status(200).json({success:true,teacher:user});
        await RedisClient.set('teachers',JSON.stringify(user),DEFAULT_EXPIRATION);
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=teacherFetch;