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
import { Edit, Trash2, Save, X, Camera, User as UserIcon, Cake, Ruler, Weight, Utensils, AlertTriangle, ThumbsDown, UtensilsCrossed } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
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
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white/10 p-4 rounded-full"
              >
                <UtensilsCrossed size={48} className="text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-4xl font-bold text-white mb-2">Your MealHub Profile</CardTitle>
            <CardDescription className="text-blue-100 text-lg">Manage your personal information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Avatar className="h-24 w-24 border-4 border-primary/10">
                  <AvatarFallback className='bg-primary/10 text-primary text-2xl font-bold'>
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
                  <p className="text-lg text-gray-600">{profile.email}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 sm:mt-0">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="transition-all duration-200 hover:bg-gray-100">
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
                      <Save className="mr-2 h-4 w-4" /> {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="transition-all duration-200 hover:bg-gray-100">
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200">
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
                          <AlertDialogAction onClick={handleDeleteProfile} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white">
                            {isLoading ? 'Deleting...' : 'Delete Profile'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="personal" className="rounded-md transition-all duration-200">Personal Information</TabsTrigger>
                <TabsTrigger value="preferences" className="rounded-md transition-all duration-200">Dietary Preferences</TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center text-gray-700">
                          <UserIcon className="mr-2 h-4 w-4 text-blue-600" /> Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange('name')}
                          readOnly={!isEditing}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age" className="flex items-center text-gray-700">
                          <Cake className="mr-2 h-4 w-4 text-blue-600" /> Age
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={profile.age || ''}
                          onChange={handleInputChange('age')}
                          readOnly={!isEditing}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="flex items-center text-gray-700">
                          <Ruler className="mr-2 h-4 w-4 text-blue-600" /> Height (cm)
                        </Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          value={profile.height || ''}
                          onChange={handleInputChange('height')}
                          readOnly={!isEditing}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="flex items-center text-gray-700">
                          <Weight className="mr-2 h-4 w-4 text-blue-600" /> Weight (kg)
                        </Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          value={profile.weight || ''}
                          onChange={handleInputChange('weight')}
                          readOnly={!isEditing}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="preferences" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="diet" className="flex items-center text-gray-700">
                        <Utensils className="mr-2 h-4 w-4 text-blue-600" /> Diet
                      </Label>
                      <Input
                        id="diet"
                        name="diet"
                        value={profile.diet || ''}
                        onChange={handleInputChange('diet')}
                        readOnly={!isEditing}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies" className="flex items-center text-gray-700">
                        <AlertTriangle className="mr-2 h-4 w-4 text-blue-600" /> Allergies (comma-separated)
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
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dislikes" className="flex items-center text-gray-700">
                        <ThumbsDown className="mr-2 h-4 w-4 text-blue-600" /> Dislikes (comma-separated)
                      </Label>
                      <Input
                        id="dislikes"
                        name="dislikes"
                        value={profile.dislikes?.join(', ') || ''}
                        onChange={(e) => {
                          const dislikes = e.target.value.split(',').map(item => item.trim())
                          setProfile(prev => prev ? {
                            ...prev, dislikes } : null)
                        }}
                        readOnly={!isEditing}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center p-6 bg-gray-50">
            <Button variant="outline" className="w-full sm:w-auto transition-all duration-200 hover:bg-gray-100" disabled={!isEditing}>
              <Camera className="mr-2 h-4 w-4" /> Change Profile Picture
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


/*
Developer: Patrick Jakobsen & Mathias Seeger
Date: 10-10-2024
*/
