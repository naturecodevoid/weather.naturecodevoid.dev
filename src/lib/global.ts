export const appKey = "app";

export const global = {
    latLon: "",
    place: "",
};

export const latLonStorageKey = "latitude-longitude";
export const placeStorageKey = "place";

export function saveAll() {
    localStorage.setItem(latLonStorageKey, global.latLon);
    localStorage.setItem(placeStorageKey, global.place);
}
