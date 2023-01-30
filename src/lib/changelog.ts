import { writable } from "svelte/store";

export const changelog = await getChangelog();
export const latestVersion = getLatestVersion(changelog);

const latestVersionNumberKey = "latest-version";

export const latestVersionNumber = writable(Number.parseInt(localStorage.getItem(latestVersionNumberKey)) || 0);

latestVersionNumber.subscribe((val) => localStorage.setItem(latestVersionNumberKey, val.toString()));

interface Changelog {
    latest: number;
    versions: Version[];
}

export interface Version {
    id: number;
    date: string;
    changelog: string[];
}

function getLatestVersion(changelog: Changelog) {
    for (const version of changelog.versions) {
        if (version.id == changelog.latest) return version;
    }
    if (changelog.versions.length > 0) return changelog.versions[0];
    return null;
}

export async function getChangelog() {
    return (await (await fetch("/changelog.json")).json()) as Changelog;
}
