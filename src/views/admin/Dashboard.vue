<template>
    <ion-page>
        <ion-content class="dashboard-content">
            <div class="page-container">

                <!-- Top Bar -->
                <div class="topbar">
                    <div class="nav-left">
                        <!-- Hamburger (Mobile Only) -->
                        <ion-menu-button menu="main-menu" class="hamburger-mobile">
                            <i class='bx bx-menu'></i>
                        </ion-menu-button>

                        <!-- Icon Home & Title -->
                        <div class="header-nav">
                            <i class="fa-solid fa-house"></i>
                            <div class="header-title">
                                <h1>Gym Management Dashboard</h1>
                                <p>Manage members, trainers, attendance, payments and business growth.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid (HP 2 Kolom, Desktop 6 Kolom) -->
                <div class="stats-grid">
                    <div v-for="(stat, i) in stats" :key="i" class="stat-card">
                        <div class="icon-box" :style="{ color: stat.color, background: stat.color + '15' }">
                            <i :class="stat.icon"></i>
                        </div>
                        <div class="stat-info">
                            <p>{{ stat.title }}</p>
                            <h3>{{ stat.value }}</h3>
                        </div>
                    </div>
                </div>
                
                <!-- Konten Sambutan -->
                <div class="welcome-banner">
                    <h2>HALO SELAMAT DATANG DAN SELAMAT BEKERJA</h2>
                    <p>Berkerjalah Dengan Jujur dan Bertanggung Jawab Yaaa</p>
                </div>

                <!-- Charts Grid (2x2) -->
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Monthly Revenue</h3>
                        <ChartWrapper type="bar" :data="revenueData" :options="barOptions" />
                    </div>
                    <div class="chart-card">
                        <h3>Member Growth</h3>
                        <ChartWrapper type="line" :data="growthData" :options="lineOptions" />
                    </div>
                    <div class="chart-card">
                        <h3>Attendance Overview</h3>
                        <ChartWrapper type="doughnut" :data="attendanceData" :options="pieOptions" />
                    </div>
                    <div class="chart-card">
                        <h3>Membership Plans</h3>
                        <ChartWrapper type="pie" :data="plansData" :options="pieOptions" />
                    </div>
                </div>
            </div>

            <AppFooter />
        </ion-content>
    </ion-page>
</template>
```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
    IonPage,
    IonContent,
    IonMenuButton,
} from '@ionic/vue';
import ChartWrapper from '../../components/ChartWrapper.vue';
import AppFooter from '@/components/AppFooter.vue';

const isProfileOpen = ref(false); // for popup profile

const stats = [
    {
        title: 'Total Member',
        value: '4',
        icon: 'bx bx-group',
        color: '#018181',
    },
    {
        title: 'Member Active',
        value: '4',
        icon: 'bx bx-user-square',
        color: '#22A699',
    },
    {
        title: 'Attendance',
        value: '3',
        icon: 'fa-regular fa-calendar-days',
        color: '#54B4AC',
    },
    {
        title: 'Monthly Revenue',
        value: 'Rp 2.450.000',
        icon: 'fa-solid fa-rupiah-sign',
        color: '#D6A64F',
    },
    {
        title: 'Personal Trainer',
        value: '1',
        icon: 'fa-solid fa-user-tie',
        color: '#398F8F',
    },
    {
        title: 'Non Active',
        value: '0',
        icon: 'bx bx-user-hexagon',
        color: '#D97777',
    },
];

// Chart Options
const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(1, 129, 129, 0.10)',
            },
            ticks: {
                color: '#647878',
            },
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#647878',
            },
        },
    },
    plugins: {
        legend: {
            labels: {
                color: '#334747',
                usePointStyle: true,
                padding: 18,
            },
        },
    },
};

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(1, 129, 129, 0.10)',
            },
            ticks: {
                color: '#647878',
            },
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#647878',
            },
        },
    },
};

const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: '#334747',
                padding: 18,
                usePointStyle: true,
            },
        },
    },
};

// Monthly Revenue
const revenueData = {
    labels: ['Paid', 'Pending'],
    datasets: [
        {
            label: 'Revenue',
            data: [5000, 1000],
            backgroundColor: [
                '#018181',
                '#DCE9E9',
            ],
            hoverBackgroundColor: [
                '#006B6B',
                '#C5D9D9',
            ],
            borderRadius: 8,
            borderSkipped: false,
        },
    ],
};

// Member Growth
const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            data: [10, 18, 30, 42, 60, 0],
            borderColor: '#018181',
            backgroundColor: 'rgba(1, 129, 129, 0.15)',
            pointBackgroundColor: '#018181',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4,
        },
    ],
};

// Attendance Analytics
const attendanceData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
        {
            data: [85, 18, 10],
            backgroundColor: [
                '#018181',
                '#F4B860',
                '#E57373',
            ],
            hoverBackgroundColor: [
                '#006B6B',
                '#E5A447',
                '#D95C5C',
            ],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 8,
        },
    ],
};

// Membership Distribution
const plansData = {
    labels: ['Gold', 'Premium', 'Basic'],
    datasets: [
        {
            data: [45, 30, 20],
            backgroundColor: [
                '#018181',
                '#54B4AC',
                '#DCE9E9',
            ],
            hoverBackgroundColor: [
                '#006B6B',
                '#379B93',
                '#C5D9D9',
            ],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 8,
        },
    ],
};
</script>

<style scoped>
.page-container {
    padding: 24px;
}

.dashboard-content {
    --background: #f8fafc;
}

.page-container {
    padding: 24px;
}

/* Topbar */
.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
}
/* Welcome Banner */
.welcome-banner {
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    margin-bottom: 30px;
}

.welcome-banner h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
}

.welcome-banner p {
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    font-style: italic;
    color: #475569;
}
.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
    margin-top: 30px; 
}

.chart-card {
    background: white;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    height: 320px; 
    display: flex;
    flex-direction: column;
}

.chart-card > div:last-child {
    flex: 1;
    min-height: 0; 
}
@media (max-width: 480px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
    .chart-card { height: 250px; }
}

/* Hamburger (Mobile Only on Left) */
.hamburger-mobile {
    color: #0f172a;
    font-size: 24px;
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

/* Header Nav */
.header-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-nav i {
    font-size: 24px;
    color: var(--ion-color-teal);
}

.header-title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ion-color-teal);
}

.header-title p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
    font-style: italic;
}

/* Stats Grid  */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 24px;
}

@media (min-width: 992px) {
    .stats-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

.stat-card {
    background: white;
    padding: 15px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(1, 129, 129, 0.2);
    border: 1px solid #018181;
}

.icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.stat-info p {
    margin: 0;
    font-size: 0.75rem;
    color: #64748b;
}

.stat-info h3 {
    margin: 4px 0 0 0;
    font-size: 1.1rem;
    color: #1e293b;
}


</style>