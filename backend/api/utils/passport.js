import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createsocialUser, findByGoogleId, getUserByIdsocial, } from "../models/userModel.js";


// Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: '542644779667-1r007qquspjis8m0mf3h62m7k6hopnaf.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:5000/api/v1/users/auth/google/callback'
            
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await findByGoogleId(profile.id);

                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = await createsocialUser(
                    profile.id,
                    profile.displayName
                );

                return done(null, newUser);
            } catch (error) {
                return done(error)
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {

    console.log(user);

    try {
        // const userData = await getUserByIdsocial(user?.id, null)
        done(null, user)

        // if (userData?.rows[0]) {
        //     return done(null, userData?.rows[0]);
        //   } else {
        //     return done(null, false)
        //   }
        
    } catch (error) {
        console.log(error)
        done(error)
    }
});

export default passport;