import { ParkingSpotInfo } from "../types/ParkingSpotInfo";

export default function parseToParkingSpots(data: any, currentParkingSpots: ParkingSpotInfo[]): ParkingSpotInfo[] {
    for (const parkingSpotData of data.Daten.Parkhaus) {
        const parkingSpot = currentParkingSpots.find((p) => p.id === parkingSpotData.ID);

        if (parkingSpot) {
            parkingSpot.total = parkingSpotData.Gesamt;
            parkingSpot.current = parkingSpotData.Aktuell;
            parkingSpot.free = parkingSpotData.Frei;
            parkingSpot.trend = parkingSpotData.Trend;
            parkingSpot.state = parkingSpotData.Status;
            parkingSpot.closed = parkingSpotData.Geschlossen === 1
        }
    }

    return currentParkingSpots;
}