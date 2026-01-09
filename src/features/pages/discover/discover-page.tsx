import './discover-page.scss';
import Footer from "../../../shared/components/footer/footer.tsx";
import {type FetchResult, useFetch} from "../../../shared/hooks/useFetch.tsx";
import type {PaginatedData} from "../../../shared/interfaces/paginated-data.interface.ts";
import type {Playlist} from "../../../shared/interfaces/playlist.interface.ts";
import {useContext, useMemo, useState} from "react";
import {AuthContext} from "../../../core/context/auth-context.tsx";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../../shared/components/loader/loader.tsx";
import type {FamilyGenres} from "../../../shared/interfaces/family-genres.interface.ts";
import {useNavigate} from "react-router-dom";
import TrackListItem from "../../../shared/components/track-list-item/track-list-item.tsx";
import ModalOverlay from "../../../shared/components/modal-overlay/modal-overlay.tsx";
import AddPlaylistForm from "./add-playlist-form/add-playlist-form.tsx";
import AddLessIcon from "../../../shared/components/add-less-icon/add-less-icon.tsx";
import {FAMILY_GENRES, GENRE_PATH} from "../../../shared/const/family-genres.ts";

const DiscoverPage = () => {
    const {jwtToken, guest} = useContext(AuthContext);
    const navigate = useNavigate();
    const {fetchData} = useFetch<PaginatedData<Playlist>>();
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);
    const menuItems = useMemo(() => {
        return FAMILY_GENRES.filter((genre: FamilyGenres) => genre.path !== "my-playlists" && genre.path !== "all")
    }, [])
    const {data: paginatedData, isLoading, error} = useQuery<PaginatedData<Playlist>>({
        queryKey: [ "playlists", jwtToken],
        queryFn: async () => {
            if (!jwtToken) throw new Error('No token provided');

            const result: FetchResult<PaginatedData<Playlist>> = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist`, {
                method: 'GET',
                jwtToken: jwtToken
            });

            return result?.data as PaginatedData<Playlist>;
        },
        enabled: !!jwtToken
    })

    const playlists: Playlist[] = paginatedData?.items ?? [];
    
    const fetchState = useMemo(() => {
        if (isLoading) return <Loader />
        if (error) return <p>An error has occurred</p>
    }, [isLoading, error]);

    const handleCloseAddPlaylistModal = () => {
        setOpenAddPlaylistModal(!openAddPlaylistModal);
    }

    const onRedirect = (playlist: Playlist) => {
        navigate(`/playlists/${playlist.id}`, {
            state: {
                playlist: playlist
            }
        });
    }

    const onRedirectToPlaylist = (playlist: Playlist | undefined) => {
        handleCloseAddPlaylistModal();

        if (playlist) {
            onRedirect(playlist);
        }
    }

    const onRedirectToFamily = (family: string) => {
        return navigate(`/discover/${family}`);
    }

    return (
        <div className="page-transition discover-container">
            {openAddPlaylistModal && <ModalOverlay
                isClosable={true}
                closed={handleCloseAddPlaylistModal}
                children={
                    <AddPlaylistForm closeModal={onRedirectToPlaylist} updating={false} />}
                />}
                <div className="playlist-add-button" data-testid="add-playlist-button">
                    {!guest && (
                        <AddLessIcon toggleExpand={handleCloseAddPlaylistModal} onlyAdd={true} />
                    )}
                </div>
            <div className="discover-content">
                <div className="discover-header">
                    <h1 className="discover-header-title">Discover</h1>
                </div>
                <div className="discover-body">
                    <div className="discover-body-charts">
                        <h3 className="subtitle">Classement général</h3>
                        <div className="discover-charts-container">
                            { fetchState ? fetchState : (playlists && playlists.map((playlist: Playlist, index: number) => (
                                <TrackListItem<Playlist>
                                    key={playlist.id}
                                    item={playlist}
                                    index={index}
                                    title={playlist.name}
                                    subtitle={playlist.userName}
                                    cover={playlist.imageUrl}
                                    genres={playlist.genreList}
                                    likes={playlist.likes}
                                    itemClicked={onRedirect} />
                            )))
                            }
                        </div>
                    </div>
                    <div className="discover-body-event">
                        <div className="discover-event-container">
                            <div className="discover-event-title">
                                <h3>Event soon...</h3>
                            </div>
                        </div>
                    </div>
                    <div className="discover-body-families">
                        { menuItems.map((family: FamilyGenres, index: number) => (
                            <div className="discover-families-item"
                                 id={`discover-family-${index+1}`}
                                 key={family.id}
                                 onClick={() => onRedirectToFamily(GENRE_PATH[family.value])}>
                                <p className="discover-families-item-name">{family.label}</p>
                                <div className="discover-families-item-cover"></div>
                            </div>
                        ))}
                        {!guest && (
                            <div
                                className="discover-families-item"
                                id="discover-family-5"
                                onClick={() => onRedirectToFamily('my-playlists')}>
                                <p className="discover-families-item-name">My playlists</p>
                                <div className="discover-families-item-cover"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="discover-footer">
                    <Footer userLikes={true} seeLikedPlaylists={() => navigate("/discover/all", {
                        state: {
                            likedButtonClicked: true
                        }
                    })} />
                </div>
            </div>
        </div>
    )
}

export default DiscoverPage;