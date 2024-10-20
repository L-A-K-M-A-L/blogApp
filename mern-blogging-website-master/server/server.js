import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
// generate random string
import { nanoid } from 'nanoid';

// to generate token from db
import jwt from 'jsonwebtoken';

//  schema below
import User from './Schema/User.js'


let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const server = express();
let PORT = 3000;

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

const formatDatatoSend = (user) => {

    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img : user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname : user.personal_info.fullname
    }
}


const generateUserName = async (email) => {
    let username = email.split("@")[0];

    let isUserNameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    isUserNameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username
}

server.post("/signup", (req, res) =>{
    // destrructre data
   let { fullname, email, password } = req.body;
   
    // validate data
    if(fullname.length < 3){
        return res.status(403).json({"Error " : " Full Name must be at least 3 letter long"});
    }

    if(!email.length){
        return res.status(403).json({"Error " : " Enter email"});
    }

    if(!emailRegex.test(email)){
        return res.status(403).json({"Error" : "Email is invalid"})
    }

    if(!passwordRegex.test(password)){
        

        return res.status(403).json({"Error":"Password should be 6 to 20 chacaters long with numeric, 1 lowercase, 1 upper case letters"})
    }

    bcrypt.hash(password, 10,async (err, hashed_pw) => {

        let username = await generateUserName(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_pw, username}
        });

        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch( err => {

            // check for duplication
            // check eamil is alredy exis or not
            if(err.code == 11000){
                return res.status(500).json({"Error":"Email already exit."});
            }
            return res.status(500).json({"error": err.message })
        })

        console.log(hashed_pw);
    })


})

server.listen(PORT, () => {
    console.log('Listening on port -> ' + PORT)
})