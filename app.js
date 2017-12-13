/**
    Server - DeepScholar Mock.
*/
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const jwt = require('jsonwebtoken')

// Secret Key.
// TODO Get from environment.
const JWT_SECRET_KEY = 'bar'

// Create an app.
const app = express()

// Settings for app.
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

// Auth Algorithm..
passport.use(new LocalStrategy((username, password, done) => {

    // Mockup.
    done(null, { id : 1, name : username })
    // if (username === 'user' && password === 'pass') {
    //     done(null, { id : 1, name : username })

    // } else {
    //     return done('failed.', false, { message : 'incorrect username / password.' })
    // }
}))

// Login page.
app.get('/login', (req, res) => {
    res.send(`
        <form action="/login" method="post">
            <label>Username:</label>
            <input type="text" name="username" value="user"/><br>
            <label>Password:</label>
            <input type="text" name="password" value="pass"/><br>
            <input type="submit" value="Log In"/>
        </form>
    `)
})

// Login.
app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session : false }, (err, user, info) => {

        console.log('passport local callback.', err, user, info)

        if (err) {
            return next(err)
        }

        if (user) {
            // Create a jwt token, and Set to Cookie.
            const token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn : '7days' })
            res.cookie('token', token, {
                domain : '.deepscholar.local',
                expires : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            })

            // OK.
            return res.redirect('/home')
        }

        console.log('something wrong...', info)
        res.redirect('/')

    })(req, res, next)
})

// Home.
app.get('/home', (req, res) => {

    // Get a token from Cookie.
    const token = req.cookies.token
    if (!token) {
        return res.redirect('/')
    }

    // Verify and Decode the jwt token..
    let user
    try {
        user = jwt.verify(token, JWT_SECRET_KEY)
    } catch (err) {
        // Error.
        // @see https://github.com/auth0/node-jsonwebtoken#jsonwebtokenerror
        console.log('jwt err:', err)
        return res.redirect('/')
    }

    // OK.
    res.send(`
        <h1>Click and open the PDF in pdfanno.</h1>
        <ul>
            <li>
                <a href="http://pdfanno.deepscholar.local:8080/dist/?pdf=http://deepscholar.local:4000/pdf/bitcoin.pdf&jwt=on">
                    bitcoin.pdf
                </a>
            </li>
            <li>
                <a href="http://pdfanno.deepscholar.local:8080/dist/?pdf=http://deepscholar.local:4000/pdf/P12-1046.pdf&jwt=on">
                    P12-1046.pdf
                </a>
            </li>
        </ul>
    `)
})

// Index.
app.get('/', (req, res) => {
    res.redirect('/login')
})

// Run.
app.listen(4000, function() {
    console.log('App listening on port 4000.');
});
