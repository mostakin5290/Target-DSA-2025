import type { UserResource } from '@clerk/types';

interface UserData {
    solvedProblems: number[];
    notes: Record<string, string>;
    favoriteProblems: number[];
}

// Fetches user progress data from Clerk's unsafeMetadata for a specific sheet
export const getUserData = (user: UserResource, sheetKey: string): UserData => {
    const metadata = user.unsafeMetadata || {};
    const sheetData = (metadata[sheetKey] as Partial<UserData>) || {};

    const solvedProblems = Array.isArray(sheetData.solvedProblems) ? sheetData.solvedProblems : [];
    const notes = typeof sheetData.notes === 'object' && sheetData.notes !== null ? sheetData.notes : {};
    const favoriteProblems = Array.isArray(sheetData.favoriteProblems) ? sheetData.favoriteProblems : [];

    return { solvedProblems, notes, favoriteProblems };
};

// Updates a problem's solved status in Clerk's unsafeMetadata for a specific sheet
export const updateProblemStatus = async (user: UserResource, problemId: number, isSolved: boolean, sheetKey: string): Promise<void> => {
    if (!user) return;

    try {
        const allMetadata = user.unsafeMetadata || {};
        const currentSheetData = getUserData(user, sheetKey);
        const solvedSet = new Set(currentSheetData.solvedProblems);

        if (isSolved) {
            solvedSet.add(problemId);
        } else {
            solvedSet.delete(problemId);
        }

        const updatedSheetData = {
            ...currentSheetData,
            solvedProblems: Array.from(solvedSet),
        };

        await user.update({
            unsafeMetadata: {
                ...allMetadata,
                [sheetKey]: updatedSheetData,
            },
        });
    } catch (error) {
        console.error("Failed to update problem status:", error);
    }
};

// Updates a problem's favorite status in Clerk's unsafeMetadata for a specific sheet
export const updateProblemFavoriteStatus = async (user: UserResource, problemId: number, isFavorite: boolean, sheetKey: string): Promise<void> => {
    if (!user) return;

    try {
        const allMetadata = user.unsafeMetadata || {};
        const currentSheetData = getUserData(user, sheetKey);
        const favoriteSet = new Set(currentSheetData.favoriteProblems);

        if (isFavorite) {
            favoriteSet.add(problemId);
        } else {
            favoriteSet.delete(problemId);
        }

        const updatedSheetData = {
            ...currentSheetData,
            favoriteProblems: Array.from(favoriteSet),
        };

        await user.update({
            unsafeMetadata: {
                ...allMetadata,
                [sheetKey]: updatedSheetData,
            },
        });
    } catch (error) {
        console.error("Failed to update problem favorite status:", error);
    }
};


// Updates a problem's note in Clerk's unsafeMetadata for a specific sheet
export const updateNote = async (user: UserResource, problemId: number, text: string, sheetKey: string): Promise<void> => {
    if (!user) return;

    try {
        const allMetadata = user.unsafeMetadata || {};
        const currentSheetData = getUserData(user, sheetKey);
        const updatedNotes = { ...currentSheetData.notes };

        if (text.trim()) {
            updatedNotes[String(problemId)] = text;
        } else {
            delete updatedNotes[String(problemId)];
        }
        
        const updatedSheetData = {
            ...currentSheetData,
            notes: updatedNotes,
        };

        await user.update({
            unsafeMetadata: {
                ...allMetadata,
                [sheetKey]: updatedSheetData,
            },
        });
    } catch (error) {
        console.error("Failed to update note:", error);
    }
};

// Resets all user progress data in Clerk's unsafeMetadata for a specific sheet
export const resetUserData = async (user: UserResource, sheetKey: string): Promise<void> => {
    if (!user) return;

    try {
        const allMetadata = user.unsafeMetadata || {};
        await user.update({
            unsafeMetadata: {
                ...allMetadata,
                [sheetKey]: {
                    solvedProblems: [],
                    notes: {},
                    favoriteProblems: [],
                }
            },
        });
    } catch (error) {
        console.error("Failed to reset user data:", error);
    }
};