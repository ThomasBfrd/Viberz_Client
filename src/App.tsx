import './App.css'
import {Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import Loader from "./shared/components/loader/loader.tsx";
import HomePage from "./features/pages/home/home-page.tsx";
import Aurora from "./shared/components/external/Aurora/aurora.tsx";

const Callback = lazy(() => import("./features/pages/callback/callback-page.tsx"));
const Profile = lazy(() => import("./features/pages/profile/profile-page.tsx"));
const EditProfile = lazy(() => import("./features/pages/edit-profile/edit-profile-page.tsx"));
const GuessGenre = lazy(() => import("./features/pages/guess/./guess-page.tsx"));
const GuessSong = lazy(() => import("./features/pages/guess/./guess-page.tsx"));

function App() {

    return (
        <>
            <Suspense fallback={<Loader/>}>
                <Aurora
                    colorStops={["#182725", "#0e247e", "#26AAA4"]}
                    blend={1}
                    amplitude={0.5}
                    speed={0.3}
                />
                <Routes>
                    <Route path="/home" element={<HomePage/>}/>
                    <Route path="/callback" element={<Callback/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/profile/edit" element={<EditProfile/>}/>
                    <Route path="/guess-genre" element={<GuessGenre />}/>
                    <Route path="/guess-song" element={<GuessSong />}/>
                    <Route path="*" element={<HomePage />} />
                </Routes>
            </Suspense>
        </>
    )
}

export default App
