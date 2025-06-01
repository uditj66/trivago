import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

// export const loginWithGoogle = async () => {
//   try {
//     account.createOAuth2Session(OAuthProvider.Google);
//   } catch (error) {
//     console.log("login with google :", error);
//   }
// };

// export const getUser = async () => {
//   try {
//     const user = account.get();
//     if (!user) return redirect("/sign-in");
//     await database.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       [
//         Query.equal("accountId", (await user).$id),
//         Query.select(["name", "email", "joinedAt", "imageUrl", "accountId"]),
//       ]
//     );
//   } catch (error) {
//     console.error("Error getting User:", error);
//   }
// };
// export const logoutUser = async () => {
//   try {
//     await account.deleteSession("current");
//     return true;
//   } catch (error) {
//     console.error("Logout User Error:", error);
//   }
// };
// export const getGooglePicture = async () => {
//   try {
//     const session = await account.getSession("current");
//     const googleAccessToken = session.providerAccessToken;
//     if (!googleAccessToken) return null;
//     const response = await fetch(
//       "https://people.googleapis.com/v1/people/me?personFields=photos",
//       {
//         headers: {
//           Authorization: `Bearer ${googleAccessToken}`,
//         },
//       }
//     );
//     if (!response.ok) {
//       console.log("Failed to fetch profile photo from google people api ");
//       return null;
//     }
//     const data = await response.json();

//     const photoUrl =
//       data.photos && data.photos.length > 0 ? data.photos[0].url : null;
//     return photoUrl;
//   } catch (e) {
//     console.error("getGooglePictureError:", e);
//     return null;
//   }
// };
// export const storeUserData = async () => {
//   try {
//     const user = await account.get();
//     if (!user) return null;
//     // check if user already exists in the database
//     const { documents } = await database.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       [Query.equal("accountId", user.$id)]
//     );
//     if (documents.length > 0) return documents[0];

//     // get profile picture from google
//     const imageUrl = await getGooglePicture();
//     // create new user document
//     const newUser = await database.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       ID.unique(),
//       {
//         accountId: user.$id,
//         email: user.email,
//         name: user.name,
//         imageUrl: imageUrl,
//         joinedAt: new Date().toISOString(),
//       }
//     );
//     return newUser;
//   } catch (error) {
//     console.error("store User Error:", error);
//   }
// };

export const getExistingUser = async (id: string) => {
  try {
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", id)]
    );

    // return total=number of documents in database, documents=array of documents in the database with the querymatched
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    if (!newUser.$id) redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

const getGooglePicture = async (accessToken: string) => {
  try {
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    const { photos } = await response.json();
    return photos?.[0]?.url || null;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();
    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );

    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
