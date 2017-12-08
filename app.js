/**
    Server - DeepScholar Mock.
*/
const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


passport.use(new LocalStrategy((username, password, done) => {

    console.log('challenge: ', username, password)

    // TODO mockup.
    if (username === 'user' && password === 'pass') {
        done(null, {
            id   : 1,
            name : username
        })

    } else {
        return done('failed.', false, 'incorrect username / password.')
    }
}))









const app = express()

// Index.
app.get('/', (req, res) => {
    res.send(`
        <form action="/login" method="post">
            <label>Username:</label>
            <input type="text" name="username" value="user"/><br>
            <label>Password:</label>
            <input type="password" name="password" value="pass"/><br>
            <input type="submit" value="Log In"/>
        </form>
    `)
})

// Login.
app.post('/login', passport.authenticate('local', {
    successRedirect : '/home',
    failureRedirect : '/',
    failuerFlash    : true
}))

// Home.
app.get('/home', (req, res) => {
    res.send('Home')
})

app.listen(3000, function() {
    console.log('App listening on port 3000.');
});
