
<template>
    <ion-page class="admin-layout">
        <ion-split-pane content-id="main-content" when="lg" class="custom-split-pane">

            <ion-menu
                content-id="main-content"
                menu-id="main-menu"
                side="start"
                type="overlay"
                class="custom-sidebar"
            >
                <ion-content class="sidebar-content">
                    <Sidebar
                        :profile="profile"
                        @openProfile="openProfileModal"
                    />
                </ion-content>
            </ion-menu>

            <ion-router-outlet id="main-content"></ion-router-outlet>
        </ion-split-pane>

        <!-- Modal Profile -->
        <ion-modal
            :is-open="isProfileOpen"
            @didDismiss="closeProfileModal"
            class="profile-modal"
        >
            <div class="modal-wrapper">

                <!-- Header -->
                <div class="modal-header">
                    <h2>Edit your profile</h2>

                    <button
                        class="close-button"
                        type="button"
                        @click="closeProfileModal"
                    >
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Body -->
                <div class="modal-body">

                    <!-- Form -->
                    <div class="form-side">

                        <div class="form-group">
                            <label>Full name</label>
                            <input
                                type="text"
                                v-model="form.name"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                v-model="form.email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div class="row">

                            <div class="form-group">
                                <label>Timezone</label>
                                <input
                                    type="text"
                                    v-model="form.timezone"
                                    placeholder="e.g. GMT+7"
                                />
                            </div>

                            <div class="form-group">
                                <label>Working hours</label>
                                <input
                                    type="text"
                                    v-model="form.workingHours"
                                    placeholder="e.g. 10 AM - 6 PM"
                                />
                            </div>

                        </div>

                        <div class="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                v-model="form.title"
                                placeholder="Enter your job title"
                            />
                        </div>

                    </div>

                    <!-- Preview -->
                    <div class="preview-side">

                        <p class="preview-label">Preview</p>

                        <div class="avatar-container">

                            <img
                                :src="form.avatar || '/assets/user.jpg'"
                                class="avatar"
                                alt="Profile"
                            />

                            <input
                                ref="fileInput"
                                type="file"
                                id="fileInput"
                                accept="image/jpeg,image/png,image/webp"
                                class="hidden-file-input"
                                @change="handleAvatarChange"
                            />

                            <label
                                for="fileInput"
                                class="edit-badge"
                                title="Change profile picture"
                            >
                                <i class="fa-solid fa-pencil"></i>
                            </label>

                        </div>

                        <h4>{{ form.name || 'Admin Fitlab' }}</h4>

                        <p class="role">
                            {{ form.title || 'System Administrator' }}
                        </p>

                        <!-- Digital Clock -->
                        <div class="digital-clock">
                            <i class="fa-regular fa-clock"></i>
                            <span>{{ digitalClock }}</span>
                        </div>

                    </div>

                </div>

                <!-- Footer -->
                <div class="modal-footer">

                    <span class="last-updated">
                        Last updated: {{ profile.lastUpdated }}
                    </span>

                    <div class="actions">

                        <button
                            type="button"
                            class="btn-cancel"
                            @click="closeProfileModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                            <span>Cancel</span>
                        </button>

                        <button
                            type="button"
                            class="btn-save"
                            @click="saveProfile"
                        >
                            <i class="fa-solid fa-check"></i>
                            <span>Save changes</span>
                        </button>

                    </div>

                </div>

            </div>
        </ion-modal>

    </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';

import {
    IonPage,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonRouterOutlet,
    IonModal
} from '@ionic/vue';

import Sidebar from '../components/Sidebar.vue';

interface AdminProfile {
    name: string;
    email: string;
    timezone: string;
    workingHours: string;
    title: string;
    avatar: string;
    lastUpdated: string;
}

const STORAGE_KEY = 'fitlab-admin-profile';

const defaultProfile: AdminProfile = {
    name: 'Admin Fitlab',
    email: 'admin@fitlab.com',
    timezone: 'GMT-7',
    workingHours: '10 AM - 6 PM',
    title: 'System Administrator',
    avatar: '/assets/user.jpg',
    lastUpdated: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
};

// Load profile from localStorage
const loadProfile = (): AdminProfile => {
    try {
        const savedProfile = localStorage.getItem(STORAGE_KEY);

        if (savedProfile) {
            const parsedProfile = JSON.parse(savedProfile);

            return {
                ...defaultProfile,
                ...parsedProfile
            };
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
    }

    return { ...defaultProfile };
};

// Profile displayed in Sidebar
const profile = reactive<AdminProfile>(loadProfile());

// Editable form
const form = reactive<AdminProfile>({
    ...profile
});

const isProfileOpen = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const digitalClock = ref('');

let clockInterval: ReturnType<typeof setInterval> | undefined;

// Update digital clock
const updateClock = () => {
    digitalClock.value = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
};

// Open modal and copy saved profile into the form
const openProfileModal = () => {
    Object.assign(form, profile);
    isProfileOpen.value = true;
};

// Close modal without saving
const closeProfileModal = () => {
    Object.assign(form, profile);
    isProfileOpen.value = false;

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

// Open file picker
const triggerFileInput = () => {
    fileInput.value?.click();
};

// Handle profile picture upload
const handleAvatarChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPG, PNG, or WebP image.');
        target.value = '';
        return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {
        alert('Image size must not exceed 2 MB.');
        target.value = '';
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        if (typeof reader.result === 'string') {
            form.avatar = reader.result;
        }

        target.value = '';
    };

    reader.onerror = () => {
        alert('Failed to load the profile picture.');
        target.value = '';
    };

    reader.readAsDataURL(file);
};

// Save profile and update Sidebar
const saveProfile = () => {
    if (!form.name.trim()) {
        alert('Full name cannot be empty.');
        return;
    }

    if (!form.email.trim()) {
        alert('Email cannot be empty.');
        return;
    }

    const updatedProfile: AdminProfile = {
        name: form.name.trim(),
        email: form.email.trim(),
        timezone: form.timezone.trim(),
        workingHours: form.workingHours.trim(),
        title: form.title.trim(),
        avatar: form.avatar || '/assets/user.jpg',

        // This value changes only when Save changes is clicked.
        lastUpdated: new Date().toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedProfile)
        );

        Object.assign(profile, updatedProfile);
        Object.assign(form, updatedProfile);

        isProfileOpen.value = false;
    } catch (error) {
        console.error('Failed to save profile:', error);
        alert(
            'Failed to save profile. The image may be too large for browser storage.'
        );
    }
};

onMounted(() => {
    updateClock();

    clockInterval = setInterval(() => {
        updateClock();
    }, 1000);
});

onUnmounted(() => {
    if (clockInterval) {
        clearInterval(clockInterval);
    }
});

</script>

<style scoped>

/* SIDEBAR LAYOUT */

.custom-split-pane {
    --side-width: 250px;
    --side-min-width: 250px;
    --side-max-width: 250px;
    --border: none;
}

.custom-sidebar {
    --width: 250px;
    --background: #ffffff;
}

.sidebar-content {
    --background: #ffffff;
}

.profile-modal {
    --background: #ffffff;
    --color: #000000;
    --width: 750px;
    --height: auto;
    --border-radius: 20px;
}

.modal-wrapper {
    padding: 30px;
    color: #000000;
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
}


/* MODAL HEADER */

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.modal-header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #018181;
}

.close-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 9px;
    background: #ffffff;
    color: #64748b;
    cursor: pointer;

    transition:
        background-color 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.2s ease;
}

.close-button:hover {
    background: #f8fafc;
    color: #1e293b;
    border-color: #cbd5e1;
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
    transform: rotate(4deg);
}

.close-button:active {
    transform: scale(0.94);
}


/* MODAL BODY */

.modal-body {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 40px;

    border-top: 1px solid #eee;
    padding-top: 25px;
}


/* FORM */

.form-side {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.form-side label {
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
}

.form-side input {
    width: 100%;
    min-height: 44px;
    padding: 11px 13px;
    box-sizing: border-box;
    border: 1px solid #dfe3e8;
    border-radius: 9px;
    background: #ffffff;
    color: #111827;
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    outline: none;

    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease,
        background-color 0.3s ease;
}

.form-side input:hover {
    border-color: #f5a15c;
    background: #fffdfb;
}

.form-side input:focus {
    border-color: #f58020;
    background: #ffffff;

    box-shadow:
        0 0 0 3px rgba(245, 128, 32, 0.10);
}

.form-side input::placeholder {
    color: #a0a8b5;
    opacity: 1;
}


/* ROW */

.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}


/* PREVIEW */

.preview-side {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.preview-label {
    color: #888;
    font-size: 0.8rem;
    margin: 0 0 10px;
}

.avatar-container {
    position: relative;
    width: 108px;
    height: 108px;
    margin: 8px 0 12px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ffffff;

    box-shadow:
        0 4px 12px rgba(15, 23, 42, 0.12);
}

.hidden-file-input {
    display: none;
}

.edit-badge {
    position: absolute;
    right: 0;
    bottom: 5px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f58020;
    color: #ffffff;
    border: 3px solid #ffffff;
    cursor: pointer;

    box-shadow:
        0 3px 8px rgba(245, 128, 32, 0.25);

    transition:
        background-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.2s ease;
}

.edit-badge:hover {
    background: #e56f10;

    box-shadow:
        0 5px 12px rgba(245, 128, 32, 0.35);

    transform: scale(1.08);
}

.edit-badge:active {
    transform: scale(0.95);
}

.edit-badge i {
    font-size: 12px;
}

.preview-side h4 {
    max-width: 100%;
    overflow-wrap: anywhere;
    margin: 5px 0 4px;
    font-size: 1.05rem;
    font-weight: 600;
    color: #111827;
}

.preview-side .role {
    max-width: 100%;
    overflow-wrap: anywhere;
    color: #888;
    font-size: 0.82rem;
    margin: 0;
}


/* DIGITAL CLOCK */

.digital-clock {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 16px;
    padding: 9px 12px;
    border: 1px solid #e5eeee;
    border-radius: 9px;
    background: #f5fafa;
    color: #018181;
    font-size: 0.8rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

.digital-clock i {
    font-size: 13px;
}


/* FOOTER */

.modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 30px;
    padding-top: 20px;

    border-top: 1px solid #f1f5f9;
}

.last-updated {
    font-size: 0.75rem;
    color: #64748b;
}

.actions {
    display: flex;
    align-items: center;
    gap: 10px;
}


/* BASE BUTTON */

.actions button {
    height: 42px;
    padding: 0 17px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 9px;
    font-family: 'Poppins', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;

    transition:
        background-color 0.25s ease,
        color 0.25s ease,
        border-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.15s ease;
}

.btn-cancel {
    min-width: 92px;
    background: #ffffff;
    color: #64748b;
    border: 1px solid #e2e8f0;

    box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.04);
}

.btn-cancel:hover {
    background: #f8fafc;
    color: #334155;
    border-color: #cbd5e1;

    box-shadow:
        0 4px 10px rgba(15, 23, 42, 0.08);

    transform: translateY(-1px);
}

.btn-cancel:active {
    transform: translateY(0);

    box-shadow:
        0 2px 5px rgba(15, 23, 42, 0.06);
}

.btn-save {
    min-width: 125px;
    background: #018181;
    color: #ffffff;
    border: 1px solid #018181;

    box-shadow:
        0 3px 8px rgba(1, 129, 129, 0.18);
}

.btn-save:hover {
    background: #016f6f;
    border-color: #016f6f;

    box-shadow:
        0 6px 14px rgba(1, 129, 129, 0.25);

    transform: translateY(-1px);
}

.btn-save:active {
    background: #015f5f;
    transform: translateY(0);

    box-shadow:
        0 2px 6px rgba(1, 129, 129, 0.18);
}


/* ICON */

.actions button i {
    font-size: 13px;
    transition: transform 0.25s ease;
}

.btn-save:hover i {
    transform: translateX(2px);
}

.btn-cancel:hover i {
    transform: translateX(-2px);
}


/* RESPONSIVE */

@media (max-width: 600px) {

    .profile-modal {
        --width: 95%;
        --height: 90vh;
        --overflow: auto;
    }

    .modal-wrapper {
        height: 100%;
        padding: 24px 20px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
    }

    .modal-body {
        grid-template-columns: 1fr;
        gap: 20px;
        overflow: visible;
    }

    .preview-side {
        border-left: none;
        padding-left: 0;
        order: -1;
    }

    .modal-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }

    .last-updated {
        text-align: center;
    }

    .actions {
        width: 100%;
    }

    .actions button {
        flex: 1;
    }
}


@media (max-width: 450px) {

    .modal-wrapper {
        padding: 20px 16px;
    }

    .modal-header h2 {
        font-size: 1.25rem;
    }

    .modal-body {
        gap: 18px;
    }

    .row {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column-reverse;
        gap: 8px;
    }

    .actions button {
        width: 100%;
        flex: none;
    }
}

.admin-layout :deep(ion-content::part(scroll)) {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.admin-layout :deep(ion-content::part(scroll)::-webkit-scrollbar) {
    display: none;
    width: 0;
    height: 0;
}
</style>
