const session = require('express-session');

module.exports = {
    adminSession:(req,res,next)=>{
        if(req.session.adminLoggedIn){
            next()
        }
        else{
            res.redirect('/admin')
        }
    },
    userSession:(req,res,next)=>{
        if(req.session.loggedIn){
            next()
        }
        else{
            res.redirect('/loginPage')
        }
    }
}