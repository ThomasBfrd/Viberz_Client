import "./game-completed.scss";
import type {ResultGame} from "../../../../shared/interfaces/result-game.interface.ts";

export interface GameCompletedProps {
    earnedXp: number;
    resultGame: ResultGame;
    score: number;
    totalWaves: number;
    onConfirmRestart: () => void;
}

const GameCompleted = ({earnedXp, resultGame, score, totalWaves, onConfirmRestart}: GameCompletedProps) => {

    function confirmRestart() {
        return onConfirmRestart();
    }

    return (
        <div className="game-completed">
            <p className="game-completed-title">Game completed</p>
            <div className="game-completed-recap">
                <p className="recap-text">Your score is <span className="recap-value">{score}/{totalWaves - 1}</span></p>
                <p className="recap-text">You have earned {earnedXp} XP</p>
            </div>
            <div className="experience-bar">
                <div className="experience-progression-bar"
                     style={{width: ((resultGame.currentXp - resultGame.xpForPreviousLevel) / resultGame.xpForNextLevel) * 100 + '%'}}>

                </div>
                <p className="experience-progression-text">{resultGame.currentXp} / {resultGame.xpForNextLevel}</p>
            </div>
            <button className="game-completed-button" onClick={confirmRestart}>Restart</button>
        </div>
    );
};

export default GameCompleted;