import "./modal-overlay.scss";
import CloseIcon from "../svg/close/close-icon.tsx";
import type {ReactNode} from "react";

export interface ModalOverlayProps {
    closed?: () => void;
    isClosable?: boolean;
    children: ReactNode;
}

const ModalOverlay = ({closed, isClosable = true, children}: ModalOverlayProps) => {

    function handleCancel() {
        if (closed) {
            return closed();
        }

        return;
    }

   return (
       <div className="modal-overlay">
           <div className="modal-overlay-container" data-testid="modal-container">
               {isClosable && (
                   <button className="modal-overlay-close-button" onClick={handleCancel}>
                       <CloseIcon />
                   </button>
               )}
               {children}
           </div>
       </div>
   );
}

export default ModalOverlay;