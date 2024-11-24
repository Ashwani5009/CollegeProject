const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "6cad35a0117a8205b2ca78772f6a20637f93343849a386e9bcd22ba3efcdcaeec16cd768fb00298d32f80158b83db44d356fd3d266a647628cf2f149d73ca418");
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
