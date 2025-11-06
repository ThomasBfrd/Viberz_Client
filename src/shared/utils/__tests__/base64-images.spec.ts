import {describe, expect, it} from "vitest";
import {base64ToImage} from "../base64-images.ts";

describe("conversion de l'image", () => {

    it("devrait ajouter le prefix de data pour l'image reçue", () => {
        const image: string = "abcd1234.png";
        const convertedImage: string = base64ToImage(image);

        expect(convertedImage).toEqual("data:image/jpeg;base64,abcd1234.png");
    });
})