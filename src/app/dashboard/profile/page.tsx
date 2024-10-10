'use client'

import { useState, useEffect } from 'react'
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'react-hot-toast'
import { User } from '@/types'
import { Edit, Trash2, Save, X, Camera, User as UserIcon, Cake, Ruler, Weight, Utensils, AlertTriangle, ThumbsDown } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateProfile, deleteProfile, logout } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("personal")

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setProfile(user)
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [user])

  const handleInputChange = (key: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => prev ? { ...prev, [key]: e.target.value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsLoading(true)
    try {
      await updateProfile(profile)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
    setIsLoading(false)
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

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Please log in to view your profile.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className='flex items-center justify-center h-full w-full'>
           <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Avatar className="h-20 w-20 ">
              <AvatarFallback className='bg-gray-200'>{profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" /> {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Profile
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
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="preferences">Dietary Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" /> Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange('name')}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center">
                  <Cake className="mr-2 h-4 w-4" /> Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={profile.age || ''}
                  onChange={handleInputChange('age')}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center">
                  <Ruler className="mr-2 h-4 w-4" /> Height (cm)
                </Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={profile.height || ''}
                  onChange={handleInputChange('height')}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center">
                  <Weight className="mr-2 h-4 w-4" /> Weight (kg)
                </Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={profile.weight || ''}
                  onChange={handleInputChange('weight')}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="diet" className="flex items-center">
                <Utensils className="mr-2 h-4 w-4" /> Diet
              </Label>
              <Input
                id="diet"
                name="diet"
                value={profile.diet || ''}
                onChange={handleInputChange('diet')}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" /> Allergies (comma-separated)
              </Label>
              <Input
                id="allergies"
                name="allergies"
                value={profile.allergies?.join(', ') || ''}
                onChange={(e) => {
                  const allergies = e.target.value.split(',').map(item => item.trim())
                  setProfile(prev => prev ? { ...prev, allergies } : null)
                }}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dislikes" className="flex items-center">
                <ThumbsDown className="mr-2 h-4 w-4" /> Dislikes (comma-separated)
              </Label>
              <Input
                id="dislikes"
                name="dislikes"
                value={profile.dislikes?.join(', ') || ''}
                onChange={(e) => {
                  const dislikes = e.target.value.split(',').map(item => item.trim())
                  setProfile(prev => prev ? { ...prev, dislikes } : null)
                }}
                readOnly={!isEditing}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" className="w-full sm:w-auto" disabled={!isEditing}>
          <Camera className="mr-2 h-4 w-4" /> Change Profile Picture
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
