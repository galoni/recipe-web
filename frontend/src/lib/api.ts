import axios from "axios";
import { Recipe } from "./types";

// Base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

/**
 * Extracts a recipe from a YouTube video URL using the Gemini AI service.
 * @param videoUrl The URL of the YouTube video to process.
 * @returns A promise that resolves to the extracted Recipe data.
 */
export const generateRecipe = async (videoUrl: string): Promise<Recipe> => {
    // The endpoint was updated from /api/v1/recipes/generate to /api/v1/extract
    const response = await api.post<Recipe>("/api/v1/extract", {
        video_url: videoUrl,
    });
    return response.data;
};

/**
 * Saves a recipe to the database.
 * @param recipe The Recipe object to save.
 * @returns A promise that resolves to the saved Recipe data.
 */
export const saveRecipe = async (recipe: Recipe): Promise<Recipe> => {
    const response = await api.post<Recipe>("/api/v1/recipes/", recipe);
    return response.data;
};

/**
 * Fetches all saved recipes for the current user.
 * @returns A promise that resolves to an array of Recipe objects.
 */
export const getRecipes = async (): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>("/api/v1/recipes/");
    return response.data;
};

/**
 * Searches and explores public recipes.
 * @param query The search query string.
 * @returns A promise that resolves to an array of matching Recipe objects.
 */
export const exploreRecipes = async (query?: string): Promise<Recipe[]> => {
    const response = await api.get<Recipe[]>("/api/v1/recipes/explore", {
        params: { q: query },
    });
    return response.data;
};

/**
 * Fetches a single recipe by ID.
 * @param id The ID of the recipe to fetch.
 * @returns A promise that resolves to the Recipe object.
 */
export const getRecipeById = async (id: string | number): Promise<Recipe> => {
    const response = await api.get<Recipe>(`/api/v1/recipes/${id}`);
    return response.data;
};

/**
 * Deletes a recipe from the database.
 * @param recipeId The ID of the recipe to delete.
 */
export const deleteRecipe = async (recipeId: string | number): Promise<void> => {
    await api.delete(`/api/v1/recipes/${recipeId}`);
};

/**
 * Toggles the public/private status of a recipe.
 * @param recipeId The ID of the recipe.
 * @param isPublic The new public status.
 * @returns A promise that resolves to the updated Recipe.
 */
export const toggleRecipePrivacy = async (recipeId: string | number, isPublic: boolean): Promise<Recipe> => {
    const response = await api.patch<Recipe>(`/api/v1/recipes/${recipeId}`, { is_public: isPublic });
    return response.data;
};
/**
 * Fetches the current authenticated user.
 * @returns A promise that resolves to the User data.
 */
export const getCurrentUser = async (): Promise<{ id: number; email: string } | null> => {
    try {
        const response = await api.get("/api/v1/auth/me");
        return response.data;
    } catch {
        return null;
    }
};
