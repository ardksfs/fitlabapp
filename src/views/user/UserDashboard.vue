<template>
    <ion-page>
        <ion-content :fullscreen="true" class="dashboard-content">
            <div class="dashboard">
                <!-- Header -->
                <header class="topbar">
                    <div class="brand">
                        <img src="/assets/Logo.png" alt="FitLab" class="logo" />
                        <div>
                            <strong>FitLab</strong>
                            <small>Member Dashboard</small>
                        </div>
                    </div>

                    <div class="header-actions">
                        <button class="icon-btn" aria-label="Notifications" @click="openModal('notifications')">
                            <ion-icon :icon="notificationsOutline" />
                            <span v-if="unreadCount" class="notification-dot"></span>
                        </button>

                        <button class="profile-trigger" @click="openModal('profile')">
                            <img :src="profile.avatar || defaultAvatar" alt="Profile" />
                            <span class="profile-trigger-text">
                                <strong>{{ profile.name }}</strong>
                                <small>Member</small>
                            </span>
                            <ion-icon :icon="chevronDownOutline" />
                        </button>

                        <button class="icon-btn logout-btn" aria-label="Logout" @click="logout">
                            <ion-icon :icon="logOutOutline" />
                        </button>
                    </div>
                </header>

                <!-- Welcome banner -->
                <section class="welcome-banner">
                    <div class="banner-content">
                        <span class="eyebrow">YOUR FITNESS JOURNEY</span>
                        <h1>Hello, {{ firstName }}!</h1>
                        <p>
                            Stay consistent, keep moving, and become the best version of yourself.
                        </p>
                        <div class="banner-actions">
                            <button class="primary-btn" @click="openModal('workout')">
                                <ion-icon :icon="barbellOutline" />
                                View Workout Plan
                            </button>
                            <button class="qr-launch-btn" aria-label="Open gym access QR" title="Gym Access QR"
                                @click="openQrModal">
                                <i class="bx bx-qr-scan" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div class="banner-decoration">
                        <ion-icon :icon="fitnessOutline" />
                    </div>
                </section>

                <!-- Membership status -->
                <section class="membership-strip">
                    <div class="membership-icon">
                        <ion-icon :icon="ribbonOutline" />
                    </div>

                    <div class="membership-info">
                        <span>YOUR MEMBERSHIP</span>
                        <strong>{{ membership.plan }}</strong>
                        <small>{{ membership.daysLeft }} days remaining</small>
                    </div>

                    <div class="membership-status" :class="membership.status">
                        {{ membership.statusLabel }}
                    </div>

                    <button class="text-btn" @click="openModal('membership')">
                        View Details <ion-icon :icon="arrowForwardOutline" />
                    </button>
                </section>

                <!-- Stats -->
                <section class="section">
                    <div class="section-heading">
                        <div>
                            <h2>Your Overview</h2>
                            <p>Keep track of your fitness activities.</p>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <article class="stat-card">
                            <div class="stat-icon teal">
                                <ion-icon :icon="calendarOutline" />
                            </div>
                            <span>Sessions This Week</span>
                            <strong>{{ stats.sessions }}</strong>
                            <small>Training sessions</small>
                        </article>

                        <article class="stat-card">
                            <div class="stat-icon orange">
                                <ion-icon :icon="flameOutline" />
                            </div>
                            <span>Calories Burned</span>
                            <strong>{{ stats.calories.toLocaleString('id-ID') }}</strong>
                            <small>This week (estimated)</small>
                        </article>

                        <article class="stat-card">
                            <div class="stat-icon purple">
                                <ion-icon :icon="trendingUpOutline" />
                            </div>
                            <span>Workout Progress</span>
                            <strong>{{ progress }}%</strong>
                            <div class="progress-track">
                                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                            </div>
                        </article>

                        <article class="stat-card">
                            <div class="stat-icon blue">
                                <ion-icon :icon="waterOutline" />
                            </div>
                            <span>Water Intake</span>
                            <strong>{{ waterIntake }} / {{ waterTarget }} L</strong>
                            <div class="progress-track">
                                <div class="progress-fill"
                                    :style="{ width: Math.min((waterIntake / waterTarget) * 100, 100) + '%' }"></div>
                            </div>
                            <button class="small-action" @click="addWater">+ Add 250 ml</button>
                        </article>
                    </div>
                </section>

                <!-- Main content: member training overview -->
                <div class="content-grid member-program-grid">
                    <section class="panel workout-today-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="panel-kicker">YOUR NEXT SESSION</span>
                                <h2>Today's Workout</h2>
                                <p>Your planned training session.</p>
                            </div>
                            <span class="panel-heading-badge"><ion-icon :icon="barbellOutline" /> {{ workouts.length }} plans</span>
                        </div>

                        <div v-if="workouts.length" class="today-workout-feature">
                            <div class="today-workout-symbol"><ion-icon :icon="fitnessOutline" /></div>
                            <div class="today-workout-copy">
                                <span class="feature-label">RECOMMENDED SESSION</span>
                                <h3>{{ workouts[0].name }}</h3>
                                <p>{{ workouts[0].category }}</p>
                                <div class="feature-meta">
                                    <span><ion-icon :icon="timeOutline" /> {{ workouts[0].duration }}</span>
                                    <span><ion-icon :icon="trendingUpOutline" /> {{ workouts[0].level }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="barbellOutline" />
                            <p>No workout plan available yet.</p>
                        </div>

                        <button class="panel-bottom-action" @click="openModal('workout')">
                            Open Workout Plans <ion-icon :icon="arrowForwardOutline" />
                        </button>
                    </section>

                    <section class="panel schedule-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="panel-kicker">STAY ON TRACK</span>
                                <h2>Today's Schedule</h2>
                                <p>Your upcoming activities.</p>
                            </div>
                            <div class="panel-heading-icon"><ion-icon :icon="calendarOutline" /></div>
                        </div>

                        <div v-if="schedules.length" class="schedule-list upgraded-schedule-list">
                            <article v-for="(item, index) in schedules" :key="item.id" class="schedule-item upgraded-schedule-item">
                                <div class="schedule-time-block">
                                    <strong>{{ item.time }}</strong>
                                    <span>{{ index === 0 ? 'NEXT' : 'PLAN' }}</span>
                                </div>
                                <div class="schedule-line"></div>
                                <div class="schedule-detail">
                                    <strong>{{ item.title }}</strong>
                                    <small>{{ item.description }}</small>
                                </div>
                                <span class="schedule-status-dot"></span>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="calendarOutline" />
                            <p>No activities scheduled today.</p>
                        </div>

                        <button class="panel-bottom-action" @click="openModal('trainer')">
                            Check with your trainer <ion-icon :icon="arrowForwardOutline" />
                        </button>
                    </section>

                    <section class="panel plans-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="panel-kicker">TRAIN WITH PURPOSE</span>
                                <h2>Workout Plans</h2>
                                <p>Programs assigned for your progress.</p>
                            </div>
                            <div class="panel-heading-icon teal-heading-icon"><ion-icon :icon="barbellOutline" /></div>
                        </div>

                        <div v-if="workouts.length" class="plan-list">
                            <article v-for="workout in workouts.slice(0, 3)" :key="workout.id" class="plan-row">
                                <div class="plan-row-icon"><ion-icon :icon="barbellOutline" /></div>
                                <div class="plan-row-copy">
                                    <strong>{{ workout.name }}</strong>
                                    <small>{{ workout.category }} · {{ workout.duration }}</small>
                                </div>
                                <span class="plan-level">{{ workout.level }}</span>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="barbellOutline" />
                            <p>Your trainer has not assigned a workout plan yet.</p>
                        </div>

                        <button class="panel-bottom-action" @click="openModal('workout')">
                            View all workout plans <ion-icon :icon="arrowForwardOutline" />
                        </button>
                    </section>

                    <section class="panel diet-panel">
                        <div class="panel-heading">
                            <div>
                                <span class="panel-kicker">FUEL YOUR BODY</span>
                                <h2>Diet Plans</h2>
                                <p>Nutrition guidance for your goals.</p>
                            </div>
                            <div class="panel-heading-icon orange-heading-icon"><ion-icon :icon="nutritionOutline" /></div>
                        </div>

                        <div v-if="diets.length" class="diet-plan-list">
                            <article v-for="diet in diets.slice(0, 2)" :key="diet.id" class="diet-plan-card">
                                <div class="diet-plan-topline">
                                    <div class="diet-plan-icon"><ion-icon :icon="nutritionOutline" /></div>
                                    <span class="diet-type-pill">{{ diet.type }}</span>
                                </div>
                                <h3>{{ diet.name }}</h3>
                                <p>{{ diet.description }}</p>
                                <div class="diet-calorie-row">
                                    <span><ion-icon :icon="flameOutline" /> Daily target</span>
                                    <strong>{{ diet.calories.toLocaleString('id-ID') }} <small>kcal</small></strong>
                                </div>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="nutritionOutline" />
                            <p>No diet plan has been assigned yet.</p>
                        </div>

                        <button class="panel-bottom-action" @click="openModal('diet')">
                            View diet details <ion-icon :icon="arrowForwardOutline" />
                        </button>
                    </section>
                </div>

                <!-- Quick access -->
                <section class="section">
                    <div class="section-heading">
                        <div>
                            <h2>Explore FitLab</h2>
                            <p>Access your personal fitness information.</p>
                        </div>
                    </div>

                    <div class="quick-grid">
                        <button class="quick-card" @click="openModal('workout')">
                            <div class="quick-icon teal">
                                <ion-icon :icon="barbellOutline" />
                            </div>
                            <strong>Workout Plans</strong>
                            <small>Your training routine</small>
                            <ion-icon class="quick-arrow" :icon="arrowForwardOutline" />
                        </button>

                        <button class="quick-card" @click="openModal('diet')">
                            <div class="quick-icon green">
                                <ion-icon :icon="nutritionOutline" />
                            </div>
                            <strong>Diet Plans</strong>
                            <small>Your nutrition guide</small>
                            <ion-icon class="quick-arrow" :icon="arrowForwardOutline" />
                        </button>

                        <button class="quick-card" @click="openModal('trainer')">
                            <div class="quick-icon purple">
                                <ion-icon :icon="personOutline" />
                            </div>
                            <strong>My Trainer</strong>
                            <small>Your personal trainer</small>
                            <ion-icon class="quick-arrow" :icon="arrowForwardOutline" />
                        </button>

                        <button class="quick-card" @click="openModal('membership')">
                            <div class="quick-icon orange">
                                <ion-icon :icon="ribbonOutline" />
                            </div>
                            <strong>My Membership</strong>
                            <small>Your plan and validity</small>
                            <ion-icon class="quick-arrow" :icon="arrowForwardOutline" />
                        </button>
                    </div>
                </section>

                <!-- Footer -->
                <footer class="dashboard-footer">
                    <span>© {{ new Date().getFullYear() }} FitLab Gym Management | Fregi Ardika Setyawan</span>
                    <button class="footer-link" @click="openModal('settings')">
                        <ion-icon :icon="settingsOutline" /> Settings
                    </button>
                </footer>
            </div>

            <!-- General modal -->
            <ion-modal :is-open="activeModal !== null" @didDismiss="closeModal" class="fitlab-modal">
                <div v-if="activeModal === 'qr'" class="gym-qr-screen">
                    <header class="gym-qr-header">
                        <button class="gym-qr-hint" type="button" aria-label="QR access information"
                            :aria-expanded="showQrHint" @click="showQrHint = !showQrHint">
                            <ion-icon :icon="informationCircleOutline" />
                            <small v-if="showQrHint">Present your QR for gym access</small>
                        </button>
                        <h2>Gym Access QR</h2>
                        <button class="gym-qr-close" aria-label="Close QR" @click="closeModal"><ion-icon
                                :icon="closeOutline" /></button>
                    </header>
                    <main class="gym-qr-main">
                        <div class="gym-qr-card">
                            <div class="gym-qr-avatar-ring"><img :src="profile.avatar || defaultAvatar"
                                    :alt="profile.name" /></div>
                            <div class="gym-qr-code-wrap" :key="qrToken">
                                <img class="gym-qr-code" :src="qrImageUrl" alt="Dynamic gym access QR code" />
                            </div>
                            <div class="gym-qr-token"><span>SECURE ACCESS TOKEN</span><strong>{{ qrTokenValue.slice(0,
                                    12).toUpperCase() }}</strong></div>
                        </div>
                        <div class="gym-qr-membership">Your Membership Now Is {{ membership.plan }}<small>MEMBER CODE ·
                                #MEM-001</small></div>
                        <div class="gym-qr-actions">
                            <div class="qr-refresh-pill"><span class="qr-live-dot"></span>QR refreshes in {{
                                qrCountdownLabel }}</div>
                            <button class="qr-regenerate-btn" @click="rotateQrToken"><ion-icon class="qr-refresh-icon"
                                    :icon="refreshOutline" /> Refresh now</button>
                            <button type="button" class="qr-download-btn" :disabled="isDownloadingQR"
                                @click="downloadQR">
                                {{ isDownloadingQR ? 'Downloading...' : 'Download QR' }}
                            </button>
                            <small class="qr-security-note">QR token changes automatically. Show the latest QR at the
                                gym entrance.</small>
                        </div>
                    </main>
                </div>
                <div v-else class="modal-shell">
                    <div class="modal-header">
                        <div>
                            <span class="eyebrow">FITLAB MEMBER</span>
                            <h2>{{ modalTitle }}</h2>
                        </div>
                        <button class="icon-btn close-btn" aria-label="Close" @click="closeModal">
                            <ion-icon :icon="closeOutline" />
                        </button>
                    </div>

                    <!-- Profile -->
                    <div v-if="activeModal === 'profile'" class="modal-body">
                        <div class="avatar-editor">
                            <img :src="profile.avatar || defaultAvatar" alt="Member avatar" />
                            <label class="upload-btn">
                                <ion-icon :icon="cameraOutline" /> Change Photo
                                <input type="file" accept="image/*" @change="uploadAvatar" />
                            </label>
                        </div>

                        <form class="form-grid" @submit.prevent="saveProfile">
                            <label>
                                Full Name
                                <input v-model="profile.name" required maxlength="80" />
                            </label>
                            <label>
                                Email Address
                                <input v-model="profile.email" type="email" required />
                            </label>
                            <label>
                                Phone Number
                                <input v-model="profile.phone" type="tel" placeholder="Enter phone number" />
                            </label>
                            <label>
                                Fitness Goal
                                <select v-model="profile.goal">
                                    <option value="Build Muscle">Build Muscle</option>
                                    <option value="Lose Weight">Lose Weight</option>
                                    <option value="Stay Fit">Stay Fit</option>
                                    <option value="Improve Endurance">Improve Endurance</option>
                                </select>
                            </label>
                            <div class="form-actions full-width">
                                <button type="button" class="secondary-btn" @click="closeModal">Cancel</button>
                                <button type="submit" class="primary-btn">Save Profile</button>
                            </div>
                        </form>
                    </div>

                    <!-- Notifications -->
                    <div v-else-if="activeModal === 'notifications'" class="modal-body">
                        <div v-if="notifications.length" class="notice-list">
                            <article v-for="notice in notifications" :key="notice.id" class="notice-item"
                                :class="{ unread: !notice.read }">
                                <div class="notice-icon">
                                    <ion-icon :icon="notificationsOutline" />
                                </div>
                                <div>
                                    <strong>{{ notice.title }}</strong>
                                    <p>{{ notice.message }}</p>
                                    <small>{{ notice.date }}</small>
                                </div>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="notificationsOutline" />
                            <p>No notifications yet.</p>
                        </div>
                        <button v-if="unreadCount" class="secondary-btn full-width" @click="markNotificationsRead">
                            Mark All as Read
                        </button>
                    </div>

                    <!-- Workout plans -->
                    <div v-else-if="activeModal === 'workout'" class="modal-body">
                        <p class="modal-description">Your assigned training routines.</p>
                        <article v-for="workout in workouts" :key="workout.id" class="detail-card">
                            <div class="detail-card-icon teal">
                                <ion-icon :icon="barbellOutline" />
                            </div>
                            <div class="detail-card-content">
                                <strong>{{ workout.name }}</strong>
                                <p>{{ workout.category }} · {{ workout.duration }}</p>
                                <small>{{ workout.level }} level</small>
                            </div>
                        </article>
                        <div v-if="!workouts.length" class="empty-state">
                            <p>Your trainer has not assigned a workout plan yet.</p>
                        </div>
                    </div>

                    <!-- Diet plans -->
                    <div v-else-if="activeModal === 'diet'" class="modal-body">
                        <p class="modal-description">Nutrition guidance for your fitness goals.</p>
                        <article v-for="diet in diets" :key="diet.id" class="detail-card">
                            <div class="detail-card-icon green">
                                <ion-icon :icon="nutritionOutline" />
                            </div>
                            <div class="detail-card-content">
                                <strong>{{ diet.name }}</strong>
                                <p>{{ diet.description }}</p>
                                <small>{{ diet.calories }} kcal/day · {{ diet.type }}</small>
                            </div>
                        </article>
                        <div v-if="!diets.length" class="empty-state">
                            <p>No diet plan has been assigned yet.</p>
                        </div>
                    </div>

                    <!-- Trainer -->
                    <div v-else-if="activeModal === 'trainer'" class="modal-body">
                        <div class="trainer-profile">
                            <div class="trainer-avatar">
                                <ion-icon :icon="personOutline" />
                            </div>
                            <h3>{{ hasAssignedTrainer ? trainer.name : 'Waiting for PT assignment' }}</h3>
                            <span v-if="hasAssignedTrainer" class="trainer-specialty">{{ trainer.specialty }}</span>
                            <p>{{ trainer.description }}</p>
                            <div v-if="hasAssignedTrainer" class="trainer-contact">
                                <div>
                                    <ion-icon :icon="mailOutline" />
                                    <a :href="`mailto:${trainer.email}`">{{ trainer.email }}</a>
                                </div>
                                <div>
                                    <ion-icon :icon="timeOutline" />
                                    <span>{{ trainer.availability }}</span>
                                </div>
                            </div>
                            <div v-else class="assignment-pending">
                                <strong>Trainer not assigned yet</strong>
                                <p>Admin will assign a personal trainer to your account. This section will update when
                                    the assignment is available.</p>
                            </div>
                            <div class="trainer-actions">
                                <button class="primary-btn" :disabled="!hasAssignedTrainer" @click="contactTrainer">
                                    <ion-icon :icon="mailOutline" /> Chat with Trainer
                                </button>
                                <button class="secondary-btn" @click="openModal('report')">
                                    <ion-icon :icon="flagOutline" /> Send a Report
                                </button>
                                <button class="secondary-btn" :disabled="!communityUrl" @click="openCommunity">
                                    <ion-icon :icon="peopleOutline" /> Community Group
                                </button>
                                <small v-if="!communityUrl" class="helper-text">Community WhatsApp link belum
                                    dikonfigurasi.</small>
                            </div>
                        </div>
                    </div>

                    <!-- Report -->
                    <div v-else-if="activeModal === 'report'" class="modal-body">
                        <p class="modal-description">Send a message to FitLab support. Your report will be saved on this
                            device until a backend is connected.</p>
                        <form class="report-form" @submit.prevent="submitReport">
                            <label>Report category
                                <select v-model="reportForm.category" required>
                                    <option value="training">Workout / training issue</option>
                                    <option value="trainer">Trainer assignment or communication</option>
                                    <option value="membership">Membership or payment</option>
                                    <option value="technical">App / technical issue</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>
                            <label>Message
                                <textarea v-model="reportForm.message" rows="5" maxlength="2000" required
                                    placeholder="Explain what happened or how we can help..."></textarea>
                            </label>
                            <div class="form-actions">
                                <button type="button" class="secondary-btn" @click="closeModal">Cancel</button>
                                <button type="submit" class="primary-btn">Submit Report</button>
                            </div>
                        </form>
                    </div>

                    <!-- Membership -->
                    <div v-else-if="activeModal === 'membership'" class="modal-body">
                        <div class="membership-detail-card">
                            <div class="membership-detail-top">
                                <div class="membership-icon large">
                                    <ion-icon :icon="ribbonOutline" />
                                </div>
                                <span :class="['membership-status', membership.status]">
                                    {{ membership.statusLabel }}
                                </span>
                            </div>
                            <span class="eyebrow">CURRENT PLAN</span>
                            <h3>{{ membership.plan }}</h3>
                            <p>{{ membership.description }}</p>
                            <div class="membership-detail-row">
                                <span>Start Date</span><strong>{{ membership.startDate }}</strong>
                            </div>
                            <div class="membership-detail-row">
                                <span>End Date</span><strong>{{ membership.endDate }}</strong>
                            </div>
                            <div class="membership-detail-row">
                                <span>Remaining</span><strong>{{ membership.daysLeft }} days</strong>
                            </div>
                            <div class="membership-detail-row">
                                <span>Payment Status</span><strong>{{ membership.paymentStatus }}</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Settings -->
                    <div v-else-if="activeModal === 'settings'" class="modal-body">
                        <div class="setting-row">
                            <div>
                                <strong>Workout Reminders</strong>
                                <p>Receive reminders about your training.</p>
                            </div>
                            <input v-model="settings.workoutReminders" type="checkbox" class="toggle" />
                        </div>
                        <div class="setting-row">
                            <div>
                                <strong>Membership Notifications</strong>
                                <p>Get notified about membership updates.</p>
                            </div>
                            <input v-model="settings.membershipNotifications" type="checkbox" class="toggle" />
                        </div>
                        <div class="form-actions settings-actions">
                            <button type="button" class="secondary-btn" @click="cancelSettings">Cancel</button>
                            <button type="button" class="primary-btn" @click="saveSettings">Save Settings</button>
                        </div>
                    </div>
                </div>
            </ion-modal>


        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import {
    IonPage,
    IonContent,
    IonModal,
    IonIcon,
} from '@ionic/vue';
import {
    notificationsOutline,
    chevronDownOutline,
    logOutOutline,
    barbellOutline,
    fitnessOutline,
    ribbonOutline,
    arrowForwardOutline,
    calendarOutline,
    flameOutline,
    trendingUpOutline,
    waterOutline,
    timeOutline,
    nutritionOutline,
    personOutline,
    settingsOutline,
    closeOutline,
    cameraOutline,
    mailOutline,
    flagOutline,
    peopleOutline,
    informationCircleOutline,
    refreshOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

type ModalName =
    | 'profile'
    | 'notifications'
    | 'workout'
    | 'diet'
    | 'trainer'
    | 'membership'
    | 'settings'
    | 'report'
    | 'qr'
    | null;

interface MemberProfile {
    name: string;
    email: string;
    phone: string;
    goal: string;
    avatar: string;
}

interface Workout {
    id: string;
    name: string;
    category: string;
    duration: string;
    level: string;
}

interface Diet {
    id: string;
    name: string;
    description: string;
    calories: number;
    type: string;
}

interface Notice {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

const router = useRouter();

const SESSION_KEY = 'fitlab_session';
const PROFILE_KEY = 'fitlab-member-profile';
const SETTINGS_KEY = 'fitlab-member-settings';
const WATER_KEY = 'fitlab-member-water';
const ASSIGNMENTS_KEY = 'fitlab-pt-assignments';
const REPORTS_KEY = 'fitlab-member-reports';
const COMMUNITY_URL_KEY = 'fitlab-community-whatsapp-url';

const defaultAvatar =
    'https://ui-avatars.com/api/?name=FitLab+Member&background=018181&color=ffffff&size=160';

const activeModal = ref<ModalName>(null);
const QR_TTL_SECONDS = 10 * 60;
const qrToken = ref('');
const qrTokenValue = ref('');
const showQrHint = ref(false);
const qrExpiresAt = ref(0);
const qrNow = ref(Date.now());
let qrTicker: ReturnType<typeof setInterval> | undefined;
const qrCountdownSeconds = computed(() => Math.max(0, Math.ceil((qrExpiresAt.value - qrNow.value) / 1000)));
const qrCountdownLabel = computed(() => `${Math.floor(qrCountdownSeconds.value / 60)}:${String(qrCountdownSeconds.value % 60).padStart(2, '0')}`);
const qrImageUrl = computed(() => `https://api.qrserver.com/v1/create-qr-code/?size=640x640&margin=12&data=${encodeURIComponent(qrToken.value)}`);
const profileSnapshot = ref<MemberProfile | null>(null);
const settingsSnapshot = ref<{ workoutReminders: boolean; membershipNotifications: boolean } | null>(null);
const reportForm = reactive({ category: 'training', message: '' });
const communityUrl = ref('');
const reportSavedMessage = ref('');

const profile = reactive<MemberProfile>({
    name: 'FitLab Member',
    email: '',
    phone: '',
    goal: 'Stay Fit',
    avatar: '',
});

const membership = reactive({
    plan: 'Monthly Membership',
    description: 'Access to standard gym facilities and training areas.',
    startDate: '01 Oct 2026',
    endDate: '31 Oct 2026',
    daysLeft: 19,
    status: 'active',
    statusLabel: 'Active',
    paymentStatus: 'Paid',
});

const stats = reactive({
    sessions: 4,
    calories: 1250,
});

const progress = ref(70);
const waterIntake = ref(1.5);
const waterTarget = 2.5;

const workouts = ref<Workout[]>([
    {
        id: 'WK-01',
        name: 'Full Body Strength',
        category: 'Strength Training',
        duration: '45 minutes',
        level: 'Beginner',
    },
    {
        id: 'WK-02',
        name: 'Cardio Endurance',
        category: 'Cardio',
        duration: '30 minutes',
        level: 'Intermediate',
    },
    {
        id: 'WK-03',
        name: 'Core & Abs',
        category: 'Core Training',
        duration: '20 minutes',
        level: 'Beginner',
    },
]);

const diets = ref<Diet[]>([
    {
        id: 'DT-01',
        name: 'Balanced Fitness Diet',
        description: 'Balanced meals with protein, carbohydrates, and vegetables.',
        calories: 2000,
        type: 'Balanced',
    },
]);

const schedules = ref([
    {
        id: 'SC-01',
        time: '07:00',
        title: 'Strength Training',
        description: 'Full body workout',
    },
    {
        id: 'SC-02',
        time: '17:00',
        title: 'Cardio Session',
        description: 'Light cardio and stretching',
    },
]);

const trainer = reactive({
    name: '',
    specialty: '',
    description: 'Your assigned personal trainer. Follow your workout plan consistently and discuss adjustments with your trainer.',
    email: '',
    availability: 'Contact trainer for schedule',
    whatsapp: '',
});
const hasAssignedTrainer = computed(() => Boolean(trainer.email && trainer.name));

const notifications = ref<Notice[]>([
    {
        id: 'NT-01',
        title: 'Welcome to FitLab',
        message: 'Keep your routine consistent and track your fitness progress.',
        date: '12 Oct 2026',
        read: false,
    },
    {
        id: 'NT-02',
        title: 'Workout Reminder',
        message: 'Remember to review your assigned workout plan.',
        date: '12 Oct 2026',
        read: false,
    },
]);

const settings = reactive({
    workoutReminders: true,
    membershipNotifications: true,
});

const firstName = computed(() => {
    return profile.name.trim().split(/\s+/)[0] || 'Member';
});

const unreadCount = computed(() => {
    return notifications.value.filter((notice) => !notice.read).length;
});

const modalTitle = computed(() => {
    const titles: Record<Exclude<ModalName, null>, string> = {
        profile: 'My Profile',
        notifications: 'Notifications',
        workout: 'Workout Plans',
        diet: 'Diet Plans',
        trainer: 'My Trainer',
        membership: 'My Membership',
        settings: 'Settings',
        report: 'Send a Report',
        qr: 'Gym Access QR',
    };

    return activeModal.value ? titles[activeModal.value] : '';
});


function openQrModal() {
    // masih digunakan QR lama jika masih berlaku.
    if (!qrToken.value || Date.now() >= qrExpiresAt.value) {
        rotateQrToken();
    }

    qrNow.value = Date.now();
    activeModal.value = 'qr';
}

function createSecureToken() {
    const bytes = new Uint8Array(24);
    if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
    else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}


function rotateQrToken() {
    qrTokenValue.value = createSecureToken();

    qrToken.value = JSON.stringify({
        v: 1,
        purpose: 'gym-entry',
        token: qrTokenValue.value,
        issuedAt: new Date().toISOString(),
    });

    // Waktu kedaluwarsa ditetapkan hanya saat token baru dibuat.
    qrExpiresAt.value = Date.now() + QR_TTL_SECONDS * 1000;
    qrNow.value = Date.now();
}


const isDownloadingQR = ref(false);

async function downloadQR() {
    if (isDownloadingQR.value) return;

    isDownloadingQR.value = true;

    let blobUrl: string | undefined;

    try {
        const response = await fetch(qrImageUrl.value, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`QR API returned HTTP ${response.status}`);
        }

        const blob = await response.blob();

        if (!blob.size) {
            throw new Error('QR image is empty');
        }

        // secure save only PNG.
        const pngBlob = blob.type === 'image/png'
            ? blob
            : new Blob([blob], { type: 'image/png' });

        blobUrl = URL.createObjectURL(pngBlob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'FitLab-Gym-Access-QR.png';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        console.error('Download QR gagal:', error);

        window.alert(
            'QR gagal diunduh. Periksa koneksi internet atau izin akses API QR.'
        );
    } finally {
        if (blobUrl) {
            window.setTimeout(() => {
                URL.revokeObjectURL(blobUrl!);
            }, 1500);
        }

        isDownloadingQR.value = false;
    }
}

function openModal(modal: Exclude<ModalName, null>) {
    if (modal === 'profile') profileSnapshot.value = { ...profile };
    if (modal === 'settings') settingsSnapshot.value = { ...settings };
    if (modal === 'report') { reportForm.category = 'training'; reportForm.message = ''; reportSavedMessage.value = ''; }
    activeModal.value = modal;

    if (modal === 'notifications') {
        notifications.value = notifications.value.map((notice) => ({
            ...notice,
            read: true,
        }));
    }
}

function closeModal() {
    if (activeModal.value === 'profile') cancelProfile();
    if (activeModal.value === 'settings') cancelSettings();
    activeModal.value = null;
}

function accountStorageKey(base: string) {
    const session = getSession();
    const account = (session?.email || session?.id || 'unknown').toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    return `${base}:${account}`;
}

function cancelProfile() {
    if (profileSnapshot.value) Object.assign(profile, profileSnapshot.value);
    profileSnapshot.value = null;
}

function cancelSettings() {
    if (settingsSnapshot.value) Object.assign(settings, settingsSnapshot.value);
    settingsSnapshot.value = null;
}

function restoreTrainerAssignment() {
    const session = getSession();
    if (!session?.email) return;
    try {
        const raw = localStorage.getItem(ASSIGNMENTS_KEY);
        const assignments = raw ? JSON.parse(raw) as Array<Record<string, unknown>> : [];
        const assignment = assignments.find((item) =>
            String(item.memberEmail || '').toLowerCase() === session.email.toLowerCase() && item.status === 'assigned'
        );
        if (assignment && typeof assignment.trainerEmail === 'string' && typeof assignment.trainerName === 'string') {
            trainer.name = assignment.trainerName;
            trainer.email = assignment.trainerEmail;
            trainer.specialty = typeof assignment.specialty === 'string' ? assignment.specialty : 'Personal Trainer';
            trainer.whatsapp = typeof assignment.trainerWhatsapp === 'string' ? assignment.trainerWhatsapp : '';
            trainer.availability = typeof assignment.availability === 'string' ? assignment.availability : 'Contact trainer for schedule';
        } else {
            trainer.name = ''; trainer.email = ''; trainer.specialty = ''; trainer.whatsapp = '';
        }
        communityUrl.value = localStorage.getItem(COMMUNITY_URL_KEY) || '';
    } catch (error) {
        console.error('Unable to restore trainer assignment:', error);
    }
}

function contactTrainer() {
    if (!hasAssignedTrainer.value) return;
    if (trainer.whatsapp) {
        const number = trainer.whatsapp.replace(/[^0-9]/g, '');
        if (number) { window.open(`https://wa.me/${number}`, '_blank', 'noopener,noreferrer'); return; }
    }
    window.location.href = `mailto:${trainer.email}?subject=${encodeURIComponent('FitLab training question')}`;
}

function openCommunity() {
    if (!communityUrl.value) return;
    const url = communityUrl.value.trim();
    if (!/^https:\/\//i.test(url)) { window.alert('Tautan komunitas harus menggunakan https://'); return; }
    window.open(url, '_blank', 'noopener,noreferrer');
}

function submitReport() {
    const session = getSession();
    const message = reportForm.message.trim();
    if (!session?.email || !message) return;
    try {
        const existing = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]') as Array<Record<string, unknown>>;
        existing.push({
            id: `RPT-${Date.now()}`, memberEmail: session.email, memberName: profile.name,
            category: reportForm.category, message, status: 'new', createdAt: new Date().toISOString(),
        });
        localStorage.setItem(REPORTS_KEY, JSON.stringify(existing));
        reportSavedMessage.value = 'Report tersimpan di perangkat ini. Setelah backend tersedia, report dapat dikirim ke Admin.';
        reportForm.message = '';
        window.alert(reportSavedMessage.value);
        closeModal();
    } catch (error) {
        console.error('Unable to save report:', error);
        window.alert('Report gagal disimpan. Coba lagi.');
    }
}

function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;

        const session: unknown = JSON.parse(raw);

        if (
            typeof session !== 'object' ||
            session === null ||
            !('role' in session) ||
            !('name' in session) ||
            !('email' in session)
        ) {
            return null;
        }

        return session as {
            id?: string;
            name: string;
            email: string;
            role: string;
        };
    } catch {
        return null;
    }
}

function restoreData() {
    const session = getSession();

    if (!session) {
        void router.replace('/login');
        return;
    }

    if (session.role !== 'member') {
        if (session.role === 'admin') {
            void router.replace('/admin/dashboard');
        } else if (session.role === 'pt') {
            void router.replace('/pt/dashboard');
        } else {
            void router.replace('/login');
        }
        return;
    }

    profile.name = session.name;
    profile.email = session.email;

    try {
        const savedProfile = localStorage.getItem(accountStorageKey(PROFILE_KEY)) || localStorage.getItem(PROFILE_KEY);

        if (savedProfile) {
            const parsed = JSON.parse(savedProfile) as Partial<MemberProfile>;

            // Apply saved profile only to the same account.
            if (parsed.email === session.email) {
                profile.name = parsed.name || session.name;
                profile.email = session.email;
                profile.phone = parsed.phone || '';
                profile.goal = parsed.goal || 'Stay Fit';
                profile.avatar = parsed.avatar || '';
            }
        }

        const savedSettings = localStorage.getItem(accountStorageKey(SETTINGS_KEY)) || localStorage.getItem(SETTINGS_KEY);

        if (savedSettings) {
            const parsed = JSON.parse(savedSettings) as Partial<typeof settings>;
            settings.workoutReminders = parsed.workoutReminders ?? true;
            settings.membershipNotifications =
                parsed.membershipNotifications ?? true;
        }

        const savedWater = localStorage.getItem(accountStorageKey(WATER_KEY)) || localStorage.getItem(WATER_KEY);

        if (savedWater !== null) {
            const parsedWater = Number(savedWater);

            if (Number.isFinite(parsedWater) && parsedWater >= 0) {
                waterIntake.value = parsedWater;
            }
        }
    } catch (error) {
        console.error('Unable to restore member data:', error);
    }
    restoreTrainerAssignment();
}

function saveProfile() {
    const session = getSession();

    if (!session || session.role !== 'member') {
        void router.replace('/login');
        return;
    }

    profile.name = profile.name.trim();

    try {
        localStorage.setItem(
            accountStorageKey(PROFILE_KEY),
            JSON.stringify({
                ...profile,
                email: session.email,
            }),
        );

        // Keep the original account email and update the displayed name.
        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                ...session,
                name: profile.name,
                email: session.email,
            }),
        );

        profileSnapshot.value = { ...profile };
        closeModal();
    } catch (error) {
        console.error('Unable to save member profile:', error);
        window.alert('Profil gagal disimpan. Coba gunakan foto yang lebih kecil.');
    }
}

function uploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        window.alert('Pilih file gambar yang valid.');
        input.value = '';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        window.alert('Ukuran foto maksimal 2 MB.');
        input.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        if (typeof reader.result === 'string') {
            profile.avatar = reader.result;
        }
    };

    reader.onerror = () => {
        window.alert('Foto gagal dibaca. Silakan coba lagi.');
    };

    reader.readAsDataURL(file);
}

function markNotificationsRead() {
    notifications.value = notifications.value.map((notice) => ({
        ...notice,
        read: true,
    }));
}

function addWater() {
    waterIntake.value = Math.min(
        Math.round((waterIntake.value + 0.25) * 100) / 100,
        20,
    );
}

function saveSettings() {
    try {
        localStorage.setItem(accountStorageKey(SETTINGS_KEY), JSON.stringify(settings));
        settingsSnapshot.value = { ...settings };
        closeModal();
    } catch (error) {
        console.error('Unable to save settings:', error);
        window.alert('Pengaturan gagal disimpan.');
    }
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    void router.replace('/login');
}

watch(waterIntake, (value) => {
    try {
        localStorage.setItem(accountStorageKey(WATER_KEY), String(value));
    } catch (error) {
        console.error('Unable to save water intake:', error);
    }
});

onMounted(() => {
    restoreData();
    qrTicker = setInterval(() => {
        qrNow.value = Date.now();
        if (activeModal.value === 'qr' && qrCountdownSeconds.value <= 0) rotateQrToken();
    }, 1000);
});

onUnmounted(() => {
    if (qrTicker) clearInterval(qrTicker);
});
</script>

<style scoped>
.dashboard-content {
    --background: #f5f7fa;
}

.dashboard {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    padding: 26px 32px;
    color: #17212f;
    font-family: 'Poppins', sans-serif;
}

.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
}

.brand,
.header-actions,
.profile-trigger,
.membership-strip,
.membership-info,
.panel-heading,
.section-heading,
.workout-item,
.schedule-item,
.detail-card,
.setting-row,
.footer-link {
    display: flex;
    align-items: center;
}

.brand {
    gap: 12px;
}

.logo {
    width: 150px;
    height: 150px;
    object-fit: contain;
}

.brand strong,
.brand small,
.profile-trigger-text strong,
.profile-trigger-text small {
    display: block;
}

.brand strong {
    font-size: 20px;
    font-weight: 700;
}

.brand small,
.profile-trigger-text small {
    margin-top: 2px;
    color: #8792a2;
    font-size: 11px;
}

.header-actions {
    gap: 14px;
}

.icon-btn {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid #e7ebf0;
    border-radius: 12px;
    background: #fff;
    color: #465467;
    font-size: 20px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
}

.icon-btn:hover {
    border-color: #018181;
    color: #018181;
}

.notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 7px;
    height: 7px;
    border: 1px solid #fff;
    border-radius: 50%;
    background: #f58020;
}

.profile-trigger {
    gap: 10px;
    padding: 5px 10px 5px 5px;
    border: 1px solid #e7ebf0;
    border-radius: 14px;
    background: #fff;
    text-align: left;
    cursor: pointer;
}

.profile-trigger img {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    object-fit: cover;
}

.profile-trigger-text strong {
    max-width: 150px;
    overflow: hidden;
    color: #243142;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.profile-trigger>ion-icon {
    color: #8792a2;
    font-size: 16px;
}

.welcome-banner {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 225px;
    overflow: hidden;
    padding: 34px 40px;
    border-radius: 22px;
    background: linear-gradient(115deg, #006f70 0%, #018181 60%, #079999 100%);
    color: #fff;
}

.banner-content {
    position: relative;
    z-index: 1;
    max-width: 580px;
}

.eyebrow {
    color: #8de2db;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
}

.welcome-banner h1 {
    margin: 12px 0 8px;
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 700;
}

.welcome-banner p {
    max-width: 480px;
    margin: 0 0 23px;
    color: #d8f4f0;
    font-size: 13px;
    line-height: 1.8;
}

.banner-decoration {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 180px;
    margin-right: 45px;
    border: 1px solid rgb(255 255 255 / 20%);
    border-radius: 50%;
    background: rgb(255 255 255 / 8%);
    color: rgb(255 255 255 / 35%);
    font-size: 100px;
}

.primary-btn,
.secondary-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 11px 17px;
    border: 1px solid #dbe3ed;
    border-radius: 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.primary-btn {
    background: #018181;
    border-color: #018181;
    color: #fff;
}

.primary-btn:hover {
    background: #006b6b;
    border-color: #006b6b;
}

.welcome-banner .primary-btn {
    background: #fff;
    color: #007778;
}

.welcome-banner .primary-btn:hover {
    background: #e8f7f5;
}

.secondary-btn {
    background: #fff;
    border-color: #dbe3ed;
    color: #40516b;
}

.secondary-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #243142;
}

.membership-strip {
    gap: 17px;
    margin-top: 22px;
    padding: 20px 24px;
    border: 1px solid #e8edf1;
    border-radius: 17px;
    background: #fff;
}

.membership-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 14px;
    background: #e3f5f3;
    color: #018181;
    font-size: 24px;
}

.membership-info {
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
}

.membership-info>span {
    color: #8490a0;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
}

.membership-info>strong {
    font-size: 15px;
}

.membership-info>small {
    color: #8490a0;
    font-size: 11px;
}

.membership-status {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 20px;
    background: #e5f7ed;
    color: #18844d;
    font-size: 10px;
    font-weight: 700;
    white-space: nowrap;
}

.membership-status.expired {
    background: #fff0f0;
    color: #d44747;
}

.membership-status.pending {
    background: #fff4df;
    color: #a66b00;
}

.text-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 0;
    border: 0;
    background: transparent;
    color: #018181;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.text-btn:hover {
    color: #f58020;
}

.section {
    margin-top: 32px;
}

.section-heading {
    justify-content: space-between;
    margin-bottom: 17px;
}

.section-heading h2,
.panel-heading h2 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
}

.section-heading p,
.panel-heading p {
    margin: 5px 0 0;
    color: #8994a3;
    font-size: 11px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 17px;
}

.stat-card {
    min-width: 0;
    padding: 20px;
    border: 1px solid #e8edf1;
    border-radius: 16px;
    background: #fff;
}

.stat-icon,
.quick-icon,
.detail-card-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 12px;
}

.stat-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 17px;
    font-size: 20px;
}

.teal {
    background: #e1f5f3;
    color: #018181;
}

.orange {
    background: #fff0e2;
    color: #ee861c;
}

.purple {
    background: #f0eaff;
    color: #8157d9;
}

.blue {
    background: #e6efff;
    color: #3978dc;
}

.green {
    background: #e3f7e9;
    color: #249651;
}

.stat-card>span {
    display: block;
    color: #798697;
    font-size: 11px;
}

.stat-card>strong {
    display: block;
    margin: 7px 0;
    font-size: 25px;
    font-weight: 700;
    overflow-wrap: anywhere;
}

.stat-card>small {
    color: #a0a9b5;
    font-size: 10px;
}

.progress-track {
    height: 6px;
    overflow: hidden;
    margin-top: 11px;
    border-radius: 10px;
    background: #edf1f4;
}

.progress-fill {
    height: 100%;
    border-radius: inherit;
    background: #018181;
    transition: width 0.3s ease;
}

.small-action {
    margin-top: 8px;
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: #018181;
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
}

.content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 20px;
    margin-top: 26px;
}

.panel {
    min-width: 0;
    padding: 23px;
    border: 1px solid #e8edf1;
    border-radius: 17px;
    background: #fff;
}

.panel-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 19px;
}

.heading-icon {
    color: #018181;
    font-size: 22px;
}

.workout-list,
.schedule-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.workout-item {
    gap: 12px;
    padding: 13px;
    border: 1px solid #edf0f3;
    border-radius: 12px;
}

.workout-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border-radius: 11px;
    background: #e3f5f3;
    color: #018181;
    font-size: 20px;
}

.workout-detail {
    flex: 1;
    min-width: 0;
}

.workout-detail strong,
.workout-detail small {
    display: block;
}

.workout-detail strong {
    font-size: 12px;
}

.workout-detail small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
}

.workout-tag {
    padding: 5px 8px;
    border-radius: 7px;
    background: #f1f5f7;
    color: #647386;
    font-size: 9px;
    white-space: nowrap;
}

.schedule-item {
    align-items: stretch;
    gap: 12px;
    min-height: 54px;
}

.schedule-time {
    width: 46px;
    flex-shrink: 0;
    padding-top: 3px;
    color: #018181;
    font-size: 11px;
    font-weight: 700;
}

.schedule-line {
    width: 3px;
    flex-shrink: 0;
    border-radius: 4px;
    background: #d8f0ed;
}

.schedule-detail {
    padding: 1px 0 12px;
}

.schedule-detail strong,
.schedule-detail small {
    display: block;
}

.schedule-detail strong {
    font-size: 12px;
}

.schedule-detail small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
}

.quick-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
}

.quick-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    min-height: 155px;
    padding: 19px;
    border: 1px solid #e8edf1;
    border-radius: 16px;
    background: #fff;
    color: #17212f;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
}

.quick-card:hover {
    transform: translateY(-2px);
    border-color: #8acbc5;
}

.quick-icon {
    width: 43px;
    height: 43px;
    margin-bottom: 15px;
    font-size: 22px;
}

.quick-card>strong {
    font-size: 12px;
}

.quick-card>small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
    line-height: 1.5;
}

.quick-arrow {
    position: absolute;
    top: 21px;
    right: 17px;
    color: #a1aab5;
    font-size: 17px;
}

.dashboard-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 35px;
    padding: 20px 0 8px;
    border-top: 1px solid #e7ebf0;
    color: #939eac;
    font-size: 10px;
}

.footer-link {
    gap: 6px;
    padding: 5px;
    border: 0;
    background: transparent;
    color: #667486;
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 28px 12px;
    color: #8994a3;
    text-align: center;
}

.empty-state ion-icon {
    color: #a7b3bd;
    font-size: 28px;
}

.empty-state p {
    margin: 0;
    font-size: 12px;
}

.modal-shell {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-height: calc(100dvh - 24px);
    min-height: 0;
    padding: 26px;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior-y: contain;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    background: #fff;
    color: #17212f;
    font-family: 'Poppins', sans-serif;
}

.modal-shell {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.modal-shell::-webkit-scrollbar {
    display: none;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 25px;
    padding-bottom: 18px;
    border-bottom: 1px solid #edf0f3;
}

.modal-header .eyebrow {
    color: #018181;
}

.modal-header h2 {
    margin: 7px 0 0;
    font-size: 21px;
}

.close-btn {
    width: 38px;
    height: 38px;
}

.modal-body {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.avatar-editor {
    display: flex;
    align-items: center;
    gap: 17px;
    margin-bottom: 5px;
}

.avatar-editor>img {
    width: 76px;
    height: 76px;
    border: 3px solid #e4f5f3;
    border-radius: 18px;
    object-fit: cover;
}

.upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 12px;
    border: 1px solid #dfe7eb;
    border-radius: 9px;
    color: #018181;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

.upload-btn input {
    display: none;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 17px;
}

.form-grid label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #475467;
    font-size: 11px;
    font-weight: 600;
}

.form-grid input,
.form-grid select,
.report-form select,
.report-form textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    border: 1px solid #dfe5eb;
    border-radius: 9px;
    outline: none;
    background: #fff;
    color: #263445;
    font-family: inherit;
    font-size: 12px;
}

.form-grid input:focus,
.form-grid select:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgb(1 129 129 / 9%);
}

.full-width {
    width: 100%;
}

.form-actions.full-width {
    grid-column: 1 / -1;
}

.form-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.form-actions .primary-btn,
.form-actions .secondary-btn {
    width: auto;
    min-width: 120px;
}

.report-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
}

.report-form label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: #475467;
    font-size: 12px;
    font-weight: 600;
}

.report-form select,
.report-form textarea {
    padding: 11px 12px;
    border: 1px solid #dfe5eb;
    border-radius: 9px;
    font: inherit;
    color: #263445;
    background: #fff;
}

.report-form textarea {
    resize: vertical;
    min-height: 120px;
}

.trainer-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
}

.trainer-actions button {
    width: 100%;
    justify-content: center;
}

.trainer-actions button:disabled {
    opacity: .45;
    cursor: not-allowed;
}

.assignment-pending {
    margin-top: 16px;
    padding: 14px;
    background: #fff8e8;
    border: 1px solid #f4dfb4;
    border-radius: 10px;
}

.assignment-pending p,
.helper-text {
    margin: 6px 0 0;
    color: #7b8794;
    font-size: 11px;
    line-height: 1.6;
}

.trainer-contact a {
    color: #018181;
    overflow-wrap: anywhere;
}

.notice-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.notice-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 15px;
    border: 1px solid #edf0f3;
    border-radius: 12px;
}

.notice-item.unread {
    border-color: #c9e9e5;
    background: #f5fbfa;
}

.notice-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #e3f5f3;
    color: #018181;
    font-size: 18px;
}

.notice-item strong {
    font-size: 12px;
}

.notice-item p {
    margin: 5px 0;
    color: #667486;
    font-size: 11px;
    line-height: 1.6;
}

.notice-item small {
    color: #99a3b0;
    font-size: 10px;
}

.modal-description {
    margin: 0 0 4px;
    color: #7f8b9a;
    font-size: 12px;
}

.detail-card {
    align-items: flex-start;
    gap: 13px;
    padding: 15px;
    border: 1px solid #e9edf1;
    border-radius: 12px;
}

.detail-card-icon {
    width: 43px;
    height: 43px;
    font-size: 20px;
}

.detail-card-content {
    min-width: 0;
}

.detail-card-content strong {
    font-size: 13px;
}

.detail-card-content p {
    margin: 5px 0;
    color: #657386;
    font-size: 11px;
    line-height: 1.6;
}

.detail-card-content small {
    color: #018181;
    font-size: 10px;
}

.trainer-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 5px;
    text-align: center;
}

.trainer-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85px;
    height: 85px;
    border-radius: 24px;
    background: #e3f5f3;
    color: #018181;
    font-size: 38px;
}

.trainer-profile h3 {
    margin: 15px 0 5px;
    font-size: 18px;
}

.trainer-specialty {
    color: #018181;
    font-size: 11px;
    font-weight: 600;
}

.trainer-profile>p {
    max-width: 380px;
    color: #718093;
    font-size: 12px;
    line-height: 1.8;
}

.trainer-contact {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-top: 12px;
    padding: 17px;
    border-radius: 12px;
    background: #f7f9fb;
    text-align: left;
}

.trainer-contact>div {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #536174;
    font-size: 11px;
    overflow-wrap: anywhere;
}

.trainer-contact ion-icon {
    color: #018181;
    font-size: 17px;
}

.membership-detail-card {
    padding: 21px;
    border: 1px solid #dfeeea;
    border-radius: 15px;
    background: linear-gradient(145deg, #f6fcfb, #fff);
}

.membership-detail-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
}

.membership-icon.large {
    width: 55px;
    height: 55px;
    font-size: 27px;
}

.membership-detail-card>.eyebrow {
    color: #018181;
}

.membership-detail-card h3 {
    margin: 8px 0;
    font-size: 22px;
}

.membership-detail-card>p {
    margin: 0 0 20px;
    color: #718093;
    font-size: 11px;
    line-height: 1.7;
}

.membership-detail-row {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    padding: 13px 0;
    border-top: 1px solid #e7efed;
    font-size: 11px;
}

.membership-detail-row span {
    color: #758294;
}

.membership-detail-row strong {
    text-align: right;
}

.setting-row {
    justify-content: space-between;
    gap: 15px;
    padding: 16px 0;
    border-bottom: 1px solid #edf0f3;
}

.setting-row>div {
    min-width: 0;
}

.setting-row strong {
    font-size: 12px;
}

.setting-row p {
    margin: 5px 0 0;
    color: #8792a2;
    font-size: 10px;
    line-height: 1.6;
}

.toggle {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    accent-color: #018181;
    cursor: pointer;
}

/* Upgraded Member Panels Grid */
.member-program-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
    gap: 20px;
    margin-top: 28px;
}

.member-program-grid .panel {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 300px;
    padding: 24px;
    border: 1px solid #e7edf0;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 7px 24px rgb(22 45 58 / 3%);
    transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.member-program-grid .panel:hover {
    border-color: #c4e4e0;
    box-shadow: 0 12px 30px rgb(1 129 129 / 7%);
    transform: translateY(-2px);
}

.member-program-grid .panel-heading {
    align-items: flex-start;
    margin-bottom: 22px;
}

.panel-kicker {
    display: block;
    margin-bottom: 7px;
    color: #018181;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1.35px;
}

.panel-heading-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border: 1px solid #dcefeb;
    border-radius: 9px;
    background: #f0faf8;
    color: #018181;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}
.panel-heading-badge ion-icon {
    font-size: 14px;
}

.panel-heading-icon {
    display: grid;
    place-items: center;
    width: 43px;
    height: 43px;
    flex: 0 0 auto;
    border-radius: 13px;
    background: #e4f6f3;
    color: #018181;
    font-size: 21px;
}

.panel-heading-icon.orange-heading-icon {
    background: #fff1e5;
    color: #f58020;
}

.panel-heading-icon.teal-heading-icon {
    background: #e4f6f3;
    color: #018181;
}

/* Today's Workout Feature */
.today-workout-feature {
    display: flex;
    align-items: center;
    gap: 17px;
    min-height: 145px;
    padding: 20px;
    overflow: hidden;
    border: 1px solid #d9eeea;
    border-radius: 15px;
    background: linear-gradient(120deg, #f0faf8 0%, #f8fcfb 65%, #fff 100%);
}

.today-workout-symbol {
    display: grid;
    place-items: center;
    width: 66px;
    height: 66px;
    flex: 0 0 auto;
    border-radius: 19px;
    background: #018181;
    box-shadow: 0 8px 18px rgb(1 129 129 / 20%);
    color: #fff;
    font-size: 31px;
}

.today-workout-copy {
    min-width: 0;
}

.feature-label {
    color: #018181;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 1px;
}

.today-workout-copy h3 {
    margin: 7px 0 4px;
    color: #17212f;
    font-size: 16px;
    font-weight: 700;
    overflow-wrap: anywhere;
}

.today-workout-copy p {
    margin: 0;
    color: #7d8b99;
    font-size: 11px;
}

.feature-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
    margin-top: 13px;
}

.feature-meta span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #5f7180;
    font-size: 10px;
}

.feature-meta ion-icon {
    color: #018181;
    font-size: 14px;
}

/* Today's Schedule */
.upgraded-schedule-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.upgraded-schedule-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 13px;
    min-height: 73px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f3f5;
}

.upgraded-schedule-item:last-child {
    border-bottom: 0;
}

.schedule-time-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 54px;
    flex: 0 0 auto;
}

.schedule-time-block strong {
    color: #018181;
    font-size: 12px;
    font-weight: 700;
}

.schedule-time-block span {
    margin-top: 4px;
    color: #a1acb6;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .7px;
}

.upgraded-schedule-item .schedule-line {
    width: 3px;
    align-self: stretch;
    min-height: 38px;
    background: linear-gradient(180deg, #018181, #c9e9e4);
}

.upgraded-schedule-item .schedule-detail {
    flex: 1;
    min-width: 0;
    padding: 0;
}

.upgraded-schedule-item .schedule-detail strong {
    display: block;
    color: #263646;
    font-size: 11px;
}

.upgraded-schedule-item .schedule-detail small {
    display: block;
    line-height: 1.6;
    font-size: 10px;
}

.schedule-status-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #f58020;
    box-shadow: 0 0 0 4px #fff2e7;
}

/* Workout Plans */
.plan-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.plan-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 13px;
    border: 1px solid #edf1f3;
    border-radius: 13px;
    background: #fff;
    transition: background .2s ease, border-color .2s ease;
}

.plan-row:hover {
    border-color: #cde8e4;
    background: #f9fdfc;
}

.plan-row-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border-radius: 12px;
    background: #e4f6f3;
    color: #018181;
    font-size: 20px;
}

.plan-row-copy {
    flex: 1;
    min-width: 0;
}

.plan-row-copy strong,
.plan-row-copy small {
    display: block;
}

.plan-row-copy strong {
    color: #263646;
    font-size: 11px;
    overflow-wrap: anywhere;
}

.plan-row-copy small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 9px;
    line-height: 1.5;
}

.plan-level {
    padding: 6px 8px;
    border-radius: 7px;
    background: #f1f6f5;
    color: #477d78;
    font-size: 9px;
    white-space: nowrap;
}

/* Diet Plans */
.diet-plan-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.diet-plan-card {
    padding: 16px;
    border: 1px solid #f2e7dc;
    border-radius: 14px;
    background: linear-gradient(130deg, #fffaf5, #fff 75%);
}

.diet-plan-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.diet-plan-icon {
    display: grid;
    place-items: center;
    width: 37px;
    height: 37px;
    border-radius: 11px;
    background: #fff0e2;
    color: #f58020;
    font-size: 19px;
}

.diet-type-pill {
    padding: 6px 9px;
    border-radius: 99px;
    background: #fff0e2;
    color: #b96717;
    font-size: 9px;
    font-weight: 600;
}

.diet-plan-card h3 {
    margin: 12px 0 5px;
    color: #263646;
    font-size: 12px;
    font-weight: 700;
}

.diet-plan-card p {
    margin: 0;
    color: #83909c;
    font-size: 10px;
    line-height: 1.7;
}

.diet-calorie-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #f3e9df;
}

.diet-calorie-row>span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #8c7868;
    font-size: 10px;
}

.diet-calorie-row>span ion-icon {
    color: #f58020;
    font-size: 15px;
}

.diet-calorie-row>strong {
    color: #283748;
    font-size: 12px;
    white-space: nowrap;
}

.diet-calorie-row>strong small {
    color: #8b96a1;
    font-size: 9px;
    font-weight: 500;
}
/* Actions */
.panel-bottom-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    margin-top: auto;
    padding: 16px 1px 0;
    border: 0;
    border-top: 1px solid #eef2f4;
    background: transparent;
    color: #018181;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    transition: color .2s ease;
}
.panel-bottom-action ion-icon { font-size: 17px; transition: transform .2s ease; }
.panel-bottom-action:hover { color: #f58020; }
.panel-bottom-action:hover ion-icon { transform: translateX(4px); }


@media (max-width: 1100px) {
    .dashboard {
        padding: 23px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .quick-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .banner-decoration {
        margin-right: 5px;
    }
}

@media (max-width: 760px) {
    .dashboard {
        padding: 16px;
    }

    .topbar {
        align-items: flex-start;
        margin-bottom: 20px;
    }

    .brand {
        gap: 8px;
    }

    .logo {
        width: 37px;
        height: 37px;
    }

    .brand strong {
        font-size: 17px;
    }

    .brand small {
        font-size: 9px;
    }

    .header-actions {
        gap: 7px;
    }

    .header-actions>.icon-btn {
        width: 36px;
        height: 36px;
        font-size: 17px;
    }

    .profile-trigger {
        padding: 3px;
        border: 0;
        background: transparent;
    }

    .profile-trigger img {
        width: 35px;
        height: 35px;
    }

    .profile-trigger-text,
    .profile-trigger>ion-icon {
        display: none;
    }

    .welcome-banner {
        min-height: 210px;
        padding: 26px 23px;
        border-radius: 17px;
    }

    .welcome-banner h1 {
        font-size: 27px;
    }

    .welcome-banner p {
        max-width: 340px;
        font-size: 11px;
    }

    .banner-decoration {
        position: absolute;
        right: -52px;
        bottom: -35px;
        width: 150px;
        height: 150px;
        margin: 0;
        font-size: 80px;
    }

    .banner-content {
        max-width: 85%;
    }

    .membership-strip {
        flex-wrap: wrap;
        gap: 12px;
        padding: 16px;
    }

    .membership-info {
        flex: 1;
        min-width: 120px;
    }

    .membership-strip>.text-btn {
        width: 100%;
        justify-content: flex-start;
        padding-top: 5px;
        border-top: 1px solid #edf0f3;
    }

    .section {
        margin-top: 26px;
    }

    .stats-grid {
        gap: 11px;
    }

    .stat-card {
        padding: 15px;
    }

    .stat-card>strong {
        font-size: 22px;
    }

    .content-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 15px;
        margin-top: 20px;
    }
    
    .member-program-grid { 
        grid-template-columns: minmax(0, 1fr); 
        gap: 15px; 
        margin-top: 20px; 
    }
    
    .member-program-grid .panel { 
        min-height: 0; 
        padding: 19px; 
    }
    
    .member-program-grid .panel-heading { 
        margin-bottom: 17px; 
    }
    
    .today-workout-feature { 
        gap: 13px; 
        padding: 16px; 
    }
    
    .today-workout-symbol { 
        width: 55px; 
        height: 55px; 
        border-radius: 15px; 
        font-size: 26px; 
    }

    .panel {
        padding: 18px;
    }

    .quick-grid {
        gap: 11px;
    }

    .quick-card {
        min-height: 145px;
        padding: 15px;
    }

    .dashboard-footer {
        font-size: 9px;
    }

    .modal-shell {
        padding: 21px 17px;
    }
}

@media (max-width: 420px) {
    .dashboard {
        padding: 12px;
    }

    .brand small {
        display: none;
    }

    .header-actions {
        gap: 5px;
    }

    .header-actions>.icon-btn {
        width: 33px;
        height: 33px;
    }

    .welcome-banner {
        padding: 23px 18px;
    }

    .welcome-banner h1 {
        font-size: 24px;
    }

    .welcome-banner p {
        font-size: 10px;
    }

    .welcome-banner .primary-btn {
        min-height: 38px;
        padding: 9px 11px;
        font-size: 10px;
    }

    .membership-info>strong {
        font-size: 12px;
    }

    .membership-status {
        padding: 5px 8px;
        font-size: 9px;
    }

    .stat-card {
        padding: 12px;
    }

    .stat-icon {
        width: 34px;
        height: 34px;
        margin-bottom: 12px;
        font-size: 17px;
    }

    .stat-card>span {
        font-size: 10px;
        line-height: 1.5;
    }

    .stat-card>strong {
        font-size: 19px;
    }

    .stat-card>small {
        font-size: 9px;
    }

    .workout-item {
        gap: 9px;
        padding: 10px;
    }

    .workout-icon {
        width: 36px;
        height: 36px;
        font-size: 17px;
    }

    .workout-detail strong {
        font-size: 11px;
    }

    .workout-tag {
        font-size: 8px;
    }
    
    .member-program-grid .panel { 
        padding: 16px; 
    }
    
    .panel-heading-badge { 
        padding: 6px 8px; 
        font-size: 9px; 
    }
    
    .today-workout-copy h3 { 
        font-size: 14px; 
    }
    
    .plan-row { 
        gap: 9px; 
        padding: 11px; 
    }
    
    .plan-level { 
        padding: 5px 6px; 
        font-size: 8px; 
    }

    .quick-card>strong {
        font-size: 11px;
    }

    .quick-card>small {
        font-size: 9px;
    }

    .form-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .modal-header h2 {
        font-size: 19px;
    }

    .form-actions {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 8px;
    }

    .form-actions .primary-btn,
    .form-actions .secondary-btn {
        width: 100%;
        min-width: 0;
        min-height: 42px;
        padding: 10px 8px;
        font-size: 11px;
        white-space: normal;
    }

    .modal-shell {
        padding: 18px 14px;
    }

    .modal-header {
        gap: 10px;
        margin-bottom: 18px;
    }

    .avatar-editor {
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .settings-actions {
        grid-template-columns: 1fr;
    }

    .trainer-profile {
        width: 100%;
        min-width: 0;
    }

    .trainer-contact>div {
        min-width: 0;
        overflow-wrap: anywhere;
    }
}

@media (max-width: 360px) {
    .dashboard {
        padding: 9px;
    }

    .form-actions {
        grid-template-columns: 1fr;
    }

    .modal-header h2 {
        font-size: 17px;
    }

    .modal-shell {
        padding: 15px 11px;
    }
}

/* Profile Form Buttons */
.primary-btn,
.secondary-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 11px 17px;
    border: 1px solid #dbe3ed;
    border-radius: 10px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
}

/* Save Profile */
.primary-btn {
    background: #018181;
    border-color: #018181;
    color: #fff;
}

.primary-btn:hover {
    background: #006b6b;
    border-color: #006b6b;
}

/* Cancel */
.secondary-btn {
    background: #fff;
    border-color: #dbe3ed;
    color: #40516b;
}

.secondary-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #243142;
}

/* Profile Form Actions */
.form-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 6px;
}

.form-actions.full-width {
    grid-column: 1 / -1;
}

@media (max-width: 576px) {
    .form-actions {
        flex-direction: column-reverse;
        width: 100%;
    }

    .form-actions button {
        width: 100%;
    }
}

@media (max-width: 760px) {
    ion-content::part(scroll) {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    ion-content::part(scroll)::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

/* Fix popup full-screen di HP */
ion-modal.fitlab-modal {
    --width: 100%;
    --height: 100%;
    --max-width: 100%;
    --max-height: 100%;
    --border-radius: 0;
    --background: #ffffff;
    --box-shadow: none;
}

ion-modal.fitlab-modal::part(content) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    background: #ffffff;
    box-shadow: none;
}

/* Isi popup mengikuti tinggi layar */
ion-modal.fitlab-modal .modal-shell {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    max-height: 100%;
    min-height: 0;
    padding-top: calc(18px + env(safe-area-inset-top));
    padding-bottom: calc(18px + env(safe-area-inset-bottom));
    overflow-y: auto;
    background: #ffffff;
}

@media (max-width: 760px) {
    ion-modal.fitlab-modal {
        --width: 100%;
        --height: 100%;
        --border-radius: 0;
        --backdrop-opacity: 0.4;
    }
}


/* Gym Access QR — matched to the supplied teal/orange reference design */
.banner-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.qr-launch-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 10px 15px;
    border: 1px solid rgba(255, 255, 255, .65);
    border-radius: 10px;
    background: rgba(255, 255, 255, .12);
    color: #fff;
    font: 600 12px 'Poppins', sans-serif;
    cursor: pointer;
    transition: transform .25s, background .25s, box-shadow .25s;
}

.qr-launch-btn i {
    font-size: 20px;
}

.qr-launch-btn:hover {
    transform: translateY(-2px);
    background: #fff;
    color: #007b7b;
    box-shadow: 0 8px 24px #003e3e30;
}

.gym-qr-screen {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    min-height: 100%;
    height: 100%;
    overflow-y: auto;
    padding: calc(27px + env(safe-area-inset-top)) 5vw calc(24px + env(safe-area-inset-bottom));
    background: #f4f7fb;
    color: #050505;
    font-family: 'Poppins', sans-serif;
}

.gym-qr-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 16px;
    width: 100%;
}

.gym-qr-header h2 {
    margin: 0;
    font-size: clamp(20px, 3.8vw, 36px);
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
}

.gym-qr-hint {
    justify-self: start;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #111;
    cursor: pointer;
    text-align: left;
}

.gym-qr-hint ion-icon {
    font-size: 30px;
    flex-shrink: 0;
}

.gym-qr-hint small {
    font-size: 8px;
    white-space: nowrap;
    animation: qr-hint-in .2s ease both;
}

.gym-qr-close {
    justify-self: end;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    border: 2px solid #008c8b;
    border-radius: 15px;
    background: transparent;
    color: #050505;
    font-size: 34px;
    cursor: pointer;
    transition: transform .2s, background .2s;
}

.gym-qr-close:hover {
    transform: rotate(90deg);
    background: #e1f6f4;
}

.gym-qr-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: clamp(95px, 16vh, 180px);
}

.gym-qr-card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: min(70vw, 640px);
    aspect-ratio: .83;
    min-height: 350px;
    max-height: 70vh;
    border: 10px solid transparent;
    border-radius: clamp(38px, 8vw, 76px);
    background: linear-gradient(#d8d8d8, #d8d8d8) padding-box, linear-gradient(145deg, #008c8b 5%, #068c83 35%, #ff861c 88%) border-box;
    animation: qr-card-in .65s cubic-bezier(.2, .8, .2, 1) both;
}

.gym-qr-avatar-ring {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 2;
    width: clamp(95px, 16vw, 145px);
    aspect-ratio: 1;
    transform: translate(-50%, -55%);
    padding: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #008c8b, #ff861c);
}

.gym-qr-avatar-ring img {
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #d8d8d8;
}

.gym-qr-code-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: min(68%, 410px);
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 8px 28px #00000012;
    animation: qr-code-in .6s .15s both;
}

.gym-qr-code {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
}

.gym-qr-token {
    position: absolute;
    bottom: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    color: #333;
}

.gym-qr-token span {
    font-size: 9px;
    letter-spacing: 2px;
    opacity: .65;
}

.gym-qr-token strong {
    font-size: 12px;
    letter-spacing: 2px;
}

.gym-qr-membership {
    margin-top: clamp(36px, 7vh, 66px);
    text-align: center;
    color: #4d4d4d;
    font-size: clamp(13px, 2vw, 20px);
}

.gym-qr-membership small {
    display: block;
    margin-top: 8px;
    color: #999;
    font-size: clamp(10px, 1.6vw, 15px);
}

.gym-qr-actions {
    display: flex;
    flex-direction: column;
    gap: 13px;
    width: min(72vw, 650px);
    margin-top: clamp(45px, 8vh, 95px);
}

.qr-refresh-pill,
.qr-regenerate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 58px;
    box-sizing: border-box;
    border: 0;
    border-radius: 13px;
    font: 500 clamp(13px, 2vw, 19px) 'Poppins', sans-serif;
    cursor: pointer;
    transition: transform .2s, filter .2s, box-shadow .2s;
}

.qr-refresh-pill {
    background: #fb801b;
    color: #080808;
    cursor: default;
}

.qr-live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 0 #fff9;
    animation: qr-pulse 1.5s infinite;
}

.qr-regenerate-btn {
    min-height: 42px;
    border: 1px solid #00878650;
    background: transparent;
    color: #007c7b;
    font-size: 13px;
}

.qr-regenerate-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.04);
    box-shadow: 0 7px 20px #005c5c20;
}

.qr-download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 58px;
    box-sizing: border-box;
    border: 0;
    border-radius: 13px;
    background: #008786;
    color: #050505;
    text-decoration: none;
    font: 500 clamp(13px, 2vw, 19px) 'Poppins', sans-serif;
    cursor: pointer;
    transition: transform .2s, filter .2s, box-shadow .2s;
}

.qr-download-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
    box-shadow: 0 7px 20px #005c5c20;
}

.qr-security-note {
    color: #8b9299;
    font-size: 10px;
    line-height: 1.6;
    text-align: center;
}

@keyframes qr-card-in {
    from {
        opacity: 0;
        transform: translateY(22px) scale(.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes qr-code-in {
    from {
        opacity: 0;
        transform: scale(.85);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes qr-hint-in {
    from {
        opacity: 0;
        transform: translateX(-4px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes qr-refresh-blink {

    0%,
    100% {
        opacity: 1;
        transform: rotate(0deg) scale(1);
    }

    50% {
        opacity: .35;
        transform: rotate(25deg) scale(1.12);
    }
}

.qr-refresh-icon {
    animation: qr-refresh-blink 1.15s ease-in-out infinite;
}

@keyframes qr-pulse {
    70% {
        box-shadow: 0 0 0 8px #ffffff00;
    }

    100% {
        box-shadow: 0 0 0 0 #ffffff00;
    }
}

@media (max-width:760px) {
    .banner-actions {
        gap: 8px;
    }

    .banner-actions .primary-btn,
    .qr-launch-btn {
        min-height: 39px;
        padding: 9px 11px;
        font-size: 10px;
    }

    .qr-launch-btn i {
        font-size: 18px;
    }

    .gym-qr-screen {
        padding-left: 16px;
        padding-right: 16px;
    }

    .gym-qr-header {
        grid-template-columns: 1fr auto;
        gap: 10px;
    }

    .gym-qr-hint {
        grid-column: 1;
        grid-row: 1;
    }

    .gym-qr-header h2 {
        grid-column: 1 / -1;
        grid-row: 2;
        text-align: center;
    }

    .gym-qr-close {
        grid-column: 2;
        grid-row: 1;
        width: 42px;
        height: 42px;
        font-size: 27px;
    }

    .gym-qr-main {
        padding-top: clamp(90px, 14vh, 135px);
    }

    .gym-qr-card {
        width: min(78vw, 470px);
        min-height: 300px;
        max-height: 58vh;
        border-width: 7px;
        border-radius: 48px;
    }

    .gym-qr-code-wrap {
        width: min(70%, 310px);
    }

    .gym-qr-token {
        bottom: 13px;
    }

    .gym-qr-token span {
        font-size: 7px;
    }

    .gym-qr-token strong {
        font-size: 10px;
    }

    .gym-qr-actions {
        width: min(88vw, 470px);
        margin-top: 40px;
    }

    .qr-refresh-pill {
        min-height: 50px;
    }
}

@media (max-width:420px) {
    .gym-qr-hint small {
        font-size: 7px;
    }

    .gym-qr-hint ion-icon {
        font-size: 24px;
    }

    .gym-qr-header h2 {
        font-size: 22px;
    }

    .gym-qr-main {
        padding-top: 100px;
    }

    .gym-qr-card {
        width: 82vw;
        min-height: 290px;
        max-height: 52vh;
    }

    .gym-qr-membership {
        margin-top: 35px;
    }

    .gym-qr-actions {
        margin-top: 34px;
    }
}

@media (prefers-reduced-motion:reduce) {

    .gym-qr-card,
    .gym-qr-code-wrap,
    .qr-live-dot,
    .qr-refresh-icon {
        animation: none !important;
    }
}
</style>