import {useState} from "react";
import "./add-less-icon.scss";

interface AddLessIconProps {
    forceIcon?: boolean;
    onlyAdd?: boolean;
    toggleExpand: () => void;
}

const AddLessIcon = ({toggleExpand, onlyAdd, forceIcon}: AddLessIconProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);

    const changeDisplay = () => {
        setDisplayed(!displayed);
        toggleExpand();
    }

    function displayIcon(): string {
        if (!displayed && forceIcon) {
            return "+";
        }

        if (displayed && !forceIcon && !onlyAdd) {
            return "-";
        }

        return "+"
    }

    return (
        <button className="edit-options-button"
                data-testid="expandable-icon-button"
                onClick={changeDisplay}>
                        <span
                            className="edit-options-button-text"
                            data-testid="edit-options-button-text"
                        >{displayIcon()}</span>
        </button>
    )
}

export default AddLessIcon;