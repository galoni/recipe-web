const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = `${BASE_URL}/api/v1`;

export async function loginWithEmail(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email); // OAuth2 spec expects form-data 'username'
    formData.append('password', password);

    const res = await fetch(`${API_URL}/auth/token`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Login failed');
    }

    return res.json();
}

export async function registerWithEmail(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error('Registration failed');
    }

    return res.json();
}

export async function logout() {
    await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    window.location.href = '/login';
}

export function getGoogleLoginUrl() {
    // We will redirect to backend endpoint which generates the Google URL and redirects
    return `${API_URL}/auth/google/login`;
}
