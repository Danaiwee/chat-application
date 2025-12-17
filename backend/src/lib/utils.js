import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  }); 

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in millisecond
    httpOnly: true, //Only sent via HTTP requests.
    sameSite: "None", //"strict" → Cookie only sent for requests from the same site.
    secure: process.env.NODE_ENV !== "development", //If true → the cookie is only sent over HTTPS.
  });

  return token;
};
