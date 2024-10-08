'use client'

import { useState } from 'react'
import Link from "next/link"
import { CircleUser, Menu, UtensilsCrossed, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const dietTypes = [
    { id: "omnivore", label: "Omnivore" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "pescatarian", label: "Pescatarian" },
    { id: "keto", label: "Keto" },
    { id: "paleo", label: "Paleo" },
]

const commonAllergies = [
    { id: "dairy", label: "Dairy" },
    { id: "eggs", label: "Eggs" },
    { id: "peanuts", label: "Peanuts" },
    { id: "tree-nuts", label: "Tree Nuts" },
    { id: "soy", label: "Soy" },
    { id: "wheat", label: "Wheat" },
    { id: "fish", label: "Fish" },
    { id: "shellfish", label: "Shellfish" },
]

export default function SettingsPage() {
    const [selectedDiet, setSelectedDiet] = useState("omnivore")
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])

    const handleAllergyChange = (allergyId: string) => {
        setSelectedAllergies(prev =>
            prev.includes(allergyId)
                ? prev.filter(id => id !== allergyId)
                : [...prev, allergyId]
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    >
                        <UtensilsCrossed className="h-6 w-6" />
                        <span className="sr-only">MealHub</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/meals"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Meals
                    </Link>
                    <Link
                        href="/ingredients"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Ingredients
                    </Link>
                    <Link
                        href="/shopping-lists"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Shopping Lists
                    </Link>
                    <Link
                        href="/settings"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Settings
                    </Link>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <UtensilsCrossed className="h-6 w-6" />
                                <span className="sr-only">MealHub</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/meals"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Meals
                            </Link>
                            <Link
                                href="/ingredients"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Ingredients
                            </Link>
                            <Link
                                href="/shopping-lists"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Shopping Lists
                            </Link>
                            <Link href="/settings" className="hover:text-foreground">
                                Settings
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search meals..."
                                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                            />
                        </div>
                    </form>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <nav className="grid gap-4 text-sm text-muted-foreground">
                        <Link href="#" className="font-semibold text-primary">
                            General
                        </Link>
                        <Link href="#">Notifications</Link>
                        <Link href="#">Privacy</Link>
                        <Link href="#">Advanced</Link>
                    </nav>
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your account&apos;s profile information and email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Your Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="your.email@example.com" />
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save Changes</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Dietary Preferences</CardTitle>
                                <CardDescription>
                                    Select your preferred diet type to customize your meal suggestions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={selectedDiet}
                                    onValueChange={setSelectedDiet}
                                    className="grid gap-2"
                                >
                                    {dietTypes.map((diet) => (
                                        <div key={diet.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={diet.id} id={diet.id} />
                                            <Label htmlFor={diet.id}>{diet.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Allergies and Intolerances</CardTitle>
                                <CardDescription>
                                    Select any allergies or intolerances to avoid in your meal plans.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {commonAllergies.map((allergy) => (
                                        <div key={allergy.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={allergy.id}
                                                checked={selectedAllergies.includes(allergy.id)}
                                                onCheckedChange={() => handleAllergyChange(allergy.id)}
                                            />
                                            <Label htmlFor={allergy.id}>{allergy.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save Dietary Preferences</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Settings</CardTitle>
                                <CardDescription>
                                    Manage how you receive notifications from MealHub.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="email-notifications" />
                                        <label
                                            htmlFor="email-notifications"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Receive email notifications
                                        </label>Allergies
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="push-notifications" />
                                        <label
                                            htmlFor="push-notifications"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Receive push notifications
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="weekly-digest" />
                                        <label
                                            htmlFor="weekly-digest"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Receive weekly meal plan digest
                                        </label>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button>Save Notification Settings</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}