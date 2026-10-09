<template>
    <ion-page>
        <ion-content class="auth-container">

            <!-- Pop-up Alert -->
            <div class="alert-box" :class="{ 'show': showAlert }">
                <i class='fa-solid fa-circle-exclamation'></i>
                <div class="alert-text">
                    <strong>Something went wrong!</strong>
                    <span>Please try again your password or email</span>
                </div>
                <i class='fa-solid fa-xmark' @click="showAlert = false"></i>
            </div>

            <div class="main-wrapper">
                <div class="auth-card" :class="{ 'right-panel-active': !isLogin }">

                    <!-- Sign Up Form -->
                    <div v-if="!isLogin" class="form-container sign-up-container">
                        <form @submit.prevent>
                            <h1>Create Account</h1>
                            <div class="social-icons">
                                <i class='fa-brands fa-google'></i>
                                <i class='fa-brands fa-facebook'></i>
                                <i class="fa-brands fa-threads"></i>
                                <i class="fa-brands fa-meta"></i>
                            </div>
                            <span class="sub-text">Register with E-mail</span>
                            <input type="text" placeholder="Username" />
                            <input type="email" placeholder="Enter Email" />
                            <div class="pass-wrapper">
                                <input :type="showPass ? 'text' : 'password'" placeholder="Password" />
                                <i class="fa-regular" :class="showPass ? 'fa-eye' : 'fa-eye-slash'" @click="showPass = !showPass"></i>
                            </div>
                            <button class="btn-action" @click="handleAuth">SIGN UP</button>
                        </form>
                    </div>

                    <!-- Sign In Form -->
                    <div v-if="isLogin" class="form-container sign-in-container">
                        <form @submit.prevent>
                            <h1>Sign In</h1>
                            <div class="social-icons">
                                <i class='fa-brands fa-google'></i>
                                <i class='fa-brands fa-facebook'></i>
                                <i class="fa-brands fa-threads"></i>
                                <i class="fa-brands fa-meta"></i>
                            </div>
                            <span class="sub-text">Sign in With Email & Password</span>
                            <input v-model="email" type="email" placeholder="Your Email" />
                            <div class="pass-wrapper">
                                <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Password" />
                                <i class='fa-regular' :class="showPass ? 'fa-eye' : 'fa-eye-slash'" @click="showPass = !showPass"></i>
                            </div>
                            <a href="#" class="forgot-pass">Forget Password?</a>
                            <button class="btn-action" @click="handleAuth">SIGN IN</button>
                        </form>
                    </div>

                    <!-- Mobile Toggle  -->
                    <div class="mobile-toggle show-mobile">
                        <p v-if="isLogin">
                            Belum punya akun? <span @click="isLogin = false">Daftar Sekarang</span>
                        </p>
                        <p v-else>
                            Sudah punya akun? <span @click="isLogin = true">Login</span>
                        </p>
                    </div>

                    <!-- Overlay (Sembunyi di HP) -->
                    <div class="overlay-container hide-mobile">
                        <div class="overlay">
                            <div class="overlay-panel overlay-left">
                                <h1>Welcome To FitLab</h1>
                                <img src="/assets/Logo.png" class="logo-img" />
                                <p>Grow Stronger, Feel Better, and Become the Best Version of Yourself.</p>
                                <button class="ghost" @click="isLogin = true">SIGN IN</button>
                            </div>
                            <div class="overlay-panel overlay-right">
                                <h1>Hello Welcome Back!</h1>
                                <img src="/assets/Logo.png" class="logo-img" />
                                <p>Sign Up Now and Take Your Performance to the Next Level.</p>
                                <button class="ghost" @click="isLogin = false">SIGN UP</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AppFooter />
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router'; 
import AppFooter from '@/components/AppFooter.vue'

const router = useRouter();
const isLogin = ref(true);
const showPass = ref(false);
const showAlert = ref(false);

const isMobileLogin = ref(true); // Default show Sign In HP
// State untuk input
const email = ref('');
const password = ref('');
const handleToggle = (value: boolean) => {
    isLogin.value = value;
    console.log("isLogin sekarang:", isLogin.value); // Cek di console browser
}
const handleAuth = () => {
    if (isLogin.value) {
        // Logika Login
        if (email.value === 'admin@admin.com' && password.value === 'admin123') {
            router.push('/admin/dashboard');
        } else {
            showAlert.value = true;
            setTimeout(() => { showAlert.value = false; }, 4000);
        }
    } else {
        // Logika Register
        console.log("Mendaftarkan akun:", email.value);

        isLogin.value = true; 
    }
};
</script>

<style scoped>
/* Alert Box */
.alert-box {
    position: fixed;
    top: 20px;
    right: -400px;
    z-index: 999;
    background: #fde8e4;
    color: #b91c1c;
    padding: 15px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid #fecaca;
}
.alert-box i {
    font-size: 1.2rem;
    cursor: pointer;
}

.alert-text {
    display: flex;
    flex-direction: column;
}

.alert-text strong {
    font-size: 0.9rem;
}

.alert-text span {
    font-size: 0.8rem;
}

.alert-box.show {
    right: 20px;
}
/* Form Elements */
.pass-wrapper {
    position: relative;
    width: 100%;
}
.pass-wrapper i {
    position: absolute;
    right: 15px;
    top: 25px;
    cursor: pointer;
    color: #666;
    font-size: 1.1rem;
}
input {
    background: #eee;
    border: none;
    padding: 15px;
    margin: 8px 0;
    width: 100%;
    border-radius: 10px;
    color: #333;
}
input::placeholder {
    font-size: 10px;
    color: #666;
    font-style: italic;
}
input:focus {
    outline: none;
    border: none;
    box-shadow: 0 0 0 2px var(--teal);
}
.btn-action {
    background: var(--teal);
    color: #fff;
    border: none;
    padding: 12px 50px;
    margin-top: 15px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    width: 200px;
    transition: 0.3s;
}

.btn-action:hover {
    background: var(--safety-orange);
}

.logo-img {
    width: 800px;
    margin: 15px 0;
}

.auth-container {
    --background: url('/assets/BG.png') no-repeat center center / cover;
}

.main-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 100%;
}

.auth-card {
    background: #fff;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    width: 800px;
    max-width: 95%;
    min-height: 500px;
    display: flex;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Copy sisanya dari code sebelumnya... */
.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-container form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.sign-in-container {
    left: 0;
    z-index: 2;
}

.sign-up-container {
    left: 0;
    z-index: 1;
    opacity: 0;
}

p {
    text-align: center;
    font-style: italic;
}
.sub-text {
    font-size: 0.9rem;
    margin-bottom: 10px;
    color: #666;
    text-align: center;
    
}

/* Styling Social Icons */
.social-icons { 
    margin: 10px 0; 
    display: flex; 
    gap: 10px; 
    justify-content: center; 
}

.social-icons i { 
    border: 1px solid #ccc; 
    border-radius: 5px; 
    padding: 10px 12px; 
    cursor: pointer; 
    font-size: 1.1rem; 
    color: var(--teal);
    transition: all 0.3s ease; 
    background: transparent;
}

/* Efek Hover */
.social-icons i:hover {
    background: var(--safety-orange);
    color: #fff;             
    border-color: var(--teal);
}
.forgot-pass {
    font-size: 0.85rem;
    color: #333;
    margin: 10px 0;
    text-decoration: none;
}
.overlay-panel h1 {
    font-weight: bold;
    margin: 0 0 15px 0;
    font-size: 2.2rem;
    text-align: center;
    color: var(--safety-orange);
    font-style: italic;
}

.form-container h1 {
    font-weight: bold;
    margin: 0 0 15px 0;
    font-size: 2.2rem;
    text-align: center;
    color: var(--teal);
}
.overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
}

.overlay {
    background: #005d5d;
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transition: transform 0.6s ease-in-out;
}

.overlay-panel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    height: 100%;
    width: 50%;
}
.overlay-left {
    transform: translateX(-20%);
}

.overlay-right {
    right: 0;
    transform: translateX(0);
}

.right-panel-active .sign-in-container {
    transform: translateX(100%);
}

.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
}

.right-panel-active .overlay-container {
    transform: translateX(-100%);
}

.right-panel-active .overlay {
    transform: translateX(50%);
}

.right-panel-active .overlay-left {
    transform: translateX(0);
}

.right-panel-active .overlay-right {
    transform: translateX(20%);
}

.ghost {
    background: transparent;
    border: 1px solid #fff;
    padding: 10px 40px;
    border-radius: 5px;
    cursor: pointer;
    color: #fff;
    margin-top: 20px;
    font-weight: bold;
}

.ghost:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
    transition: 0.3s;
}

.btn-action:hover {
    background-color: var(--safety-orange);
    /* Warna oranye dari paletmu */
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(245, 128, 32, 0.4);
}

.social-icons i:hover {
    background: #f0f0f0;
    color: var(--safety-orange);
    border-color: var(--safety-orange);
    transition: 0.3s;
}
.mobile-toggle {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #666;
}

.mobile-toggle span {
    color: #f58020;
    font-weight: bold;
    cursor: pointer;
    text-decoration: underline;
}

.mobile-toggle span:hover {
    color: #d96e1a; 
}
.mobile-toggle {
    display: none !important;
}

@media (max-width: 768px) {
    .mobile-toggle {
        display: block !important;
        text-align: center;
        margin-top: 15px;
    }
    .overlay-container {
        display: none !important;
    }
    .auth-card {
        width: 90% !important;
        flex-direction: column !important;
        padding: 20px !important;
        min-height: auto !important;
    }
    .form-container {
        position: relative !important;
        width: 100% !important;
        height: auto !important;
        transform: none !important; 
        transition: none !important;
    }

    .form-container form {
        padding: 0 10px !important;
    }

    .sign-in-container {
        display: flex !important;
        opacity: 1 !important;
    }
    .sign-up-container {
        display: none !important;
        opacity: 0 !important;
    }

    .right-panel-active .sign-in-container {
        display: none !important;
        transform: none !important;
    }
    .right-panel-active .sign-up-container {
        display: flex !important;
        opacity: 1 !important;
        transform: none !important;
    }

    .show-mobile {
        display: block !important;
        text-align: center;
        margin-top: 15px;
        color: #666;
        z-index: 10;
    }
    @media (max-width: 768px) {
    .sign-up-container, .sign-in-container {
        display: flex !important; 
        position: relative !important;
        opacity: 1 !important;
    }
}
}
</style>