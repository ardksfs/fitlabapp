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
                            <i class="fa-solid fa-user-tie"></i>

                            <div class="header-title">
                                <h1>Trainer Management</h1>
                                <p>Manage gym trainers and performance.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Add Trainer Form -->
                <div class="card">
                    <h2>Add Trainer</h2>
                    <p class="subtitle">
                        Add and manage gym trainers and their performance.
                    </p>

                    <form @submit.prevent="createTrainer">

                        <div class="form-grid">
                            <input
                                v-model="newTrainer.name"
                                type="text"
                                placeholder="Trainer Name"
                                required
                            />

                            <input
                                v-model="newTrainer.email"
                                type="email"
                                placeholder="Email"
                                required
                            />

                            <input
                                v-model="newTrainer.phone"
                                type="tel"
                                placeholder="Phone"
                                required
                            />

                            <input
                                v-model="newTrainer.spec"
                                type="text"
                                placeholder="Specialization"
                                required
                            />

                            <input
                                v-model="newTrainer.exp"
                                type="text"
                                placeholder="Experience"
                                required
                            />

                            <input
                                v-model.number="newTrainer.salary"
                                type="number"
                                placeholder="Salary"
                                min="0"
                                required
                            />

                            <select
                                v-model="newTrainer.status"
                                required
                            >
                                <option value="" disabled>
                                    Status
                                </option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <input
                                v-model.number="newTrainer.rating"
                                type="number"
                                placeholder="Rating"
                                min="0"
                                max="100"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            class="btn-green"
                        >
                            Add Trainer
                        </button>
                    </form>
                </div>

                <!-- Trainer List -->
                <div class="card">
                    <div class="table-header">
                        <h2>Trainer List</h2>
                    </div>

                    <div class="table-scroll">
                        <table>

                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>SPECIALIZATION</th>
                                    <th>EXPERIENCE</th>
                                    <th>SALARY</th>
                                    <th>STATUS</th>
                                    <th>RATING</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr v-if="trainers.length === 0">
                                    <td colspan="7" class="empty-state">
                                        <i class="fa-regular fa-clipboard"></i>
                                        <p>No Trainers</p>
                                    </td>
                                </tr>

                                <tr
                                    v-for="trainer in trainers"
                                    :key="trainer.id"
                                >

                                    <td class="trainer-name">
                                        {{ trainer.name }}
                                    </td>

                                    <td>
                                        {{ trainer.spec }}
                                    </td>

                                    <td>
                                        {{ trainer.exp }}
                                    </td>

                                    <td>
                                        Rp {{ trainer.salary.toLocaleString('id-ID') }}
                                    </td>

                                    <td>
                                        <span
                                            :class="
                                                trainer.status === 'Active'
                                                    ? 'badge-active'
                                                    : 'badge-inactive'
                                            "
                                        >
                                            {{ trainer.status }}
                                        </span>
                                    </td>

                                    <td>
                                        {{ trainer.rating }}
                                    </td>

                                    <td class="actions">

                                        <button
                                            class="btn-edit"
                                            type="button"
                                            @click="openEditModal(trainer)"
                                        >
                                            <i class="fa-solid fa-pen"></i>
                                        </button>

                                        <button
                                            class="btn-delete"
                                            type="button"
                                            @click="openDeleteModal(trainer)"
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                        </button>

                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>

            <!-- EDIT MODAL -->
            <div
                v-if="showEditModal"
                class="modal-overlay"
                @click.self="closeEditModal"
            >

                <div class="modal-card">
                    <div class="modal-header">
                        <div>
                            <h2>Edit Trainer</h2>
                            <p>Update trainer information.</p>
                        </div>

                        <button
                            type="button"
                            class="modal-close"
                            @click="closeEditModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                    </div>
                    <form @submit.prevent="saveEditTrainer">
                        <div class="modal-form">
                            <div class="form-group">
                                <label>Trainer Name</label>

                                <input
                                    v-model="editForm.name"
                                    type="text"
                                    placeholder="Trainer Name"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Email</label>

                                <input
                                    v-model="editForm.email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Phone</label>

                                <input
                                    v-model="editForm.phone"
                                    type="tel"
                                    placeholder="Phone"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Specialization</label>

                                <input
                                    v-model="editForm.spec"
                                    type="text"
                                    placeholder="Specialization"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Experience</label>

                                <input
                                    v-model="editForm.exp"
                                    type="text"
                                    placeholder="Experience"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Salary</label>

                                <input
                                    v-model.number="editForm.salary"
                                    type="number"
                                    placeholder="Salary"
                                    min="0"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Status</label>

                                <select
                                    v-model="editForm.status"
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Rating</label>

                                <input
                                    v-model.number="editForm.rating"
                                    type="number"
                                    placeholder="Rating"
                                    min="0"
                                    max="100"
                                    required
                                />
                            </div>

                        </div>

                        <div class="modal-actions">

                            <button
                                type="button"
                                class="btn-cancel"
                                @click="closeEditModal"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="btn-save"
                            >
                                <i class="fa-solid fa-check"></i>
                                Save Changes
                            </button>

                        </div>

                    </form>
                </div>
            </div>

            <!-- DELETE MODAL -->
            <div
                v-if="showDeleteModal"
                class="modal-overlay"
                @click.self="closeDeleteModal"
            >

                <div class="delete-modal">

                    <div class="delete-icon">
                        <i class="fa-solid fa-trash"></i>
                    </div>

                    <h2>Delete Trainer?</h2>

                    <p>
                        Are you sure you want to delete
                        <strong>{{ selectedTrainer?.name }}</strong>?
                        This action cannot be undone.
                    </p>

                    <div class="modal-actions">

                        <button
                            type="button"
                            class="btn-cancel"
                            @click="closeDeleteModal"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            class="btn-confirm-delete"
                            @click="confirmDelete"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Delete
                        </button>

                    </div>
                </div>
            </div>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import {
    IonPage,
    IonContent,
    IonMenuButton
} from '@ionic/vue';

import { reactive, ref } from 'vue';

interface Trainer {
    id: number;
    name: string;
    email: string;
    phone: string;
    spec: string;
    exp: string;
    salary: number;
    status: string;
    rating: number;
}

/* DATA */

const trainers = ref<Trainer[]>([
    {
        id: 1,
        name: 'Om Owy',
        email: 'owymanaj@example.com',
        phone: '081234567890',
        spec: 'Strength',
        exp: '5 Years',
        salary: 4500000,
        status: 'Active',
        rating: 95
    },
    {
        id: 2,
        name: 'Om Owo',
        email: 'owomanaj@example.com',
        phone: '081234567891',
        spec: 'Cardio',
        exp: '4 Years',
        salary: 4200000,
        status: 'Active',
        rating: 92
    }
]);

/* CREATE FORM */

const newTrainer = reactive<{
    name: string;
    email: string;
    phone: string;
    spec: string;
    exp: string;
    salary: number | null;
    status: string;
    rating: number | null;
}>({
    name: '',
    email: '',
    phone: '',
    spec: '',
    exp: '',
    salary: null,
    status: '',
    rating: null
});

/* EDIT MODAL */

const showEditModal = ref(false);

const editForm = reactive<{
    id: number | null;
    name: string;
    email: string;
    phone: string;
    spec: string;
    exp: string;
    salary: number | null;
    status: string;
    rating: number | null;
}>({
    id: null,
    name: '',
    email: '',
    phone: '',
    spec: '',
    exp: '',
    salary: null,
    status: '',
    rating: null
});


const showDeleteModal = ref(false);

const selectedTrainer = ref<Trainer | null>(null);

/* ADD TRAINER */

const createTrainer = () => {

    const newId =
        trainers.value.length > 0
            ? Math.max(
                ...trainers.value.map(trainer => trainer.id)
            ) + 1
            : 1;

    trainers.value.push({
        id: newId,
        name: newTrainer.name,
        email: newTrainer.email,
        phone: newTrainer.phone,
        spec: newTrainer.spec,
        exp: newTrainer.exp,
        salary: Number(newTrainer.salary),
        status: newTrainer.status,
        rating: Number(newTrainer.rating)
    });

    newTrainer.name = '';
    newTrainer.email = '';
    newTrainer.phone = '';
    newTrainer.spec = '';
    newTrainer.exp = '';
    newTrainer.salary = null;
    newTrainer.status = '';
    newTrainer.rating = null;
};

/* OPEN EDIT MODAL */

const openEditModal = (trainer: Trainer) => {

    editForm.id = trainer.id;
    editForm.name = trainer.name;
    editForm.email = trainer.email;
    editForm.phone = trainer.phone;
    editForm.spec = trainer.spec;
    editForm.exp = trainer.exp;
    editForm.salary = trainer.salary;
    editForm.status = trainer.status;
    editForm.rating = trainer.rating;

    showEditModal.value = true;
};

/* SAVE EDIT */

const saveEditTrainer = () => {

    if (editForm.id === null) {
        return;
    }

    const index = trainers.value.findIndex(
        trainer => trainer.id === editForm.id
    );

    if (index === -1) {
        return;
    }

    trainers.value[index] = {
        id: editForm.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        spec: editForm.spec,
        exp: editForm.exp,
        salary: Number(editForm.salary),
        status: editForm.status,
        rating: Number(editForm.rating)
    };

    closeEditModal();
};

/* CLOSE EDIT MODAL */

const closeEditModal = () => {

    showEditModal.value = false;

    editForm.id = null;
    editForm.name = '';
    editForm.email = '';
    editForm.phone = '';
    editForm.spec = '';
    editForm.exp = '';
    editForm.salary = null;
    editForm.status = '';
    editForm.rating = null;
};

/* OPEN DELETE MODAL */

const openDeleteModal = (trainer: Trainer) => {

    selectedTrainer.value = trainer;
    showDeleteModal.value = true;
};

/* CONFIRM DELETE */

const confirmDelete = () => {

    if (!selectedTrainer.value) {
        return;
    }

    trainers.value =
        trainers.value.filter(
            trainer => trainer.id !== selectedTrainer.value?.id
        );

    closeDeleteModal();
};

/* CLOSE DELETE MODAL */

const closeDeleteModal = () => {

    showDeleteModal.value = false;
    selectedTrainer.value = null;
};

</script>

<style scoped>

.page-bg {
    --background: #f8fafc;
}

.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100%;
    overflow: visible;
}

.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 12px;
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

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none !important;
    }
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-nav > i {
    font-size: 24px;
    color: #018181;
}

.header-title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #018181;
}

.header-title p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
    font-style: italic;
}


.card {
    background: #fff;
    padding: 25px;
    border-radius: 16px;
    margin-bottom: 20px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.card h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
}

.subtitle {
    margin: 5px 0 20px;
    color: #64748b;
    font-size: 0.85rem;
}

/* FORM */

.form-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fit,
        minmax(200px, 1fr)
    );
    gap: 15px;
}

input,
select {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
    outline: none;
    box-sizing: border-box;
    transition:
        border-color 0.3s ease,
        box-shadow 0.3s ease;
}

input::placeholder {
    color: #94a3b8;
}

input:hover,
select:hover {
    border-color: #018181;
}

input:focus,
select:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.08);
}

.btn-green {
    margin-top: 20px;
    background: #018181;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 30px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;

    transition: background 0.3s ease;
}

.btn-green:hover {
    background: #016b6b;
}

/* TABLE */

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.table-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 15px;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    scrollbar-width: thin;
    overscroll-behavior-x: contain;
}

table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
}

th {
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 15px;
    border-bottom: 2px solid #f1f5f9;
    text-align: left;
    white-space: nowrap;
}

td {
    padding: 15px;
    color: #475569;
    font-size: 0.85rem;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
}

.trainer-name {
    color: #018181;
    font-weight: 700;
}

.badge-active,
.badge-inactive {
    display: inline-block;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-active {
    background: #e6f7f7;
    color: #018181;
}

.badge-inactive {
    background: #f1f5f9;
    color: #64748b;
}

.actions {
    display: flex;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
}

.btn-edit {
    background: #e6f7f7;
    color: #018181;
}

.btn-edit:hover {
    background: #018181;
    color: #fff;
}

.btn-delete {
    background: #fee2e2;
    color: #ef4444;
}

.btn-delete:hover {
    background: #ef4444;
    color: #fff;
}

.empty-state {
    text-align: center;
    padding: 50px 20px;
    color: #94a3b8;
}

.empty-state i {
    display: block;
    margin-bottom: 10px;
    font-size: 2rem;
}

.empty-state p {
    margin: 0;
    font-size: 0.9rem;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(3px);
    overflow-y: auto;
}

.modal-card,
.delete-modal {
    width: 100%;
    max-width: 620px;
    background: #fff;
    border-radius: 16px;
    box-shadow:
        0 20px 50px rgba(15, 23, 42, 0.18);
    animation: modalShow 0.2s ease;
}

.modal-card {
    padding: 25px;
}

.delete-modal {
    max-width: 430px;
    padding: 30px;
    text-align: center;
}

@keyframes modalShow {

    from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

}

.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 25px;
}

.modal-header h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 700;
}

.modal-header p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 0.8rem;
}

.modal-close {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 8px;
    background: #f1f5f9;
    color: #64748b;
    cursor: pointer;
    transition: 0.2s;
}

.modal-close:hover {
    background: #e2e8f0;
    color: #0f172a;
}

.modal-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.form-group label {
    color: #475569;
    font-size: 0.78rem;
    font-weight: 600;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 25px;
}

.btn-cancel,
.btn-save,
.btn-confirm-delete {
    border: none;
    border-radius: 8px;
    padding: 11px 18px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: 0.2s;
}

.btn-cancel {
    background: #f1f5f9;
    color: #475569;
}

.btn-cancel:hover {
    background: #e2e8f0;
}

.btn-save {
    background: #018181;
    color: #fff;
}

.btn-save:hover {
    background: #016b6b;
}

/* DELETE MODAL */

.delete-icon {
    width: 58px;
    height: 58px;
    margin: 0 auto 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fee2e2;
    color: #ef4444;
    font-size: 22px;
}

.delete-modal h2 {
    margin: 0 0 10px;
    color: #0f172a;
    font-size: 1.15rem;
    font-weight: 700;
}

.delete-modal p {
    margin: 0;
    color: #64748b;
    font-size: 0.85rem;
    line-height: 1.6;
}

.delete-modal strong {
    color: #0f172a;
}

.btn-confirm-delete {
    background: #ef4444;
    color: #fff;
}

.btn-confirm-delete:hover {
    background: #dc2626;
}

/* RESPONSIVE */

@media (max-width: 991px) {

    .container {
        padding: 18px;
    }

    .header-title h1 {
        font-size: 1.35rem;
    }

}

@media (max-width: 600px) {

    .container {
        padding: 15px;
    }

    .header-title h1 {
        font-size: 1.15rem;
    }

    .header-title p {
        font-size: 0.75rem;
    }

    .header-nav > i {
        font-size: 21px;
    }

    .card {
        padding: 18px;
        border-radius: 14px;
    }

    .form-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    input,
    select {
        padding: 11px;
    }

    .btn-green {
        width: 100%;
    }

    .table-scroll {
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;

        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
    }

    table {
        width: 900px;
        min-width: 900px;
    }

    th,
    td {
        padding: 12px;
    }

    /* Edit Modal */
    .modal-overlay {
        align-items: flex-start;
        padding: 15px;
    }

    .modal-card {
        margin-top: 20px;
        padding: 20px;
    }

    .delete-modal {
        margin-top: 20px;
        padding: 25px 20px;
    }

    .modal-form {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .modal-actions {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-save,
    .btn-confirm-delete {
        width: 100%;
    }

}

@media (max-width: 400px) {

    .container {
        padding: 12px;
    }

    .header-title h1 {
        font-size: 1rem;
    }

    .header-title p {
        font-size: 0.7rem;
    }

    .card {
        padding: 15px;
    }

}

</style>