import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext } from "react";
import { useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";


//  token for user
export const UserContext = createContext({});

const App = () => {

    // state for user
    const [userAuth, setUserAuth] = useState();


    //  run once after rendering complete
    useEffect(() => {
        // getuser from the session
        let userInSession = lookInSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });

    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path="/editor" element={<Editor />}/>
                <Route path="/" element={<NavBar />} >
                    <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                    <Route path="signup" element={<UserAuthForm type="sign-up" />} />
                </Route>

            </Routes>
        </UserContext.Provider>

    )
}

export default App;