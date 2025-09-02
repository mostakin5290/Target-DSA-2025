interface UserData {
    solvedProblems: number[];
    notes: Record<string, string>;
}

const getUserDataKey = (userId: string) => `userData_${userId}`;

export const getUserData = (userId: string): UserData => {
    if (!userId) {
        return { solvedProblems: [], notes: {} };
    }
    try {
        const data = localStorage.getItem(getUserDataKey(userId));
        if (data) {
            const parsedData = JSON.parse(data);
            return {
                solvedProblems: Array.isArray(parsedData.solvedProblems) ? parsedData.solvedProblems : [],
                notes: typeof parsedData.notes === 'object' && parsedData.notes !== null ? parsedData.notes : {}
            };
        }
    } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
    }
    return { solvedProblems: [], notes: {} };
};

const saveUserData = (userId: string, data: UserData) => {
    if (!userId) return;
    try {
        localStorage.setItem(getUserDataKey(userId), JSON.stringify(data));
    } catch (error) {
        console.error("Failed to save user data to localStorage:", error);
    }
};

export const updateProblemStatus = (userId: string, problemId: number, isSolved: boolean): void => {
    const userData = getUserData(userId);
    const solvedSet = new Set(userData.solvedProblems);
    
    if (isSolved) {
        solvedSet.add(problemId);
    } else {
        solvedSet.delete(problemId);
    }

    const updatedData: UserData = {
        ...userData,
        solvedProblems: Array.from(solvedSet),
    };

    saveUserData(userId, updatedData);
};

export const updateNote = (userId: string, problemId: number, text: string): void => {
    const userData = getUserData(userId);
    const updatedNotes = { ...userData.notes };

    if (text.trim()) {
        updatedNotes[String(problemId)] = text;
    } else {
        delete updatedNotes[String(problemId)];
    }
    
    const updatedData: UserData = {
        ...userData,
        notes: updatedNotes,
    };
    
    saveUserData(userId, updatedData);
};

export const resetUserData = (userId: string): void => {
    if (!userId) return;
    try {
        localStorage.removeItem(getUserDataKey(userId));
    } catch (error) {
        console.error("Failed to reset user data in localStorage:", error);
    }
};
