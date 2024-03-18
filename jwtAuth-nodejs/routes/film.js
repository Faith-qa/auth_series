const express = require('express');

const router = express.Router();

const file = require('../models/film')

const verify = require('../validation/verifyToken')

router.get('/',verify, async(req, res)=>{
    try{
        const films = await file.find()
        res.send(films);
    }catch(err){
        console.error("could not retrieve list of films,", err)
        res.status(400).send({message: err})
    }
    
})
module.exports = router