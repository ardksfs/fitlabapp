
<template>
    <div class="sidebar-wrapper">
        <!-- Header: Logo & Tagline -->
        <div class="sidebar-header">
            <img src="/assets/Logo.png" alt="FitLab Logo" class="logo" />
            <p class="tagline">
                Grow Stronger, Feel Better, and Become the Best Version of Yourself.
            </p>
        </div>

        <!-- Menu Navigation -->
        <div class="menu-list">
            <router-link
                v-for="item in menuItems"
                :key="item.title"
                :to="item.url"
                class="menu-item"
                active-class="active"
                @click="closeMenuOnMobile"
            >
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
            </router-link>
        </div>

        <!-- Approval Button -->
        <div class="approval-section">
            <button
                type="button"
                class="menu-item approval-btn"
                :aria-label="`Perlu Disetujui, ${pendingApprovals.length} pengajuan`"
                @click="openApprovalPopup"
            >
                <i class="fa-solid fa-user-check"></i>
                <span>Perlu Disetujui</span>

                <span
                    v-if="pendingApprovals.length > 0"
                    class="approval-badge"
                >
                    {{ pendingApprovals.length }}
                </span>
            </button>
        </div>

        <!-- Profil User -->
        <div class="sidebar-profile" @click="emit('openProfile')">
            <img
                :src="profile.avatar || '/assets/user.jpg'"
                class="avatar"
                alt="Profile"
            />

            <div class="profile-info">
                <span class="user-name">{{ profile.name }}</span>
                <span class="user-email">{{ profile.email }}</span>
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

        <!-- Popup Approval Member -->
        <Teleport to="body">
            <div
                v-if="isApprovalPopupOpen"
                class="approval-overlay"
                @click.self="closeApprovalPopup"
            >
                <section
                    class="approval-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="approval-title"
                >
                    <!-- Popup Header -->
                    <div class="approval-modal-header">
                        <div class="approval-heading-icon">
                            <i class="fa-solid fa-user-check"></i>
                        </div>

                        <div class="approval-heading-text">
                            <h2 id="approval-title">
                                Persetujuan Member
                            </h2>

                            <p>
                                Ada {{ pendingApprovals.length }}
                                pengajuan yang menunggu persetujuan admin.
                                Periksa alasan pada setiap pengajuan.
                            </p>
                        </div>

                        <button
                            type="button"
                            class="popup-close-btn"
                            aria-label="Tutup popup"
                            @click="closeApprovalPopup"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Approval List -->
                    <div class="approval-list">

                        <div
                            v-for="member in pendingApprovals"
                            :key="member.id"
                            class="approval-member"
                        >
                            <!-- Member Avatar -->
                            <div class="member-avatar">
                                {{ getInitials(member.name) }}
                            </div>

                            <!-- Member Information -->
                            <div class="member-details">
                                <span class="member-name">
                                    {{ member.name }}
                                </span>

                                <span class="member-status">
                                    <span class="status-dot"></span>
                                    Menunggu persetujuan
                                </span>
                            </div>

                            <!-- Detail Alasan -->
                            <div class="member-reason">
                                <div class="reason-icon">
                                    <i class="fa-solid fa-circle-exclamation"></i>
                                </div>

                                <div class="reason-content">
                                    <div class="reason-heading">
                                        <span class="reason-label">
                                            Alasan perlu ditinjau
                                        </span>

                                        <span class="reason-category">
                                            {{ member.reasonTitle }}
                                        </span>
                                    </div>

                                    <p>
                                        {{ member.reason }}
                                    </p>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="approval-actions">
                                <button
                                    type="button"
                                    class="action-btn reject-btn"
                                    @click="rejectMember(member.id)"
                                >
                                    <i class="fa-solid fa-xmark"></i>
                                    Tolak
                                </button>

                                <button
                                    type="button"
                                    class="action-btn approve-btn"
                                    @click="approveMember(member.id)"
                                >
                                    <i class="fa-solid fa-check"></i>
                                    Setujui
                                </button>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div
                            v-if="pendingApprovals.length === 0"
                            class="approval-empty"
                        >
                            <div class="empty-icon">
                                <i class="fa-solid fa-clipboard-check"></i>
                            </div>

                            <h3>
                                Semua pengajuan sudah diproses
                            </h3>

                            <p>
                                Belum ada pengajuan member yang perlu disetujui.
                            </p>
                        </div>
                    </div>

                    <!-- Popup Footer -->
                    <div class="approval-modal-footer">
                        <span>
                            <i class="fa-solid fa-circle-info"></i>
                            Periksa data member sebelum memberikan persetujuan.
                        </span>

                        <button
                            type="button"
                            class="done-btn"
                            @click="closeApprovalPopup"
                        >
                            Selesai
                        </button>
                    </div>
                </section>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { menuController } from '@ionic/vue';
import { clearSession } from '../utils/session';

// ==========================================
// ADMIN PROFILE
// ==========================================

interface AdminProfile {
    name: string;
    email: string;
    timezone: string;
    workingHours: string;
    title: string;
    avatar: string;
    lastUpdated: string;
}

interface PendingMember {
    id: number;
    name: string;
    reasonTitle: string;
    reason: string;
}

defineProps<{
    profile: AdminProfile;
}>();

const emit = defineEmits<{
    (event: 'openProfile'): void;
}>();

const router = useRouter();

// ==========================================
// SIDEBAR MENU
// ==========================================

const menuItems = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: 'fa-solid fa-house'
    },
    {
        title: 'Members',
        url: '/admin/members',
        icon: 'bx bx-group'
    },
    {
        title: 'Membersplan',
        url: '/admin/membership-plans',
        icon: 'fa-solid fa-users-line'
    },
    {
        title: 'Trainer',
        url: '/admin/trainers',
        icon: 'fa-solid fa-user-tie'
    },
    {
        title: 'Attendance',
        url: '/admin/attendance',
        icon: 'fa-regular fa-calendar-days'
    },
    {
        title: 'Payment',
        url: '/admin/payments',
        icon: 'bx bx-wallet-alt'
    },
    // {
    //     title: 'Equipment',
    //     url: '/admin/equipment',
    //     icon: 'fa-solid fa-toolbox'
    // },
    {
        title: 'Analytics',
        url: '/admin/analytics',
        icon: 'bx bx-doughnut-chart'
    },
    {
        title: 'Report',
        url: '/admin/reports',
        icon: 'bx bx-file-report'
    },
    {
        title: 'Settings',
        url: '/admin/settings',
        icon: 'bx bx-cog'
    },
];

// ==========================================
// PENDING MEMBER APPROVAL
// ==========================================

// DATA DUMMY PENGAJUAN MEMBER
// Alasan di bawah hanya contoh untuk tampilan.
// Ganti dengan hasil pemeriksaan dan data pendaftaran asli.
// Nantinya bisa dihubungkan ke Supabase/API.

const pendingApprovals = ref<PendingMember[]>([
    {
        id: 1,
        name: 'HAFIZH MUHAMMAD NAUFAL SIDQI',
        reasonTitle: 'Verifikasi Identitas',
        reason: 'Data identitas member masih perlu diperiksa dan dikonfirmasi oleh admin.'
    },
    {
        id: 2,
        name: 'JEREMY FELIX HERMANTO',
        reasonTitle: 'Konfirmasi Pembayaran',
        reason: 'Bukti pembayaran atau status transaksi membership masih perlu diverifikasi.'
    },
    {
        id: 3,
        name: 'FIKRI TAQY PRAWITOHADI',
        reasonTitle: 'Validasi Kontak',
        reason: 'Nomor telepon atau email perlu dikonfirmasi agar informasi membership dapat dikirim.'
    },
    {
        id: 4,
        name: 'REIFAL ARIZALDI',
        reasonTitle: 'Kelengkapan Formulir',
        reason: 'Periksa kembali formulir pendaftaran dan lengkapi informasi yang masih kosong.'
    },
]);

// ==========================================
// APPROVAL POPUP
// ==========================================

const isApprovalPopupOpen = ref(false);

const openApprovalPopup = () => {
    isApprovalPopupOpen.value = true;
};

const closeApprovalPopup = () => {
    isApprovalPopupOpen.value = false;
};

// Membuat inisial nama member
const getInitials = (name: string) => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('');
};

// ==========================================
// APPROVE MEMBER
// ==========================================

const approveMember = (memberId: number) => {

    const member = pendingApprovals.value.find(
        (item) => item.id === memberId
    );

    if (!member) return;

    // Demo: menghapus pengajuan dari daftar lokal
    pendingApprovals.value = pendingApprovals.value.filter(
        (item) => item.id !== memberId
    );

    console.log(
        `Member ${member.name} berhasil disetujui`
    );
};

// ==========================================
// REJECT MEMBER
// ==========================================

const rejectMember = (memberId: number) => {

    const member = pendingApprovals.value.find(
        (item) => item.id === memberId
    );

    if (!member) return;

    // Demo: menghapus pengajuan dari daftar lokal
    pendingApprovals.value = pendingApprovals.value.filter(
        (item) => item.id !== memberId
    );

    console.log(
        `Pengajuan member ${member.name} ditolak`
    );
};

// ==========================================
// CLOSE SIDEBAR ON MOBILE
// ==========================================

const closeMenuOnMobile = async () => {
    if (window.innerWidth < 992) {
        await menuController.close('main-menu');
    }
};

// ==========================================
// LOGOUT
// ==========================================

const handleLogout = async () => {

    await menuController.close('main-menu');

    clearSession();

    await router.replace({
        path: '/login',
        query: {
            role: 'admin'
        }
    });
};

</script>

<style scoped>

/* ==========================================
   SIDEBAR WRAPPER
========================================== */

.sidebar-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    padding: 24px 16px;
    box-sizing: border-box;
    border-right: 1px solid #f1f5f9;
}

/* ==========================================
   HEADER
========================================== */

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

/* ==========================================
   MENU LIST
========================================== */

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

/* ==========================================
   APPROVAL BUTTON
========================================== */

.approval-section {
    padding: 10px 0 12px;
    border-top: 1px solid #f1f5f9;
}

.approval-btn {
    width: 100%;
    border: 0;
    font-family: inherit;
    text-align: left;
}

.approval-btn > span:first-of-type {
    flex: 1;
}

.approval-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    margin-left: auto;
    border-radius: 999px;
    background: #d9480f;
    color: #ffffff;
    font-size: 0.72rem;
    line-height: 1;
    font-weight: 700;
}

/* ==========================================
   PROFILE SECTION
========================================== */

.sidebar-profile {
    display: flex;
    align-items: center;
    padding: 15px;
    border-top: 1px solid #f1f5f9;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 8px;
    margin: 0;
}

.sidebar-profile:hover {
    background-color: #e7e7e8;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
    flex-shrink: 0;
}

.profile-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
}

.user-name {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1e293b;
    overflow-wrap: anywhere;
}

.user-email {
    font-size: 0.75rem;
    color: #64748b;
    overflow-wrap: anywhere;
}

/* ==========================================
   FOOTER & LOGOUT
========================================== */

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

/* ==========================================
   APPROVAL POPUP OVERLAY
========================================== */

.approval-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(15, 23, 42, 0.48);
    backdrop-filter: blur(3px);
}

.approval-modal {
    display: flex;
    flex-direction: column;
    width: min(600px, 100%);
    max-height: 85vh;
    overflow: hidden;
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
    animation: approvalModalIn 0.2s ease-out;
}

@keyframes approvalModalIn {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ==========================================
   POPUP HEADER
========================================== */

.approval-modal-header {
    display: flex;
    align-items: flex-start;
    gap: 13px;
    padding: 22px 24px 18px;
    border-bottom: 1px solid #eef2f7;
}

.approval-heading-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 43px;
    height: 43px;
    flex-shrink: 0;
    border-radius: 12px;
    background: #e6f6f4;
    color: #018181;
    font-size: 1.15rem;
}

.approval-heading-text {
    flex: 1;
    min-width: 0;
}

.approval-heading-text h2 {
    margin: 1px 0 5px;
    color: #17212f;
    font-size: 1.1rem;
    font-weight: 700;
}

.approval-heading-text p {
    margin: 0;
    color: #64748b;
    font-size: 0.82rem;
    line-height: 1.45;
}

.popup-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #64748b;
    font-size: 1.15rem;
    cursor: pointer;
    transition: 0.2s ease;
}

.popup-close-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
}

/* ==========================================
   APPROVAL LIST
========================================== */

.approval-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 18px 24px;
    overflow-y: auto;
}

.approval-member {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 13px;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    transition: border-color 0.2s ease, background 0.2s ease;
}

.approval-member:hover {
    border-color: #cbdedb;
    background: #fbfefd;
}

/* Member Avatar */

.member-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #e6f6f4;
    color: #018181;
    font-size: 0.8rem;
    font-weight: 700;
}

/* Member Details */

.member-details {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.member-name {
    color: #1e293b;
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
}

.member-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #9a6700;
    font-size: 0.72rem;
}

.status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #e5a000;
}

/* ==========================================
   MEMBER REASON DETAIL
========================================== */

.member-reason {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 11px 12px;
    border: 1px solid #f3e2bd;
    border-radius: 10px;
    background: #fffbf2;
    box-sizing: border-box;
}

.reason-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 8px;
    background: #fff0cf;
    color: #b7791f;
    font-size: 0.9rem;
}

.reason-content {
    flex: 1;
    min-width: 0;
}

.reason-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 5px 10px;
    margin-bottom: 4px;
}

.reason-label {
    color: #8a641f;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.035em;
}

.reason-category {
    padding: 3px 7px;
    border-radius: 999px;
    background: #fff0cf;
    color: #946514;
    font-size: 0.65rem;
    font-weight: 600;
}

.reason-content p {
    margin: 0;
    color: #665638;
    font-size: 0.76rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
}

/* ==========================================
   APPROVAL ACTIONS
========================================== */

.approval-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
    width: 100%;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 34px;
    padding: 0 11px;
    border: 1px solid transparent;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.74rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

/* Reject */

.reject-btn {
    border-color: #fee2e2;
    background: #fff7f7;
    color: #dc2626;
}

.reject-btn:hover {
    background: #fee2e2;
}

/* Approve */

.approve-btn {
    background: #018181;
    color: #ffffff;
}

.approve-btn:hover {
    background: #016b6b;
}

/* ==========================================
   EMPTY STATE
========================================== */

.approval-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 35px 15px;
    text-align: center;
}

.empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 58px;
    height: 58px;
    margin-bottom: 14px;
    border-radius: 50%;
    background: #e6f6f4;
    color: #018181;
    font-size: 1.5rem;
}

.approval-empty h3 {
    margin: 0 0 6px;
    color: #1e293b;
    font-size: 0.95rem;
}

.approval-empty p {
    margin: 0;
    color: #64748b;
    font-size: 0.8rem;
}

/* ==========================================
   POPUP FOOTER
========================================== */

.approval-modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 15px 24px;
    border-top: 1px solid #eef2f7;
    background: #fcfdff;
}

.approval-modal-footer > span {
    display: inline-flex;
    align-items: flex-start;
    gap: 7px;
    color: #64748b;
    font-size: 0.72rem;
    line-height: 1.4;
}

.approval-modal-footer > span i {
    margin-top: 1px;
    color: #018181;
}

.done-btn {
    min-width: 82px;
    padding: 9px 15px;
    border: 0;
    border-radius: 8px;
    background: #018181;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.done-btn:hover {
    background: #016b6b;
}

/* ==========================================
   RESPONSIVE MOBILE
========================================== */

@media (max-width: 600px) {

    .approval-overlay {
        align-items: flex-end;
        padding: 10px;
    }

    .approval-modal {
        width: 100%;
        max-height: 88vh;
        border-radius: 18px 18px 14px 14px;
    }

    .approval-modal-header {
        padding: 18px 17px 15px;
    }

    .approval-list {
        padding: 14px 15px;
    }

    .approval-member {
        flex-wrap: wrap;
        gap: 10px;
    }

    .member-details {
        flex-basis: calc(100% - 60px);
    }

    .approval-actions {
        width: 100%;
        padding-left: 0;
    }

    .action-btn {
        flex: 1;
        min-height: 36px;
    }

    .approval-modal-footer {
        padding: 13px 17px;
    }
}

/* ==========================================
   SMALL MOBILE
========================================== */

@media (max-width: 480px) {

    .sidebar-wrapper {
        padding: 20px 12px;
    }

    .logo {
        max-width: 100%;
        height: auto;
    }

    .sidebar-profile {
        padding: 12px 8px;
    }

    .user-name {
        font-size: 0.85rem;
    }

    .user-email {
        font-size: 0.7rem;
    }
}

</style>
