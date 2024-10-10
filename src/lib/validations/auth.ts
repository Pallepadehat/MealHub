import * as z from 'zod'

// Signup form schema
export const signupSchema = z.object({
  // Name field: must be at least 2 characters long
  name: z.string().min(2, 'Name must be at least 2 characters'),

  // Email field: must be a valid email address
  email: z.string().email('Invalid email address'),

  // Password field: must be at least 8 characters and meet complexity requirements
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
})

// Login form schema
export const loginSchema = z.object({
  // Email field: must be a valid email address
  email: z.string().email('Invalid email address'),

  // Password field: must not be empty
  password: z.string().min(1, 'Password is required'),
})

// Types inferred from the schemas
// This allows TypeScript to automatically infer the shape of the form data
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/

// Note: This file defines Zod schemas for signup and login forms.
// These schemas are used for form validation and type inference in the MealHub application.
// The signupSchema enforces stricter password requirements compared to the loginSchema.
