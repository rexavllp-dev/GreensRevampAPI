import passport from "passport";

export const googleLogin = async(req, res) => {
    passport.authenticate('google',{
        scope:['profile','email'],
    })
}

export const googleCallback = async(req,res) => {
    passport.authenticate('google', {
        failureRedirect:'/',
    }),
    (req, res) => {
        res.redirect('/');
    }

   
    
}


