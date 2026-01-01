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
    id?: number;
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
    created_at?: string;
}
