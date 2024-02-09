const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../jwt_secret/config");
const { get } = require("mongoose");
const e = require("express");

var restAuthController = {};

restAuthController.login = async function (req, res) {

    // Check if request is empty
    if (!req.body) {
        return res.status(400).send({
            auth: false, 
            token: null, 
            message: "Content is empty." 
        });
    }

    // Check if email and password are provided
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({ 
            auth: false, 
            token: null,
            message: "Content is empty." 
        });
    }

    // Check if email is valid
    if (!validateEmail(email)) {
        return res.status(400).send({ 
            auth: false, 
            token: null,
            message: "Email is not valid." 
        });
    }

    // Check if user exists
    const user = await getUserByEmail(email);

    if (user === null) {
        return res.status(500).send({ 
            auth: false, 
            token: null,
            message: "Internal server error." 
        });
    }

    if (user === undefined) {
        return res.status(404).send({ 
            auth: false, 
            token: null,
            message: "User not found." 
        });
    }

    // Check if password is correct
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ 
            auth: false, 
            token: null,
            message: "Unauthorized." 
        });
    }

    const token = generateToken(user);

    res.status(200).send({ auth: true, token: token });
};

restAuthController.register = async function (req, res) {

    // Check if request is empty
    if (!req.body) {
        return res.status(400).send({
            auth: false, 
            token: null, 
            message: "Content is empty." 
        });
    }

    const email = req.body.email;

    // Check if email already exists
    const userDB = await getUserByEmail(email);

    if(userDB === null){
        return res.status(500).send({ 
            auth: false, 
            token: null,
            message: "Internal server error." 
        }); 
    }

    // If user not exists, create it
    if(userDB === undefined){
        console.log("User not exists.")
        let user = User.create({
            name : req.body.name || '',
            email: email,
            password : bcrypt.hashSync(req.body.password, 8),
            status : req.body.status || true,
            role: req.body.role || 'USER'
        });

        const token = generateToken(user);

        return res.status(200).send({
            auth: true,
            token: token,
            message: "User created and logged."
        });
    }

    // If user exists and is active, return error
    if(userDB.status){
        return res.status(400).send({ 
            auth: false, 
            token: null,
            message: "User already exists." 
        });
    }

    // If user exists and is inactive, update it
    if(!userDB.status){
        User.findByIdAndUpdate(userDB._id, {
            name : req.body.name || '',
            email: email,
            password : bcrypt.hashSync(req.body.password, 8),
            status : req.body.status || true,
            role: req.body.role || 'USER'
        })
        .then((user) => {
            const token = generateToken(user);
            return res.status(200).send({
                auth: true,
                token: token,
                message: "User updated and logged."
            });
        })
        .catch((err) => {
            return res.status(500).send({ 
                auth: false, 
                token: null,
                message: "Internal server error." 
            });
        });
    }

};

restAuthController.verifyToken = function (req, res, next) {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send({
                    auth: false,
                    message: 'Unauthorized.'
                });
            }
            req.userId = decoded.id;
            next();
        });
    } else {
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });
    }
};

//

function getUserByEmail(inputEmail) {
    return User.findOne({ email: inputEmail})
    .exec()
    .then((user) => {
        //console.log(user);
        if(user == null || !user){
            return undefined;
        }
        return user;
    })
    .catch((err) => {
        return null;
    })
};

function generateToken(user) {
    return jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

module.exports = restAuthController;