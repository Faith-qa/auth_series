const express = require('express');
const router = express.Router();

const User = require('../models/user');
const {registerValidation, loginValidation} = require('../validation/validation')
const bcryptjs = require('bcryptjs');

const jwt = require('jsonwebtoken')

router.post('/register', async(req, res)=>{

    //validation 1 to check input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message: error['details'][0]['message']})

    }

    //validation 2 check if user exist

    const userExist = await User.findOne({email: req.body.email})
    if (userExist){
        return res.status(400).send({message: 'User already exist'})
    }
    //hashed the password for security purposes
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    //code to insert the data
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try{
        const savedUser = await user.save();
        res.send(savedUser)


    }catch(err){res.status(400).send({message: err})}
    
}),
router.post('/login', async(req, res)=>{
    //validation 1 to check input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message: error['details'][0]['message']})
    }

    //validation 2 check if user exist

    const user = await User.findOne({email: req.body.email})
    if (!user){
        return res.status(400).send({message: 'User does not exist'})
    }

    //validation 3 check password

    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if(!passwordValidation){
        return res.status(400).send({message: 'invalid password'})
    }
    
    //Generate AuthToken for user
    const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({"auth-token": token});

})

module.exports = router