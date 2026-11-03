<template>
    <ion-page>
        <ion-content class="dashboard-content">
            <div class="page-container">
                <!-- Top Bar -->
                <div class="topbar">
                    <div class="nav-left">
                        <ion-menu-button menu="main-menu" class="hamburger-mobile">
                            <i class="bx bx-menu"></i>
                        </ion-menu-button>

                        <div class="header-nav">
                            <i class="fa-solid fa-house"></i>
                            <div class="header-title">
                                <h1>Gym Management Dashboard</h1>
                                <p>Manage members, trainers, attendance, payments and business growth.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid -->
                <div class="stats-grid">
                    <div v-for="(stat, i) in stats" :key="i" class="stat-card">
                        <div
                            class="icon-box"
                            :style="{
                                color: stat.color,
                                background: `${stat.color}15`
                            }"
                        >
                            <i :class="stat.icon"></i>
                        </div>

                        <div class="stat-info">
                            <p>{{ stat.title }}</p>
                            <h3>{{ stat.value }}</h3>
                        </div>
                    </div>
                </div>

                <!-- Welcome Banner -->
                <section class="welcome-banner" aria-label="Pesan selamat datang">
                    <div class="welcome-copy">
                        <span class="welcome-eyebrow">
                            <i class="fa-solid fa-sparkles"></i>
                            FITLAB <span class="eyebrow-divider">/</span> ADMIN PANEL
                        </span>
                        <h2>Halo, Selamat Datang dan Selamat Bekerja!</h2>
                        <p>“Bekerjalah dengan jujur dan bertanggung jawab.”</p>
                    </div>

                    <div class="welcome-visual" aria-hidden="true">
                        <div class="welcome-icon-circle">
                            <i class="fa-solid fa-dumbbell"></i>
                        </div>
                    </div>
                </section>

                <!-- Member Overview -->
                <div class="overview-grid">
                    <!-- Member Growth -->
                    <div class="overview-card">
                        <div class="card-heading">
                            <div>
                                <h3>Statistik Member Bergabung</h3>
                                <p>Jumlah member tergabung</p>
                            </div>
                            <span class="heading-icon">
                                <i class="bx bx-trending-up"></i>
                            </span>
                        </div>

                        <div class="overview-chart">
                            <ChartWrapper
                                type="bar"
                                :data="memberGrowthData"
                                :options="overviewBarOptions"
                            />
                        </div>
                    </div>

                    <!-- Active Members -->
                    <div class="overview-card">
                        <div class="card-heading">
                            <div>
                                <h3>Member Aktif Gym</h3>
                                <p>Status keanggotaan member</p>
                            </div>
                            <span class="heading-icon active-heading-icon">
                                <i class="bx bx-user-check"></i>
                            </span>
                        </div>

                        <div class="overview-chart">
                            <ChartWrapper
                                type="bar"
                                :data="activeMemberData"
                                :options="activeBarOptions"
                            />
                        </div>
                    </div>

                    <!-- Expiring Members -->
                    <div class="overview-card expiring-card">
                        <div class="card-heading">
                            <div>
                                <h3>Member Segera Berakhir</h3>
                                <p>Member dengan masa aktif terdekat</p>
                            </div>
                            <span class="heading-icon warning-icon">
                                <i class="fa-solid fa-hourglass-half"></i>
                            </span>
                        </div>

                        <div v-if="expiringMembers.length" class="expiring-list">
                            <div
                                v-for="member in expiringMembers"
                                :key="member.id"
                                class="expiring-item"
                            >
                                <div class="member-expiring-info">
                                    <strong>{{ member.name }}</strong>
                                    <span>{{ member.id }}</span>
                                </div>

                                <div class="member-expiring-date">
                                    <strong>{{ formatDate(member.expiredDate) }}</strong>
                                    <span :class="{ 'expired-warning': getDaysLeft(member.expiredDate) <= 7 }">
                                        {{
                                            getDaysLeft(member.expiredDate) === 0
                                                ? 'Hari terakhir'
                                                : `${getDaysLeft(member.expiredDate)} hari lagi`
                                        }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-else class="empty-expiring">
                            <i class="bx bx-check-circle"></i>
                            <p>Tidak ada member yang segera berakhir.</p>
                        </div>

                        <div class="expiring-footer">
                            <span>
                                <i class="bx bx-info-circle"></i>
                                Menampilkan maksimal 6 member
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Member Activity -->
                <div class="activity-card">
                    <div class="activity-header">
                        <div>
                            <h3>Aktivitas Member</h3>
                            <p>Kehadiran member</p>
                        </div>

                        <div class="activity-date">
                            <i class="bx bx-calendar"></i>
                            {{ currentDate }}
                        </div>
                    </div>

                    <div class="activity-chart">
                        <ChartWrapper
                            type="line"
                            :data="activityData"
                            :options="activityOptions"
                        />
                    </div>

                    <div class="activity-legend">
                        <span class="legend-dot"></span>
                        <span>Gym</span>
                    </div>
                </div>

                <!-- Existing Analytics Charts -->
                <div class="charts-grid">
                    <!-- Monthly Revenue -->
                    <div class="chart-card">
                        <div class="chart-title">
                            <h3>Monthly Revenue</h3>
                            <p>Monthly gym income overview</p>
                        </div>

                        <ChartWrapper
                            type="bar"
                            :data="revenueData"
                            :options="barOptions"
                        />
                    </div>

                    <!-- Attendance Analytics -->
                    <div class="chart-card">
                        <div class="chart-title">
                            <h3>Attendance Analytics</h3>
                            <p>Member attendance statistics</p>
                        </div>

                        <ChartWrapper
                            type="doughnut"
                            :data="attendanceData"
                            :options="pieOptions"
                        />
                    </div>

                    <!-- Member Growth -->
                    <div class="chart-card">
                        <div class="chart-title">
                            <h3>Member Growth</h3>
                            <p>Monthly membership growth</p>
                        </div>

                        <ChartWrapper
                            type="line"
                            :data="growthData"
                            :options="lineOptions"
                        />
                    </div>

                    <!-- Membership Distribution -->
                    <div class="chart-card">
                        <div class="chart-title">
                            <h3>Membership Distribution</h3>
                            <p>Member distribution by membership plan</p>
                        </div>

                        <ChartWrapper
                            type="pie"
                            :data="plansData"
                            :options="pieOptions"
                        />
                    </div>
                </div>
            </div>

            <AppFooter />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonPage, IonContent, IonMenuButton } from '@ionic/vue';

import ChartWrapper from '../../components/ChartWrapper.vue';
import AppFooter from '@/components/AppFooter.vue';

interface Member {
    id: string;
    name: string;
    expiredDate: string;
    status: 'Active' | 'Inactive';
}

// Data contoh. Nantinya dapat diganti dengan data dari API/database.
const members = ref<Member[]>([
    {
        id: 'MEM-001',
        name: 'HAFIZH MUHAMMAD NAUFAL SIDQI',
        expiredDate: '2026-12-30',
        status: 'Active'
    },
    {
        id: 'MEM-002',
        name: 'REIFAL ARIZALDI',
        expiredDate: '2026-11-20',
        status: 'Active'
    },
    {
        id: 'MEM-003',
        name: 'FIKRI TAQY PRAWITOHADI',
        expiredDate: '2026-11-20',
        status: 'Active'
    },
    {
        id: 'MEM-004',
        name: 'JEREMY FELIX HERMANTO',
        expiredDate: '2026-11-20',
        status: 'Active'
    }
]);

// Menghitung sisa hari berdasarkan tanggal expired.
const getDaysLeft = (date: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(`${date}T00:00:00`);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Format tanggal expired ke format Indonesia.
const formatDate = (date: string): string => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// Member aktif yang masa aktifnya akan berakhir dalam 30 hari.
const expiringMembers = computed(() => {
    return members.value
        .filter((member) => {
            const daysLeft = getDaysLeft(member.expiredDate);
            return member.status === 'Active' && daysLeft >= 0 && daysLeft <= 30;
        })
        .sort((a, b) => {
            return new Date(a.expiredDate).getTime() - new Date(b.expiredDate).getTime();
        })
        .slice(0, 6);
});

// Tanggal yang ditampilkan pada bagian aktivitas member.
const currentDate = computed(() => {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
});

const stats = computed(() => {
    const totalMembers = members.value.length;
    const activeMembers = members.value.filter((member) => member.status === 'Active').length;
    const inactiveMembers = totalMembers - activeMembers;

    return [
        {
            title: 'Total Member',
            value: String(totalMembers),
            icon: 'bx bx-group',
            color: '#018181'
        },
        {
            title: 'Member Active',
            value: String(activeMembers),
            icon: 'bx bx-user-square',
            color: '#22A699'
        },
        {
            title: 'Attendance',
            value: '3',
            icon: 'fa-regular fa-calendar-days',
            color: '#54B4AC'
        },
        {
            title: 'Monthly Revenue',
            value: 'Rp 2.450.000',
            icon: 'fa-solid fa-rupiah-sign',
            color: '#D6A64F'
        },
        {
            title: 'Personal Trainer',
            value: '1',
            icon: 'fa-solid fa-user-tie',
            color: '#398F8F'
        },
        {
            title: 'Non Active',
            value: String(inactiveMembers),
            icon: 'bx bx-user-hexagon',
            color: '#D97777'
        }
    ];
});

const memberGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
        {
            label: 'Member',
            data: [7, 7, 45, 7, 7, 7, 7, 7, 7, 7, 7, 7],
            backgroundColor: [
                '#DCECEC', '#DCECEC', '#008B87', '#DCECEC',
                '#DCECEC', '#DCECEC', '#DCECEC', '#DCECEC',
                '#DCECEC', '#DCECEC', '#DCECEC', '#DCECEC'
            ],
            borderRadius: 5,
            borderSkipped: false,
            barPercentage: 0.8,
            categoryPercentage: 0.8
        }
    ]
};

// Jumlah member aktif/nonaktif dihitung langsung dari data members.
const activeMemberData = computed(() => {
    const activeCount = members.value.filter((member) => member.status === 'Active').length;
    const inactiveCount = members.value.length - activeCount;

    return {
        labels: ['Member'],
        datasets: [
            {
                label: 'Aktif',
                data: [activeCount],
                backgroundColor: '#018181',
                hoverBackgroundColor: '#006B6B',
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 30
            },
            {
                label: 'Tidak Aktif',
                data: [inactiveCount],
                backgroundColor: '#E6A39A',
                hoverBackgroundColor: '#D9877C',
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 30
            }
        ]
    };
});

const activityData = {
    labels: [
        '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
        '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
        '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
        '09:00', '09:30', '10:00', '10:30', '11:00'
    ],
    datasets: [
        {
            label: 'Gym',
            data: [17, 16, 20, 19, 17, 18, 22, 21, 19, 25, 24, 29, 31, 28, 36, 34, 32, 37, 34, 39, 37, 41, 45],
            borderColor: '#008B87',
            backgroundColor: 'rgba(1, 129, 129, 0.08)',
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#008B87',
            borderWidth: 1.5,
            fill: true,
            tension: 0.4
        }
    ]
};

// ==========================================
// CHART OPTIONS
// ==========================================
const overviewBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(1, 129, 129, 0.08)' },
            ticks: { color: '#999999', font: { size: 10 } }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#475569', font: { size: 9 } }
        }
    }
};

const activeBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                pointStyle: 'rectRounded',
                color: '#334155',
                padding: 12,
                boxWidth: 10,
                font: { size: 10 }
            }
        },
        tooltip: { enabled: true }
    },
    scales: {
        y: {
            beginAtZero: true,
            suggestedMax: 5,
            grid: { color: 'rgba(1, 129, 129, 0.08)' },
            ticks: {
                color: '#999999',
                precision: 0,
                font: { size: 10 }
            }
        },
        x: {
            grid: { display: false },
            ticks: { display: false }
        }
    }
};

const activityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index' as const
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#0f172a',
            bodyColor: '#475569',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            displayColors: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(1, 129, 129, 0.08)' },
            border: { display: false },
            ticks: { color: '#999999', font: { size: 10 } }
        },
        x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
                color: '#334155',
                maxRotation: 0,
                autoSkip: false,
                font: { size: 9 },
                callback: function (value: string | number, index: number) {
                    return index % 2 === 0 ? activityData.labels[index] : '';
                }
            }
        }
    }
};

// ==========================================
// EXISTING ANALYTICS CHARTS
// ==========================================
const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(1, 129, 129, 0.10)' },
            ticks: { color: '#647878' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#647878' }
        }
    },
    plugins: {
        legend: {
            labels: {
                color: '#334747',
                usePointStyle: true,
                padding: 18
            }
        }
    }
};

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(1, 129, 129, 0.10)' },
            ticks: { color: '#647878' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#647878' }
        }
    }
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
                usePointStyle: true
            }
        }
    }
};

// Monthly Revenue (data contoh)
const revenueData = {
    labels: ['Paid', 'Pending'],
    datasets: [
        {
            label: 'Revenue',
            data: [5000, 1000],
            backgroundColor: ['#018181', '#DCE9E9'],
            hoverBackgroundColor: ['#006B6B', '#C5D9D9'],
            borderRadius: 8,
            borderSkipped: false
        }
    ]
};

// Member Growth (data contoh)
const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Member Growth',
            data: [10, 18, 30, 42, 60, 0],
            borderColor: '#018181',
            backgroundColor: 'rgba(1, 129, 129, 0.15)',
            pointBackgroundColor: '#018181',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7,
            fill: true,
            tension: 0.4
        }
    ]
};

// Attendance Analytics (data contoh)
const attendanceData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [
        {
            data: [85, 18, 10],
            backgroundColor: ['#018181', '#F4B860', '#E57373'],
            hoverBackgroundColor: ['#006B6B', '#E5A447', '#D95C5C'],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 8
        }
    ]
};

// Membership Distribution (data contoh)
const plansData = {
    labels: ['Gold', 'Premium', 'Basic'],
    datasets: [
        {
            data: [45, 30, 20],
            backgroundColor: ['#018181', '#54B4AC', '#DCE9E9'],
            hoverBackgroundColor: ['#006B6B', '#379B93', '#C5D9D9'],
            borderColor: '#FFFFFF',
            borderWidth: 3,
            hoverOffset: 8
        }
    ]
};
</script>

<style scoped>
/* ==========================================
   GENERAL
========================================== */
.dashboard-content {
    --background: #f8fafc;
}

.page-container {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 24px;
    box-sizing: border-box;
}

/* ==========================================
   TOPBAR
========================================== */
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

.hamburger-mobile {
    color: #0f172a;
    font-size: 24px;
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.header-nav > i {
    color: var(--ion-color-teal, #018181);
    font-size: 24px;
    flex-shrink: 0;
}

.header-title h1 {
    margin: 0;
    color: var(--ion-color-teal, #018181);
    font-size: 1.5rem;
    font-weight: 700;
}

.header-title p {
    margin: 0;
    color: #64748b;
    font-size: 0.85rem;
    font-style: italic;
}

/* ==========================================
   STATS GRID
========================================== */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
    margin-bottom: 24px;
}

@media (min-width: 992px) {
    .stats-grid {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}

.stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border: 1px solid transparent;
    border-radius: 16px;
    background: #ffffff;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    border-color: rgba(1, 129, 129, 0.3);
    box-shadow: 0 8px 18px rgba(1, 129, 129, 0.12);
}

.icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
    border-radius: 10px;
    font-size: 1.2rem;
}

.stat-info p {
    margin: 0;
    color: #64748b;
    font-size: 0.75rem;
}

.stat-info h3 {
    margin: 4px 0 0;
    color: #1e293b;
    font-size: 1.1rem;
}

/* ==========================================
   WELCOME BANNER - REDESIGNED
========================================== */
.welcome-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    min-height: 150px;
    margin-bottom: 24px;
    padding: 25px 34px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 18px;
    background: linear-gradient(115deg, #006b68 0%, #018181 52%, #22a699 100%);
    box-shadow: 0 10px 24px rgba(1, 129, 129, 0.16);
    isolation: isolate;
}

.welcome-banner::before,
.welcome-banner::after {
    position: absolute;
    z-index: -1;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 50%;
    content: '';
    pointer-events: none;
}

.welcome-banner::before {
    top: -115px;
    right: 90px;
    width: 290px;
    height: 290px;
}

.welcome-banner::after {
    right: -65px;
    bottom: -175px;
    width: 330px;
    height: 330px;
}

.welcome-copy {
    position: relative;
    z-index: 1;
    max-width: 760px;
}

.welcome-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.69rem;
    font-weight: 700;
    letter-spacing: 1.7px;
}

.welcome-eyebrow > i {
    color: #f7d58a;
    font-size: 0.85rem;
}

.eyebrow-divider {
    color: rgba(255, 255, 255, 0.45);
}

.welcome-banner h2 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(1.15rem, 2vw, 1.65rem);
    font-weight: 750;
    line-height: 1.3;
    letter-spacing: 0.1px;
}

.welcome-banner p {
    margin: 9px 0 0;
    color: rgba(255, 255, 255, 0.82);
    font-size: 0.9rem;
    font-style: italic;
    line-height: 1.5;
}

.welcome-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 116px;
    height: 116px;
    margin-right: 18px;
    flex: 0 0 116px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.09);
    box-shadow: 0 0 0 13px rgba(255, 255, 255, 0.045), 0 0 0 27px rgba(255, 255, 255, 0.025);
}

.welcome-icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: rotate(-8deg);
}

.welcome-icon-circle i {
    font-size: 2.5rem;
    transform: rotate(8deg);
}

/* ==========================================
   OVERVIEW GRID
========================================== */
.overview-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.overview-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 295px;
    padding: 18px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.045);
}

.card-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
}

.card-heading h3 {
    margin: 0;
    color: #172323;
    font-size: 0.95rem;
    font-weight: 600;
}

.card-heading p {
    margin: 4px 0 0;
    color: #7b8585;
    font-size: 0.75rem;
}

.heading-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 9px;
    background: #e7f4f2;
    color: #018181;
    font-size: 17px;
}

.active-heading-icon {
    background: #e3f3ef;
    color: #01865f;
}

.warning-icon {
    background: #fff1e9;
    color: #e76c36;
}

.warning-icon i {
    font-size: 15px;
}

.overview-chart {
    position: relative;
    flex: 1;
    min-height: 0;
}

/* ==========================================
   EXPIRING MEMBER LIST
========================================== */
.expiring-card {
    padding-bottom: 12px;
}

.expiring-list {
    flex: 1;
    min-height: 0;
    padding-right: 4px;
    overflow-y: auto;
}

.expiring-list::-webkit-scrollbar {
    width: 4px;
}

.expiring-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #dce9e9;
}

.expiring-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 9px 0;
    border-bottom: 1px solid #f1f4f4;
}

.expiring-item:last-child {
    border-bottom: none;
}

.member-expiring-info,
.member-expiring-date {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.member-expiring-info {
    flex: 1;
}

.member-expiring-info strong {
    overflow: hidden;
    color: #172323;
    font-size: 0.72rem;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.member-expiring-info span {
    margin-top: 4px;
    color: #929b9b;
    font-size: 0.62rem;
}

.member-expiring-date {
    align-items: flex-end;
    flex-shrink: 0;
}

.member-expiring-date strong {
    color: #d97736;
    font-size: 0.68rem;
    font-weight: 600;
}

.member-expiring-date span {
    margin-top: 4px;
    color: #737c7c;
    font-size: 0.61rem;
}

.member-expiring-date span.expired-warning {
    color: #d94841;
    font-weight: 700;
}

.empty-expiring {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8b9999;
    text-align: center;
}

.empty-expiring i {
    color: #22a699;
    font-size: 30px;
}

.empty-expiring p {
    font-size: 0.75rem;
}

.expiring-footer {
    margin-top: 5px;
    padding-top: 8px;
    border-top: 1px solid #f1f4f4;
}

.expiring-footer span {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #929b9b;
    font-size: 0.62rem;
}

/* ==========================================
   MEMBER ACTIVITY
========================================== */
.activity-card {
    display: flex;
    flex-direction: column;
    height: 290px;
    margin-bottom: 28px;
    padding: 18px 20px 14px;
    border: 1px solid #e5ebeb;
    border-radius: 12px;
    background: #ffffff;
}

.activity-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
}

.activity-header h3 {
    margin: 0;
    color: #172323;
    font-size: 0.98rem;
    font-weight: 600;
}

.activity-header p {
    margin: 4px 0 0;
    color: #7b8585;
    font-size: 0.75rem;
}

.activity-date {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #018181;
    font-size: 0.78rem;
    font-weight: 600;
}

.activity-date i {
    font-size: 16px;
}

.activity-chart {
    position: relative;
    flex: 1;
    min-height: 0;
}

.activity-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding-top: 8px;
    color: #334747;
    font-size: 0.7rem;
}

.legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    background: #018181;
}

/* ==========================================
   EXISTING ANALYTICS CHARTS
========================================== */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-top: 28px;
}

.chart-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: 320px;
    padding: 20px;
    border-radius: 16px;
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-title {
    margin-bottom: 12px;
}

.chart-title h3 {
    margin: 0;
    color: #172323;
    font-size: 1rem;
    font-weight: 600;
}

.chart-title p {
    margin: 4px 0 0;
    color: #7b8585;
    font-size: 0.75rem;
}

.chart-card > :last-child {
    position: relative;
    flex: 1;
    min-height: 0;
}

/* ==========================================
   RESPONSIVE TABLET
========================================== */
@media (max-width: 1100px) {
    .overview-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .expiring-card {
        grid-column: span 2;
        height: 290px;
    }
}

/* ==========================================
   RESPONSIVE MOBILE
========================================== */
@media (max-width: 767px) {
    .page-container {
        padding: 15px;
    }

    .header-title h1 {
        font-size: 1.15rem;
    }

    .header-title p {
        font-size: 0.72rem;
        line-height: 1.4;
    }

    .header-nav {
        gap: 9px;
    }

    .header-nav > i {
        font-size: 20px;
    }

    .stats-grid {
        gap: 10px;
    }

    .stat-card {
        padding: 12px 8px;
        border-radius: 12px;
    }

    .stat-info p {
        font-size: 0.68rem;
    }

    .stat-info h3 {
        font-size: 0.95rem;
    }

    .welcome-banner {
        min-height: 135px;
        gap: 12px;
        padding: 21px 18px;
        border-radius: 15px;
    }

    .welcome-eyebrow {
        margin-bottom: 9px;
        font-size: 0.6rem;
        letter-spacing: 1.2px;
    }

    .welcome-banner h2 {
        font-size: 1.02rem;
    }

    .welcome-banner p {
        margin-top: 7px;
        font-size: 0.75rem;
    }

    .welcome-visual {
        width: 74px;
        height: 74px;
        margin-right: 5px;
        flex-basis: 74px;
        box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.045), 0 0 0 16px rgba(255, 255, 255, 0.025);
    }

    .welcome-icon-circle {
        width: 51px;
        height: 51px;
        border-radius: 15px;
    }

    .welcome-icon-circle i {
        font-size: 1.7rem;
    }

    .overview-grid {
        grid-template-columns: 1fr;
        gap: 14px;
    }

    .overview-card {
        height: 290px;
        padding: 16px;
    }

    .expiring-card {
        grid-column: auto;
        height: 290px;
    }

    .card-heading h3 {
        font-size: 0.9rem;
    }

    .activity-card {
        height: 280px;
        margin-bottom: 22px;
        padding: 16px 12px 12px;
    }

    .activity-header {
        flex-direction: column;
        gap: 8px;
    }

    .activity-header h3 {
        font-size: 0.92rem;
    }

    .activity-date {
        font-size: 0.7rem;
    }

    .charts-grid {
        grid-template-columns: 1fr;
        gap: 15px;
        margin-top: 22px;
    }

    .chart-card {
        height: 270px;
        padding: 16px;
    }

    .chart-title h3 {
        font-size: 0.92rem;
    }
}

/* ==========================================
   SMALL MOBILE
========================================== */
@media (max-width: 380px) {
    .page-container {
        padding: 12px;
    }

    .header-title h1 {
        font-size: 1rem;
    }

    .header-title p {
        font-size: 0.67rem;
    }

    .stat-card {
        padding: 10px 5px;
    }

    .stat-info h3 {
        font-size: 0.85rem;
    }

    .welcome-banner {
        padding: 18px 13px;
    }

    .welcome-banner h2 {
        font-size: 0.92rem;
    }

    .welcome-banner p {
        font-size: 0.69rem;
    }

    .welcome-visual {
        width: 60px;
        height: 60px;
        flex-basis: 60px;
    }

    .welcome-icon-circle {
        width: 43px;
        height: 43px;
    }

    .welcome-icon-circle i {
        font-size: 1.4rem;
    }

    .member-expiring-info strong {
        font-size: 0.65rem;
    }

    .member-expiring-date strong {
        font-size: 0.63rem;
    }

    .activity-card {
        height: 260px;
    }
}
</style>
