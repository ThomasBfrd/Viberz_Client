import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import Loader from "./shared/components/loader/loader.tsx";
import HomePage from "./features/pages/home/home-page.tsx";

// const HomePage = lazy(() => import("./features/pages/home/home-page.tsx"));
const Callback = lazy(() => import("./features/pages/callback/callback-page.tsx"));
const Profile = lazy(() => import("./features/pages/profile/profile-page.tsx"));
const EditProfile = lazy(() => import("./features/pages/edit-profile/edit-profile-page.tsx"));
const GuessGenre = lazy(() => import("./features/pages/guess-genre/guess-genre-page.tsx"));

function App() {

    return (
        <>
            <Suspense fallback={<Loader/>}>
                <Routes>
                    <Route path="*" element={<Navigate to="/home" replace={true}/>}/>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/callback" element={<Callback/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/profile/edit" element={<EditProfile/>}/>
                    <Route path="/guess-genre" element={<GuessGenre />}/>
                </Routes>
            </Suspense>
        </>
    )
}

export default App
