import "../privacy/privacy-page.scss";
import {useNavigate} from "react-router-dom";

const LegalNoticePage = () => {

    const navigate = useNavigate();

    const onRedirect = () => {
        return navigate("/");
    }

    return (
        <div className="legal-container">
            <button className="back-button" onClick={onRedirect}>
                Back
            </button>
            <h1>Legal Notice – Viberz</h1>
            <div>
                    <h2>Publisher</h2>
                    <p>
                            Name: Thomas Bouffard (thomas.brd@gmail.com)
                    </p>
                    <p>
                            Email: contact.viberzapp@gmail.com
                    </p>
                    <p>
                            Publication Director: Thomas Bouffard
                    </p>
            </div>
            <div>
                    <h2>Hosting</h2>
                    <h3>The Viberz website is hosted by:</h3>
                    <ul>
                            <li>Host: OVH Groupe SA</li>
                            <li>Address: 2, rue Kellermann, 59100 Roubaix, France</li>
                            <li>Phone: +33 9 72 10 10 07</li>
                            <li>Host: OVH Groupe SA</li>
                    </ul>
            </div>
            <div>
                    <h2>Intellectual Property</h2>
                    <p>
                            All content on this website, including text, images, graphics, logos, audio, video, and source code,
                            is the exclusive property of Thomas Bouffard or his partners. It is protected by French and international intellectual property laws.
                            Any reproduction, representation, modification, publication, or adaptation, in whole or in part, is strictly prohibited without prior
                            written permission from the publisher.
                    </p>
            </div>
            <div>
                    <h2>Personal Data (GDPR Compliance)</h2>
                    <h3>Viberz collects only the data necessary for the operation of the service, including:</h3>
                    <ul>
                            <li>Email: retrieved via the Spotify API using OAuth2, used for contacting the user if necessary (support, important notifications, newsletter).</li>
                            <li>Username and music preferences: used to personalize the user experience within the application.</li>
                    </ul>
            </div>
            <div>
                    <h2>Data Usage and Storage</h2>
                    <p>
                            Personal data is retained only for as long as necessary for the functioning of the application
                            or to send legitimate communications (e.g., newsletter, important updates).
                    </p>
                    <p>
                            Data is used solely for account creation, personalization of the user experience, and communication with the user.
                    </p>
                    <p>
                            Data is not shared with third parties, except with services required for the website and application to function (e.g., Spotify API).
                    </p>
            </div>
            <div>
                    <h2>Browser Storage</h2>
                    <p>
                            Viberz does not use cookies. User sessions are managed using localStorage, which is automatically cleared upon logout.
                    </p>
            </div>
            <div>
                    <h2>User Rights</h2>
                    <p>Users have the right to access, correct, delete, and port their personal data.</p>
                    <p>
                            To exercise these rights, please contact contact@viberz.app.
                    </p>
            </div>
            <div>
                    <h2>Liability</h2>
                    <p>
                            The publisher cannot be held responsible for any direct or indirect damages resulting from the use of this website, including errors or service interruptions.
                    </p>
                    <p>
                            Governing Law and Dispute Resolution
                    </p>
                    <p>
                            These legal notices are governed by French law. Any disputes will be subject to the jurisdiction of the court corresponding to the publisher’s place of residence.
                    </p>
            </div>
        </div>
    )
}

export default LegalNoticePage;