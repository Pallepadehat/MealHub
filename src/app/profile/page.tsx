/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description: This is the main page for the profile page.
*/

import { Client, Account } from 'appwrite';
import ProfileForm from '@/components/profile/ProfileForm';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

async function getProfile() {
    try {
        const user = await account.get();
        const prefs = await account.getPrefs();
        return {
            name: user.name,
            email: user.email,
            bio: prefs.bio || '',
        };
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

export default async function ProfilePage() {
    const profile = await getProfile();

    if (!profile) {
        return <div>Error loading profile. Please try again later.</div>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto w-full max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                    <ProfileForm initialProfile={profile} />
                </div>
            </main>
        </div>
    );
}