<template>
    <!-- Popup iklan saja. Announcement ditampilkan di modal Notifications UserDashboard. -->
    <Teleport to="body">
        <Transition name="ad-fade">
            <div v-if="popupVisible" class="member-ad-overlay" role="presentation" @click.self="closePopup">
                <section class="member-ad-modal" role="dialog" aria-modal="true" aria-labelledby="member-ad-title">
                    <button type="button" class="ad-close-button" aria-label="Tutup iklan" @click="closePopup">
                        &times;
                    </button>

                    <h2 id="member-ad-title" class="visually-hidden">
                        Special event for members only
                    </h2>

                    <button type="button" class="ad-banner-button" aria-label="Lihat FitLab Mega Challenge"
                        @click="goToEvent">
                        <img :src="adBanner" alt="FitLab Mega Challenge — Special Workout" class="ad-banner-image" />
                    </button>

                    <div class="ad-caption">
                        <p class="ad-caption-title">Special event for members only!</p>
                        <p class="ad-caption-description">
                            FitLab Mega Challenge — Special Workout. Daftar sekarang cuma 99K!
                        </p>
                        <button type="button" class="ad-join-button" @click="goToEvent">
                            Lihat event <span aria-hidden="true">→</span>
                        </button>
                    </div>

                    <label class="ad-opt-out">
                        <input type="checkbox" :checked="adsDisabled" @change="toggleAdsPreference" />
                        <span>Jangan tampilkan iklan ini lagi</span>
                    </label>

                    <p class="ad-timer" aria-live="polite">
                        Iklan ditutup otomatis dalam
                        <strong>{{ secondsRemaining }}</strong> detik
                    </p>
                </section>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Ads1.webp berada di public/assets/Ads1.webp.
const adBanner = '/assets/Ads1.webp';
const SESSION_KEY = 'fitlab_session';
const AD_PREFERENCE_PREFIX = 'fitlab-member-ads-disabled:';

const popupVisible = ref(false);
const adsDisabled = ref(false);
const secondsRemaining = ref(10);
let countdownTimer: ReturnType<typeof setInterval> | undefined;
let currentPreferenceKey = `${AD_PREFERENCE_PREFIX}guest`;
let loginNavigationPending = false;

function getMemberEmail(): string {
    try {
        const rawSession = localStorage.getItem(SESSION_KEY);
        if (!rawSession) return 'guest';

        const session = JSON.parse(rawSession) as {
            email?: string;
            user?: { email?: string };
            member?: { email?: string };
            profile?: { email?: string };
        };

        const email =
            session.email ?? session.user?.email ?? session.member?.email ?? session.profile?.email ?? '';
        return email.trim().toLowerCase() || 'guest';
    } catch (error) {
        console.error('Gagal membaca sesi member FitLab:', error);
        return 'guest';
    }
}

function clearCountdown() {
    if (countdownTimer !== undefined) {
        clearInterval(countdownTimer);
        countdownTimer = undefined;
    }
}

function closePopup() {
    popupVisible.value = false;
    clearCountdown();
}

function startCountdown() {
    clearCountdown();
    secondsRemaining.value = 90;
    countdownTimer = setInterval(() => {
        secondsRemaining.value -= 1;
        if (secondsRemaining.value <= 0) closePopup();
    }, 1000);
}

function toggleAdsPreference(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    adsDisabled.value = checkbox.checked;

    try {
        if (adsDisabled.value) {
            localStorage.setItem(currentPreferenceKey, 'true');
            closePopup();
        } else {
            localStorage.removeItem(currentPreferenceKey);
            popupVisible.value = true;
            startCountdown();
        }
    } catch (error) {
        console.error('Gagal menyimpan preferensi iklan:', error);
    }
}

async function goToEvent() {
    closePopup();
    const from = router.currentRoute.value.fullPath || '/user/dashboard';

    try {
        const target = router.resolve({ path: '/member-event' });
        if (!target.matched.length) {
            window.alert('Halaman event belum terdaftar di router. Tambahkan route /member-event terlebih dahulu.');
            return;
        }

        await router.push({ path: '/member-event', query: { from } });
    } catch (error) {
        console.error('Gagal membuka halaman event FitLab:', error);
        window.alert('Halaman event gagal dibuka. Periksa konfigurasi route /member-event.');
    }
}

function handleEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && popupVisible.value) closePopup();
}

function showPopupForCurrentLogin() {
    currentPreferenceKey = `${AD_PREFERENCE_PREFIX}${getMemberEmail()}`;
    try {
        adsDisabled.value = localStorage.getItem(currentPreferenceKey) === 'true';
        if (!adsDisabled.value) {
            popupVisible.value = true;
            startCountdown();
        } else {
            closePopup();
        }
    } catch (error) {
        console.error('Gagal membaca preferensi iklan:', error);
        popupVisible.value = true;
        startCountdown();
    }
}

// Ionic dapat menyimpan halaman dashboard di cache. Deteksi transisi login -> dashboard
// supaya popup tetap bisa muncul pada login berikutnya tanpa muncul lagi saat Back dari event.
watch(
    () => router.currentRoute.value.path,
    (path) => {
        if (path === '/login' || path.startsWith('/login/')) {
            loginNavigationPending = true;
            closePopup();
            return;
        }

        if (path === '/member-event') {
            closePopup();
            return;
        }

        if (loginNavigationPending) {
            loginNavigationPending = false;
            showPopupForCurrentLogin();
        }
    },
);

onMounted(() => {
    showPopupForCurrentLogin();
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    clearCountdown();
    window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.member-ad-overlay {
    position: fixed;
    z-index: 99999;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 20px;
    overflow-y: auto;
    background: rgb(45 49 54 / 68%);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
}

.member-ad-modal {
    position: relative;
    width: min(100%, 760px);
    max-height: calc(100dvh - 40px);
    overflow-y: auto;
    box-sizing: border-box;
    padding: 18px;
    border: 1px solid rgb(255 255 255 / 65%);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 80px rgb(0 0 0 / 30%);
}

.ad-close-button {
    position: absolute;
    z-index: 2;
    top: 8px;
    right: 8px;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: rgb(24 29 34 / 72%);
    font-size: 27px;
    line-height: 1;
    cursor: pointer;
}

.ad-close-button:hover {
    background: #078575;
}

.ad-banner-button {
    display: block;
    width: 100%;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 10px;
    background: #f0f2f4;
    cursor: pointer;
}

.ad-banner-image {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: contain;
    object-position: center;
}

.ad-caption {
    padding: 15px 2px 4px;
}

.ad-caption-title {
    margin: 0 0 6px;
    color: #1d2936;
    font-size: 19px;
    font-weight: 800;
    line-height: 1.4;
}

.ad-caption-description {
    margin: 0;
    color: #5d6875;
    font-size: 14px;
    line-height: 1.6;
}

.ad-join-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 14px;
    padding: 11px 16px;
    border: 0;
    border-radius: 9px;
    color: #fff;
    background: #078575;
    font-size: 13px;
    font-weight: 750;
    cursor: pointer;
}

.ad-join-button:hover {
    background: #05685c;
}

.ad-opt-out {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 17px;
    padding-top: 13px;
    border-top: 1px solid #e9edf0;
    color: #586472;
    font-size: 12px;
    line-height: 1.5;
    cursor: pointer;
}

.ad-opt-out input {
    width: 15px;
    height: 15px;
    margin: 1px 0 0;
    flex-shrink: 0;
    accent-color: #078575;
    cursor: pointer;
}

.ad-timer {
    margin: 8px 0 0;
    color: #8a929c;
    font-size: 11px;
    text-align: right;
}

.ad-timer strong {
    color: #078575;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.ad-fade-enter-active,
.ad-fade-leave-active {
    transition: opacity .22s ease;
}

.ad-fade-enter-active .member-ad-modal,
.ad-fade-leave-active .member-ad-modal {
    transition: transform .22s ease;
}

.ad-fade-enter-from,
.ad-fade-leave-to {
    opacity: 0;
}

.ad-fade-enter-from .member-ad-modal,
.ad-fade-leave-to .member-ad-modal {
    transform: translateY(8px) scale(.985);
}

@media (max-width: 600px) {
    .member-ad-overlay {
        padding: 12px;
    }

    .member-ad-modal {
        width: 100%;
        max-height: calc(100dvh - 24px);
        padding: 12px;
        border-radius: 13px;
    }

    .ad-caption-title {
        padding-right: 22px;
        font-size: 16px;
    }

    .ad-caption-description {
        font-size: 12px;
    }
}

@media (prefers-reduced-motion: reduce) {

    .ad-fade-enter-active,
    .ad-fade-leave-active,
    .ad-fade-enter-active .member-ad-modal,
    .ad-fade-leave-active .member-ad-modal {
        transition: none;
    }
}
</style>
