import passport from "passport";
import Strategy from "passport-local";
import user from "./models/user.js";

passport.use(new Strategy(
  async function(username, password, done) {
    const user_test = await user.findOne({username: username}); // fetch the user from db if user exists
    // Check if user exists
    if (!user_test)
    {
        return done(null, false);
    }

    // Check if the given password = database password
    if (user_test.password == password)
    {
        return done(null, user_test); // authentication success
    }
    else
    {
        return done(null, false); // authentication fail
    }
  }
));

// if authentication succeeded, store some aspect of the user in the session - 1
// Serialize User - will be run only once after the user login
passport.serializeUser((user, done) => {
    // Save the user in the session
    done(null, user.username);
});

// Everytime the user with a session ID login, extract their information from database - 2
// Deserialize user - run on every request after logging in
passport.deserializeUser(async (username, done) => {
    // Fetch all information from database
    const loggedInUser = await user.findOne({username: username});
    done(null, loggedInUser);
});

export default passport;

// findOne, find, -> express, mongoDB