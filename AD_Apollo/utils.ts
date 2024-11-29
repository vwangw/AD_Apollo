import { FlightModel, Flight } from "./types.ts";


export const fromModelToFlight = (flightModel: FlightModel): Flight => {
    return {
        id: flightModel._id!.toString(),
        origin: flightModel.origin,
        destination: flightModel.destination,
        time: flightModel.time,
    }
}