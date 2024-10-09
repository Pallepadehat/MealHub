export const config = {
    appwrite: {
      endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string,
      projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
      databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID as string,
    },
  }

  // Contributor: [Your Name]
