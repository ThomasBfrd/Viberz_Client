import {useMemo} from "react";
import "./add-less-icon.scss";

interface AddLessIconProps {
    initialValue: boolean;
    forceIcon?: boolean;
    onlyAdd?: boolean;
    toggleExpand: () => void;
}

const AddLessIcon = ({initialValue, toggleExpand, onlyAdd, forceIcon}: AddLessIconProps) => {

    const changeDisplay = () => {
        toggleExpand();
    }

    const displayIcon = useMemo(() => {
        if (forceIcon || onlyAdd) {
            return "+";
        }

        return initialValue ? "-" : "+"
    }, [forceIcon, initialValue, onlyAdd])

    return (
        <button className="edit-options-button"
                data-testid="expandable-icon-button"
                onClick={changeDisplay}>
                <span
                    className="edit-options-button-text"
                    data-testid="edit-options-button-text"
                >{displayIcon}
                </span>
        </button>
    )
}

export default AddLessIcon;