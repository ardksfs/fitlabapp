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

                        <!-- Analytics Navigation -->
                        <router-link to="/analytics" class="header-link">
                            <div class="header-nav">
                                <i class="bx bx-doughnut-chart"></i>

                                <div class="header-title">
                                    <h1>Analytics Overview</h1>
                                    <p>Monitor gym performance, revenue, and membership trends.</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>

                <!-- Charts Grid -->
                <div class="charts-grid">

                    <!-- Monthly Revenue -->
                    <div class="chart-card">
                        <h3>Monthly Revenue</h3>

                        <div class="chart-wrapper">
                            <ChartWrapper
                                type="bar"
                                :data="revenueData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>

                    <!-- Attendance Analytics -->
                    <div class="chart-card">
                        <h3>Attendance Analytics</h3>

                        <div class="chart-wrapper">
                            <ChartWrapper
                                type="doughnut"
                                :data="attendanceData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>

                    <!-- Member Growth -->
                    <div class="chart-card">
                        <h3>Member Growth</h3>

                        <div class="chart-wrapper">
                            <ChartWrapper
                                type="line"
                                :data="growthData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>

                    <!-- Membership Distribution -->
                    <div class="chart-card">
                        <h3>Membership Distribution</h3>

                        <div class="chart-wrapper">
                            <ChartWrapper
                                type="pie"
                                :data="plansData"
                                :options="chartOptions"
                            />
                        </div>
                    </div>

                </div>
            </div>
            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonMenuButton } from '@ionic/vue';
import ChartWrapper from '../../components/ChartWrapper.vue';

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

const revenueData = {
    labels: ['Paid', 'Pending'],
    datasets: [
        {
            label: 'Revenue',
            data: [6000, 0],
            backgroundColor: ['#3B82F6', '#e2e8f0'],
            borderRadius: 6,
        },
    ],
};

const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Members',
            data: [5, 12, 20, 35, 53, 58],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            fill: true,
            tension: 0.4,
        },
    ],
};

const attendanceData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
        {
            data: [85, 8, 7],
            backgroundColor: ['#3B82F6', '#f43f5e', '#f59e0b'],
        },
    ],
};

const plansData = {
    labels: ['Gold', 'Premium'],
    datasets: [
        {
            data: [50, 50],
            backgroundColor: ['#3B82F6', '#f43f5e'],
        },
    ],
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

.header-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #018181;
    cursor: pointer;
    transition: 0.3s ease;
}

.header-nav > i {
    font-size: 28px;
    transition: 0.3s ease;
}

.header-link:hover .header-nav > i {
    transform: scale(1.08);
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

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
}

.chart-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
    min-width: 0;
}

.chart-card h3 {
    margin: 0 0 15px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
}

.chart-wrapper {
    position: relative;
    width: 100%;
    height: 280px;
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

@media (max-width: 991px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }

    .chart-card {
        min-height: 350px;
    }

    .chart-wrapper {
        height: 280px;
    }
    .hamburger-mobile {
        display: flex !important;
    }
}

@media (max-width: 600px) {
    .container {
        padding: 15px;
    }

    .topbar {
        margin-bottom: 15px;
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

    .charts-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .chart-card {
        padding: 16px;
        min-height: 300px;
        border-radius: 14px;
    }

    .chart-card h3 {
        font-size: 0.95rem;
        margin-bottom: 12px;
    }

    .chart-wrapper {
        height: 240px;
    }
}

@media (max-width: 400px) {
    .header-title h1 {
        font-size: 1rem;
    }

    .header-title p {
        font-size: 0.7rem;
    }

    .chart-card {
        min-height: 280px;
    }

    .chart-wrapper {
        height: 220px;
    }
}
</style>