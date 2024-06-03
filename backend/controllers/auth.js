const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try {
       const authHeader = req.headers.authorization;
       if (!authHeader) {
           throw new Error('No authorization header');
           console.log("No authorization header");
       }

       const parts = authHeader.split(' ');
       if (parts.length !== 2 || parts[0] !== 'Bearer') {
           throw new Error('Invalid authorization header format. Expected "Bearer <token>"');
       }

       const token = parts[1];
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       next();
   } catch(error) {
       res.status(401).json({ error: error.message });
   }
};