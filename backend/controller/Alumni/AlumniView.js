const DEFAULT_EXPIRATION = 60 * 2; 
const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');
const RedisClient = require('../../config/Redis');

// Fields that should never be exposed in the public alumni list
const SENSITIVE_FIELDS = ['mobileNumber', 'email', 'refreshToken'];

const stripSensitiveFields = (alumniArray) => {
    return alumniArray.map(({ mobileNumber, email, refreshToken, ...safe }) => safe);
};

const alumniView = async (req, res) => {
    try {
        const catchedAlumni = await RedisClient.get('alumnis');
        if (catchedAlumni) {
            
            const parsedData = JSON.parse(catchedAlumni);
            
            if (!Array.isArray(parsedData)) {
                console.error('Error fetching alumni: Cached alumni data is not an array');
                return res.status(500).json({ success: false, error: 'Cached data is invalid' });
            }
            // console.log('Using Redis cache Alumni Get', parsedData);
            
            return res.status(200).json({ success: true, alumni: stripSensitiveFields(parsedData) });
        }

        // Fetch data from MongoDB if not in Redis cache
        // Exclude sensitive fields at the database query level
        const alumni = await alumniVeriModel.find().select(SENSITIVE_FIELDS.map(f => `-${f}`).join(' '));
        if (!Array.isArray(alumni)) {
            console.error('MongoDB query did not return an array');
            return res.status(500).json({ success: false, error: 'Database query failed' });
        }

        // Store data in Redis cache
        await RedisClient.setEx('alumnis', DEFAULT_EXPIRATION, JSON.stringify(alumni));
        res.status(200).json({ success: true, alumni });
    } catch (error) {
        console.error('Error fetching alumni:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = alumniView;