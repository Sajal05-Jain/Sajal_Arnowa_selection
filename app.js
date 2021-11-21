var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
path = require('path');

var app = express();

mongoose.connect("mongodb://localhost/auth_demo_app");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is the best og in the world",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
//
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
// 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var port = process.env.PORT || 8080;


app.get("/", function (req, res) {
    res.redirect("/login");
});

app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Auth Routes

app.get("/register", function (req, res) {
    res.render("register");
});
//handling user sign up
app.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } //user stragety
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

// Login Routes

app.get("/login", function (req, res) {
    res.render("login");
})

// middleware
app.post('/login',
    passport.authenticate('local'), function (req, res) {
        // If this function gets called, authentication was successful.
        var counter = counter + req.user.username
        res.render('secret', {
            user: req.user.username,
            counter1: counter.length + 50,
            counter2: counter.length + 30
        });
    });
// app.post("/login", passport.authenticate("local",{
//     successRedirect:"/secret",
//     failureRedirect:"/login"
// }),function(req, res){
//     res.render("secret",{
//         user:req.user.id
//     });
// });

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(port, () => console.log("Server is Running at http://localhost:8080"));