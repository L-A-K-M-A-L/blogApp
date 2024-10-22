import googleIcon from "../imgs/google.png";
import InputBox from "../components/input.component";
import { Link, Navigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast"
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext, useRef } from "react";
import { UserContext } from "../App";
import { authwithGoogle } from "../common/firebase";




const UserAuthForm = ({ type }) => {

    const authForm = useRef();

    // import user-details, import from app.jsx
    let { userAuth, setUserAuth } = useContext(UserContext);
    let access_token = userAuth ? userAuth.access_token : null;
    console.log(access_token);

    const userAuthThroughServer = (serverRoute, formData) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({ data }) => {
                storeInSession("user", JSON.stringify(data))
                setUserAuth(data)

            })
            .catch(({ response }) => {
                toast.error(response.data.error)
            })
    }

    //  connection to server
    const handleSubmit = (e) => {
        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // form data
        let form = new FormData(formElement);
        let formData = {};

        // loop through data
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        // validate data
        let { fullname, email, password } = formData;

        // if we only have fullname
        if (fullname) {
            if (fullname.length < 3) {
                return toast.error(" Full Name must be at least 3 letter long");
            }
        }

        if (!email.length) {
            return toast.error(" Enter email");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid");
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 chacaters long with numeric, 1 lowercase, 1 upper case letters");
        }

        userAuthThroughServer(serverRoute, formData);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();

        authwithGoogle().then(user => {
            
            let serverRoute = "/google-auth";

            let formData = {
                access_token : user.accessToken
            }

            userAuthThroughServer(serverRoute, formData)
        })
        .catch( err => {
            toast.error('Trouble login through google')
            return console.log(err)
        })
    }

    return (
        access_token ?
            // this will go back to home page if user session expired
            <Navigate to="/"/> :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form id="formElement" className="w-[80%] max-w-[400px]">
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                            {type == "sign-in" ? "Welcome Back" : "Join Us Today"}
                        </h1>

                        {
                            type != "sign-in" ?
                                <InputBox
                                    name="fullname"
                                    type="text"
                                    placeholder="Full Name"
                                    icon="fi-rr-user"
                                /> : ""
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="Email"
                            icon="fi-rr-envelope"
                        />

                        <InputBox
                            name="password"
                            type="password"
                            placeholder="Password"
                            icon="fi-rr-key"
                        />

                        <button
                            className="btn-dark center mt-14"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {type.replace('-', " ")}
                        </button>

                        <div
                            className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold"
                        >
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />

                        </div>
                        <button className="btn-dark flex items-center justify-center gap-4 nw-[90%] center" onClick={handleGoogleAuth}>
                            <img src={googleIcon} alt="googleIcon" className="w-5 " />
                            Continue with google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className="mt-6 text-dark-grey text-xl text-center"> Don't Have an Account ?
                                    <Link to="/signup" className="underline text-black text-xl ml-1">
                                        Join Us today.
                                    </Link>
                                </p> :
                                <p className="mt-6 text-dark-grey text-xl text-center"> Already member ?
                                    <Link to="/signin" className="underline text-black text-xl ml-1">
                                        Sign in here
                                    </Link>
                                </p>
                        }

                    </form>


                </section>
            </AnimationWrapper>

    )

}

export default UserAuthForm;