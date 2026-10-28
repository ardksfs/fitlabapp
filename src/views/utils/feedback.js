const RESPONSE_KEY = "fitlab_feedback_responses";

function normalizeEmail(email) {
    return String(email || "")
        .trim()
        .toLowerCase();
}


export function resetFeedbackForUser(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return false;

    const prefix = `fitlab-feedback:${normalizedEmail}:`;

    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);

        if (key?.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }

    return true;
}

export function deleteFeedbackResponsesForUser(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return false;

    try {
        const responses = JSON.parse(localStorage.getItem(RESPONSE_KEY) || "[]");

        if (!Array.isArray(responses)) return false;

        const remaining = responses.filter(
            (item) => normalizeEmail(item.email) !== normalizedEmail,
        );

        localStorage.setItem(RESPONSE_KEY, JSON.stringify(remaining));
        return true;
    } catch {
        return false;
    }
}

export function resetAllFeedbackForUser(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return false;

    const reset = resetFeedbackForUser(normalizedEmail);
    const deleted = deleteFeedbackResponsesForUser(normalizedEmail);

    return reset && deleted;
}
