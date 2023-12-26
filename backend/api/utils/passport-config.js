import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createGoogleUser, getUserByGoogleId, getUserById } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/v1/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
     
      try {
        // console.log(profile);
        const user = await getUserByGoogleId(profile.id);
        console.log(user);
        console.log(profile.id);
        if (user) {
          return done(null, user);
        }
        const newUser = await createGoogleUser(
          profile.id,
          profile.displayName
        );
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});




