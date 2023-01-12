export type MessageType = "Alert" | "Update" | "Cancel" | "Ack" | "Error";
export type Severity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";

export interface Alert {
    areaDesc: string;
    affectedZones: string[];
    effective: string;
    expires: string;
    status: string;
    messageType: MessageType;
    category: string;
    severity: Severity;
    certainty: string;
    urgency: string;
    event: string;
    headline: string | undefined;
    description: string;
    instruction: string | undefined;
}
