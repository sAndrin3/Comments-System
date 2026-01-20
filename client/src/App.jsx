import {PostLists} from "./components/PostLists.jsx";
import {Routes, Route} from "react-router-dom"
import {Post} from "./components/Post.jsx";
import {PostProvider} from "./contexts/PostContext.jsx";

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<PostLists/>}/>
                <Route path="/posts/:id" element={
                    <PostProvider>
                        <Post/>
                    </PostProvider>}/>
            </Routes>
        </div>
    )
}

export default App
