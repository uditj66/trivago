import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

export const getAllTrips = async (limit: number, offset: number) => {
  const { documents: trips, total } = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    [Query.limit(limit), Query.offset(offset)]
  );
  if (total === 0) {
    console.error("no trips created");
    return { trips: [], total: 0 };
  }

  return {
    trips,
    total,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    tripId
  );
  if (!trip.$id) {
    console.log("Trip not found");
  }
  return trip;
};
