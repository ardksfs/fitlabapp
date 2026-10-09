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
                            <i class="bx bx-file-report"></i>

                            <div class="header-title">
                                <h1>Reports Center</h1>
                                <p>Generate printable gym reports.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Buttons -->
                <div class="report-grid">
                    <button
                        v-for="btn in reportButtons"
                        :key="btn.label"
                        type="button"
                        class="btn-report"
                        @click="selectReport(btn.label)"
                    >
                        <i :class="btn.icon"></i>
                        <span>{{ btn.label }}</span>
                    </button>
                </div>

                <!-- Generated Report -->
                <div class="card report-area">

                    <div class="report-header">
                        <div>
                            <h2>Generated Report</h2>
                            <p v-if="selectedReport">
                                {{ selectedReport }}
                            </p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div
                        v-if="!selectedReport"
                        class="empty-state"
                    >
                        <i class="fa-solid fa-folder-open"></i>

                        <h3>Choose a report above.</h3>

                        <p>
                            Select a report type to generate and view
                            detailed insights about your gym.
                        </p>
                    </div>

                    <!-- Selected Report -->
                    <div
                        v-else
                        class="selected-report"
                    >
                        <i class="fa-solid fa-file-lines"></i>

                        <h3>{{ selectedReport }}</h3>

                        <p>
                            Report data for {{ selectedReport.toLowerCase() }}
                            will be displayed here.
                        </p>

                        <button
                            type="button"
                            class="btn-generate"
                        >
                            <i class="fa-solid fa-print"></i>
                            Generate Report
                        </button>
                    </div>

                </div>

            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    IonPage,
    IonContent,
    IonMenuButton
} from '@ionic/vue';

interface ReportButton {
    label: string;
    icon: string;
}

const reportButtons: ReportButton[] = [
    {
        label: 'Members Report',
        icon: 'bx bx-group'
    },
    {
        label: 'Attendance Report',
        icon: 'fa-regular fa-calendar-days'
    },
    {
        label: 'Revenue Report',
        icon: 'fa-solid fa-rupiah-sign'
    },
    {
        label: 'Trainer Report',
        icon: 'fa-solid fa-user-tie'
    },
    {
        label: 'Equipment Report',
        icon: 'fa-solid fa-toolbox'
    },
    {
        label: 'Payment Report',
        icon: 'bx bx-wallet-alt'
    }
];

const selectedReport = ref<string>('');

const selectReport = (report: string) => {
    selectedReport.value = report;
};
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

.report-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.btn-report {
    width: 100%;
    min-height: 60px;
    padding: 15px;
    background: #ffffff;
    color: #018181;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-report i {
    font-size: 20px;
}

.btn-report:hover {
    background: #018181;
    color: #ffffff;
    border-color: #018181;
    transform: translateY(-2px);
}

.btn-report:active {
    transform: translateY(0);
}

.card {
    background: #ffffff;
    padding: 25px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    color: #000000;
}

.report-area {
    min-height: 380px;
}

.report-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.report-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #1e293b;
}

.report-header p {
    margin: 5px 0 0;
    color: #018181;
    font-size: 0.85rem;
    font-weight: 600;
}

.empty-state {
    min-height: 280px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #64748b;
}

.empty-state i {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: 15px;
}

.empty-state h3 {
    margin: 0 0 8px;
    color: #334155;
    font-size: 1.05rem;
}

.empty-state p {
    max-width: 500px;
    margin: 0;
    line-height: 1.6;
    font-size: 0.9rem;
}

.selected-report {
    min-height: 280px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.selected-report > i {
    font-size: 3rem;
    color: #018181;
    margin-bottom: 15px;
}

.selected-report h3 {
    margin: 0 0 8px;
    color: #1e293b;
    font-size: 1.1rem;
}

.selected-report p {
    max-width: 500px;
    margin: 0 0 20px;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.6;
}

.btn-generate {
    border: none;
    background: #018181;
    color: #ffffff;
    padding: 12px 22px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s ease;
}

.btn-generate:hover {
    background: #016b6b;
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

@media (max-width: 991px) {
    .report-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
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

    .report-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        margin-bottom: 15px;
    }

    .btn-report {
        min-height: 55px;
        padding: 13px;
        font-size: 0.85rem;
    }

    .card {
        padding: 18px;
        border-radius: 14px;
    }

    .report-area {
        min-height: 350px;
    }

    .empty-state,
    .selected-report {
        min-height: 260px;
        padding: 30px 10px;
    }

    .empty-state i,
    .selected-report > i {
        font-size: 2.5rem;
    }
}

@media (max-width: 400px) {
    .header-title h1 {
        font-size: 1rem;
    }

    .header-title p {
        font-size: 0.7rem;
    }

    .btn-report {
        min-height: 52px;
    }
}
</style>