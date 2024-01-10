import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { createFacebookUser, createGoogleUser, getUserByEmail, getUserByFacebook, updateUserGoogleId } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://api.greens-intl.ae/api/v1/users/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {

      try {

        // const user = await getUserByGoogleId(profile.id);
        const existingUser = await getUserByEmail(profile.emails[0].value);

        if (existingUser) {
          // User with the same email already exists, save Google ID
          if (existingUser && !existingUser.google_id) {
            await updateUserGoogleId(existingUser.id, profile.id);
          }

          return done(null, existingUser);
        }


 
        // if (user) {
        //   return done(null, user);
        // }
        const registrationMethod = 'google'
        const newUser = await createGoogleUser(
          profile.id,
          profile.displayName,
          profile?.emails[0]?.value,
          registrationMethod,
        );

        // const userId = profile[0]?.id;
                

        //         await updateUserRegistrationMethod(userId, registrationMethod)
        


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
      callbackURL: 'https://api.greens-intl.ae/api/v1/users/auth/facebook/callback',
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
        const registrationMethod = 'facebook'
        const newUser = await createFacebookUser(
          profile.id,
          profile.displayName,
          registrationMethod,
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




