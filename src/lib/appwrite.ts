import { Client, Account, Databases } from 'appwrite';

// Initialize the Appwrite client
export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

// Create an instance of the Account service
export const account = new Account(client);

// Create an instance of the Databases service
export const databases = new Databases(client);

// Export environment variables for easy access
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/

// This file sets up the Appwrite client and exports necessary services and constants.
// It uses environment variables to configure the Appwrite client securely.
// The '!' after each environment variable is a TypeScript non-null assertion operator,
// indicating that we're certain these values will be defined at runtime.

// Usage:
// - client: Use this to interact with Appwrite services directly if needed.
// - account: Use this for user authentication and account management.
// - databases: Use this for database operations.
// - DATABASE_ID and USERS_COLLECTION_ID: Use these constants when performing database operations.

// Note: Ensure that all required environment variables are properly set in your .env.local file
// or in your deployment environment.
