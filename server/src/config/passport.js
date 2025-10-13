import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { env } from './env.js';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs'; // Use bcryptjs for consistency

passport.use(new TwitterStrategy({
  consumerKey: env.twitter.consumerKey,
  consumerSecret: env.twitter.consumerSecret,
  callbackURL: env.twitter.callbackURL,
  includeEmail: true, // Request email from Twitter if available
  passReqToCallback: true
}, async (req, token, tokenSecret, profile, done) => {
  try {
    console.log('Twitter Strategy - Incoming profile:', {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails
    });

    if (!profile || !profile.id) {
      console.error('Invalid profile received from Twitter');
      return done(new Error('Invalid profile received from Twitter'));
    }

    let user = await User.findOne({ where: { twitterId: profile.id } });
    
    if (!user) {
      // Generate a unique email if Twitter doesn't provide one
      const email = profile.emails?.[0]?.value || `twitter_${profile.id}@${new URL(env.frontendBaseUrl).hostname}`;
      
      // Check if email is already in use
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        // Link Twitter to existing account
        await existingUser.update({
          twitterId: profile.id,
          twitterToken: token,
          twitterTokenSecret: tokenSecret
        });
        return done(null, existingUser);
      }
      
      try {
        user = await User.create({
          name: profile.displayName || 'Twitter User',
          email,
          password: null, // OAuth users start without password
          twitterId: profile.id,
          twitterToken: token,
          twitterTokenSecret: tokenSecret,
          password_set: false // Flag that password needs to be set
        });
      } catch (createError) {
        console.error('Error creating user:', createError);
        return done(createError);
      }
    } else {
      try {
        await user.update({
          twitterToken: token,
          twitterTokenSecret: tokenSecret,
          name: profile.displayName || user.name
        });
      } catch (updateError) {
        console.error('Error updating user:', updateError);
        // Continue with existing user data if update fails
      }
    }
    
    return done(null, user);
  } catch (err) {
    console.error('Twitter Auth Error:', err);
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
        user = await User.create({
          name,
          email: userEmail,
          password: null, // OAuth users start without password
          linkedinId,
          linkedinToken: accessToken,
          password_set: false // Flag that password needs to be set
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
      // Check if user exists with this email
      const existingUser = await User.findOne({ where: { email: userEmail } });
      if (existingUser) {
        // Link LinkedIn to existing account
        await existingUser.update({
          linkedinId,
          linkedinToken: accessToken,
          profile_image: profileImage || existingUser.profile_image
        });
        return done(null, existingUser);
      }
      
      user = await User.create({
        name,
        email: userEmail,
        password: null, // OAuth users start without password
        linkedinId,
        linkedinToken: accessToken,
        profile_image: profileImage || null,
        password_set: false // Flag that password needs to be set
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