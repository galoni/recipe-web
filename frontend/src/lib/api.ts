import axios from "axios";
import { Recipe } from "./types";

// Base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_URL,
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
