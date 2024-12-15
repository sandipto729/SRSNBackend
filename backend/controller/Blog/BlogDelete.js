const BlogModel=require('../../model/Blog/BlogModel');
const BlogDelete=async(req,res)=>{
    try {
        const {_id}=req.body;
        const blog=await BlogModel.findByIdAndDelete(_id);
        res.status(200).json({success:true,blog});
    } catch (err) {
        res.status(400).json({success:false,error:err.message});
    }
}

module.exports=BlogDelete;