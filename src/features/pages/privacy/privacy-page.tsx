import "./privacy-page.scss";
import {useNavigate} from "react-router-dom";

const PrivacyPage = () => {
    const navigate = useNavigate();

    const onRedirect = () => {
        return navigate("/");
    }

    return (
        <div className="legal-container">
            <button className="back-button" onClick={onRedirect}>
                Back
            </button>
            <h1>Privacy Policy – Viberz</h1>
            <div>
                <h2>Publisher</h2>
                <p>Name: Thomas Bouffard (thomas.brd@gmail.com)</p>
                <p>Email: contact.viberzapp@gmail.com</p>
            </div>
            <div>
                <h2>Hosting</h2>
                <h3>The Viberz website is hosted by:</h3>
                <ul>
                    <li>Host: OVH Groupe SA</li>
                    <li>Address: 2, rue Kellermann, 59100 Roubaix, France</li>
                    <li>Phone: +33 9 72 10 10 07</li>
                </ul>
            </div>
            <div>
                <h2>Intellectual Property</h2>
                <p>
                    All content on this website, including text, images, graphics, logos, audio, video, and source code,
                    is the exclusive property of Thomas Bouffard or his partners and is protected by French and international intellectual property laws.
                    Any reproduction, modification, distribution, or public use, in whole or in part, is prohibited without prior written permission.
                </p>
            </div>
            <div>
                <h2>Personal Data Collection and Use</h2>
                <h3>Viberz collects only the data necessary to operate the application:</h3>
                <ul>
                    <li>
                        Email: obtained via the Spotify API with OAuth2; used to contact users if needed (support, important notifications, newsletter).
                    </li>
                    <li>
                        Username and music preferences: used to personalize the user experience.
                    </li>
                </ul>
            </div>
            <div>
                <h2>Data Handling</h2>
                <p>
                    Data is retained only as long as necessary for the application to function or to send legitimate communications.
                </p>
                <p>
                    Data is used solely for account creation, personalization, and communication with the user.
                </p>
                <p>
                    Data is not shared with third parties, except for services essential for the app to function (e.g., Spotify API).
                </p>
            </div>
            <div>
                <h2>Browser Storage</h2>
                <p>Viberz does not use cookies. User sessions are managed via localStorage, which is automatically cleared upon logout.</p>
            </div>
            <div>
                <h2>User Rights</h2>
                <p>Users can exercise their rights to access, correct, delete, or export their personal data. To do so, contact contact@viberz.app.</p>
            </div>
            <div>
                <h2>Liability</h2>
                <p>
                    The publisher is not liable for any direct or indirect damages resulting from the use of the website or app, including errors
                    or service interruptions.
                </p>
            </div>
            <div>
                <h2>Governing Law and Disputes</h2>
                <p>This Privacy Policy is governed by French law. Any disputes will be subject to the jurisdiction of the court corresponding
                    to the publisher’s place of residence.</p>
            </div>
        </div>
    )
}

export default PrivacyPage;