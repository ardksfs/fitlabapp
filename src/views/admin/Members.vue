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
                            <i class="bx bx-group"></i>

                            <div class="header-title">
                                <h1>Member Management</h1>
                                <p>Add, manage and monitor all gym members.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add New Member Form -->
                <div class="form-card">
                    <h3>Add New Member</h3>

                    <div class="form-grid">
                        <input type="text" placeholder="Full Name" v-model="newMember.name" />

                        <input type="number" placeholder="Age" v-model="newMember.age" />

                        <select v-model="newMember.gender">
                            <option>Male</option>
                            <option>Female</option>
                        </select>

                        <input type="tel" placeholder="Phone Number" v-model="newMember.phone" />

                        <input type="email" placeholder="Email Address" v-model="newMember.email" />

                        <input type="text" placeholder="Address" v-model="newMember.address" />

                        <input type="number" placeholder="Height (cm)" v-model="newMember.height" />

                        <input type="number" placeholder="Weight (kg)" v-model="newMember.weight" />

                        <select v-model="newMember.goal">
                            <option>Weight Loss</option>
                            <option>Muscle Gain</option>
                        </select>

                        <select v-model="newMember.plan">
                            <option>Basic</option>
                            <option>Gold</option>
                            <option>Premium</option>
                        </select>

                        <input type="date" v-model="newMember.joinDate" />

                        <input type="date" v-model="newMember.expiry" />

                        <textarea placeholder="Medical Notes" class="full-width"
                            v-model="newMember.medicalNotes"></textarea>
                    </div>

                    <button class="btn-add" @click="addMember">
                        <i class="fa-solid fa-plus"></i>
                        Add Member
                    </button>
                </div>

                <!-- Member Database -->
                <div class="table-card">

                    <div class="table-header">
                        <h3>Member Database</h3>

                        <div class="search-wrapper">
                            <i class="fa-solid fa-magnifying-glass search-icon"></i>

                            <input type="text" placeholder="Search Members" class="search-input"
                                v-model="searchQuery" />
                        </div>
                    </div>

                    <!-- Horizontal Scroll -->
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>AGE</th>
                                    <th>GENDER</th>
                                    <th>PHONE</th>
                                    <th>EMAIL</th>
                                    <th>ADDRESS</th>
                                    <th>HEIGHT</th>
                                    <th>WEIGHT</th>
                                    <th>PLAN</th>
                                    <th>GOAL</th>
                                    <th>JOIN DATE</th>
                                    <th>STATUS</th>
                                    <th>EXPIRY</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="member in filteredMembers" :key="member.id">
                                    <td>{{ member.id }}</td>
                                    <td>{{ member.name }}</td>
                                    <td>{{ member.age }}</td>
                                    <td>{{ member.gender }}</td>
                                    <td>{{ member.phone }}</td>
                                    <td>{{ member.email }}</td>
                                    <td>{{ member.address }}</td>
                                    <td>{{ member.height }} cm</td>
                                    <td>{{ member.weight }} kg</td>
                                    <td>{{ member.plan }}</td>
                                    <td>{{ member.goal }}</td>
                                    <td>{{ member.joinDate }}</td>

                                    <td>
                                        <span :class="`status-${member.status.toLowerCase()}`">
                                            {{ member.status }}
                                        </span>
                                    </td>

                                    <td>{{ member.expiry }}</td>

                                    <td class="action-cell">
                                        <button class="btn-edit" @click="openEditModal(member)" title="Edit Member">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </button>

                                        <button class="btn-delete" @click="openDeleteModal(member)"
                                            title="Delete Member">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="filteredMembers.length === 0">
                                    <td colspan="15" class="empty-state">
                                        <i class="fa-solid fa-user-slash"></i>
                                        <span>No members found</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!--DELETE Modal -->
                <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
                    <div class="modal-card delete-modal">

                        <div class="modal-icon delete-icon">
                            <i class="fa-solid fa-trash"></i>
                        </div>

                        <div class="modal-content">
                            <h2>Delete Member?</h2>

                            <p>
                                Are you sure you want to delete
                                <strong>{{ selectedMember?.name }}</strong>?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div class="modal-actions">
                            <button class="btn-modal-cancel" @click="closeDeleteModal">
                                Cancel
                            </button>

                            <button class="btn-modal-delete" @click="deleteMember">
                                <i class="fa-solid fa-trash"></i>
                                Delete Member
                            </button>
                        </div>
                    </div>
                </div>

                <!--EDIT Modal -->
                <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
                    <div class="modal-card edit-modal">

                        <div class="modal-header">
                            <div>
                                <div class="modal-title-row">
                                    <div class="edit-modal-icon">
                                        <i class="fa-solid fa-user-pen"></i>
                                    </div>

                                    <div>
                                        <h2>Edit Member</h2>
                                        <p>Update member information</p>
                                    </div>
                                </div>
                            </div>

                            <button class="modal-close" @click="closeEditModal" aria-label="Close">
                                <i class="bx bx-x"></i>
                            </button>
                        </div>

                        <div class="edit-form">

                            <div class="form-section-title">
                                <i class="fa-solid fa-user"></i>
                                Personal Information
                            </div>

                            <div class="edit-form-grid">

                                <div class="field-group">
                                    <label>Full Name</label>
                                    <input type="text" v-model="editForm.name" />
                                </div>

                                <div class="field-group">
                                    <label>Age</label>
                                    <input type="number" v-model="editForm.age" />
                                </div>

                                <div class="field-group">
                                    <label>Gender</label>
                                    <select v-model="editForm.gender">
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label>Phone Number</label>
                                    <input type="tel" v-model="editForm.phone" />
                                </div>

                                <div class="field-group">
                                    <label>Email Address</label>
                                    <input type="email" v-model="editForm.email" />
                                </div>

                                <div class="field-group">
                                    <label>Address</label>
                                    <input type="text" v-model="editForm.address" />
                                </div>

                            </div>

                            <div class="form-section-title">
                                <i class="fa-solid fa-dumbbell"></i>
                                Fitness Information
                            </div>

                            <div class="edit-form-grid">

                                <div class="field-group">
                                    <label>Height (cm)</label>
                                    <input type="number" v-model="editForm.height" />
                                </div>

                                <div class="field-group">
                                    <label>Weight (kg)</label>
                                    <input type="number" v-model="editForm.weight" />
                                </div>

                                <div class="field-group">
                                    <label>Fitness Goal</label>
                                    <select v-model="editForm.goal">
                                        <option>Weight Loss</option>
                                        <option>Muscle Gain</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label>Membership Plan</label>
                                    <select v-model="editForm.plan">
                                        <option>Basic</option>
                                        <option>Gold</option>
                                        <option>Premium</option>
                                    </select>
                                </div>

                                <div class="field-group">
                                    <label>Join Date</label>
                                    <input type="date" v-model="editForm.joinDate" />
                                </div>

                                <div class="field-group">
                                    <label>Expiry Date</label>
                                    <input type="date" v-model="editForm.expiry" />
                                </div>

                                <div class="field-group">
                                    <label>Status</label>
                                    <select v-model="editForm.status">
                                        <option>Active</option>
                                        <option>Inactive</option>
                                        <option>Expired</option>
                                    </select>
                                </div>

                                <div class="field-group full-edit-width">
                                    <label>Medical Notes</label>
                                    <textarea v-model="editForm.medicalNotes" placeholder="Medical notes"></textarea>
                                </div>

                            </div>
                        </div>

                        <div class="modal-actions edit-actions">
                            <button class="btn-modal-cancel" @click="closeEditModal">
                                Cancel
                            </button>

                            <button class="btn-modal-save" @click="saveEdit">
                                <i class="fa-solid fa-check"></i>
                                Save Changes
                            </button>
                        </div>

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
    computed,
    reactive,
    ref
} from 'vue';

interface Member {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    address: string;
    height: number;
    weight: number;
    goal: string;
    plan: string;
    joinDate: string;
    status: string;
    expiry: string;
    medicalNotes: string;
}

const members = ref<Member[]>([
    {
        id: 'MEM-001',
        name: 'HAFIZH MUHAMMAD NAUFAL SIDQI',
        age: 28,
        gender: 'Male',
        phone: '9876543210',
        email: 'hafiz@example.com',
        address: 'Jakarta',
        height: 175,
        weight: 72,
        goal: 'Muscle Gain',
        plan: 'Gold',
        joinDate: '2026-01-10',
        status: 'Active',
        expiry: '2026-12-30',
        medicalNotes: 'No medical history'
    },
    {
        id: 'MEM-002',
        name: 'REIFAL ARIZALDI',
        age: 25,
        gender: 'Male',
        phone: '9991112233',
        email: 'reifal@example.com',
        address: 'Bandung',
        height: 163,
        weight: 58,
        goal: 'Weight Loss',
        plan: 'Premium',
        joinDate: '2026-02-15',
        status: 'Active',
        expiry: '2026-11-20',
        medicalNotes: 'No medical history'
    },
    {
        id: 'MEM-003',
        name: 'FIKRI TAQY PRAWITOHADI',
        age: 30,
        gender: 'Male',
        phone: '9123456780',
        email: 'fikri@example.com',
        address: 'Bekasi',
        height: 173,
        weight: 50,
        goal: 'Weight Loss',
        plan: 'Premium',
        joinDate: '2026-02-15',
        status: 'Active',
        expiry: '2026-11-20',
        medicalNotes: 'No medical history'
    },
    {
        id: 'MEM-004',
        name: 'JEREMY FELIX HERMANTO',
        age: 25,
        gender: 'Male',
        phone: '9991112233',
        email: 'jeremy@example.com',
        address: 'Bandung',
        height: 183,
        weight: 65,
        goal: 'Weight Loss',
        plan: 'Premium',
        joinDate: '2026-02-15',
        status: 'Active',
        expiry: '2026-11-20',
        medicalNotes: 'No medical history'
    },
]);

/* ADD MEMBER */

const newMember = reactive({
    name: '',
    age: null,
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    height: null,
    weight: null,
    goal: 'Weight Loss',
    plan: 'Basic',
    joinDate: '',
    expiry: '',
    medicalNotes: ''
});

const addMember = () => {
    const nextId = members.value.length + 1001;

    members.value.push({
        id: `MEM-${nextId}`,
        name: newMember.name || 'New Member',
        age: Number(newMember.age),
        gender: newMember.gender,
        phone: newMember.phone,
        email: newMember.email,
        address: newMember.address,
        height: Number(newMember.height),
        weight: Number(newMember.weight),
        goal: newMember.goal,
        plan: newMember.plan,
        joinDate: newMember.joinDate,
        status: 'Active',
        expiry: newMember.expiry,
        medicalNotes: newMember.medicalNotes
    });

    newMember.name = '';
    newMember.age = null;
    newMember.gender = 'Male';
    newMember.phone = '';
    newMember.email = '';
    newMember.address = '';
    newMember.height = null;
    newMember.weight = null;
    newMember.goal = 'Weight Loss';
    newMember.plan = 'Basic';
    newMember.joinDate = '';
    newMember.expiry = '';
    newMember.medicalNotes = '';
};

/* SEARCH */

const searchQuery = ref('');

const filteredMembers = computed(() => {
    const query = searchQuery.value.toLowerCase().trim();

    if (!query) {
        return members.value;
    }

    return members.value.filter((member) =>
        Object.values(member).some((value) =>
            String(value)
                .toLowerCase()
                .includes(query)
        )
    );
});

/* DELETE MODAL */

const showDeleteModal = ref(false);
const selectedMember = ref<Member | null>(null);

const openDeleteModal = (member: Member) => {
    selectedMember.value = member;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedMember.value = null;
};

const deleteMember = () => {
    if (!selectedMember.value) return;

    members.value = members.value.filter(
        (member) =>
            member.id !== selectedMember.value?.id
    );

    closeDeleteModal();
};

/* EDIT MODAL */

const showEditModal = ref(false);

const editForm = reactive<Member>({
    id: '',
    name: '',
    age: 0,
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    height: 0,
    weight: 0,
    goal: 'Weight Loss',
    plan: 'Basic',
    joinDate: '',
    status: 'Active',
    expiry: '',
    medicalNotes: ''
});

const openEditModal = (member: Member) => {
    Object.assign(editForm, member);

    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
};

const saveEdit = () => {
    const index = members.value.findIndex(
        (member) =>
            member.id === editForm.id
    );

    if (index === -1) return;

    members.value[index] = {
        ...editForm,
        age: Number(editForm.age),
        height: Number(editForm.height),
        weight: Number(editForm.weight)
    };

    closeEditModal();
};
</script>

<style scoped>
.page-container {
    padding: 24px;
    background: #f8fafc;
    min-height: 100vh;
    color: #1e293b;
}

.form-card,
.table-card {
    background: #ffffff;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    margin-bottom: 20px;
}

.form-card h3,
.table-card h3 {
    margin: 0;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 700;
}


.form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit,
            minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #0f172a;
    font-family: inherit;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.25s ease,
        box-shadow 0.25s ease;
}

.form-grid input::placeholder,
.form-grid textarea::placeholder {
    color: #94a3b8;
}

.form-grid input:focus,
.form-grid select:focus,
.form-grid textarea:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.08);
}

.full-width {
    grid-column: 1 / -1;
    height: 80px;
    resize: vertical;
}

/* BUTTON */

.btn-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #018181;
    color: #ffffff;
    border: none;
    padding: 12px 25px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    font-weight: 600;
    transition: background 0.25s ease,
        box-shadow 0.25s ease;
}

.btn-add:hover {
    background: #016b6b;
    box-shadow: 0 4px 10px rgba(1, 129, 129, 0.2);
}

.btn-add:active {
    transform: translateY(1px);
}

/* TABLE HEADER */

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.search-wrapper {
    position: relative;
    width: 260px;
    flex-shrink: 0;
}

.search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    font-size: 14px;
    pointer-events: none;
}

.search-input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 12px 0 38px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #0f172a;
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.25s ease,
        box-shadow 0.25s ease;
}

.search-input::placeholder {
    color: #94a3b8;
}

.search-input:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.08);
}

.table-responsive {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 15px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
}

.table-responsive::-webkit-scrollbar {
    height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

table {
    width: 100%;
    min-width: 1450px;
    border-collapse: collapse;
}

th {
    padding: 12px;
    text-align: left;
    background: #f8fafc;
    color: #334155;
    font-size: 0.85rem;
    font-weight: 700;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
}

td {
    padding: 12px;
    text-align: left;
    color: #475569;
    font-size: 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
}

tbody tr {
    transition: background 0.2s ease;
}

tbody tr:hover {
    background: #f8ffff;
}

/* STATUS */

.status-active {
    display: inline-block;
    background: #e6f7f7;
    color: #018181;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}
.status-inactive {
    display: inline-block;
    background: #fff7d6;
    color: #d99a00;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}

.status-expired {
    display: inline-block;
    background: #fee2e2;
    color: #dc2626;
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}


/* ACTION BUTTON */

.action-cell {
    white-space: nowrap;
}

.btn-edit,
.btn-delete {
    width: 34px;
    height: 34px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border: none;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.25s ease,
        transform 0.2s ease;
}

.btn-edit {
    background: #018181;
    margin-right: 5px;
}

.btn-edit:hover {
    background: #016b6b;
}

.btn-delete {
    background: #ef4444;
}

.btn-delete:hover {
    background: #dc2626;
}

.btn-edit:active,
.btn-delete:active {
    transform: scale(0.96);
}

/* EMPTY  */

.empty-state {
    height: 150px;
    text-align: center;
    color: #94a3b8;
}

.empty-state i {
    display: block;
    font-size: 28px;
    margin-bottom: 8px;
}

.empty-state span {
    font-size: 0.9rem;
}

.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 15px;
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

.header-nav {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-nav>i {
    font-size: 24px;
    color: var(--ion-color-teal, #018181);
}

.header-title h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--ion-color-teal, #018181);
}

.header-title p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
    font-style: italic;
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
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
}

.modal-card {
    width: 100%;
    max-width: 450px;

    background: #ffffff;
    border-radius: 18px;

    box-shadow:
        0 20px 50px rgba(15, 23, 42, 0.15),
        0 4px 12px rgba(15, 23, 42, 0.08);

    animation: modalShow 0.2s ease;
}

@keyframes modalShow {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* DELETE MODAL */

.delete-modal {
    padding: 30px;
    text-align: center;
}

.modal-icon {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    border-radius: 50%;
    font-size: 20px;
}

.delete-icon {
    background: #fef2f2;
    color: #ef4444;
}

.modal-content h2 {
    margin: 0 0 8px;
    color: #0f172a;
    font-size: 1.2rem;
    font-weight: 700;
}

.modal-content p {
    margin: 0 auto;
    max-width: 340px;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.6;
}

.modal-content strong {
    color: #334155;
}

/* EDIT MODAL */

.edit-modal {
    max-width: 720px;
    max-height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.edit-modal-icon {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e6f7f7;
    color: #018181;
    border-radius: 10px;
}

.modal-header h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.05rem;
    font-weight: 700;
}

.modal-header p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 0.8rem;
}

.modal-close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #64748b;
    border-radius: 8px;
    cursor: pointer;
    font-size: 24px;
}

.modal-close:hover {
    background: #f1f5f9;
    color: #0f172a;
}

/* EDIT FORM */

.edit-form {
    padding: 22px 24px;
    overflow-y: auto;
}

.form-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding-bottom: 8px;
    color: #334155;
    font-size: 0.85rem;
    font-weight: 700;
    border-bottom: 1px solid #f1f5f9;
}

.form-section-title i {
    color: #018181;
}

.edit-form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 24px;
}

.field-group {
    min-width: 0;
}

.field-group label {
    display: block;
    margin-bottom: 6px;
    color: #475569;
    font-size: 0.8rem;
    font-weight: 600;
}

.field-group input,
.field-group select,
.field-group textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 11px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    color: #0f172a;
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    transition:
        border-color 0.25s ease,
        box-shadow 0.25s ease;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.08);
}

.field-group textarea {
    height: 80px;
    resize: vertical;
}

.full-edit-width {
    grid-column: 1 / -1;
}

/*MODAL ACTIONS*/

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
}

.edit-actions {
    justify-content: flex-end;
    padding: 16px 24px;
    margin-top: 0;
    border-top: 1px solid #e2e8f0;
}

.btn-modal-cancel,
.btn-modal-delete,
.btn-modal-save {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition:
        background 0.25s ease,
        transform 0.2s ease;
}

.btn-modal-cancel {
    background: #f1f5f9;
    color: #475569;
}

.btn-modal-cancel:hover {
    background: #e2e8f0;
}

.btn-modal-delete {
    background: #ef4444;
    color: #ffffff;
}

.btn-modal-delete:hover {
    background: #dc2626;
}

.btn-modal-save {
    background: #018181;
    color: #ffffff;
}

.btn-modal-save:hover {
    background: #016b6b;
}

.btn-modal-cancel:active,
.btn-modal-delete:active,
.btn-modal-save:active {
    transform: scale(0.98);
}

@media (max-width: 768px) {
    .page-container {
        padding: 16px;
    }

    .form-card,
    .table-card {
        padding: 16px;
        border-radius: 14px;
    }

    .header-title h1 {
        font-size: 1.3rem;
    }

    .header-title p {
        font-size: 0.8rem;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .btn-add {
        width: 100%;
    }

    .table-header {
        align-items: stretch;
        flex-direction: column;
        gap: 12px;
    }

    .search-wrapper {
        width: 100%;
    }

    .table-responsive {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
    }
    .table-responsive table {
    min-width: 1450px;
}

    table {
        min-width: 1450px;
    }

    .modal-overlay {
        padding: 16px;
    }

    .edit-modal {
        max-height: calc(100vh - 32px);
    }
}

/* MOBILE */
@media (min-width: 992px) {
    .hamburger-mobile {
        display: none !important;
    }
}

@media (max-width: 991px) {
    .hamburger-mobile {
        display: flex !important;
    }
}
@media (max-width: 480px) {
    .page-container {
        padding: 12px;
    }

    .topbar {
        margin-bottom: 18px;
    }

    .nav-left {
        gap: 10px;
    }

    .hamburger-mobile {
        width: 40px;
        height: 40px;

        min-width: 40px;
        min-height: 40px;

        font-size: 24px;
    }

    .hamburger-mobile i {
        font-size: 24px;
    }

    .header-nav {
        gap: 8px;
    }

    .header-nav>i {
        font-size: 21px;
    }

    .header-title h1 {
        font-size: 1.15rem;
    }

    .header-title p {
        font-size: 0.75rem;
    }

    .form-card,
    .table-card {
        padding: 14px;
    }

    .table-responsive {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    scrollbar-width: auto;
}

    table {
        min-width: 1450px;
    }

    th,
    td {
        padding: 11px 12px;
    }

    /* Delete modal */
    .modal-overlay {
        padding: 14px;
    }

    .delete-modal {
        padding: 24px 18px;
        border-radius: 16px;
    }

    .modal-icon {
        width: 50px;
        height: 50px;
        margin-bottom: 15px;
    }

    .modal-content h2 {
        font-size: 1.1rem;
    }

    .modal-content p {
        font-size: 0.85rem;
    }

    .modal-actions {
        flex-direction: column-reverse;
        gap: 8px;
    }

    .btn-modal-cancel,
    .btn-modal-delete {
        width: 100%;
    }

    /* Edit modal */
    .edit-modal {
        max-height: calc(100vh - 28px);
        border-radius: 15px;
    }

    .modal-header {
        padding: 16px;
    }

    .modal-title-row {
        gap: 10px;
    }

    .edit-modal-icon {
        width: 38px;
        height: 38px;
        font-size: 15px;
    }

    .modal-header h2 {
        font-size: 0.95rem;
    }

    .modal-header p {
        font-size: 0.75rem;
    }

    .modal-close {
        width: 34px;
        height: 34px;
    }

    .edit-form {
        padding: 18px 16px;
    }

    .edit-form-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .full-edit-width {
        grid-column: auto;
    }

    .edit-actions {
        padding: 14px 16px;
        flex-direction: column-reverse;
    }

    .btn-modal-cancel,
    .btn-modal-save {
        width: 100%;
    }
}
</style>