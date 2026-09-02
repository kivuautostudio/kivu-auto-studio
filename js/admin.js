// ============================================================
// KIVU AUTO STUDIO
// COMPLETE ADMIN DASHBOARD
// SUPABASE AUTH + DATABASE MANAGEMENT
// ============================================================


// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

const SUPABASE_URL =
    "https://whejtexmpckfculfbbqm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qlkN4x7-ERSoEJ0WtDOrEg_3JxqAjYL";


// ============================================================
// LOCAL SESSION STORAGE
// ============================================================

const ADMIN_SESSION_KEY =
    "kivuAutoStudioAdminSession";


// ============================================================
// DATA
// ============================================================

let adminSession = null;

let bookings = [];
let serviceRequests = [];
let contactMessages = [];


// ============================================================
// ELEMENTS
// ============================================================

const adminLoginScreen =
    document.getElementById(
        "adminLoginScreen"
    );

const adminApp =
    document.getElementById(
        "adminApp"
    );

const adminLoginForm =
    document.getElementById(
        "adminLoginForm"
    );

const adminEmail =
    document.getElementById(
        "adminEmail"
    );

const adminPassword =
    document.getElementById(
        "adminPassword"
    );

const loginMessage =
    document.getElementById(
        "loginMessage"
    );

const adminEmailDisplay =
    document.getElementById(
        "adminEmailDisplay"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const sidebar =
    document.getElementById(
        "sidebar"
    );

const sidebarToggle =
    document.getElementById(
        "sidebarToggle"
    );

const pageTitle =
    document.getElementById(
        "pageTitle"
    );

const pageSubtitle =
    document.getElementById(
        "pageSubtitle"
    );

const totalBookingsElement =
    document.getElementById(
        "totalBookings"
    );

const newBookingsElement =
    document.getElementById(
        "newBookings"
    );

const totalRequestsElement =
    document.getElementById(
        "totalRequests"
    );

const newMessagesElement =
    document.getElementById(
        "newMessages"
    );

const recentBookings =
    document.getElementById(
        "recentBookings"
    );

const recentRequests =
    document.getElementById(
        "recentRequests"
    );

const bookingsTableBody =
    document.getElementById(
        "bookingsTableBody"
    );

const requestsList =
    document.getElementById(
        "requestsList"
    );

const messagesList =
    document.getElementById(
        "messagesList"
    );

const bookingSearch =
    document.getElementById(
        "bookingSearch"
    );

const bookingStatusFilter =
    document.getElementById(
        "bookingStatusFilter"
    );

const requestSearch =
    document.getElementById(
        "requestSearch"
    );

const requestStatusFilter =
    document.getElementById(
        "requestStatusFilter"
    );

const bookingNavBadge =
    document.getElementById(
        "bookingNavBadge"
    );

const requestNavBadge =
    document.getElementById(
        "requestNavBadge"
    );

const messageNavBadge =
    document.getElementById(
        "messageNavBadge"
    );

const detailModal =
    document.getElementById(
        "detailModal"
    );

const modalBackdrop =
    document.getElementById(
        "modalBackdrop"
    );

const closeModalBtn =
    document.getElementById(
        "closeModalBtn"
    );

const modalEyebrow =
    document.getElementById(
        "modalEyebrow"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalContent =
    document.getElementById(
        "modalContent"
    );


// ============================================================
// SECURITY / HTML ESCAPING
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================================
// SESSION FUNCTIONS
// ============================================================

function saveSession(session) {

    adminSession =
        session;

    localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify(session)
    );

}


function getSavedSession() {

    try {

        const saved =
            localStorage.getItem(
                ADMIN_SESSION_KEY
            );

        if (!saved) {
            return null;
        }

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "Could not read saved session:",
            error
        );

        return null;

    }

}


function clearSession() {

    adminSession =
        null;

    localStorage.removeItem(
        ADMIN_SESSION_KEY
    );

}


// ============================================================
// SUPABASE AUTH
// ============================================================

async function signInAdmin(
    email,
    password
) {

    const response =
        await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY
                },

                body:
                    JSON.stringify({
                        email: email,
                        password: password
                    })
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        throw new Error(
            result.error_description ||
            result.msg ||
            result.message ||
            "Unable to sign in."
        );

    }


    return result;

}


// ============================================================
// REFRESH ACCESS TOKEN
// ============================================================

async function refreshAdminSession() {

    if (
        !adminSession ||
        !adminSession.refresh_token
    ) {

        throw new Error(
            "No refresh token available."
        );

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY
                },

                body:
                    JSON.stringify({
                        refresh_token:
                            adminSession.refresh_token
                    })
            }
        );


    const result =
        await response.json();


    if (!response.ok) {

        clearSession();

        throw new Error(
            "Session expired."
        );

    }


    saveSession(
        result
    );


    return result;

}


// ============================================================
// GET CURRENT USER
// ============================================================

async function getCurrentUser() {

    if (
        !adminSession ||
        !adminSession.access_token
    ) {

        return null;

    }


    let response =
        await fetch(
            `${SUPABASE_URL}/auth/v1/user`,
            {
                headers: {
                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${adminSession.access_token}`
                }
            }
        );


    if (
        response.status === 401
    ) {

        await refreshAdminSession();


        response =
            await fetch(
                `${SUPABASE_URL}/auth/v1/user`,
                {
                    headers: {
                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${adminSession.access_token}`
                    }
                }
            );

    }


    if (!response.ok) {

        return null;

    }


    return await response.json();

}


// ============================================================
// DATABASE REQUEST
// ============================================================

async function supabaseRequest(
    path,
    options = {}
) {

    if (
        !adminSession ||
        !adminSession.access_token
    ) {

        throw new Error(
            "You are not signed in."
        );

    }


    const requestOptions = {

        method:
            options.method ||
            "GET",

        headers: {

            "apikey":
                SUPABASE_KEY,

            "Authorization":
                `Bearer ${adminSession.access_token}`,

            "Content-Type":
                "application/json",

            ...(options.headers || {})

        }

    };


    if (
        options.body !== undefined
    ) {

        requestOptions.body =
            JSON.stringify(
                options.body
            );

    }


    let response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${path}`,
            requestOptions
        );


    if (
        response.status === 401
    ) {

        await refreshAdminSession();


        requestOptions.headers.Authorization =
            `Bearer ${adminSession.access_token}`;


        response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/${path}`,
                requestOptions
            );

    }


    if (!response.ok) {

        let errorMessage =
            "Database request failed.";


        try {

            const errorData =
                await response.json();


            console.error(
                "Supabase database error:",
                errorData
            );


            errorMessage =
                errorData.message ||
                errorData.hint ||
                errorMessage;


        } catch (error) {

            console.error(
                error
            );

        }


        throw new Error(
            errorMessage
        );

    }


    if (
        response.status === 204
    ) {

        return null;

    }


    const text =
        await response.text();


    if (!text) {

        return null;

    }


    return JSON.parse(
        text
    );

}


// ============================================================
// VERIFY ADMIN
// ============================================================

async function verifyAdmin(user) {

    if (!user) {
        return false;
    }


    const adminRows =
        await supabaseRequest(
            `admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,email`
        );


    return (
        Array.isArray(adminRows) &&
        adminRows.length > 0
    );

}


// ============================================================
// SHOW LOGIN
// ============================================================

function showLogin() {

    adminLoginScreen
        .classList
        .remove(
            "hidden"
        );

    adminApp
        .classList
        .add(
            "hidden"
        );

}


// ============================================================
// SHOW ADMIN APP
// ============================================================

function showAdminApp(user) {

    adminLoginScreen
        .classList
        .add(
            "hidden"
        );

    adminApp
        .classList
        .remove(
            "hidden"
        );


    if (
        adminEmailDisplay
    ) {

        adminEmailDisplay.textContent =
            user.email || "Administrator";

    }

}


// ============================================================
// LOGIN FORM
// ============================================================

if (adminLoginForm) {

    adminLoginForm.addEventListener(
        "submit",

        async function (event) {

            event.preventDefault();


            loginMessage.textContent =
                "";

            loginMessage.style.color =
                "#6b7280";


            const button =
                adminLoginForm.querySelector(
                    'button[type="submit"]'
                );


            button.disabled =
                true;

            button.textContent =
                "Signing in...";


            try {

                const email =
                    adminEmail.value.trim();

                const password =
                    adminPassword.value;


                const session =
                    await signInAdmin(
                        email,
                        password
                    );


                saveSession(
                    session
                );


                const user =
                    await getCurrentUser();


                if (!user) {

                    throw new Error(
                        "Unable to verify account."
                    );

                }


                const isAdmin =
                    await verifyAdmin(
                        user
                    );


                if (!isAdmin) {

                    clearSession();


                    throw new Error(
                        "This account is not authorized as an administrator."
                    );

                }


                adminPassword.value =
                    "";


                showAdminApp(
                    user
                );


                await loadAllData();


            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );


                clearSession();


                loginMessage.textContent =
                    error.message ||
                    "Unable to sign in.";

                loginMessage.style.color =
                    "#b91c1c";

            } finally {

                button.disabled =
                    false;

                button.textContent =
                    "Sign In";

            }

        }
    );

}


// ============================================================
// LOGOUT
// ============================================================

async function logoutAdmin() {

    try {

        if (
            adminSession &&
            adminSession.access_token
        ) {

            await fetch(
                `${SUPABASE_URL}/auth/v1/logout`,
                {
                    method: "POST",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${adminSession.access_token}`

                    }
                }
            );

        }

    } catch (error) {

        console.error(
            "Logout request error:",
            error
        );

    }


    clearSession();

    showLogin();

}


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        logoutAdmin
    );

}


// ============================================================
// LOAD DATABASE DATA
// ============================================================

async function loadAllData() {

    try {

        await Promise.all([
            loadBookings(),
            loadServiceRequests(),
            loadMessages()
        ]);


        updateDashboard();

        updateNavigationBadges();


    } catch (error) {

        console.error(
            "Could not load admin data:",
            error
        );


        alert(
            "Could not load dashboard data. Please check your connection and Supabase security policies."
        );

    }

}


// ============================================================
// LOAD BOOKINGS
// ============================================================

async function loadBookings() {

    const result =
        await supabaseRequest(
            "bookings?select=*&order=created_at.desc"
        );


    bookings =
        Array.isArray(result)
            ? result
            : [];


    renderBookings();

}


// ============================================================
// LOAD SERVICE REQUESTS
// ============================================================

async function loadServiceRequests() {

    const result =
        await supabaseRequest(
            "service_requests?select=*&order=created_at.desc"
        );


    serviceRequests =
        Array.isArray(result)
            ? result
            : [];


    renderServiceRequests();

}


// ============================================================
// LOAD MESSAGES
// ============================================================

async function loadMessages() {

    const result =
        await supabaseRequest(
            "contact_messages?select=*&order=created_at.desc"
        );


    contactMessages =
        Array.isArray(result)
            ? result
            : [];


    renderMessages();

}


// ============================================================
// DATE FORMATTING
// ============================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return dateValue;
    }


    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


function formatDateTime(
    dateValue
) {

    if (!dateValue) {
        return "-";
    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return dateValue;
    }


    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ============================================================
// STATUS CLASS
// ============================================================

function getStatusClass(
    status
) {

    const safeStatus =
        String(
            status || "New"
        )
            .toLowerCase()
            .replaceAll(
                " ",
                "-"
            );


    return `status-${safeStatus}`;

}


// ============================================================
// DASHBOARD
// ============================================================

function updateDashboard() {

    const newBookings =
        bookings.filter(
            booking =>
                booking.status === "New"
        );


    const newMessages =
        contactMessages.filter(
            message =>
                message.status === "New"
        );


    totalBookingsElement.textContent =
        bookings.length;

    newBookingsElement.textContent =
        newBookings.length;

    totalRequestsElement.textContent =
        serviceRequests.length;

    newMessagesElement.textContent =
        newMessages.length;


    renderRecentBookings();

    renderRecentRequests();

}


// ============================================================
// RECENT BOOKINGS
// ============================================================

function renderRecentBookings() {

    const recent =
        bookings.slice(
            0,
            5
        );


    if (
        recent.length === 0
    ) {

        recentBookings.innerHTML = `
            <div class="empty-state">
                No bookings yet.
            </div>
        `;

        return;

    }


    recentBookings.innerHTML =
        recent
            .map(
                booking => `
                    <div class="activity-item">

                        <div class="activity-main">

                            <strong>
                                ${escapeHtml(booking.name)}
                            </strong>

                            <span>
                                ${escapeHtml(booking.vehicle)}
                                •
                                ${escapeHtml(booking.service)}
                            </span>

                        </div>

                        <div class="activity-meta">

                            <strong>
                                ${escapeHtml(formatDate(booking.preferred_date))}
                            </strong>

                            <span>
                                ${escapeHtml(booking.preferred_time)}
                            </span>

                        </div>

                    </div>
                `
            )
            .join("");

}


// ============================================================
// RECENT SERVICE REQUESTS
// ============================================================

function renderRecentRequests() {

    const recent =
        serviceRequests.slice(
            0,
            5
        );


    if (
        recent.length === 0
    ) {

        recentRequests.innerHTML = `
            <div class="empty-state">
                No service requests yet.
            </div>
        `;

        return;

    }


    recentRequests.innerHTML =
        recent
            .map(
                request => `
                    <div class="activity-item">

                        <div class="activity-main">

                            <strong>
                                ${escapeHtml(request.name)}
                            </strong>

                            <span>
                                ${escapeHtml(request.vehicle)}
                                •
                                ${escapeHtml(request.request_type)}
                            </span>

                        </div>

                        <div class="activity-meta">

                            <span class="status-badge ${getStatusClass(request.status)}">
                                ${escapeHtml(request.status)}
                            </span>

                        </div>

                    </div>
                `
            )
            .join("");

}


// ============================================================
// NAVIGATION BADGES
// ============================================================

function updateNavigationBadges() {

    const newBookingCount =
        bookings.filter(
            item =>
                item.status === "New"
        ).length;


    const newRequestCount =
        serviceRequests.filter(
            item =>
                item.status === "New"
        ).length;


    const newMessageCount =
        contactMessages.filter(
            item =>
                item.status === "New"
        ).length;


    updateBadge(
        bookingNavBadge,
        newBookingCount
    );

    updateBadge(
        requestNavBadge,
        newRequestCount
    );

    updateBadge(
        messageNavBadge,
        newMessageCount
    );

}


function updateBadge(
    element,
    count
) {

    if (!element) {
        return;
    }


    element.textContent =
        count;


    if (
        count > 0
    ) {

        element.classList.remove(
            "hidden"
        );

    } else {

        element.classList.add(
            "hidden"
        );

    }

}


// ============================================================
// BOOKINGS TABLE
// ============================================================

function renderBookings() {

    if (!bookingsTableBody) {
        return;
    }


    const search =
        (
            bookingSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const status =
        bookingStatusFilter?.value ||
        "all";


    const filtered =
        bookings.filter(
            booking => {

                const matchesSearch =
                    !search ||
                    String(
                        booking.name || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        booking.phone || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        booking.email || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        booking.vehicle || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        booking.service || ""
                    )
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    booking.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        filtered.length === 0
    ) {

        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        No bookings found.
                    </div>
                </td>
            </tr>
        `;

        return;

    }


    bookingsTableBody.innerHTML =
        filtered
            .map(
                booking => `
                    <tr>

                        <td>
                            <div class="customer-cell">

                                <strong>
                                    ${escapeHtml(booking.name)}
                                </strong>

                                <span>
                                    ${escapeHtml(booking.phone)}
                                </span>

                            </div>
                        </td>


                        <td>
                            ${escapeHtml(booking.vehicle)}
                        </td>


                        <td>
                            ${escapeHtml(booking.service)}
                        </td>


                        <td>
                            ${escapeHtml(formatDate(booking.preferred_date))}
                            <br>
                            ${escapeHtml(booking.preferred_time)}
                        </td>


                        <td>
                            <span class="status-badge ${getStatusClass(booking.status)}">
                                ${escapeHtml(booking.status)}
                            </span>
                        </td>


                        <td>

                            <div class="action-group">

                                <button
                                    class="action-btn"
                                    onclick="openBookingDetails('${booking.id}')"
                                >
                                    View
                                </button>

                                ${
                                    booking.status !== "Confirmed"
                                    ? `
                                    <button
                                        class="action-btn primary"
                                        onclick="updateBookingStatus('${booking.id}', 'Confirmed')"
                                    >
                                        Confirm
                                    </button>
                                    `
                                    : ""
                                }

                                ${
                                    booking.status !== "Completed"
                                    ? `
                                    <button
                                        class="action-btn success"
                                        onclick="updateBookingStatus('${booking.id}', 'Completed')"
                                    >
                                        Complete
                                    </button>
                                    `
                                    : ""
                                }

                            </div>

                        </td>

                    </tr>
                `
            )
            .join("");

}


// ============================================================
// BOOKING SEARCH / FILTER
// ============================================================

if (bookingSearch) {

    bookingSearch.addEventListener(
        "input",
        renderBookings
    );

}


if (bookingStatusFilter) {

    bookingStatusFilter.addEventListener(
        "change",
        renderBookings
    );

}


// ============================================================
// SERVICE REQUESTS
// ============================================================

function renderServiceRequests() {

    if (!requestsList) {
        return;
    }


    const search =
        (
            requestSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const status =
        requestStatusFilter?.value ||
        "all";


    const filtered =
        serviceRequests.filter(
            request => {

                const matchesSearch =
                    !search ||
                    String(
                        request.name || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        request.phone || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        request.vehicle || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        request.request_type || ""
                    )
                        .toLowerCase()
                        .includes(search) ||

                    String(
                        request.description || ""
                    )
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =
                    status === "all" ||
                    request.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (
        filtered.length === 0
    ) {

        requestsList.innerHTML = `
            <div class="empty-state">
                No service requests found.
            </div>
        `;

        return;

    }


    requestsList.innerHTML =
        filtered
            .map(
                request => `
                    <article class="request-card">

                        <div class="request-header">

                            <div>

                                <h3>
                                    ${escapeHtml(request.name)}
                                </h3>

                                <p>
                                    ${escapeHtml(request.vehicle)}
                                    •
                                    ${escapeHtml(request.request_type)}
                                </p>

                            </div>

                            <span class="status-badge ${getStatusClass(request.status)}">
                                ${escapeHtml(request.status)}
                            </span>

                        </div>


                        <div class="request-description">
                            ${escapeHtml(request.description)}
                        </div>


                        <div class="request-details">

                            <div class="request-detail">
                                <span>Phone</span>
                                <strong>
                                    ${escapeHtml(request.phone)}
                                </strong>
                            </div>

                            <div class="request-detail">
                                <span>Email</span>
                                <strong>
                                    ${escapeHtml(request.email || "-")}
                                </strong>
                            </div>

                            <div class="request-detail">
                                <span>Preferred Contact</span>
                                <strong>
                                    ${escapeHtml(request.preferred_contact)}
                                </strong>
                            </div>

                            <div class="request-detail">
                                <span>Received</span>
                                <strong>
                                    ${escapeHtml(formatDateTime(request.created_at))}
                                </strong>
                            </div>

                        </div>


                        <div class="request-actions">

                            <button
                                class="action-btn"
                                onclick="openRequestDetails('${request.id}')"
                            >
                                View Details
                            </button>

                            <button
                                class="action-btn primary"
                                onclick="updateRequestStatus('${request.id}', 'Contacted')"
                            >
                                Contacted
                            </button>

                            <button
                                class="action-btn"
                                onclick="updateRequestStatus('${request.id}', 'Quoted')"
                            >
                                Quoted
                            </button>

                            <button
                                class="action-btn success"
                                onclick="updateRequestStatus('${request.id}', 'Completed')"
                            >
                                Complete
                            </button>

                        </div>

                    </article>
                `
            )
            .join("");

}


// ============================================================
// REQUEST SEARCH / FILTER
// ============================================================

if (requestSearch) {

    requestSearch.addEventListener(
        "input",
        renderServiceRequests
    );

}


if (requestStatusFilter) {

    requestStatusFilter.addEventListener(
        "change",
        renderServiceRequests
    );

}


// ============================================================
// CONTACT MESSAGES
// ============================================================

function renderMessages() {

    if (!messagesList) {
        return;
    }


    if (
        contactMessages.length === 0
    ) {

        messagesList.innerHTML = `
            <div class="empty-state">
                No messages yet.
            </div>
        `;

        return;

    }


    messagesList.innerHTML =
        contactMessages
            .map(
                message => `
                    <article class="message-card">

                        <div class="message-header">

                            <div>

                                <h3>
                                    ${escapeHtml(message.name)}
                                </h3>

                                <p>
                                    ${escapeHtml(message.email)}
                                    •
                                    ${escapeHtml(formatDateTime(message.created_at))}
                                </p>

                            </div>

                            <span class="status-badge ${getStatusClass(message.status)}">
                                ${escapeHtml(message.status)}
                            </span>

                        </div>


                        <div class="message-body">
                            ${escapeHtml(message.message)}
                        </div>


                        <div class="message-actions">

                            <button
                                class="action-btn"
                                onclick="openMessageDetails('${message.id}')"
                            >
                                View
                            </button>

                            ${
                                message.status === "New"
                                ? `
                                <button
                                    class="action-btn primary"
                                    onclick="updateMessageStatus('${message.id}', 'Read')"
                                >
                                    Mark Read
                                </button>
                                `
                                : ""
                            }

                            ${
                                message.status !== "Replied"
                                ? `
                                <button
                                    class="action-btn success"
                                    onclick="updateMessageStatus('${message.id}', 'Replied')"
                                >
                                    Mark Replied
                                </button>
                                `
                                : ""
                            }

                        </div>

                    </article>
                `
            )
            .join("");

}


// ============================================================
// UPDATE BOOKING STATUS
// ============================================================

async function updateBookingStatus(
    id,
    status
) {

    try {

        await supabaseRequest(
            `bookings?id=eq.${encodeURIComponent(id)}`,
            {
                method: "PATCH",

                headers: {
                    "Prefer":
                        "return=minimal"
                },

                body: {
                    status: status
                }
            }
        );


        const booking =
            bookings.find(
                item =>
                    item.id === id
            );


        if (booking) {
            booking.status =
                status;
        }


        renderBookings();
        updateDashboard();
        updateNavigationBadges();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not update booking status."
        );

    }

}


// ============================================================
// UPDATE SERVICE REQUEST STATUS
// ============================================================

async function updateRequestStatus(
    id,
    status
) {

    try {

        await supabaseRequest(
            `service_requests?id=eq.${encodeURIComponent(id)}`,
            {
                method: "PATCH",

                headers: {
                    "Prefer":
                        "return=minimal"
                },

                body: {
                    status: status
                }
            }
        );


        const request =
            serviceRequests.find(
                item =>
                    item.id === id
            );


        if (request) {
            request.status =
                status;
        }


        renderServiceRequests();
        updateDashboard();
        updateNavigationBadges();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not update service request."
        );

    }

}


// ============================================================
// UPDATE MESSAGE STATUS
// ============================================================

async function updateMessageStatus(
    id,
    status
) {

    try {

        await supabaseRequest(
            `contact_messages?id=eq.${encodeURIComponent(id)}`,
            {
                method: "PATCH",

                headers: {
                    "Prefer":
                        "return=minimal"
                },

                body: {
                    status: status
                }
            }
        );


        const message =
            contactMessages.find(
                item =>
                    item.id === id
            );


        if (message) {
            message.status =
                status;
        }


        renderMessages();
        updateDashboard();
        updateNavigationBadges();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not update message."
        );

    }

}


// ============================================================
// MODAL
// ============================================================

function openModal(
    eyebrow,
    title,
    content
) {

    modalEyebrow.textContent =
        eyebrow;

    modalTitle.textContent =
        title;

    modalContent.innerHTML =
        content;


    detailModal
        .classList
        .remove(
            "hidden"
        );

}


function closeModal() {

    detailModal
        .classList
        .add(
            "hidden"
        );

}


if (closeModalBtn) {

    closeModalBtn.addEventListener(
        "click",
        closeModal
    );

}


if (modalBackdrop) {

    modalBackdrop.addEventListener(
        "click",
        closeModal
    );

}


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


// ============================================================
// BOOKING DETAILS
// ============================================================

function openBookingDetails(
    id
) {

    const booking =
        bookings.find(
            item =>
                item.id === id
        );


    if (!booking) {
        return;
    }


    openModal(
        "BOOKING DETAILS",

        booking.name,

        `
            <div class="detail-grid">

                <div class="detail-item">
                    <span>Customer</span>
                    <strong>
                        ${escapeHtml(booking.name)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Phone</span>
                    <strong>
                        ${escapeHtml(booking.phone)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Email</span>
                    <strong>
                        ${escapeHtml(booking.email || "-")}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Vehicle</span>
                    <strong>
                        ${escapeHtml(booking.vehicle)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Service</span>
                    <strong>
                        ${escapeHtml(booking.service)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Status</span>
                    <strong>
                        ${escapeHtml(booking.status)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Date</span>
                    <strong>
                        ${escapeHtml(formatDate(booking.preferred_date))}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Time</span>
                    <strong>
                        ${escapeHtml(booking.preferred_time)}
                    </strong>
                </div>

                <div class="detail-item full">
                    <span>Notes</span>
                    <strong>
                        ${escapeHtml(booking.notes || "No notes provided.")}
                    </strong>
                </div>

                <div class="detail-item full">
                    <span>Submitted</span>
                    <strong>
                        ${escapeHtml(formatDateTime(booking.created_at))}
                    </strong>
                </div>

            </div>
        `
    );

}


// ============================================================
// REQUEST DETAILS
// ============================================================

function openRequestDetails(
    id
) {

    const request =
        serviceRequests.find(
            item =>
                item.id === id
        );


    if (!request) {
        return;
    }


    openModal(
        "SERVICE REQUEST",

        request.name,

        `
            <div class="detail-grid">

                <div class="detail-item">
                    <span>Customer</span>
                    <strong>
                        ${escapeHtml(request.name)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Phone</span>
                    <strong>
                        ${escapeHtml(request.phone)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Email</span>
                    <strong>
                        ${escapeHtml(request.email || "-")}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Vehicle</span>
                    <strong>
                        ${escapeHtml(request.vehicle)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Request Type</span>
                    <strong>
                        ${escapeHtml(request.request_type)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Status</span>
                    <strong>
                        ${escapeHtml(request.status)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Preferred Contact</span>
                    <strong>
                        ${escapeHtml(request.preferred_contact)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Submitted</span>
                    <strong>
                        ${escapeHtml(formatDateTime(request.created_at))}
                    </strong>
                </div>

                <div class="detail-item full">
                    <span>Description</span>
                    <strong>
                        ${escapeHtml(request.description)}
                    </strong>
                </div>

            </div>
        `
    );

}


// ============================================================
// MESSAGE DETAILS
// ============================================================

function openMessageDetails(
    id
) {

    const message =
        contactMessages.find(
            item =>
                item.id === id
        );


    if (!message) {
        return;
    }


    openModal(
        "CUSTOMER MESSAGE",

        message.name,

        `
            <div class="detail-grid">

                <div class="detail-item">
                    <span>Name</span>
                    <strong>
                        ${escapeHtml(message.name)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Email</span>
                    <strong>
                        ${escapeHtml(message.email)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Status</span>
                    <strong>
                        ${escapeHtml(message.status)}
                    </strong>
                </div>

                <div class="detail-item">
                    <span>Received</span>
                    <strong>
                        ${escapeHtml(formatDateTime(message.created_at))}
                    </strong>
                </div>

                <div class="detail-item full">
                    <span>Message</span>
                    <strong>
                        ${escapeHtml(message.message)}
                    </strong>
                </div>

            </div>
        `
    );

}


// ============================================================
// ADMIN NAVIGATION
// ============================================================

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const screens = {

    dashboard:
        document.getElementById(
            "dashboardScreen"
        ),

    bookings:
        document.getElementById(
            "bookingsScreen"
        ),

    requests:
        document.getElementById(
            "requestsScreen"
        ),

    messages:
        document.getElementById(
            "messagesScreen"
        )

};


const screenInformation = {

    dashboard: {
        title:
            "Dashboard",

        subtitle:
            "Overview of your business activity."
    },

    bookings: {
        title:
            "Bookings",

        subtitle:
            "Manage customer appointments."
    },

    requests: {
        title:
            "Service Requests",

        subtitle:
            "Manage customer service enquiries."
    },

    messages: {
        title:
            "Messages",

        subtitle:
            "Review website contact messages."
    }

};


function showScreen(
    screenName
) {

    Object.entries(
        screens
    )
        .forEach(
            ([name, element]) => {

                if (!element) {
                    return;
                }


                if (
                    name === screenName
                ) {

                    element.classList.remove(
                        "hidden"
                    );

                } else {

                    element.classList.add(
                        "hidden"
                    );

                }

            }
        );


    navItems.forEach(
        item => {

            if (
                item.dataset.screen ===
                screenName
            ) {

                item.classList.add(
                    "active"
                );

            } else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );


    const info =
        screenInformation[
            screenName
        ];


    if (info) {

        pageTitle.textContent =
            info.title;

        pageSubtitle.textContent =
            info.subtitle;

    }


    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }

}


navItems.forEach(
    item => {

        item.addEventListener(
            "click",
            function () {

                showScreen(
                    item.dataset.screen
                );

            }
        );

    }
);


// ============================================================
// VIEW ALL BUTTONS
// ============================================================

document
    .querySelectorAll(
        "[data-open-screen]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    showScreen(
                        button.dataset.openScreen
                    );

                }
            );

        }
    );


// ============================================================
// SIDEBAR MOBILE
// ============================================================

if (sidebarToggle) {

    sidebarToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


// ============================================================
// REFRESH BUTTONS
// ============================================================

const refreshDashboardBtn =
    document.getElementById(
        "refreshDashboardBtn"
    );

const refreshBookingsBtn =
    document.getElementById(
        "refreshBookingsBtn"
    );

const refreshRequestsBtn =
    document.getElementById(
        "refreshRequestsBtn"
    );

const refreshMessagesBtn =
    document.getElementById(
        "refreshMessagesBtn"
    );


if (refreshDashboardBtn) {

    refreshDashboardBtn.addEventListener(
        "click",
        loadAllData
    );

}


if (refreshBookingsBtn) {

    refreshBookingsBtn.addEventListener(
        "click",

        async function () {

            await loadBookings();

            updateDashboard();

            updateNavigationBadges();

        }
    );

}


if (refreshRequestsBtn) {

    refreshRequestsBtn.addEventListener(
        "click",

        async function () {

            await loadServiceRequests();

            updateDashboard();

            updateNavigationBadges();

        }
    );

}


if (refreshMessagesBtn) {

    refreshMessagesBtn.addEventListener(
        "click",

        async function () {

            await loadMessages();

            updateDashboard();

            updateNavigationBadges();

        }
    );

}


// ============================================================
// MAKE FUNCTIONS AVAILABLE TO HTML BUTTONS
// ============================================================

window.openBookingDetails =
    openBookingDetails;

window.openRequestDetails =
    openRequestDetails;

window.openMessageDetails =
    openMessageDetails;

window.updateBookingStatus =
    updateBookingStatus;

window.updateRequestStatus =
    updateRequestStatus;

window.updateMessageStatus =
    updateMessageStatus;


// ============================================================
// RESTORE ADMIN SESSION
// ============================================================

async function initializeAdmin() {

    showLogin();


    const savedSession =
        getSavedSession();


    if (!savedSession) {

        console.log(
            "No saved admin session."
        );

        return;

    }


    adminSession =
        savedSession;


    try {

        const user =
            await getCurrentUser();


        if (!user) {

            clearSession();

            showLogin();

            return;

        }


        const isAdmin =
            await verifyAdmin(
                user
            );


        if (!isAdmin) {

            clearSession();

            showLogin();

            return;

        }


        showAdminApp(
            user
        );


        showScreen(
            "dashboard"
        );


        await loadAllData();


    } catch (error) {

        console.error(
            "Could not restore admin session:",
            error
        );


        clearSession();

        showLogin();

    }

}


// ============================================================
// START ADMIN DASHBOARD
// ============================================================

initializeAdmin();


console.log(
    "Kivu Auto Studio Admin loaded."
);
