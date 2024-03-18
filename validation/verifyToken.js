const jwt = require('jsonwebtoken');

export function auth(req, res, next){
    const token = req.heaader('auth-token');
    if(!token){
        return res.status(401).send({message: "access denied"});
    }
    try{
        const veriffied = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = veriffied
        next()

    }catch(err){
        return res.status(401).send({message: "invalid token"})
    }


}

