import {describe, expect, it, vi} from "vitest";
import {initiateSpotifyAuth} from "../authentication.service.ts";

vi.stubEnv("VITE_RESPONSE_TYPE", "code");
vi.stubEnv("VITE_SPOTIFY_CLIENT_ID", "client123");
vi.stubEnv("VITE_SCOPES", "user-read-email");
vi.stubEnv("VITE_REDIRECT_URI", "http://localhost:3000/callback");

describe(initiateSpotifyAuth.name, () => {

    it("devrait appeler l'API de Spotify pour générer un code d'autorisation", () => {
        const hrefMock = vi.fn();
        const mockParams = new URLSearchParams({
            response_type: "code",
            client_id: "client123",
            scope: "user-read-email",
            redirect_uri: "http://localhost:3000/callback",
        })

        vi.spyOn(window, "location", "get").mockReturnValue({
            set href(url: string) {
                hrefMock(url);
            },
        } as Location);

        initiateSpotifyAuth();

        const expectedUrl = `https://accounts.spotify.com/authorize?${mockParams.toString()}`;

        expect(hrefMock).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    });
})