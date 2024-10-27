const alumniTempModel = require('../../model/Alumni/alumniTempModel');

const alumniApplicationView = async (req, res) => {
    try{
        const alumni = await alumniTempModel.find();
        res.status(200).json({ success: true, alumni });
    }catch(err){
        res.status(400).json({ success: false, error: err.message });
    }
}

module.exports = alumniApplicationView