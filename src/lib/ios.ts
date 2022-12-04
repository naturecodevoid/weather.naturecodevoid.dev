// https://stackoverflow.com/a/9039885
export function isiOS() {
    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}
