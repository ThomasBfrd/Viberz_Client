import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, cleanup, render, screen} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {mockAuthContext} from "../../../../shared/mocks/const/mockAuthContext.ts";
import GuessPage from "../guess-page.tsx";

describe(GuessPage.name, () => {
    const renderEditProfilePage = () => {
        return render(
            <BrowserRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <GuessPage />
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }

    describe("Affichage de la page Guess", () => {
        beforeEach(async () => {

            await act(async () => {
                renderEditProfilePage();
            });
        })

        afterEach(() => {
            vi.clearAllMocks();
            cleanup();
        })

        it('devrait afficher le contenu de la page guess', async () => {
            const container: HTMLElement = await screen.findByTestId("guess-page-container");
            expect(container).toBeInTheDocument();
        })
    })
});