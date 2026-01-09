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
    last_login_at?: string | null;
    last_login_ip?: string | null;
    is_2fa_enabled: boolean;
    security_notifications_enabled: boolean;
}

export interface Session {
    id: string;
    device_type: string;
    browser_name: string;
    browser_version: string;
    os_name: string;
    os_version: string;
    ip_address: string;
    location_city: string | null;
    location_country: string | null;
    last_active_at: string;
    is_current: boolean;
}
