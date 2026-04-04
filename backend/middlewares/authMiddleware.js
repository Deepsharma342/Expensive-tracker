import jwt from 'jsonwebtoken';
import {Types} from 'mongoose';

const authMiddleware = (req, res, next) => {
    const token=req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(400).json({message: 'Unauthorized: No token provided'});
    }

  



    try {
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        if(!Types.ObjectId.isValid(decoded.id)){
            return res.status(401).json({message: 'Unauthorized: Invalid user ID    in token'});
            

        }
        req.userId= new Types.ObjectId(decoded.id);
        next();

          
  console.log("Decoded:", decoded);

    } catch (error) {
        
        return res.status(401).json({message: 'Unauthorized: Invalid token'});
        
    
    }

}

export default authMiddleware;
