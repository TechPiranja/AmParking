import { ParkingSpot } from "./ParkingSpot";

export interface ParkingSpotInfo extends ParkingSpot {
    id: number,
    total?: number,
    current?: number,
    free?: number,
    trend?: -1 | 0 | 1,
    state?: "OK" | "Ersatzwerte" | "Manuell" | "Störung",
    closed?: boolean
}