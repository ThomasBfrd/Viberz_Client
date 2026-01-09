import "./discover-category.scss";
import {useQuery} from "@tanstack/react-query";
import {type ChangeEvent, useContext, useEffect, useMemo, useRef, useState} from "react";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {type FetchResult, useFetch} from "../../../../shared/hooks/useFetch.tsx";
import type {PaginatedData} from "../../../../shared/interfaces/paginated-data.interface.ts";
import type {Playlist} from "../../../../shared/interfaces/playlist.interface.ts";
import Loader from "../../../../shared/components/loader/loader.tsx";
import TrackListItem from "../../../../shared/components/track-list-item/track-list-item.tsx";
import {FAMILY_GENRES, GENRE_NAME, GENRE_PATH, GENRE_VALUE} from "../../../../shared/const/family-genres.ts";
import type {FamilyGenres} from "../../../../shared/interfaces/family-genres.interface.ts";
import InfiniteScroll from 'react-infinite-scroll-component';
import Footer from "../../../../shared/components/footer/footer.tsx";
import AddPlaylistForm from "../add-playlist-form/add-playlist-form.tsx";
import ModalOverlay from "../../../../shared/components/modal-overlay/modal-overlay.tsx";
import SearchIcon from "../../../../shared/components/svg/search/search-icon.tsx";
import BackButton from "../../../../shared/components/back-button/back-button.tsx";
import MenuItemsScroll from "../../../../shared/components/menu-items-scroll/menu-items-scroll.tsx";

const DiscoverCategory = () => {
    const {jwtToken, guest} = useContext(AuthContext);
    const {category} = useParams<{category: string}>();
    const navigate = useNavigate();
    const location = useLocation();
    const {likedButtonClicked} = useLocation().state ?? false;
    const {fetchData} = useFetch<PaginatedData<Playlist>>();
    const [likedPlaylists, setLikedPlaylists] = useState<boolean>(likedButtonClicked);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
    const [openAddPlaylistModal, setOpenAddPlaylistModal] = useState<boolean>(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const scrollPositionRef = useRef<number>(0);
    const menuItems: FamilyGenres[] = useMemo(() => {
        return FAMILY_GENRES.filter((genre: FamilyGenres) => genre.path !== "all")
    }, [])

    useEffect(() => {
        if (likedButtonClicked) {
            navigate(location.pathname, {
                replace: true,
                state: null
            })
        }
    }, [navigate, likedButtonClicked, location.pathname]);

    const {data: paginatedData, isFetching, error} = useQuery({
        queryKey: ['playlists', {jwtToken, category, searchTerm, page, likedPlaylists}],
        queryFn: async () => {
            if (!jwtToken) throw new Error('No token provided');
            const result: FetchResult<PaginatedData<Playlist>> = await fetchData(`${import.meta.env.VITE_BACKEND_URL}/api/playlist?family=${category && GENRE_VALUE[category]}&search=${searchTerm ?? ""}&likes=${likedPlaylists ? "true" : "false"}&page=${page ?? 1}&pageSize=${10}`, {
                method: "GET",
                jwtToken: jwtToken
            });

            return result?.data as PaginatedData<Playlist>;
        },
        enabled: !!jwtToken,
    })

    useEffect(() => {
        if (!category) {
            navigate('/discover');
            return;
        }

        setAllPlaylists([]);
        setPage(1);
        setHasMore(true);
    }, [category, navigate]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
    }, [likedPlaylists]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
            setHasMore(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (!paginatedData?.items) return;

        setAllPlaylists(prev => {
            if (page === 1) {
                return paginatedData.items;
            }

            const merged = [...prev, ...paginatedData.items];
            return Array.from(new Map(merged.map(playlist => [playlist.id, playlist])).values());
        });

        if (paginatedData.items.length === 0 || paginatedData.items.length < 10) {
            setHasMore(false);
        }

        if (page > 1 && scrollContainerRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop = scrollPositionRef.current;
                }
            }, 0);
        }
    }, [paginatedData, page]);

    const fetchMoreData = () => {
        if (!isFetching) {
            if (scrollContainerRef.current) {
                scrollPositionRef.current = scrollContainerRef.current.scrollTop;
            }
            setPage(prev => prev + 1);
        }
    }

    const handleNavigateToGenre = (genre: number) => {
        if (isNaN(genre)) {
            return navigate(`/discover/all`);
        }

        navigate(`/discover/${GENRE_PATH[genre]}`);
    }

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }

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

        if (!playlist) return;

        onRedirect(playlist);
    }

    const handleSeePlaylistLikes = () => {
        setLikedPlaylists(!likedPlaylists);
    }

    const fetchState = useMemo(() => {
        if (isFetching && allPlaylists.length === 0) return <Loader />
        if (error) return <p>An error has occurred</p>
    }, [isFetching, allPlaylists.length, error]);

    return (
        <div className="page-transition discover-gere-container">
            <div className="discover-genre-content">
                {openAddPlaylistModal && <ModalOverlay
                    isClosable={true}
                    closed={handleCloseAddPlaylistModal}
                    children={
                        <AddPlaylistForm closeModal={onRedirectToPlaylist} updating={false} />}
                />}
                <div className="discover-genre-header">
                    <div className="discover-genre-header-back-button" data-testid="back-button">
                        <BackButton disabled={isFetching} forcePath={"/discover"} />
                        <h1 className="discover-genre-header-title">{category && GENRE_NAME[GENRE_VALUE[category]]}</h1>
                    </div>
                    <div className="discover-genre-menu">
                        <MenuItemsScroll currentItem={category as string} items={menuItems} setCurrentItem={handleNavigateToGenre} />
                    </div>
                    <div className="discover-genre-header-search">
                        <label className="discover-genre-header-search-icon">
                            <SearchIcon height={"20px"} width={"20px"} fill={"#000"} />
                        </label>
                        <input
                            className="discover-genre-header-search-input"
                            type="text"
                            placeholder="Search a playlist by user or name..."
                            value={searchInput}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className="discover-genre-body">
                    <div className="discover-genre-charts">
                        <div className="discover-genre-charts-container" id="scrollableDiv" ref={scrollContainerRef}>
                            {fetchState ? fetchState : (
                                <InfiniteScroll
                                    dataLength={allPlaylists.length}
                                    next={fetchMoreData}
                                    hasMore={hasMore}
                                    scrollableTarget="scrollableDiv"
                                    loader={<Loader />}
                                    scrollThreshold={0.8}>
                                    {allPlaylists.length > 0 ? (allPlaylists.map((playlist: Playlist, index: number) => (
                                        <div
                                            className="discover-genre-charts-item"
                                            data-first={index === 0}
                                            data-last={index === allPlaylists.length - 1}
                                            key={playlist.id}>
                                            <TrackListItem
                                                item={playlist}
                                                index={index}
                                                title={playlist.name}
                                                subtitle={playlist.userName}
                                                cover={playlist.imageUrl}
                                                genres={playlist.genreList}
                                                likes={playlist.likes}
                                                itemClicked={onRedirect}
                                            />
                                        </div>
                                    ))) : (
                                        <p className="discover-genre-item-empty">No playlist found...</p>
                                    )}
                                </InfiniteScroll>
                            )}
                        </div>
                    </div>
                    <div className="discover-genre-add-playlist" data-testid="add-playlist-button">
                        {!guest && (
                            <button type="button" className="add-playlist-button" onClick={handleCloseAddPlaylistModal}>Add your own playlist !</button>
                        )}
                    </div>
                </div>
                <div className="discover-genre-footer">
                    <Footer userLikes={true} seeLikedPlaylists={handleSeePlaylistLikes} likedButtonClicked={likedPlaylists} />
                </div>
            </div>
        </div>
    )
}

export default DiscoverCategory;