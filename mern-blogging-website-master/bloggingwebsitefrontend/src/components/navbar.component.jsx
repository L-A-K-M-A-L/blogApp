import { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom"
import logo from "../imgs/logo.png"
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component"


const NavBar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);

    // const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);

    const { userAuth } = useContext(UserContext);
    const { access_token, profile_img } = userAuth || {};  // Default to an empty object if userAuth is undefined



    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    };


    const handleClickOutside = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setUserNavPanel(false);
        }
    };

    return (
        <>
            <nav className="navbar">
                {/* LINK TAG WORKS AS <a> tag but it does not reload the page like a tag */}
                {/* logo */}
                <Link to="/" className="flex-none w-10">
                    <img src={logo} alt="logo" className="w-10" />
                </Link>

                {/* Searchbar */}
                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw]  md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show "
                    + (searchBoxVisibility ? "show" : "hide")}>
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full 
                                placeholder:text-dark-grey md:pl-12 "
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none
                                md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" ></i>

                </div>
                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    {/* toggle search bar in small screen by clicking icon */}
                    <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center 
                                    justify-center"
                        onClick={() => setSearchBoxVisibility(currentValue => !currentValue)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link to="/editor" className="hidden md:flex gap-2 link">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {/*  if user logged in sig in and sign up button will change to sign out button */}
                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notification">
                                    <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                                        <i className="fi fi-rr-bell-ring text-2xl block ml-1"></i>
                                    </button>
                                </Link>
                                <div className="relative" onBlur={handleClickOutside} tabIndex={0}>
                                    <button  onClick={handleUserNavPanel}  className="w-12 h-12 mt-1">
                                        <img src={profile_img} alt="user_profile_image" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    {
                                        userNavPanel ?
                                            <UserNavigationPanel /> : ""
                                    }
                                </div>
                            </>
                            :
                            <>
                                <Link className="btn-dark py-2" to="/signin">
                                    Sign In
                                </Link>

                                <Link className="btn-light py-2 hidden md:block" to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }


                </div>

            </nav>

            <Outlet />
        </>

    )
}

export default NavBar;