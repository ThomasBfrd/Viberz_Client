import React from 'react';
import './modal.scss';

export type EventType = "success" | "error" | "info" | "warning";

export interface EventStatus {
    message: string;
    messageActionButton: string;
    messageCancelButton?: string;
    hasSubmitAction?: boolean;
}

export const eventModalType: Record<EventType, EventStatus> = {
    success: {
        message: "Success!",
        messageActionButton: "Close",
    },
    error: {
        message: "Oops...",
        messageActionButton: "Close",
    },
    info: {
        message: "Information:",
        messageActionButton: "Close",
    },
    warning: {
        message: "Warning!",
        messageActionButton: "Ok",
        messageCancelButton: "Cancel",
        hasSubmitAction: true,
    },
};

export interface ModalProps {
    eventType: EventType;
    message: string;
    handleClose: () => void;
    handleSubmit?: () => void;
}

const Modal: React.FC<ModalProps> = ({ eventType, message, handleClose, handleSubmit }) => {
    const { message: baseMessage, messageActionButton, messageCancelButton, hasSubmitAction } =
        eventModalType[eventType];

    const showCancelButton = Boolean(messageCancelButton);
    const showSubmitButton = hasSubmitAction && handleSubmit;

    const onActionClick = showSubmitButton ? handleSubmit! : handleClose;

    return (
        <div className="modal-container">
            <div className={`modal-content`}>
                <p className="modal-title">{baseMessage}</p>
                <p className="modal-message">{message}</p>

                <div className="modal-buttons">
                    {showCancelButton && (
                        <button onClick={handleClose} className="modal-button modal-cancel">
                            {messageCancelButton}
                        </button>
                    )}
                    <button onClick={onActionClick} className="modal-button modal-action">
                        {messageActionButton}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
