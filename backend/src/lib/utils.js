import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    //create a JWT token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'}); //this mean that users have to login again after 7 days

    //then send cookie back
    res.cookie('jwt', token, {
        maxAge: 7*24*60*60*1000, //7 days in millisecond
        httpOnly: true, //prevent xss attacks cross-site scripting attacks
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development' //set to false for localhost!
    });

    return token;
}   