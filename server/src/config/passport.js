import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { User } from '../models/index.js';

// Twitter OAuth Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_API_KEY,
  consumerSecret: process.env.TWITTER_API_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL
}, async (token, tokenSecret, profile, done) => {
  try {
    // Check if user already exists with Twitter ID
    let user = await User.findOne({ 
      where: { twitterId: profile.id } 
    });

    if (user) {
      // User exists, return user
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({ 
      where: { email: profile.emails?.[0]?.value } 
    });

    if (user) {
      // Link Twitter account to existing user
      await user.update({ twitterId: profile.id });
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName || profile.username,
      email: profile.emails?.[0]?.value || `${profile.username}@twitter.placeholder`,
      twitterId: profile.id,
      avatar: profile.photos?.[0]?.value,
      isVerified: true // Twitter users are pre-verified
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize/Deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

console.log('Passport configuration loaded successfully');

export default passport;