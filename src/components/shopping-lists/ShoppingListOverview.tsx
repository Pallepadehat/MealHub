/*
Developer: Mathias Holst Seeger
Date: 08-10-2024
Description:
*/

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingList } from '@/types'

interface ShoppingListOverviewProps {
    shoppingLists: ShoppingList[]
}

export default function ShoppingListOverview({ shoppingLists }: ShoppingListOverviewProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shoppingLists.map((list) => (
                <Card key={list.id}>
                    <CardHeader>
                        <CardTitle>{list.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {list.itemCount} items • Created on {new Date(list.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/shopping-lists/${list.id}`} passHref>
                            <Button variant="outline">View List</Button>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}