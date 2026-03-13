"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RedDotMarker_instances, _a, _RedDotMarker_source, _RedDotMarker_layer, _RedDotMarker_map, _RedDotMarker_dataProjection, _RedDotMarker_viewProjection, _RedDotMarker_hashChanged, _RedDotMarker_setRedDotMarker, _Unmined_instances, _Unmined_scaleLine, _Unmined_options, _Unmined_createGraticuleLayer, _Unmined_initProjections;
class RegionMap {
    constructor(regionMap, tileSize, worldMinX, worldMinZ, worldWidth, worldHeight) {
        this.regionMap = regionMap;
        this.tileSize = tileSize;
        this.worldMinX = worldMinX;
        this.worldMinZ = worldMinZ;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }
    hasTile(tileX, tileZ, unminedZoomLevel) {
        const zoomFactor = Math.pow(2, unminedZoomLevel);
        const minTileX = Math.floor(this.worldMinX * zoomFactor / this.tileSize);
        const minTileZ = Math.floor(this.worldMinZ * zoomFactor / this.tileSize);
        const maxTileX = Math.ceil((this.worldMinX + this.worldWidth) * zoomFactor / this.tileSize) - 1;
        const maxTileZ = Math.ceil((this.worldMinZ + this.worldHeight) * zoomFactor / this.tileSize) - 1;
        if (tileX < minTileX || tileZ < minTileZ || tileX > maxTileX || tileZ > maxTileZ) {
            return false;
        }
        const tileBlockSize = this.tileSize / zoomFactor;
        const tileBlockPoint = {
            x: tileX * tileBlockSize,
            z: tileZ * tileBlockSize
        };
        const tileRegionPoint = {
            x: Math.floor(tileBlockPoint.x / 512),
            z: Math.floor(tileBlockPoint.z / 512)
        };
        const tileRegionSize = Math.ceil(tileBlockSize / 512);
        for (let x = tileRegionPoint.x; x < tileRegionPoint.x + tileRegionSize; x++) {
            for (let z = tileRegionPoint.z; z < tileRegionPoint.z + tileRegionSize; z++) {
                const group = {
                    x: Math.floor(x / 32),
                    z: Math.floor(z / 32)
                };
                const entry = this.regionMap.find(e => e.x === group.x && e.z === group.z);
                if (entry) {
                    const relX = x - group.x * 32;
                    const relZ = z - group.z * 32;
                    const inx = relZ * 32 + relX;
                    const b = entry.m[Math.floor(inx / 32)];
                    const bit = inx % 32;
                    if ((b & (1 << bit)) !== 0)
                        return true;
                }
            }
        }
        return false;
    }
}
class RedDotMarker {
    constructor(map, dataProjection, viewProjection) {
        _RedDotMarker_instances.add(this);
        _RedDotMarker_source.set(this, void 0);
        _RedDotMarker_layer.set(this, void 0);
        _RedDotMarker_map.set(this, void 0);
        _RedDotMarker_dataProjection.set(this, void 0);
        _RedDotMarker_viewProjection.set(this, void 0);
        __classPrivateFieldSet(this, _RedDotMarker_map, map, "f");
        __classPrivateFieldSet(this, _RedDotMarker_dataProjection, dataProjection, "f");
        __classPrivateFieldSet(this, _RedDotMarker_viewProjection, viewProjection, "f");
        __classPrivateFieldSet(this, _RedDotMarker_source, new ol.source.Vector({ features: [] }), "f");
        __classPrivateFieldSet(this, _RedDotMarker_layer, new ol.layer.Vector({
            source: __classPrivateFieldGet(this, _RedDotMarker_source, "f"),
            zIndex: 1000
        }), "f");
        __classPrivateFieldGet(this, _RedDotMarker_map, "f").addLayer(__classPrivateFieldGet(this, _RedDotMarker_layer, "f"));
        window.addEventListener('hashchange', (e) => { __classPrivateFieldGet(this, _RedDotMarker_instances, "m", _RedDotMarker_hashChanged).call(this, e.newURL); });
        __classPrivateFieldGet(this, _RedDotMarker_instances, "m", _RedDotMarker_hashChanged).call(this, window.location.href);
    }
    getCoordinates() {
        return _a.getCoordinatesFromUrlHash(window.location.hash);
    }
    static getCoordinatesFromUrlHash(hash) {
        if (!hash || hash.length <= 1)
            return undefined;
        const q = new URLSearchParams(hash.substring(1));
        const rx = q.get('rx');
        const rz = q.get('rz');
        if (!rx || !rz)
            return undefined;
        return [parseInt(rx, 10), parseInt(rz, 10)];
    }
    static getUrlHashWithCoordinates(hash, coordinates) {
        const base = hash ?? '#';
        const q = new URLSearchParams(base.substring(1));
        if (!coordinates) {
            q.delete('rx');
            q.delete('rz');
        }
        else {
            q.set('rx', String(coordinates[0]));
            q.set('rz', String(coordinates[1]));
        }
        return '#' + q.toString();
    }
    setCoordinates(coordinates) {
        const url = new URL(window.location.href);
        url.hash = _a.getUrlHashWithCoordinates(url.hash, coordinates);
        window.location.replace(url.toString());
    }
}
_a = RedDotMarker, _RedDotMarker_source = new WeakMap(), _RedDotMarker_layer = new WeakMap(), _RedDotMarker_map = new WeakMap(), _RedDotMarker_dataProjection = new WeakMap(), _RedDotMarker_viewProjection = new WeakMap(), _RedDotMarker_instances = new WeakSet(), _RedDotMarker_hashChanged = function _RedDotMarker_hashChanged(newURL) {
    const c = _a.getCoordinatesFromUrlHash(new URL(newURL).hash);
    __classPrivateFieldGet(this, _RedDotMarker_instances, "m", _RedDotMarker_setRedDotMarker).call(this, c);
}, _RedDotMarker_setRedDotMarker = function _RedDotMarker_setRedDotMarker(coordinates) {
    __classPrivateFieldGet(this, _RedDotMarker_source, "f").clear();
    if (!coordinates)
        return;
    const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(coordinates, __classPrivateFieldGet(this, _RedDotMarker_dataProjection, "f"), __classPrivateFieldGet(this, _RedDotMarker_viewProjection, "f")))
    });
    marker.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: 'red' }),
            stroke: new ol.style.Stroke({ color: '#ffffff', width: 2 })
        }),
        text: new ol.style.Text({
            text: coordinates[0] + ', ' + coordinates[1],
            font: "bold 14px Arial",
            offsetY: 25,
            fill: new ol.style.Fill({ color: '#000000' }),
            stroke: new ol.style.Stroke({ color: '#ffffff', width: 3 }),
            padding: [4, 6, 4, 6]
        })
    }));
    __classPrivateFieldGet(this, _RedDotMarker_source, "f").addFeature(marker);
};
class Unmined {
    constructor(mapElement, options, regions) {
        _Unmined_instances.add(this);
        this.olMap = null;
        this.gridLayer = null;
        this.coordinateLayer = null;
        this.viewProjection = null;
        this.dataProjection = null;
        this.regionMap = null;
        this.markersLayer = null;
        this.playerMarkersLayer = null;
        _Unmined_scaleLine.set(this, null);
        _Unmined_options.set(this, void 0);
        const worldTileSize = 256;
        __classPrivateFieldSet(this, _Unmined_options, { ...Unmined.defaultOptions, ...options }, "f");
        this.loadSettings();
        const worldMinX = __classPrivateFieldGet(this, _Unmined_options, "f").minRegionX * 512;
        const worldMinZ = __classPrivateFieldGet(this, _Unmined_options, "f").minRegionZ * 512;
        const worldWidth = (__classPrivateFieldGet(this, _Unmined_options, "f").maxRegionX + 1 - __classPrivateFieldGet(this, _Unmined_options, "f").minRegionX) * 512;
        const worldHeight = (__classPrivateFieldGet(this, _Unmined_options, "f").maxRegionZ + 1 - __classPrivateFieldGet(this, _Unmined_options, "f").minRegionZ) * 512;
        this.regionMap = new RegionMap(regions, worldTileSize, worldMinX, worldMinZ, worldWidth, worldHeight);
        const dpiScale = window.devicePixelRatio ?? 1.0;
        __classPrivateFieldGet(this, _Unmined_instances, "m", _Unmined_initProjections).call(this, Math.max(Math.abs(worldMinX), Math.abs(worldMinZ), Math.abs(worldMinX + worldWidth), Math.abs(worldMinX + worldHeight)));
        const mapExtent = ol.proj.transformExtent(ol.extent.boundingExtent([
            [worldMinX, worldMinZ],
            [worldMinX + worldWidth, worldMinZ + worldHeight]
        ]), this.dataProjection, this.viewProjection);
        const mapZoomLevels = __classPrivateFieldGet(this, _Unmined_options, "f").maxZoom - __classPrivateFieldGet(this, _Unmined_options, "f").minZoom;
        const resolutions = new Array(mapZoomLevels + 1);
        for (let z = 0; z <= mapZoomLevels; ++z) {
            let b = 1 * Math.pow(2, mapZoomLevels - z - __classPrivateFieldGet(this, _Unmined_options, "f").maxZoom);
            b = ol.proj.transform([b, b], this.dataProjection, this.viewProjection)[0];
            resolutions[z] = b * dpiScale;
        }
        const tileGrid = new ol.tilegrid.TileGrid({
            extent: mapExtent,
            origin: [0, 0],
            resolutions: resolutions,
            tileSize: worldTileSize / dpiScale
        });
        const unminedLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                projection: this.viewProjection,
                tileGrid: tileGrid,
                tilePixelRatio: dpiScale,
                tileSize: worldTileSize / dpiScale,
                tileUrlFunction: (coordinate) => {
                    const tileX = coordinate[1];
                    const tileY = coordinate[2];
                    const worldZoom = -(mapZoomLevels - coordinate[0]) + __classPrivateFieldGet(this, _Unmined_options, "f").maxZoom;
                    if (this.regionMap.hasTile(tileX, tileY, worldZoom)) {
                        return ('tiles/zoom.{z}/{xd}/{yd}/tile.{x}.{y}.' + __classPrivateFieldGet(this, _Unmined_options, "f").imageFormat)
                            .replace('{z}', String(worldZoom))
                            .replace('{yd}', String(Math.floor(tileY / 10)))
                            .replace('{xd}', String(Math.floor(tileX / 10)))
                            .replace('{y}', String(tileY))
                            .replace('{x}', String(tileX));
                    }
                    return undefined;
                }
            })
        });
        const mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(0),
            projection: this.dataProjection
        });
        const map = new ol.Map({
            target: mapElement,
            controls: ol.control.defaults.defaults().extend([mousePositionControl]),
            layers: [unminedLayer],
            view: new ol.View({
                center: ol.proj.transform([__classPrivateFieldGet(this, _Unmined_options, "f").centerX, __classPrivateFieldGet(this, _Unmined_options, "f").centerZ], this.dataProjection, this.viewProjection),
                extent: mapExtent,
                projection: this.viewProjection,
                resolutions: tileGrid.getResolutions(),
                maxZoom: mapZoomLevels,
                zoom: mapZoomLevels - __classPrivateFieldGet(this, _Unmined_options, "f").maxZoom,
                constrainResolution: true,
                showFullExtent: true,
                constrainOnlyCenter: true,
                enableRotation: false
            })
        });
        if (__classPrivateFieldGet(this, _Unmined_options, "f").markers && __classPrivateFieldGet(this, _Unmined_options, "f").markers.length > 0) {
            this.markersLayer = this.createMarkersLayer(__classPrivateFieldGet(this, _Unmined_options, "f").markers);
            map.addLayer(this.markersLayer);
        }
        if (__classPrivateFieldGet(this, _Unmined_options, "f").playerMarkers && __classPrivateFieldGet(this, _Unmined_options, "f").playerMarkers.length > 0) {
            this.playerMarkersLayer = this.createMarkersLayer(__classPrivateFieldGet(this, _Unmined_options, "f").playerMarkers);
            map.addLayer(this.playerMarkersLayer);
        }
        if (__classPrivateFieldGet(this, _Unmined_options, "f").background) {
            mapElement.style.backgroundColor = __classPrivateFieldGet(this, _Unmined_options, "f").background;
        }
        this.olMap = map;
        this.updateGraticule();
        this.updateScaleBar();
        this.updateMarkersLayer();
        this.updatePlayerMarkersLayer();
        this.olMap.addControl(this.createContextMenu());
        this.redDotMarker = new RedDotMarker(this.olMap, this.dataProjection, this.viewProjection);
        this.centerOnRedDotMarker();
    }
    center(blockCoordinates) {
        const view = this.olMap.getView();
        const v = ol.proj.transform(blockCoordinates, this.dataProjection, this.viewProjection);
        view.setCenter(v);
    }
    centerOnRedDotMarker() {
        const c = this.redDotMarker.getCoordinates();
        if (!c)
            return;
        this.center(c);
    }
    placeRedDotMarker(coordinates) {
        this.redDotMarker.setCoordinates(coordinates);
    }
    createMarkersLayer(markers) {
        const features = [];
        for (const item of markers) {
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([item.x, item.z], this.dataProjection, this.viewProjection))
            });
            const style = new ol.style.Style();
            if (item.image) {
                style.setImage(new ol.style.Icon({
                    src: item.image,
                    anchor: item.imageAnchor,
                    scale: item.imageScale
                }));
            }
            if (item.text) {
                style.setText(new ol.style.Text({
                    text: item.text,
                    font: item.font,
                    offsetX: item.offsetX,
                    offsetY: item.offsetY,
                    fill: item.textColor ? new ol.style.Fill({ color: item.textColor }) : null,
                    padding: item.textPadding ?? [2, 4, 2, 4],
                    stroke: item.textStrokeColor ? new ol.style.Stroke({
                        color: item.textStrokeColor,
                        width: item.textStrokeWidth
                    }) : null,
                    backgroundFill: item.textBackgroundColor
                        ? new ol.style.Fill({ color: item.textBackgroundColor })
                        : null,
                    backgroundStroke: item.textBackgroundStrokeColor
                        ? new ol.style.Stroke({
                            color: item.textBackgroundStrokeColor,
                            width: item.textBackgroundStrokeWidth
                        })
                        : null
                }));
            }
            feature.setStyle(style);
            features.push(feature);
        }
        return new ol.layer.Vector({
            source: new ol.source.Vector({ features })
        });
    }
    static playerToMarker(player) {
        return {
            ...Unmined.defaultPlayerMarkerStyle,
            x: player.x,
            z: player.z,
            text: player.name
        };
    }
    static createPlayerMarkers(players) {
        return players.map(player => Unmined.playerToMarker(player));
    }
    updateGraticule() {
        if (!this.olMap)
            return;
        if (this.gridLayer)
            this.olMap.removeLayer(this.gridLayer);
        if (this.coordinateLayer)
            this.olMap.removeLayer(this.coordinateLayer);
        this.gridLayer = null;
        if (!__classPrivateFieldGet(this, _Unmined_options, "f").enableGrid)
            return;
        this.gridLayer = __classPrivateFieldGet(this, _Unmined_instances, "m", _Unmined_createGraticuleLayer).call(this, false);
        this.coordinateLayer = __classPrivateFieldGet(this, _Unmined_instances, "m", _Unmined_createGraticuleLayer).call(this, true);
        this.gridLayer?.setVisible(__classPrivateFieldGet(this, _Unmined_options, "f").showGrid);
        this.coordinateLayer?.setVisible(__classPrivateFieldGet(this, _Unmined_options, "f").showGrid);
        this.gridLayer.setZIndex(500);
        this.coordinateLayer.setZIndex(10000);
        this.olMap.addLayer(this.gridLayer);
        this.olMap.addLayer(this.coordinateLayer);
    }
    static copyToClipboard(text, toast) {
        if (!navigator?.clipboard?.writeText) {
            Unmined.toast('Clipboard is not accessible');
            return;
        }
        navigator.clipboard.writeText(text);
        Unmined.toast(toast ?? "Copied!");
    }
    static toast(message) {
        Toastify({
            text: message,
            duration: 2000,
            gravity: "top",
            position: "center"
        }).showToast();
    }
    createContextMenu() {
        const contextmenu = new ContextMenu({
            width: 220,
            defaultItems: false,
            items: []
        });
        contextmenu.on('open', (evt) => {
            const coordinates = ol.proj.transform(this.olMap.getEventCoordinate(evt.originalEvent), this.viewProjection, this.dataProjection);
            coordinates[0] = Math.round(coordinates[0]);
            coordinates[1] = Math.round(coordinates[1]);
            contextmenu.clear();
            contextmenu.push({
                text: `Copy /tp ${coordinates[0]} ~ ${coordinates[1]}`,
                callback: () => {
                    Unmined.copyToClipboard(`/tp ${coordinates[0]} ~ ${coordinates[1]}`);
                }
            });
            contextmenu.push('-');
            contextmenu.push({
                text: `Place red dot marker here`,
                classname: 'menuitem-reddot',
                callback: () => { this.placeRedDotMarker(coordinates); }
            });
            if (this.redDotMarker.getCoordinates()) {
                contextmenu.push({
                    text: `Copy marker link`,
                    callback: () => { Unmined.copyToClipboard(window.location.href); }
                });
                contextmenu.push({
                    text: `Clear marker`,
                    callback: () => { this.placeRedDotMarker(undefined); }
                });
            }
            contextmenu.push('-');
            if (this.playerMarkersLayer) {
                contextmenu.push({
                    classname: __classPrivateFieldGet(this, _Unmined_options, "f").showPlayers ? 'menuitem-checked' : 'menuitem-unchecked',
                    text: 'Show players',
                    callback: () => this.togglePlayers()
                });
            }
            if (this.markersLayer) {
                contextmenu.push({
                    classname: __classPrivateFieldGet(this, _Unmined_options, "f").showMarkers ? 'menuitem-checked' : 'menuitem-unchecked',
                    text: 'Show markers',
                    callback: () => this.toggleMarkers()
                });
            }
            if (this.markersLayer || this.playerMarkersLayer) {
                contextmenu.push('-');
            }
            if (__classPrivateFieldGet(this, _Unmined_options, "f").enableGrid) {
                contextmenu.push({
                    classname: __classPrivateFieldGet(this, _Unmined_options, "f").showGrid ? 'menuitem-checked' : 'menuitem-unchecked',
                    text: 'Show grid',
                    callback: () => this.toggleGrid()
                });
                contextmenu.push({
                    classname: __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid ? 'menuitem-checked' : 'menuitem-unchecked',
                    text: 'Dense grid',
                    callback: () => this.toggleGridInterval()
                });
                contextmenu.push({
                    classname: __classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid ? 'menuitem-checked' : 'menuitem-unchecked',
                    text: 'Binary coordinates',
                    callback: () => this.toggleBinaryGrid()
                });
            }
            contextmenu.push({
                classname: __classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar ? 'menuitem-checked' : 'menuitem-unchecked',
                text: 'Show scalebar',
                callback: () => this.toggleScaleBar()
            });
        });
        return contextmenu;
    }
    toggleGridInterval() {
        __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid = !__classPrivateFieldGet(this, _Unmined_options, "f").denseGrid;
        this.updateGraticule();
        this.saveSettings();
    }
    toggleBinaryGrid() {
        __classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid = !__classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid;
        this.updateGraticule();
        this.saveSettings();
    }
    toggleGrid() {
        __classPrivateFieldGet(this, _Unmined_options, "f").showGrid = !__classPrivateFieldGet(this, _Unmined_options, "f").showGrid;
        this.updateGraticule();
        this.saveSettings();
    }
    toggleScaleBar() {
        __classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar = !__classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar;
        this.updateScaleBar();
        this.saveSettings();
    }
    toggleMarkers() {
        __classPrivateFieldGet(this, _Unmined_options, "f").showMarkers = !__classPrivateFieldGet(this, _Unmined_options, "f").showMarkers;
        this.updateMarkersLayer();
        this.saveSettings();
    }
    togglePlayers() {
        __classPrivateFieldGet(this, _Unmined_options, "f").showPlayers = !__classPrivateFieldGet(this, _Unmined_options, "f").showPlayers;
        this.updatePlayerMarkersLayer();
        this.saveSettings();
    }
    loadSettings() {
        let mapSettings;
        try {
            const s = localStorage.getItem("unminedSettings");
            if (s)
                mapSettings = JSON.parse(s);
        }
        catch {
            mapSettings = undefined;
        }
        if (!mapSettings)
            return;
        __classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar = mapSettings.showScaleBar ?? __classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar;
        __classPrivateFieldGet(this, _Unmined_options, "f").showGrid = mapSettings.showGrid ?? __classPrivateFieldGet(this, _Unmined_options, "f").showGrid;
        __classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid = mapSettings.binaryGrid ?? __classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid;
        __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid = mapSettings.denseGrid ?? __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid;
        __classPrivateFieldGet(this, _Unmined_options, "f").showMarkers = mapSettings.showMarkers ?? __classPrivateFieldGet(this, _Unmined_options, "f").showMarkers;
        __classPrivateFieldGet(this, _Unmined_options, "f").showPlayers = mapSettings.showPlayers ?? __classPrivateFieldGet(this, _Unmined_options, "f").showPlayers;
    }
    saveSettings() {
        const mapSettings = {
            showScaleBar: __classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar,
            showGrid: __classPrivateFieldGet(this, _Unmined_options, "f").showGrid,
            binaryGrid: __classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid,
            denseGrid: __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid,
            showMarkers: __classPrivateFieldGet(this, _Unmined_options, "f").showMarkers,
            showPlayers: __classPrivateFieldGet(this, _Unmined_options, "f").showPlayers
        };
        localStorage.setItem("unminedSettings", JSON.stringify(mapSettings));
    }
    updateMarkersLayer() {
        this.markersLayer?.setVisible(__classPrivateFieldGet(this, _Unmined_options, "f").showMarkers);
    }
    updatePlayerMarkersLayer() {
        this.playerMarkersLayer?.setVisible(__classPrivateFieldGet(this, _Unmined_options, "f").showPlayers);
    }
    updateScaleBar() {
        if (!__classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar && __classPrivateFieldGet(this, _Unmined_scaleLine, "f")) {
            this.olMap.removeControl(__classPrivateFieldGet(this, _Unmined_scaleLine, "f"));
            __classPrivateFieldSet(this, _Unmined_scaleLine, undefined, "f");
        }
        else if (__classPrivateFieldGet(this, _Unmined_options, "f").showScaleBar && !__classPrivateFieldGet(this, _Unmined_scaleLine, "f")) {
            __classPrivateFieldSet(this, _Unmined_scaleLine, new ol.control.ScaleLine({ bar: true, minWidth: 200 }), "f");
            this.olMap.addControl(__classPrivateFieldGet(this, _Unmined_scaleLine, "f"));
        }
    }
}
_Unmined_scaleLine = new WeakMap(), _Unmined_options = new WeakMap(), _Unmined_instances = new WeakSet(), _Unmined_createGraticuleLayer = function _Unmined_createGraticuleLayer(coord) {
    const intervalCount = this.olMap.getView().getMaxZoom() + 2;
    const graticuleIntervals = new Array(intervalCount);
    if (__classPrivateFieldGet(this, _Unmined_options, "f").binaryGrid) {
        let base = 16;
        for (let z = 0; z < intervalCount; ++z) {
            const intervalInDegrees = ol.proj.transform([base, base], this.dataProjection, this.viewProjection)[0];
            graticuleIntervals[intervalCount - 1 - z] = intervalInDegrees;
            base *= 2;
        }
    }
    else {
        const factors = [1, 2, 5];
        let base = 10;
        let factorIndex = 0;
        for (let z = 0; z < intervalCount; ++z) {
            const intervalInBlocks = base * factors[factorIndex++ % factors.length];
            const intervalInDegrees = ol.proj.transform([intervalInBlocks, intervalInBlocks], this.dataProjection, this.viewProjection)[0];
            graticuleIntervals[intervalCount - 1 - z] = intervalInDegrees;
            if (factorIndex % factors.length === 0)
                base *= 10;
        }
    }
    const graticuleLabelStyle = new ol.style.Text({
        font: '14px sans-serif',
        placement: "point",
        fill: new ol.style.Fill({ color: "#fff" }),
        stroke: new ol.style.Stroke({ color: "#000", width: 2 })
    });
    const graticuleLonLabelStyle = graticuleLabelStyle.clone();
    graticuleLonLabelStyle.setOffsetY(10);
    const graticuleLatLabelStyle = graticuleLabelStyle.clone();
    graticuleLatLabelStyle.setOffsetX(-2);
    graticuleLatLabelStyle.setTextAlign('right');
    const graticuleStrokeStyle = coord
        ? new ol.style.Stroke({ color: 'rgba(0, 0, 0, 0)', width: 0 })
        : new ol.style.Stroke({ color: 'rgb(0,0,0)', width: 0.5 });
    return new ol.layer.Graticule({
        strokeStyle: graticuleStrokeStyle,
        showLabels: coord,
        wrapX: false,
        targetSize: __classPrivateFieldGet(this, _Unmined_options, "f").denseGrid ? 60 : 120,
        intervals: graticuleIntervals,
        lonLabelFormatter: coord ? (lon) => {
            const c = new ol.geom.Point(ol.proj.transform([lon, 0], this.viewProjection, this.dataProjection)).getFirstCoordinate();
            const l = Math.round(c[0]);
            return l === 0 ? "x = 0" : l.toString();
        } : undefined,
        latLabelFormatter: coord ? (lat) => {
            const c = new ol.geom.Point(ol.proj.transform([0, lat], this.viewProjection, this.dataProjection)).getFirstCoordinate();
            const l = Math.round(c[1]);
            return l === 0 ? "z = 0" : l.toString();
        } : undefined,
        lonLabelStyle: coord ? graticuleLonLabelStyle : undefined,
        latLabelStyle: coord ? graticuleLatLabelStyle : undefined,
        lonLabelPosition: 1,
        latLabelPosition: 1
    });
}, _Unmined_initProjections = function _Unmined_initProjections(maxCoordValue) {
    const blocksPerDegrees = Math.max(30000000, maxCoordValue) / 270;
    const radius = 270;
    this.viewProjection = new ol.proj.Projection({
        code: 'VIEW',
        units: 'degrees',
        extent: [-radius, -radius, +radius, +radius],
        worldExtent: [-radius, -radius, +radius, +radius],
        global: true
    });
    this.dataProjection = new ol.proj.Projection({
        code: 'DATA',
        units: 'pixels',
        metersPerUnit: 1
    });
    ol.proj.addCoordinateTransforms(this.viewProjection, this.dataProjection, (coordinate) => [coordinate[0] * blocksPerDegrees, -coordinate[1] * blocksPerDegrees], (coordinate) => [coordinate[0] / blocksPerDegrees, -coordinate[1] / blocksPerDegrees]);
};
Unmined.defaultOptions = {
    enableGrid: true,
    showGrid: true,
    binaryGrid: true,
    showScaleBar: false,
    denseGrid: false,
    showMarkers: true,
    showPlayers: true,
    centerX: 0,
    centerZ: 0
};
Unmined.defaultPlayerMarkerStyle = {
    image: "playerimages/default.png",
    imageAnchor: [0.5, 0.5],
    imageScale: 0.25,
    textColor: "white",
    offsetX: 0,
    offsetY: 20,
    font: "14px Arial",
    textBackgroundColor: "#00000088",
    textPadding: [2, 4, 2, 4]
};
