import {afterEach, describe, expect, it, vi} from "vitest";
import {act, cleanup, render, screen} from "@testing-library/react";
import EventAction, {type EventType, type ModalProps} from "../event-action.tsx";
import userEvent from "@testing-library/user-event";

describe(EventAction.name, () => {
    const defaultProps: ModalProps = {
        eventType: "success" as EventType,
        message: "Success test",
        handleClose: vi.fn(),
        handleSubmit: vi.fn(),
    };

    const errorProps: ModalProps = {
        ...defaultProps,
        eventType: "error" as EventType,
        message: "Error test",
    };

    const infoProps: ModalProps = {
        ...defaultProps,
        eventType: "info" as EventType,
        message: "Information test"
    };

    const warningProps: ModalProps = {
        ...defaultProps,
        eventType: "warning" as EventType,
        message: "Warning test",
    };

    describe("Affichage du contenu de la modal", () => {

        afterEach(() => {
            cleanup();
            vi.clearAllMocks();
        })

        it.each([
            {type: "success", title: "Success!", componentProps: defaultProps},
            {type: "error", title: "Oops...", componentProps: errorProps},
            {type: "info", title: "Information:", componentProps: infoProps},
            {type: "warning", title: "Warning!", componentProps: warningProps},
            ])('devrait afficher la modal en $type', async ({type, title, componentProps}) => {

                await act(async () => {
                    render(<EventAction {...componentProps} />);
                })

                const modalContainer: HTMLElement | null = screen.queryByTestId("event-modal-container");
                expect(modalContainer).toBeInTheDocument();

                const titleElement: HTMLElement = screen.getByTestId("event-modal-title");
                const messageElement: HTMLElement = screen.getByTestId("event-modal-message");
                expect(titleElement).toHaveTextContent(title);
                expect(messageElement).toHaveTextContent(componentProps.message);

                if (type === "warning") {
                    const cancelButton: HTMLElement | null = screen.queryByTestId("event-modal-cancel-button");
                    expect(cancelButton).toBeInTheDocument();
                }

                const actionButton: HTMLElement | null = screen.queryByTestId("event-modal-action-button");
                expect(actionButton).toBeInTheDocument();
        });

        it("devrait fermer la modale de confirmation si l'utilisateur clique sur cancel", async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<EventAction {...warningProps} />);
            })

            const modalContainer: HTMLElement | null = screen.queryByTestId("event-modal-container");
            expect(modalContainer).toBeInTheDocument();

            const cancelButton: HTMLElement = screen.getByTestId("event-modal-cancel-button");
            expect(cancelButton).toBeInTheDocument();

            await user.click(cancelButton);
            expect(warningProps.handleClose).toHaveBeenCalledOnce();
        })

        it("devrait fermer la modale lors du clique sur OK", async () => {
            const user = userEvent.setup();
            await act(async () => {
                render(<EventAction {...defaultProps} />);
            })

            const modalContainer: HTMLElement | null = screen.queryByTestId("event-modal-container");
            expect(modalContainer).toBeInTheDocument();

            const actionButton: HTMLElement = screen.getByTestId("event-modal-action-button");
            expect(actionButton).toBeInTheDocument();

            await user.click(actionButton);
            expect(warningProps.handleClose).toHaveBeenCalledOnce();
        })
    })

})