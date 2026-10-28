<template>
    <div v-if="visible" class="feedback-overlay" @click.self="close">
        <section class="feedback-modal">
            <header class="feedback-header">
                <div class="feedback-brand">
                    <span class="feedback-icon">
                        <i class="fa-solid fa-scroll"></i>
                    </span>
                    <strong>Feedback</strong>
                </div>

                <button
                    class="close-button"
                    type="button"
                    @click="close"
                    aria-label="Tutup"
                >
                    ×
                </button>
            </header>

            <div class="feedback-content">
                <h2>How are you feeling?</h2>

                <p class="feedback-description">
                    Your feedback helps us improve your FitLab experience.
                    Tell us how you're feeling!
                </p>

                <div class="mood-options">
                    <button
                        v-for="mood in moods"
                        :key="mood.value"
                        type="button"
                        class="mood-button"
                        :class="{ selected: rating === mood.value }"
                        @click="rating = mood.value"
                        :aria-label="mood.label"
                        :aria-pressed="rating === mood.value"
                    >
                        <span>{{ mood.emoji }}</span>
                    </button>
                </div>

                <p v-if="rating" class="mood-label">
                    {{ moods.find(m => m.value === rating)?.label }}
                </p>

                <textarea
                    v-model="comment"
                    maxlength="1000"
                    placeholder="Add a comment..."
                    aria-label="Komentar feedback"
                ></textarea>

                <p v-if="error" class="feedback-error">
                    {{ error }}
                </p>

                <button
                    class="submit-button"
                    type="button"
                    :disabled="!rating || submitting"
                    @click="submitFeedback"
                >
                    {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
                </button>

                <button
                    class="later-button"
                    type="button"
                    @click="close"
                >
                    Maybe later
                </button>
            </div>
        </section>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const rating = ref(0)
const comment = ref('')
const error = ref('')
const submitting = ref(false)

const SESSION_KEY = 'fitlab_session'
const FEEDBACK_KEY = 'fitlab_feedback_responses'

// Popup muncul 3 detik setelah pembayaran berhasil.
const FEEDBACK_AFTER_PAYMENT_MS = 3000

const moods = [
    { value: 1, emoji: '😰', label: 'Very Bad' },
    { value: 2, emoji: '😔', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Medium' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '🥰', label: 'Excellent' }
]

let feedbackTimeoutId = null
let sessionSignature = null

function getMemberSession() {
    try {
        const session = JSON.parse(
            localStorage.getItem(SESSION_KEY) || 'null'
        )

        const email = String(session?.email || '')
            .trim()
            .toLowerCase()

        if (session?.role !== 'member' || !email) {
            return null
        }

        return {
            email,
            id: session.id || null
        }
    } catch {
        return null
    }
}

function getSessionSignature(session) {
    return `${session.email}:${session.id || ''}`
}

function resetForm() {
    rating.value = 0
    comment.value = ''
    error.value = ''
    submitting.value = false
}

function clearFeedbackTimeout() {
    if (feedbackTimeoutId !== null) {
        window.clearTimeout(feedbackTimeoutId)
        feedbackTimeoutId = null
    }
}

// Dipanggil ketika pembayaran berhasil disimulasikan.
function handlePaymentSuccess() {
    const session = getMemberSession()

    // Jangan tampilkan feedback jika bukan member yang login.
    if (!session) {
        console.log(
            '[Feedback] Popup dilewati: sesi member tidak ditemukan.'
        )
        return
    }

    // Hindari beberapa timer berjalan bersamaan.
    clearFeedbackTimeout()

    const paymentSessionSignature = getSessionSignature(session)
    sessionSignature = paymentSessionSignature

    // Jangan menumpuk popup apabila feedback sedang terbuka.
    if (visible.value) {
        return
    }

    feedbackTimeoutId = window.setTimeout(() => {
        feedbackTimeoutId = null

        const currentSession = getMemberSession()

        // Pastikan member masih login dengan sesi yang sama.
        if (
            !currentSession ||
            getSessionSignature(currentSession) !==
            paymentSessionSignature
        ) {
            console.log(
                '[Feedback] Popup dibatalkan: sesi login berubah.'
            )
            return
        }

        resetForm()
        visible.value = true

        console.log(
            '[Feedback] Popup ditampilkan setelah pembayaran berhasil.'
        )
    }, FEEDBACK_AFTER_PAYMENT_MS)

    console.log(
        '[Feedback] Menunggu sebelum menampilkan popup feedback.'
    )
}

function close() {
    visible.value = false
    error.value = ''
    clearFeedbackTimeout()
}

function submitFeedback() {
    if (submitting.value) return

    const session = getMemberSession()

    if (!session) {
        error.value = 'Please log in again to submit feedback.'
        return
    }

    if (
        sessionSignature &&
        getSessionSignature(session) !== sessionSignature
    ) {
        error.value = 'Your session has changed. Please log in again.'
        return
    }

    if (!rating.value) {
        error.value = 'Please select a rating first.'
        return
    }

    submitting.value = true
    error.value = ''

    try {
        const saved = JSON.parse(
            localStorage.getItem(FEEDBACK_KEY) || '[]'
        )

        if (!Array.isArray(saved)) {
            throw new Error('Invalid feedback data')
        }

        saved.push({
            id: `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
            email: session.email,
            rating: rating.value,
            mood: moods.find(
                mood => mood.value === rating.value
            )?.label,
            comment: comment.value.trim(),
            createdAt: new Date().toISOString()
        })

        localStorage.setItem(
            FEEDBACK_KEY,
            JSON.stringify(saved)
        )

        // Tidak menyimpan status submitted/dismissed.
        // Data feedback sebelumnya tetap dipertahankan.
        visible.value = false
        resetForm()

        console.log('[Feedback] Jawaban berhasil disimpan.')
    } catch (err) {
        console.error('[Feedback] Gagal menyimpan jawaban:', err)

        error.value =
            'Feedback could not be saved. Please try again.'
    } finally {
        submitting.value = false
    }
}

// Jika sesi berubah atau pengguna logout, batalkan popup yang tertunda.
function handleStorage(event) {
    if (event.key !== SESSION_KEY && event.key !== null) {
        return
    }

    const session = getMemberSession()

    if (!session) {
        clearFeedbackTimeout()
        visible.value = false
        sessionSignature = null
        resetForm()
        return
    }

    const newSignature = getSessionSignature(session)

    if (
        sessionSignature &&
        newSignature !== sessionSignature
    ) {
        clearFeedbackTimeout()
        visible.value = false
        resetForm()
    }

    sessionSignature = newSignature
}

function handleFocus() {
    const session = getMemberSession()

    if (!session) {
        clearFeedbackTimeout()
        visible.value = false
        sessionSignature = null
        return
    }

    const newSignature = getSessionSignature(session)

    if (
        sessionSignature &&
        newSignature !== sessionSignature
    ) {
        clearFeedbackTimeout()
        visible.value = false
        resetForm()
    }

    sessionSignature = newSignature
}

onMounted(() => {
    const session = getMemberSession()

    sessionSignature = session
        ? getSessionSignature(session)
        : null

    // Event dikirim oleh fungsi pembayaran setelah berhasil.
    window.addEventListener(
        'fitlab:payment-success',
        handlePaymentSuccess
    )

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', handleFocus)

    console.log(
        '[Feedback] Siap menunggu pembayaran berhasil.'
    )
})

onBeforeUnmount(() => {
    clearFeedbackTimeout()

    window.removeEventListener(
        'fitlab:payment-success',
        handlePaymentSuccess
    )

    window.removeEventListener('storage', handleStorage)
    window.removeEventListener('focus', handleFocus)
})
</script>

<style scoped>
.feedback-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(20, 20, 30, 0.38);
    backdrop-filter: blur(5px);
}

.feedback-modal {
    width: 100%;
    max-width: 560px;
    max-height: 90dvh;
    overflow-y: auto;
    background: #fff;
    color: #292832;
    border-radius: 24px;
    padding: 30px 32px;
    box-shadow: 0 18px 60px rgba(0, 0, 0, 0.15);
}

.feedback-header,
.feedback-brand {
    display: flex;
    align-items: center;
}

.feedback-header {
    justify-content: space-between;
    padding-bottom: 22px;
    border-bottom: 1px solid #eee;
}

.feedback-brand {
    gap: 12px;
    font-size: 17px;
}

.feedback-icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: white;
    background: #292832;
}

.close-button {
    border: 0;
    background: transparent;
    color: #292832;
    font-size: 28px;
    cursor: pointer;
}

.feedback-content {
    text-align: center;
    padding-top: 26px;
}

.feedback-content h2 {
    margin: 16px 0 12px;
    font-size: clamp(23px, 4vw, 31px);
    font-weight: 750;
}

.feedback-description {
    color: #686873;
    font-size: 14px;
    line-height: 1.7;
    margin: 0 auto 28px;
    max-width: 420px;
}

.mood-options {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: clamp(5px, 2vw, 18px);
    margin: 22px 0 8px;
}

.mood-button {
    width: clamp(43px, 10vw, 66px);
    height: clamp(43px, 10vw, 66px);
    flex-shrink: 0;
    border: 1px solid #eee;
    border-radius: 50%;
    background: #f5f5f6;
    font-size: clamp(23px, 5vw, 34px);
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
}

.mood-button:hover {
    transform: scale(1.06);
}

.mood-button.selected {
    background: #d9f6d9;
    border: 3px solid #45b96c;
    transform: scale(1.12);
}

.mood-label {
    min-height: 20px;
    margin: 12px 0 22px;
    color: #555;
    font-size: 13px;
    font-weight: 600;
}

.feedback-content textarea {
    display: block;
    width: 100%;
    min-height: 110px;
    margin: 24px 0;
    padding: 15px;
    box-sizing: border-box;
    resize: vertical;
    border: 1px solid #e5e5e8;
    border-radius: 14px;
    background: #fafafa;
    color: #292832;
    font: inherit;
    font-size: 14px;
}

.feedback-content textarea:focus {
    outline: 2px solid rgba(69, 185, 108, 0.2);
    border-color: #45b96c;
}

.submit-button {
    width: 100%;
    min-height: 54px;
    border: 0;
    border-radius: 13px;
    background: linear-gradient(110deg, #2c9f91, #4cbb63);
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
}

.submit-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.later-button {
    margin-top: 12px;
    padding: 8px 16px;
    border: 0;
    background: transparent;
    color: #777;
    cursor: pointer;
}

.later-button:hover {
    color: #292832;
}

.feedback-error {
    color: #d93636;
    font-size: 13px;
}

@media (max-width: 480px) {
    .feedback-modal {
        padding: 22px 18px;
        border-radius: 20px;
    }

    .feedback-content {
        padding-top: 18px;
    }
}
</style>