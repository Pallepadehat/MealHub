// src/lib/appwrite.ts
import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!) // Your Appwrite Endpoint
    .setProject(process.env.NEXT_PUBLIC_PROJECT!); // Your project ID

 const account = new Account(client);
 const databases = new Databases(client);
 const storage = new Storage(client);


export {client, ID, Query, account, storage, databases};


export const getAuthRedirect = () => {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${currentOrigin}/auth-redirect`;
};
