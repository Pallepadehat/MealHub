import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, client } from './appwrite'
import { ID, } from 'appwrite'
import { User, OnboardingData } from '@/types'

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get()
    const userData = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id)
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

export const login = async (email: string, password: string): Promise<void> => {
  try {
    await account.createEmailPasswordSession(email, password)
  } catch (error) {
    console.error('Error logging in:', error)
    throw error
  }
}

export const logout = async (): Promise<void> => {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error('Error logging out:', error)
    throw error
  }
}

export const signUp = async (email: string, password: string, name: string): Promise<void> => {
  try {
    const user = await account.create(ID.unique(), email, password, name)
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

export const saveOnboardingData = async (data: OnboardingData): Promise<void> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No user logged in')

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



export const deleteUser = async (): Promise<void> => {
  try {
    const user = await getCurrentUser()
    if (!user) throw new Error('No user logged in')

    // Delete user document from the database
    await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, user.id)

    // Delete user account
    // await account.delete(user.id)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
