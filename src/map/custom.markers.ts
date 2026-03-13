/*

Edit this file to add custom markers to the map.
uNmINeD does not overwrite this file during map generation.

Steps:
    1. Change isEnabled to true to display the markers
    2. Change or remove the example markers
    3. Add your own markers
    4. Run `npm run build` to compile

Marker properties:
    x, z          - Minecraft block coordinates
    image         - marker image URL
    imageScale    - scale of the image (1 = full size, 0.5 = half size)
    imageAnchor   - [0.5, 1] = tip of pin at center-bottom of image
    text          - label text
    textColor     - text color (CSS format)
    offsetX/Y     - pixel offset of the text
    font          - text font (CSS format)

*/

var UnminedCustomMarkers: CustomMarkers = {

    isEnabled: false,

    markers: [

        // Example 1: Simple pin marker
        {
            x: -200,
            z: -200,
            image: "custom.pin.png",
            imageAnchor: [0.5, 1],
            imageScale: 0.5
        },

        // Example 2: Pin with label
        {
            x: 0,
            z: 0,
            image: "custom.pin.png",
            imageAnchor: [0.5, 1],
            imageScale: 0.5,
            text: "Marker with text",
            textColor: "red",
            offsetX: 0,
            offsetY: 20,
            font: "bold 20px Calibri,sans serif"
        },

        // Example 3: Text only
        {
            x: 200,
            z: 200,
            text: "Text only",
            textColor: "yellow",
            offsetX: 0,
            offsetY: 0,
            font: "bold 50px Calibri,sans serif"
        }

        // Add your markers above this line

    ]
};
