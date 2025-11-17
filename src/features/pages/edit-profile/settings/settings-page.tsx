import "./settings-page.scss";
import emailjs from "@emailjs/browser";
import {useContext, useState, useRef, type RefObject, type FormEvent} from "react";
import userService from "../../../../shared/services/user.service.ts";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {useNavigate} from "react-router-dom";
import ModalOverlay from "../../../../shared/components/modal-overlay/modal-overlay.tsx";
import EventAction from "../../../../shared/components/event-action/event-action.tsx";

export interface SettingsPageProps {
    jwtToken: string;
    userId: string;
    email: string;
}

const SettingsPage = ({jwtToken, userId, email}: SettingsPageProps) => {
    const [openBugSignal, setOpenBugSignal] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<string>("");
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();

    const form: RefObject<HTMLFormElement | null> = useRef(null);
    const sendEmail = (e: FormEvent) => {
        e.preventDefault();

        if (!form.current) return;

        const message: {userId: string, email: string, message: HTMLFormElement | string} = {
            userId: userId,
            email: email,
            message: form.current.message.value,
        }

        emailjs.send(import.meta.env.VITE_SERVICE_EMAIL_ID, import.meta.env.VITE_TEMPLATE_EMAIL_ID, message, import.meta.env.VITE_PUBLIC_EMAIL_KEY)
            .then(() => {
                setEmailSent(true);
            })
            .catch((error: unknown) => {
                setErrorEmail("Error sending email. Please try again later.")
                if (!(error instanceof Error)) return;
                console.error(error.message);
            });
    }

    const logoutAndRedirect = () => {
        logout();
        return navigate("/")
    }

    const handleDeleteAccount = async () => {
        try {
            const deleteUser = await userService.deleteUser(jwtToken, userId);

            if (deleteUser) {
                return logoutAndRedirect();
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="settings-container">
            {errorEmail.length > 0 || emailSent && (
                <ModalOverlay
                    isClosable={false}
                    children={<EventAction
                        eventType={errorEmail.length > 0 ? "error" : "success"}
                        handleClose={() => setOpenBugSignal(!openBugSignal)}
                        message={errorEmail.length > 0 ? errorEmail : "Email sent successfully."} />}
                />
            )}
            <div className="settings-content">
                <h3 className="settings-title">Settings</h3>
                <button className="delete-account button-settings" onClick={handleDeleteAccount}>Delete your account</button>
                <button
                    className="signal-bug button-settings"
                    onClick={() => setOpenBugSignal(!openBugSignal)}
                >Report a Bug</button>
                <button
                    className="logout button-settings"
                    onClick={() => logoutAndRedirect()}
                >Log out</button>
                {openBugSignal ? (
                    <form className="bug-signal" ref={form} onSubmit={sendEmail} data-testid="bug-signal-form">
                        <h3 className="bug-signal-text">Report a Bug</h3>
                        <p className="bug-signal-text bug-description">Describe the issue</p>
                        <textarea
                            className="bug-signal-input"
                            placeholder="The “Play” button doesn’t work on the Guess Genre"
                            name="message"
                            required
                        />
                        <div className="bug-action-buttons">
                            <button
                                className="cancel-bug bug-button"
                                onClick={() => setOpenBugSignal(!openBugSignal)}>
                                Cancel
                            </button>
                            <button
                                className="send-bug bug-button"
                                type="submit">
                                Submit
                            </button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    )
}

export default SettingsPage;