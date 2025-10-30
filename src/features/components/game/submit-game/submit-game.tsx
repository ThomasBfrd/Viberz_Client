import "./submit-game.scss";
import type {OtherRandomSong} from "../../../../shared/interfaces/guess-song.interface.ts";

export interface SubmitGameProps {
    resultWave: boolean;
    finishedLastWave: boolean;
    liked: boolean;
    answer: string | OtherRandomSong | null;
    onLikeSong: () => void;
    onNextQuestion: () => void;
    onSubmitAnswer: () => void;
    onCompleteGame: () => void;
}

const SubmitGame = ({resultWave, finishedLastWave, liked, answer, onLikeSong, onNextQuestion, onSubmitAnswer, onCompleteGame}: SubmitGameProps) => {

    function likeSong() {
        return onLikeSong();
    }

    function nextQuestion() {
        return onNextQuestion();
    }

    function submitAnswer() {
        return onSubmitAnswer();
    }

    function completeGame() {
        return onCompleteGame();
    }

    return (
        <div className="quiz-submit">
            {resultWave && (
                <button className={liked ? "quiz-button-like liked" : "quiz-button-like"} onClick={likeSong}>
                    <svg viewBox="0 0 16 16" id="like" fill='#fff'>
                        <path
                            d="M11.692 1C10.123 1 8.753 1.946 8 3.182 7.247 1.946 5.877 1 4.308 1 1.928 1 0 2.899 0 5.242c0 1.173.468 2.246 1.231 3.031C2.963 10.054 8 15 8 15s5.037-4.946 6.769-6.727A4.341 4.341 0 0 0 16 5.242C16 2.899 14.072 1 11.692 1z"></path>
                    </svg>
                </button>
            )}
            {resultWave ? (
                <button className="quiz-action-button" onClick={finishedLastWave ? completeGame : nextQuestion}>
                    <p className="quiz-submit-button-text">{finishedLastWave ? "Finish" : "Next Song"}</p>
                </button>
            ) : (
                <button className={!answer ? "quiz-action-button disabled" : "quiz-action-button"}
                        onClick={() => answer && submitAnswer()}>
                    <p className="quiz-submit-button-text">Verify</p>
                </button>
            )}
        </div>
    )
}

export default SubmitGame;