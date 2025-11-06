import EditProfileComponent from "../edit-profile-page.tsx";
import {BrowserRouter} from "react-router-dom";
import {AuthContext} from "../../../../core/context/auth-context.tsx";
import {mockAuthContext} from "../../../../shared/mocks/const/mockAuthContext.ts";
import {expect, it, describe, beforeEach, vi, afterEach} from "vitest";
import {act, cleanup, render, screen, waitFor} from "@testing-library/react";
import type {UserInfos} from "../../../../shared/interfaces/user.interface.ts";
import genresService from "../../../../shared/services/genres.service.ts";
import userEvent, {type UserEvent} from "@testing-library/user-event";
import userService from "../../../../shared/services/user.service.ts";
import {type ModalSearchArtistsProps} from "../../../../shared/components/modal-search-artists/modal-artists.tsx";

const mockUserInfos: UserInfos = {
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

const mocks = vi.hoisted(() => ({
    useLocation: vi.fn(),
    useNavigate: vi.fn()
}));

vi.mock("../../../../shared/components/modal-search-artists/modal-artists.tsx", () => ({
    default: ({ addSearchedArtist, toggleModal }: ModalSearchArtistsProps) => {
        return (
            <div data-testid="modal-search-artists-mock">
                <button
                    data-testid="add-artists-button-mock"
                    onClick={() => addSearchedArtist(['Artist1', 'Artist2'])}>
                    Add Artists
                </button>
                <button
                    data-testid="add-artists-button-mock-empty"
                    onClick={() => addSearchedArtist([])}>
                    Add Artists
                </button>
                <button
                    data-testid="close-modal-button-mock"
                    onClick={() => toggleModal(false)}>
                    Save
                </button>
            </div>
        )}
}));

vi.mock("../../../../shared/services/genres.service.ts");

vi.mock("../../../../shared/services/user.service.ts");

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");

    return {
        ...actual,
        useLocation: mocks.useLocation,
        useNavigate: () => mocks.useNavigate,
    };
});

describe(EditProfileComponent.name, () => {
    const renderEditProfilePage = () => {
        return render(
            <BrowserRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <EditProfileComponent/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }

    describe("Affichage de la page d'édition du profil", () => {
        beforeEach(async () => {
            mocks.useLocation.mockReturnValue({state: {userInfos: mockUserInfos} });
            vi.mocked(genresService.getGenres).mockResolvedValue(["Trap", "Dubstep", "Drum & Bass"]);

            await act(async () => {
                renderEditProfilePage();
            });
        })

        afterEach(() => {
            vi.clearAllMocks();
            cleanup();
        })

        it('devrait afficher la page dans son intégralité avec les données du user', async () => {
            const container: HTMLElement = await screen.findByTestId("edit-profile-container");
            expect(container).toBeInTheDocument();
        })

        it('devrait afficher les boutons de navigation', () => {
            const buttonsContainer: HTMLElement = screen.getByTestId("edit-profile-buttons-navigation");
            const backButton: HTMLElement = screen.getByTestId("edit-profile-button-back");
            const saveButton: HTMLElement = screen.getByTestId("edit-profile-button-save");

            expect(buttonsContainer).toBeInTheDocument();
            expect(backButton).toBeInTheDocument();
            expect(saveButton).toBeInTheDocument();
        });

        describe("Image du profil", () => {

            it('devrait afficher la photo du user', () => {
                const profileImage: HTMLElement = screen.getByTestId("profile-image");

                expect(profileImage).toBeInTheDocument();
            })

            it("devrait permettre d'upload via l'input, une nouvelle photo de profil", async () => {
                const user = userEvent.setup();
                const profileImage: HTMLElement = screen.getByTestId("profile-image-source");
                const input: HTMLElement = screen.getByTestId("edit-profile-edit-image-input");

                expect(profileImage.getAttribute("src")).toBe("fake-image");

                await user.upload(input, new File(["new-fake-image"], "new-fake-image.png", {type: "image/png"}));

                await waitFor(() => {
                    const newProfileImage: HTMLElement = screen.getByTestId("profile-image-source");
                    expect(newProfileImage.getAttribute("src")).toBe("data:image/png;base64,bmV3LWZha2UtaW1hZ2U=");
                })
            })

            it.each([
                {type: "video/mp4", expectedSrc: "fake-image"},
                {type: "video/mov", expectedSrc: "fake-image"},
                {type: "image/gif", expectedSrc: "fake-image"},
                {type: "image/jpg", expectedSrc: "data:image/jpg;base64,bmV3LWZha2UtaW1hZ2U="},
                {type: "image/jpeg", expectedSrc: "data:image/jpeg;base64,bmV3LWZha2UtaW1hZ2U="},
                {type: "image/png", expectedSrc: "data:image/png;base64,bmV3LWZha2UtaW1hZ2U="},
            ])("devrait uploader un fichier de $type et annuler l'opération si le format n'est pas compatible", async ({type, expectedSrc}) => {
                const user = userEvent.setup();
                const profileImage: HTMLElement = screen.getByTestId("profile-image-source");
                const input: HTMLElement = screen.getByTestId("edit-profile-edit-image-input");

                expect(profileImage.getAttribute("src")).toBe("fake-image");

                await user.upload(input, new File(["new-fake-image"], "new-fake-image.mp4", {type: type}));

                const newProfileImage: HTMLElement = screen.getByTestId("profile-image-source");
                expect(newProfileImage.getAttribute("src")).toBe(expectedSrc);
            })
        })

        describe("Saisie dans le formulaire", () => {

            it('devrait afficher le formulaire', () => {
                const formContainer: HTMLElement = screen.getByTestId("edit-profile-inputs-container");
                const userNameInput: HTMLElement = screen.getByTestId("edit-profile-input-username");
                const emailInput: HTMLElement = screen.getByTestId("edit-profile-input-email");
                expect(formContainer).toBeInTheDocument();
                expect(userNameInput).toBeInTheDocument();
                expect(emailInput).toBeInTheDocument();
            });

            it.each([
                {input: "edit-profile-input-username", expectedValue: "new-username"},
                {input: "edit-profile-input-email", expectedValue: "new-email"},
            ])("devrait mettre à jour l'input lors de la saisie $expectedValue dans le champs", async ({input, expectedValue}) => {
                const user = userEvent.setup();
                const userNameInput: HTMLInputElement = screen.getByTestId(input);

                await user.clear(userNameInput);
                await user.type(userNameInput, expectedValue);

                const newUserNameInput: HTMLElement = screen.getByTestId(input);
                expect(newUserNameInput).toHaveValue(expectedValue);
            });

            it.each([
                {input: "edit-profile-input-username", errorInput: "edit-profile-error-text-username", expectedValue: "", errorMessage: "Username is required"},
                {input: "edit-profile-input-username", errorInput: "edit-profile-error-text-username", expectedValue: "aa", errorMessage: "Username must be between 3 and 15 characters"},
                {input: "edit-profile-input-username", errorInput: "edit-profile-error-text-username", expectedValue: "/a$.-*", errorMessage: "Username is not valid"},
                {input: "edit-profile-input-email", errorInput: "edit-profile-error-text-email", expectedValue: "", errorMessage: "Email is required"},
                {input: "edit-profile-input-email", errorInput: "edit-profile-error-text-email", expectedValue: "test.com", errorMessage: "Email is not valid"},
            ])("devrait afficher une erreur lors de la saisie $expectedValue dans le champs", async ({input, errorInput, expectedValue, errorMessage}) => {
                const user = userEvent.setup();
                const inputElement: HTMLInputElement = screen.getByTestId(input);

                await user.clear(inputElement);

                if (expectedValue) {
                    await user.type(inputElement, expectedValue);
                }

                const newInputElement = screen.getByTestId(input);
                const errorInputElement = screen.getByTestId(errorInput)
                expect(newInputElement).toHaveValue(expectedValue);
                expect(errorInputElement).toBeInTheDocument();
                expect(errorInputElement).toHaveTextContent(errorMessage);
            })
        })

        describe("Redirection", () => {


            it("devrait rediriger vers la page du profil au clique du submit si aucune modification n'a eu lieu", async () => {
                const user = userEvent.setup();
                const buttonSave: HTMLElement = screen.getByTestId("edit-profile-button-save");

                await user.click(buttonSave);

                expect(userService.updateUserInfos).not.toHaveBeenCalled();
                expect(mocks.useNavigate).toHaveBeenCalledTimes(1);
                expect(mocks.useNavigate).toHaveBeenCalledWith("/profile");
            })
        });

        describe("Sélection des artistes", () => {

            it("devrait ajouter des artistes via la modale", async () => {
                const user = userEvent.setup();

                expect(screen.getByTestId("edit-profile-no-artists")).toBeInTheDocument();

                const buttonAdd = screen.getAllByTestId("expandable-list");
                const buttonAddButton = screen.getAllByTestId("expandable-icon-button");
                const buttonAddText = screen.getAllByTestId("edit-options-button-text");
                expect(buttonAdd).toHaveLength(2);
                expect(buttonAddText[0]).toHaveTextContent("+");
                await user.click(buttonAddButton[0]);

                const modal = screen.getByTestId("modal-search-artists-mock");
                expect(modal).toBeInTheDocument();

                const addButton = screen.getByTestId("add-artists-button-mock");
                await user.click(addButton);

                const artistTexts = screen.getAllByTestId("edit-profile-selected-artist-text");
                expect(artistTexts).toHaveLength(2);
                expect(artistTexts[0]).toHaveTextContent("Artist1");
                expect(artistTexts[1]).toHaveTextContent("Artist2");

                expect(screen.queryByTestId("edit-profile-no-artists")).not.toBeInTheDocument();
            });

            it("devrait fermer la modale de recherche d'artistes", async () => {
                const user = userEvent.setup();

                expect(screen.getByTestId("edit-profile-no-artists")).toBeInTheDocument();

                const buttonAddButton = screen.getAllByTestId("expandable-icon-button");
                await user.click(buttonAddButton[0]);

                const modal = screen.getByTestId("modal-search-artists-mock");
                expect(modal).toBeInTheDocument();

                const closeButton = screen.getByTestId("close-modal-button-mock");
                await user.click(closeButton);

                expect(screen.queryByTestId("edit-profile-no-artists")).toBeInTheDocument();
                const modalClosed = screen.queryByTestId("modal-search-artists-mock");
                expect(modalClosed).not.toBeInTheDocument();
            });
        });

        describe("Sélection des genres", () => {

            it("devrait pouvoir permettre la sélection d'un genre", async () => {
                const user: UserEvent = userEvent.setup();
                const expandableElement: HTMLElement[] = screen.getAllByTestId("expandable-list");
                const addIcon: HTMLElement[] = screen.getAllByTestId("edit-options-button-text");
                const genreToAdd: HTMLElement[] = screen.getAllByTestId("edit-profile-select-genre");
                const expandableIconButton: HTMLElement[] = screen.getAllByTestId("expandable-icon-button");
                const genresElements: HTMLElement[] = screen.getAllByTestId("edit-profile-selected-genre-text");

                expect(expandableElement).toHaveLength(2);
                expect(addIcon).toHaveLength(1);
                expect(expandableIconButton).toHaveLength(1);
                expect(addIcon[0]).toHaveTextContent("+");
                expect(genresElements).toHaveLength(3);
                expect(genreToAdd[0]).toHaveClass("favorites-card");

                await user.click(genreToAdd[0]);
                expect(screen.getAllByTestId("edit-profile-select-genre")[0]).toHaveClass("favorites-selected-card");
                expect(screen.getAllByTestId("edit-profile-select-genre")[1]).toHaveClass("favorites-card");
                const updatedAddIcons: HTMLElement[] = screen.getAllByTestId("edit-options-button-text");
                const updatedExpandableIconButton: HTMLElement[] = screen.getAllByTestId("expandable-icon-button");
                expect(updatedAddIcons).toHaveLength(2);
                expect(updatedExpandableIconButton).toHaveLength(2);
                expect(updatedAddIcons[0]).toHaveTextContent("-")

                await user.click(updatedExpandableIconButton[0])

                const updatedGenresList: HTMLElement[] = screen.getAllByTestId("edit-profile-selected-genre-text");
                expect(updatedGenresList).toHaveLength(1);
                expect(updatedGenresList[0]).toHaveTextContent("Trap")
            })
        });
    })

    describe("Affichage des genres pré-sélectionnés", () => {

        beforeEach(async () => {
            const newMockUserInfos: UserInfos = {
                user: {
                    ...mockUserInfos.user,
                    favoriteGenres: ["Trap", "Drum & Bass"]
                },
                xp: mockUserInfos.xp
            }

            mocks.useLocation.mockReturnValue({
                state: { userInfos: newMockUserInfos }
            });

            vi.mocked(genresService.getGenres).mockResolvedValue(["Trap", "Dubstep", "Drum & Bass"]);

            await act(async () => {
                renderEditProfilePage();
            })
        })

        it("devrait afficher les genres déjà sélectionnés au chargement", async () => {
            const genresText = screen.getAllByTestId("edit-profile-selected-genre-text");
            expect(genresText).toHaveLength(2);
            expect(genresText[0]).toHaveTextContent("Trap");
            expect(genresText[1]).toHaveTextContent("Drum & Bass");
        });

        it("devrait pouvoir déselectionner un genre au clique", async () => {
            const user: UserEvent = userEvent.setup();
            const expandableElement: HTMLElement[] = screen.getAllByTestId("expandable-list");
            const genresSelected: HTMLElement[] = screen.getAllByTestId("edit-profile-select-genre");
            const expandableIconButton: HTMLElement[] = screen.getAllByTestId("expandable-icon-button");
            const expandableIconButtonText: HTMLElement[] = screen.getAllByTestId("edit-options-button-text");
            const genresElements: HTMLElement[] = screen.getAllByTestId("edit-profile-selected-genre-text");

            expect(expandableElement).toHaveLength(2);
            expect(expandableIconButton).toHaveLength(2);
            expect(genresElements).toHaveLength(2);
            expect(genresSelected[0]).toHaveClass("favorites-selected-card");
            expect(expandableIconButtonText[0]).toHaveTextContent("+");

            await user.click(expandableIconButton[0]);

            const genreToAdd: HTMLElement[] = screen.getAllByTestId("edit-profile-select-genre");
            expect(genreToAdd[0]).toHaveClass("favorites-selected-card");
            expect(genreToAdd).toHaveLength(3);

            await user.click(genreToAdd[0]);
            const updatedGenres: HTMLElement[] = screen.getAllByTestId("edit-profile-select-genre");
            expect(updatedGenres[0]).toHaveClass("favorites-card");

            const reduceGenresList: HTMLElement[] = screen.getAllByTestId("expandable-icon-button");
            await user.click(reduceGenresList[0]);
            const updatedGenresList: HTMLElement[] = screen.getAllByTestId("edit-profile-selected-genre-text");
            expect(updatedGenresList).toHaveLength(1);
            expect(updatedGenresList[0]).toHaveTextContent("Drum & Bass")
        })
    })

    describe("Affichage des artistes pré-sélectionnés", () => {

        beforeEach(async () => {
            const newMockUserInfos: UserInfos = {
                user: {
                    ...mockUserInfos.user,
                    favoriteArtists: ["Tisoki", "Viperactive"]
                },
                xp: mockUserInfos.xp
            }

            mocks.useLocation.mockReturnValue({
                state: { userInfos: newMockUserInfos }
            });

            vi.mocked(genresService.getGenres).mockResolvedValue(["Trap", "Dubstep", "Drum & Bass"]);

            await act(async () => {
                renderEditProfilePage();
            })
        })

        it("devrait afficher les artistes déjà sélectionnés au chargement", () => {
            const artistTexts = screen.getAllByTestId("edit-profile-selected-artist-text");
            const noArtistMessage = screen.queryByTestId("edit-profile-no-artists");

            expect(artistTexts).toHaveLength(2);
            expect(artistTexts[0]).toHaveTextContent("Tisoki");
            expect(artistTexts[1]).toHaveTextContent("Viperactive");
            expect(noArtistMessage).not.toBeInTheDocument();
        });
    })

    describe("Envoi du formulaire", () => {
        beforeEach(async () => {
            const newMockUserInfos: UserInfos = {
                user: {
                    ...mockUserInfos.user,
                    userName: ""
                },
                xp: mockUserInfos.xp
            }

            vi.clearAllMocks();
            vi.mocked(userService.updateUserInfos).mockResolvedValue({
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

            mocks.useLocation.mockReturnValue({
                state: { userInfos: newMockUserInfos }
            });

            vi.mocked(genresService.getGenres).mockResolvedValue(["Trap", "Dubstep", "Drum & Bass"]);

            await act(async () => {
                renderEditProfilePage();
            })
        })

        it("devrait mettre à jour le profil et rediriger vers la page du profil", async () => {
            const user = userEvent.setup();
            const userNameInput: HTMLInputElement = screen.getByTestId("edit-profile-input-username");
            const emailInput: HTMLInputElement = screen.getByTestId("edit-profile-input-email");
            const buttonSave: HTMLElement = screen.getByTestId("edit-profile-button-save");

            await user.clear(userNameInput);
            await user.clear(emailInput);
            await user.type(userNameInput, "newUsername");
            await user.type(emailInput, "newemail@test.com");
            await user.click(buttonSave);

            expect(userService.updateUserInfos).toHaveBeenCalled();
            expect(mocks.useNavigate).toHaveBeenCalledTimes(1);
            expect(mocks.useNavigate).toHaveBeenCalledWith("/profile");
        })

        it("ne devrait pas mettre à jour le profil car aucun username n'a été saisi", async () => {
            const user = userEvent.setup();
            const userNameInput: HTMLInputElement = screen.getByTestId("edit-profile-input-username");
            const buttonSave: HTMLElement = screen.getByTestId("edit-profile-button-save");

            expect(userNameInput).toHaveValue("");

            await user.click(buttonSave);

            expect(userService.updateUserInfos).not.toHaveBeenCalled();
        })
    });
})