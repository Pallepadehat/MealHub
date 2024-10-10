/*
Developer: Mathias Holst Seeger
Date: 09-10-2024
Description:
*/

'use client'

import { useState } from 'react'
import { Edit, Trash2 } from "lucide-react"
import { Client, Account } from 'appwrite'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

interface ProfileFormProps {
    initialProfile: {
        name: string;
        email: string;
        bio: string;
    };
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile }) => {
    const [name, setName] = useState(initialProfile.name)
    const [email, setEmail] = useState(initialProfile.email)
    const [bio, setBio] = useState(initialProfile.bio)
    const [isChanged, setIsChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await account.updateName(name)
            await account.updatePrefs({ bio: bio })
            setIsChanged(false)
            console.log('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
        }
        setIsLoading(false)
    }

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value)
        setIsChanged(true)
    }

    const handleDeleteProfile = async () => {
        setIsLoading(true);
        try {
            // Log out the user from all sessions
            await account.deleteSessions();
            console.log('User logged out from all sessions');

            // Here, you would typically make a call to your backend API
            // to actually delete the user's account from Appwrite
            // For example:
            // await fetch('/api/delete-account', { method: 'POST' });

            console.log('Profile deletion process initiated');
            // Redirect to home page or login page
            window.location.href = '/';
        } catch (error) {
            console.error('Error initiating profile deletion:', error);
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and preferences.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
                            <AvatarFallback>{name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button type="button">Change Avatar</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleInputChange(setName)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            id="bio"
                            value={bio}
                            onChange={handleInputChange(setBio)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => {
                        setName(initialProfile.name)
                        setBio(initialProfile.bio)
                        setIsChanged(false)
                    }}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isChanged || isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </form>
            <div className="mt-6 flex justify-between p-6">
                <Button variant="outline" className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Profile
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProfile} disabled={isLoading}>
                                {isLoading ? 'Deleting...' : 'Delete Profile'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
    )
}

export default ProfileForm