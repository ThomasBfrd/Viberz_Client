import {useContext, useEffect, useState} from 'react';
import type {GuessSong} from "../../../shared/interfaces/guess-song.interface.ts";
import guessService from "../../../shared/services/guess.service.ts";
import './guess-genre-page.scss';
import {AuthContext} from "../../../core/context/auth-context.tsx";
import MusicPlayer from "../../components/player/music-player.tsx";
import clsx from "clsx";
import Footer from "../../../shared/components/footer/footer.tsx";
import Modal from "../../../shared/components/modal/modal.tsx";
import {useNavigate} from "react-router-dom";
import xpGamesService, {type GameHistory} from "../../../shared/services/xp-games.service.ts";
import {ACTIVITY_TYPE} from "../../../shared/enums/activities.enum.ts";

export interface ResultGame {
    userId: string;
    level: number;
    currentXp: number;
    xpForNextLevel: number;
    gradeName: string;
    levelUp: boolean;
}

const GuessGenrePage = () => {
    const navigate = useNavigate();
    const [randomSong, setRandomSong] = useState<GuessSong | undefined>(undefined);
    const [wave, setWave] = useState<number>(1);
    const [gameCompleted, setGameCompleted] = useState<boolean>(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [resultWave, setResultWave] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState<number>(0);
    const [earnedXp, setEarnedXp] = useState<number>(0);
    const [genres, setGenres] = useState<string[]>([]);
    const {jwtToken} = useContext(AuthContext);
    const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
    const [path, setPath] = useState<string>("");
    const [liked, setLiked] = useState<boolean>(false);
    const [resultGame, setResultGame] = useState<ResultGame | undefined>(undefined);
    const totalWaves: number = 3;

    useEffect(() => {
        if (jwtToken && !randomSong) {
            const getSongFromRandomPlaylist = async () => {
                try {
                    const fetchRandomSong = await guessService.guessGenre(jwtToken);
                    setRandomSong(fetchRandomSong);
                } catch (error) {
                    console.error(error)
                }
            }
            getSongFromRandomPlaylist();
        }

        return () => {
        };
    }, [jwtToken, randomSong]);

    useEffect(() => {
        if (randomSong) {
            const getGenres = shuffleGenres([randomSong.genre, ...randomSong.otherGenres]);
            setGenres(getGenres);
        }
    }, [randomSong]);

    useEffect(() => {
        if (wave === totalWaves) {
            setGameCompleted(true);
        } else {
            setAnswer(null);
            setIsCorrect(null);
            setRandomSong(undefined);
            setGenres([]);
        }
    }, [wave]);

    useEffect(() => {
        if (gameCompleted && jwtToken) {
            const history: GameHistory = {
                earnedXp: earnedXp,
                activityType: ACTIVITY_TYPE.GUESS_GENRE,
                createdAt:  new Date().toDateString()
            }
            const saveProgression = async () => {
                try {
                    const fetchRandomSong = await xpGamesService.addGameHistory(jwtToken, history);

                    setResultGame(fetchRandomSong);
                } catch (error) {
                    console.error(error)
                }
            }
            saveProgression();
        }
    }, [earnedXp, gameCompleted, jwtToken, score]);

    function shuffleGenres(genres: string[]): string[] {
        return genres.sort(() => Math.random() - 0.5);
    }

    function onSelectGenre(genre: string) {
        setAnswer(genre);
    }

    const onSubmitAnswer = async () => {
        setResultWave(true);
        if (answer) {
            if (answer === randomSong?.genre) {
                setIsCorrect(true);
                setScore(score + 1);
                setEarnedXp(earnedXp + randomSong?.earnedXp);
            } else {
                setIsCorrect(false);
            }
        }
    };

    const onNextQuestion = () => {
        setResultWave(false);
        setWave(wave + 1);
    };

    const onLikeSong = async () => {
        try {
            await fetch(`https://api.spotify.com/v1/me/tracks`, {
                method: liked ? 'DELETE' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${randomSong?.accessToken}`
                },
                body: JSON.stringify({
                    ids: [randomSong?.song.track.id]
                })
            })

            setLiked(!liked);
        }
        catch (error) {
            console.error(error)
        }
    };

    function onDefiningPath(path: string) {
        setPath(path);

        if (!gameCompleted) {
            return setConfirmModalVisible(true);
        }

        return navigate(path);
    }

    function confirmCancel() {
        navigate(path);
    }

    function confirmRestart() {
        setWave(1);
        setGameCompleted(false);
        setScore(0);
        setEarnedXp(0);
    }

    return (
        <div className="quiz-page-container">
            {!gameCompleted && confirmModalVisible ? (
                <Modal eventType="warning"
                       message="Are you sure to cancel this game ? You will lost your earnings."
                       handleSubmit={confirmCancel}
                       handleClose={() => setConfirmModalVisible(false)} />
            ) : null}
            <div className="quiz-content">
                {gameCompleted && resultGame ? (
                    <div className="game-completed">
                        <p className="game-completed-title">Game completed</p>
                        <div className="game-completed-recap">
                            <p className="recap-text">Your score is <span className="recap-value">{score}/{totalWaves - 1}</span></p>
                            <p className="recap-text">You have earned {earnedXp} XP</p>
                        </div>
                        <div className="experience-bar">
                            <div className="experience-progression-bar"
                                 style={{width: (resultGame.currentXp / resultGame.xpForNextLevel) * 100 + '%'}}>

                            </div>
                            <p className="experience-progression-text">{resultGame.currentXp} / {resultGame.xpForNextLevel}</p>
                        </div>
                        <button className="game-completed-button" onClick={confirmRestart}>Rejouer</button>
                    </div>
                ) : (
                    <>
                        <div className="quiz-header">
                            <p className="quiz-text">Question {wave}/{totalWaves-1}</p>
                            <div className="quiz-step" style={{width: `${(wave / totalWaves) * 100}%`}}></div>
                            <div className="quiz-step-completed"></div>
                        </div>
                        <div className="quiz-player">
                            {randomSong ? (
                                <MusicPlayer randomSong={randomSong} />
                            ) : (
                                <p style={{color: '#fff'}}>Loading song...</p>
                            )}
                        </div>

                        <div className="quiz-answers">
                            <p className="quiz-answers-text">What genre is this ?</p>
                            <div className="quiz-answers-props">
                                {randomSong && genres && genres.map((genre, index) => (
                                    <div
                                        key={index}
                                        className={clsx(
                                            "quiz-answers-props-button",
                                            answer === genre && "quiz-answers-props-button-selected",
                                            isCorrect !== null && genre === randomSong.genre && "quiz-answers-props-button-correct",
                                            isCorrect !== null && genre !== randomSong.genre && "quiz-answers-props-button-null",
                                            isCorrect !== null && !isCorrect && genre !== randomSong.genre && "quiz-answers-props-button-result-false"
                                        )}
                                        onClick={() => onSelectGenre(genre)}>
                                        <p className="quiz-answers-props-button-text">{genre}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="quiz-submit">
                            {resultWave ? (
                                <button className={liked ? "quiz-button-like liked" : "quiz-button-like"} onClick={onLikeSong}>
                                    <svg viewBox="0 0 16 16" id="like" fill='#fff'>
                                        <path
                                            d="M11.692 1C10.123 1 8.753 1.946 8 3.182 7.247 1.946 5.877 1 4.308 1 1.928 1 0 2.899 0 5.242c0 1.173.468 2.246 1.231 3.031C2.963 10.054 8 15 8 15s5.037-4.946 6.769-6.727A4.341 4.341 0 0 0 16 5.242C16 2.899 14.072 1 11.692 1z"></path>
                                    </svg>
                                </button>
                            ) : null}
                            {resultWave ? (
                                <button className="quiz-submit-next" onClick={onNextQuestion}>
                                    <p className="quiz-submit-button-text">Next Song</p>
                                </button>
                            ) : (
                                <button className={!answer ? "quiz-submit-button disabled" :"quiz-submit-button"}
                                        onClick={onSubmitAnswer}>
                                    <p className="quiz-submit-button-text">Verify</p>
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
            <Footer onCancel={onDefiningPath} />
        </div>
    );
};

export default GuessGenrePage;