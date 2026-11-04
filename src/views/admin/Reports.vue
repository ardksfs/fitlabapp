
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
                            <i class="bx bx-file-report"></i>
                            <div class="header-title">
                                <h1>Reports Center</h1>
                                <p>Generate printable gym reports.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Introduction -->
                <div class="report-intro">
                    <div class="intro-icon">
                        <i class="fa-solid fa-chart-pie"></i>
                    </div>

                    <div class="intro-text">
                        <h2>Gym Reports & Analytics</h2>
                        <p>
                            Select a report category to view detailed
                            information about your gym business.
                        </p>
                    </div>
                </div>

                <!-- Report Buttons -->
                <div class="section-heading">
                    <div>
                        <h3>Available Reports</h3>
                        <p>Select the report you want to generate.</p>
                    </div>
                </div>

                <div class="report-grid">
                    <button
                        v-for="btn in reportButtons"
                        :key="btn.label"
                        type="button"
                        class="btn-report"
                        :class="{
                            'report-selected': selectedReport === btn.label
                        }"
                        :aria-pressed="selectedReport === btn.label"
                        @click="selectReport(btn.label)"
                    >
                        <div class="report-button-icon">
                            <i :class="btn.icon"></i>
                        </div>

                        <div class="report-button-info">
                            <span>{{ btn.label }}</span>
                            <small>{{ btn.description }}</small>
                        </div>

                        <i
                            class="fa-solid fa-chevron-right report-arrow"
                        ></i>
                    </button>
                </div>

                <!-- Generated Report -->
                <div class="card report-area">

                    <div class="report-header">
                        <div class="report-header-icon">
                            <i class="fa-solid fa-file-lines"></i>
                        </div>

                        <div class="report-header-text">
                            <h2>Generated Report</h2>
                            <p>
                                {{ selectedReport
                                    ? selectedReport
                                    : 'No report selected'
                                }}
                            </p>
                        </div>

                        <span
                            v-if="selectedReport"
                            class="selected-badge"
                        >
                            Selected
                        </span>
                    </div>

                    <!-- Empty State -->
                    <div
                        v-if="!selectedReport"
                        class="empty-state"
                    >
                        <div class="empty-icon">
                            <i class="fa-solid fa-folder-open"></i>
                        </div>

                        <h3>Choose a report above</h3>

                        <p>
                            Select one of the available report categories
                            to generate and preview your gym report.
                        </p>
                    </div>

                    <!-- Selected Report -->
                    <div
                        v-else
                        class="selected-report"
                    >
                        <div class="selected-document-icon">
                            <i :class="getSelectedIcon"></i>
                        </div>

                        <div class="selected-report-info">
                            <h3>{{ selectedReport }}</h3>

                            <p>
                                {{ getSelectedDescription }}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="btn-generate"
                            @click="openReportPreview"
                        >
                            <i class="fa-solid fa-file-circle-check"></i>
                            Generate Report
                        </button>
                    </div>
                </div>

            </div>
        </ion-content>

        <!-- ======================================
             REPORT PREVIEW MODAL
        ======================================= -->

        <Teleport to="body">
            <div
                v-if="isPreviewOpen && selectedReportData"
                class="report-overlay"
                @click.self="closeReportPreview"
            >
                <section
                    class="report-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="preview-title"
                >

                    <!-- Modal Header -->
                    <div class="modal-header">
                        <div class="modal-heading">
                            <div class="modal-heading-icon">
                                <i class="fa-solid fa-file-invoice"></i>
                            </div>

                            <div>
                                <h2 id="preview-title">
                                    Report Preview
                                </h2>
                                <p>
                                    Review your report before downloading.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            class="modal-close-btn"
                            aria-label="Close preview"
                            @click="closeReportPreview"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <!-- Report Preview Content -->
                    <div class="report-preview">

                        <div class="report-document">

                            <!-- Document Branding -->
                            <div class="document-brand">
                                <div class="document-logo">
                                    <i class="fa-solid fa-dumbbell"></i>
                                </div>

                                <div class="document-brand-info">
                                    <h2>FITLAB</h2>
                                    <p>GYM MANAGEMENT SYSTEM</p>
                                </div>

                                <div class="document-status">
                                    <span class="document-status-dot"></span>
                                    Report Preview
                                </div>
                            </div>

                            <div class="document-divider"></div>

                            <!-- Report Title -->
                            <div class="document-title">
                                <div>
                                    <h1>
                                        {{ selectedReport }}
                                    </h1>

                                    <p>
                                        {{ selectedReportData.description }}
                                    </p>
                                </div>
                            </div>

                            <!-- Report Metadata -->
                            <div class="document-meta">
                                <div>
                                    <span>Report Category</span>
                                    <strong>{{ selectedReport }}</strong>
                                </div>

                                <div>
                                    <span>Generated Date</span>
                                    <strong>{{ generatedAt }}</strong>
                                </div>
                            </div>

                            <!-- Report Summary -->
                            <div class="summary-grid">
                                <div
                                    v-for="(summary, index) in selectedReportData.summaries"
                                    :key="index"
                                    class="summary-item"
                                >
                                    <span class="summary-label">
                                        {{ summary.label }}
                                    </span>

                                    <strong>
                                        {{ summary.value }}
                                    </strong>
                                </div>
                            </div>

                            <!-- Report Table -->
                            <div class="document-table-section">
                                <h3>
                                    <i class="fa-solid fa-table-list"></i>
                                    Report Details
                                </h3>

                                <div class="table-scroll">
                                    <table class="report-table">
                                        <thead>
                                            <tr>
                                                <th
                                                    v-for="(column, index) in selectedReportData.columns"
                                                    :key="index"
                                                >
                                                    {{ column }}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr
                                                v-for="(row, rowIndex) in selectedReportData.rows"
                                                :key="rowIndex"
                                            >
                                                <td
                                                    v-for="(cell, cellIndex) in row"
                                                    :key="cellIndex"
                                                >
                                                    <span
                                                        v-if="isStatusCell(cell, cellIndex)"
                                                        class="table-status"
                                                        :class="getStatusClass(cell)"
                                                    >
                                                        {{ cell }}
                                                    </span>

                                                    <span v-else>
                                                        {{ cell }}
                                                    </span>
                                                </td>
                                            </tr>

                                            <tr
                                                v-if="selectedReportData.rows.length === 0"
                                            >
                                                <td
                                                    :colspan="selectedReportData.columns.length"
                                                    class="no-data"
                                                >
                                                    No report data available.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Document Note -->
                            <div class="document-note">
                                <i class="fa-solid fa-circle-info"></i>

                                <p>
                                    This report currently uses sample data
                                    for demonstration. Connect the report
                                    to the FitLab database to display actual
                                    gym records.
                                </p>
                            </div>

                            <!-- Document Footer -->
                            <div class="document-footer">
                                <span>FITLAB GYM MANAGEMENT</span>
                                <span>Generated by Admin</span>
                            </div>

                        </div>
                    </div>

                    <!-- Modal Actions -->
                    <div class="modal-actions">
                        <button
                            type="button"
                            class="btn-cancel"
                            @click="closeReportPreview"
                        >
                            Close
                        </button>

                        <div class="action-right">
                            <button
                                type="button"
                                class="btn-download"
                                @click="downloadCsv"
                            >
                                <i class="fa-solid fa-download"></i>
                                Download CSV
                            </button>

                            <button
                                type="button"
                                class="btn-print"
                                @click="printReport"
                            >
                                <i class="fa-solid fa-print"></i>
                                Print / Save PDF
                            </button>
                        </div>
                    </div>

                </section>
            </div>
        </Teleport>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

import {
    IonPage,
    IonContent,
    IonMenuButton
} from '@ionic/vue';

// ==========================================
// REPORT INTERFACES
// ==========================================

interface ReportButton {
    label: string;
    icon: string;
    description: string;
}

interface ReportSummary {
    label: string;
    value: string;
}

interface ReportDefinition {
    description: string;
    columns: string[];
    rows: string[][];
    summaries: ReportSummary[];
}

// ==========================================
// REPORT BUTTONS
// ==========================================

const reportButtons: ReportButton[] = [
    {
        label: 'Members Report',
        icon: 'bx bx-group',
        description: 'Member information and status'
    },
    {
        label: 'Attendance Report',
        icon: 'fa-regular fa-calendar-days',
        description: 'Member attendance records'
    },
    {
        label: 'Revenue Report',
        icon: 'fa-solid fa-rupiah-sign',
        description: 'Gym income overview'
    },
    {
        label: 'Trainer Report',
        icon: 'fa-solid fa-user-tie',
        description: 'Trainer information and activity'
    },
    {
        label: 'Equipment Report',
        icon: 'fa-solid fa-toolbox',
        description: 'Equipment condition and inventory'
    },
    {
        label: 'Payment Report',
        icon: 'bx bx-wallet-alt',
        description: 'Member payment transactions'
    }
];

// ==========================================
// SELECTED REPORT
// ==========================================

const selectedReport = ref<string>('');

const selectReport = (report: string) => {
    selectedReport.value = report;
};

// ==========================================
// SAMPLE REPORT DATA
// ==========================================

// Semua data di bawah ini adalah data dummy.
// Ganti dengan data asli dari Supabase/API nantinya.

const reportDefinitions: Record<string, ReportDefinition> = {

    // MEMBERS REPORT
    'Members Report': {
        description: 'Gym membership overview and member information.',

        columns: [
            'Member ID',
            'Member Name',
            'Membership',
            'Status'
        ],

        rows: [
            [
                'MEM-001',
                'HAFIZH MUHAMMAD NAUFAL SIDQI',
                'Premium',
                'Active'
            ],
            [
                'MEM-002',
                'REIFAL ARIZALDI',
                'Basic',
                'Active'
            ],
            [
                'MEM-003',
                'FIKRI TAQY PRAWITOHADI',
                'Gold',
                'Active'
            ],
            [
                'MEM-004',
                'JEREMY FELIX HERMANTO',
                'Premium',
                'Active'
            ]
        ],

        summaries: [
            { label: 'Total Members', value: '4' },
            { label: 'Active Members', value: '4' },
            { label: 'Inactive Members', value: '0' }
        ]
    },

    // ATTENDANCE REPORT
    'Attendance Report': {
        description: 'Gym member attendance and check-in records.',

        columns: [
            'Attendance ID',
            'Member Name',
            'Date',
            'Check In',
            'Status'
        ],

        rows: [
            ['ATT-001', 'HAFIZH MUHAMMAD', '03 Nov 2026', '08:00 AM', 'Present'],
            ['ATT-002', 'REIFAL ARIZALDI', '03 Nov 2026', '09:00 AM', 'Present'],
            ['ATT-003', 'FIKRI TAQY', '03 Nov 2026', '09:30 AM', 'Late'],
            ['ATT-004', 'JEREMY FELIX', '03 Nov 2026', '-', 'Absent']
        ],

        summaries: [
            { label: 'Total Attendance', value: '4' },
            { label: 'Present', value: '2' },
            { label: 'Absent', value: '1' }
        ]
    },

    // REVENUE REPORT
    'Revenue Report': {
        description: 'Gym revenue and income summary.',

        columns: [
            'Transaction ID',
            'Description',
            'Date',
            'Amount'
        ],

        rows: [
            ['REV-001', 'Premium Membership', '02 Nov 2026', 'Rp 500.000'],
            ['REV-002', 'Basic Membership', '02 Nov 2026', 'Rp 250.000'],
            ['REV-003', 'Gold Membership', '03 Nov 2026', 'Rp 750.000'],
            ['REV-004', 'Personal Training', '03 Nov 2026', 'Rp 950.000']
        ],

        summaries: [
            { label: 'Total Revenue', value: 'Rp 2.450.000' },
            { label: 'Transactions', value: '4' },
            { label: 'Period', value: 'November 2026' }
        ]
    },

    // TRAINER REPORT
    'Trainer Report': {
        description: 'Trainer information and employment status.',

        columns: [
            'Trainer ID',
            'Trainer Name',
            'Specialization',
            'Status'
        ],

        rows: [
            ['TR-001', 'Private Trainer I', 'Strength Training', 'In Active'],
            ['TR-002', 'Private Trainer II', 'Fitness Training', 'Active']
        ],

        summaries: [
            { label: 'Total Trainers', value: '2' },
            { label: 'Active Trainers', value: '2' },
            { label: 'Inactive Trainers', value: '0' }
        ]
    },

    // EQUIPMENT REPORT
    'Equipment Report': {
        description: 'Gym equipment inventory and condition report.',

        columns: [
            'Equipment ID',
            'Equipment Name',
            'Quantity',
            'Condition'
        ],

        rows: [
            ['EQ-001', 'Treadmill', '5', 'Good'],
            ['EQ-002', 'Dumbbell Set', '10', 'Good'],
            ['EQ-003', 'Bench Press', '3', 'Maintenance'],
            ['EQ-004', 'Stationary Bike', '4', 'Good']
        ],

        summaries: [
            { label: 'Total Equipment', value: '22' },
            { label: 'Good Condition', value: '19' },
            { label: 'Maintenance', value: '3' }
        ]
    },

    // PAYMENT REPORT
    'Payment Report': {
        description: 'Member payment transactions and payment status.',

        columns: [
            'Payment ID',
            'Member Name',
            'Payment Date',
            'Method',
            'Status'
        ],

        rows: [
            ['PAY-001', 'HAFIZH MUHAMMAD', '01 Nov 2026', 'Transfer', 'Paid'],
            ['PAY-002', 'REIFAL ARIZALDI', '02 Nov 2026', 'Cash', 'Paid'],
            ['PAY-003', 'FIKRI TAQY', '02 Nov 2026', 'Transfer', 'Pending'],
            ['PAY-004', 'JEREMY FELIX', '03 Nov 2026', 'Cash', 'Paid']
        ],

        summaries: [
            { label: 'Total Payments', value: '4' },
            { label: 'Paid', value: '3' },
            { label: 'Pending', value: '1' }
        ]
    }
};


const selectedReportData = computed(() => {
    if (!selectedReport.value) return null;

    return reportDefinitions[selectedReport.value] || null;
});

const getSelectedIcon = computed(() => {
    return reportButtons.find(
        btn => btn.label === selectedReport.value
    )?.icon || 'fa-solid fa-file-lines';
});

const getSelectedDescription = computed(() => {
    return reportButtons.find(
        btn => btn.label === selectedReport.value
    )?.description || '';
});


const isPreviewOpen = ref(false);
const generatedAt = ref('');

const openReportPreview = () => {
    if (!selectedReport.value || !selectedReportData.value) return;

    generatedAt.value = new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    isPreviewOpen.value = true;
};

const closeReportPreview = () => {
    isPreviewOpen.value = false;
};

// Vue has no ".window" event modifier, so Escape is listened for on window directly.
const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isPreviewOpen.value) closeReportPreview();
};

onMounted(() => window.addEventListener('keydown', handleEscape));
onUnmounted(() => window.removeEventListener('keydown', handleEscape));


const isStatusCell = (value: string, index: number) => {
    return (
        ['Status', 'Condition'].includes(
            selectedReportData.value?.columns[index] || ''
        ) ||
        ['Active', 'Inactive', 'Present', 'Absent', 'Late',
        'Paid', 'Pending', 'Good', 'Maintenance'].includes(value)
    );
};

const getStatusClass = (value: string) => {
    const status = value.toLowerCase();

    if (['active', 'present', 'paid', 'good'].includes(status)) {
        return 'status-success';
    }

    if (['late', 'pending', 'maintenance'].includes(status)) {
        return 'status-warning';
    }

    if (['inactive', 'absent'].includes(status)) {
        return 'status-danger';
    }

    return '';
};


const downloadCsv = () => {
    const report = selectedReportData.value;

    if (!report) return;

    const escapeCsv = (value: string) => {
        let text = String(value);

        // Prevent spreadsheet formula injection (=, +, -, @ at the start of a cell).
        if (/^[=+\-@\t\r]./.test(text)) {
            text = `'${text}`;
        }

        return `"${text.replace(/"/g, '""')}"`;
    };

    const csvRows = [
        report.columns,
        ...report.rows
    ];

    const csvContent = '\uFEFF' + csvRows
        .map(row => row.map(escapeCsv).join(','))
        .join('\r\n');

    const blob = new Blob(
        [csvContent],
        { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const fileName = selectedReport.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

    link.href = url;
    link.download = `${fileName}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke later; revoking immediately can cancel the download in some browsers.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};


const printReport = () => {
    if (!selectedReportData.value) return;

    window.print();
};

</script>

<style scoped>

.page-bg {
    --background: #f8fafc;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}


.topbar {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
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

    width: 44px;
    height: 44px;
    margin: 0;
    font-size: 24px;
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
    color: #018181;
}

.header-nav > i {
    font-size: 27px;
}

.header-title h1 {
    margin: 0;
    color: #018181;
    font-size: 1.45rem;
    font-weight: 700;
}

.header-title p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 0.85rem;
}

@media (min-width: 992px) {
    .hamburger-mobile {
        display: none;
    }
}


.report-intro {
    display: flex;
    align-items: center;
    gap: 17px;
    padding: 22px;
    margin-bottom: 28px;
    background: linear-gradient(110deg, #e5f5f3, #f7fbfb);
    border: 1px solid #d9eeee;
    border-radius: 14px;
}

.intro-icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #018181;
    color: #ffffff;
    font-size: 1.35rem;
}

.intro-text h2 {
    margin: 0 0 5px;
    color: #125e5e;
    font-size: 1.05rem;
    font-weight: 700;
}

.intro-text p {
    margin: 0;
    color: #617b7b;
    font-size: 0.82rem;
    line-height: 1.5;
}


.section-heading {
    margin-bottom: 13px;
}

.section-heading h3 {
    margin: 0;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 700;
}

.section-heading p {
    margin: 4px 0 0;
    color: #94a3b8;
    font-size: 0.78rem;
}


.report-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 25px;
}

.btn-report {
    width: 100%;
    min-height: 86px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: #ffffff;
    color: #334155;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    transition: all 0.25s ease;
}

.btn-report:hover {
    border-color: #018181;
    background: #f5fbfa;
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(1, 129, 129, 0.08);
}

.btn-report.report-selected {
    border: 1.5px solid #018181;
    background: #f0fdfa;
}

.report-button-icon {
    width: 43px;
    height: 43px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #e8f5f3;
    color: #018181;
    font-size: 1.2rem;
}

.report-button-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 5px;
}

.report-button-info span {
    color: #1e293b;
    font-size: 0.84rem;
    font-weight: 700;
}

.report-button-info small {
    color: #94a3b8;
    font-size: 0.68rem;
    line-height: 1.4;
}

.report-arrow {
    font-size: 0.75rem;
    color: #94a3b8;
}


.card {
    background: #ffffff;
    border-radius: 15px;
    border: 1px solid #e8edf3;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.035);
}

.report-area {
    min-height: 350px;
    padding: 23px;
}

.report-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 17px;
    border-bottom: 1px solid #edf1f5;
}

.report-header-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 10px;
    background: #e8f5f3;
    color: #018181;
    font-size: 1.1rem;
}

.report-header-text {
    flex: 1;
}

.report-header h2 {
    margin: 0;
    font-size: 1.05rem;
    color: #1e293b;
    font-weight: 700;
}

.report-header p {
    margin: 4px 0 0;
    color: #018181;
    font-size: 0.78rem;
    font-weight: 600;
}

.selected-badge {
    padding: 5px 10px;
    border-radius: 20px;
    background: #e6f6f1;
    color: #11845b;
    font-size: 0.7rem;
    font-weight: 700;
}

.empty-state {
    min-height: 265px;
    padding: 35px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.empty-icon {
    width: 65px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    border-radius: 50%;
    background: #f1f5f9;
    color: #94a3b8;
    font-size: 1.8rem;
}

.empty-state h3 {
    margin: 0 0 8px;
    color: #334155;
    font-size: 1rem;
}

.empty-state p {
    max-width: 450px;
    margin: 0;
    color: #94a3b8;
    font-size: 0.83rem;
    line-height: 1.6;
}

/* ==========================================
   SELECTED REPORT
========================================== */

.selected-report {
    min-height: 230px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 25px 15px;
}

.selected-document-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    border-radius: 14px;
    background: #e8f5f3;
    color: #018181;
    font-size: 1.7rem;
}

.selected-report h3 {
    margin: 0 0 7px;
    color: #1e293b;
    font-size: 1.05rem;
}

.selected-report p {
    max-width: 450px;
    margin: 0 0 20px;
    color: #64748b;
    font-size: 0.82rem;
    line-height: 1.6;
}

.btn-generate {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 12px 23px;
    border: none;
    border-radius: 9px;
    background: #018181;
    color: #ffffff;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.25s ease;
}

.btn-generate:hover {
    background: #016b6b;
    transform: translateY(-2px);
}

/* ==========================================
   MODAL OVERLAY
========================================== */

.report-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;
    background: rgba(15, 23, 42, 0.52);
    backdrop-filter: blur(4px);
}

/* ==========================================
   MODAL CONTAINER
========================================== */

.report-modal {
    width: min(850px, 100%);
    max-height: 92vh;

    display: flex;
    flex-direction: column;

    overflow: hidden;
    background: #ffffff;
    border-radius: 17px;

    box-shadow: 0 25px 70px rgba(15, 23, 42, 0.22);

    animation: modalEnter 0.2s ease-out;
}

@keyframes modalEnter {
    from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* ==========================================
   MODAL HEADER
========================================== */

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 17px 22px;
    border-bottom: 1px solid #e9eef3;
    flex-shrink: 0;
}

.modal-heading {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-heading-icon {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 10px;
    background: #e6f5f3;
    color: #018181;
    font-size: 1.15rem;
}

.modal-heading h2 {
    margin: 0 0 4px;
    color: #1e293b;
    font-size: 1rem;
    font-weight: 700;
}

.modal-heading p {
    margin: 0;
    color: #94a3b8;
    font-size: 0.74rem;
}

.modal-close-btn {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border: none;
    border-radius: 8px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 1.1rem;
    cursor: pointer;
    transition: 0.2s ease;
}

.modal-close-btn:hover {
    background: #fee2e2;
    color: #dc2626;
}

/* ==========================================
   REPORT DOCUMENT AREA
========================================== */

.report-preview {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 22px;
    background: #f1f5f9;
}

.report-document {
    width: 100%;
    min-height: 450px;
    padding: 30px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 7px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.035);
    box-sizing: border-box;
}

/* ==========================================
   DOCUMENT BRANDING
========================================== */

.document-brand {
    display: flex;
    align-items: center;
    gap: 11px;
}

.document-logo {
    width: 43px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #018181;
    color: #ffffff;
    font-size: 1.2rem;
}

.document-brand-info h2 {
    margin: 0;
    color: #018181;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 1px;
}

.document-brand-info p {
    margin: 3px 0 0;
    color: #64748b;
    font-size: 0.58rem;
    letter-spacing: 1.3px;
}

.document-status {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    padding: 6px 9px;
    border-radius: 20px;
    background: #e9f8f0;
    color: #16865c;
    font-size: 0.68rem;
    font-weight: 600;
}

.document-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22a06b;
}

.document-divider {
    height: 2px;
    margin: 20px 0;
    background: #018181;
}

/* ==========================================
   DOCUMENT TITLE
========================================== */

.document-title {
    margin-bottom: 20px;
}

.document-title h1 {
    margin: 0 0 6px;
    color: #17212f;
    font-size: 1.25rem;
    font-weight: 700;
}

.document-title p {
    margin: 0;
    color: #64748b;
    font-size: 0.78rem;
}

/* ==========================================
   DOCUMENT METADATA
========================================== */

.document-meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding: 13px 15px;
    margin-bottom: 18px;
    border-radius: 9px;
    background: #f8fafc;
}

.document-meta div {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
}

.document-meta span {
    color: #94a3b8;
    font-size: 0.66rem;
}

.document-meta strong {
    color: #334155;
    font-size: 0.76rem;
    overflow-wrap: anywhere;
}

/* ==========================================
   SUMMARY GRID
========================================== */

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 24px;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 13px;
    border: 1px solid #e5eeee;
    border-radius: 9px;
    background: #fbfdfd;
}

.summary-label {
    color: #718096;
    font-size: 0.69rem;
}

.summary-item strong {
    color: #018181;
    font-size: 1.05rem;
    font-weight: 700;
    overflow-wrap: anywhere;
}

/* ==========================================
   DOCUMENT TABLE
========================================== */

.document-table-section h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 12px;
    color: #334155;
    font-size: 0.88rem;
    font-weight: 700;
}

.document-table-section h3 i {
    color: #018181;
}

.table-scroll {
    width: 100%;
    overflow-x: auto;
}

.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.7rem;
    text-align: left;
}

.report-table th {
    padding: 11px 10px;
    background: #eaf5f4;
    color: #126c6a;
    font-weight: 700;
    white-space: nowrap;
    border-bottom: 1px solid #d7e8e7;
}

.report-table td {
    padding: 11px 10px;
    color: #475569;
    border-bottom: 1px solid #edf1f5;
}

.report-table tbody tr:nth-child(even) {
    background: #fbfcfd;
}

.report-table tbody tr:hover {
    background: #f3f9f8;
}

.table-status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.64rem;
    font-weight: 600;
    white-space: nowrap;
}

.status-success {
    background: #e9f8f0;
    color: #16865c;
}

.status-warning {
    background: #fff5df;
    color: #a66b0b;
}

.status-danger {
    background: #feeeee;
    color: #cc4242;
}

.no-data {
    padding: 30px !important;
    text-align: center;
    color: #94a3b8 !important;
}

/* ==========================================
   DOCUMENT NOTE
========================================== */

.document-note {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    padding: 12px;
    margin-top: 20px;
    border: 1px solid #f4e4bd;
    border-radius: 8px;
    background: #fffbf2;
}

.document-note i {
    margin-top: 2px;
    color: #b7791f;
    font-size: 0.85rem;
}

.document-note p {
    margin: 0;
    color: #78623c;
    font-size: 0.69rem;
    line-height: 1.5;
}

/* ==========================================
   DOCUMENT FOOTER
========================================== */

.document-footer {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding-top: 15px;
    margin-top: 25px;
    border-top: 1px solid #e2e8f0;
    color: #94a3b8;
    font-size: 0.63rem;
    font-weight: 600;
}

/* ==========================================
   MODAL ACTIONS
========================================== */

.modal-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 15px 22px;
    border-top: 1px solid #e9eef3;
    background: #ffffff;
    flex-shrink: 0;
}

.action-right {
    display: flex;
    align-items: center;
    gap: 9px;
}

.btn-cancel,
.btn-download,
.btn-print {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 14px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
}

.btn-cancel {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
}

.btn-cancel:hover {
    background: #f1f5f9;
}

.btn-download {
    border: 1px solid #cde8e4;
    background: #f0fdfa;
    color: #018181;
}

.btn-download:hover {
    background: #dff3ef;
}

.btn-print {
    border: 1px solid #018181;
    background: #018181;
    color: #ffffff;
}

.btn-print:hover {
    background: #016b6b;
}

/* ==========================================
   RESPONSIVE TABLET
========================================== */

@media (max-width: 991px) {
    .report-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

/* ==========================================
   RESPONSIVE MOBILE
========================================== */

@media (max-width: 600px) {

    .container {
        padding: 15px;
    }

    .hamburger-mobile {
        display: flex !important;
    }

    .header-nav {
        gap: 8px;
    }

    .header-nav > i {
        font-size: 23px;
    }

    .header-title h1 {
        font-size: 1.15rem;
    }

    .header-title p {
        font-size: 0.72rem;
    }

    .report-intro {
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
    }

    .intro-icon {
        width: 42px;
        height: 42px;
        font-size: 1.1rem;
    }

    .intro-text h2 {
        font-size: 0.9rem;
    }

    .intro-text p {
        font-size: 0.72rem;
    }

    .report-grid {
        grid-template-columns: 1fr;
        gap: 10px;
    }

    .btn-report {
        min-height: 72px;
        padding: 12px;
    }

    .report-area {
        padding: 16px;
    }

    .report-header h2 {
        font-size: 0.95rem;
    }

    .selected-report {
        min-height: 230px;
    }

    /* Modal */

    .report-overlay {
        align-items: flex-end;
        padding: 0;
    }

    .report-modal {
        width: 100%;
        max-height: 94vh;
        border-radius: 18px 18px 0 0;
    }

    .modal-header {
        padding: 14px 15px;
    }

    .report-preview {
        padding: 12px;
    }

    .report-document {
        padding: 18px 13px;
    }

    .document-brand-info h2 {
        font-size: 1.05rem;
    }

    .document-brand-info p {
        font-size: 0.48rem;
    }

    .document-status {
        padding: 5px 7px;
        font-size: 0.58rem;
    }

    .document-title h1 {
        font-size: 1.05rem;
    }

    .summary-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .modal-actions {
        flex-wrap: wrap;
        padding: 12px 14px;
    }

    .action-right {
        flex: 1;
    }

    .btn-cancel {
        flex: 1;
    }

    .btn-download,
    .btn-print {
        flex: 1;
        padding: 0 9px;
        font-size: 0.68rem;
    }
}

/* ==========================================
   SMALL MOBILE
========================================== */

@media (max-width: 380px) {

    .header-title h1 {
        font-size: 1rem;
    }

    .document-status {
        font-size: 0.52rem;
    }

    .document-meta {
        grid-template-columns: 1fr;
    }

    .summary-item strong {
        font-size: 0.9rem;
    }

    .modal-heading p {
        font-size: 0.67rem;
    }

    .btn-download,
    .btn-print {
        font-size: 0.62rem;
        gap: 5px;
    }
}

/* ==========================================
   PRINT / SAVE PDF
========================================== */

@media print {

    @page {
        size: A4 portrait;
        margin: 12mm;
    }

    body * {
        visibility: hidden !important;
    }

    .report-overlay,
    .report-overlay * {
        visibility: visible !important;
    }

    .report-overlay {
        position: absolute !important;
        inset: 0 !important;
        display: block !important;
        padding: 0 !important;
        background: #ffffff !important;
        backdrop-filter: none !important;
    }

    .report-modal {
        position: static !important;
        display: block !important;
        width: 100% !important;
        max-width: none !important;
        max-height: none !important;
        overflow: visible !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        animation: none !important;
    }

    .modal-header,
    .modal-actions {
        display: none !important;
    }

    .report-preview {
        display: block !important;
        overflow: visible !important;
        padding: 0 !important;
        background: #ffffff !important;
    }

    .report-document {
        width: 100% !important;
        min-height: 0 !important;
        padding: 0 !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
    }

    .report-table {
        width: 100% !important;
        font-size: 9pt !important;
        border-collapse: collapse !important;
    }

    .report-table th,
    .report-table td {
        padding: 8px !important;
        border: 1px solid #dce5e5 !important;
    }

    .report-table th {
        background: #eaf5f4 !important;
        color: #126c6a !important;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .summary-item,
    .document-note,
    .table-status {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .table-scroll {
        overflow: visible !important;
    }
}

</style>
