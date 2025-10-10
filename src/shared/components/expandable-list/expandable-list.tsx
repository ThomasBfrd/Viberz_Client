import './expandable-list.scss';
import {useState} from "react";

interface ExpandableListProps {
    title: string;
    subTitle: string;
    toggleExpand: () => void;
    forceIcon?: boolean;
}

const ExpandableList = ({title, subTitle, toggleExpand, forceIcon}: ExpandableListProps) => {
    const [displayed, setDisplayed] = useState<boolean>(false);

    const changeDisplay = () => {
        setDisplayed(!displayed);
        toggleExpand();
    }

    return (
        <div className="favorites">
            <p className="title">{title}</p>
            <span className="sub-title">{subTitle}</span>
            <button className="edit-options-button" onClick={changeDisplay}>
                <span className="edit-options-button-text">{displayed && !forceIcon ? "-" : "+"}</span>
            </button>
        </div>
    )
}

export default ExpandableList;