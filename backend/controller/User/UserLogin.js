const UserModel = require('../../model/User/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userLogin = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user=await UserModel.findOne({email:email});
        if(!user){
            return res.status(400).json({success:false,message:'User not found'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:'Incorrect password'});
        }

        const tokenData = {
            _id: user._id,
            email: user.email
        };

        const token = jwt.sign(
            { data: tokenData }, 
            process.env.TOKEN_SECRET_KEY, 
            { expiresIn: '3h' } 
        );

        const tokenOptions = {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
        };

        res.cookie('token', token, tokenOptions).json({
            message: "Signin successful",
            data: token,
            error: false,
            success: true
        });
    }catch(error){
        res.status(400).json({success:false,message:error.message});
    }
}

module.exports=userLogin;