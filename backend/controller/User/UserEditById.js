const UserAdmissionModel=require('../../model/User/UserAdmissionModel');
const UserModel=require('../../model/User/UserModel');

const UserEditById=async(req,res)=>{
    try{
        const {editedStudent,model}=req.body;
        const {_id}=editedStudent;
        console.log(model,_id);
        if(model=='User'){
            const user=await UserModel.findByIdAndUpdate(_id,editedStudent);
            res.status(200).json({success:true,user});
        }
        
        else if(model=='UserAdmission'){
            const user=await UserAdmissionModel.findByIdAndUpdate(_id,editedStudent);
            res.status(200).json({success:true,user});
        }
    }catch(err){
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=UserEditById;