import { writable } from "svelte/store";

export const appContextKey = "app";

export const latLonStorageKey = "latitude-longitude";
export const placeInputStorageKey = "place";
export const placeOutputStorageKey = "place-output";

export const latLon = writable(localStorage.getItem(latLonStorageKey) || "");
export const placeInput = writable(localStorage.getItem(placeInputStorageKey) || "");
export const placeOutput = writable(localStorage.getItem(placeOutputStorageKey) || "");

let placeInputVal: string;

latLon.subscribe((val) => {
    localStorage.setItem(latLonStorageKey, val);
    if (!placeInputVal) placeOutput.set(val);
});
placeInput.subscribe((val) => {
    localStorage.setItem(placeInputStorageKey, val);
    placeInputVal = val;
});
placeOutput.subscribe((val) => localStorage.setItem(placeOutputStorageKey, val));
