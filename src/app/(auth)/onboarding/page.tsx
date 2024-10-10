'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { UtensilsCrossed, ArrowLeft, ArrowRight, X, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Define the steps for the onboarding process
const steps = [
  { title: "Basic Information", icon: "👤" },
  { title: "Health Metrics", icon: "📏" },
  { title: "Dietary Preferences", icon: "🥗" },
  { title: "Allergies & Dislikes", icon: "🚫" },
]

// Define dietary options for user selection
const dietaryOptions = [
  { value: "omnivore", label: "Omnivore", icon: "🍖" },
  { value: "vegetarian", label: "Vegetarian", icon: "🥦" },
  { value: "vegan", label: "Vegan", icon: "🌱" },
  { value: "pescatarian", label: "Pescatarian", icon: "🐟" },
  { value: "keto", label: "Keto", icon: "🥑" },
  { value: "paleo", label: "Paleo", icon: "🍗" },
]

export default function OnboardingPage() {
  // State management for current step and form data
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age: 25,
    height: 170,
    weight: 70,
    diet: '',
    allergies: [] as string[],
    dislikes: [] as string[],
  })
  const [allergyInput, setAllergyInput] = useState('')
  const [dislikeInput, setDislikeInput] = useState('')
  const router = useRouter()
  const { saveOnboarding } = useAuth()

  // Handle input changes for form fields
  const handleInputChange = (name: string, value: number | string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Add allergy to the list
  const handleAddAllergy = () => {
    if (allergyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }))
      setAllergyInput('')
    }
  }

  // Add dislike to the list
  const handleAddDislike = () => {
    if (dislikeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        dislikes: [...prev.dislikes, dislikeInput.trim()]
      }))
      setDislikeInput('')
    }
  }

  // Remove allergy from the list
  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  // Remove dislike from the list
  const handleRemoveDislike = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dislikes: prev.dislikes.filter((_, i) => i !== index)
    }))
  }

  // Handle next step or form submission
  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      try {
        await saveOnboarding(formData)
        router.push('/dashboard')
      } catch (error) {
        console.error('Failed to save onboarding data:', error)
        // Handle error (e.g., show error message to user)
      }
    }
  }

  // Handle going back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // Render content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="age" className="text-lg font-medium text-gray-700">Age</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Slider
                  id="age"
                  min={1}
                  max={120}
                  step={1}
                  value={[formData.age]}
                  onValueChange={([value]) => handleInputChange('age', value)}
                  className="flex-grow"
                />
                <span className="text-2xl font-bold text-blue-600">{formData.age}</span>
              </div>
            </div>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="height" className="text-lg font-medium text-gray-700">Height (cm)</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Slider
                  id="height"
                  min={100}
                  max={250}
                  step={1}
                  value={[formData.height]}
                  onValueChange={([value]) => handleInputChange('height', value)}
                  className="flex-grow"
                />
                <span className="text-2xl font-bold text-blue-600">{formData.height} cm</span>
              </div>
            </div>
            <div>
              <Label htmlFor="weight" className="text-lg font-medium text-gray-700">Weight (kg)</Label>
              <div className="flex items-center space-x-4 mt-2">
                <Slider
                  id="weight"
                  min={30}
                  max={200}
                  step={1}
                  value={[formData.weight]}
                  onValueChange={([value]) => handleInputChange('weight', value)}
                  className="flex-grow"
                />
                <span className="text-2xl font-bold text-blue-600">{formData.weight} kg</span>
              </div>
            </div>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="diet" className="text-lg font-medium text-gray-700">Dietary Preference</Label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {dietaryOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={formData.diet === option.value ? "default" : "outline"}
                    className={`h-20 ${formData.diet === option.value ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleInputChange('diet', option.value)}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="allergies" className="text-lg font-medium text-gray-700">Allergies</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="allergies"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  placeholder="Enter an allergy"
                  className="flex-grow"
                />
                <Button onClick={handleAddAllergy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {allergy}
                    <button onClick={() => handleRemoveAllergy(index)} className="ml-2 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="dislikes" className="text-lg font-medium text-gray-700">Food Dislikes</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="dislikes"
                  value={dislikeInput}
                  onChange={(e) => setDislikeInput(e.target.value)}
                  placeholder="Enter a food you dislike"
                  className="flex-grow"
                />
                <Button onClick={handleAddDislike} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.dislikes.map((dislike, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                    {dislike}
                    <button onClick={() => handleRemoveDislike(index)} className="ml-2 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
          <div className="flex justify-center mb-6">
            <UtensilsCrossed size={64} className="text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-white mb-2">Welcome to MealHub</CardTitle>
          <p className="text-blue-100 text-lg">Let's personalize your experience</p>
        </CardHeader>
        <CardContent className="p-8">
          {/* Rotating Progress Indicator */}
          <div className="relative w-56 h-56 mx-auto mb-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-gray-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
              />
              <motion.circle
                className="text-blue-600"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: (currentStep + 1) / steps.length }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl">
              {steps[currentStep].icon}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{steps[currentStep].title}</h2>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between p-8 bg-gray-50">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back
          </Button>
          <Button
            onClick={handleNext}
            className="px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
