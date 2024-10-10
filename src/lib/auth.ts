import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, client } from './appwrite'
import { ID } from 'appwrite'
import { User, OnboardingData } from '@/types'

/**
 * Fetches the current user's data from Appwrite.
 * @returns A Promise that resolves to a User object or null if no user is logged in.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Get the current user's account information
    const user = await account.get()
    // Fetch additional user data from the database
    const userData = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)

    // Combine account and database information into a User object
    return {
      id: user.$id,
      name: user.name,
      email: user.email,
      onboardingCompleted: userData.onboardingCompleted,
      age: userData.age,
      height: userData.height,
      weight: userData.weight,
      diet: userData.diet,
      allergies: userData.allergies,
      dislikes: userData.dislikes,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Logs in a user with email and password.
 * @param email The user's email address.
 * @param password The user's password.
 * @throws Will throw an error if login fails.
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    await account.createEmailPasswordSession(email, password)
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

/**
 * Logs out the current user by deleting all active sessions.
 * @throws Will throw an error if logout fails.
 */
export const logout = async (): Promise<void> => {
  try {
    await account.deleteSessions()
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  }
}

/**
 * Signs up a new user with email, password, and name.
 * @param email The new user's email address.
 * @param password The new user's password.
 * @param name The new user's name.
 * @throws Will throw an error if sign up fails.
 */
export const signUp = async (email: string, password: string, name: string): Promise<void> => {
  try {
    // Create a new user account
    const user = await account.create(ID.unique(), email, password, name)
    // Create a document in the users collection for the new user
    await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
      name,
      email,
      onboardingCompleted: false,
    })
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

/**
 * Saves onboarding data for the current user.
 * @param data The onboarding data to save.
 * @throws Will throw an error if saving fails or no user is logged in.
 */
export const saveOnboardingData = async (data: OnboardingData): Promise<void> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No user logged in')

    // Update the user's document with onboarding data
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.id,
      { ...data, onboardingCompleted: true }
    )
  } catch (error) {
    console.error('Error saving onboarding data:', error)
    throw error
  }
}

/**
 * Updates the current user's information.
 * @param data Partial User object containing the fields to update.
 * @throws Will throw an error if update fails or no user is logged in.
 */
export const updateUser = async (data: Partial<User>): Promise<void> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No user logged in')

    const updateData: Partial<User> = {}

    // Only include fields that are present in the database
    if (data.name) updateData.name = data.name
    if (data.age !== undefined) updateData.age = data.age
    if (data.height !== undefined) updateData.height = data.height
    if (data.weight !== undefined) updateData.weight = data.weight
    if (data.diet) updateData.diet = data.diet
    if (data.allergies) updateData.allergies = data.allergies
    if (data.dislikes) updateData.dislikes = data.dislikes

    // Update name in Appwrite account if it has changed
    if (data.name && data.name !== user.name) {
      await account.updateName(data.name)
    }

    // Update user data in the database
    await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.id,
      updateData
    )
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

/**
 * Deletes the current user's account and associated data.
 * @throws Will throw an error if deletion fails or no user is logged in.
 */
export const deleteUser = async (): Promise<void> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No user logged in')

    // Delete user document from the database
    await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id)

    // Delete user account
    // Note: The following line is commented out. Uncomment if you want to delete the account as well.
    // await account.delete(user.id)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}


/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
