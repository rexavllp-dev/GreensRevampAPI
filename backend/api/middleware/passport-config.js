import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { createUserWithFacebook, createUserWithGoogle, findUserByFacebookId, findUserByGoogleId, findUserById } from '../models/userModel.js';


 passport.use(
  new GoogleStrategy(
    {
      clientID: 'your_google_client_id',
      clientSecret: 'your_google_client_secret',
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findUserByGoogleId(profile.id);

        if (user) {
          return done(null, user);
        }

        const newUser = await createUserWithGoogle(profile.id, profile.emails[0].value);
        return done(null, newUser[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: 'your_facebook_app_id',
      clientSecret: 'your_facebook_app_secret',
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findUserByFacebookId(profile.id);

        if (user) {
          return done(null, user);
        }

        const newUser = await createUserWithFacebook(profile.id, profile.emails[0].value);
        return done(null, newUser[0]);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;