'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UtensilsCrossed, ArrowLeft, ArrowRight, X } from 'lucide-react'

const steps = [
  { title: "Basic Information", icon: "👤" },
  { title: "Health Metrics", icon: "📏" },
  { title: "Dietary Preferences", icon: "🥗" },
  { title: "Allergies & Dislikes", icon: "🚫" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    diet: '',
    allergies: [] as string[],
    dislikes: [] as string[],
  })
  const [allergyInput, setAllergyInput] = useState('')
  const [dislikeInput, setDislikeInput] = useState('')
  const router = useRouter()
  const { saveOnboarding } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }))
      setAllergyInput('')
    }
  }

  const handleAddDislike = () => {
    if (dislikeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        dislikes: [...prev.dislikes, dislikeInput.trim()]
      }))
      setDislikeInput('')
    }
  }

  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const handleRemoveDislike = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dislikes: prev.dislikes.filter((_, i) => i !== index)
    }))
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      try {
        await saveOnboarding({
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
          diet: formData.diet,
          allergies: formData.allergies,
          dislikes: formData.dislikes,
        })
        router.push('/dashboard')
      } catch (error) {
        console.error('Failed to save onboarding data:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-blue-50 p-6">
          <div className="flex justify-center mb-4">
            <UtensilsCrossed size={40} className="text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-900">Welcome to MealHub</CardTitle>
          <p className="text-gray-600 mt-2">Let's personalize your experience</p>
        </CardHeader>
        <CardContent className="p-6">
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className="text-xs mt-2 text-gray-600">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Step content */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="Enter your height in cm"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="diet" className="block text-sm font-medium text-gray-700">Dietary Preference</Label>
                <Select name="diet" onValueChange={(value) => handleSelectChange('diet', value)}>
                  <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="allergies"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    placeholder="Enter an allergy"
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button onClick={handleAddAllergy} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {allergy}
                      <button onClick={() => handleRemoveAllergy(index)} className="ml-2 focus:outline-none">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="dislikes" className="block text-sm font-medium text-gray-700">Food Dislikes</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="dislikes"
                    value={dislikeInput}
                    onChange={(e) => setDislikeInput(e.target.value)}
                    placeholder="Enter a food you dislike"
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button onClick={handleAddDislike} className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.dislikes.map((dislike, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center">
                      {dislike}
                      <button onClick={() => handleRemoveDislike(index)} className="ml-2 focus:outline-none">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
