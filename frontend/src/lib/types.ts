export interface Ingredient {
    item: string;
    quantity?: string | null;
    unit?: string | null;
    notes?: string | null;
}

export interface Step {
    step_number: number;
    instruction: string;
    duration_seconds?: number | null;
    time?: string | null;
}

export interface Recipe {
    id?: string | number;
    title: string;
    description?: string | null;
    video_url: string;
    thumbnail_url?: string | null;
    servings?: number | null;
    prep_time_minutes?: number | null;
    cook_time_minutes?: number | null;
    ingredients: Ingredient[];
    steps: Step[];
    dietary_tags: string[];
    is_public?: boolean;
    created_at?: string;
}

export interface User {
    id: number;
    email: string;
    full_name?: string | null;
    is_active: boolean;
}
