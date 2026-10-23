<template>
    <ion-app>

        <Transition name="page-loading">
            <div v-if="isLoading" class="page-loading">
                <div class="loading-circle"></div>
            </div>
        </Transition>

        <ion-router-outlet />

    </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
    IonApp,
    IonRouterOutlet
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isLoading = ref(true);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;

const startLoading = () => {
    if (loadingTimer) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
    }

    isLoading.value = true;
};

const stopLoading = () => {
    if (loadingTimer) {
        clearTimeout(loadingTimer);
    }

    loadingTimer = setTimeout(() => {
        isLoading.value = false;
        loadingTimer = null;
    }, 350);
};

const removeBeforeEach = router.beforeEach(() => {
    startLoading();
});

const removeAfterEach = router.afterEach(() => {
    stopLoading();
});


onMounted(() => {
    /*
     * Loading pertama kali saat website dibuka
     * atau setelah browser di-refresh.
     */
    setTimeout(() => {
        isLoading.value = false;
    }, 700);
});

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer);
    }

    removeBeforeEach();
    removeAfterEach();
});
</script>

<style scoped>

.page-loading {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    z-index: 99999;
    backdrop-filter: blur(1px);
    -webkit-backdrop-filter: blur(1px);
}


.loading-circle {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    border: 4px solid #dff3f3;
    border-top-color: #018181;
    box-sizing: border-box;
    animation: loading-spin 0.75s linear infinite;
}



@keyframes loading-spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.page-loading-enter-active,
.page-loading-leave-active {
    transition: opacity 0.2s ease;
}

.page-loading-enter-from,
.page-loading-leave-to {
    opacity: 0;
}
</style>