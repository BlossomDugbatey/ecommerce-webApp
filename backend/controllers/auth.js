require('../mongooseConnection');
const User = require('../models/user');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

//register a new user
exports.register = async(req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        username: req.body.username
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error });
    }
}

//login
exports.login = async(req,res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        const{password, ...userInfo} = user._doc;
        res.status(200).json({ message: 'Login successful', ...userInfo, accessToken: accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error });
    }
}
module.exports = exports;