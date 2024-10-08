/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description: This is the main page for the profile page.
*/

import Link from "next/link"
import { CircleUser, Menu, UtensilsCrossed, Search, Edit, Trash2 } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfilePage: React.FC = () => {
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
                <div className="mx-auto w-full max-w-4xl">
                    <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Manage your personal information and preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile picture" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <Button>Change Avatar</Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="john.doe@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Input id="bio" defaultValue="Food enthusiast and home cook" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                    <div className="mt-6 flex justify-between">
                        <Button variant="outline" className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                        <Link href="/profile/delete">
                            <Button variant="destructive" className="flex items-center">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProfilePage