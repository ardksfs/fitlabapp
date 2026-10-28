<template>
    <ion-page>
        <ion-content class="auth-container" :class="{ 'staff-auth-container': isStaffLogin }">

            <!-- Pop-up Alert -->
            <div class="alert-box" :class="{
                show: showAlert,
                success: alertTitle === 'Registration Successful'
            }">
                <i :class="alertTitle === 'Registration Successful'
                    ? 'fa-solid fa-circle-check'
                    : 'fa-solid fa-circle-exclamation'"></i>

                <div class="alert-text">
                    <strong>{{ alertTitle }}</strong>
                    <span>{{ alertMessage }}</span>
                </div>

                <i class="fa-solid fa-xmark" @click="showAlert = false"></i>
            </div>

            <template v-if="!isStaffLogin">
                <div class="member-main-wrapper">
                    <section class="member-auth-card" :class="{ 'member-signup-mode': !isLogin }">
                        <!-- Member brand panel and registration progress -->
                        <aside class="member-brand-side">
                            <div class="member-brand-logo">
                                <img src="/assets/Logo.png" alt="FitLab" />
                            </div>

                            <div class="member-brand-copy">
                                <span class="member-eyebrow">FITLAB MEMBER AREA</span>
                                <h2>{{ isLogin ? 'Welcome Back to FitLab' : 'Get Started With Us' }}</h2>
                                <p>
                                    {{ isLogin
                                        ? 'Sign in to continue your fitness journey and access your member workspace.'
                                        : 'Complete these easy steps to create your account and get started.' }}
                                </p>
                            </div>

                            <ol class="member-step-list" aria-label="Member account progress">
                                <li
                                    v-for="step in memberSteps"
                                    :key="step.number"
                                    :class="{
                                        'is-active': memberStep === step.number,
                                        'is-complete': registrationCompleted && memberStep > step.number
                                    }"
                                >
                                    <span class="member-step-check" aria-hidden="true">
                                        <i v-if="registrationCompleted && memberStep > step.number" class="fa-solid fa-check"></i>
                                        <span v-else>{{ step.number }}</span>
                                    </span>
                                    <span class="member-step-text">
                                        <strong>{{ step.title }}</strong>
                                        <small>{{ step.description }}</small>
                                    </span>
                                </li>
                            </ol>

                            <div class="member-brand-bottom">
                                <span class="member-brand-bottom-line"></span>
                                <span>BUILD YOUR STRENGTH. OWN YOUR PROGRESS.</span>
                            </div>
                        </aside>

                        <!-- Sign-up / sign-in panel -->
                        <section class="member-form-side">
                            <form v-if="!isLogin" class="member-auth-form" @submit.prevent="handleAuth">
                                <div class="member-form-heading">
                                    <span class="member-form-kicker">CREATE YOUR ACCOUNT</span>
                                    <h1>Sign Up Account</h1>
                                    <p>Enter your personal data to create your account.</p>
                                </div>

                                <div class="member-social-row">
                                    <button
                                        type="button"
                                        class="member-social-button"
                                        @click="showNotification('Google sign-up unavailable', 'Google sign-up is not configured yet. Please register with your email and password.')"
                                    >
                                        <i class="fa-brands fa-google google-icon" aria-hidden="true"></i>
                                        <span>Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        class="member-social-button"
                                        @click="showNotification('Meta sign-up unavailable', 'Meta sign-up is not configured yet. Please register with your email and password.')"
                                    >
                                        <i class="fa-brands fa-meta meta-icon" aria-hidden="true"></i>
                                        <span>Meta</span>
                                    </button>
                                </div>

                                <div class="member-or-divider"><span></span><small>Or</small><span></span></div>

                                <div class="member-name-grid">
                                    <label class="member-field">
                                        <span>First Name</span>
                                        <input
                                            v-model="firstName"
                                            type="text"
                                            placeholder="e.g. Regi"
                                            autocomplete="given-name"
                                            required
                                        />
                                    </label>
                                    <label class="member-field">
                                        <span>Last Name</span>
                                        <input
                                            v-model="lastName"
                                            type="text"
                                            placeholder="e.g. Setyawan"
                                            autocomplete="family-name"
                                            required
                                        />
                                    </label>
                                </div>

                                <label class="member-field">
                                    <span>Email</span>
                                    <input
                                        v-model="email"
                                        type="email"
                                        placeholder="Enter Your Email"
                                        autocomplete="email"
                                        required
                                    />
                                </label>

                                <label class="member-field">
                                    <span>Password</span>
                                    <div class="member-password-wrap">
                                        <input
                                            v-model="password"
                                            :type="showPass ? 'text' : 'password'"
                                            placeholder="Enter your password"
                                            autocomplete="new-password"
                                            minlength="8"
                                            required
                                        />
                                        <button
                                            type="button"
                                            class="member-password-toggle"
                                            :aria-label="showPass ? 'Hide password' : 'Show password'"
                                            @click="showPass = !showPass"
                                        >
                                            <i class="fa-regular" :class="showPass ? 'fa-eye' : 'fa-eye-slash'" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </label>
                                <p class="member-password-hint">Must be at least 8 characters.</p>

                                <button class="member-submit-button" type="submit">
                                    <span>Sign Up</span>
                                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                </button>

                                <p class="member-form-switch">
                                    Already have an account?
                                    <button type="button" @click="handleToggle(true)">Log in</button>
                                </p>
                            </form>

                            <form v-else class="member-auth-form" @submit.prevent="handleAuth">
                                <div class="member-form-heading">
                                    <span class="member-form-kicker">MEMBER ACCESS</span>
                                    <h1>Sign In</h1>
                                    <p>Welcome back. Sign in to continue with FitLab.</p>
                                </div>

                                <div class="member-social-row">
                                    <button
                                        type="button"
                                        class="member-social-button"
                                        @click="showNotification('Google sign-in unavailable', 'Google sign-in is not configured yet. Please use your email and password.')"
                                    >
                                        <i class="fa-brands fa-google google-icon" aria-hidden="true"></i>
                                        <span>Google</span>
                                    </button>
                                    <button
                                        type="button"
                                        class="member-social-button"
                                        @click="showNotification('Meta sign-in unavailable', 'Meta sign-in is not configured yet. Please use your email and password.')"
                                    >
                                        <i class="fa-brands fa-meta meta-icon" aria-hidden="true"></i>
                                        <span>Meta</span>
                                    </button>
                                </div>

                                <div class="member-or-divider"><span></span><small>Or</small><span></span></div>

                                <label class="member-field">
                                    <span>Email</span>
                                    <input
                                        v-model="email"
                                        type="email"
                                        placeholder="Enter Your Email"
                                        autocomplete="email"
                                        required
                                    />
                                </label>

                                <label class="member-field">
                                    <span>Password</span>
                                    <div class="member-password-wrap">
                                        <input
                                            v-model="password"
                                            :type="showPass ? 'text' : 'password'"
                                            placeholder="Enter your password"
                                            autocomplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            class="member-password-toggle"
                                            :aria-label="showPass ? 'Hide password' : 'Show password'"
                                            @click="showPass = !showPass"
                                        >
                                            <i class="fa-regular" :class="showPass ? 'fa-eye' : 'fa-eye-slash'" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </label>

                                <button
                                    type="button"
                                    class="member-forgot-password"
                                    @click="showNotification('Password recovery unavailable', 'Password recovery is not configured yet. Please contact the FitLab administrator if you need help.')"
                                >Forgot password?</button>

                                <button class="member-submit-button" type="submit">
                                    <span>Sign In</span>
                                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                </button>

                                <p class="member-form-switch">
                                    Don't have an account?
                                    <button type="button" @click="handleToggle(false)">Sign up</button>
                                </p>
                            </form>
                        </section>
                    </section>
                </div>
            </template>

            <div v-else class="staff-main-wrapper">
                <section class="staff-auth-card" :class="`staff-${staffRole}-card`">
                    <!-- Panel visual: BT.webp on desktop and BT2.webp on mobile -->
                    <aside class="staff-brand-side">
                        <div class="staff-brand-top">
                            <span class="staff-overline">
                                <span class="staff-brand-name">FITLAB</span>
                                <span class="staff-overline-divider">/</span>
                                STAFF ACCESS
                            </span>
                            <h1>{{ staffRole === 'admin' ? 'Admin Portal' : 'Personal Trainer Portal' }}</h1>
                        </div>

                        <div class="staff-brand-message">
                            <h2>Simplify The Process.<br />Supercharge The Result.</h2>
                            <p v-if="staffRole === 'admin'">
                                Oversee operations, manage your coaching team, and track revenue growth from one central hub.
                            </p>
                            <p v-else>
                                Manage client programs, organize training sessions, and track progress from one central hub.
                            </p>
                        </div>
                    </aside>

                    <!-- Dedicated staff sign-in form -->
                    <div class="staff-form-side">
                        <div class="staff-form-logo">
                            <img src="/assets/Logo.png" alt="FitLab" />
                        </div>

                        <div class="staff-form-heading">
                            <h2>Sign in to Fitlab</h2>
                            <p>Enter the email and password assigned to your staff account.</p>
                        </div>

                        <form class="staff-login-form" @submit.prevent="handleAuth">
                            <label class="staff-field-label" for="staff-email">Email address</label>
                            <div class="staff-input-wrap">
                                <i class="bx bx-envelope-alt staff-input-icon" aria-hidden="true"></i>
                                <input
                                    id="staff-email"
                                    v-model="email"
                                    type="email"
                                    placeholder="Enter Your Staff Email"
                                    autocomplete="username"
                                    required
                                />
                            </div>

                            <label class="staff-field-label" for="staff-password">Password</label>

                            <div class="staff-input-wrap">
                                <i class="bx bx-lock staff-input-icon" aria-hidden="true"></i>

                                <input id="staff-password" v-model="password" :type="showPass ? 'text' : 'password'"
                                    class="staff-password-input" placeholder="Enter Your Password"
                                    autocomplete="current-password" required />

                                <button type="button" class="staff-password-toggle"
                                    :aria-label="showPass ? 'Hide password' : 'Show password'"
                                    @click="showPass = !showPass">
                                    <i class="fa-regular" :class="showPass ? 'fa-eye' : 'fa-eye-slash'"
                                        aria-hidden="true"></i>
                                </button>
                            </div>

                            <label class="staff-access-note" for="staff-authorized">
                                <input id="staff-authorized" v-model="authorizedStaff" class="staff-checkbox"
                                    type="checkbox" />
                                <span>Authorized staff accounts only</span>
                            </label>

                            <button class="staff-submit-button" type="submit">
                                <span>Sign In</span>
                                <i class="bx bx-arrow-out-right-circle-half" aria-hidden="true"></i>
                            </button>
                        </form>

                        <div class="staff-divider" aria-label="Portal type">
                            <span></span>
                            <strong>{{ staffRole === 'admin' ? 'Admin Portal' : 'Personal Trainer Portal' }}</strong>
                            <span></span>
                        </div>

                        <p class="staff-tagline">Grow Stronger, Feel Better, and Become the Best Version of Yourself.</p>

                        <div class="staff-form-bottom">
                            <strong>Need account access?</strong>
                            <p>Contact your FitLab administrator to get your staff credentials.</p>
                        </div>

                        <button class="staff-back-link" type="button" @click="router.push('/login')">
                            <i class="bx bx-arrow-in-left-circle-half" aria-hidden="true"></i>
                            <span>Get Back to Member Login</span>
                        </button>
                    </div>
                </section>
            </div>

            <AppFooter/>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import AppFooter from '@/components/AppFooter.vue';

const router = useRouter();
const route = useRoute();

// Member login starts at Sign Up by default; staff portals always start at Sign In.
const isLogin = ref(route.query.role === 'admin' || route.query.role === 'pt');
const showPass = ref(false);
const showAlert = ref(false);
const authorizedStaff = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');

const alertTitle = ref('');
const alertMessage = ref('');

type UserRole = 'admin' | 'member' | 'pt';

type MemberStep = 1 | 2 | 3;
const memberStep = ref<MemberStep>(isLogin.value ? 2 : 1);
const registrationCompleted = ref(false);
const memberSteps = [
    { number: 1, title: 'Sign up your account', description: 'Create your FitLab member account.' },
    { number: 2, title: 'Set up your workspace', description: 'Sign in to access your member area.' },
    { number: 3, title: 'Set up your profile', description: 'Personalize your fitness journey.' }
];

// /login is the original Member screen. Admin/PT use the same route with a role query.
const staffRole = computed<UserRole | null>(() => {
    const requestedRole = route.query.role;
    return requestedRole === 'admin' || requestedRole === 'pt'
        ? requestedRole
        : null;
});
const isStaffLogin = computed(() => staffRole.value === 'admin' || staffRole.value === 'pt');

// Keep the correct initial form when navigating between Member and Staff portals.
watch(
    () => route.query.role,
    (role) => {
        if (role === 'admin' || role === 'pt') {
            isLogin.value = true;
            memberStep.value = 2;
        } else {
            // Opening the Member portal starts at Sign Up / Step 1.
            isLogin.value = false;
            memberStep.value = 1;
            registrationCompleted.value = false;
        }

        showPass.value = false;
        authorizedStaff.value = false;
        showAlert.value = false;
        alertTitle.value = '';
        alertMessage.value = '';
    }
);

interface AuthUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

const USERS_KEY = 'fitlab_users';
const SESSION_KEY = 'fitlab_session';

const defaultAdmin: AuthUser = {
    id: 'ADM-1001',
    name: 'Administrator',
    email: 'admin@fitlab.com',
    password: 'admin00*',
    role: 'admin'
};

const defaultPT: AuthUser = {
    id: 'PT-1001',
    name: 'Private Trainer II',
    email: 'pt2@fitlab.com',
    password: 'pt200*',
    role: 'pt'
};

let alertTimeout: ReturnType<typeof setTimeout> | undefined;

const showNotification = (title: string, message: string) => {
    if (alertTimeout) clearTimeout(alertTimeout);

    alertTitle.value = title;
    alertMessage.value = message;
    showAlert.value = true;

    alertTimeout = setTimeout(() => {
        showAlert.value = false;
    }, 4000);
};

const handleToggle = (value: boolean) => {
    if (isStaffLogin.value) return;

    isLogin.value = value;
    memberStep.value = value ? 2 : 1;
    showPass.value = false;
    showAlert.value = false;
    alertTitle.value = '';
    alertMessage.value = '';
};

const getUsers = (): AuthUser[] => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        let users: AuthUser[] = [];

        if (stored) {
            const parsed: unknown = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                users = parsed.filter(
                    (user): user is AuthUser =>
                        user !== null &&
                        typeof user === 'object' &&
                        typeof user.id === 'string' &&
                        typeof user.name === 'string' &&
                        typeof user.email === 'string' &&
                        typeof user.password === 'string' &&
                        user.role === 'member'
                );
            }
        }

        users.push(defaultAdmin, defaultPT);

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        return users;
    } catch {
        throw new Error('Data akun gagal dibaca dari browser.');
    }
};


const handleAuth = async () => {
    showAlert.value = false;

    if (isStaffLogin.value && !authorizedStaff.value) {
        showNotification(
            'Authorization Required',
            'Centang Authorized staff accounts only sebelum login.'
        );
        return;
    }
    if (isStaffLogin.value && !isLogin.value) {
        showNotification('Access Restricted', 'Admin dan Personal Trainer hanya dapat masuk menggunakan akun yang sudah ditentukan.');
        return;
    }

    const normalizedEmail = email.value.trim().toLowerCase();
    const enteredPassword = password.value;

    try {
        if (!normalizedEmail || !enteredPassword) {
            showNotification(
                'Validation Error',
                'Email dan password wajib diisi.'
            );
            return;
        }

        const users = getUsers();

        if (isLogin.value) {
            const user = users.find(
                item =>
                    item.email.toLowerCase() === normalizedEmail &&
                    item.password === enteredPassword
            );

            if (!user) {
                showNotification(
                    'Login Failed',
                    'Email atau password salah. Silakan coba lagi.'
                );
                return;
            }

            if (staffRole.value && user.role !== staffRole.value) {
                showNotification(
                    'Access Denied',
                    staffRole.value === 'admin'
                        ? 'Halaman ini khusus untuk akun Admin.'
                        : 'Halaman ini khusus untuk akun Personal Trainer.'
                );
                return;
            }

            if (!staffRole.value && user.role !== 'member') {
                showNotification(
                    'Staff Login Required',
                    user.role === 'admin'
                        ? 'Gunakan halaman login Admin untuk masuk.'
                        : 'Gunakan halaman login Personal Trainer untuk masuk.'
                );
                return;
            }

            const session = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            if (user.role === 'admin') {
                await router.push('/admin/dashboard');
            } else if (user.role === 'pt') {
                await router.push('/pt/dashboard');
            } else {
                await router.push('/user/dashboard');
            }

            return;
        }

        if (!firstName.value.trim() || !lastName.value.trim()) {
            showNotification(
                'Validation Error',
                'First name dan last name wajib diisi.'
            );
            return;
        }

        if (enteredPassword.length < 8) {
            showNotification(
                'Validation Error',
                'Password minimal 8 karakter.'
            );
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            showNotification(
                'Validation Error',
                'Format email tidak valid.'
            );
            return;
        }

        if (users.some(
            user => user.email.toLowerCase() === normalizedEmail
        )) {
            showNotification(
                'Registration Failed',
                'Email sudah terdaftar. Silakan gunakan email lain atau login.'
            );
            return;
        }

        const newUser: AuthUser = {
            id: `MEM-${Date.now()}`,
            name: `${firstName.value.trim()} ${lastName.value.trim()}`.trim(),
            email: normalizedEmail,
            password: enteredPassword,
            role: 'member'
        };

        users.push(newUser);

        try {
            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );
        } catch {
            showNotification(
                'Registration Failed',
                'Akun gagal disimpan di browser.'
            );
            return;
        }

        registrationCompleted.value = true;
        firstName.value = '';
        lastName.value = '';
        email.value = normalizedEmail;
        password.value = '';

        handleToggle(true);

        showNotification(
            'Registration Successful',
            'Akun berhasil dibuat. Silakan login.'
        );
    } catch (error) {
        showNotification(
            'Something went wrong!',
            error instanceof Error
                ? error.message
                : 'Terjadi kesalahan. Silakan coba lagi.'
        );
    }
};
</script>

<style scoped>
/* Alert Box */
.alert-box {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: calc(100vw - 40px);
    box-sizing: border-box;
    background: #fde8e4;
    color: #b91c1c;
    padding: 15px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #fecaca;
    transform: translateX(calc(100% + 30px));
    visibility: hidden;
    opacity: 0;
    transition:
        transform 0.4s ease,
        opacity 0.3s ease,
        visibility 0.4s;
}

.alert-box.show {
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
}

.alert-box i {
    font-size: 1.2rem;
    cursor: pointer;
    flex-shrink: 0;
}

.alert-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-wrap: anywhere;
}

.alert-text strong {
    font-size: 0.9rem;
}

.alert-text span {
    font-size: 0.8rem;
}

.alert-box.success {
    background: #dcfce7;
    border-left: 5px solid #22c55e;
    color: #166534;
}

.alert-box.success .alert-text strong,
.alert-box.success .alert-text span {
    color: #166534;
}
/* Member authentication UI */
.auth-container {
    --background: linear-gradient(rgba(0, 81, 80, 0.60), rgba(0, 62, 62, 0.60)),
        url('/assets/BG.webp') center center / cover no-repeat;
}

.member-main-wrapper {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 34px 22px;
}

.member-auth-card {
    display: grid;
    grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
    width: min(100%, 1000px);
    min-height: 610px;
    overflow: hidden;
    border-radius: 27px;
    background: #ffffff;
    box-shadow: 0 24px 65px rgba(0, 0, 0, 0.26);
}

.member-brand-side {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 35px clamp(27px, 4vw, 48px) 27px;
    overflow: hidden;
    color: #ffffff;
    background: #020909 url('/assets/BT.webp') center center / cover no-repeat;
}

.member-brand-side::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.08) 48%, rgba(0, 0, 0, 0.05));
    content: '';
}

.member-brand-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    margin-bottom: auto;
}

.member-brand-logo img {
    display: block;
    width: min(180px, 72%);
    height: 56px;
    object-fit: contain;
}

.member-brand-copy {
    margin-top: 35px;
}

.member-eyebrow,
.member-form-kicker {
    display: block;
    color: #10bcb2;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.13em;
    line-height: 1.5;
}

.member-brand-copy h2 {
    margin: 9px 0 9px;
    color: #ffffff;
    font-size: clamp(1.6rem, 2.6vw, 2.25rem);
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.04em;
    text-align: left;
}

.member-brand-copy p {
    max-width: 340px;
    margin: 0;
    color: rgba(255, 255, 255, 0.74);
    font-size: 0.83rem;
    font-style: normal;
    line-height: 1.6;
    text-align: left;
}

.member-step-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 29px 0 0;
    padding: 0;
    list-style: none;
}

.member-step-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding: 11px 13px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.42);
    opacity: 0.68;
    transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.member-step-list li.is-active {
    border-color: rgba(255, 255, 255, 0.9);
    background: #ffffff;
    opacity: 1;
}

.member-step-list li.is-complete {
    border-color: rgba(20, 192, 178, 0.54);
    background: rgba(0, 129, 129, 0.62);
    opacity: 1;
}

.member-step-check {
    display: inline-flex;
    flex: 0 0 25px;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 800;
}

.member-step-list li.is-active .member-step-check {
    border-color: #018181;
    color: #018181;
}

.member-step-list li.is-complete .member-step-check {
    border-color: #ffffff;
    color: #ffffff;
}

.member-step-text {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
}

.member-step-text strong {
    color: #ffffff;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.25;
}

.member-step-list li.is-active .member-step-text strong {
    color: #101515;
}

.member-step-text small {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.64rem;
    line-height: 1.35;
}

.member-step-list li.is-active .member-step-text small {
    color: #6f7777;
}

.member-brand-bottom {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 27px;
    color: rgba(255, 255, 255, 0.61);
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    line-height: 1.5;
}

.member-brand-bottom-line {
    display: block;
    flex: 0 0 27px;
    height: 2px;
    background: #f58020;
}

.member-form-side {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    padding: 42px clamp(27px, 4vw, 48px);
    background: #ffffff;
}

.member-auth-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
}

.member-form-heading {
    margin-bottom: 20px;
    text-align: center;
}

.member-form-kicker {
    margin-bottom: 5px;
    font-size: 0.57rem;
}

.member-form-heading h1 {
    margin: 0 0 7px;
    color: #111515;
    font-size: clamp(1.45rem, 2.3vw, 1.8rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.04em;
    text-align: center;
}

.member-form-heading p {
    margin: 0;
    color: #767d7d;
    font-size: 0.75rem;
    font-style: normal;
    line-height: 1.5;
    text-align: center;
}

.member-social-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 14px;
}

.member-social-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-width: 0;
    min-height: 43px;
    padding: 0 12px;
    border: 1px solid #d3d8d8;
    border-radius: 11px;
    color: #202525;
    background: #ffffff;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.member-social-button:hover {
    border-color: #018181;
    background: #f6fbfb;
    transform: translateY(-1px);
}

.member-social-button i {
    font-size: 1rem;
}

.member-social-button .google-icon {
    color: #7d1204;
}
.member-social-button .meta-icon {
    color: #4285f4;
}

.member-or-divider {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    margin: 1px 0 18px;
}

.member-or-divider span {
    height: 1px;
    background: #e0e4e4;
}

.member-or-divider small {
    color: #929999;
    font-size: 0.7rem;
}

.member-name-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.member-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
    margin-bottom: 13px;
}

.member-field > span {
    color: #202626;
    font-size: 0.72rem;
    font-weight: 750;
    line-height: 1.2;
}

.member-field input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 45px;
    margin: 0;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: 11px;
    outline: none;
    color: #222929;
    background: #f0f1f1;
    box-shadow: none;
    font-family: inherit;
    font-size: 0.75rem;
    font-style: normal;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.member-field input::placeholder {
    color: #8d9494;
    font-size: 0.67rem;
    font-style: normal;
}

.member-field input:focus {
    border-color: #018181;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.1);
}

.member-password-wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.member-password-wrap input {
    padding-right: 45px;
}

.member-password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #707777;
    background: transparent;
    font-size: 0.95rem;
    cursor: pointer;
    transform: translateY(-50%);
}

.member-password-toggle:hover {
    color: #018181;
}

.member-password-toggle:focus-visible {
    outline: 2px solid #018181;
    outline-offset: 1px;
}

.member-password-hint {
    margin: -5px 0 15px;
    color: #626a6a;
    font-size: 0.66rem;
    font-style: normal;
    line-height: 1.4;
    text-align: left;
}

.member-forgot-password {
    align-self: flex-end;
    margin: -2px 0 18px;
    padding: 0;
    border: 0;
    color: #018181;
    background: transparent;
    font-family: inherit;
    font-size: 0.7rem;
    font-weight: 700;
    cursor: pointer;
}

.member-forgot-password:hover {
    color: #f58020;
}

.member-submit-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 46px;
    margin: 3px 0 0;
    padding: 0 17px;
    border: 0;
    border-radius: 11px;
    color: #ffffff;
    background: linear-gradient(100deg, #078d8a 0%, #00645f 100%);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 800;
    cursor: pointer;
    transition: filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.member-submit-button:hover {
    filter: brightness(1.04);
    box-shadow: 0 7px 18px rgba(1, 129, 129, 0.18);
    transform: translateY(-1px);
}

.member-submit-button i {
    font-size: 0.9rem;
}

.member-form-switch {
    margin: 17px 0 0;
    color: #626969;
    font-size: 0.72rem;
    font-style: normal;
    line-height: 1.5;
    text-align: center;
}

.member-form-switch button {
    padding: 0;
    border: 0;
    color: #111515;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: 800;
    cursor: pointer;
}

.member-form-switch button:hover {
    color: #018181;
}

@media (max-width: 760px) {
    .auth-container {
        --background: linear-gradient(rgba(0, 81, 80, 0.60), rgba(0, 62, 62, 0.60)),
            url('/assets/BG.webp') center center / cover no-repeat;
    }

    .member-main-wrapper {
        min-height: 100%;
        padding: 22px 12px 25px;
    }

    .member-auth-card {
        display: flex;
        flex-direction: column;
        width: min(100%, 430px);
        min-height: 0;
        border-radius: 20px;
    }

    .member-brand-side {
        display: flex;
        flex: 0 0 auto;
        gap: 12px;
        padding: 15px 19px 17px;
        background-image: url('/assets/BT2.webp');
        background-position: center;
        background-size: cover;
    }

    .member-brand-side::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.04));
    }

    .member-brand-logo {
        min-height: 34px;
        margin: 0;
    }

    .member-brand-logo img {
        width: 118px;
        height: 38px;
    }

    .member-brand-copy {
        margin-top: 0;
        text-align: center;
    }

    .member-eyebrow {
        font-size: 0.52rem;
    }

    .member-brand-copy h2 {
        margin: 3px 0 4px;
        font-size: 1.15rem;
        text-align: center;
    }

    .member-brand-copy p {
        max-width: 310px;
        margin: 0 auto;
        font-size: 0.65rem;
        text-align: center;
    }

    .member-step-list {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
        margin: 2px 0 0;
    }

    .member-step-list li {
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 6px;
        min-width: 0;
        min-height: 68px;
        padding: 8px 4px;
        border-radius: 9px;
        text-align: center;
    }

    .member-step-check {
        flex-basis: 22px;
        width: 22px;
        height: 22px;
        font-size: 0.63rem;
    }

    .member-step-text {
        gap: 0;
    }

    .member-step-text strong {
        font-size: 0.56rem;
        line-height: 1.25;
    }

    .member-step-text small {
        display: none;
    }

    .member-brand-bottom {
        justify-content: center;
        padding-top: 1px;
        font-size: 0.45rem;
    }

    .member-brand-bottom-line {
        flex-basis: 18px;
    }

    .member-form-side {
        padding: 25px 23px 28px;
    }

    .member-auth-form {
        max-width: 100%;
    }

    .member-form-heading {
        margin-bottom: 17px;
    }

    .member-form-heading h1 {
        font-size: 1.48rem;
    }

    .member-form-heading p {
        font-size: 0.69rem;
    }

    .member-social-button {
        min-height: 40px;
        font-size: 0.72rem;
    }

    .member-or-divider {
        margin-bottom: 15px;
    }

    .member-field {
        gap: 6px;
        margin-bottom: 12px;
    }

    .member-field > span {
        font-size: 0.68rem;
    }

    .member-field input {
        height: 43px;
        font-size: 0.72rem;
    }

    .member-submit-button {
        min-height: 44px;
    }

    .member-form-switch {
        margin-top: 15px;
    }
}

@media (max-width: 380px) {
    .member-main-wrapper {
        padding: 14px 8px 20px;
    }

    .member-auth-card {
        width: 100%;
    }

    .member-brand-side {
        padding-right: 12px;
        padding-left: 12px;
    }

    .member-brand-copy h2 {
        font-size: 1.05rem;
    }

    .member-form-side {
        padding-right: 17px;
        padding-left: 17px;
    }

    .member-name-grid {
        gap: 9px;
    }
}

@media (max-width: 760px) {
    ion-content::part(scroll) {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    ion-content::part(scroll)::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
    }
}

/* Dedicated Admin / Personal Trainer portal UI. */
.staff-auth-container {
    --background: linear-gradient(rgba(0, 83, 82, 0.66), rgba(0, 71, 71, 0.66)),
        url('/assets/BG.webp') center center / cover no-repeat;
}

.staff-main-wrapper {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    padding: 32px 22px;
}

.staff-auth-card {
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
    width: min(100%, 930px);
    min-height: 500px;
    overflow: hidden;
    border-radius: 25px;
    background: #ffffff;
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.24);
}

.staff-brand-side {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    margin: 12px 0 12px 12px;
    padding: 28px 25px;
    overflow: hidden;
    border-radius: 25px;
    color: #ffffff;
    background: #030909 url('/assets/BT.webp') center center / cover no-repeat;
}

.staff-brand-side::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.04) 58%, rgba(0, 0, 0, 0.04));
    content: '';
}

.staff-brand-top,
.staff-brand-message {
    position: relative;
    z-index: 1;
}

.staff-overline {
    display: block;
    color: #f4f7f7;
    font-size: 0.55rem;
    font-weight: 800;
    letter-spacing: 0.075em;
    line-height: 1.5;
    text-align: center;
}

.staff-brand-name {
    color: #018181;
}

.staff-overline-divider {
    padding: 0 3px;
    color: #f58020;
}

.staff-brand-top h1 {
    margin: 2px 0 0;
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 800;
    line-height: 1.3;
    text-align: center;
    text-transform: uppercase;
}

.staff-brand-message {
    margin-top: auto;
    padding-top: 48px;
}

.staff-brand-message h2 {
    margin: 0 0 11px;
    color: #ffffff;
    font-size: clamp(1.45rem, 2.3vw, 1.95rem);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.035em;
    text-align: left;
}

.staff-brand-message p {
    max-width: 340px;
    margin: 0;
    color: rgba(255, 255, 255, 0.74);
    font-size: 0.76rem;
    font-style: normal;
    line-height: 1.55;
    text-align: left;
}

.staff-form-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    padding: 27px clamp(28px, 4.3vw, 48px) 25px;
    background: #ffffff;
}

.staff-form-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 6px;
}

.staff-form-logo img {
    display: block;
    width: 190px;
    max-width: 70%;
    height: 64px;
    object-fit: contain;
}

.staff-form-heading {
    margin-bottom: 18px;
    text-align: center;
}

.staff-form-heading h2 {
    margin: 0 0 4px;
    color: #080b0b;
    font-size: 1.38rem;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.035em;
}

.staff-form-heading p {
    max-width: 340px;
    margin: 0 auto;
    color: #555b5b;
    font-size: 0.62rem;
    font-style: normal;
    line-height: 1.45;
    text-align: center;
}

.staff-login-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
}

.staff-field-label {
    margin: 0 0 5px;
    color: #111414;
    font-size: 0.67rem;
    font-weight: 700;
}

.staff-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 0 15px;
}

.staff-input-wrap input {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 39px;
    margin: 0;
    padding: 0 15px 0 38px;
    border: 1px solid #767b7b;
    border-radius: 25px;
    outline: none;
    color: #202626;
    background: #ffffff;
    font-size: 0.69rem;
    font-style: normal;
    box-shadow: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.staff-input-wrap input::placeholder {
    color: #a0a4a4;
    font-size: 0.61rem;
    font-style: normal;
}

.staff-input-wrap input:focus {
    border-color: #018181;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(1, 129, 129, 0.11);
}

.staff-input-icon {
    position: absolute;
    left: 13px;
    z-index: 1;
    color: #b0b5b5;
    font-size: 0.9rem;
    pointer-events: none;
}

.staff-access-note {
    display: flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    margin: -1px 0 13px;
    color: #555b5b;
    font-size: 0.62rem;
    line-height: 1.35;
    cursor: pointer;
}

.staff-password-input {
    padding-right: 42px !important;
}

.staff-password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    padding: 0;
    border: none;
    background: transparent;
    color: #858b8b;
    font-size: 17px;
    cursor: pointer;
    z-index: 2;
}

.staff-password-toggle:hover {
    color: #018181;
}

.staff-password-toggle:focus-visible {
    outline: 2px solid #018181;
    outline-offset: 2px;
    border-radius: 5px;
}
.staff-checkbox {
    appearance: auto;
    flex: 0 0 auto;
    width: 12px;
    height: 12px;
    margin: 0;
    padding: 0;
    accent-color: #018181;
    cursor: pointer;
}

.staff-submit-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 39px;
    margin: 0;
    padding: 0 16px;
    border: 0;
    border-radius: 28px;
    color: #ffffff;
    background: linear-gradient(100deg, #13bcb2 0%, #00615d 100%);
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
    transition: filter 0.2s ease, transform 0.2s ease;
}

.staff-submit-button:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
}

.staff-submit-button i {
    color: #ffffff;
    font-size: 1.13rem;
}

.staff-divider {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 10px;
    margin-top: 13px;
}

.staff-divider span {
    height: 1px;
    background: #d9dddd;
}

.staff-divider strong {
    color: #767b7b;
    font-size: 0.65rem;
    font-weight: 500;
    white-space: nowrap;
}

.staff-tagline {
    margin: 13px 0 0;
    color: #929696;
    font-size: 0.54rem;
    font-style: normal;
    line-height: 1.45;
    text-align: center;
}

.staff-form-bottom {
    margin-top: 19px;
}

.staff-form-bottom strong {
    display: block;
    color: #151919;
    font-size: 0.61rem;
    font-weight: 800;
}

.staff-form-bottom p {
    margin: 3px 0 0;
    color: #8c9191;
    font-size: 0.57rem;
    font-style: normal;
    line-height: 1.45;
    text-align: left;
}

.staff-back-link {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 7px;
    margin: 18px 0 0;
    padding: 0;
    border: 0;
    color: #006b68;
    background: transparent;
    font-size: 0.72rem;
    font-weight: 800;
    text-align: left;
    cursor: pointer;
}

.staff-back-link i {
    font-size: 1.08rem;
}

.staff-back-link:hover {
    color: #f58020;
}

/* Tablet and phone layout: compact BT2.webp header above the white form. */
@media (max-width: 760px) {
    .staff-auth-container {
        --background: linear-gradient(rgba(0, 83, 82, 0.60), rgba(0, 71, 71, 0.60)),
            url('/assets/BG.webp') center center / cover no-repeat;
    }

    .staff-main-wrapper {
        min-height: 100%;
        padding: 24px 12px 28px;
    }

    .staff-auth-card {
        display: flex;
        flex-direction: column;
        width: min(100%, 360px);
        min-height: 0;
        border-radius: 15px;
        box-shadow: 0 14px 38px rgba(0, 0, 0, 0.24);
    }

    .staff-brand-side {
        display: block;
        flex: 0 0 55px;
        height: 55px;
        min-height: 55px;
        margin: 0;
        padding: 8px 16px 5px;
        border-radius: 15px 15px 0 0;
        background-image: url('/assets/BT2.webp');
        background-position: center center;
        background-size: cover;
    }

    .staff-brand-side::before {
        background: rgba(0, 0, 0, 0.08);
    }

    .staff-overline {
        font-size: 0.48rem;
        line-height: 1.25;
    }

    .staff-brand-top h1 {
        margin-top: 1px;
        font-size: 0.62rem;
        line-height: 1.25;
    }

    .staff-brand-message {
        display: none;
    }

    .staff-form-side {
        padding: 16px 27px 25px;
        border-radius: 0 0 15px 15px;
    }

    .staff-form-logo {
        margin-bottom: 1px;
    }

    .staff-form-logo img {
        width: 175px;
        height: 59px;
        max-width: 70%;
    }

    .staff-form-heading {
        margin-bottom: 18px;
    }

    .staff-form-heading h2 {
        font-size: 1.17rem;
    }

    .staff-form-heading p {
        font-size: 0.57rem;
    }

    .staff-field-label {
        font-size: 0.61rem;
    }

    .staff-input-wrap {
        margin-bottom: 14px;
    }

    .staff-input-wrap input {
        height: 35px;
        padding-left: 34px;
        font-size: 0.63rem;
    }

    .staff-input-wrap input::placeholder {
        font-size: 0.56rem;
    }

    .staff-input-icon {
        left: 11px;
        font-size: 0.8rem;
    }

    .staff-access-note {
        gap: 5px;
        margin-bottom: 12px;
        font-size: 0.57rem;
    }

    .staff-checkbox {
        width: 11px;
        height: 11px;
    }

    .staff-submit-button {
        min-height: 35px;
        font-size: 0.68rem;
    }

    .staff-divider {
        gap: 8px;
        margin-top: 12px;
    }

    .staff-divider strong {
        font-size: 0.59rem;
    }

    .staff-tagline {
        margin-top: 11px;
        font-size: 0.49rem;
    }

    .staff-form-bottom {
        margin-top: 18px;
    }

    .staff-form-bottom strong {
        font-size: 0.57rem;
    }

    .staff-form-bottom p {
        font-size: 0.52rem;
    }

    .staff-back-link {
        gap: 6px;
        margin-top: 17px;
        font-size: 0.65rem;
    }
}

@media (max-width: 360px) {
    .staff-main-wrapper {
        padding: 16px 9px 22px;
    }

    .staff-auth-card {
        width: 100%;
    }

    .staff-form-side {
        padding-right: 22px;
        padding-left: 22px;
    }
}

</style>
