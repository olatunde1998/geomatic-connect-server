import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const googleClientId = "your google client id";
const googleClientSecret = "your google client secret";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: `http://localhost:3001/auth/google/redirect`,
    },

    function (accessToken, refreshToken, profile, done) {
      // User find or create to db
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
