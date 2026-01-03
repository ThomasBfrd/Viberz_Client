import "./submit-game.scss";
import type {OtherRandomSong} from "../../../../shared/interfaces/guess-song.interface.ts";
import HeartIcon from "../../../../shared/components/svg/heart/heart-icon.tsx";

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
                    <HeartIcon />
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