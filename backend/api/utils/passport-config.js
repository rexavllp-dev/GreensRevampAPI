import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { createFacebookUser, createGoogleUser, getUserByEmail, getUserByFacebook, getUserByGoogleId } from '../models/userModel.js';
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

        const user = await getUserByGoogleId(profile.id);

        const existingUser = await getUserByEmail(profile?.emails[0]?.value);

        if (existingUser) {
          // User with the same email already exists, handle it here (e.g., return the existing user)
          return done(null, existingUser);
        }

      

        if (user) {
          return done(null, user);
        }
        const newUser = await createGoogleUser(
          profile.id,
          profile.displayName,
          profile?.emails[0]?.value
        );
        return done(null, newUser);
      } catch (error) {
        return done(error);
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
    // const userData = await getUserById(user?.id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});




// facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/v1/users/auth/facebook/callback',
    },
    async (accessToken, refreshToken, profile, done) => {

      try {
        console.log(profile);
        const user = await getUserByFacebook(profile.id);
        // console.log(user);
        // console.log(profile.id);
        if (user) {
          return done(null, user);
        }
        console.log(profile);
        const newUser = await createFacebookUser(
          profile.id,
          profile.displayName,
        );
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (user, done) => {
  // console.log(user);
  try {
    // const userData = await getUserById(user?.id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


