const UserModel=require('../../model/User/UserModel');
const RedisClient = require('../../config/Redis');
const DEFAULT_EXPIRATION = 60 * 2;

const teacherFetch = async (req, res) => {
    try{
        const catchedTeacher = await RedisClient.get('teachers');
        if(catchedTeacher){
            // Return cached sanitized teacher list
            return res.json({success:true,teacher:JSON.parse(catchedTeacher)});
        }

        // Define a safe allow-list of fields to expose for teacher profiles
        // Keep minimal public information only to avoid leaking PII
    const safeFields = 'name email role profilePic Qualification DateOfJoining grade createdAt _id';

        // Use projection and lean() for a plain JS object result
        const users = await UserModel.find({ role: { $regex: /teacher/i } }).select(safeFields).lean();

        // Cache the sanitized result
        await RedisClient.setEx('teachers',DEFAULT_EXPIRATION,JSON.stringify(users));

        return res.status(200).json({success:true,teacher:users});
    }catch(err){
        return res.status(400).json({success:false,error:err.message});
    }
}

module.exports=teacherFetch;