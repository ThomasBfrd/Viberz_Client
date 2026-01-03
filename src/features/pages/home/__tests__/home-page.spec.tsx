import HomePage from "../home-page.tsx";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {cleanup, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {mockAuthContext} from "../../../../shared/mocks/const/mockAuthContext.ts";
import {userEvent} from "@testing-library/user-event";
import type {AuthContextInterface} from "../../../../core/interfaces/auth-context.interface.ts";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock
    }
})

describe(HomePage.name, () => {
    const key: string = "user";
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    describe("Affichage de la page sans être connecté", () => {
        const notConnected: AuthContextInterface = {
            ...mockAuthContext,
            isLoggedIn: false
        };
        const renderHomePage = () => {
            return render(
                <BrowserRouter>
                    <AuthContext.Provider value={notConnected}>
                        <HomePage/>
                    </AuthContext.Provider>
                </BrowserRouter>
            );
        }

        describe("Contenu de la page d'accueil", () => {
            beforeEach(() => {
                renderHomePage();
            })

            afterEach(() => {
                cleanup();
                vi.clearAllMocks();
                localStorage.clear();
            })

            it('devrait afficher la page Home', async () => {

                const container: HTMLElement = await screen.findByTestId("home-container");
                expect(container).toBeInTheDocument();

                expect(screen.getByTestId("loader")).toBeInTheDocument();
                await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

                const notConnected: HTMLElement = await screen.findByTestId("home-not-connected");
                expect(notConnected).toBeInTheDocument();
                expect(screen.getByTestId("home-connect-button")).toBeInTheDocument();
            });
        })
    })

    describe("Affichage de la page en étant connecté", () => {
        const renderHomePage = () => {
            return render(
                <BrowserRouter>
                    <AuthContext.Provider value={mockAuthContext}>
                        <HomePage/>
                    </AuthContext.Provider>
                </BrowserRouter>
            );
        }

        describe("Contenu de la page d'accueil", () => {
            beforeEach(() => {
                localStorage.setItem(key, JSON.stringify({
                    username: "fake-user",
                    image: "fake-image"
                }))

                renderHomePage();
            })

            afterEach(() => {
                cleanup();
                vi.clearAllMocks();
                localStorage.clear();
            })

            it('devrait afficher la page Home', async () => {

                const container: HTMLElement = await screen.findByTestId("home-container");
                expect(container).toBeInTheDocument();

                expect(screen.getByTestId("loader")).toBeInTheDocument();
                await waitForElementToBeRemoved(() => screen.getByTestId("loader"));

                const username: HTMLElement = await screen.findByTestId("home-username");
                expect(getItemSpy).toHaveBeenCalledWith(key);
                expect(username).toHaveTextContent("Hello, fake-user");

            });

            it("devrait afficher les types de menu", () => {
                const menuTypes: HTMLElement[] = screen.getAllByTestId("home-menu-item");
                const menuTypesNames = ["All", "Play", "Listen", "Learn"];
                expect(menuTypes).toHaveLength(4);
                menuTypesNames.forEach((name, index) => {
                    expect(menuTypes[index]).toHaveTextContent(name);
                })
            })

            it("devrait afficher les catégories", () => {
                const categoriesElements: HTMLElement[] = screen.getAllByTestId("home-category-name");
                const categoriesName = ["Guess the genre", "Guess the song", "Share and discover", "Learn the structures"];
                expect(categoriesElements).toHaveLength(4);
                categoriesName.forEach((name, index) => {
                    expect(categoriesElements[index]).toHaveTextContent(name);
                })
            })

            it.each([
                {type: "All", expectedCount: 4},
                {type: "Play", expectedCount: 2},
                {type: "Listen", expectedCount: 1},
                {type: "Learn", expectedCount: 1},
            ])("devrait afficher $expectedCount catégories au clique du type $type", async ({type, expectedCount}) => {
                const user = userEvent.setup();
                const menuType: HTMLElement = screen.getByText(type);
                await user.click(menuType);
                const categoriesElements: HTMLElement[] = screen.getAllByTestId("home-category-name");
                expect(categoriesElements).toHaveLength(expectedCount);
            })

            it.each([
                {name: "Guess the genre", path: "/guess-genre"},
                {name: "Guess the song", path: "/guess-song"},
                {name: "Share and discover", path: "/discover"},
                {name: "Learn the structures", path: "/learn-structures"},
            ])("devrait rediriger vers $path au clique sur la catégorie $name", async ({name, path}) => {
                const user = userEvent.setup();
                const category: HTMLElement = screen.getByText(name);
                await user.click(category);
                expect(navigateMock).toHaveBeenCalledTimes(1);
                expect(navigateMock).toHaveBeenCalledWith(path);
            })
        })
    })


});