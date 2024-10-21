import googleIcon from "../imgs/google.png";
import InputBox from "../components/input.component";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";
import { Toaster, toast } from "react-hot-toast"


const UserAuthForm = ({ type }) => {

    const authForm = useRef();
    //  connection to server
    const handleSubmit = (e) => {
        e.preventDefault();

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        // form data
        let form = new FormData(authForm.current);
        let formData = {};

        // loop through data
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        // validate data

        let { fullname, email, password } = formData

        // if we only have fullname
        if(fullname){
            if (fullname.length < 3) {
                return toast.error(" Full Name must be at least 3 letter long");
            }
        }

        if (!email.length) {
            return toast.error(" Enter email");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Email is invalid" );
        }

        if (!passwordRegex.test(password)) {
            return toast.error("Password should be 6 to 20 chacaters long with numeric, 1 lowercase, 1 upper case letters");
        }

    }
    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <Toaster />
                <form ref={authForm} className="w-[80%] max-w-[400px]">
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
                    <button className="btn-dark flex items-center justify-center gap-4 nw-[90%] center">
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