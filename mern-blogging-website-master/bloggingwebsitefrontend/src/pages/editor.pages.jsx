import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";


const Editor = () => {

    const [ editorState, setEditorState ] = useState("editor");

    
  const { userAuth } = useContext(UserContext); // Get userAuth safely
  const access_token = userAuth?.access_token; // Use optional chaining to safely access access_token


    return (

        access_token === null ?
            <Navigate to="/signin" /> : 
            editorState == "editor" ? <BlogEditor /> : <PublishForm />

    )

}

export default Editor;