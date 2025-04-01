import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({
            message: "Auth failed: No token provided",
            success: false,
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        
        return res.status(401).json({ message: "Auth Failed", success: false, });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    console.log(error)
    return res.status(401).json({
      message: "Auth failed",
      success: false,
    });
  }
};
