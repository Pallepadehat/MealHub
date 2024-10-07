/*
Developer: Patrick Jakobsen
Date: 07-10-2024
Description: useAuth hook for MealHub, where users can authenticate and manage their account. Login, register, and update their profile.
*/



import { useState, useEffect } from 'react';
import { Account, Client, ID, Databases, Models } from 'appwrite';
import { useRouter } from 'next/navigation';

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);

interface User extends Models.Document {
  name: string;
  email: string;
  dietType?: string;
  allergies?: string[];
  cookingExperience?: string;
  mealPlanningGoals?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const session = await account.get();
      if (session) {
        const userData = await databases.getDocument<User>(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
          session.$id
        );
        setUser(userData);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUserStatus();
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const newAccount = await account.create(ID.unique(), email, password, name);

      // Create a document in the users collection
      await databases.createDocument<User>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        newAccount.$id,
        {
          name: name,
          email: email,
          dietType: '',
          allergies: [],
          cookingExperience: '',
          mealPlanningGoals: ''
        }
      );

      await login(email, password);
      return newAccount;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const updateUserProfile = async (name: string, dietType: string, allergies: string[], cookingExperience: string, mealPlanningGoals: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await account.updateName(name);

      // Update the user document in the users collection
      await databases.updateDocument<User>(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
        user.$id,
        {
          name,
          dietType,
          allergies,
          cookingExperience,
          mealPlanningGoals
        }
      );

      await checkUserStatus();
    } catch (error) {
      console.error('Profile update failed', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    updateUserProfile,
  };
}
