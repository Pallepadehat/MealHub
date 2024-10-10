import { Client, Account, Databases } from 'appwrite';
import { config } from '@/config';

export const client = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = config.appwrite.databaseId;
export const USERS_COLLECTION_ID = config.appwrite.usersCollectionId;

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
