const DEFAULT_EXPIRATION = 60 * 2; 
const alumniVeriModel = require('../../model/Alumni/alumniVeriModel');
const RedisClient = require('../../config/Redis');

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
            
            return res.status(200).json({ success: true, alumni: parsedData });
        }

        // Fetch data from MongoDB if not in Redis cache
        const alumni = await alumniVeriModel.find();
        if (!Array.isArray(alumni)) {
            console.error('MongoDB query did not return an array');
            return res.status(500).json({ success: false, error: 'Database query failed' });
        }

        // Store data in Redis cache
        await RedisClient.set('alumnis', JSON.stringify(alumni), 'EX', DEFAULT_EXPIRATION);
        res.status(200).json({ success: true, alumni });
    } catch (error) {
        console.error('Error fetching alumni:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = alumniView;