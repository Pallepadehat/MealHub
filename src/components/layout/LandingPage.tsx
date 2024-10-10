'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed, ShoppingCart, BookOpen, ChefHat, ArrowRight, Menu, X, Facebook } from 'lucide-react'
import Link from 'next/link'
import { InstagramLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

// LandingPage component: Renders the main landing page of the MealHub application
export default function LandingPage() {
  // State for email input and mobile menu toggle
  const [email, setEmail] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Handle email submission for newsletter signup
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
  }

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header section with navigation */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-800">MealHub</span>
            </div>
            <nav className="hidden md:flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link href="/signup" className="text-gray-600 hover:text-blue-600">SignUp</Link>
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-md"
          >
            <nav className="flex flex-col py-2">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 px-4 py-2">Login</Link>
              <Link href="/signup" className="text-gray-600 hover:text-blue-600 px-4 py-2">SignUp</Link>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Simplify Your Meal Planning with MealHub
              </h1>
              <p className="text-lg sm:text-xl mb-8">
                Plan meals, generate shopping lists, and discover new recipes - all in one place.
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src="/Hero.png"
                    alt="MealHub Dashboard"
                    className="w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={UtensilsCrossed}
              title="Meal Planning"
              description="Easily plan your meals for the week or month ahead."
            />
            <FeatureCard
              icon={ShoppingCart}
              title="Smart Shopping Lists"
              description="Automatically generate shopping lists based on your meal plans."
            />
            <FeatureCard
              icon={BookOpen}
              title="Recipe Management"
              description="Store, organize, and discover new recipes all in one place."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Simplify Your Meal Planning?</h2>
          <p className="text-lg sm:text-xl mb-8">Join thousands of happy users and start your journey today.</p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            Sign Up Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest updates, tips, and recipes.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                required
              />
              <Button type="submit" className="w-full sm:w-auto">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ChefHat className="mr-2" /> MealHub
              </h3>
              <p>Simplifying meal planning for busy people.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">Home</a></li>
                <li><a href="#" className="hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-blue-400">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-blue-400">
                  <InstagramLogoIcon className="h-6 w-6" />
                </Link>
                <Link href="#" className="hover:text-blue-400">
                  <TwitterLogoIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2024 MealHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// FeatureCard component: Renders a card for each feature in the Features section
function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <Icon className="h-12 w-12 text-blue-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  )
}

/*
Developer: Marc Lohff Routhe
Date: 10-10-2024
*/
