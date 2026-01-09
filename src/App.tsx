import './App.css'
import {Route, Routes} from "react-router-dom";
import {lazy, Suspense} from "react";
import Loader from "./shared/components/loader/loader.tsx";
import HomePage from "./features/pages/home/home-page.tsx";
import Aurora from "./shared/components/external/Aurora/aurora.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

const Callback = lazy(() => import("./features/pages/callback/callback-page.tsx"));
const Profile = lazy(() => import("./features/pages/profile/profile-page.tsx"));
const LegalNotice = lazy(() => import("./features/pages/legal-notice/legal-notice-page.tsx"));
const Privacy = lazy(() => import("./features/pages/privacy/privacy-page.tsx"));
const EditProfile = lazy(() => import("./features/pages/edit-profile/edit-profile-page.tsx"));
const GuessGenre = lazy(() => import("./features/pages/guess/guess-page.tsx"));
const GuessSong = lazy(() => import("./features/pages/guess/guess-page.tsx"));
const Discover = lazy(() => import("./features/pages/discover/discover-page.tsx"));
const DiscoverCategory = lazy(() => import("./features/pages/discover/category/discover-category.tsx"));
const Playlist = lazy(() => import("./features/pages/discover/playlist/playlist-page.tsx"));

function App() {

    return (
        <>
            <QueryClientProvider client={queryClient}>
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
                        <Route path="/profile/:id" element={<Profile/>}/>
                        <Route path="/legal-notice" element={<LegalNotice/>}/>
                        <Route path="/privacy" element={<Privacy/>}/>
                        <Route path="/profile/edit" element={<EditProfile/>}/>
                        <Route path="/guess-genre" element={<GuessGenre />}/>
                        <Route path="/guess-song" element={<GuessSong />}/>
                        <Route path="/discover" element={<Discover />}/>
                        <Route path="/discover/:category" element={<DiscoverCategory />}/>
                        <Route path="/playlists/:playlistId" element={<Playlist />}/>
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </Suspense>
            </QueryClientProvider>
        </>
    )
}

export default App
