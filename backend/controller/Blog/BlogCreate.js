const BlogModel=require('../../model/Blog/BlogModel');
const blogCreate=async(req,res)=>{
    try {
        console.log('req.body',req.body);
        const blog=new BlogModel(req.body);
        await blog.save();
        res.status(200).json({success:true,blog});
    } catch (err) {
        res.status(400).json({success:false,error:err.message});
    }
}
module.exports=blogCreate;