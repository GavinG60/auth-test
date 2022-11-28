const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./models/users")
const { appendFile } = require("fs")

// Register
app.post("/register", async (req, res) => {
    const user = req.body;

    // check if already taken
    const takenUsername = await User.findOne({username: user.username})
    const takenEmail = await User.findOne({email: user.email})

    if (takenUsername || takenEmail) {
        res.json({message: "Username or email is already taken!"})
    } else {
        user.password = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User ({
            username: user.username.toLowerCase(),
            email: user.email.toLowerCase(),
            password: user.password
        }) // User

        dbUser.save()
        res.json({message: "Success!"})
    } // if
}) // app.post

// Login
app.post("/login", (req, res) => {
    
    const userLoggingIn = req.body;

    // Checks if user exists in database
    User.findOne({username: userLoggingIn.username})
    .then(isCorrect => {
        // If user is not in database
        if (!dbUser) {
            return res.json({
                message: "Invalid Username or Password"
            }) // return
        } // if
        // If user exists, validates password
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
            if (isCorrect) {
                const payload = {
                    id: dbUser._id,
                    username: dbUser.username,
                    email: dbUser.email,
                } // payload
                // Creates token and sends to front end
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {expiresIn: 86400},
                    // Callback signaling success to front end
                    (err, token) => {
                        if (err) return res.json({message: err})
                        return res.json({
                            message: "Success!",
                            token: "Bearer " + token
                        }) // return
                    }  // jwt.sign
                ) // jwt.sign
            } else {
                return res.json({
                    message: "Invalid Username or Password"
                }) // return
            } // if
        }) //bcrypt.compare
    }) // User.findOne
}) // app.post

// Verify JSON Token
function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if (token) {
        jwt.verify(token, process.env.PASSPORTSECRET, (err, decoded) => {
            if (err) {
                return res.json({
                    isLoggedIn: false,
                    message: "Failed to Authenticate"
                }) // return
            } // if
            // Next route has access to the decoded indo
            req.user = {};
            req.user.if = decoded.id
            req.user.username = decoded.username
            next()
        }) // jwt.verify
    } else {
        res.json({message: "Incorrect Token Given", isLoggedIn: false})
    } // if
} // verifyJWT

// Accessing current user in any route
app.get("/getUsername", verifyJWT, (req, res) => {
    res.json({isLoggedIn: true, username: req.user.username})
}) // app.get