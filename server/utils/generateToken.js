const jwt = require("jsonwebtoken");

const generateToken = (id, email) => {
  console.log("JWT_SECRET", process.env.JWT_SECRET);
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
