<template>
    <ion-page>
        <ion-content class="page-bg">
            <div class="container">

                <!-- Top Bar -->
                <div class="topbar">
                    <div class="nav-left">
                        <ion-menu-button
                            menu="main-menu"
                            class="hamburger-mobile"
                        >
                            <i class="bx bx-menu"></i>
                        </ion-menu-button>

                        <div class="header-nav">
                            <i class="bx bx-cog"></i>

                            <div class="header-title">
                                <h1>Settings</h1>
                                <p>Customize your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Grid -->
                <div class="settings-grid">

                    <!-- Gym Information -->
                    <div class="card">
                        <h3>
                            <i class="fa-solid fa-circle-info"></i>
                            Gym Information
                        </h3>

                        <div class="gym-info">
                            <h4>FitLab Fitness</h4>

                            <p>
                                FitLab Fitness adalah pusat kebugaran yang
                                dirancang untuk membantu member mencapai
                                gaya hidup sehat dan meningkatkan kebugaran
                                secara konsisten.
                            </p>

                            <p>
                                Berdiri dengan tujuan menyediakan lingkungan
                                latihan yang nyaman, modern, dan mendukung
                                berbagai kebutuhan fitness member.
                            </p>

                            <div class="slogan">
                                <i class="fa-solid fa-quote-left"></i>
                                <span>
                                    Train Strong. Live Healthy.
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Data Management -->
                    <div class="card">
                        <h3>
                            <i class="fa-solid fa-database"></i>
                            Data Management
                        </h3>

                        <button type="button" class="list-btn">
                            <i class="fa-solid fa-pen"></i>
                            <span>Update Gym Information</span>
                        </button>

                        <button type="button" class="list-btn">
                            <i class="fa-solid fa-upload"></i>
                            <span>Export JSON</span>
                        </button>

                        <button type="button" class="list-btn">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <span>Backup Data</span>
                        </button>

                        <button type="button" class="list-btn">
                            <i class="fa-solid fa-print"></i>
                            <span>Print Dashboard</span>
                        </button>

                        <button type="button" class="btn-delete-all">
                            <i class="fa-solid fa-trash"></i>
                            <span>Delete All Data</span>
                        </button>
                    </div>

                    <!-- Application Features -->
                    <div class="card">
                        <h3>
                            <i class="fa-solid fa-star"></i>
                            Application Features
                        </h3>

                        <div class="list-item">
                            <span>
                                <i class="bx bx-group feature-icon"></i>
                                Member Management
                            </span>

                            <i class="fa-solid fa-circle-check check-icon"></i>
                        </div>

                        <div class="list-item">
                            <span>
                                <i class="fa-regular fa-calendar-days feature-icon"></i>
                                Attendance
                            </span>

                            <i class="fa-solid fa-circle-check check-icon"></i>
                        </div>

                        <div class="list-item">
                            <span>
                                <i class="bx bx-wallet-alt feature-icon"></i>
                                Payments
                            </span>

                            <i class="fa-solid fa-circle-check check-icon"></i>
                        </div>

                        <div class="list-item">
                            <span>
                                <i class="fa-solid fa-user-tie feature-icon"></i>
                                Trainer Management
                            </span>

                            <i class="fa-solid fa-circle-check check-icon"></i>
                        </div>

                        <div class="list-item">
                            <span>
                                <i class="fa-solid fa-toolbox feature-icon"></i>
                                Equipment Management
                            </span>

                            <i class="fa-solid fa-circle-check check-icon"></i>
                        </div>
                    </div>

                    <!-- Gym Performance -->
                    <div class="card">
                        <h3>
                            <i class="fa-solid fa-chart-line"></i>
                            Gym Performance
                        </h3>

                        <div class="performance-placeholder">
                            <div class="tech-logos">
                                <a href="https://www.figma.com/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo figma" aria-label="Figma">
                                    <img src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" alt="Figma" />
                                </a>

                                <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo cloudflare" aria-label="Cloudflare">
                                    <img src="https://www.vectorlogo.zone/logos/cloudflare/cloudflare-official.svg"
                                        alt="Cloudflare" />
                                </a>

                                <a href="https://github.com/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo github" aria-label="GitHub">
                                    <img src="https://www.vectorlogo.zone/logos/github/github-ar21.svg" alt="GitHub" />
                                </a>

                                <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo node" aria-label="Node.js">
                                    <img src="https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg" alt="Node.js" />
                                </a>

                                <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo google-fonts" aria-label="Google Fonts">
                                    <img src="https://www.vectorlogo.zone/logos/google_fonts/google_fonts-ar21.svg"
                                        alt="Google Fonts" />
                                </a>

                                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer"
                                    class="tech-logo analytics" aria-label="Google Analytics">
                                    <img src="https://www.vectorlogo.zone/logos/google_analytics/google_analytics-ar21.svg"
                                        alt="Google Analytics" />
                                </a>
                            </div>

                            <h4>Built with Modern Technology</h4>

                            <p>
                                Powered by the tools behind FitLab.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            <AppFooter />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
    IonPage,
    IonContent,
    IonMenuButton
} from '@ionic/vue';
import AppFooter from '@/components/AppFooter.vue'

</script>

<style scoped>
.page-bg {
    --background: #f8fafc;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.nav-left {
    display: flex;
    align-items: center;
}

.hamburger-mobile {
    --background: transparent;
    --background-hover: transparent;
    --background-activated: transparent;
    --background-focused: transparent;
    --color: #0f172a;
    --box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin: 0;
    padding: 0;
    color: #0f172a;
    font-size: 24px;
    background: transparent;
    border: none;
    box-shadow: none;
    min-width: 44px;
    min-height: 44px;
}

.hamburger-mobile::part(native) {
    background: transparent;
    color: #0f172a;
    border: none;
    box-shadow: none;
    padding: 0;
}

.hamburger-mobile i {
    color: #0f172a;
    font-size: 24px;
}


.header-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #018181;
}

.header-nav > i {
    font-size: 28px;
}

.header-title h1 {
    margin: 0;
    color: #018181;
    font-size: 1.4rem;
    font-weight: 700;
}

.header-title p {
    margin: 2px 0 0;
    color: #64748b;
    font-size: 0.85rem;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
}

.card {
    background: #ffffff;
    padding: 25px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    color: #000000;
}

.card h3 {
    margin: 0 0 20px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
}

.card h3 > i {
    color: #018181;
}

.gym-info h4 {
    margin: 0 0 10px;
    color: #1e293b;
    font-size: 1.05rem;
}

.gym-info p {
    margin: 0 0 12px;
    color: #64748b;
    font-size: 0.88rem;
    line-height: 1.7;
}

.slogan {
    margin-top: 20px;
    padding: 14px 16px;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #018181;
    font-size: 0.9rem;
    font-weight: 600;
}

.slogan i {
    font-size: 14px;
}

.list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    border-bottom: 1px solid #eee;
    color: #334155;
    font-size: 0.9rem;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item span {
    display: flex;
    align-items: center;
    gap: 10px;
}

.feature-icon {
    color: #018181;
    font-size: 19px;
}

.check-icon {
    color: #22C55E;
    font-size: 18px;
}

.list-btn {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 10px;
    background: #ffffff;
    color: #334155;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: inherit;
    font-size: 0.88rem;
    transition: all 0.3s ease;
}

.list-btn i {
    width: 18px;
    color: #64748b;
    transition: 0.3s ease;
}

.list-btn:hover {
    border-color: #018181;
    color: #018181;
    background: #f0fdfa;
}

.list-btn:hover i {
    color: #018181;
}

.btn-delete-all {
    width: 100%;
    padding: 12px;
    margin-top: 10px;
    border: 1px solid #ef4444;
    border-radius: 8px;
    background: #ffffff;
    color: #ef4444;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-delete-all:hover {
    background: #ef4444;
    color: #ffffff;
}
/*GYM PERFORMANCE*/

.performance-placeholder {
    min-height: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 24px 16px;
    box-sizing: border-box;
}

.tech-logos {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 26px;
}

.tech-logo {
    width: 76px;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    text-decoration: none;
    filter: grayscale(1);
    opacity: 0.55;
    transition:
        filter 0.35s ease,
        opacity 0.35s ease,
        transform 0.35s ease,
        background-color 0.35s ease,
        border-color 0.35s ease,
        box-shadow 0.35s ease;
}

/* Logo image */
.tech-logo img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    transition: transform 0.35s ease;
}

.tech-logo:hover {
    filter: grayscale(0);
    opacity: 1;
    background: #f0fdfa;
    border-color: #018181;
    transform: translateY(-5px);
    box-shadow:
        0 5px 14px rgba(1, 129, 129, 0.12),
        0 0 0 3px rgba(1, 129, 129, 0.05);
}

.tech-logo:hover img {
    transform: scale(1.08);
}

.tech-logo:focus-visible {
    outline: 2px solid #018181;
    outline-offset: 4px;
    filter: grayscale(0);
    opacity: 1;
}

.performance-placeholder h4 {
    margin: 0 0 7px;
    color: #334155;
    font-size: 1rem;
    font-weight: 600;
}

.performance-placeholder p {
    margin: 0;
    color: #94a3b8;
    font-size: 0.82rem;
    line-height: 1.6;
}


@media (max-width: 768px) {
    .tech-logos {
        gap: 14px;
        margin-bottom: 22px;
    }

    .tech-logo {
        width: 70px;
        height: 54px;
    }
}

@media (max-width: 480px) {
    .performance-placeholder {
        min-height: 220px;
        padding: 22px 10px;
    }

    .tech-logos {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        justify-items: center;
        align-items: center;
        gap: 12px;
        max-width: 290px;
        margin: 0 auto 22px;
    }

    .tech-logo {
        width: 100%;
        max-width: 76px;
        height: 52px;
        padding: 9px;
        border-radius: 9px;
    }

    .performance-placeholder h4 {
        font-size: 0.92rem;
    }

    .performance-placeholder p {
        font-size: 0.78rem;
    }
}

/* Perangkat touch: jangan mempertahankan hover palsu */
@media (hover: none) {
    .tech-logo:hover {
        transform: none;
        box-shadow: none;
        background: #f8fafc;
        border-color: #f1f5f9;
    }

    .tech-logo:hover img {
        transform: none;
    }
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

@media (max-width: 991px) {
    .settings-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .container {
        padding: 15px;
    }

    .hamburger-mobile {
        display: flex !important;
    }

    .header-nav {
        gap: 8px;
    }

    .header-nav > i {
        font-size: 24px;
    }

    .header-title h1 {
        font-size: 1.15rem;
    }

    .header-title p {
        font-size: 0.75rem;
        line-height: 1.3;
    }

    .settings-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .card {
        padding: 18px;
        border-radius: 14px;
    }

    .card h3 {
        font-size: 1rem;
        margin-bottom: 16px;
    }

    .gym-info p {
        font-size: 0.84rem;
        line-height: 1.6;
    }

    .slogan {
        font-size: 0.82rem;
    }

    .list-item {
        font-size: 0.84rem;
    }

    .performance-placeholder {
        min-height: 200px;
    }
}

@media (max-width: 400px) {
    .header-title h1 {
        font-size: 1rem;
    }

    .header-title p {
        font-size: 0.7rem;
    }

    .card {
        padding: 16px;
    }
}
</style>