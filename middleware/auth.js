const dotenv = require('dotenv');
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const apiKey = req.header('api_key');
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
};

module.exports = apiKeyAuth; 