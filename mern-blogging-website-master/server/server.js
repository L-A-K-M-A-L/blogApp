import express, { json } from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
// generate random string
import { nanoid } from 'nanoid';

// to generate token from db
import jwt from 'jsonwebtoken';

// to allow server to listen any port
import cors from 'cors';


//  schema below
import User from './Schema/User.js';

import admin from "firebase-admin";
// import serviceAccountKey from "./react-web-1c47e-firebase-adminsdk-2oi6e-9625b4bef6.json" assert { type : "json" }

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccountKey = require("./react-web-1c47e-firebase-adminsdk-2oi6e-9625b4bef6.json");



import { getAuth } from 'firebase-admin/auth';


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const server = express();
let PORT = 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}


const generateUserName = async (email) => {
    let username = email.split("@")[0];

    let isUserNameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    isUserNameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username
}

// For sign up configurations
server.post("/signup", (req, res) => {
    // destrructre data
    let { fullname, email, password } = req.body;

    // validate data
    if (fullname.length < 3) {
        return res.status(403).json({ "Error ": " Full Name must be at least 3 letter long" });
    }

    if (!email.length) {
        return res.status(403).json({ "Error ": " Enter email" });
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({ "Error": "Email is invalid" })
    }

    if (!passwordRegex.test(password)) {


        return res.status(403).json({ "Error": "Password should be 6 to 20 chacaters long with numeric, 1 lowercase, 1 upper case letters" })
    }

    bcrypt.hash(password, 10, async (err, hashed_pw) => {

        let username = await generateUserName(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_pw, username }
        });

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
            .catch(err => {

                // check for duplication
                // check eamil is alredy exis or not
                if (err.code == 11000) {
                    return res.status(500).json({ "Error": "Email already exit." });
                }
                return res.status(500).json({ "error": err.message })
            })

        console.log(hashed_pw);
    })


})

//  for sign in configuration
server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    // find the user 
    User.findOne({ "personal_info.email": email })
        .then((user) => {

            if (!user) {
                return res.status(403).json({ "error": "Email not found" })
            }

            if (!user.google_auth) {
                // compare user enter pass and db pass word correct
                bcrypt.compare(password, user.personal_info.password, (err, result) => {
                    if (err) {
                        return res.status(403).json({ "error": "Error occured while loging please try again" })
                    }

                    if (!result) {
                        return res.status(403).json({ "error": "Inccorect password" })
                    } else {
                        return res.status(200).json(formatDatatoSend(user))
                    }
                })
            } else {
                return res.status(403).json({"error": "Account was created using google. Try loggin in with google"})
            }

        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({ "error": "Email not found" })
        })
})

// sign in route for google
server.post("/google-auth", async (req, res) => {
    let { access_token } = req.body;

    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodecUser) => {
            let { email, name, picture } = decodecUser;

            //  to get higher resolution image
            picture = picture.replace("s96-c", "s384-c");

            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth")
                .then((u) => {
                    return u || null;
                })
                .catch((err) => {
                    return res.status(500).json({ "error": err.message })
                })

            if (user) { //login
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "this email was signed up witgout google. please log in with password and username" })
                }
            } else {
                let username = await generateUserName(email)
                user = new User({
                    personal_info: { fullname: name, email, profile_img: picture, username },
                    google_auth: true

                })

                await user.save().then((u) => {
                    user = u;
                })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message })
                    })
            }


            return res.status(200).json(formatDatatoSend(user))

        })
        .catch(err => {
            return res.status(500).json({ "error": "Failed to authenticate, please try different google account" })
        })

})

server.listen(PORT, () => {
    console.log('Listening on port -> ' + PORT)
})