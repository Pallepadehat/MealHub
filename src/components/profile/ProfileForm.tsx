'use client'

import { useState, useEffect } from 'react'
import { Edit, Trash2 } from "lucide-react"
import { useAuth } from '@/components/auth/AuthContext'
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
import { toast } from 'react-hot-toast'
import { User } from '@/types'

interface ProfileFormProps {
    initialProfile: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile }) => {
    const { user, updateProfile, deleteProfile, logout } = useAuth()
    const [profile, setProfile] = useState<User>(initialProfile)
    const [isChanged, setIsChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setProfile(user)
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await updateProfile(profile)
            setIsChanged(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        }
        setIsLoading(false)
    }

    const handleInputChange = (key: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, [key]: e.target.value }))
        setIsChanged(true)
    }

    const handleDeleteProfile = async () => {
        setIsLoading(true)
        try {
            await deleteProfile()
            await logout()
            toast.success('Profile deleted successfully')
            window.location.href = '/'
        } catch (error) {
            console.error('Error deleting profile:', error)
            toast.error('Failed to delete profile')
            setIsLoading(false)
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
                            <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Button type="button">Change Avatar</Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={profile.name}
                            onChange={handleInputChange('name')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            readOnly
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            value={profile.age || ''}
                            onChange={handleInputChange('age')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                            id="height"
                            type="number"
                            value={profile.height || ''}
                            onChange={handleInputChange('height')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            value={profile.weight || ''}
                            onChange={handleInputChange('weight')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diet">Diet</Label>
                        <Input
                            id="diet"
                            value={profile.diet || ''}
                            onChange={handleInputChange('diet')}
                        />
                    </div>
                    {/* Note: For allergies and dislikes, you might want to use a more complex input method,
                        such as a multi-select or tags input. For simplicity, we're using a basic input here. */}
                    <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                        <Input
                            id="allergies"
                            value={profile.allergies?.join(', ') || ''}
                            onChange={(e) => {
                                const allergies = e.target.value.split(',').map(item => item.trim())
                                setProfile(prev => ({ ...prev, allergies }))
                                setIsChanged(true)
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dislikes">Dislikes (comma-separated)</Label>
                        <Input
                            id="dislikes"
                            value={profile.dislikes?.join(', ') || ''}
                            onChange={(e) => {
                                const dislikes = e.target.value.split(',').map(item => item.trim())
                                setProfile(prev => ({ ...prev, dislikes }))
                                setIsChanged(true)
                            }}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => {
                        setProfile(initialProfile)
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
