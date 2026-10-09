<template>
    <div class="sidebar-wrapper">
        <!-- Header: Logo & Tagline -->
        <div class="sidebar-header">
            <img src="/assets/Logo.png" alt="FitLab Logo" class="logo" />
            <p class="tagline">Grow Stronger, Feel Better, and Become the Best Version of Yourself.</p>
        </div>

        <!-- Menu Navigation-->
        <div class="menu-list">
            <router-link v-for="item in menuItems" :key="item.title" :to="item.url" class="menu-item"
                active-class="active" @click="closeMenuOnMobile">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
            </router-link>
        </div>

        <!-- Profil User -->
        <div class="sidebar-profile" @click="emit('openProfile')">
            <img src="/assets/regi.jpg" class="avatar" />
            <div class="profile-info">
                <span class="user-name">Admin Fitlab</span>
                <span class="user-email">admin@admin.com</span>
            </div>
            <i class="fa-solid fa-ellipsis-vertical"></i>
        </div>

        <!-- Footer: Logout -->
        <div class="sidebar-footer">
            <div class="menu-item logout-btn" @click="handleLogout">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { menuController } from '@ionic/vue';

const router = useRouter();

const menuItems = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: 'fa-solid fa-house' },
    { title: 'Members', url: '/admin/members', icon: 'bx bx-group' },
    { title: 'Membersplan', url: '/admin/membership-plans', icon: 'fa-solid fa-users-line' },
    { title: 'Trainer', url: '/admin/trainers', icon: 'fa-solid fa-user-tie' },
    { title: 'Attendance', url: '/admin/attendance', icon: 'fa-regular fa-calendar-days' },
    { title: 'Payment', url: '/admin/payments', icon: 'bx bx-wallet-alt' },
    { title: 'Equipment', url: '/admin/equipment', icon: 'fa-solid fa-toolbox' },
    { title: 'Analytics', url: '/admin/analytics', icon: 'bx bx-doughnut-chart' },
    { title: 'Report', url: '/admin/reports', icon: 'bx bx-file-report' },
    { title: 'Settings', url: '/admin/settings', icon: 'bx bx-cog' },
];
const emit = defineEmits(['openProfile']);
const openProfileModal = () => emit('openProfile');
// Fungsi close sidebar 
const closeMenuOnMobile = async () => {
    if (window.innerWidth < 992) {
        await menuController.close('main-menu');
    }
};

const handleLogout = async () => {
    await menuController.close('main-menu');
    router.push('/login');
};
</script>

<style scoped>
/* Wrapper */
.sidebar-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    padding: 24px 16px;
    box-sizing: border-box;
    border-right: 1px solid #f1f5f9;
}

/* Header  */
.sidebar-header {
    text-align: center;
    padding: 0 8px 20px 8px;
    border-bottom: 1px solid #f1f5f9;
    margin-bottom: 16px;
}

.logo {
    width: 350px;
    margin-bottom: 8px;
}

.tagline {
    font-size: 0.72rem;
    color: #64748b;
    line-height: 1.4;
    margin: 0;
    font-weight: 400;
}

/* List Menu */
.menu-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
}

.menu-list::-webkit-scrollbar {
    width: 4px;
}

.menu-list::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 4px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 11px 14px;
    border-radius: 8px;
    color: #64748b;
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    background: transparent;
}

.menu-item i {
    font-size: 1.15rem;
    width: 24px;
    margin-right: 12px;
    text-align: center;
    transition: all 0.2s ease;
}

.menu-item:hover,
.menu-item.active {
    background: #f0fdfa;
    color: #018181;
    font-weight: 600;
}

.menu-item:hover i,
.menu-item.active i {
    color: #018181;
}

/* Profil Section */
.sidebar-profile {
    display: flex;
    align-items: center;
    padding: 15px;
    border-top: 1px solid #f1f5f9;
    cursor: pointer;
    transition: 0.3s;
}

.sidebar-profile:hover {
    background: #f8fafc;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
}

.profile-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.user-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1e293b;
}

.user-email {
    font-size: 0.75rem;
    color: #64748b;
}

.sidebar-profile {
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    margin: 0px;
}

.sidebar-profile:hover {
    background-color: #e7e7e8;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}
.sidebar-footer {
    padding-top: 12px;
    border-top: 1px solid #f1f5f9;
    margin-top: auto;
}
.logout-btn {
    color: #ef4444;
}
.logout-btn:hover {
    background: #fef2f2;
    color: #dc2626;
}
.logout-btn:hover i {
    color: #dc2626;
}
</style>