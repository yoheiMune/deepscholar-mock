/**
    Server - DeepScholar Mock.
*/
const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// Secret Key.
// TODO Get from environment.
const SESSION_SECRET_KEY = 'foo'
const JWT_SECRET_KEY = 'bar'

// Create an app.
const app = express()

// Settings for app.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ 
    secret            : SESSION_SECRET_KEY, 
    resave            : false,
    saveUninitialized : true
}))
app.use(flash())


// Auth.
passport.use(new LocalStrategy((username, password, done) => {

    console.log('challenge: ', username, password)

    // TODO mockup.
    if (username === 'user' && password === 'pass') {
        done(null, {
            id   : 1,
            name : username
        })

    } else {
        return done('failed.', false, { message : 'incorrect username / password.' })
    }
}))










// Index.

app.get('/', (req, res) => {
    res.redirect('/login')
})

// Login page.
app.get('/login', (req, res) => {
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
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {

        console.log('passport local callback.', err, user, info)

        if (err) {
            return next(err)
        }

        if (user) {
            req.session.user = user
            return res.redirect('/home')
        }

        console.log('something wrong...', info)
        res.redirect('/')

    })(req, res, next)
})

// Home.
app.get('/home', (req, res) => {

    const user = req.session.user

    // Check login.
    if (!user) {
        return res.redirect('/')
    }

    // OK.
    res.send(`Home. userId=${user.id}`)
})

app.listen(3000, function() {
    console.log('App listening on port 3000.');
});
