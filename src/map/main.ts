document.title = UnminedMapProperties.worldName + " - " + document.title;

if (UnminedCustomMarkers?.isEnabled && UnminedCustomMarkers.markers) {
    UnminedMapProperties.markers = (UnminedMapProperties.markers ?? []).concat(UnminedCustomMarkers.markers);
}

if (Array.isArray(UnminedPlayers) && UnminedPlayers.length > 0) {
    UnminedMapProperties.playerMarkers = Unmined.createPlayerMarkers(UnminedPlayers);
}

const mapElement = document.getElementById('map') as HTMLElement;
const unmined = new Unmined(mapElement, UnminedMapProperties, UnminedRegions);

document.getElementById('grid-toggle')!.addEventListener('click', () => {
    unmined.toggleGrid();
});
