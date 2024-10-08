/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

import Link from "next/link"
import Image from "next/image"
import { CircleUser, Menu, UtensilsCrossed, Search, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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

const categories = [
    { name: "Breakfast", image: "/placeholder.svg?height=100&width=100", count: 25 },
    { name: "Lunch", image: "/placeholder.svg?height=100&width=100", count: 32 },
    { name: "Dinner", image: "/placeholder.svg?height=100&width=100", count: 40 },
    { name: "Snacks", image: "/placeholder.svg?height=100&width=100", count: 18 },
    { name: "Desserts", image: "/placeholder.svg?height=100&width=100", count: 22 },
    { name: "Vegetarian", image: "/placeholder.svg?height=100&width=100", count: 30 },
    { name: "Vegan", image: "/placeholder.svg?height=100&width=100", count: 28 },
    { name: "Gluten-Free", image: "/placeholder.svg?height=100&width=100", count: 15 },
]

export default function CategoriesPage() {
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
                        href="/categories"
                        className="text-foreground transition-colors hover:text-foreground"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/settings"
                        className="text-muted-foreground transition-colors hover:text-foreground"
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
                            <Link
                                href="/categories"
                                className="text-foreground hover:text-foreground"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/settings"
                                className="text-muted-foreground hover:text-foreground"
                            >
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
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
                <div className="mx-auto w-full max-w-6xl space-y-8">
                    <h1 className="text-3xl font-bold">Meal Categories</h1>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <Card key={category.name} className="overflow-hidden">
                                <CardHeader className="border-b p-0">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={400}
                                        height={200}
                                        className="object-cover w-full h-48"
                                    />
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle>{category.name}</CardTitle>
                                    <CardDescription>{category.count} meals</CardDescription>
                                </CardContent>
                                <CardFooter className="p-4">
                                    <Link href={`/categories/${category.name.toLowerCase()}`} className="w-full">
                                        <Button className="w-full">
                                            View Meals
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}