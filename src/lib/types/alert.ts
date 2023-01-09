export interface Alert {
    areaDesc: string;
    affectedZones: string[];
    effective: string;
    expires: string;
    status: string;
    messageType: string;
    category: string;
    severity: string;
    certainty: string;
    urgency: string;
    event: string;
    headline?: string | undefined;
    description: string;
    instruction?: string | undefined;
    parameters: {
        NWSheadline: string[];
    }
}