```vue
<template>
    <footer class="app-footer">
        <p>
            <span class="copyright-symbol">©</span>
            <span>{{ currentYear }} Fregi Ardika Setyawan.</span>
            <span class="rights">All rights reserved.</span>
        </p>
    </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
    width: 100%;
    padding: 10px 16px 14px;
    margin-top: auto;
    text-align: center;
    box-sizing: border-box;
}
.app-footer p {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 0;
    color: #64748b;
    font-family: 'Poppins', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.8;
    overflow-wrap: anywhere;
}

.copyright-symbol {
    font-size: 14px;
    font-weight: 500;
}

@media (max-width: 480px) {
    .app-footer {
        padding: 16px 12px;
    }

    .app-footer p {
        font-size: 11px;
        gap: 3px;
    }

    .copyright-symbol {
        font-size: 13px;
    }
}
</style>
