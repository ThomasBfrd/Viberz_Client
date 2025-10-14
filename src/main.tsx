import {createRoot} from 'react-dom/client'
import App from "./App.tsx";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./core/context/auth-context.tsx";
// import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <AuthProvider>
        <BrowserRouter basename="/">
            <App/>
        </BrowserRouter>
    </AuthProvider>
    // </StrictMode>,
)
