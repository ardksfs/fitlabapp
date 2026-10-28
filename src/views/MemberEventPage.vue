<template>
    <ion-page class="member-event-page">
        <ion-content :fullscreen="true" :scroll-y="true" class="event-ion-content" role="main">
            <main class="event-page">
                <header class="event-topbar">
                    <button type="button" class="back-button" @click="goBack">
                        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                        <span>Back to Dashboard</span>
                    </button>

                    <span class="event-brand" aria-label="FitLab">
                        FIT<span>LAB</span>
                    </span>
                </header>

                <section class="event-container" aria-labelledby="event-title">
                    <div class="event-eyebrow">
                        <span class="event-dot" aria-hidden="true"></span>
                        SPECIAL EVENT FOR MEMBERS ONLY
                    </div>

                    <h1 id="event-title">FitLab Mega Challenge</h1>
                    <p class="event-subtitle">Special Workout</p>

                    <div class="event-banner-frame">
                        <img :src="adBanner" alt="FitLab Mega Challenge — Special Workout" class="event-banner" />
                    </div>

                    <section class="event-details" aria-labelledby="event-details-title">
                        <h2 id="event-details-title">
                            Ready for the challenge?
                        </h2>

                        <p class="event-description">
                            Join Member dan Ikuti FitLab Mega Challenge, challenge workout spesial
                            khusus khusus member FitLab. Tantang dirimu, bangun konsistensi,
                            dan mulai perjalanan fitness berikutnya bersama FitLab.
                        </p>

                        <div class="event-price">
                            <div class="price-copy">
                                <span class="price-label">
                                    SPECIAL REGISTRATION PRICE
                                </span>

                                <span class="price-caption">
                                    Harga pendaftaran event
                                </span>
                            </div>

                            <strong>Rp99.000</strong>
                        </div>

                        <button type="button" class="join-event-button" @click="showUnavailableAlert">
                            <span>Klik di sini untuk join</span>
                            <span class="join-arrow" aria-hidden="true">→</span>
                        </button>

                        <p class="event-note">
                            Event khusus member FitLab. Informasi pendaftaran akan
                            diperbarui saat halaman pendaftaran resmi tersedia.
                        </p>
                    </section>
                </section>

                <footer class="event-footer">
                    FITLAB <span>·</span> Train. Track. Transform.
                </footer>
            </main>
        </ion-content>

        <Teleport to="body">
            <Transition name="event-alert">
                <div v-if="unavailableAlertVisible" class="event-alert-overlay" role="presentation"
                    @click.self="closeUnavailableAlert">
                    <section class="event-alert-dialog" role="alertdialog" aria-modal="true"
                        aria-labelledby="event-alert-title" aria-describedby="event-alert-description" @click.stop>
                        <button ref="alertCloseButton" type="button" class="event-alert-close"
                            aria-label="Tutup pemberitahuan" @click="closeUnavailableAlert">
                            <span aria-hidden="true">×</span>
                        </button>

                        <div class="event-alert-icon" aria-hidden="true">
                            <svg viewBox="0 0 48 48" fill="none">
                                <circle cx="24" cy="24" r="22" fill="currentColor" opacity=".11" />

                                <path d="M24 14.5V25.5" stroke="currentColor" stroke-width="3.4"
                                    stroke-linecap="round" />

                                <circle cx="24" cy="32" r="1.9" fill="currentColor" />
                            </svg>
                        </div>

                        <span class="event-alert-kicker">FITLAB EVENT</span>

                        <h2 id="event-alert-title">
                            505 Page belum tersedia
                        </h2>

                        <p id="event-alert-description">
                            Halaman pendaftaran event ini sedang disiapkan.
                            Silakan coba lagi nanti.
                        </p>

                        <button type="button" class="event-alert-confirm" @click="closeUnavailableAlert">
                            Mengerti
                        </button>
                    </section>
                </div>
            </Transition>
        </Teleport>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import {
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const adBanner = '/assets/Ads1.webp';

const unavailableAlertVisible = ref(false);
const alertCloseButton = ref<HTMLButtonElement | null>(null);

function getDashboardFallback(): string {
    const routes = router.getRoutes();

    // Coba route dashboard member yang umum dipakai.
    const preferredPaths = [
        '/user/dashboard',
        '/member/dashboard',
        '/user',
        '/member',
    ];

    for (const preferredPath of preferredPaths) {
        const match = routes.find(
            (item) => item.path === preferredPath,
        );

        if (match) {
            return match.path;
        }
    }

    const likelyRoute = routes.find((item) => {
        const name = String(item.name ?? '').toLowerCase();
        const path = item.path.toLowerCase();

        return (
            (name.includes('user') || name.includes('member')) &&
            (name.includes('dashboard') || path.includes('dashboard')) &&
            !path.includes('member-event')
        );
    });

    if (likelyRoute?.path) {
        return likelyRoute.path;
    }

    return '/user/dashboard';
}

function isSafeInternalReturnPath(
    value: unknown,
): value is string {
    if (
        typeof value !== 'string' ||
        !value.startsWith('/') ||
        value.startsWith('//')
    ) {
        return false;
    }

    const pathOnly = value.split('?')[0].split('#')[0];

    return !(
        pathOnly === '/member-event' ||
        pathOnly.startsWith('/admin') ||
        pathOnly.startsWith('/pt') ||
        pathOnly.startsWith('/login')
    );
}

async function goBack() {
    // Ambil route asal yang dikirim oleh MemberAdPopup.
    const queryFrom = route.query.from;
    const from = Array.isArray(queryFrom)
        ? queryFrom[0]
        : queryFrom;

    const destination = isSafeInternalReturnPath(from)
        ? from
        : getDashboardFallback();

    try {
        const resolved = router.resolve(destination);

        if (!resolved.matched.length) {
            throw new Error(
                `Route tujuan tidak ditemukan: ${destination}`,
            );
        }

        await router.replace(destination);
    } catch (error) {
        console.error(
            'Gagal kembali ke dashboard member:',
            error,
        );

        window.location.assign(destination);
    }
}

function showUnavailableAlert() {
    unavailableAlertVisible.value = true;
}

function closeUnavailableAlert() {
    unavailableAlertVisible.value = false;
}

function handleEscape(event: KeyboardEvent) {
    if (
        event.key === 'Escape' &&
        unavailableAlertVisible.value
    ) {
        closeUnavailableAlert();
    }
}

watch(unavailableAlertVisible, async (isVisible) => {
    if (isVisible) {
        await nextTick();
        alertCloseButton.value?.focus();
    }
});

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.member-event-page {
    --event-teal: #018181;
    --event-teal-dark: #05685f;
    --event-orange: #f58020;

    color: #253344;
}

.event-ion-content {
    --background: #f5f7f8;
    --overflow: auto;
}

.event-ion-content::part(scroll) {
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
}

.event-page {
    min-height: 100%;
    box-sizing: border-box;
    padding: 0 24px 30px;
    color: #253344;
    background:
        radial-gradient(ellipse at top,
            rgb(1 129 129 / 9%),
            transparent 48%),
        #f5f7f8;
}

.event-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    max-width: 1080px;
    min-height: 72px;
    box-sizing: border-box;
    margin: 0 auto;
    border-bottom: 1px solid #e3e9eb;
}

.back-button {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    min-height: 42px;
    padding: 8px 0;
    border: 0;
    color: #536170;
    background: transparent;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    touch-action: manipulation;
}

.back-button:hover,
.back-button:focus-visible {
    color: var(--event-teal);
}

.back-button:focus-visible,
.join-event-button:focus-visible,
.event-alert-close:focus-visible,
.event-alert-confirm:focus-visible {
    outline: 3px solid rgb(1 129 129 / 30%);
    outline-offset: 3px;
}

.back-arrow {
    font-size: 22px;
    line-height: 1;
}

.event-brand {
    color: var(--event-teal);
    font-size: 17px;
    font-weight: 950;
    letter-spacing: 1.8px;
}

.event-brand span {
    color: var(--event-orange);
}

.event-container {
    width: 100%;
    max-width: 820px;
    box-sizing: border-box;
    margin: 38px auto 0;
    padding: 34px;
    border: 1px solid #e7ecee;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 12px 40px rgb(30 50 60 / 5%);
}

.event-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--event-teal);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 1.25px;
    line-height: 1.5;
}

.event-dot {
    flex: 0 0 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--event-teal);
    box-shadow: 0 0 0 4px #e5f5f1;
}

.event-container h1 {
    margin: 17px 0 5px;
    color: #1d2936;
    font-size: clamp(28px, 5vw, 42px);
    font-weight: 850;
    line-height: 1.16;
    letter-spacing: -1.1px;
    overflow-wrap: anywhere;
}

.event-subtitle {
    margin: 0 0 25px;
    color: #74808c;
    font-size: 16px;
}

.event-banner-frame {
    width: 100%;
    overflow: hidden;
    border-radius: 13px;
    background: #edf0f2;
}

.event-banner {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: contain;
    object-position: center;
}

.event-details {
    padding-top: 27px;
}

.event-details h2 {
    margin: 0 0 10px;
    color: #253344;
    font-size: 22px;
    font-weight: 800;
    line-height: 1.35;
}

.event-description {
    margin: 0;
    color: #687584;
    font-size: 14px;
    line-height: 1.85;
}

.event-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 24px;
    padding: 18px;
    border: 1px solid #d9eeea;
    border-radius: 12px;
    background: #f1faf8;
}

.price-copy {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.price-label {
    color: var(--event-teal);
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 0.8px;
}

.price-caption {
    color: #697771;
    font-size: 12px;
}

.event-price strong {
    color: var(--event-teal);
    font-size: 24px;
    font-weight: 900;
    white-space: nowrap;
}

.join-event-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    min-height: 49px;
    margin-top: 18px;
    padding: 13px 20px;
    border: 0;
    border-radius: 10px;
    color: #ffffff;
    background: var(--event-teal);
    font: inherit;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    touch-action: manipulation;
    transition:
        background 0.2s ease,
        transform 0.2s ease,
        box-shadow 0.2s ease;
}

.join-event-button:hover {
    background: var(--event-teal-dark);
    box-shadow: 0 7px 18px rgb(1 129 129 / 18%);
    transform: translateY(-1px);
}

.join-arrow {
    font-size: 18px;
    line-height: 1;
}

.event-note {
    margin: 16px 0 0;
    color: #8a949e;
    font-size: 11px;
    line-height: 1.7;
    text-align: center;
}

.event-footer {
    padding: 25px 0 8px;
    color: #8b969e;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 1px;
    text-align: center;
}

.event-footer span {
    padding: 0 5px;
    color: var(--event-orange);
}

/* Popup custom FitLab */
.event-alert-overlay {
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483000 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    padding: 16px !important;
    box-sizing: border-box !important;
    overflow-y: auto !important;
    background: rgba(15, 23, 42, 0.68) !important;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
}

.event-alert-dialog {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    width: 100% !important;
    max-width: 390px !important;
    max-height: calc(100dvh - 32px) !important;
    margin: auto !important;
    padding: 34px 26px 26px !important;
    overflow-y: auto !important;
    box-sizing: border-box !important;
    border: 1px solid #e5e7eb !important;
    border-radius: 22px !important;
    background: #ffffff !important;
    color: #243244 !important;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28) !important;
    text-align: center !important;
}

.event-alert-dialog .event-alert-close {
    position: absolute !important;
    top: 12px !important;
    right: 12px !important;
    display: grid !important;
    place-items: center !important;
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    border-radius: 50% !important;
    background: #f1f5f9 !important;
    color: #475569 !important;
    font-size: 25px !important;
    line-height: 1 !important;
    cursor: pointer !important;
    appearance: none !important;
    transition: all 0.2s ease !important;
}

.event-alert-dialog .event-alert-close span {
    color: inherit !important;
    font-size: 25px !important;
    line-height: 1 !important;
}

.event-alert-dialog .event-alert-close:hover {
    background: #b45309 !important;
    color: #ffffff !important;
    transform: rotate(90deg) !important;
}

.event-alert-dialog .event-alert-icon {
    display: grid !important;
    place-items: center !important;
    flex: 0 0 72px !important;
    width: 72px !important;
    height: 72px !important;
    margin: 0 auto 17px !important;
    padding: 0 !important;
    border-radius: 20px !important;
    background: #fff2df !important;
    color: #c76b12 !important;
}

.event-alert-dialog .event-alert-icon svg {
    display: block !important;
    width: 46px !important;
    height: 46px !important;
}

.event-alert-dialog .event-alert-kicker {
    display: block !important;
    margin: 0 0 9px !important;
    color: #087f78 !important;
    font-size: 10px !important;
    font-weight: 800 !important;
    line-height: 1.5 !important;
    letter-spacing: 1.5px !important;
}

.event-alert-dialog h2#event-alert-title {
    display: block !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #172b3a !important;
    background: transparent !important;
    font-family: inherit !important;
    font-size: 24px !important;
    font-weight: 850 !important;
    line-height: 1.35 !important;
    letter-spacing: -0.4px !important;
    text-align: center !important;
    text-transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
}

.event-alert-dialog p#event-alert-description {
    display: block !important;
    width: 100% !important;
    max-width: 310px !important;
    margin: 12px auto 0 !important;
    padding: 0 !important;
    color: #596879 !important;
    background: transparent !important;
    font-family: inherit !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 1.75 !important;
    text-align: center !important;
    opacity: 1 !important;
    visibility: visible !important;
}

.event-alert-dialog .event-alert-confirm {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    min-height: 48px !important;
    margin: 23px 0 0 !important;
    padding: 12px 18px !important;
    border: 1px solid #087f78 !important;
    border-radius: 11px !important;
    background: #087f78 !important;
    color: #ffffff !important;
    box-shadow: 0 6px 16px rgba(8, 127, 120, 0.2) !important;
    font-family: inherit !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    line-height: 1.3 !important;
    text-align: center !important;
    text-transform: none !important;
    cursor: pointer !important;
    appearance: none !important;
    transition: all 0.2s ease !important;
}

.event-alert-dialog .event-alert-confirm:hover {
    background: #06645f !important;
    border-color: #06645f !important;
    color: #ffffff !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 20px rgba(8, 127, 120, 0.25) !important;
}

.event-alert-dialog .event-alert-close:focus-visible,
.event-alert-dialog .event-alert-confirm:focus-visible {
    outline: 3px solid rgba(1, 129, 129, 0.35) !important;
    outline-offset: 3px !important;
}

@media (max-width: 600px) {
    .event-alert-overlay {
        padding: 12px !important;
    }

    .event-alert-dialog {
        max-width: 360px !important;
        padding: 30px 20px 22px !important;
        border-radius: 19px !important;
    }

    .event-alert-dialog h2#event-alert-title {
        font-size: 22px !important;
    }

    .event-alert-dialog p#event-alert-description {
        font-size: 13px !important;
    }
}

/* HP/tablet: scrollbar disembunyikan, scrolling tetap jalan. */
@media (max-width: 1024px) {
    .event-ion-content::part(scroll) {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .event-ion-content::part(scroll)::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

@media (max-width: 600px) {
    .event-page {
        padding: 0 14px 22px;
    }

    .event-topbar {
        min-height: 62px;
    }

    .back-button {
        gap: 6px;
        min-height: 44px;
        font-size: 12px;
    }

    .event-brand {
        font-size: 15px;
        letter-spacing: 1.3px;
    }

    .event-container {
        margin-top: 20px;
        padding: 17px;
        border-radius: 15px;
    }

    .event-eyebrow {
        font-size: 9px;
        letter-spacing: 0.8px;
    }

    .event-container h1 {
        margin-top: 15px;
        font-size: clamp(27px, 8vw, 32px);
        letter-spacing: -0.7px;
    }

    .event-subtitle {
        margin-bottom: 18px;
        font-size: 14px;
    }

    .event-banner-frame {
        border-radius: 10px;
    }

    .event-details {
        padding-top: 21px;
    }

    .event-details h2 {
        font-size: 19px;
    }

    .event-description {
        font-size: 13px;
        line-height: 1.75;
    }

    .event-price {
        align-items: flex-start;
        flex-direction: column;
        gap: 9px;
        margin-top: 18px;
        padding: 14px;
    }

    .event-price strong {
        font-size: 23px;
    }

    .join-event-button {
        min-height: 47px;
        font-size: 13px;
    }

    .event-alert-overlay {
        align-items: center;
        padding: 14px;
    }

    .event-alert-dialog {
        width: 100%;
        max-width: 360px;
        max-height: calc(100dvh - 28px);
        padding: 28px 21px 21px;
        border-radius: 20px;
    }

    .event-alert-close {
        top: 9px;
        right: 9px;
        width: 33px;
        height: 33px;
    }

    .event-alert-icon {
        width: 62px;
        height: 62px;
        margin-bottom: 14px;
        border-radius: 18px;
    }

    .event-alert-icon svg {
        width: 43px;
        height: 43px;
    }

    .event-alert-dialog h2 {
        font-size: 21px;
    }

    .event-alert-dialog p {
        font-size: 12px;
    }

    .event-alert-confirm {
        margin-top: 20px;
    }
}

@media (prefers-reduced-motion: reduce) {

    .join-event-button,
    .event-alert-close,
    .event-alert-confirm,
    .event-alert-enter-active,
    .event-alert-leave-active,
    .event-alert-enter-active .event-alert-dialog,
    .event-alert-leave-active .event-alert-dialog {
        transition: none;
    }
}
</style>