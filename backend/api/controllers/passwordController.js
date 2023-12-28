
import passport from "passport";

export const googleLogin = async(req,res,next) => {
    passport.authenticate(google, {
        scope:['profile', 'email'],
    })
}

export const  googleCallback = async(res, req) => {
  passport.authenticate('google', {
    failureRedirect:'/login',
    
  })

  res.redirect('/');
}



