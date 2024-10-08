# MealHub

MealHub is a comprehensive meal planning and grocery list management application built with Next.js, Appwrite, and TypeScript. It helps users manage ingredients, create meals, generate categorized shopping lists, and track shopping progress.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User authentication and profile management
- Ingredient management with custom categories
- Meal creation using stored ingredients
- Automated shopping list generation
- Multiple shopping list support with history tracking
- Real-time shopping progress tracking
- Responsive design for desktop, tablet, and mobile devices

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the frontend and API routes
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Appwrite](https://appwrite.io/) - Backend as a Service (BaaS) for authentication and database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built with Radix UI and Tailwind CSS
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications for React

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Appwrite instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mealhub.git
   cd mealhub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables) section)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```plaintext
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
NEXT_PUBLIC_APPWRITE_INGREDIENTS_COLLECTION_ID=your_ingredients_collection_id
NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID=your_categories_collection_id
NEXT_PUBLIC_APPWRITE_MEALS_COLLECTION_ID=your_meals_collection_id
NEXT_PUBLIC_APPWRITE_SHOPPING_LISTS_COLLECTION_ID=your_shopping_lists_collection_id
NEXT_PUBLIC_APPWRITE_SHOPPING_LIST_ITEMS_COLLECTION_ID=your_shopping_list_items_collection_id
NEXT_PUBLIC_APPWRITE_MEAL_PLANS_COLLECTION_ID=your_meal_plans_collection_id
```

Replace the placeholder values with your actual Appwrite configuration.

## Project Structure

```
mealhub/
├── .next/
├── node_modules/
├── public/
│   └── fonts/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── onboarding/
│   │   │   └── signup/
│   │   ├── (main)/
│   │   │   ├── categories/
│   │   │   ├── dashboard/
│   │   │   ├── history/
│   │   │   │   └── shopping-lists/
│   │   │   ├── ingredients/
│   │   │   │   └── [id]/
│   │   │   ├── meals/
│   │   │   │   └── [id]/
│   │   │   ├── profile/
│   │   │   │   └── delete/
│   │   │   ├── settings/
│   │   │   └── shopping-lists/
│   │   │       └── [id]/
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ingredients/
│   │   │   ├── IngredientForm.tsx
│   │   │   └── IngredientList.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   ├── meals/
│   │   │   ├── MealForm.tsx
│   │   │   └── MealList.tsx
│   │   ├── shopping-lists/
│   │   │   ├── ShoppingListItems.tsx
│   │   │   └── ShoppingListOverview.tsx
│   │   └── ui/
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   ├── useAuth.ts
│   │   └── useShoppingList.ts
│   ├── lib/
│   └── types/
│       └── index.ts
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── components.json
├── next.config.js
├── package.json
└── tsconfig.json
```

This structure follows the Next.js 13+ App Router convention, with the main application code residing in the `src/app` directory. Components, hooks, and utility functions are organized in their respective folders within the `src` directory.

## Usage

After setting up the project, you can:

1. Register a new account or log in
2. Complete the onboarding process to set your dietary preferences
3. Add ingredients and create custom categories
4. Create meals using your stored ingredients
5. Generate shopping lists based on your meal plans
6. Track your shopping progress in real-time

For more detailed usage instructions, please refer to the user documentation (coming soon).

## API Reference

The API documentation is currently in development. Once completed, it will provide details on the available endpoints, request/response formats, and authentication requirements.

## Contributing

We welcome contributions to MealHub! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

Please ensure your code adheres to the project's coding standards and includes appropriate tests.
