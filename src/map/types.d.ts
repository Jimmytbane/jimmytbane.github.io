// Global declarations for third-party libraries loaded via <script> tags

declare const ol: any;
declare const ContextMenu: new (options: any) => any;
declare function Toastify(options: {
    text: string;
    duration: number;
    gravity?: string;
    position?: string;
}): { showToast(): void };

// Interfaces shared across map scripts

interface MarkerItem {
    x: number;
    z: number;
    image?: string;
    imageAnchor?: [number, number];
    imageScale?: number;
    text?: string;
    textColor?: string;
    offsetX?: number;
    offsetY?: number;
    font?: string;
    textStrokeColor?: string;
    textStrokeWidth?: number;
    textBackgroundColor?: string;
    textBackgroundStrokeColor?: string;
    textBackgroundStrokeWidth?: number;
    textPadding?: [number, number, number, number];
}

interface PlayerData {
    x: number;
    z: number;
    name: string;
}

interface RegionEntry {
    x: number;
    z: number;
    m: Uint32Array;
}

interface MapProperties {
    worldName: string;
    minZoom: number;
    maxZoom: number;
    defaultZoom?: number;
    minRegionX: number;
    minRegionZ: number;
    maxRegionX: number;
    maxRegionZ: number;
    imageFormat: string;
    background?: string;
    enableGrid?: boolean;
    showGrid?: boolean;
    centerX?: number;
    centerZ?: number;
    markers?: MarkerItem[];
    playerMarkers?: MarkerItem[];
}

interface CustomMarkers {
    isEnabled: boolean;
    markers: MarkerItem[];
}

// Globals set by auto-generated uNmINeD data files
declare const UnminedMapProperties: MapProperties;
declare const UnminedRegions: RegionEntry[];
declare const UnminedPlayers: PlayerData[] | Record<string, never>;
