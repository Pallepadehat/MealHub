import ShoppingList from '@/components/shopping-list/ShoppingList'

export default function ShoppingListPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Shopping List</h1>
      <ShoppingList />
    </div>
  )
}
