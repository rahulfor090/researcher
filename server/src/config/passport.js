import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
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

// LinkedIn OAuth Strategy using generic OAuth2
passport.use('linkedin', new OAuth2Strategy({
  authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
  clientID: env.linkedin.clientId,
  clientSecret: env.linkedin.clientSecret,
  callbackURL: env.linkedin.callbackURL,
  scope: ['openid', 'profile', 'email'],
  state: true,
  customHeaders: {
    'Authorization': 'Bearer'
  },
  authorizationParams: {
    prompt: 'consent'
  }
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('LinkedIn Access Token:', accessToken);
    
    // Use Sign In with LinkedIn API (works with basic OpenID scopes)
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!profileResponse.ok) {
      console.error('Profile fetch failed:', profileResponse.status, await profileResponse.text());
      // If userinfo fails, create minimal user with token-based ID
      const linkedinId = Buffer.from(accessToken.substring(0, 20)).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
      const name = 'LinkedIn User';
      const userEmail = `linkedin_${linkedinId}@linkedin.local`;
      
      let user = await User.findOne({ where: { linkedinId } });
      if (!user) {
        const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
        user = await User.create({
          name,
          email: userEmail,
          password,
          linkedinId,
          linkedinToken: accessToken
        });
      } else {
        await user.update({ linkedinToken: accessToken });
      }
      return done(null, user);
    }
    
    const profileData = await profileResponse.json();
    console.log('LinkedIn Profile Data:', profileData);
    
    const linkedinId = profileData.sub || profileData.id;
    const name = profileData.name || `${profileData.given_name || ''} ${profileData.family_name || ''}`.trim() || 'LinkedIn User';
    const userEmail = profileData.email || `${linkedinId}@linkedin.local`;
    const profileImage = profileData.picture;
    
    let user = await User.findOne({ where: { linkedinId } });
    if (!user) {
      const password = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await User.create({
        name,
        email: userEmail,
        password,
        linkedinId,
        linkedinToken: accessToken,
        profile_image: profileImage || null
      });
    } else {
      await user.update({ 
        linkedinToken: accessToken,
        name: name,
        email: userEmail,
        profile_image: profileImage || user.profile_image
      });
    }
    return done(null, user);
  } catch (err) {
    console.error('LinkedIn Auth Error:', err);
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