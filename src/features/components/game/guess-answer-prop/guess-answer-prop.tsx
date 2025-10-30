import "./guess-answer-prop.scss";
import clsx from "clsx";
import type {RandomSong} from "../../../../shared/interfaces/guess-song.interface.ts";

export interface GuessAnswerPropProps {
    answer: string | null;
    isCorrect: boolean | null;
    resultWave: boolean | undefined;
    randomSong: RandomSong;
    props: string[];
    title?: string;
    selectAnswer: (value: string) => void;
}

const GuessAnswerProp = ({answer, isCorrect, resultWave, props, title, randomSong, selectAnswer}: GuessAnswerPropProps) => {

    const songs: string | undefined = title && clsx(
        answer && answer === title && "quiz-answers-props-button-selected",
        isCorrect !== null && randomSong.song.track.name === title && "quiz-answers-props-button-correct",
        isCorrect !== null && randomSong.song.track.name !== title && "quiz-answers-props-button-null",
        isCorrect !== null && !isCorrect && randomSong.song.track.name !== title && "quiz-answers-props-button-result-false"
    );

    const genres: string | false = !title && clsx(
        "quiz-answers-props-button",
        answer && answer === props[0] && "quiz-answers-props-button-selected",
        isCorrect !== null && props[0] === randomSong?.genre && "quiz-answers-props-button-correct",
        isCorrect !== null && props[0] !== randomSong?.genre && "quiz-answers-props-button-null",
        isCorrect !== null && !isCorrect && props[0] !== randomSong?.genre && "quiz-answers-props-button-result-false"
    );

    function onSelectAnswer(selectedProp: string) {
        if (selectAnswer) {
            selectAnswer(selectedProp);
        }
    }

    return (
        <div
            className={clsx(
                "quiz-answers-props-button",
                songs,
                genres
            )}
            onClick={() => !resultWave ? onSelectAnswer(title ? title : props[0]) : null}>
            <p className="quiz-answers-props-button-text">
                <span>
                    {title ? props.map((artist: string, index: number) => (
                        <span className="artists-name" key={index}>{artist}{props.length - 1 !== index ? ', ' : ''}</span>
                    )) : (
                        <span className="artists-name">{props[0]}</span>
                    )}
                </span>
            </p>
        </div>
    )
}

export default GuessAnswerProp;