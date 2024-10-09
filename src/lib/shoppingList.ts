export async function addToShoppingList(items: string[], servings?: number): Promise<string[]> {
    // In a real application, you would add these items to a database
    console.log(`Adding ${items.join(', ')} to shopping list${servings ? ` for ${servings} servings` : ''}`);
    return items;
  }
