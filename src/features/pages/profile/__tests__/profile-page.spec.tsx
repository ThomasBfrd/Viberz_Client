import {act, cleanup, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import ProfilePage from "../profile-page";
import {BrowserRouter} from 'react-router-dom';
import {AuthContext} from "../../../../core/context/auth-context";
import userEvent from "@testing-library/user-event";
import userService from "../../../../shared/services/user.service.ts";
import {mockAuthContext} from "../../../../shared/mocks/const/mockAuthContext.ts";

vi.mock("../../../../shared/services/user.service.ts");

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock
    }
})

describe(ProfilePage.name, () => {
    const renderProfilePage = () => {
        return render(
            <BrowserRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <ProfilePage/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    };

    describe("Contenu de la page du profil", () => {
        beforeEach(async () => {
            vi.mocked(userService.getUserInfos).mockResolvedValue({
                user: {
                    userName: "fake-user",
                    email: "test@gmail.com",
                    image: "fake-image",
                    userType: "fake-user-type",
                    favoriteArtists: [],
                    favoriteGenres: []
                },
                xp: {
                    userId: "fake-userId",
                    level: 0,
                    currentXp: 15,
                    xpForPreviousLevel: 0,
                    xpForNextLevel: 50,
                    gradeName: "fake-grade"
                }
            });
        })


        afterEach(() => {
            cleanup();
            vi.clearAllMocks();
        });

        it('devrait afficher un loader durant la requête getUser puis disparaitre', async () => {
            renderProfilePage();

            expect(screen.getByTestId('loader')).toBeInTheDocument();
            await waitForElementToBeRemoved(() => screen.getByTestId('loader'));

            const container: HTMLElement = await screen.findByTestId("profile-container");
            expect(container).toBeInTheDocument();
        });

        describe("Affichage des données utilisateur", () => {
            beforeEach(async () => {
                await act(async () => {
                    renderProfilePage();
                })

                await screen.findByTestId("profile-container");
            })

            it("devrait afficher les informations avec getUserservice", async () => {
                expect(screen.getByTestId('profile-container')).toBeInTheDocument();
                expect(screen.getByTestId('profile-username')).toHaveTextContent("@fake-user");
                expect(screen.getByTestId('profile-image')).toBeVisible();
                expect(screen.getByTestId('profile-image-source').getAttribute("src")).toBe("fake-image");
                expect(screen.getByTestId('profile-level')).toHaveTextContent("0");
                expect(screen.getByTestId('profile-progression-bar')).toBeVisible();
                expect(screen.getByTestId('profile-progression-text')).toHaveTextContent("15 / 50");
                expect(screen.getByTestId('profile-grade-name')).toHaveTextContent("fake-grade");
                expect(screen.getByTestId('profile-artists')).toHaveTextContent("You don't have selected artists...");
                expect(screen.getByTestId('profile-genres')).toHaveTextContent("You don't have selected genres...");
                expect(screen.getByTestId('edit-button')).toBeVisible();
            })

            it("devrait rediriger vers la page d'édition du profil", async () => {
                const user = userEvent.setup();
                const editButton = screen.getByTestId('edit-button');
                await user.click(editButton);

                expect(navigateMock).toHaveBeenCalledTimes(1);
                expect(navigateMock).toHaveBeenCalledWith("/profile/edit", {
                    state: {
                        userInfos: {
                            user: {
                                userName: "fake-user",
                                email: "test@gmail.com",
                                image: "fake-image",
                                userType: "fake-user-type",
                                favoriteArtists: [],
                                favoriteGenres: []
                            },
                            xp: {
                                userId: "fake-userId",
                                level: 0,
                                currentXp: 15,
                                xpForPreviousLevel: 0,
                                xpForNextLevel: 50,
                                gradeName: "fake-grade"
                            }
                        }
                    }
                });
            })
        })
    })

    describe("Affichage des préférences utilisateurs (genres, artistes", () => {
        beforeEach(async () => {
            vi.mocked(userService.getUserInfos).mockResolvedValue({
                user: {
                    userName: "fake-user",
                    email: "test@gmail.com",
                    image: "fake-image",
                    userType: "fake-user-type",
                    favoriteArtists: ["Viperactive", "Skrillex"],
                    favoriteGenres: ["EDM Trap", "Dubstep"]
                },
                xp: {
                    userId: "fake-userId",
                    level: 0,
                    currentXp: 15,
                    xpForPreviousLevel: 0,
                    xpForNextLevel: 50,
                    gradeName: "fake-grade"
                }
            });

            await act(async () => {
                renderProfilePage();
            })
        })
        it("devrait afficher les artistes et genres sélectionnés", async () => {

            const container: HTMLElement = await screen.findByTestId("profile-container");
            expect(container).toBeInTheDocument();

            const allSelectedArtists = screen.getAllByTestId("profile-artists");
            expect(allSelectedArtists).toHaveLength(2);
            expect(allSelectedArtists[0]).not.toHaveTextContent("You don't have selected artists...")

            const allSelectedGenres = screen.getAllByTestId("profile-genres");
            expect(allSelectedGenres).toHaveLength(2);
            expect(allSelectedGenres[0]).not.toHaveTextContent("You don't have selected genres...")
        });
    })
});