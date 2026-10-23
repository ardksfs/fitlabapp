<template>
    <ion-page>
        <ion-content :fullscreen="true" class="pt-content">
            <div class="pt-dashboard">
                <header class="topbar">
                    <div>
                        <span class="eyebrow">PERSONAL TRAINER</span>
                        <h1>PT Dashboard</h1>
                        <p>Manage your clients, training sessions, and fitness programs.</p>
                    </div>

                    <div class="top-actions">
                        <button class="icon-button" aria-label="Notifications" @click="openModal('notifications')">
                            <ion-icon :icon="notificationsOutline" />
                            <span v-if="unreadCount" class="notification-dot"></span>
                        </button>
                        <button class="profile-button" @click="openModal('profile')">
                            <img :src="profile.avatar || avatarFallback" alt="Trainer profile" />
                            <span>
                                <strong>{{ profile.name }}</strong>
                                <small>{{ profile.specialty }}</small>
                            </span>
                            <ion-icon :icon="chevronDownOutline" />
                        </button>
                    </div>
                </header>

                <section class="welcome-banner">
                    <div>
                        <span class="banner-label">FITLAB TRAINER SPACE</span>
                        <h2>Welcome back, {{ firstName }}!</h2>
                        <p>Help your clients build healthier habits and achieve their goals.</p>
                        <button class="banner-button" @click="openModal('schedule')">
                            <ion-icon :icon="calendarOutline" /> Manage Schedule
                        </button>
                    </div>
                    <div class="banner-art">
                        <ion-icon :icon="barbellOutline" />
                    </div>
                </section>

                <section class="stats-grid">
                    <article class="stat-card">
                        <div class="stat-icon teal"><ion-icon :icon="peopleOutline" /></div>
                        <span>Active Clients</span>
                        <strong>{{ activeClients }}</strong>
                        <small>Assigned to you</small>
                    </article>
                    <article class="stat-card">
                        <div class="stat-icon orange"><ion-icon :icon="calendarOutline" /></div>
                        <span>Today's Sessions</span>
                        <strong>{{ todaySessions }}</strong>
                        <small>Scheduled sessions</small>
                    </article>
                    <article class="stat-card">
                        <div class="stat-icon purple"><ion-icon :icon="barbellOutline" /></div>
                        <span>Workout Plans</span>
                        <strong>{{ workouts.length }}</strong>
                        <small>Plans you've created</small>
                    </article>
                    <article class="stat-card">
                        <div class="stat-icon blue"><ion-icon :icon="nutritionOutline" /></div>
                        <span>Diet Plans</span>
                        <strong>{{ diets.length }}</strong>
                        <small>Nutrition programs</small>
                    </article>
                </section>

                <div class="main-grid">
                    <section class="panel">
                        <div class="panel-heading">
                            <div>
                                <h2>Today's Schedule</h2>
                                <p>Manage your training sessions.</p>
                            </div>
                            <button class="text-button" @click="openModal('schedule')">Manage</button>
                        </div>

                        <div v-if="todaySchedule.length" class="session-list">
                            <article v-for="session in todaySchedule" :key="session.id" class="session-item">
                                <div class="session-time">{{ session.time }}</div>
                                <div class="session-info">
                                    <strong>{{ session.client }}</strong>
                                    <small>{{ session.activity }}</small>
                                </div>
                                <span class="status" :class="session.status">{{ session.status }}</span>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="calendarOutline" />
                            <p>No sessions scheduled for today. Use Manage to add or review sessions.</p>
                        </div>
                    </section>

                    <section class="panel">
                        <div class="panel-heading">
                            <div>
                                <h2>Client Overview</h2>
                                <p>Your assigned members.</p>
                            </div>
                            <button class="text-button" @click="openModal('clients')">View All</button>
                        </div>

                        <div v-if="clients.length" class="client-list">
                            <article v-for="client in clients.slice(0, 4)" :key="client.id" class="client-item client-item-enhanced" @click="openClientDetail(client)" role="button" tabindex="0" @keydown.enter="openClientDetail(client)">
                                <div class="client-avatar">{{ initials(client.name) }}</div>
                                <div class="client-info">
                                    <strong>{{ client.name }}</strong>
                                    <small>{{ client.goal }}</small>
                                </div>
                                <div class="client-progress-wrap">
                                    <span class="client-progress">{{ client.progress }}%</span>
                                    <span class="progress-track"><span :style="{ width: `${client.progress}%` }"></span></span>
                                </div>
                            </article>
                        </div>
                        <div v-else class="empty-state">
                            <ion-icon :icon="peopleOutline" />
                            <p>No clients have been assigned yet.</p>
                        </div>
                    </section>
                </div>

                <section class="section">
                    <div class="section-heading">
                        <div>
                            <h2>Manage Fitness Programs</h2>
                            <p>Create and review programs for your clients.</p>
                        </div>
                    </div>

                    <div class="program-grid">
                        <button class="program-card" @click="openModal('workout')">
                            <div class="program-icon teal"><ion-icon :icon="barbellOutline" /></div>
                            <strong>Workout Plans</strong>
                            <small>{{ workouts.length }} plans available</small>
                            <span>Manage plans <ion-icon :icon="arrowForwardOutline" /></span>
                        </button>
                        <button class="program-card" @click="openModal('diet')">
                            <div class="program-icon green"><ion-icon :icon="nutritionOutline" /></div>
                            <strong>Diet Plans</strong>
                            <small>{{ diets.length }} plans available</small>
                            <span>Manage plans <ion-icon :icon="arrowForwardOutline" /></span>
                        </button>
                        <button class="program-card" @click="openModal('clients')">
                            <div class="program-icon purple"><ion-icon :icon="peopleOutline" /></div>
                            <strong>My Clients</strong>
                            <small>{{ clients.length }} assigned clients</small>
                            <span>View clients <ion-icon :icon="arrowForwardOutline" /></span>
                        </button>
                        <button class="program-card" @click="openModal('profile')">
                            <div class="program-icon orange"><ion-icon :icon="personOutline" /></div>
                            <strong>My Profile</strong>
                            <small>Update your information</small>
                            <span>Edit profile <ion-icon :icon="arrowForwardOutline" /></span>
                        </button>
                    </div>
                </section>

                <footer class="pt-footer">
                    <span>© {{ new Date().getFullYear() }} FitLab Gym Management | Fregi Ardika Setyawan</span>
                    <button class="text-button" @click="logout">
                        <ion-icon :icon="logOutOutline" /> Log Out
                    </button>
                </footer>

                <ion-modal :is-open="activeModal !== null" @didDismiss="closeModal" class="pt-modal">
                    <div class="modal-shell">
                        <div class="modal-heading">
                            <div>
                                <span class="eyebrow">FITLAB TRAINER</span>
                                <h2>{{ modalTitle }}</h2>
                            </div>
                            <button class="icon-button" aria-label="Close" @click="closeModal">
                                <ion-icon :icon="closeOutline" />
                            </button>
                        </div>

                        <!-- Profile -->
                        <div v-if="activeModal === 'profile'" class="modal-body">
                            <div class="avatar-editor">
                                <img :src="profile.avatar || avatarFallback" alt="Trainer avatar" />
                                <label class="upload-button">
                                    <ion-icon :icon="cameraOutline" /> Change Photo
                                    <input type="file" accept="image/*" @change="uploadAvatar" />
                                </label>
                            </div>
                            <form class="form-grid" @submit.prevent="saveProfile">
                                <label>
                                    Full Name
                                    <input v-model="profile.name" required maxlength="80" />
                                </label>
                                <label>
                                    Specialty
                                    <input v-model="profile.specialty" required maxlength="100" />
                                </label>
                                <label class="full-width">
                                    Email
                                    <input v-model="profile.email" type="email" required disabled />
                                </label>
                                <label class="full-width">
                                    About Me
                                    <textarea v-model="profile.bio" rows="3" maxlength="400"></textarea>
                                </label>
                                <div class="form-actions full-width">
                                    <button type="button" class="secondary-button" @click="closeModal">Cancel</button>
                                    <button type="submit" class="primary-button">Save Profile</button>
                                </div>
                            </form>
                        </div>

                        <!-- Notifications -->
                        <div v-else-if="activeModal === 'notifications'" class="modal-body">
                            <article v-for="notice in notifications" :key="notice.id" class="notice-item">
                                <div class="notice-icon"><ion-icon :icon="notificationsOutline" /></div>
                                <div>
                                    <strong>{{ notice.title }}</strong>
                                    <p>{{ notice.message }}</p>
                                    <small>{{ notice.date }}</small>
                                </div>
                            </article>
                            <div v-if="!notifications.length" class="empty-state">
                                <p>No notifications yet.</p>
                            </div>
                            <button v-if="unreadCount" class="secondary-button full-width" @click="markRead">
                                Mark All as Read
                            </button>
                        </div>

                        <!-- Schedule -->
                        <div v-else-if="activeModal === 'schedule'" class="modal-body schedule-modal-body">
                            <div class="modal-overview schedule-overview">
                                <div class="overview-icon"><ion-icon :icon="calendarOutline" /></div>
                                <div class="overview-copy">
                                    <span class="field-kicker">SESSION PLANNER</span>
                                    <h3>Keep every session on track</h3>
                                    <p>Choose a date, create a session, and mark completed training without leaving this calendar.</p>
                                </div>
                                <div class="overview-count"><strong>{{ sessions.filter(session => session.status !== 'completed').length }}</strong><small>upcoming</small></div>
                            </div>
                            <div class="schedule-toolbar">
                                <div>
                                    <span class="field-kicker">CALENDAR VIEW</span>
                                    <strong>Plan your training month</strong>
                                    <small>Select any date to review or create a session, including next month.</small>
                                </div>
                                <label class="date-filter-label">Selected date
                                    <input v-model="scheduleDate" type="date" />
                                </label>
                            </div>
                            <section class="month-calendar" aria-label="Monthly schedule calendar">
                                <div class="calendar-month-heading">
                                    <div><span class="field-kicker">MONTHLY OVERVIEW</span><h3>{{ calendarMonthLabel }}</h3></div>
                                    <div class="calendar-nav">
                                        <button type="button" aria-label="Previous month" @click="changeCalendarMonth(-1)">‹</button>
                                        <button type="button" class="calendar-today" @click="scheduleDate = localDateString()">Today</button>
                                        <button type="button" aria-label="Next month" @click="changeCalendarMonth(1)">›</button>
                                    </div>
                                </div>
                                <div class="month-grid month-weekdays">
                                    <span v-for="weekday in calendarWeekdays" :key="weekday">{{ weekday }}</span>
                                </div>
                                <div class="month-grid month-days">
                                    <button v-for="day in monthDays" :key="day.key" type="button"
                                        class="month-day" :class="{ 'outside-month': !day.inMonth, selected: day.date === scheduleDate, 'has-sessions': day.date && sessions.some(s => s.date === day.date), 'is-today': day.date === localDateString() }"
                                        :disabled="!day.inMonth" @click="day.date && (scheduleDate = day.date)">
                                        <strong>{{ day.day }}</strong>
                                        <span v-if="day.inMonth && sessions.some(s => s.date === day.date)" class="calendar-session-count">{{ sessions.filter(s => s.date === day.date).length }} {{ sessions.filter(s => s.date === day.date).length === 1 ? 'session' : 'sessions' }}</span>
                                        <span v-else-if="day.inMonth" class="calendar-empty-label">—</span>
                                    </button>
                                </div>
                                <div class="calendar-legend"><span><i class="legend-dot scheduled"></i> Has sessions</span><span><i class="legend-dot today"></i> Today</span><span><i class="legend-dot selected"></i> Selected date</span></div>
                            </section>
                            <form class="form-grid" @submit.prevent="addSession">
                                <label>
                                    Client
                                    <select v-model="sessionForm.client" required>
                                        <option value="" disabled>Select client</option>
                                        <option v-for="client in clients" :key="client.id" :value="client.name">
                                            {{ client.name }}
                                        </option>
                                    </select>
                                </label>

                                <label>
                                    Session Date
                                    <input v-model="sessionForm.date" type="date" required />
                                </label>
                                <label>
                                    Start Time
                                    <input v-model="sessionForm.time" type="time" required />
                                </label>

                                <label>
                                    End Time
                                    <input v-model="sessionForm.endTime" type="time" required />
                                </label>
                                
                                <label class="full-width">
                                    Activity
                                    <input v-model="sessionForm.activity" required
                                        placeholder="e.g. Strength Training" />
                                </label>
                                <div class="form-actions full-width">
                                    <button type="submit" class="primary-button">Add Session</button>
                                </div>
                            </form>

                            <div class="list-toolbar">
                                <div>
                                    <h3>Sessions on {{ formatDate(scheduleDate) }}</h3>
                                    <p>{{ filteredScheduleSessions.length }} session(s) · All other dates stay saved</p>
                                </div>
                                <input v-model="scheduleSearch" class="inline-search" type="search" placeholder="Search client or activity…" />
                            </div>
                            <article v-for="session in filteredScheduleSessions" :key="session.id" class="manage-row session-manage-row">
                                <div class="session-manage-time">{{ session.time.split('–')[0] }}</div>
                                <div>
                                    <strong>{{ session.client }}</strong>
                                    <small>{{ session.activity }} · {{ session.time }}<br />{{ formatDate(session.date) }}</small>
                                    <span class="mini-status" :class="session.status">{{ session.status }}</span>
                                </div>
                                <div class="session-row-actions">
                                    <button class="secondary-button compact-button" type="button"
                                        @click="toggleSessionStatus(session.id)">
                                        {{ session.status === 'completed' ? 'Reopen' : 'Complete' }}
                                    </button>
                                    <button type="button" class="delete-button" aria-label="Delete session"
                                        @click="removeSession(session.id)">
                                        <ion-icon :icon="trashOutline" />
                                    </button>
                                </div>
                            </article>
                            <div v-if="!filteredScheduleSessions.length" class="empty-state">
                                <ion-icon :icon="calendarOutline" />
                                <p>No sessions match this date and search. Add a session above or choose another date.</p>
                            </div>
                        </div>

                        <!-- Client detail -->
                        <div v-else-if="activeModal === 'client-detail' && selectedClient" class="modal-body">
                            <div class="client-detail-hero">
                                <div class="client-avatar large-avatar">{{ initials(selectedClient.name) }}</div>
                                <div><span class="field-kicker">CLIENT PROFILE</span><h3>{{ selectedClient.name }}</h3><p>{{ selectedClient.goal }}</p></div>
                                <strong>{{ selectedClient.progress }}%</strong>
                            </div>
                            <div class="detail-metric-grid">
                                <div><small>Client ID</small><strong>{{ selectedClient.id }}</strong></div>
                                <div><small>Training sessions</small><strong>{{ sessions.filter(s => s.client === selectedClient?.name).length }}</strong></div>
                                <div><small>Available workout plans</small><strong>{{ workouts.length }}</strong></div>
                            </div>
                            <div class="detail-section">
                                <h3>Progress overview</h3>
                                <div class="progress-track detail-progress"><span :style="{ width: `${selectedClient.progress}%` }"></span></div>
                                <p>Keep the client's plan aligned with their goal: {{ selectedClient.goal }}.</p>
                            </div>
                            <div class="detail-section">
                                <h3>Upcoming and completed sessions</h3>
                                <article v-for="session in sessions.filter(s => s.client === selectedClient?.name)" :key="session.id" class="manage-row">
                                    <div><strong>{{ formatDate(session.date) }} · {{ session.time }}</strong><small>{{ session.activity }}</small></div>
                                    <span class="mini-status" :class="session.status">{{ session.status }}</span>
                                </article>
                                <div v-if="!sessions.some(s => s.client === selectedClient?.name)" class="empty-state"><p>No sessions assigned to this client yet.</p></div>
                            </div>
                            <div class="form-actions"><button class="secondary-button" @click="openModal('clients')">Back to clients</button><button class="primary-button" @click="sessionForm.client = selectedClient!.name; sessionForm.date = scheduleDate; openModal('schedule')">Schedule session</button></div>
                        </div>

                        <!-- Workout plans -->
                        <div v-else-if="activeModal === 'workout'" class="modal-body program-modal-body">
                            <div class="modal-overview workout-overview">
                                <div class="overview-icon"><ion-icon :icon="barbellOutline" /></div>
                                <div class="overview-copy">
                                    <span class="field-kicker">TRAINING LIBRARY</span>
                                    <h3>Build a stronger routine</h3>
                                    <p>Create structured workout plans, then review intensity, category, and duration from one place.</p>
                                </div>
                                <div class="overview-count"><strong>{{ workouts.length }}</strong><small>plans</small></div>
                            </div>
                            <form class="form-grid enhanced-form" @submit.prevent="addWorkout">
                                <label class="full-width">
                                    Plan Name
                                    <input v-model="workoutForm.name" required placeholder="e.g. Full Body Strength" />
                                </label>
                                <label class="full-width">
                                    Assign to Client
                                    <select v-model="workoutForm.clientId">
                                        <option value="">-- Choose a client --</option>
                                        <option v-for="client in clients" :key="client.id" :value="client.id">
                                            {{ client.name }}
                                        </option>
                                    </select>
                                </label>
                                <label>
                                    Category
                                    <select v-model="workoutForm.category">
                                        <option>Strength Training</option>
                                        <option>Cardio</option>
                                        <option>Core Training</option>
                                        <option>Flexibility</option>
                                    </select>
                                </label>
                                <label>
                                    Duration
                                    <input v-model="workoutForm.duration" required placeholder="e.g. 45 minutes" />
                                </label>
                                <label>
                                    Level
                                    <select v-model="workoutForm.level">
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </label>
                                <div class="form-actions full-width">
                                    <button type="submit" class="primary-button">Create Workout Plan</button>
                                </div>
                            </form>

                            <div class="list-toolbar program-list-toolbar">
                                <div><h3>Workout library</h3><p>{{ filteredWorkouts.length }} of {{ workouts.length }} plan(s)</p></div>
                                <input v-model="workoutSearch" class="inline-search" type="search" placeholder="Search name, category, level…" />
                            </div>
                            <article v-for="workout in filteredWorkouts" :key="workout.id" class="manage-row program-manage-row workout-manage-row">
                                <div>
                                    <span class="program-row-kicker">{{ workout.category }}</span>
                                    <strong>{{ workout.name }}</strong>
                                    <small><span>{{ workout.duration }}</span><span class="meta-separator">•</span><span>{{ workout.level }}</span></small>
                                    <small class="assigned-client"><ion-icon :icon="peopleOutline" /> Assigned to: {{ clientName(workout.clientId) }}</small>
                                </div>
                                <button type="button" class="delete-button" aria-label="Delete workout plan"
                                    @click="removeWorkout(workout.id)">
                                    <ion-icon :icon="trashOutline" />
                                </button>
                            </article>
                            <div v-if="!filteredWorkouts.length" class="empty-state">
                                <ion-icon :icon="barbellOutline" />
                                <p>{{ workouts.length ? 'No workout plans match your search.' : 'No workout plans yet. Create your first plan above.' }}</p>
                            </div>
                        </div>

                        <!-- Diet plans -->
                        <div v-else-if="activeModal === 'diet'" class="modal-body program-modal-body">
                            <div class="modal-overview diet-overview">
                                <div class="overview-icon"><ion-icon :icon="nutritionOutline" /></div>
                                <div class="overview-copy">
                                    <span class="field-kicker">NUTRITION LIBRARY</span>
                                    <h3>Fuel every training goal</h3>
                                    <p>Keep nutrition guidance organized by diet type, daily energy target, and practical notes.</p>
                                </div>
                                <div class="overview-count"><strong>{{ diets.length }}</strong><small>plans</small></div>
                            </div>
                            <form class="form-grid enhanced-form" @submit.prevent="addDiet">
                                <label class="full-width">
                                    Diet Plan Name
                                    <input v-model="dietForm.name" required placeholder="e.g. Balanced Fitness Diet" />
                                </label>
                                <label class="full-width">
                                    Assign to Client
                                    <select v-model="dietForm.clientId">
                                        <option value="">-- Choose a client --</option>
                                        <option v-for="client in clients" :key="client.id" :value="client.id">
                                            {{ client.name }}
                                        </option>
                                    </select>
                                </label>
                                <label>
                                    Daily Calories
                                    <input v-model.number="dietForm.calories" type="number" min="1" required />
                                </label>
                                <label>
                                    Diet Type
                                    <select v-model="dietForm.type">
                                        <option>Balanced</option>
                                        <option>High Protein</option>
                                        <option>Weight Loss</option>
                                        <option>Muscle Gain</option>
                                    </select>
                                </label>
                                <label class="full-width">
                                    Description
                                    <textarea v-model="dietForm.description" rows="2" required
                                        placeholder="Describe the nutrition plan"></textarea>
                                </label>
                                <div class="form-actions full-width">
                                    <button type="submit" class="primary-button">Create Diet Plan</button>
                                </div>
                            </form>

                            <div class="list-toolbar program-list-toolbar">
                                <div><h3>Nutrition library</h3><p>{{ filteredDiets.length }} of {{ diets.length }} plan(s)</p></div>
                                <input v-model="dietSearch" class="inline-search" type="search" placeholder="Search plan or diet type…" />
                            </div>
                            <article v-for="diet in filteredDiets" :key="diet.id" class="manage-row program-manage-row diet-manage-row">
                                <div class="diet-row-icon"><ion-icon :icon="nutritionOutline" /></div>
                                <div class="diet-row-copy">
                                    <span class="program-row-kicker">{{ diet.type }}</span>
                                    <strong>{{ diet.name }}</strong>
                                    <small>{{ diet.calories }} kcal/day</small>
                                    <small class="assigned-client"><ion-icon :icon="peopleOutline" /> Assigned to: {{ clientName(diet.clientId) }}</small>
                                    <p>{{ diet.description }}</p>
                                </div>
                                <button type="button" class="delete-button" aria-label="Delete diet plan"
                                    @click="removeDiet(diet.id)">
                                    <ion-icon :icon="trashOutline" />
                                </button>
                            </article>
                            <div v-if="!filteredDiets.length" class="empty-state">
                                <ion-icon :icon="nutritionOutline" />
                                <p>{{ diets.length ? 'No diet plans match your search.' : 'No diet plans yet. Create your first plan above.' }}</p>
                            </div>
                        </div>

                        <!-- Clients -->
                        <div v-else-if="activeModal === 'clients'" class="modal-body clients-modal-body">
                            <div class="modal-overview clients-overview">
                                <div class="overview-icon"><ion-icon :icon="peopleOutline" /></div>
                                <div class="overview-copy">
                                    <span class="field-kicker">CLIENT MANAGEMENT</span>
                                    <h3>Your coaching roster</h3>
                                    <p>Review goals, check progress, open a detailed client profile, or maintain your assigned roster.</p>
                                </div>
                                <div class="overview-count"><strong>{{ clients.length }}</strong><small>clients</small></div>
                            </div>
                            <div class="client-summary-grid">
                                <div><span>Average progress</span><strong>{{ clients.length ? Math.round(clients.reduce((sum, client) => sum + client.progress, 0) / clients.length) : 0 }}%</strong></div>
                                <div><span>Scheduled sessions</span><strong>{{ sessions.filter(session => session.status !== 'completed').length }}</strong></div>
                                <div><span>Completed sessions</span><strong>{{ sessions.filter(session => session.status === 'completed').length }}</strong></div>
                            </div>
                            <div class="list-toolbar">
                                <div><h3>Client roster</h3><p>{{ clients.length }} assigned client(s)</p></div>
                                <input v-model="clientSearch" class="inline-search" type="search" placeholder="Search clients…" />
                            </div>
                            <form class="form-grid" @submit.prevent="addClient">
                                <label>
                                    Client Name
                                    <input v-model="clientForm.name" required placeholder="Full name" />
                                </label>
                                <label>
                                    Fitness Goal
                                    <select v-model="clientForm.goal">
                                        <option>Build Muscle</option>
                                        <option>Lose Weight</option>
                                        <option>Stay Fit</option>
                                        <option>Improve Endurance</option>
                                    </select>
                                </label>
                                <div class="form-actions full-width">
                                    <button type="submit" class="primary-button">Add Client</button>
                                </div>
                            </form>

                            <div class="divider"></div>
                            <article v-for="client in filteredClients" :key="client.id" class="manage-row client-manage-row enhanced-client-row">
                                <div class="client-avatar">{{ initials(client.name) }}</div>
                                <div class="manage-client-info">
                                    <strong>{{ client.name }}</strong>
                                    <small>{{ client.goal }} · Progress {{ client.progress }}%</small>
                                    <span class="client-row-progress"><span :style="{ width: `${client.progress}%` }"></span></span>
                                </div>
                                <button class="secondary-button compact-button" type="button" @click="openClientDetail(client)">Details</button>
                                <button class="delete-button" type="button" aria-label="Remove client"
                                    @click="removeClient(client.id)">
                                    <ion-icon :icon="trashOutline" />
                                </button>
                            </article>
                            <div v-if="!clients.length" class="empty-state">
                                <p>No clients yet.</p>
                            </div>
                        </div>
                    </div>
                </ion-modal>
            </div>

            
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonModal, IonIcon } from '@ionic/vue';
import {
    notificationsOutline,
    chevronDownOutline,
    barbellOutline,
    calendarOutline,
    peopleOutline,
    nutritionOutline,
    arrowForwardOutline,
    personOutline,
    closeOutline,
    cameraOutline,
    trashOutline,
    logOutOutline,
} from 'ionicons/icons';

type ModalName = 'profile' | 'notifications' | 'schedule' | 'workout' | 'diet' | 'clients' | 'client-detail' | null;
type SessionStatus = 'upcoming' | 'completed';

interface TrainerProfile {
    name: string;
    email: string;
    specialty: string;
    bio: string;
    avatar: string;
}

interface Client {
    id: string;
    name: string;
    goal: string;
    progress: number;
}

interface Session {
    id: string;
    client: string;
    time: string;
    date: string;
    activity: string;
    status: SessionStatus;
}

interface WorkoutPlan {
    id: string;
    clientId?: string;
    name: string;
    category: string;
    duration: string;
    level: string;
}

interface DietPlan {
    id: string;
    clientId?: string;
    name: string;
    description: string;
    calories: number;
    type: string;
}

interface Notice {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

interface PTStorage {
    profile: TrainerProfile;
    clients: Client[];
    sessions: Session[];
    workouts: WorkoutPlan[];
    diets: DietPlan[];
    notifications: Notice[];
}

const router = useRouter();
const SESSION_KEY = 'fitlab_session';
const STORAGE_KEY = 'fitlab-pt-dashboard';
const ASSIGNMENTS_KEY = 'fitlab-pt-assignments';

const avatarFallback =
    'https://ui-avatars.com/api/?name=FitLab+Trainer&background=018181&color=ffffff&size=160';

function localDateString(date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const activeModal = ref<ModalName>(null);
const scheduleDate = ref(localDateString());
const scheduleSearch = ref('');
const clientSearch = ref('');
const workoutSearch = ref('');
const dietSearch = ref('');
const selectedClient = ref<Client | null>(null);

const profile = reactive<TrainerProfile>({
    name: 'Owo',
    email: 'owo@fitlab.com',
    specialty: 'Personal Trainer',
    bio: 'Helping members improve their strength, fitness, and healthy habits.',
    avatar: '',
});

const clients = ref<Client[]>([
    { id: 'CL-1001', name: 'HAFIZH MUHAMMAD NAUFAL SIDQI', goal: 'Build Muscle', progress: 75 },
    { id: 'CL-1002', name: 'REIFAL ARIZALDI', goal: 'Lose Weight', progress: 60 },
    { id: 'CL-1003', name: 'FIKRI TAQY PRAWITOHADI', goal: 'Improve Endurance', progress: 85 },
    { id: 'CL-1004', name: 'JEREMY FELIX HERMANTO', goal: 'Increase Flexibility', progress: 50 },
]);

const sessions = ref<Session[]>([
    { id: 'SS-1001', client: 'JEREMY FELIX HERMANTO', time: '08:00 - 09:00', date: localDateString(), activity: 'Strength Training', status: 'upcoming' },
    { id: 'SS-1002', client: 'REIFAL ARIZALDI', time: '10:00 - 11:00', date: localDateString(), activity: 'Cardio Training', status: 'upcoming' },
    { id: 'SS-1003', client: 'FIKRI TAQY PRAWITOHADI', time: '15:00 - 16:00', date: localDateString(), activity: 'Fitness Assessment', status: 'upcoming' },
    { id: 'SS-1004', client: 'HAFIZH MUHAMMAD NAUFAL SIDQI', time: '16:00 - 17:00', date: localDateString(), activity: 'Personal Training', status: 'upcoming' }
]);

const workouts = ref<WorkoutPlan[]>([
    { id: 'WK-1001', name: 'Full Body Strength', category: 'Strength Training', duration: '45 minutes', level: 'Beginner' },
    { id: 'WK-1002', name: 'Cardio Endurance', category: 'Cardio', duration: '30 minutes', level: 'Intermediate' },
]);

const diets = ref<DietPlan[]>([
    { id: 'DT-1001', name: 'Balanced Fitness Diet', description: 'Balanced meals with protein, carbohydrates, and vegetables.', calories: 2000, type: 'Balanced' },
]);

const notifications = ref<Notice[]>([
    { id: 'NT-1001', title: 'Welcome to FitLab', message: 'Your trainer dashboard is ready.', date: 'Today', read: false },
    { id: 'NT-1002', title: 'Review client progress', message: 'Remember to review your clients’ training progress.', date: 'Today', read: false },
]);

const sessionForm = reactive({
    client: '',
    date: localDateString(),
    time: '00:00',
    endTime: '00:00',
    activity: '',
});
watch(scheduleDate, (date) => {
    if (date) sessionForm.date = date;
});

const workoutForm = reactive({ name: '', clientId: '', category: 'Strength Training', duration: '', level: 'Beginner' });
const dietForm = reactive({ name: '', clientId: '', description: '', calories: 2000, type: 'Balanced' });
const clientForm = reactive({ name: '', goal: 'Build Muscle' });

const firstName = computed(() => profile.name.trim().split(/\s+/)[0] || 'Trainer');
const activeClients = computed(() => clients.value.length);
const todaySchedule = computed(() => sessions.value
    .filter((session) => (session.date || localDateString()) === localDateString())
    .slice().sort((a, b) => a.time.localeCompare(b.time)));
const todaySessions = computed(() => todaySchedule.value.length);
const filteredScheduleSessions = computed(() => sessions.value
    .filter((session) => (session.date || localDateString()) === scheduleDate.value)
    .filter((session) => `${session.client} ${session.activity}`.toLowerCase().includes(scheduleSearch.value.toLowerCase()))
    .slice().sort((a, b) => a.time.localeCompare(b.time)));
const filteredClients = computed(() => clients.value.filter((client) =>
    `${client.name} ${client.goal} ${client.id}`.toLowerCase().includes(clientSearch.value.toLowerCase())));
const filteredWorkouts = computed(() => workouts.value.filter((workout) =>
    `${workout.name} ${workout.category} ${workout.level} ${clientName(workout.clientId)}`.toLowerCase().includes(workoutSearch.value.toLowerCase())));
const filteredDiets = computed(() => diets.value.filter((diet) =>
    `${diet.name} ${diet.type} ${diet.description} ${clientName(diet.clientId)}`.toLowerCase().includes(dietSearch.value.toLowerCase())));
const calendarWeekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarMonthLabel = computed(() => {
    const selected = new Date(`${scheduleDate.value || localDateString()}T12:00:00`);
    return selected.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const monthDays = computed(() => {
    const selected = new Date(`${scheduleDate.value || localDateString()}T12:00:00`);
    const year = selected.getFullYear();
    const month = selected.getMonth();
    const first = new Date(year, month, 1, 12);
    const mondayOffset = first.getDay() === 0 ? 6 : first.getDay() - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
    return Array.from({ length: totalCells }, (_, index) => {
        const dayNumber = index - mondayOffset + 1;
        const inMonth = dayNumber >= 1 && dayNumber <= daysInMonth;
        const date = inMonth ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}` : '';
        return { key: `${year}-${month}-${index}`, date, day: inMonth ? dayNumber : '', inMonth };
    });
});

function changeCalendarMonth(offset: number) {
    const current = new Date(`${scheduleDate.value || localDateString()}T12:00:00`);
    const originalDay = current.getDate();
    const targetMonth = new Date(current.getFullYear(), current.getMonth() + offset, 1, 12);
    const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 12).getDate();
    targetMonth.setDate(Math.min(originalDay, lastDay));
    scheduleDate.value = localDateString(targetMonth);
    sessionForm.date = scheduleDate.value;
}
const unreadCount = computed(() => notifications.value.filter((item) => !item.read).length);

const modalTitle = computed(() => {
    const titles: Record<Exclude<ModalName, null>, string> = {
        profile: 'My Profile',
        notifications: 'Notifications',
        schedule: 'Manage Schedule',
        workout: 'Workout Plans',
        diet: 'Diet Plans',
        clients: 'My Clients',
        'client-detail': 'Client Details',
    };
    return activeModal.value ? titles[activeModal.value] : '';
});

function openModal(name: Exclude<ModalName, null>) {
    activeModal.value = name;
    if (name === 'notifications') markRead();
}

function closeModal() {
    activeModal.value = null;
}

function formatDate(value?: string) {
    if (!value) return 'Today';
    const date = new Date(`${value}T12:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function openClientDetail(client: Client) {
    selectedClient.value = client;
    activeModal.value = 'client-detail';
}

function toggleSessionStatus(id: string) {
    sessions.value = sessions.value.map((session) => session.id === id
        ? { ...session, status: session.status === 'completed' ? 'upcoming' : 'completed' }
        : session);
    persistData();
}

function clientName(clientId?: string): string {
    if (!clientId) return 'Not assigned';
    return clients.value.find((client) => client.id === clientId)?.name || 'Client unavailable';
}

function initials(name: string) {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
}

function readStoredData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw) as Partial<PTStorage>;

        if (data.profile) Object.assign(profile, data.profile);
        if (Array.isArray(data.clients)) clients.value = data.clients;
        if (Array.isArray(data.sessions)) sessions.value = data.sessions.map((session) => ({
            ...session,
            date: session.date || localDateString(),
            status: session.status || 'upcoming',
        }));
        if (Array.isArray(data.workouts)) workouts.value = data.workouts;
        if (Array.isArray(data.diets)) diets.value = data.diets;
        if (Array.isArray(data.notifications)) notifications.value = data.notifications;
    } catch (error) {
        console.error('Unable to restore PT dashboard data:', error);
    }
}

function persistData() {
    try {
        const data: PTStorage = {
            profile: { ...profile },
            clients: clients.value,
            sessions: sessions.value,
            workouts: workouts.value,
            diets: diets.value,
            notifications: notifications.value,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Unable to save PT dashboard data:', error);
    }
}


function syncAdminAssignments() {
    try {
        const rawSession = localStorage.getItem(SESSION_KEY);
        const session = rawSession ? JSON.parse(rawSession) as { email?: string; role?: string } : null;
        if (!session?.email || session.role !== 'pt') return;

        const rawAssignments = localStorage.getItem(ASSIGNMENTS_KEY);
        if (!rawAssignments) return; // Keep demo data only until Admin creates the first assignment.

        const assignments = JSON.parse(rawAssignments) as Array<Record<string, unknown>>;
        const assigned = assignments.filter((item) =>
            String(item.trainerEmail || '').toLowerCase() === session.email!.toLowerCase() &&
            item.status === 'assigned' && typeof item.memberEmail === 'string'
        );
        clients.value = assigned.map((item, index) => ({
            id: String(item.memberId || item.memberEmail || `ASSIGNED-${index + 1}`),
            name: String(item.memberName || item.memberEmail || 'FitLab Member'),
            goal: String(item.goal || 'General Fitness'),
            progress: Number.isFinite(Number(item.progress)) ? Math.max(0, Math.min(100, Number(item.progress))) : 0,
        }));
    } catch (error) {
        console.error('Unable to sync Admin trainer assignments:', error);
    }
}

function saveProfile() {
    profile.name = profile.name.trim();
    profile.specialty = profile.specialty.trim();
    persistData();
    closeModal();
}

function uploadAvatar(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        window.alert('Pilih file gambar yang valid.');
        input.value = '';
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        window.alert('Ukuran foto maksimal 2 MB.');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            profile.avatar = reader.result;
            persistData();
        }
    };
    reader.onerror = () => window.alert('Foto gagal dibaca.');
    reader.readAsDataURL(file);
}

function markRead() {
    notifications.value = notifications.value.map((item) => ({ ...item, read: true }));
    persistData();
}

function addSession() {
    if (!clients.value.some((client) => client.name === sessionForm.client)) {
        window.alert('Pilih klien yang tersedia terlebih dahulu.');
        return;
    }

    if (sessionForm.endTime <= sessionForm.time) {
        window.alert('Jam selesai harus lebih besar dari jam mulai.');
        return;
    }

    if (!sessionForm.activity.trim()) {
        window.alert('Masukkan aktivitas latihan terlebih dahulu.');
        return;
    }

    sessions.value.push({
        id: `SS-${Date.now()}`,
        client: sessionForm.client,
        date: sessionForm.date || scheduleDate.value || localDateString(),
        time: `${sessionForm.time}–${sessionForm.endTime}`,
        activity: sessionForm.activity.trim(),
        status: 'upcoming',
    });

    sessions.value.sort((a, b) => a.time.localeCompare(b.time));

    scheduleDate.value = sessionForm.date || scheduleDate.value;
    sessionForm.client = '';
    sessionForm.date = scheduleDate.value;
    sessionForm.time = '09:00';
    sessionForm.endTime = '10:00';
    sessionForm.activity = '';

    persistData();
}
function removeSession(id: string) {
    sessions.value = sessions.value.filter((item) => item.id !== id);
    persistData();
}

function addWorkout() {
    workouts.value.push({
        id: `WK-${Date.now()}`,
        clientId: workoutForm.clientId || undefined,
        name: workoutForm.name.trim(),
        category: workoutForm.category,
        duration: workoutForm.duration.trim(),
        level: workoutForm.level,
    });

    workoutForm.name = '';
    workoutForm.clientId = '';
    workoutForm.duration = '';
    persistData();
}

function removeWorkout(id: string) {
    workouts.value = workouts.value.filter((item) => item.id !== id);
    persistData();
}

function addDiet() {
    diets.value.push({
        id: `DT-${Date.now()}`,
        clientId: dietForm.clientId || undefined,
        name: dietForm.name.trim(),
        description: dietForm.description.trim(),
        calories: dietForm.calories,
        type: dietForm.type,
    });

    dietForm.name = '';
    dietForm.clientId = '';
    dietForm.description = '';
    dietForm.calories = 2000;
    persistData();
}

function removeDiet(id: string) {
    diets.value = diets.value.filter((item) => item.id !== id);
    persistData();
}

function addClient() {
    const name = clientForm.name.trim();

    if (clients.value.some((client) => client.name.toLowerCase() === name.toLowerCase())) {
        window.alert('Klien dengan nama tersebut sudah ada.');
        return;
    }

    clients.value.push({
        id: `CL-${Date.now()}`,
        name,
        goal: clientForm.goal,
        progress: 0,
    });

    clientForm.name = '';
    clientForm.goal = 'Build Muscle';
    persistData();
}

function removeClient(id: string) {
    const client = clients.value.find((item) => item.id === id);
    if (!client) return;

    clients.value = clients.value.filter((item) => item.id !== id);
    sessions.value = sessions.value.filter((item) => item.client !== client.name);
    persistData();
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    void router.replace({
        path: '/login',
        query: { role: 'pt' }
    });
}

function validateRole() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) {
            void router.replace('/login');
            return;
        }

        const session = JSON.parse(raw) as { role?: string; email?: string; name?: string };

        if (session.role !== 'pt') {
            if (session.role === 'admin') void router.replace('/admin/dashboard');
            else if (session.role === 'member') void router.replace('/user/dashboard');
            else void router.replace('/login');
            return;
        }

        if (session.email) profile.email = session.email;
        if (session.name && profile.name === 'Owy') profile.name = session.name;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        void router.replace('/login');
    }
}

watch(
    [profile, clients, sessions, workouts, diets, notifications],
    () => persistData(),
    { deep: true },
);

onMounted(() => {
    validateRole();
    readStoredData();
    syncAdminAssignments();

    // The login session is authoritative for the signed-in trainer.
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
        try {
            const session = JSON.parse(raw) as { role?: string; email?: string; name?: string };
            if (session.role === 'pt') {
                if (session.email) profile.email = session.email;
                if (session.name && profile.name === 'Owy') profile.name = session.name;
            }
        } catch {
            // validateRole handles malformed sessions.
        }
    }
});
</script>

<style scoped>
.pt-content {
    --background: #f5f7fa;
}

.pt-dashboard {
    max-width: 1600px;
    margin: 0 auto;
    padding: 28px 30px;
    color: #17212f;
    font-family: 'Poppins', sans-serif;
}

.topbar,
.top-actions,
.profile-button,
.panel-heading,
.section-heading,
.session-item,
.client-item,
.pt-footer {
    display: flex;
    align-items: center;
}

.topbar,
.panel-heading,
.section-heading,
.pt-footer {
    justify-content: space-between;
    gap: 18px;
}

.topbar {
    margin-bottom: 25px;
}

.topbar h1 {
    margin: 5px 0;
    font-size: 24px;
}

.topbar p,
.panel-heading p,
.section-heading p {
    margin: 4px 0 0;
    color: #8994a3;
    font-size: 11px;
    line-height: 1.7;
}

.eyebrow,
.banner-label {
    color: #018181;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.2px;
}

.top-actions {
    gap: 12px;
}

.icon-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: 1px solid #e6ebef;
    border-radius: 12px;
    background: #fff;
    color: #516073;
    font-size: 20px;
    cursor: pointer;
}

.icon-button:hover {
    border-color: #018181;
    color: #018181;
}

.notification-dot {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #f58020;
}

.profile-button {
    gap: 10px;
    padding: 5px 10px 5px 5px;
    border: 1px solid #e6ebef;
    border-radius: 13px;
    background: #fff;
    text-align: left;
    cursor: pointer;
}

.profile-button img {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    object-fit: cover;
}

.profile-button strong,
.profile-button small {
    display: block;
}

.profile-button strong {
    max-width: 150px;
    overflow: hidden;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.profile-button small {
    margin-top: 4px;
    color: #8994a3;
    font-size: 10px;
}

.profile-button>ion-icon {
    color: #8994a3;
}

.welcome-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 215px;
    overflow: hidden;
    padding: 32px 38px;
    border-radius: 20px;
    background: linear-gradient(115deg, #006d6d, #018181 65%, #079999);
    color: #fff;
}

.banner-label {
    color: #a8e8e1;
}

.welcome-banner h2 {
    margin: 12px 0 8px;
    font-size: clamp(24px, 3vw, 34px);
}

.welcome-banner p {
    max-width: 500px;
    margin: 0 0 22px;
    color: #d6f2ef;
    font-size: 12px;
    line-height: 1.8;
}

.banner-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 15px;
    border: 0;
    border-radius: 9px;
    background: #fff;
    color: #007676;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
}

.banner-button:hover {
    background: #e7f7f5;
}

.banner-art {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    margin-right: 30px;
    border: 1px solid rgb(255 255 255 / 20%);
    border-radius: 50%;
    background: rgb(255 255 255 / 7%);
    color: rgb(255 255 255 / 45%);
    font-size: 90px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    margin-top: 23px;
}

.stat-card {
    min-width: 0;
    padding: 20px;
    border: 1px solid #e8edf1;
    border-radius: 15px;
    background: #fff;
}

.stat-icon,
.program-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 12px;
}

.stat-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 15px;
    font-size: 20px;
}

.teal {
    background: #e1f5f3;
    color: #018181;
}

.orange {
    background: #fff0e2;
    color: #ee861c;
}

.purple {
    background: #f0eaff;
    color: #8157d9;
}

.blue {
    background: #e6efff;
    color: #3978dc;
}

.green {
    background: #e3f7e9;
    color: #249651;
}

.stat-card>span {
    display: block;
    color: #7e8a9a;
    font-size: 11px;
}

.stat-card>strong {
    display: block;
    margin: 7px 0;
    font-size: 25px;
}

.stat-card>small {
    color: #a0a9b5;
    font-size: 10px;
}

.main-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 19px;
    margin-top: 25px;
}

.panel {
    min-width: 0;
    padding: 22px;
    border: 1px solid #e8edf1;
    border-radius: 16px;
    background: #fff;
}

.panel-heading {
    margin-bottom: 18px;
}

.panel-heading h2,
.section-heading h2 {
    margin: 0;
    font-size: 16px;
}

.text-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 0;
    border: 0;
    background: transparent;
    color: #018181;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.text-button:hover {
    color: #f58020;
}

.session-list,
.client-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.session-item {
    gap: 12px;
    padding: 13px;
    border: 1px solid #edf0f3;
    border-radius: 11px;
}

.session-time {
    width: 46px;
    flex-shrink: 0;
    color: #018181;
    font-size: 11px;
    font-weight: 700;
}

.session-info {
    flex: 1;
    min-width: 0;
}

.session-info strong,
.session-info small {
    display: block;
}

.session-info strong {
    font-size: 11px;
}

.session-info small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
}

.status {
    padding: 5px 8px;
    border-radius: 7px;
    background: #fff4df;
    color: #a66b00;
    font-size: 9px;
    font-weight: 600;
    text-transform: capitalize;
}

.status.completed {
    background: #e5f7ed;
    color: #18844d;
}

.client-item {
    gap: 11px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f2f5;
}

.client-item:last-child {
    border-bottom: 0;
}

.client-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 12px;
    background: #e3f5f3;
    color: #018181;
    font-size: 11px;
    font-weight: 700;
}

.client-info {
    flex: 1;
    min-width: 0;
}

.client-info strong,
.client-info small {
    display: block;
}

.client-info strong {
    font-size: 11px;
}

.client-info small {
    margin-top: 4px;
    color: #8994a3;
    font-size: 10px;
}

.client-progress {
    color: #018181;
    font-size: 11px;
    font-weight: 700;
}

.section {
    margin-top: 30px;
}

.section-heading {
    margin-bottom: 16px;
}

.program-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 15px;
}

.program-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    min-height: 160px;
    padding: 19px;
    border: 1px solid #e8edf1;
    border-radius: 15px;
    background: #fff;
    color: #17212f;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
}

.program-card:hover {
    transform: translateY(-2px);
    border-color: #8acbc5;
}

.program-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 15px;
    font-size: 21px;
}

.program-card>strong {
    font-size: 12px;
}

.program-card>small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
}

.program-card>span {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: auto;
    padding-top: 15px;
    color: #018181;
    font-size: 10px;
    font-weight: 600;
}

.pt-footer {
    margin-top: 34px;
    padding: 18px 0 7px;
    border-top: 1px solid #e7ebf0;
    color: #939eac;
    font-size: 10px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 25px 10px;
    color: #8994a3;
    text-align: center;
}

.empty-state ion-icon {
    color: #a7b3bd;
    font-size: 27px;
}

.empty-state p {
    margin: 0;
    font-size: 11px;
    line-height: 1.7;
}

.modal-shell {
    min-height: 100%;
    padding: 25px;
    background: #fff;
    color: #17212f;
    font-family: 'Poppins', sans-serif;
}

.modal-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 22px;
    padding-bottom: 17px;
    border-bottom: 1px solid #edf0f3;
}

.modal-heading .eyebrow {
    color: #018181;
}

.modal-heading h2 {
    margin: 6px 0 0;
    font-size: 21px;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.avatar-editor {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar-editor img {
    width: 75px;
    height: 75px;
    border: 3px solid #e3f5f3;
    border-radius: 18px;
    object-fit: cover;
}

.upload-button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 12px;
    border: 1px solid #dfe7eb;
    border-radius: 9px;
    color: #018181;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

.upload-button input {
    display: none;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
}

.form-grid label {
    display: flex;
    flex-direction: column;
    gap: 7px;
    color: #475467;
    font-size: 11px;
    font-weight: 600;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
    width: 100%;
    min-height: 41px;
    padding: 10px 12px;
    border: 1px solid #dfe5eb;
    border-radius: 9px;
    outline: none;
    background: #fff;
    color: #263445;
    font-family: inherit;
    font-size: 12px;
}

.form-grid input:focus,
.form-grid select:focus,
.form-grid textarea:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgb(1 129 129 / 8%);
}

.form-grid input:disabled {
    background: #f3f5f7;
    color: #8a94a3;
}

.full-width {
    grid-column: 1 / -1;
    width: 100%;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.primary-button,
.secondary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 41px;
    padding: 10px 14px;
    border: 1px solid transparent;
    border-radius: 9px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
}

.primary-button {
    background: #018181;
    color: #fff;
}

.primary-button:hover {
    background: #006d6d;
}

.secondary-button {
    border-color: #dfe5eb;
    background: #fff;
    color: #526174;
}

.secondary-button:hover {
    border-color: #018181;
    color: #018181;
}

.notice-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border: 1px solid #edf0f3;
    border-radius: 11px;
}

.notice-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #e3f5f3;
    color: #018181;
    font-size: 18px;
}

.notice-item strong {
    font-size: 12px;
}

.notice-item p {
    margin: 5px 0;
    color: #667486;
    font-size: 11px;
    line-height: 1.6;
}

.notice-item small {
    color: #99a3b0;
    font-size: 10px;
}

.divider {
    height: 1px;
    margin: 5px 0;
    background: #edf0f3;
}

.manage-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #edf0f3;
    border-radius: 10px;
}

.manage-row>div:not(.client-avatar) {
    flex: 1;
    min-width: 0;
}

.manage-row strong,
.manage-row small {
    display: block;
}

.manage-row strong {
    font-size: 11px;
    overflow-wrap: anywhere;
}

.manage-row small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 10px;
    line-height: 1.5;
}

.manage-client-info {
    flex: 1;
    min-width: 0;
}

.delete-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    border: 1px solid #f5dede;
    border-radius: 9px;
    background: #fff5f5;
    color: #d94a4a;
    font-size: 17px;
    cursor: pointer;
}

.delete-button:hover {
    background: #ffe7e7;
}

@media (max-width: 1100px) {

    .stats-grid,
    .program-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .banner-art {
        margin-right: 0;
    }
}

@media (max-width: 760px) {
    .pt-dashboard {
        padding: 17px;
    }

    .topbar {
        align-items: flex-start;
    }

    .topbar h1 {
        font-size: 20px;
    }

    .topbar p {
        max-width: 280px;
    }

    .top-actions {
        gap: 7px;
    }

    .profile-button {
        padding: 3px;
        border: 0;
        background: transparent;
    }

    .profile-button img {
        width: 35px;
        height: 35px;
    }

    .profile-button>span,
    .profile-button>ion-icon {
        display: none;
    }

    .welcome-banner {
        min-height: 200px;
        padding: 25px 21px;
    }

    .welcome-banner h2 {
        font-size: 25px;
    }

    .welcome-banner p {
        max-width: 320px;
        font-size: 11px;
    }

    .banner-art {
        position: absolute;
        right: -48px;
        bottom: -40px;
        width: 140px;
        height: 140px;
        font-size: 75px;
    }

    .stats-grid {
        gap: 11px;
    }

    .stat-card {
        padding: 15px;
    }

    .stat-card>strong {
        font-size: 22px;
    }

    .main-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 15px;
    }

    .panel {
        padding: 17px;
    }

    .program-grid {
        gap: 11px;
    }

    .program-card {
        min-height: 150px;
        padding: 15px;
    }

    .modal-shell {
        padding: 21px 16px;
    }
}

@media (max-width: 420px) {
    .pt-dashboard {
        padding: 12px;
    }

    .topbar {
        gap: 8px;
    }

    .topbar h1 {
        font-size: 18px;
    }

    .topbar p {
        font-size: 10px;
    }

    .top-actions .icon-button {
        width: 35px;
        height: 35px;
    }

    .welcome-banner {
        padding: 22px 17px;
    }

    .welcome-banner h2 {
        font-size: 22px;
    }

    .welcome-banner p {
        font-size: 10px;
    }

    .banner-button {
        padding: 10px 11px;
        font-size: 10px;
    }

    .stat-card {
        padding: 12px;
    }

    .stat-card>span {
        font-size: 10px;
        line-height: 1.5;
    }

    .stat-card>strong {
        font-size: 20px;
    }

    .stat-card>small {
        font-size: 9px;
    }

    .session-item {
        gap: 8px;
        padding: 10px;
    }

    .session-time {
        width: 40px;
        font-size: 10px;
    }

    .status {
        padding: 4px 6px;
        font-size: 8px;
    }

    .program-card>strong {
        font-size: 11px;
    }

    .program-card>small,
    .program-card>span {
        font-size: 9px;
    }

    .form-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    .full-width {
        grid-column: auto;
    }

    .schedule-toolbar,
    .list-toolbar {
        align-items: stretch;
        flex-direction: column;
    }

    .date-filter-label,
    .inline-search {
        width: 100%;
    }

    .week-strip {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .session-row-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .form-actions .primary-button,
    .form-actions .secondary-button {
        flex: 1;
        padding: 9px;
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

/* Dashboard detail refresh: calendar, searchable lists, progress and accessible actions */
.client-item-enhanced {
    cursor: pointer;
    border-radius: 10px;
    padding-right: 9px;
    transition: background .18s ease;
}

.client-item-enhanced:hover,
.client-item-enhanced:focus-visible {
    background: #f6fbfb;
    outline: none;
}

.client-progress-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    min-width: 54px;
}

.progress-track {
    display: block;
    width: 62px;
    height: 5px;
    overflow: hidden;
    border-radius: 99px;
    background: #e9eff2;
}

.progress-track>span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #018181, #48b8a9);
    transition: width .25s ease;
}

.schedule-toolbar,
.list-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 15px;
    border: 1px solid #e5efef;
    border-radius: 13px;
    background: linear-gradient(120deg, #f3fbfa, #fff);
}

.schedule-toolbar>div,
.list-toolbar>div {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.schedule-toolbar strong,
.list-toolbar h3 {
    margin: 0;
    font-size: 13px;
    color: #17212f;
}

.schedule-toolbar small,
.list-toolbar p {
    margin: 0;
    color: #8994a3;
    font-size: 10px;
}

.field-kicker {
    color: #018181;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 1.1px;
}

.date-filter-label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: #667486;
    font-size: 10px;
    font-weight: 600;
}

.date-filter-label input,
.inline-search {
    min-height: 38px;
    padding: 8px 10px;
    border: 1px solid #dfe7eb;
    border-radius: 9px;
    background: #fff;
    color: #263445;
    font: inherit;
    font-size: 11px;
    outline: none;
}

.date-filter-label input:focus,
.inline-search:focus {
    border-color: #018181;
    box-shadow: 0 0 0 3px rgb(1 129 129 / 8%);
}

.inline-search {
    width: min(240px, 100%);
}

.week-strip {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 7px;
}

.week-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 4px;
    border: 1px solid #e8edf1;
    border-radius: 10px;
    background: #fff;
    color: #667486;
    cursor: pointer;
    transition: .18s ease;
}

.week-day small {
    font-size: 9px;
}

.week-day strong {
    color: #17212f;
    font-size: 17px;
}

.week-day span {
    color: #99a3b0;
    font-size: 8px;
    text-align: center;
}

.week-day.selected {
    border-color: #018181;
    background: #eaf8f6;
    box-shadow: inset 0 0 0 1px #018181;
}

.week-day.selected strong,
.week-day.selected small {
    color: #018181;
}

.week-day.has-sessions:not(.selected) {
    border-bottom: 3px solid #f0a04b;
}

.session-manage-row {
    align-items: center;
}

.session-manage-time {
    display: grid;
    place-items: center;
    min-width: 51px;
    min-height: 48px;
    border-radius: 10px;
    background: #e3f5f3;
    color: #018181;
    font-size: 11px;
    font-weight: 800;
}

.session-manage-row>div:nth-child(2) {
    flex: 1;
    min-width: 0;
}

.session-row-actions {
    display: flex;
    align-items: center;
    gap: 7px;
}

.compact-button {
    min-height: 34px;
    padding: 7px 9px;
    white-space: nowrap;
}

.mini-status {
    display: inline-flex;
    margin-top: 7px;
    padding: 4px 7px;
    border-radius: 6px;
    background: #fff4df;
    color: #a66b00;
    font-size: 9px;
    font-weight: 700;
    text-transform: capitalize;
}

.mini-status.completed {
    background: #e5f7ed;
    color: #18844d;
}

.client-manage-row .manage-client-info {
    min-width: 0;
}

.modal-progress {
    width: min(180px, 100%);
    margin-top: 8px;
}

.client-detail-hero {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    border: 1px solid #e2efed;
    border-radius: 15px;
    background: linear-gradient(120deg, #f0faf8, #fff);
}

.client-detail-hero>div:nth-child(2) {
    flex: 1;
    min-width: 0;
}

.client-detail-hero h3 {
    margin: 4px 0;
    font-size: 17px;
}

.client-detail-hero p {
    margin: 0;
    color: #8994a3;
    font-size: 11px;
}

.client-detail-hero>strong {
    color: #018181;
    font-size: 20px;
}

.large-avatar {
    width: 55px;
    height: 55px;
    font-size: 15px;
}

.detail-metric-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}

.detail-metric-grid>div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
    border: 1px solid #edf0f3;
    border-radius: 11px;
    min-width: 0;
}

.detail-metric-grid small {
    color: #8994a3;
    font-size: 9px;
}

.detail-metric-grid strong {
    font-size: 12px;
    overflow-wrap: anywhere;
}

.detail-section {
    padding: 16px;
    border: 1px solid #edf0f3;
    border-radius: 12px;
}

.detail-section h3 {
    margin: 0 0 12px;
    font-size: 13px;
}

.detail-section p {
    margin: 10px 0 0;
    color: #8994a3;
    font-size: 11px;
    line-height: 1.6;
}

.detail-progress {
    width: 100%;
    height: 8px;
}

.pt-modal {
    --width: min(760px, calc(100vw - 28px));
    --height: min(90vh, 920px);
    --border-radius: 20px;
}

.pt-modal::part(content) {
    overflow: auto;
    border-radius: 20px;
}

.pt-modal .modal-shell {
    min-height: 100%;
}

button:focus-visible,
[role="button"]:focus-visible {
    outline: 3px solid rgb(1 129 129 / 28%);
    outline-offset: 2px;
}

@media (max-width: 760px) {
    .pt-modal {
        --width: 100%;
        --height: 100%;
        --border-radius: 0;
    }

    .pt-modal::part(content) {
        border-radius: 0;
    }

    .week-strip {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .schedule-toolbar,
    .list-toolbar {
        align-items: stretch;
        flex-direction: column;
    }

    .date-filter-label,
    .inline-search {
        width: 100%;
    }

    .session-manage-row {
        flex-wrap: wrap;
    }

    .session-row-actions {
        margin-left: auto;
    }

    .detail-metric-grid {
        grid-template-columns: 1fr;
    }
}

/* Modal UX refresh: independent inner scrolling, clear hierarchy and richer management cards */
.pt-modal::part(content) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overscroll-behavior: contain;
}
.pt-modal .modal-shell {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}
.pt-modal .modal-heading {
    flex: 0 0 auto;
}
.pt-modal .modal-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 3px 12px 0;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: #b8d9d6 transparent;
    -webkit-overflow-scrolling: touch;
}.pt-modal .modal-body::-webkit-scrollbar {
    width: 6px;
}

.pt-modal .modal-body::-webkit-scrollbar-thumb {
    border-radius: 20px;
    background: #b8d9d6;
}

.modal-overview {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 19px;
    border: 1px solid #dcefeb;
    border-radius: 16px;
    background: linear-gradient(115deg, #f0faf8, #fff 72%);
}

.modal-overview .overview-icon {
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    border-radius: 14px;
    background: #dff4f1;
    color: #018181;
    font-size: 24px;
}

.diet-overview .overview-icon {
    background: #e4f7e9;
    color: #249651;
}

.clients-overview .overview-icon {
    background: #f0eaff;
    color: #8157d9;
}

.overview-copy {
    flex: 1;
    min-width: 0;
}

.overview-copy h3 {
    margin: 5px 0 6px;
    font-size: 16px;
    line-height: 1.4;
}

.overview-copy p {
    margin: 0;
    color: #778596;
    font-size: 10px;
    line-height: 1.7;
}

.overview-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 62px;
    min-height: 62px;
    padding: 8px;
    border-radius: 13px;
    background: #fff;
    border: 1px solid #e7efef;
}

.overview-count strong {
    color: #018181;
    font-size: 22px;
    line-height: 1.1;
}

.overview-count small {
    margin-top: 5px;
    color: #8994a3;
    font-size: 9px;
}

.enhanced-form {
    padding: 18px;
    border: 1px solid #edf0f3;
    border-radius: 14px;
    background: #fbfcfd;
}

.program-list-toolbar {
    margin-top: 4px;
}

.assigned-client {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 7px;
    color: #018181 !important;
    font-size: 11px !important;
}

.program-manage-row {
    align-items: center;
    padding: 15px;
    border-radius: 13px;
    background: #fff;
    transition: border-color .18s ease, box-shadow .18s ease;
}

.program-manage-row:hover {
    border-color: #c8e4e0;
    box-shadow: 0 5px 18px rgb(23 33 47 / 4%);
}

.program-row-kicker {
    display: block;
    margin-bottom: 4px;
    color: #018181;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: .65px;
    text-transform: uppercase;
}

.workout-manage-row>div:first-child {
    flex: 1;
    min-width: 0;
}

.workout-manage-row strong,
.diet-row-copy strong {
    font-size: 12px;
}

.workout-manage-row small {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 7px;
}

.meta-separator {
    color: #f58020;
}

.diet-row-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 12px;
    background: #e4f7e9;
    color: #249651;
    font-size: 20px;
}.diet-row-copy {
    flex: 1;
    min-width: 0;
}

.diet-row-copy p {
    margin: 8px 0 0;
    color: #778596;
    font-size: 10px;
    line-height: 1.65;
    overflow-wrap: anywhere;
}

.client-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
}
.client-summary-grid > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    padding: 14px;
    border: 1px solid #edf0f3;
    border-radius: 12px;
    background: #fff;
}.client-summary-grid span {
    color: #8994a3;
    font-size: 9px;
    line-height: 1.5;
}

.client-summary-grid strong {
    color: #17212f;
    font-size: 20px;
}

.enhanced-client-row {
    gap: 10px;
}

.enhanced-client-row .manage-client-info {
    flex: 1;
}

.client-row-progress {
    display: block;
    width: 100%;
    height: 5px;
    margin-top: 9px;
    overflow: hidden;
    border-radius: 99px;
    background: #edf1f3;
}

.client-row-progress>span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #018181, #48b8a9);
}

.client-detail-hero {
    flex-wrap: wrap;
}

@media (max-width: 760px) {
    .pt-modal::part(content) {
        display: flex;
        overflow: hidden;
    }

    .pt-modal .modal-shell {
        height: 100%;
        min-height: 0;
        padding: 18px 14px;
    }

    .pt-modal .modal-body {
        min-height: 0;
        padding-bottom: 24px;
    }

    .modal-overview {
        align-items: flex-start;
        gap: 10px;
        padding: 14px;
    }

    .modal-overview .overview-icon {
        width: 40px;
        height: 40px;
        flex-basis: 40px;
        font-size: 20px;
    }

    .overview-copy h3 {
        font-size: 14px;
    }

    .overview-copy p {
        font-size: 9px;
    }

    .overview-count {
        min-width: 48px;
        min-height: 48px;
        padding: 6px;
    }

    .overview-count strong {
        font-size: 18px;
    }

    .overview-count small {
        font-size: 8px;
    }

    .client-summary-grid {
        grid-template-columns: 1fr;
    }

    .enhanced-client-row {
        flex-wrap: wrap;
    }

    .enhanced-client-row .manage-client-info {
        flex: 1 1 calc(100% - 60px);
    }

    .enhanced-client-row .secondary-button {
        margin-left: auto;
    }
}

@media (max-width: 420px) {
    .modal-overview {
        flex-wrap: wrap;
    }

    .overview-copy {
        flex-basis: calc(100% - 60px);
    }

    .overview-count {
        margin-left: auto;
    }

    .enhanced-form {
        padding: 13px;
    }
}
/* Monthly calendar UI */
.month-calendar {
    padding: 16px;
    border: 1px solid #e4eeee;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 8px 24px rgb(21 65 70 / 4%);
}

.calendar-month-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.calendar-month-heading h3 {
    margin: 5px 0 0;
    color: #17212f;
    font-size: 20px;
    font-weight: 800;
}

.calendar-nav {
    display: flex;
    align-items: center;
    gap: 7px;
}

.calendar-nav button {
    min-width: 36px;
    height: 36px;
    border: 1px solid #e2ebeb;
    border-radius: 9px;
    background: #fff;
    color: #018181;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
}

.calendar-nav .calendar-today {
    padding: 0 11px;
    font-size: 11px;
}

.calendar-nav button:hover {
    border-color: #018181;
    background: #eef9f7;
}

.month-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
}

.month-weekdays {
    margin-bottom: 7px;
}

.month-weekdays span {
    padding: 8px 2px;
    color: #84919e;
    text-align: center;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
}

.month-day {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 76px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 9px;
    border: 1px solid #edf1f3;
    border-radius: 10px;
    background: #fff;
    color: #263445;
    text-align: left;
    cursor: pointer;
    transition: border-color .16s ease, background .16s ease, transform .16s ease;
}

.month-day:not(:disabled):hover {
    border-color: #83c9c2;
    background: #f5fbfa;
    transform: translateY(-1px);
}

.month-day>strong {
    font-size: 13px;
}

.month-day.outside-month {
    visibility: hidden;
    pointer-events: none;
}

.month-day.selected {
    border-color: #018181;
    background: #eaf8f6;
    box-shadow: inset 0 0 0 1px #018181;
}

.month-day.selected>strong {
    color: #018181;
}

.month-day.is-today:not(.selected) {
    border-color: #f58020;
}

.month-day.is-today:not(.selected)>strong {
    color: #f58020;
}

.calendar-session-count {
    max-width: 100%;
    overflow: hidden;
    padding: 4px 5px;
    border-radius: 5px;
    background: #fff0e3;
    color: #b95a12;
    font-size: 9px;
    font-weight: 800;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.calendar-empty-label {
    color: #d0d7dc;
    font-size: 10px;
}

.calendar-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 14px;
    padding-top: 12px;
    border-top: 1px solid #eef1f2;
}

.calendar-legend span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #788593;
    font-size: 10px;
}

.legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f58020;
}

.legend-dot.today {
    background: #f58020;
}

.legend-dot.selected {
    background: #018181;
}

@media (max-width: 600px) {
    .month-calendar {
        padding: 10px;
    }

    .calendar-month-heading {
        align-items: flex-start;
    }

    .calendar-month-heading h3 {
        font-size: 17px;
    }

    .calendar-nav {
        gap: 4px;
    }

    .calendar-nav button {
        min-width: 31px;
        height: 32px;
    }

    .calendar-nav .calendar-today {
        padding: 0 7px;
    }

    .month-grid {
        gap: 3px;
    }

    .month-weekdays span {
        font-size: 8px;
    }

    .month-day {
        min-height: 57px;
        padding: 6px 4px;
        border-radius: 7px;
        gap: 5px;
    }

    .month-day>strong {
        font-size: 11px;
    }

    .calendar-session-count {
        padding: 3px;
        font-size: 7px;
    }

    .calendar-legend {
        gap: 9px;
    }

    .calendar-legend span {
        font-size: 9px;
    }
}
</style>

