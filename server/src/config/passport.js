import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import { User } from '../models/index.js';

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: env.googleClientId,
  clientSecret: env.googleClientSecret,
  callbackURL: "/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ where: { google_id: profile.id } });
    
    if (user) {
      // User exists, return user
      return done(null, user);
    }
    
    // Check if user exists with this email (for linking accounts)
    user = await User.findOne({ where: { email: profile.emails[0].value } });
    
    if (user) {
      // Link Google account to existing user
      user.google_id = profile.id;
      await user.save();
      return done(null, user);
    }
    
    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      google_id: profile.id,
      plan: 'free'
    });
    
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;