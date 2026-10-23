<template>
    <ion-page>
        <ion-content class="page-bg">
            <div class="container">
                <div class="topbar">
                    <div class="nav-left">
                        <ion-menu-button menu="main-menu" class="hamburger-mobile">
                            <i class="bx bx-menu"></i>
                        </ion-menu-button>
                        <router-link to="/analytics" class="header-link">
                            <div class="header-nav">
                                <i class="bx bx-doughnut-chart"></i>
                                <div class="header-title">
                                    <h1>Analytics Overview</h1>
                                    <p>Monitor gym performance, revenue, and membership trends.</p>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>

                <!-- Existing analytics charts -->
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Monthly Revenue</h3>
                        <div class="chart-wrapper">
                            <ChartWrapper type="bar" :data="revenueData" :options="chartOptions" />
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Attendance Analytics</h3>
                        <div class="chart-wrapper">
                            <ChartWrapper type="doughnut" :data="attendanceData" :options="chartOptions" />
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Member Growth</h3>
                        <div class="chart-wrapper">
                            <ChartWrapper type="line" :data="growthData" :options="chartOptions" />
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Membership Distribution</h3>
                        <div class="chart-wrapper">
                            <ChartWrapper type="pie" :data="plansData" :options="chartOptions" />
                        </div>
                    </div>
                </div>

                <!-- Recent Transactions -->
                <section class="transactions-section">
                    <div class="section-heading">
                        <div>
                            <h2>Recent Transactions</h2>
                            <p class="section-subtitle">Pantau pembayaran dan unduh receipt transaksi.</p>
                        </div>
                        <button class="add-transaction-btn" type="button" @click="openNewTransaction">
                            <i class="bx bx-plus"></i> Add transaction
                        </button>
                    </div>

                    <div class="tabs" role="tablist" aria-label="Transaction filter">
                        <button :class="{ active: activeTab === 'all' }" role="tab" :aria-selected="activeTab === 'all'"
                            @click="activeTab = 'all'">
                            All Transactions <span>{{ transactions.length }}</span>
                        </button>
                        <button :class="{ active: activeTab === 'income' }" role="tab"
                            :aria-selected="activeTab === 'income'" @click="activeTab = 'income'">
                            Income
                        </button>
                    </div>

                    <template v-if="activeTab === 'income'">
                        <div class="income-summary-grid">
                            <article class="summary-card total-income-card">
                                <div class="summary-top"><span>Total Income</span><i class="bx bx-trending-up"></i>
                                </div>
                                <strong>{{ formatCurrency(totalIncome) }}</strong>
                                <div class="summary-foot"><span>{{ monthLabel }}</span><span class="growth-pill"><i
                                            class="bx bx-up-arrow-alt"></i> Income tercatat</span></div>
                                <div class="mini-bars" aria-hidden="true"><i v-for="(bar, index) in miniBars"
                                        :key="index" :style="{ height: `${bar}%` }"></i></div>
                            </article>
                            <article class="summary-card">
                                <div class="summary-top"><span>Membership Revenue</span><i class="bx bx-id-card"></i>
                                </div>
                                <strong>{{ formatCurrency(membershipRevenue) }}</strong>
                                <div class="summary-foot"><span>Membership & subscription</span></div>
                            </article>
                            <article class="summary-card">
                                <div class="summary-top"><span>Additional Services</span><i class="bx bx-dumbbell"></i>
                                </div>
                                <strong>{{ formatCurrency(additionalRevenue) }}</strong>
                                <div class="summary-foot"><span>PT session & passes</span></div>
                            </article>
                        </div>
                    </template>

                    <div class="transaction-card">
                        <div class="table-heading">
                            <div>
                                <h3>{{ activeTab === 'income' ? 'Income History' : 'Transaction History' }}</h3>
                                <p>{{ filteredTransactions.length }} transaksi ditemukan</p>
                            </div>
                            <label class="search-box">
                                <i class="bx bx-search"></i>
                                <input v-model="searchQuery" type="search"
                                    placeholder="Search customer or transaction..." />
                            </label>
                        </div>

                        <div class="table-scroll">
                            <table class="transaction-table">
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Date &amp; Time</th>
                                        <th>Membership / Product</th>
                                        <th>Payment Method</th>
                                        <th class="amount-column">{{ activeTab === 'income' ? 'Gross Amount' : 'Total'
                                            }}</th>
                                        <th>Status</th>
                                        <th>Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                                        <td data-label="Customer">
                                            <div class="customer-name">{{ transaction.customer }}</div>
                                            <small class="transaction-id">{{ transaction.id }}</small>
                                        </td>
                                        <td data-label="Date & Time" class="date-cell">
                                            <span>{{ formatDate(transaction.date) }}</span>
                                            <small>{{ formatTime(transaction.date) }}</small>
                                        </td>
                                        <td data-label="Membership / Product">{{ transaction.product }}</td>
                                        <td data-label="Payment Method">
                                            <span class="payment-method">
                                                <i :class="paymentIcon(transaction.payment)"></i>{{ transaction.payment
                                                }}
                                            </span>
                                        </td>
                                        <td data-label="Total" class="amount-cell">{{ formatCurrency(transaction.amount)
                                            }}</td>
                                        <td data-label="Status"><span class="status-pill"><i
                                                    class="bx bxs-check-circle"></i> Success</span>
                                        </td>
                                        <td data-label="Receipt">
                                            <button class="receipt-btn" type="button"
                                                @click="downloadReceipt(transaction)">
                                                <i class="bx bx-download"></i><span>Download</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr v-if="!paginatedTransactions.length">
                                        <td colspan="7" class="empty-state">
                                            <i class="bx bx-receipt"></i>
                                            <strong>No transactions found</strong>
                                            <span>Coba kata kunci pencarian lain.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="pagination">
                            <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
                            <div class="pagination-controls">
                                <button type="button" class="page-arrow" :disabled="currentPage === 1"
                                    @click="goToPage(currentPage - 1)">
                                    <i class="bx bx-chevron-left"></i><span>Previous</span>
                                </button>
                                <button v-for="page in visiblePages" :key="page" type="button" class="page-number"
                                    :class="{ selected: currentPage === page }" @click="goToPage(page)">
                                    {{ page }}
                                </button>
                                <button type="button" class="page-arrow" :disabled="currentPage === totalPages"
                                    @click="goToPage(currentPage + 1)">
                                    <span>Next</span><i class="bx bx-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Add transaction modal -->
                <div v-if="showTransactionModal" class="modal-backdrop" @click.self="showTransactionModal = false">
                    <section class="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                        <div class="modal-heading">
                            <div><span class="eyebrow">FITLAB GYM CENTER</span>
                                <h2 id="modal-title">Add transaction</h2>
                            </div>
                            <button type="button" class="close-modal" aria-label="Close"
                                @click="showTransactionModal = false"><i class="bx bx-x"></i></button>
                        </div>
                        <form class="transaction-form" @submit.prevent="createTransaction">
                            <label>Customer name<input v-model.trim="newTransaction.customer" required
                                    placeholder="Enter customer name" /></label>
                            <label>Membership / Product<input v-model.trim="newTransaction.product" required
                                    placeholder="e.g. Monthly Gold Membership" /></label>
                            <label>Amount (Rp)<input v-model.number="newTransaction.amount" type="number" min="1"
                                    required placeholder="350000" /></label>
                            <label>Payment method
                                <select v-model="newTransaction.payment" required>
                                    <option value="Cash">Cash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="QRIS">QRIS</option>
                                </select>
                            </label>
                            <p class="generated-note"><i class="bx bx-shield-check"></i> Transaction ID dan waktu
                                transaksi dibuat
                                otomatis saat disimpan.</p>
                            <div class="modal-actions">
                                <button type="button" class="cancel-btn"
                                    @click="showTransactionModal = false">Cancel</button>
                                <button type="submit" class="save-btn"><i class="bx bx-check"></i> Save
                                    transaction</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { IonPage, IonContent, IonMenuButton } from '@ionic/vue';
import ChartWrapper from '../../components/ChartWrapper.vue';

type PaymentMethod = 'Cash' | 'Bank Transfer' | 'QRIS';
interface Transaction {
    id: string;
    customer: string;
    product: string;
    payment: PaymentMethod;
    amount: number;
    date: Date;
}

const chartOptions = { responsive: true, maintainAspectRatio: false };
const revenueData = {
    labels: ['Paid', 'Pending'],
    datasets: [{ label: 'Revenue', data: [5000, 1000], backgroundColor: ['#018181', '#dce9e9'], borderRadius: 6 }],
};
const growthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Members', data: [5, 12, 20, 35, 53, 58], borderColor: '#018181', backgroundColor: 'rgba(1,129,129,0.14)', fill: true, tension: 0.4 }],
};
const attendanceData = {
    labels: ['Present', 'Late', 'Absent'],
    datasets: [{ data: [85, 18, 10], backgroundColor: ['#018181', '#f43f5e', '#f59e0b'] }],
};
const plansData = {
    labels: ['Gold', 'Premium', 'Basic'],
    datasets: [{ data: [40, 30, 20], backgroundColor: ['#018181', '#67b8b4', '#dce9e9'] }],
};

function makeTransactionId() {
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `FL-${stamp}-${random}`;
}
function daysAgo(days: number, hour: number, minute: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, minute, 0, 0);
    return date;
}

// Sample records for UI preview. Replace this array with API/database data in production.
const transactions = ref<Transaction[]>([
    { id: makeTransactionId(), customer: 'JEREMY FELIX HERMANTO', product: 'Annual Platinum Membership', payment: 'Bank Transfer', amount: 3500000, date: daysAgo(0, 10, 30) },
    { id: makeTransactionId(), customer: 'FIKRI TAQY PRAWITOHADI', product: 'Monthly Gold Membership', payment: 'QRIS', amount: 450000, date: daysAgo(3, 14, 15) },
    { id: makeTransactionId(), customer: 'REIFAL ARIZALDI', product: '3-Month Pass', payment: 'Cash', amount: 1200000, date: daysAgo(8, 16, 45) },
    { id: makeTransactionId(), customer: 'HAFIZH MUHAMMAD NAUFAL SIDQI', product: 'Personal Trainer Session', payment: 'Bank Transfer', amount: 300000, date: daysAgo(13, 8, 0) },
    { id: makeTransactionId(), customer: 'NADIA PUTRI', product: 'Monthly Basic Membership', payment: 'QRIS', amount: 250000, date: daysAgo(17, 11, 20) },
    { id: makeTransactionId(), customer: 'ADITYA PRATAMA', product: 'Personal Trainer Session', payment: 'Cash', amount: 200000, date: daysAgo(22, 9, 10) },
    { id: makeTransactionId(), customer: 'SALSABILA RAHMA', product: 'Annual Platinum Membership', payment: 'Bank Transfer', amount: 3200000, date: daysAgo(28, 13, 40) },
]);
const activeTab = ref<'all' | 'income'>('all');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 5;
const showTransactionModal = ref(false);
const newTransaction = reactive<{ customer: string; product: string; amount: number | null; payment: PaymentMethod }>({
    customer: '', product: '', amount: null, payment: 'Cash',
});
const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
const miniBars = [34, 47, 40, 62, 54, 78, 68, 92, 74, 100, 84, 96];

const filteredTransactions = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    return transactions.value
        .filter((item) => activeTab.value !== 'income' || item.amount > 0)
        .filter((item) => !query || `${item.customer} ${item.product} ${item.payment} ${item.id}`.toLowerCase().includes(query))
        .slice().sort((a, b) => b.date.getTime() - a.date.getTime());
});
const totalPages = computed(() => Math.max(1, Math.ceil(filteredTransactions.value.length / pageSize)));
const paginatedTransactions = computed(() => filteredTransactions.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));
const visiblePages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
const totalIncome = computed(() => transactions.value.reduce((sum, item) => sum + item.amount, 0));
const membershipRevenue = computed(() => transactions.value.filter((item) => /membership/i.test(item.product)).reduce((sum, item) => sum + item.amount, 0));
const additionalRevenue = computed(() => totalIncome.value - membershipRevenue.value);

watch([searchQuery, activeTab], () => { currentPage.value = 1; });
watch(totalPages, (pages) => { if (currentPage.value > pages) currentPage.value = pages; });

function goToPage(page: number) {
    currentPage.value = Math.min(totalPages.value, Math.max(1, page));
}
function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount).replace(/\u00a0/g, ' ');
}
function formatDate(date: Date) {
    return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
function formatTime(date: Date) {
    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date);
}
function paymentIcon(payment: PaymentMethod) {
    if (payment === 'Cash') return 'bx bx-money';
    if (payment === 'QRIS') return 'bx bx-qr-scan';
    return 'bx bx-transfer-alt';
}
function openNewTransaction() {
    newTransaction.customer = '';
    newTransaction.product = '';
    newTransaction.amount = null;
    newTransaction.payment = 'Cash';
    showTransactionModal.value = true;
}
function createTransaction() {
    if (!newTransaction.customer || !newTransaction.product || !newTransaction.amount || newTransaction.amount <= 0) return;
    transactions.value.unshift({
        id: makeTransactionId(),
        customer: newTransaction.customer.toUpperCase(),
        product: newTransaction.product,
        payment: newTransaction.payment,
        amount: Number(newTransaction.amount),
        date: new Date(),
    });
    activeTab.value = 'all';
    searchQuery.value = '';
    currentPage.value = 1;
    showTransactionModal.value = false;
}
function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] || char);
}
function downloadReceipt(transaction: Transaction) {
    const dateText = `${formatDate(transaction.date)} ${formatTime(transaction.date)}`;
    const receiptWindow = window.open('', '_blank', 'width=520,height=760');
    if (!receiptWindow) {
        window.alert('Popup diblokir browser. Izinkan popup untuk mengunduh receipt.');
        return;
    }
    const customer = escapeHtml(transaction.customer);
    const product = escapeHtml(transaction.product);
    const payment = escapeHtml(transaction.payment);
    const id = escapeHtml(transaction.id);
    const amount = formatCurrency(transaction.amount);
    const logoUrl = `${window.location.origin}/assets/WT.webp`;
    receiptWindow.document.open();
    receiptWindow.document.write(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fitlab Gym Center Receipt - ${id}</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:28px;background:#f3f5f5;color:#17202b;font:14px/1.5 Arial,sans-serif}
.receipt{max-width:390px;margin:0 auto;background:#fff;padding:30px 28px;box-shadow:0 10px 35px #102c2c14;border:1px solid #e6eded}
.brand{text-align:center;border-bottom:1px solid #e2e8e8;padding-bottom:20px;margin-bottom:18px}
.logo{width:82px;height:64px;object-fit:contain;filter:grayscale(1);display:block;margin:0 auto 10px}
h1{font-size:19px;line-height:1.2;margin:0;font-weight:800;letter-spacing:.3px}
.muted{color:#6b7777;font-size:11px;letter-spacing:1.4px;margin-top:5px}
.meta{display:flex;justify-content:space-between;gap:12px;margin:7px 0;color:#465151;font-size:12px}
hr{border:0;border-top:1px dashed #ccd7d7;margin:17px 0}
.customer-label{font-size:11px;color:#778080;text-transform:uppercase;letter-spacing:1px}
.customer{font-weight:700;margin:3px 0 15px;overflow-wrap:anywhere}
.line{display:flex;justify-content:space-between;gap:15px;margin:10px 0}.line span:first-child{color:#667070}
.total{font-size:16px;font-weight:800}.status{text-align:center;margin:23px 0 14px;padding:12px;color:#018181;background:#e8f6f4;border:1px solid #c4e8e3;border-radius:8px;font-size:17px;font-weight:800;letter-spacing:.5px}
.thanks{text-align:center;color:#667070;font-size:11px;margin-top:18px}
.print{display:block;margin:18px auto 0;padding:10px 18px;border:0;border-radius:7px;background:#018181;color:#fff;font-weight:700;cursor:pointer}
@media print{body{padding:0;background:#fff}.receipt{box-shadow:none;border:0;margin:0 auto}.print{display:none}}
</style></head><body><main class="receipt">
<header class="brand"><img class="logo" src="${logoUrl}" alt="Fitlab logo" onerror="this.style.display='none'">
<h1>FITLAB GYM CENTER<br>RECEIPT</h1><div class="muted">PAYMENT CONFIRMATION</div></header>
<div class="meta"><span>Transaction ID</span><strong>${id}</strong></div>
<div class="meta"><span>Date &amp; Time</span><strong>${escapeHtml(dateText)}</strong></div>
<div class="meta"><span>Payment</span><strong>${payment}</strong></div>
<hr><div class="customer-label">Customer</div><div class="customer">${customer}</div>
<div class="line"><span>Product / Service</span><strong style="text-align:right;max-width:58%">${product}</strong></div>
<hr><div class="line total"><span>Total Paid</span><strong>${amount}</strong></div>
<div class="status">PAID</div><div class="thanks">Thank you for training with us!<br>Fitlab Gym Center</div>
<button class="print" onclick="window.print()">Download / Save as PDF</button>
</main><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);
    receiptWindow.document.close();
}
</script>

<style scoped>
.page-bg {
    --background: #f5f7f7;
}

.container {
    max-width: 1480px;
    margin: 0 auto;
    padding: 22px;
}

.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 22px;
}

.nav-left {
    display: flex;
    align-items: center;
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

.header-link {
    text-decoration: none;
    color: inherit;
    display: block;
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #018181;
    cursor: pointer;
    transition: .25s ease;
}

.header-nav>i {
    font-size: 28px;
    transition: transform .25s ease;
}

.header-link:hover .header-nav>i {
    transform: scale(1.08) rotate(-5deg);
}

.header-title h1 {
    margin: 0;
    color: #018181;
    font-size: 1.4rem;
    font-weight: 750;
}

.header-title p {
    margin: 3px 0 0;
    color: #718080;
    font-size: .85rem;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
}

.chart-card {
    background: #fff;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #e4ebeb;
    box-shadow: 0 5px 18px rgba(20, 50, 50, .035);
    min-width: 0;
    transition: transform .22s ease, box-shadow .22s ease;
}

.chart-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(1, 129, 129, .08);
}

.chart-card h3 {
    margin: 0 0 15px;
    font-size: 1rem;
    font-weight: 650;
    color: #213333;
}

.chart-wrapper {
    position: relative;
    width: 100%;
    height: 280px;
}

/* Transactions */
.transactions-section {
    margin-top: 30px;
    animation: rise-in .45s ease both;
}

.section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.section-heading h2 {
    margin: 0;
    color: #173131;
    font-size: 1.35rem;
    font-weight: 750;
}

.section-subtitle {
    margin: 5px 0 0;
    color: #7b8989;
    font-size: .84rem;
}

.add-transaction-btn,
.save-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid #018181;
    background: #018181;
    color: white;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: .84rem;
    font-weight: 650;
    cursor: pointer;
    transition: .2s ease;
}

.add-transaction-btn:hover,
.save-btn:hover {
    background: #006e6e;
    border-color: #006e6e;
    box-shadow: 0 5px 14px #01818130;
    transform: translateY(-1px);
}

.tabs {
    display: flex;
    align-items: center;
    gap: 28px;
    border-bottom: 1px solid #dfe8e8;
    margin-bottom: 18px;
}

.tabs button {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 0;
    background: transparent;
    padding: 12px 10px 14px;
    color: #637474;
    font-size: .91rem;
    cursor: pointer;
    transition: color .2s ease;
}

.tabs button::after {
    content: "";
    position: absolute;
    height: 3px;
    bottom: -1px;
    left: 8px;
    right: 8px;
    border-radius: 4px 4px 0 0;
    background: transparent;
    transition: background .2s ease;
}

.tabs button:hover,
.tabs button.active {
    color: #018181;
}

.tabs button.active {
    font-weight: 700;
}

.tabs button.active::after {
    background: #018181;
}

.tabs button span {
    background: #e8f5f4;
    color: #018181;
    padding: 2px 7px;
    border-radius: 20px;
    font-size: .72rem;
}

.income-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 15px;
    margin-bottom: 16px;
}

.summary-card {
    position: relative;
    overflow: hidden;
    background: #fff;
    padding: 20px;
    border-radius: 16px;
    border: 1px solid #e5eded;
    box-shadow: 0 4px 16px #163c3c08;
    min-width: 0;
    transition: transform .2s ease, border-color .2s ease;
}

.summary-card:hover {
    transform: translateY(-3px);
    border-color: #b9dddd;
}

.summary-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    color: #4d6060;
    font-size: .84rem;
    font-weight: 650;
}

.summary-top i {
    color: #018181;
    font-size: 1.35rem;
}

.summary-card>strong {
    display: block;
    margin: 10px 0 8px;
    color: #163131;
    font-size: clamp(1.3rem, 2vw, 1.85rem);
    font-weight: 800;
    letter-spacing: -.7px;
    overflow-wrap: anywhere;
}

.summary-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: #7b8989;
    font-size: .76rem;
}

.growth-pill {
    color: #018181;
    font-weight: 700;
}

.mini-bars {
    position: absolute;
    right: 18px;
    top: 48px;
    height: 45px;
    display: flex;
    align-items: end;
    gap: 3px;
    opacity: .14;
    pointer-events: none;
}

.mini-bars i {
    display: block;
    width: 5px;
    border-radius: 4px 4px 0 0;
    background: #018181;
}

.transaction-card {
    background: #fff;
    border: 1px solid #e5eded;
    border-radius: 18px;
    box-shadow: 0 5px 20px rgba(20, 50, 50, .035);
    overflow: hidden;
}

.table-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 20px 22px 15px;
}

.table-heading h3 {
    margin: 0;
    font-size: 1rem;
    color: #203636;
}

.table-heading p {
    margin: 5px 0 0;
    color: #879393;
    font-size: .78rem;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 240px;
    padding: 9px 12px;
    border: 1px solid #dce7e7;
    border-radius: 9px;
    color: #7b8a8a;
    transition: border-color .2s, box-shadow .2s;
}

.search-box:focus-within {
    border-color: #018181;
    box-shadow: 0 0 0 3px #01818116;
}

.search-box input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #203636;
    font-size: .8rem;
}

.table-scroll {
    width: 100%;
    overflow-x: auto;
}

.transaction-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}

.transaction-table th {
    padding: 12px 14px;
    background: #f8fbfb;
    border-top: 1px solid #edf1f1;
    border-bottom: 1px solid #e7eeee;
    color: #617171;
    font-size: .75rem;
    font-weight: 700;
    white-space: nowrap;
}

.transaction-table th:first-child,
.transaction-table td:first-child {
    padding-left: 22px;
}

.transaction-table th:last-child,
.transaction-table td:last-child {
    padding-right: 22px;
}

.transaction-table td {
    padding: 14px;
    border-bottom: 1px solid #edf1f1;
    color: #334242;
    font-size: .81rem;
    vertical-align: middle;
}

.transaction-table tbody tr {
    transition: background .18s ease;
}

.transaction-table tbody tr:hover {
    background: #f8fcfb;
}

.transaction-table tbody tr:last-child td {
    border-bottom: 0;
}

.customer-name {
    max-width: 210px;
    color: #263838;
    font-weight: 650;
    line-height: 1.35;
}

.transaction-id {
    display: block;
    margin-top: 4px;
    color: #9aa5a5;
    font-size: .68rem;
    letter-spacing: .15px;
}

.date-cell span,
.date-cell small {
    display: block;
    white-space: nowrap;
}

.date-cell small {
    margin-top: 4px;
    color: #899595;
    font-size: .74rem;
}

.payment-method {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
}

.payment-method i {
    color: #018181;
    font-size: 1rem;
}

.amount-column,
.amount-cell {
    text-align: right;
    white-space: nowrap;
}

.amount-cell {
    color: #018181 !important;
    font-weight: 750;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    white-space: nowrap;
    border-radius: 6px;
    padding: 5px 8px;
    color: #087b51;
    background: #dff6eb;
    font-size: .72rem;
    font-weight: 650;
}

.receipt-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    border: 1px solid #018181;
    border-radius: 22px;
    background: white;
    color: #018181;
    padding: 7px 12px;
    font-size: .75rem;
    font-weight: 650;
    cursor: pointer;
    transition: color .2s, background .2s, transform .2s;
}

.receipt-btn:hover {
    background: #018181;
    color: white;
    transform: translateY(-1px);
}

.empty-state {
    height: 160px;
    text-align: center !important;
    color: #8a9999 !important;
}

.empty-state i,
.empty-state strong,
.empty-state span {
    display: block;
    margin: 5px auto;
}

.empty-state i {
    font-size: 1.8rem;
    color: #018181;
}

.empty-state strong {
    color: #344747;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 16px 22px;
    border-top: 1px solid #edf1f1;
}

.pagination-info {
    color: #849191;
    font-size: .76rem;
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 5px;
}

.page-arrow,
.page-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    color: #607272;
    font-size: .78rem;
    cursor: pointer;
    transition: .18s ease;
}

.page-arrow:hover:not(:disabled),
.page-number:hover {
    color: #018181;
    background: #eaf7f6;
}

.page-number.selected {
    color: white;
    background: #018181;
    box-shadow: 0 4px 9px #01818130;
}

.page-arrow:disabled {
    opacity: .35;
    cursor: not-allowed;
}

.modal-backdrop {
    position: fixed;
    z-index: 1000;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(12, 31, 31, .48);
    backdrop-filter: blur(5px);
    animation: fade-in .18s ease;
}

.transaction-modal {
    width: min(100%, 510px);
    max-height: calc(100vh - 36px);
    overflow-y: auto;
    background: #fff;
    border: 1px solid #e1ebeb;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 25px 80px #102c2c30;
    animation: modal-in .22s ease;
}

.modal-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 22px;
}

.eyebrow {
    color: #018181;
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

.modal-heading h2 {
    margin: 5px 0 0;
    color: #1d3535;
    font-size: 1.35rem;
}

.close-modal {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 9px;
    background: #f0f6f6;
    color: #587070;
    font-size: 1.35rem;
    cursor: pointer;
}

.close-modal:hover {
    background: #e2f3f1;
    color: #018181;
}

.transaction-form {
    display: grid;
    gap: 15px;
}

.transaction-form label {
    display: grid;
    gap: 7px;
    color: #425555;
    font-size: .8rem;
    font-weight: 650;
}

.transaction-form input,
.transaction-form select {
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    outline: none;
    border: 1px solid #dce7e7;
    border-radius: 9px;
    background: white;
    color: #253b3b;
    font: inherit;
    font-weight: 400;
    transition: border-color .2s, box-shadow .2s;
}

.transaction-form input:focus,
.transaction-form select:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px #01818116;
}

.generated-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    padding: 11px;
    border-radius: 9px;
    background: #eff9f7;
    color: #487171;
    font-size: .76rem;
    line-height: 1.5;
}

.generated-note i {
    color: #018181;
    font-size: 1rem;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 5px;
}

.cancel-btn {
    padding: 10px 14px;
    border: 1px solid #dce7e7;
    border-radius: 9px;
    background: #fff;
    color: #5f7070;
    font-weight: 650;
    cursor: pointer;
}

.cancel-btn:hover {
    background: #f6f9f9;
}

@keyframes rise-in {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes modal-in {
    from {
        opacity: 0;
        transform: translateY(8px) scale(.985);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}

@media (max-width: 991px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }

    .chart-card {
        min-height: 350px;
    }

    .chart-wrapper {
        height: 280px;
    }

    .hamburger-mobile {
        display: flex !important;
    }

    .transaction-table {
        min-width: 1050px;
    }
}

@media (max-width: 650px) {
    .container {
        padding: 15px;
    }

    .topbar {
        margin-bottom: 16px;
    }

    .header-nav {
        gap: 8px;
    }

    .header-nav>i {
        font-size: 24px;
    }

    .header-title h1 {
        font-size: 1.1rem;
    }

    .header-title p {
        font-size: .74rem;
        line-height: 1.35;
    }

    .charts-grid {
        gap: 14px;
    }

    .chart-card {
        padding: 16px;
        min-height: 300px;
        border-radius: 14px;
    }

    .chart-wrapper {
        height: 240px;
    }

    .section-heading {
        align-items: flex-start;
        flex-direction: column;
    }

    .add-transaction-btn {
        width: 100%;
    }

    .income-summary-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .summary-card {
        padding: 17px;
    }

    .summary-card>strong {
        font-size: 1.55rem;
    }

    .table-heading {
        align-items: stretch;
        flex-direction: column;
        padding: 17px 16px 13px;
    }

    .search-box {
        min-width: 0;
        width: 100%;
    }

    .pagination {
        align-items: flex-start;
        flex-direction: column;
        padding: 14px 16px;
    }

    .pagination-controls {
        width: 100%;
        justify-content: space-between;
        gap: 2px;
    }

    .page-arrow,
    .page-number {
        min-width: 30px;
        height: 32px;
        padding: 0 5px;
    }

    .transaction-modal {
        padding: 20px;
    }
}

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .01ms !important;
    }
}
</style>
