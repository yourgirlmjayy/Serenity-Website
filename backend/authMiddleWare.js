const authMiddleWare = () => {
    if (req.session.userid){
        next();
    } else {
        res.status(401).json({error : "Unauthorized"});
    }
};
module.exports = authMiddleWare;