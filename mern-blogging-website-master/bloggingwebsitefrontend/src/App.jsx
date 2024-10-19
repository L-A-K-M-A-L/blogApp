import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar.component";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<NavBar />} >
                <Route path="signin" element={<h1>Sigin in page</h1>} /> / +
                <Route path="signup" element={<h1>Sigin up page</h1>} />
            </Route>

        </Routes>
    )
}

export default App;