import type { UserResource } from '@clerk/types';

interface UserData {
    solvedProblems: number[];
    notes: Record<string, string>;
}

// Fetches user progress data from Clerk's unsafeMetadata
export const getUserData = (user: UserResource): UserData => {
    const metadata = user.unsafeMetadata || {};
    const solvedProblems = (Array.isArray(metadata.solvedProblems) ? metadata.solvedProblems : []) as number[];
    const notes = (typeof metadata.notes === 'object' && metadata.notes !== null ? metadata.notes : {}) as Record<string, string>;

    return { solvedProblems, notes };
};

// Updates a problem's solved status in Clerk's unsafeMetadata
export const updateProblemStatus = async (user: UserResource, problemId: number, isSolved: boolean): Promise<void> => {
    if (!user) return;

    try {
        const currentData = getUserData(user);
        const solvedSet = new Set(currentData.solvedProblems);

        if (isSolved) {
            solvedSet.add(problemId);
        } else {
            solvedSet.delete(problemId);
        }

        await user.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                notes: currentData.notes, // Ensure notes are carried over
                solvedProblems: Array.from(solvedSet),
            },
        });
    } catch (error) {
        console.error("Failed to update problem status:", error);
    }
};

// Updates a problem's note in Clerk's unsafeMetadata
export const updateNote = async (user: UserResource, problemId: number, text: string): Promise<void> => {
    if (!user) return;

    try {
        const currentData = getUserData(user);
        const updatedNotes = { ...currentData.notes };

        if (text.trim()) {
            updatedNotes[String(problemId)] = text;
        } else {
            delete updatedNotes[String(problemId)];
        }

        await user.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                solvedProblems: currentData.solvedProblems, // Ensure solved problems are carried over
                notes: updatedNotes,
            },
        });
    } catch (error) {
        console.error("Failed to update note:", error);
    }
};

// Resets all user progress data in Clerk's unsafeMetadata
export const resetUserData = async (user: UserResource): Promise<void> => {
    if (!user) return;

    try {
        await user.update({
            unsafeMetadata: {
                solvedProblems: [],
                notes: {},
            },
        });
    } catch (error) {
        console.error("Failed to reset user data:", error);
    }
};