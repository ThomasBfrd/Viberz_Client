import {useCallback, useContext, useEffect, useState} from 'react';
import type {
    Artist,
    OtherRandomSong,
    RandomGuessSongs,
    RandomSong
} from "../../../shared/interfaces/guess-song.interface.ts";
import guessService from "../../../shared/services/guess.service.ts";
import './guess-page.scss';
import {AuthContext} from "../../../core/context/auth-context.tsx";
import MusicPlayer from "../../components/player/music-player.tsx";
import Footer from "../../../shared/components/footer/footer.tsx";
import Modal from "../../../shared/components/modal/modal.tsx";
import {useNavigate} from "react-router-dom";
import xpGamesService from "../../../shared/services/xp-games.service.ts";
import {ACTIVITY_TYPE} from "../../../shared/enums/activities.enum.ts";
import type {ResultGame} from "../../../shared/interfaces/result-game.interface.ts";
import GuessAnswers from "../../components/game/guess-answers/guess-answers.tsx";
import SubmitGame from "../../components/game/submit-game/submit-game.tsx";
import GameCompleted from "../../components/game/game-completed/game-completed.tsx";
import StepperGame from "../../components/game/stepper-game/stepper-game.tsx";
import type {GameHistory} from "../../../shared/interfaces/game-history.interface.ts";
import genresService from "../../../shared/services/genres.service.ts";
import {shuffle} from "../../../shared/utils/shuffle.ts";
import PreSelectGenresGame from "../../components/game/pre-select-genres-game.tsx";
import {useFetch} from "../../../shared/hooks/useFetch.tsx";
import useInitializeGameType from "../../../shared/hooks/useInitializeGameType.tsx";

const GuessPage = () => {
    const navigate = useNavigate();
    const gameType: string | null = useInitializeGameType();
    const {fetchData} = useFetch();
    const [readyGuessSong, setReadyGuessSong] = useState<boolean>(false);
    const [randomSongs, setRandomSongs] = useState<RandomGuessSongs | null>(null);
    const [randomSong, setRandomSong] = useState<RandomSong | null>(null);
    const [wave, setWave] = useState<number>(1);
    const [gameCompleted, setGameCompleted] = useState<boolean>(false);
    const [finishedLastWave, setFinishedLastWave] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [resultWave, setResultWave] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState<number>(0);
    const [earnedXp, setEarnedXp] = useState<number>(0);
    const [genres, setGenres] = useState<string[]>([]);
    const [songs, setSongs] = useState<OtherRandomSong[]>([])
    const [allGenres, setAllGenres] = useState<string[]>([]);
    const {jwtToken, logout} = useContext(AuthContext);
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [path, setPath] = useState<string>("");
    const [liked, setLiked] = useState<boolean>(false);
    const [resultGame, setResultGame] = useState<ResultGame | undefined>(undefined);
    const totalWaves: number = 6;

    useEffect(() => {

        if (jwtToken && gameType === "guess-genre" && wave === 1 && !randomSongs) {
            const getSongFromRandomPlaylist = async () => {
                try {
                    const fetchRandomSongs : RandomGuessSongs = await guessService.getSongs(jwtToken, ACTIVITY_TYPE.GUESS_GENRE);
                    setRandomSongs(fetchRandomSongs);
                } catch (error) {
                    console.error(error)
                }
            }

            getSongFromRandomPlaylist();
        }

        if (jwtToken && gameType === "guess-song" && readyGuessSong && wave === 1 && !randomSongs) {
            const getSongFromRandomPlaylist = async () => {
                try {
                    const fetchRandomSongs : RandomGuessSongs = await guessService.getSongs(jwtToken, ACTIVITY_TYPE.GUESS_SONG, genres);
                    setRandomSongs(fetchRandomSongs);
                } catch (error) {
                    console.error(error)
                }
            }

            getSongFromRandomPlaylist();
        }

        return () => {};
        
    }, [gameType, genres, jwtToken, logout, navigate, randomSongs, readyGuessSong, wave]);

    useEffect(() => {

        if (jwtToken && gameType === 'guess-song') {
            const getGenres = async () => {
                try {
                    const allGenres: string[] = await genresService.getGenres(jwtToken);
                    setAllGenres(allGenres);
                }
                catch (error) {
                    console.error(error)
                }
            }

            getGenres();

        }

        return () => {};

    }, [jwtToken, gameType]);

    useEffect(() => {
        if (wave < totalWaves) {
            setAnswer(null);
            setIsCorrect(null);
            setRandomSong(null);

            if (gameType === "guess-genre") {
                setGenres([]);
            }

            const random: RandomSong | undefined = randomSongs?.randomSong[wave - 1];

            if (random) {
                if (gameType === "guess-genre") {
                    const getGenres: string[] = shuffle([random.genre, ...random.otherGenres]);
                    setGenres(getGenres);
                }

                if (gameType === "guess-song") {
                    const songTitle: OtherRandomSong = {
                        title: random.song.track.name,
                        artists: random.song.track.artists.map((artist: Artist) => artist.name)
                    }
                    const shuffleSongTitles: OtherRandomSong[] = shuffle([songTitle, ...random.otherSongs])
                    setSongs(shuffleSongTitles);
                }

                setRandomSong(random);
            }
        }
    }, [wave, randomSongs, gameType]);

    useEffect(() => {
        if (gameCompleted && jwtToken) {
            const history: GameHistory = {
                earnedXp: earnedXp,
                activityType: gameType === "guess-genre" ? ACTIVITY_TYPE.GUESS_GENRE : ACTIVITY_TYPE.GUESS_SONG,
                createdAt:  new Date().toDateString()
            }
            const saveProgression = async () => {
                try {
                    const fetchSaveProgression: ResultGame | undefined = await xpGamesService.addGameHistory(jwtToken, history);

                    setResultGame(fetchSaveProgression);
                } catch (error) {
                    console.error(error)
                }
            }
            saveProgression();
        }
    }, [earnedXp, gameCompleted, gameType, jwtToken, score]);

    const onSelectGenre: (genre:string) => void = useCallback((genre: string) => {
        setAnswer(genre);
    }, [])

    const onSubmitAnswer = useCallback(() => {
        setResultWave(true);

        if (gameType === "guess-genre" && answer && answer === randomSong?.genre) {
            setIsCorrect(true);
            setScore(score + 1);
            setEarnedXp(earnedXp + randomSong.earnedXp);

        } else if (gameType === "guess-song" && answer && randomSong?.song.track.name === answer) {
            setIsCorrect(true);
            setScore(score + 1);
            setEarnedXp(earnedXp + randomSong.earnedXp);
        }
        else {
            setIsCorrect(false);
        }

        if (wave === totalWaves - 1) {
            setFinishedLastWave(true);
            return;
        }
    }, [answer, earnedXp, gameType, randomSong?.earnedXp, randomSong?.genre, randomSong?.song.track.name, score, wave])

    const onLikeSong = useCallback(async () => {
        if (!randomSong?.song.track.id || !randomSongs?.accessToken) return;

        const result = await fetchData('https://api.spotify.com/v1/me/tracks', {
            method: liked ? 'DELETE' : 'PUT',
            jwtToken: randomSongs.accessToken,
            body: {
                ids: [randomSong?.song.track.id]
            }
        });

        if (result?.success) {
            setLiked(!liked);
        }
    }, [fetchData, liked, randomSong?.song.track.id, randomSongs?.accessToken])

    const onSelectTitleSong = useCallback((song: string) => {
        setAnswer(song);
    }, []);

    const onStartGameWithTheseGenres = useCallback((genres: string[]) => {
        if (genres.length > 0 && genres.length <= 3) {
            setGenres(genres);
            setReadyGuessSong(true);
        }
    }, []);
    
    const onFinishGame = useCallback(() => {
        setGameCompleted(true);
        setFinishedLastWave(false);
        return;
    }, []);

    const onNextQuestion = useCallback(() => {
        setResultWave(false);
        setWave(wave + 1);
    }, [wave]);

    const onDefiningPath = useCallback((path: string) => {
        setPath(path);

        if (!gameCompleted) {
            return setConfirmModalVisible(true);
        }

        return navigate(path);
    }, [gameCompleted, navigate]);

    const confirmCancel = useCallback(() => {
        navigate(path);
    }, [navigate, path]);
    
    const onConfirmRestart = useCallback(() => {
        if (gameType === "guess-song") {
            setReadyGuessSong(true);
        }

        setRandomSongs(null);
        setWave(1);
        setGameCompleted(false);
        setScore(0);
        setEarnedXp(0);
        setResultWave(false);
    }, [gameType]);

    return (
        <div className="quiz-page-container">
            {!gameCompleted && confirmModalVisible ? (
                <Modal eventType="warning"
                       message="Are you sure to cancel this game ? You will lost your earnings."
                       handleSubmit={confirmCancel}
                       handleClose={() => setConfirmModalVisible(false)} />
            ) : null}
            {gameType === "guess-song" && !readyGuessSong ? (
                <PreSelectGenresGame
                    allGenres={allGenres}
                    startGameWithGenres={onStartGameWithTheseGenres} />
            ) : (
                <div className="quiz-content">
                    {gameCompleted && resultGame ? (
                        <GameCompleted earnedXp={earnedXp} resultGame={resultGame} score={score} totalWaves={totalWaves} onConfirmRestart={onConfirmRestart} />
                    ) : (
                        <>
                            <StepperGame wave={wave} totalWaves={totalWaves} />
                            <div className="quiz-player">
                                {randomSong ? (
                                    <MusicPlayer randomSong={randomSong} gameType={gameType} resultWave={resultWave} accessToken={randomSongs?.accessToken} />
                                ) : (
                                    <p style={{color: '#fff'}}>Loading song...</p>
                                )}
                            </div>
                            <GuessAnswers
                                randomSong={randomSong}
                                otherSongs={gameType === "guess-song" ? songs : undefined}
                                otherGenres={gameType === "guess-genre" ? genres : undefined}
                                gameType={gameType === "guess-song" ? ACTIVITY_TYPE.GUESS_SONG : ACTIVITY_TYPE.GUESS_GENRE}
                                answer={answer}
                                isCorrect={isCorrect}
                                selectedTitle={gameType === "guess-song" ? onSelectTitleSong : undefined}
                                selectedGenre={gameType === "guess-genre" ? onSelectGenre : undefined}/>
                            <SubmitGame
                                resultWave={resultWave}
                                finishedLastWave={finishedLastWave}
                                liked={liked} answer={answer}
                                onLikeSong={onLikeSong}
                                onNextQuestion={onNextQuestion}
                                onSubmitAnswer={onSubmitAnswer}
                                onCompleteGame={onFinishGame}
                            />
                        </>
                    )}
                </div>
            )}
            <Footer onCancel={onDefiningPath} />
        </div>
    );
};

export default GuessPage;