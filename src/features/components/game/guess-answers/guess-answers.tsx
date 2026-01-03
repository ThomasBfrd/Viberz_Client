import "./guess-genre-answers.scss";
import type {OtherRandomSong, RandomSong} from "../../../../shared/interfaces/guess-song.interface.ts";
import {ACTIVITY_TYPE} from "../../../../shared/enums/activities.enum.ts";
import GuessAnswerProp from "../guess-answer-prop/guess-answer-prop.tsx";

export interface GuessAnswersProps {
    randomSong: RandomSong | null;
    otherGenres?: Array<string>;
    otherSongs?: Array<OtherRandomSong>;
    gameType: ACTIVITY_TYPE;
    answer: string | null;
    isCorrect: boolean | null;
    resultWave?: boolean | undefined;
    selectedGenre?: (genre: string) => void;
    selectedTitle?: (song: string) => void;
}

const GuessAnswers = ({
                               randomSong,
                               otherGenres,
                               otherSongs,
                               gameType,
                               answer,
                               isCorrect,
                               resultWave,
                               selectedGenre,
                               selectedTitle
                           }: GuessAnswersProps) => {

    function onSelectGenre(genre: string) {
        if (selectedGenre) {
            selectedGenre(genre);
        }
    }

    function onSelectTitleSong(song: string) {
        if (selectedTitle) {
            selectedTitle(song);
        }
    }

    return (
        <div className="quiz-answers">
            <p className="quiz-answers-text">{gameType === ACTIVITY_TYPE.GUESS_GENRE ? "What category is this?" : "Who produced this track?"}</p>
            <div className="quiz-answers-props">
                {gameType === ACTIVITY_TYPE.GUESS_GENRE ? (
                    randomSong && otherGenres && otherGenres.map((genre: string, index: number) => (
                        <GuessAnswerProp
                            key={index}
                            answer={answer}
                            isCorrect={isCorrect}
                            resultWave={resultWave}
                            props={[genre]}
                            randomSong={randomSong}
                            selectAnswer={onSelectGenre}/>
                    ))
                ) : (
                    <>
                    {randomSong && otherSongs && otherSongs.map((song: OtherRandomSong, index: number) => (
                        <GuessAnswerProp
                            key={index}
                            answer={answer}
                            isCorrect={isCorrect}
                            resultWave={resultWave}
                            props={song.artists}
                            randomSong={randomSong}
                            title={song.title}
                            selectAnswer={onSelectTitleSong}/>
                    ))}
                    </>
                    )
                }
            </div>
        </div>
    )
}

export default GuessAnswers;