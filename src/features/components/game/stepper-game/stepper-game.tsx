import "./stepper-game.scss";

export interface StepperGameProps {
    wave: number;
    totalWaves: number;
}

const StepperGame = ({wave, totalWaves}: StepperGameProps) => {
    return (
        <div className="quiz-header">
            <p className="quiz-text">Question {wave}/{totalWaves-1}</p>
            <div className="quiz-step" style={{width: `${((wave) / (totalWaves - 1)) * 100}%`}}></div>
            <div className="quiz-step-completed"></div>
        </div>
    )
}

export default StepperGame;