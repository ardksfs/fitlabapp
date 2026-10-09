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
                            <i class="fa-solid fa-users-line"></i>

                            <div class="header-title">
                                <h1>Create Membership Plan</h1>
                                <p>Create and manage gym membership packages.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Create Form Card -->
                <div class="card">

                    <h2>Create Membership Plan</h2>
                    <p class="subtitle">
                        Create and manage gym membership packages.
                    </p>

                    <form @submit.prevent="createPlan">

                        <div class="form-grid">

                            <input
                                v-model="newPlan.name"
                                type="text"
                                placeholder="Plan Name"
                                required
                            />

                            <input
                                v-model.number="newPlan.price"
                                type="number"
                                placeholder="Price"
                                min="0"
                                required
                            />

                            <input
                                v-model.number="newPlan.duration"
                                type="number"
                                placeholder="Duration (Days)"
                                min="1"
                                required
                            />

                            <select v-model="newPlan.trainer" required>
                                <option value="" disabled>
                                    Included Trainer
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <select v-model="newPlan.diet" required>
                                <option value="" disabled>
                                    Included Diet
                                </option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>

                            <input
                                v-model="newPlan.benefits"
                                type="text"
                                placeholder="Brief Info"
                            />

                        </div>

                        <button
                            type="submit"
                            class="btn-green"
                        >
                            Create Plan
                        </button>

                    </form>

                </div>

                <!-- Table Card -->
                <div class="card">

                    <div class="table-header">
                        <h2>Membership Plans</h2>
                    </div>

                    <div class="table-scroll">

                        <table>

                            <thead>
                                <tr>
                                    <th>PLAN</th>
                                    <th>PRICE</th>
                                    <th>DURATION</th>
                                    <th>TRAINER</th>
                                    <th>DIET</th>
                                    <th>BENEFITS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr v-if="membershipPlans.length === 0">
                                    <td colspan="7" class="empty-state">
                                        <i class="fa-regular fa-clipboard"></i>
                                        <p>No Membership Plans</p>
                                    </td>
                                </tr>

                                <tr
                                    v-for="plan in membershipPlans"
                                    :key="plan.id"
                                >

                                    <td class="plan-name">
                                        {{ plan.name }}
                                    </td>

                                    <td>
                                        Rp {{ plan.price.toLocaleString('id-ID') }}
                                    </td>

                                    <td>
                                        {{ plan.duration }} Days
                                    </td>

                                    <td>
                                        <span
                                            :class="
                                                plan.trainer === 'Yes'
                                                    ? 'badge-yes'
                                                    : 'badge-no'
                                            "
                                        >
                                            {{ plan.trainer }}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            :class="
                                                plan.diet === 'Yes'
                                                    ? 'badge-yes'
                                                    : 'badge-no'
                                            "
                                        >
                                            {{ plan.diet }}
                                        </span>
                                    </td>

                                    <td>
                                        {{ plan.benefits || '-' }}
                                    </td>

                                    <td class="actions">

                                        <button
                                            class="btn-edit"
                                            type="button"
                                            @click="openEditModal(plan)"
                                        >
                                            <i class="fa-solid fa-pen"></i>
                                        </button>

                                        <button
                                            class="btn-delete"
                                            type="button"
                                            @click="openDeleteModal(plan)"
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
                            <h2>Edit Membership Plan</h2>
                            <p>Update membership plan information.</p>
                        </div>

                        <button
                            type="button"
                            class="modal-close"
                            @click="closeEditModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <form @submit.prevent="saveEditPlan">
                        <div class="modal-form">

                            <div class="form-group">
                                <label>Plan Name</label>
                                <input
                                    v-model="editForm.name"
                                    type="text"
                                    placeholder="Plan Name"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Price</label>
                                <input
                                    v-model.number="editForm.price"
                                    type="number"
                                    placeholder="Price"
                                    min="0"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Duration</label>
                                <input
                                    v-model.number="editForm.duration"
                                    type="number"
                                    placeholder="Duration (Days)"
                                    min="1"
                                    required
                                />
                            </div>

                            <div class="form-group">
                                <label>Included Trainer</label>

                                <select
                                    v-model="editForm.trainer"
                                    required
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Included Diet</label>

                                <select
                                    v-model="editForm.diet"
                                    required
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Brief Info</label>

                                <input
                                    v-model="editForm.benefits"
                                    type="text"
                                    placeholder="Brief Info"
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

                    <h2>Delete Membership Plan?</h2>

                    <p>
                        Are you sure you want to delete
                        <strong>{{ selectedPlan?.name }}</strong>?
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

interface MembershipPlan {
    id: number;
    name: string;
    price: number;
    duration: number;
    trainer: string;
    diet: string;
    benefits: string;
}

const membershipPlans = ref<MembershipPlan[]>([]);

/*FORM*/

const newPlan = reactive<{
    name: string;
    price: number | null;
    duration: number | null;
    trainer: string;
    diet: string;
    benefits: string;
}>({
    name: '',
    price: null,
    duration: null,
    trainer: '',
    diet: '',
    benefits: ''
});

/*EDIT MODAL*/

const showEditModal = ref(false);

const editForm = reactive<{
    id: number | null;
    name: string;
    price: number | null;
    duration: number | null;
    trainer: string;
    diet: string;
    benefits: string;
}>({
    id: null,
    name: '',
    price: null,
    duration: null,
    trainer: '',
    diet: '',
    benefits: ''
});

/*DELETE MODAL*/

const showDeleteModal = ref(false);
const selectedPlan = ref<MembershipPlan | null>(null);

/*PLAN*/

const createPlan = () => {

    const newId =
        membershipPlans.value.length > 0
            ? Math.max(
                ...membershipPlans.value.map(plan => plan.id)
            ) + 1
            : 1;

    membershipPlans.value.push({
        id: newId,
        name: newPlan.name,
        price: Number(newPlan.price),
        duration: Number(newPlan.duration),
        trainer: newPlan.trainer,
        diet: newPlan.diet,
        benefits: newPlan.benefits
    });

    newPlan.name = '';
    newPlan.price = null;
    newPlan.duration = null;
    newPlan.trainer = '';
    newPlan.diet = '';
    newPlan.benefits = '';
};

/*EDIT MODAL*/

const openEditModal = (plan: MembershipPlan) => {

    editForm.id = plan.id;
    editForm.name = plan.name;
    editForm.price = plan.price;
    editForm.duration = plan.duration;
    editForm.trainer = plan.trainer;
    editForm.diet = plan.diet;
    editForm.benefits = plan.benefits;

    showEditModal.value = true;
};

/*SAVE EDIT*/

const saveEditPlan = () => {

    if (editForm.id === null) {
        return;
    }

    const index = membershipPlans.value.findIndex(
        plan => plan.id === editForm.id
    );

    if (index === -1) {
        return;
    }

    membershipPlans.value[index] = {
        id: editForm.id,
        name: editForm.name,
        price: Number(editForm.price),
        duration: Number(editForm.duration),
        trainer: editForm.trainer,
        diet: editForm.diet,
        benefits: editForm.benefits
    };

    closeEditModal();
};

/* CLOSE */

const closeEditModal = () => {

    showEditModal.value = false;

    editForm.id = null;
    editForm.name = '';
    editForm.price = null;
    editForm.duration = null;
    editForm.trainer = '';
    editForm.diet = '';
    editForm.benefits = '';
};

/* OPEN */

const openDeleteModal = (plan: MembershipPlan) => {

    selectedPlan.value = plan;
    showDeleteModal.value = true;
};

/* CONFIRM DELETE */

const confirmDelete = () => {

    if (!selectedPlan.value) {
        return;
    }

    membershipPlans.value =
        membershipPlans.value.filter(
            plan => plan.id !== selectedPlan.value?.id
        );

    closeDeleteModal();
};

const closeDeleteModal = () => {

    showDeleteModal.value = false;
    selectedPlan.value = null;
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

.plan-name {
    color: #018181;
    font-weight: 700;
}

.badge-yes,
.badge-no {
    display: inline-block;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-yes {
    background: #e6f7f7;
    color: #018181;
}

.badge-no {
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

.form-group input,
.form-group select {
    box-sizing: border-box;
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

    table {
        min-width: 900px;
    }

    th,
    td {
        padding: 12px;
    }

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

.table-scroll table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
}

@media (max-width: 600px) {

    .table-scroll {
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;

        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
    }

    .table-scroll table {
        min-width: 900px;
        width: 900px;
    }

}

</style>