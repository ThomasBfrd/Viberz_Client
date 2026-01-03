import './expandable-list.scss';
import AddLessIcon from "../add-less-icon/add-less-icon.tsx";

interface ExpandableListProps {
    title: string;
    subTitle: string;
    displayButton?: boolean;
    toggleExpand: () => void;
    forceIcon?: boolean;
}

const ExpandableList = ({title, subTitle, displayButton, toggleExpand, forceIcon}: ExpandableListProps) => {

    return (
        <div className="favorites" data-testid="expandable-list">
            <p className="title">{title}</p>
            <span className="sub-title">{subTitle}</span>
            {displayButton && <AddLessIcon toggleExpand={toggleExpand} forceIcon={forceIcon}/>}
        </div>
    )
}

export default ExpandableList;