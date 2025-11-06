import './expandable-list.scss';
import {useState} from "react";

interface ExpandableListProps {
    title: string;
    subTitle: string;
    displayButton?: boolean;
    toggleExpand: () => void;
    forceIcon?: boolean;
}

const ExpandableList = ({title, subTitle, displayButton, toggleExpand, forceIcon}: ExpandableListProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);

    const changeDisplay = () => {
        setDisplayed(!displayed);
        toggleExpand();
    }

    function displayIcon(): string {
        if (!displayed && forceIcon) {
            return "+";
        }

        if (!displayed && !forceIcon) {
            return "-";
        }

        return "+"
    }

    return (
        <div className="favorites" data-testid="expandable-list">
            <p className="title">{title}</p>
            <span className="sub-title">{subTitle}</span>
            {displayButton ? (
                <button className="edit-options-button"
                        data-testid="expandable-icon-button"
                        onClick={changeDisplay}>
                        <span
                            className="edit-options-button-text"
                            data-testid="edit-options-button-text"
                        >{displayIcon()}</span>
                </button>
            ) : null}
        </div>
    )
}

export default ExpandableList;