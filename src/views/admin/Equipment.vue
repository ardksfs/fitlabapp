
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
                            <i class="fa-solid fa-toolbox"></i>

                            <div class="header-title">
                                <h1>Equipment Management</h1>
                                <p>Track gym machines and maintenance.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add Equipment Form -->
                <div class="card">
                    <h2>Add Equipment</h2>

                    <div class="form-grid">
                        <input
                            v-model="newEquipment.name"
                            type="text"
                            placeholder="Equipment Name"
                        >

                        <input
                            v-model="newEquipment.brand"
                            type="text"
                            placeholder="Brand"
                        >

                        <input
                            v-model="newEquipment.purchase"
                            type="date"
                        >

                        <select v-model="newEquipment.condition">
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Needs Repair">Needs Repair</option>
                            <option value="Out of Service">
                                Out of Service
                            </option>
                        </select>

                        <input
                            v-model.number="newEquipment.cost"
                            type="number"
                            placeholder="Purchase Cost"
                        >
                    </div>

                    <button
                        class="btn-green"
                        @click="createEquipment"
                    >
                        <i class="fa-solid fa-plus"></i>
                        Add Equipment
                    </button>
                </div>

                <!-- Equipment Inventory -->
                <div class="card">
                    <div class="table-header">
                        <h2>Equipment Inventory</h2>
                    </div>

                    <div class="table-scroll">
                        <table>
                            <thead>
                                <tr>
                                    <th>NAME</th>
                                    <th>BRAND</th>
                                    <th>PURCHASE</th>
                                    <th>MAINTENANCE</th>
                                    <th>CONDITION</th>
                                    <th>COST</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr
                                    v-for="equipment in equipments"
                                    :key="equipment.id"
                                >
                                    <td>{{ equipment.name }}</td>

                                    <td>{{ equipment.brand }}</td>

                                    <td>{{ equipment.purchase }}</td>

                                    <td>
                                        {{ equipment.maintenance }}
                                    </td>

                                    <td>
                                        <span
                                            :class="[
                                                'condition-badge',
                                                getConditionClass(
                                                    equipment.condition
                                                )
                                            ]"
                                        >
                                            {{ equipment.condition }}
                                        </span>
                                    </td>

                                    <td>
                                        {{ formatCurrency(equipment.cost) }}
                                    </td>

                                    <td class="actions">
                                        <button class="btn-edit" @click="openEditModal(equipment)">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>

                                        <button class="btn-delete" @click="openDeleteModal(equipment)">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>

                                <!-- Empty State -->
                                <tr v-if="equipments.length === 0">
                                    <td
                                        colspan="7"
                                        class="empty-state"
                                    >
                                        <i class="fa-regular fa-clipboard"></i>
                                        <p>No Equipment Found</p>
                                        <small>
                                            Add equipment to get started.
                                        </small>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- Edit Modal -->
            <div
                v-if="showEditModal"
                class="modal-overlay"
                @click.self="closeEditModal"
            >
                <div class="modal modal-edit">
                    <div class="modal-header">
                        <div>
                            <h3>Edit Equipment</h3>
                            <p>Update equipment information.</p>
                        </div>

                        <button
                            class="btn-close"
                            @click="closeEditModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="modal-form">
                        <div class="form-group">
                            <label>Equipment Name</label>

                            <input
                                v-model="editEquipment.name"
                                type="text"
                                placeholder="Equipment Name"
                            >
                        </div>

                        <div class="form-group">
                            <label>Brand</label>

                            <input
                                v-model="editEquipment.brand"
                                type="text"
                                placeholder="Brand"
                            >
                        </div>

                        <div class="form-group">
                            <label>Purchase Date</label>

                            <input
                                v-model="editEquipment.purchase"
                                type="date"
                            >
                        </div>

                        <div class="form-group">
                            <label>Maintenance</label>

                            <input
                                v-model="editEquipment.maintenance"
                                type="text"
                                placeholder="Maintenance"
                            >
                        </div>

                        <div class="form-group">
                            <label>Condition</label>

                            <select v-model="editEquipment.condition">
                                <option value="Excellent">
                                    Excellent
                                </option>

                                <option value="Good">
                                    Good
                                </option>

                                <option value="Needs Repair">
                                    Needs Repair
                                </option>

                                <option value="Out of Service">
                                    Out of Service
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Purchase Cost</label>

                            <input
                                v-model.number="editEquipment.cost"
                                type="number"
                                placeholder="Purchase Cost"
                            >
                        </div>

                    </div>

                    <div class="modal-actions">
                        <button
                            class="btn-cancel"
                            @click="closeEditModal"
                        >
                            Cancel
                        </button>

                        <button
                            class="btn-save"
                            @click="saveEditEquipment"
                        >
                            Save Changes
                        </button>
                    </div>

                </div>
            </div>

            <!-- Delete Modal -->
            <div
                v-if="showDeleteModal"
                class="modal-overlay"
                @click.self="closeDeleteModal"
            >
                <div class="modal delete-modal">

                    <div class="modal-icon delete-icon">
                        <i class="fa-solid fa-trash"></i>
                    </div>

                    <h3>Delete Equipment?</h3>

                    <p>
                        Are you sure you want to delete
                        <strong>
                            {{ selectedEquipment?.name }}
                        </strong>?
                        This action cannot be undone.
                    </p>

                    <div class="modal-actions">
                        <button
                            class="btn-cancel"
                            @click="closeDeleteModal"
                        >
                            Cancel
                        </button>

                        <button
                            class="btn-confirm-delete"
                            @click="confirmDelete"
                        >
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

import {
    reactive,
    ref
} from 'vue';


/*INTERFACE*/

interface Equipment {
    id: number;
    name: string;
    brand: string;
    purchase: string;
    maintenance: string;
    condition: string;
    cost: number;
}


const getCurrentDate = (): string => {

    const now = new Date();
    const year = now.getFullYear();
    const month = String(
        now.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
        now.getDate()
    ).padStart(2, '0');
    return `${year}-${month}-${day}`;

};


/*DATA*/

const equipments = ref<Equipment[]>([
    {
        id: 1,
        name: 'Treadmill Pro X1',
        brand: 'Life Fitness',
        purchase: '2026-01-15',
        maintenance: '2026-10-25',
        condition: 'Excellent',
        cost: 15000000
    },

    {
        id: 2,
        name: 'Bench Press',
        brand: 'Technogym',
        purchase: '2025-08-20',
        maintenance: '2026-10-25',
        condition: 'Good',
        cost: 8500000
    }
]);


const newEquipment = reactive({
    name: '',
    brand: '',
    purchase: getCurrentDate(),
    condition: 'Excellent',
    cost: null as number | null
});


const editEquipment = reactive<Equipment>({
    id: 0,
    name: '',
    brand: '',
    purchase: '',
    maintenance: '',
    condition: 'Excellent',
    cost: 0
});


const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedEquipment =
    ref<Equipment | null>(null);


const createEquipment = (): void => {
    if (
        !newEquipment.name.trim() ||
        !newEquipment.brand.trim() ||
        !newEquipment.purchase ||
        !newEquipment.cost
    ) {
        return;
    }


    equipments.value.push({
        id: Date.now(),
        name:
            newEquipment.name.trim(),

        brand:
            newEquipment.brand.trim(),
        purchase:
            newEquipment.purchase,
        maintenance:
            getCurrentDate(),
        condition:
            newEquipment.condition,
        cost:
            Number(newEquipment.cost)
    });


    /* Reset Form */
    newEquipment.name = '';
    newEquipment.brand = '';
    newEquipment.purchase =
        getCurrentDate();
    newEquipment.condition =
        'Excellent';
    newEquipment.cost = null;

};

const openEditModal = (
    equipment: Equipment
): void => {

    editEquipment.id =
        equipment.id;

    editEquipment.name =
        equipment.name;

    editEquipment.brand =
        equipment.brand;

    editEquipment.purchase =
        equipment.purchase;

    editEquipment.maintenance =
        equipment.maintenance;

    editEquipment.condition =
        equipment.condition;

    editEquipment.cost =
        equipment.cost;

    showEditModal.value = true;

};

const closeEditModal = (): void => {
    showEditModal.value = false;

};


/* SAVE EDIT  */

const saveEditEquipment = (): void => {

    if (
        !editEquipment.name.trim() ||
        !editEquipment.brand.trim() ||
        !editEquipment.purchase ||
        !editEquipment.cost
    ) {
        return;
    }


    const index =
        equipments.value.findIndex(
            equipment =>
                equipment.id ===
                editEquipment.id
        );


    if (index !== -1) {

        equipments.value[index] = {

            id:
                editEquipment.id,

            name:
                editEquipment.name.trim(),

            brand:
                editEquipment.brand.trim(),

            purchase:
                editEquipment.purchase,

            maintenance:
                editEquipment.maintenance,

            condition:
                editEquipment.condition,

            cost:
                Number(
                    editEquipment.cost
                )

        };
    }


    closeEditModal();
};


const openDeleteModal = (
    equipment: Equipment
): void => {

    selectedEquipment.value =
        equipment;
    showDeleteModal.value = true;

};



const closeDeleteModal = (): void => {

    selectedEquipment.value =
        null;
    showDeleteModal.value =
        false;

};


const confirmDelete = (): void => {

    if (!selectedEquipment.value) {
        return;
    }

    equipments.value =
        equipments.value.filter(
            equipment =>
                equipment.id !==
                selectedEquipment.value?.id
        );


    closeDeleteModal();

};


const formatCurrency = (
    amount: number
): string => {

    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }
    ).format(amount);

};



const getConditionClass = (
    condition: string
): string => {

    switch (condition) {

        case 'Excellent':
            return 'condition-excellent';

        case 'Good':
            return 'condition-good';

        case 'Needs Repair':
            return 'condition-repair';

        case 'Out of Service':
            return 'condition-out';

        default:
            return '';

    }

};

</script>

<style scoped> 
/*

.page-bg {
    --background: #f8fafc;
}

.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.card {
    background: #ffffff;
    padding: 25px;
    border-radius: 16px;
    margin-bottom: 20px;
    color: #000;
    border: 1px solid #eef2f7;
    box-shadow:
        0 4px 12px
        rgba(0, 0, 0, 0.03);
}


h2 {
    margin: 0 0 20px 0;
    font-size: 1.2rem;
    color: #111827;
}

.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.nav-left {
    display: flex;
    align-items: center;
    width: 100%;
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #018181;
}

.header-nav > i {
    font-size: 24px;
}

.header-title h1 {
    margin: 0;
    color: #018181;
    font-size: 1.4rem;
    font-weight: 700;
}

.header-title p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 0.9rem;
}

.hamburger-mobile {
    color: #018181;
    font-size: 24px;
    --padding-start: 0;
    --padding-end: 10px;
    margin-right: 5px;
}


@media (min-width: 992px) {

    .hamburger-mobile {
        display: none;
    }

}

.form-grid {
    display: grid;
    grid-template-columns:
        repeat(
            auto-fit,
            minmax(200px, 1fr)
        );
    gap: 15px;

}


input,
select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 100%;
    background: #ffffff;
    color: #111827;
    outline: none;
    transition:
        all 0.3s ease;
    font-family: inherit;
    box-sizing: border-box;
}


input:hover,
select:hover {
    border-color: #018181;
}


input:focus,
select:focus {
    border-color: #018181;
    box-shadow:
        0 0 0 3px
        rgba(1, 129, 129, 0.08);
}


.btn-green {
    background: #018181;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    cursor: pointer;
    transition:
        all 0.3s ease;
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: inherit;
    font-weight: 600;
}


.btn-green:hover {
    background: #016b6b;
    transform:
        translateY(-1px);
}


.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}


.table-header h2 {
    margin-bottom: 0;
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
    border-collapse: collapse;
    min-width: 950px;
}


th {
    color: #64748b;
    font-size: 0.75rem;
    text-transform: uppercase;
    padding: 15px;
    border-bottom:
        2px solid #f1f5f9;
    text-align: left;
    white-space: nowrap;
}


td {
    padding: 14px 15px;
    border-bottom:
        1px solid #eee;
    color: #334155;
    white-space: nowrap;
}


tbody tr:last-child td {
    border-bottom: none;
}


tbody tr:hover {
    background: #f8fafc;
}

.condition-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
}


.condition-excellent {
    background: #dcfce7;
    color: #166534;
}


.condition-good {
    background: #e0f2fe;
    color: #0369a1;
}


.condition-repair {
    background: #fef3c7;
    color: #b45309;
}


.condition-out {
    background: #fee2e2;
    color: #b91c1c;
}

.actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-edit,
.btn-delete {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s ease;
}

.btn-edit {
    background: #eff6ff;
    color: #018181;
}

.btn-edit:hover {
    background: #018181;
    color: #fff;
}

.btn-delete {
    background: #fef2f2;
    color: #ef4444;
}

.btn-delete:hover {
    background: #ef4444;
    color: #fff;
}


.empty-state {
    text-align: center;
    padding: 50px;
    color: #94a3b8;
}


.empty-state i {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 10px;
    color: #cbd5e1;
}


.empty-state p {
    margin: 0 0 5px;
    font-weight: 600;
    color: #64748b;
}


.empty-state small {
    color: #94a3b8;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background:
        rgba(15, 23, 42, 0.55);
    backdrop-filter:
        blur(4px);
    -webkit-backdrop-filter:
        blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}


.modal {
    width: 100%;
    max-width: 500px;
    background: #ffffff;
    border-radius: 18px;
    padding: 30px;
    box-shadow:
        0 20px 50px
        rgba(0, 0, 0, 0.2);
    animation:
        modalShow 0.2s ease;
}


@keyframes modalShow {
    from {
        opacity: 0;
        transform:
            translateY(10px)
            scale(0.98);
    }

    to {
        opacity: 1;
        transform:
            translateY(0)
            scale(1);
    }

}


.modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 25px;
}


.modal-header h3 {
    margin: 0;
    color: #111827;
    font-size: 1.25rem;
}


.modal-header p {
    margin: 5px 0 0;
    color: #64748b;
    font-size: 0.85rem;
}


.btn-close {
    width: 34px;
    height: 34px;
    border: none;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        all 0.3s ease;
}


.btn-close:hover {
    background: #e2e8f0;
    color: #111827;
}


.modal-form {
    display: grid;
    grid-template-columns:
        repeat(2, 1fr);
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
}


.form-group label {
    font-size: 0.8rem;
    color: #475569;
    font-weight: 600;
}


.modal-form input,
.modal-form select {
    width: 100%;
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
    padding: 11px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    transition:
        all 0.3s ease;
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
    color: #ffffff;
}


.btn-save:hover {
    background: #016b6b;
}

.delete-modal {
    max-width: 420px;
    text-align: center;
}

.modal-icon {
    width: 52px;
    height: 52px;
    margin:
        0 auto 15px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}


.delete-icon {

    background: #fee2e2;

    color: #ef4444;

}


.delete-modal h3 {

    margin:
        0 0 10px;

    color: #111827;

    font-size: 1.25rem;

}


.delete-modal p {

    margin: 0;

    color: #64748b;

    font-size: 0.9rem;

    line-height: 1.6;

}


.delete-modal p strong {

    color: #111827;

}


.delete-modal .modal-actions {

    justify-content: center;

}


.btn-confirm-delete {

    background: #EF4444;

    color: #ffffff;

}


.btn-confirm-delete:hover {

    background: #DC2626;

}


@media (max-width: 600px) {

    .container {

        padding: 15px;

    }


    .card {

        padding: 18px;

        border-radius: 14px;

    }


    .header-title h1 {

        font-size: 1.15rem;

    }


    .header-title p {

        font-size: 0.78rem;

    }


    .header-nav > i {

        font-size: 20px;

    }


    .form-grid {

        grid-template-columns: 1fr;

    }


    .btn-green {
        width: 100%;
        justify-content: center;
    }


    .table-scroll {
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        touch-action: pan-x;
    }


    table {
        width: 950px;
        min-width: 950px;
    }


    th {
        padding: 13px 12px;
    }


    td {
        padding: 12px;
    }


    .modal {
        max-width: 100%;
        padding: 25px 20px;
    }


    .modal-form {
        grid-template-columns: 1fr;
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

</style> */