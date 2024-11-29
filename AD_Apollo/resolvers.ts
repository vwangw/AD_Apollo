import { Collection, ObjectId } from "mongodb";
import { Flight, FlightModel } from "./types.ts";
import { fromModelToFlight } from "./utils.ts";

export const resolvers = {
    Query: {
        getFlights: async (_:unknown,
            { origin, destination }: { origin?: string; destination?: string },
            context: {FlightsCollection: Collection<FlightModel>}
        ): Promise<Flight[]> => {
            const flightsModel: { origin?: string; destination?: string } = {};
            if (origin) {
                flightsModel.origin = origin;
            }
            if (destination) {
                flightsModel.destination = destination;
            }
            const flightModel = await context.FlightsCollection.find(flightsModel).toArray();
            return flightModel.map((flightModel) =>
                fromModelToFlight(flightModel));
        },

        getFlight: async(_: unknown,
            {id}:{id:string},
            context: {FlightsCollection: Collection<FlightModel>}
        ): Promise <Flight | null> => {
            const flightModel = await context.FlightsCollection.findOne({
                _id: new ObjectId(id),
            });

            if(!flightModel){
                return null;
            }

            return fromModelToFlight(flightModel);
        },
    },

    Mutation: {
        addFlight: async (
            _: unknown,
            args: {origin: string, destination: string, time: string},
            context: {FlightsCollection: Collection<FlightModel>}
        ): Promise <Flight> => {
            const {origin, destination, time} = args;
            const {insertedId} = await context.FlightsCollection.insertOne({
                origin,
                destination,
                time,
            });

            const flightModel = {
                _id: insertedId,
                origin,
                destination,
                time,
            }

            return fromModelToFlight(flightModel!);
        }
    }
}