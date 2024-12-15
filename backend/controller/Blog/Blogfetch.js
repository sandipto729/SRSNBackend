const BlogModel=require('../../model/Blog/BlogModel');
const blogFetch=async(req,res)=>{
    try {
        const blog=await BlogModel.find();
        res.status(200).json({success:true,blog:blog});
    } catch (err) {
        res.status(400).json({success:false,error:err.message});
    }
}
module.exports=blogFetch