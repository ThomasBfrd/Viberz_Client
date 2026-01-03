import "./back-button.scss";
import {useNavigate} from "react-router-dom";
import BackIcon from "../svg/back/back-icon.tsx";

interface BackButtonProps {
    disabled: boolean;
    forcePath?: string;
}

const BackButton = ({disabled, forcePath}: BackButtonProps) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (forcePath) {
            return navigate(forcePath, { replace: true });
        }

        if (history?.back && window.history.length > 1) {
            return history.back();
        }
    }

    return (
        <button
            className="back-button"
            onClick={handleNavigate}
            data-testid="edit-profile-button-back"
            disabled={disabled}
        >
            <BackIcon height="30px" width="30px" fill="#fff" />
        </button>
    )
}

export default BackButton;