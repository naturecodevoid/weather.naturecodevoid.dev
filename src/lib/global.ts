import { writable } from "svelte/store";

export const appContextKey = "app";

const latLonStorageKey = "latitude-longitude";
const placeInputStorageKey = "place";
const placeOutputStorageKey = "place-output";
export const standaloneShownKey = "standalone-shown";

export const latLon = writable(localStorage.getItem(latLonStorageKey) || "");
export const placeInput = writable(localStorage.getItem(placeInputStorageKey) || "");
export const placeOutput = writable(localStorage.getItem(placeOutputStorageKey) || "");

latLon.subscribe((val) => localStorage.setItem(latLonStorageKey, val));
placeInput.subscribe((val) => localStorage.setItem(placeInputStorageKey, val));
placeOutput.subscribe((val) => localStorage.setItem(placeOutputStorageKey, val));
