<div align="center">

# 🏋️ FitLab — Gym Management Dashboard

**Train Better. Manage Smarter.**

A modern, responsive gym management dashboard built with **Vue.js 3**, **Ionic Framework**, and **Vite**.

[![Vue.js](https://img.shields.io/badge/Vue.js-3-42b883?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Ionic](https://img.shields.io/badge/Ionic-Framework-3880ff?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-ff6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

</div>

---

## 📌 About FitLab

**FitLab** is a web-based gym management dashboard designed to help administrators organize daily fitness center operations through a clean and responsive interface.

The dashboard brings together member records, trainer information, attendance, payments, equipment inventory, and gym performance analytics in one place. Its responsive layout is designed for both desktop and mobile screens.

FitLab also supports separate dashboard experiences for gym administrators, members, and personal trainers, helping each role access relevant information and features.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Dashboard Analytics** | Charts for gym performance, revenue, member growth, and attendance. |
| 🧑‍💻 **User Dashboard** | Provide members with access to relevant membership and fitness information. |
| 💪 **Personal Trainer Dashboard** | Provide personal trainers with a dedicated interface for trainer-related information and activities. |
| 📲 **QR Code Integration** |Support QR-code-related workflows for gym access or attendance, depending on the implemented functionality. |
| 👥 **Member Management** | Manage member records through CRUD interfaces and responsive tables. |
| 🏋️ **Trainer Management** | Organize trainer information and management views. |
| 🗓️ **Attendance Tracking** | Record and review daily member attendance. |
| 💳 **Payment & Billing** | Manage payment records and view payment history. |
| 👤 **Profile Management** | Edit profile details and preview profile changes. |
| 🖼️ **Profile Picture** | Change the profile picture and preview it before saving. |
| 🕒 **Digital Clock** | Display a live digital clock in the profile preview. |
| 📱 **Responsive Interface** | Mobile-friendly navigation and desktop-friendly layouts. |
| 🪪 **ID Card OCR** | use OCR to automatically extract your date of birth and address. |
| 📝 **Plan Card Membership** | Choose membership Gym plan. |
| 💸 **Payment Method** |  Complete payment in your selected wallet in a live payment integration. |
| 🔔 **Notify Ads** | Member notif announcement Ads. |
| 🎭 **Feedback Popup & Utils** | Members can select a sentiment rating, write a comment, and then submit their feedback. | 

> **Note:** The availability of each feature depends on the current implementation. A UI feature does not necessarily mean that backend services or database integration are already connected. There is an important limitation: `localStorage` can be used for integration only if both dashboards are opened in the same browser and share the same origin. If FitLab is accessed from a different device or account, a backend or database will be required to ensure the data is properly synchronized.


## 🛠️ Tech Stack

- **Framework:** Vue.js 3 — Composition API
- **UI Framework:** Ionic Framework
- **Language:** TypeScript
- **Build Tool:** Vite
- **QR Code:** qrcode.vue
- **Charts:** Chart.js and Vue-Chartjs
- **Icons:** Font Awesome and Boxicons
- **Styling:** CSS
- **Profile Persistence & User Sign in:** Browser `localStorage` for the current profile implementation

## 🎨 Color Palette

FitLab uses a teal-and-orange visual identity.

| Color | Hex Code | Purpose |
|---|---|---|
| 🟢 Teal | `#018181` | Primary color and main actions |
| 🟠 Safety Orange | `#F58020` | Accent color and hover states |
| ⚫ Rich Black | `#0A1819` | Dark text and backgrounds |
| ◼️ Gunmetal | `#203333` | Secondary dark surfaces |

## Authentication & Role Validation

FitLab provides role-based login flows for Members, Administrators, and
Personal Trainers. Each role uses the same authentication page with a
different interface depending on the selected login route.

### Login Portals

| Role | Login Route | Access |
|---|---|---|
| Member | `/login` | Sign In and Sign Up |
| Admin | `/login?role=admin` | Sign In only |
| Personal Trainer | `/login?role=pt` | Sign In only |

### Role Validation

- **Member:** Can sign in or create a new account through the Member login page.
- **Admin:** Must authenticate using an account assigned to the `admin` role.
- **Personal Trainer:** Must authenticate using an account assigned to the `pt` role.
- **Registration:** Newly registered accounts are assigned the `member` role.
- **Access Control:** The requested staff portal must match the account's assigned role.
- **Login Interface:** Admin and Personal Trainer use a dedicated Staff Portal
  design, while the original Member login and registration interface is preserved.

### Staff Portal Features

- Dedicated login interface for Admin and Personal Trainer.
- Role-specific portal headings.
- Email and password authentication.
- Authorized staff accounts checkbox.
- Responsive desktop and mobile layouts.
- Shared application footer across the login interfaces.

## 🚀 Getting Started

Follow these instructions to run FitLab locally.

### 1. Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/) — preferably an active LTS version
- npm — included with Node.js
- [Git](https://git-scm.com/)

Verify your installation:

```bash
node -v
npm -v
git --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/ardksfs/fitlabapp.git
cd fitlabapp
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Install Chart Dependencies (if needed)

If `chart.js` and `vue-chartjs` are not already included in `package.json`, install them:

```bash
npm install chart.js vue-chartjs
```
### 5.  Install QR Code Dependency
FitLab uses qrcode.vue for QR-code-related functionality. The dependency is already present in the current project package list.

If it is missing from your local installation, install it with:

```bash
npm install qrcode.vue
```
### 6. Install dependency OCR
Upload your ID card (KTP) and use OCR to automatically extract your date of birth and address.

```bash
npm install tesseract.js
```
### 7. Start the Development Server

For a standard Vite setup:

```bash
npm run dev
```

If the project is configured to use the Ionic CLI, you can also run:

```bash
ionic serve
```

Open the local URL shown in your terminal. Vite commonly uses `http://localhost:`, while Ionic may use a different port.

### 7. Build for Production

```bash
npm run build
```

If the project includes a preview script, preview the production build with:

```bash
npm run preview
```

## 📁 Project Structure

The following is a general guide. The exact structure may vary as development continues.

```text
fitlabapp/
├── public/
    ├── assets/             # Images, logos, and other assets
├── src/
│   ├── components/         # Reusable components, e.g. Sidebar
│   ├── layouts/            # Shared layouts, e.g. AdminLayout
│   ├── router/             # Route configuration
│   ├── theme/              # Theme and CSS variables
│   └── views/              # Application pages
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🧭 How to Use

1. Start the development server.
2. Open the local URL displayed in the terminal.
3. Navigate to the available dashboard and management pages.
4. Use the responsive navigation menu to access features on mobile.
5. Open profile management to edit details and preview changes.
6. Select **Save changes** to save the current profile in the browser.

## 💾 Data & Persistence

The current profile-management implementation uses browser `localStorage`. Saved profile information remains available after refreshing the page in the **same browser and device**.

Unless a backend and database are connected separately, this information is not automatically synchronized between devices or different users.

## 🌐 Deployment

FitLab can be deployed to static hosting platforms that support Vite builds, such as [Cloudflare Pages](https://pages.cloudflare.com/).

Typical Cloudflare Pages settings:

| Setting | Value |
|---|---|
| Framework preset | Vue (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |

If GitHub is connected to Cloudflare Pages, pushing a commit to the configured branch can trigger a new deployment automatically.

## 🗺️ Future Improvements

Potential enhancements for future versions:

- 🔐 Authentication and role-based access control
- 🗄️ Backend API and database integration
- 📈 More detailed analytics and reports
- 🔔 Membership and payment notifications
- 🧾 Exportable reports and payment receipts
- 📷 QR-code attendance verification
- 🧪 Automated testing and validation

## 🤝 Contributing

Suggestions and improvements are welcome.

1. Fork the repository.
2. Create a branch for your changes.
3. Commit your changes with a descriptive message.
4. Push your branch and open a Pull Request.

## 📄 License

A license has not been specified in this README. Add a license file to clarify the terms under which others may use, modify, and distribute the project.

---

<div align="center">

Made with 💚 using Vue 3, Ionic, and Vite.

**FitLab — Train Better. Manage Smarter.**

</div>
