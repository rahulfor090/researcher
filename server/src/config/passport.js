import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { env } from './env.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs for consistency

passport.use(new TwitterStrategy({
  consumerKey: env.twitter.consumerKey,
  consumerSecret: env.twitter.consumerSecret,
  callbackURL: env.twitter.callbackURL // Should be 'http://localhost:5000/v1/auth/twitter/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    console.log('Twitter Profile:', profile); // Add for debugging
    let user = await User.findOne({ where: { twitterId: profile.id } });
    if (!user) {
      const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10); // Random password
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0]?.value || `${profile.id}@twitter.com`,
        password,
        twitterId: profile.id,
        twitterToken: token,
        twitterTokenSecret: tokenSecret
      });
    } else {
      await user.update({ twitterToken: token, twitterTokenSecret: tokenSecret });
    }
    return done(null, user);
  } catch (err) {
    console.error('Twitter Auth Error:', err); // Log the error
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;