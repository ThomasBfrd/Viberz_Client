import Loader from "../../../shared/components/loader/loader.tsx";
import './pre-select-genres-game.scss';
import {useCallback, useState} from "react";

interface PreSelectGenresGameProps {
    allGenres: string[];
    startGameWithGenres: (genres: string[]) => void;
}

const PreSelectGenresGame = ({allGenres, startGameWithGenres}: PreSelectGenresGameProps) => {
    const [genres, setGenres] = useState<string[]>([]);

    const onStartGameWithGenres = useCallback(() => {
        return startGameWithGenres(genres);
    }, [genres, startGameWithGenres]);

    const onSelectGenre = useCallback((genre: string) => {
        if (genres.length > 0 && genres.includes(genre)) {
            return setGenres([...genres.filter((genreItem) => genreItem !== genre)])
        }

        if (genres.length < 3 && !genres.includes(genre)) {
            return setGenres([...genres, genre]);
        }
    }, [genres]);

    return (
        <div className="select-genres-container">
            <div className="select-genres-content">
                <p className="guess-song-debut">Select genres (max 3)</p>
                <div className="select-genres-list">
                    {allGenres ? allGenres.map((genre: string, index: number) => (
                        <label htmlFor="select-genre" key={index} className="select-genre-item">
                            <button
                                className={genres.includes(genre) ? "select-genre-button selected-genre-button" : "select-genre-button"}
                                type="button"
                                value={genre}
                                disabled={genres.length === 3 && !genres.includes(genre)}
                                onClick={() => onSelectGenre(genre)}>
                                {genre}</button>
                        </label>
                    )) : (
                        <Loader />
                    )}
                </div>
                <button type="submit"
                        className={genres.length === 0 || genres.length > 3 ? "submit-selected-genres quiz-action-button disabled" : "submit-selected-genres quiz-action-button"}
                        onClick={() => onStartGameWithGenres()}>
                    Save and play
                </button>
            </div>
        </div>
    )
}

export default PreSelectGenresGame;