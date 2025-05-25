import { Client, Account, Databases, Storage } from "appwrite";
export const appwriteConfig = {
  endpointUrl: import.meta.env.APPWRITE_API_ENDPOINT,
  projectId: import.meta.env.APPWRITE_PROJECT_ID,
  apiKey: import.meta.env.APPWRITE_API_KEY,
  databaseId: import.meta.env.APPWRITE_DATABASE_ID,
  userCollectionId: import.meta.env.APPWRITE_USERS_COLLECTION_ID,
  tripCollectionId: import.meta.env.APPWRITE_TRIPS_COLLECTION_ID,
};
const client = new Client();
client
  .setEndpoint(appwriteConfig.endpointUrl)
  .setProject(appwriteConfig.projectId);
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, storage, databases, account };
