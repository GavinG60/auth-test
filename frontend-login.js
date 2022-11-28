// Fetch Requests
useEffect(() => {
    const info = {
        name: "First Last",
        age: 100,
    } // info

    // Need to set proxy in package.json to procy backend for /exampleroute
    fetch("/exampleroute", {
        method:"POST",
        headers: {
            "Content-type": "application/json",
            "x-access-token": localStorage.getItem("token")   
        }, 
        body: JSON.stringify(info)
    }) // fetch
    // Get data from the backend
    .then(res => res.json())
    .then(data => console.log(data))
}) // useEffect


// Login
import { useHistory } from 'react-router'
import { useEffect, useState } from 'react'

function Login() {
    const history = useHistory()

    // Grabs inputs
    function handleLogin(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            username: form[0].value,
            password: form[1].value
        } // user

        // Sets token recieved from the backend
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        }) // fetch
        // Sets token so it stays after refreshing page
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("token", data.token)
        }) // then
    } // handleLogin

    // Confirm if the user is logged in by verifying token
    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            } // headers
        }) // fetch
        .then(res => res.json())
        // Redirect user to homepage, replace / with home route
        .then(data => data.isLoggedIn ? history.push("/"): null)
    }, []) // useEffect

    // Login form that transfers data
    return (
        <form onSubmit={event => handleLogin(event)}>
            <input required type="email"/>
            <input required type="password"/>
            <input type="submit" value="Submit"/>
        </form>
    ) // return
} // Login


// Register
import { useHistory } from 'react-router'
import { useEffect } from 'react'

function Register() {
    const history = useHistory()

    async function handleRegister(e) {
        e.preventDefault()

        const form = e.target
        const user = {
            email: form[0].value,
            email: form[1].value,
        }

        // Creates new user in database
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        }) // fetch
    } // handleRegister

    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            } // headers
        }) // fetch
        .then(res => res.json())
        // Redirect user to login, replace /login with login route
        .then(data => data.isLoggedIn ? history.push("/login"): null)
    }, []) // useEffect

    // Login form that transfers data
    return (
        <form onSubmit={event => handleRegister(event)}>
            <input required type="email"/>
            <input required type="password"/>
            <input type="submit" value="Register"/>
        </form>
    ) // return
} // Register


// Dynamically rendering navbar
import { useHistory, Link } from 'react-router'
import { useEffect, useEffect } from 'react'

function Navbar() {
    const history = useHistory()
    const [username, setUsername] = useState(null)

    async function logout() {
        localStorage.removeItem("token")
        await history.push("/login")
    } // logout

    // Ensures user is logged in
    useEffect(() => {
        fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            } // headers
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setUsername(data.username): null)
    }, []) // useEffect

    // Render login/logout buttons based on if username is set
    return (
        <div>
            <Link to="/home">Home</Link>
            {username
                ? <div>
                    <Link to={"/u/" + username}>Profile</Link>
                    <div onClick={logout}>Logout</div>
                  </div>
                : <div>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </div>
            }
        </div>
    ) // return
} // Navbar