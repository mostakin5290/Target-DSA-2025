interface UserData {
    solvedProblems: number[];
    notes: Record<string, string>;
}

// NOTE: These functions now interact with a backend API.
// A server that handles these routes (e.g., /api/user-data) and connects to MongoDB is required.

const API_BASE_URL = '/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    // Handle cases with no content
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

export const getUserData = async (): Promise<UserData> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user-data`);
        const data = await handleResponse(response);
        // Ensure the return type matches UserData, providing defaults if fields are missing.
        return {
            solvedProblems: data?.solvedProblems || [],
            notes: data?.notes || {}
        };
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Return a default empty state on failure so the app doesn't crash.
        return { solvedProblems: [], notes: {} };
    }
};

export const updateProblemStatus = async (problemId: number, isSolved: boolean): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user-data/problems`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problemId, isSolved }),
        });
        await handleResponse(response);
    } catch (error) {
        console.error("Failed to update problem status:", error);
        // Optionally re-throw or handle UI feedback here
    }
};

export const updateNote = async (problemId: number, text: string): Promise<void> => {
     try {
        const response = await fetch(`${API_BASE_URL}/user-data/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problemId, text }),
        });
        await handleResponse(response);
    } catch (error) {
        console.error("Failed to update note:", error);
    }
};

export const resetUserData = async (): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user-data`, {
            method: 'DELETE',
        });
        await handleResponse(response);
    } catch (error) {
        console.error("Failed to reset user data:", error);
    }
};
