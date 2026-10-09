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
                            <i class="bx bx-wallet-alt"></i>

                            <div class="header-title">
                                <h1>Payments & Billing</h1>
                                <p>Track membership payments and revenue.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Add Payment Form -->
                <div class="card">
                    <h2>Add Payment</h2>

                    <div class="form-grid">

                        <input
                            v-model="newPayment.member"
                            type="text"
                            placeholder="Member Name"
                        >

                        <input
                            v-model.number="newPayment.amount"
                            type="number"
                            placeholder="Amount"
                        >

                        <select v-model="newPayment.method">
                            <option value="Cash">Cash</option>
                            <option value="UPI">Qris</option>
                            <option value="Bank Transfer">
                                Bank Transfer
                            </option>
                        </select>

                        <select v-model="newPayment.status">
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>

                        <!-- Realtime Date -->
                        <input
                            v-model="newPayment.date"
                            type="date"
                            readonly
                        >

                    </div>

                    <button
                        class="btn-green"
                        @click="createPayment"
                    >
                        <i class="fa-solid fa-credit-card"></i>
                        Save Payment
                    </button>
                </div>

                <!-- Payment History -->
                <div class="card">

                    <div class="table-header">
                        <h2>Payment History</h2>
                    </div>

                    <div class="table-scroll">

                        <table>

                            <thead>
                                <tr>
                                    <th>INVOICE</th>
                                    <th>MEMBER</th>
                                    <th>AMOUNT</th>
                                    <th>METHOD</th>
                                    <th>STATUS</th>
                                    <th>DATE</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr
                                    v-for="payment in payments"
                                    :key="payment.id"
                                >

                                    <td>
                                        {{ payment.invoice }}
                                    </td>

                                    <td>
                                        {{ payment.member }}
                                    </td>

                                    <td>
                                        {{ formatCurrency(payment.amount) }}
                                    </td>

                                    <td>
                                        {{ payment.method }}
                                    </td>

                                    <td>

                                        <span
                                            :class="[
                                                'status',
                                                payment.status === 'Paid'
                                                    ? 'status-paid'
                                                    : 'status-pending'
                                            ]"
                                        >
                                            {{ payment.status }}
                                        </span>

                                    </td>

                                    <td>
                                        {{ payment.date }}
                                    </td>

                                    <td>

                                        <button
                                            class="btn-delete"
                                            @click="openDeleteModal(payment)"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                                <tr v-if="payments.length === 0">

                                    <td
                                        colspan="7"
                                        class="empty-state"
                                    >
                                        No payment records found.
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>
                </div>

            </div>

            <!-- Delete Modal -->
            <div
                v-if="showDeleteModal"
                class="modal-overlay"
                @click.self="closeDeleteModal"
            >

                <div class="modal">

                    <div class="modal-icon delete-icon">
                        <i class="fa-solid fa-trash"></i>
                    </div>

                    <h3>Delete Payment?</h3>

                    <p>
                        Are you sure you want to delete payment
                        <strong>
                            {{ selectedPayment?.invoice }}
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
    ref,
    onMounted,
    onUnmounted
} from 'vue';


/*INTERFACE*/

interface Payment {
    id: number;
    invoice: string;
    member: string;
    amount: number;
    method: string;
    status: string;
    date: string;
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


/* PAYMENT DATA */

const payments = ref<Payment[]>([
    {
        id: 1,
        invoice: 'INV-01',
        member: 'Jokohwy',
        amount: 250000,
        method: 'Qris',
        status: 'Paid',
        date: '2026-10-08'
    },

    {
        id: 2,
        invoice: 'INV-02',
        member: 'Gybrian',
        amount: 150000,
        method: 'Cash',
        status: 'Paid',
        date: '2026-10-08'
    }
]);


/* NEW PAYMENT */

const newPayment = reactive({

    member: '',
    amount: null as number | null,
    method: 'Cash',
    status: 'Paid',
    date: getCurrentDate()

});

const showDeleteModal = ref(false);
const selectedPayment = ref<Payment | null>(null);


let dateInterval:
    ReturnType<typeof setInterval> | null = null;


const updateCurrentDate = (): void => {

    newPayment.date = getCurrentDate();

};


onMounted(() => {

    updateCurrentDate();
    dateInterval = setInterval(() => {
        updateCurrentDate();
    }, 1000);

});


onUnmounted(() => {

    if (dateInterval) {
        clearInterval(dateInterval);
    }

});


/* NEXT INVOICE */

const getNextInvoiceNumber = (
    date: string
): string => {

    const todayPayments = payments.value.filter(
        payment => payment.date === date
    );

    const nextNumber =
        todayPayments.length + 1;

    return `INV-${String(nextNumber).padStart(2, '0')}`;

};


/* FORMAT CURRENCY */

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


/*CREATE PAYMENT*/

const createPayment = (): void => {

    if (
        !newPayment.member.trim() ||
        !newPayment.amount ||
        !newPayment.date
    ) {

        return;
    }

    const invoice =
        getNextInvoiceNumber(
            newPayment.date
        );


    payments.value.push({
        id: Date.now(),
        invoice: invoice,
        member:
            newPayment.member.trim(),
        amount:
            Number(newPayment.amount),
        method:
            newPayment.method,
        status:
            newPayment.status,
        date:
            newPayment.date

    });


    newPayment.member = '';
    newPayment.amount = null;
    newPayment.method = 'Cash';
    newPayment.status = 'Paid';
    newPayment.date =
        getCurrentDate();

};


/* DELETE MODAL */

const openDeleteModal = (
    payment: Payment
): void => {

    selectedPayment.value =
        payment;

    showDeleteModal.value =
        true;

};

const closeDeleteModal = (): void => {

    selectedPayment.value =
        null;

    showDeleteModal.value =
        false;

};


const confirmDelete = (): void => {

    if (!selectedPayment.value) {
        return;

    }

    payments.value =
        payments.value.filter(
            payment =>
                payment.id !==
                selectedPayment.value?.id
        );
    closeDeleteModal();

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


.btn-green:active {
    transform:
        translateY(0);
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
    min-width: 850px;
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

.status {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 600;
}


.status-paid {
    background: #dcfce7;
    color: #166534;
}


.status-pending {
    background: #fef3c7;
    color: #b45309;
}

.btn-delete {
    background: #EF4444;
    color: white;
    border: none;
    padding: 7px 13px;
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 600;
    transition:
        all 0.3s ease;
}


.btn-delete:hover {
    background: #DC2626;
    transform:
        translateY(-1px);
}

.empty-state {
    text-align: center;
    padding: 30px 15px;
    color: #94a3b8;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background:
        rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}


.modal {
    width: 100%;
    max-width: 420px;
    background: #ffffff;
    border-radius: 18px;
    padding: 30px;
    text-align: center;
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


.modal h3 {
    margin:
        0 0 10px;
    color: #111827;
    font-size: 1.25rem;
}


.modal p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    line-height: 1.6;
}


.modal p strong {
    color: #111827;
}


.modal-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 25px;
}


.btn-cancel,
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
        width: 850px;
        min-width: 850px;
    }


    th {
        padding: 13px 12px;
    }


    td {
        padding: 12px;
    }


    .modal {
        max-width: 100%;
        padding:
            25px 20px;
    }

}

</style>