import "./whitelist-form.scss";
import {useCallback, useState} from "react";
import Loader from "../loader/loader.tsx";
import {emailRegex} from "../../const/input-regex.ts";
import {userAuthService} from "../../services/user-auth.service.ts";

export interface WhitelistFormProps {
    isWhitelisted: (value: boolean) => void;
}

const WhitelistForm = ({isWhitelisted}: WhitelistFormProps) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    const onChange = useCallback((e: any) => {
        e.preventDefault();
        const email = e.target.value;
        setEmail(email);
    }, [])

    const onSubmit = async () => {
        if (email.length === 0) {
            return setError("Please enter an email");
        }

        if (!email.includes("@")) {
            return setError("Please enter a valid email");
        }

        if (!emailRegex.test(email)) {
            return setError("Please enter a valid email");
        }

        setError("");
        setLoading(true);
        
        try {
            const fetchIsWhitelisted = await userAuthService.isWhitelisted(email);
            
            if (!fetchIsWhitelisted) {
                return setError("This email is not whitelisted");
            }

            return isWhitelisted(fetchIsWhitelisted);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }

    }
    return (
        <div className="whitelist-form-container">
            {loading && <Loader/>}
            <div className={loading ? "whitelist-form-content whitelist-loading" : "whitelist-form-content"}>
                <h1>Access</h1>
                <label>Check if your email is whitelisted</label>
                <input type="text" placeholder="Email" onChange={onChange}/>
                {error && <p className="error-input" data-testid="edit-profile-error-text-email">{error}</p>}
                <button className="whitelist-submit" onClick={onSubmit}>Check</button>
            </div>
        </div>
    )
};

export default WhitelistForm;