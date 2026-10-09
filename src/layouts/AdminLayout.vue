<template>
    <ion-page>
        <ion-split-pane content-id="main-content" when="lg" class="custom-split-pane">

            <ion-menu
                content-id="main-content"
                menu-id="main-menu"
                side="start"
                type="overlay"
                class="custom-sidebar"
            >
                <ion-content class="sidebar-content">
                    <Sidebar @openProfile="isProfileOpen = true" />
                </ion-content>
            </ion-menu>

            <ion-router-outlet id="main-content"></ion-router-outlet>
        </ion-split-pane>

        <!-- Modal Profile -->
        <ion-modal
            :is-open="isProfileOpen"
            @didDismiss="isProfileOpen = false"
            class="profile-modal">
            <div class="modal-wrapper">

                <!-- Header -->
                <div class="modal-header">
                    <h2>Edit your profile</h2>

                    <button
                        class="close-button"
                        type="button"
                        @click="isProfileOpen = false">
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
                                value="Admin Fitlab"
                            />
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value="admin@admin.com"
                            />
                        </div>

                        <div class="row">

                            <div class="form-group">
                                <label>Timezone</label>
                                <input
                                    type="text"
                                    value="GMT-8"
                                />
                            </div>

                            <div class="form-group">
                                <label>Working hours</label>
                                <input
                                    type="text"
                                    value="10 AM - 6 PM"
                                />
                            </div>

                        </div>

                        <div class="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value="System Administrator"
                            />
                        </div>

                    </div>

                    <!-- Preview -->
                    <div class="preview-side">

                        <p class="preview-label">Preview</p>

                        <div class="avatar-container">

                            <img
                                src="/assets/regi.jpg"
                                class="avatar"
                                alt="Profile"
                            />

                            <input
                                type="file"
                                id="fileInput"
                                style="display: none;"
                            />

                            <label
                                for="fileInput"
                                class="edit-badge"
                            >
                                <i class="fa-solid fa-pencil"></i>
                            </label>

                        </div>

                        <h4>Admin Fitlab</h4>

                        <p class="role">
                            System Administrator
                        </p>

                    </div>

                </div>

                <!-- Footer -->
                <div class="modal-footer">

                    <span class="last-updated">
                        Last updated: {{ currentDate }}
                    </span>

                    <div class="actions">

                        <button
                            type="button"
                            class="btn-cancel"
                            @click="isProfileOpen = false"
                        >
                            <i class="fa-solid fa-xmark"></i>
                            <span>Cancel</span>
                        </button>

                        <button
                            type="button"
                            class="btn-save"
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
import { ref, onMounted } from 'vue';
import {
    IonPage,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonRouterOutlet,
    IonModal
} from '@ionic/vue';

import Sidebar from '../components/Sidebar.vue';

const isProfileOpen = ref(false);
const currentDate = ref('');

const updateDate = () => {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };

    currentDate.value = new Date().toLocaleDateString(
        'en-US',
        options
    );
};

onMounted(() => {
    updateDate();
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


/*MODAL HEADER*/

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


/* ROW*/

.row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

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
    margin: 5px 0 4px;
    font-size: 1.05rem;
    font-weight: 600;
    color: #111827;
}

.preview-side .role {
    color: #888;
    font-size: 0.82rem;
    margin: 0;
}


/*FOOTER*/

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

/* Base button */

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

/*ICON*/

.actions button i {
    font-size: 13px;
    transition:
        transform 0.25s ease;
}

.btn-save:hover i {
    transform: translateX(2px);
}

.btn-cancel:hover i {
    transform: translateX(-2px);
}


/*RESPONSIVE*/

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
</style>