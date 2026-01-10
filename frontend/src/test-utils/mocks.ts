import { vi } from 'vitest'

export const mockAuthService = {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
}

export const mockRecipeService = {
    extractRecipe: vi.fn(),
    getRecipe: vi.fn(),
    saveRecipe: vi.fn(),
    getUserRecipes: vi.fn(),
}

export const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
}

export const mockRecipe = {
    id: 'test-recipe-id',
    title: 'Test Recipe',
    description: 'A delicious test recipe',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
    instructions: ['Step 1', 'Step 2'],
    servings: 4,
    prep_time_minutes: 15,
    cook_time_minutes: 30,
}
