const Log = require('../models/Log')

exports.getLogs = async (req, res) =>{
    try {
        const logs = await Log.find().sort({createdAt:-1}).populate('user', 'fullName email role')
        res.status(200).json({
            success: true,
            logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}   