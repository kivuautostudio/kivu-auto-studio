// ============================================================
// KIVU AUTO STUDIO
// COMPLETE JAVASCRIPT
// ============================================================


// ============================================================
// CURRENT YEAR
// ============================================================

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear();
}


// ============================================================
// MOBILE NAVIGATION
// ============================================================

const mobileMenuBtn =
    document.getElementById("mobileMenuBtn");

const mainNav =
    document.getElementById("mainNav");

if (mobileMenuBtn && mainNav) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle("open");

        }
    );


    const navLinks =
        mainNav.querySelectorAll("a");

    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                mainNav.classList.remove("open");

            }
        );

    });

}


// ============================================================
// PREVENT PAST BOOKING DATES
// ============================================================

const bookingDate =
    document.getElementById("bookingDate");

if (bookingDate) {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    const minimumDate =
        `${year}-${month}-${day}`;

    bookingDate.min =
        minimumDate;

}


// ============================================================
// BOOKING FORM
// ============================================================

const bookingForm =
    document.getElementById("bookingForm");

const bookingMessage =
    document.getElementById("bookingMessage");

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    bookingForm
                );


            const booking = {

                name:
                    formData.get("name"),

                phone:
                    formData.get("phone"),

                email:
                    formData.get("email"),

                vehicle:
                    formData.get("vehicle"),

                service:
                    formData.get("service"),

                date:
                    formData.get("date"),

                time:
                    formData.get("time"),

                notes:
                    formData.get("notes"),

                createdAt:
                    new Date().toISOString()

            };


            console.log(
                "Booking submitted:",
                booking
            );


            if (bookingMessage) {

                bookingMessage.textContent =
                    "Booking received. We will contact you to confirm your appointment.";

                bookingMessage.style.color =
                    "#15803d";

            }


            bookingForm.reset();


            if (bookingDate) {

                const today =
                    new Date();

                const year =
                    today.getFullYear();

                const month =
                    String(
                        today.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        today.getDate()
                    ).padStart(2, "0");

                bookingDate.min =
                    `${year}-${month}-${day}`;

            }

        }
    );

}


// ============================================================
// SERVICE REQUEST / QUOTE FORM
// ============================================================

const quoteForm =
    document.getElementById("quoteForm");

const quoteMessage =
    document.getElementById("quoteMessage");

if (quoteForm) {

    quoteForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    quoteForm
                );


            const request = {

                name:
                    formData.get("name"),

                phone:
                    formData.get("phone"),

                email:
                    formData.get("email"),

                vehicle:
                    formData.get("vehicle"),

                requestType:
                    formData.get("requestType"),

                description:
                    formData.get("description"),

                preferredContact:
                    formData.get("preferredContact"),

                createdAt:
                    new Date().toISOString(),

                status:
                    "New"

            };


            console.log(
                "Service request submitted:",
                request
            );


            if (quoteMessage) {

                quoteMessage.textContent =
                    "Your service request has been received. Our team will review it and contact you.";

                quoteMessage.style.color =
                    "#15803d";

            }


            quoteForm.reset();

        }
    );

}


// ============================================================
// CONTACT FORM
// ============================================================

const contactForm =
    document.getElementById("contactForm");

const contactFormMessage =
    document.getElementById(
        "contactFormMessage"
    );

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    contactForm
                );


            const contactMessage = {

                name:
                    formData.get("name"),

                email:
                    formData.get("email"),

                message:
                    formData.get("message"),

                createdAt:
                    new Date().toISOString()

            };


            console.log(
                "Contact message submitted:",
                contactMessage
            );


            if (contactFormMessage) {

                contactFormMessage.textContent =
                    "Message sent successfully. We will get back to you.";

                contactFormMessage.style.color =
                    "#15803d";

            }


            contactForm.reset();

        }
    );

}


// ============================================================
// SCROLL REVEAL
// ============================================================

const revealItems =
    document.querySelectorAll(
        ".service-card, .step-card, .price-card, .benefit-card"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target
                                .classList
                                .add(
                                    "reveal-visible"
                                );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.12
            }

        );


    revealItems.forEach(
        function (item) {

            item.classList.add(
                "reveal-item"
            );

            observer.observe(
                item
            );

        }
    );

}


// ============================================================
// CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !mainNav ||
            !mobileMenuBtn
        ) {

            return;

        }


        const clickedInsideNav =
            mainNav.contains(
                event.target
            );


        const clickedMenuButton =
            mobileMenuBtn.contains(
                event.target
            );


        if (
            !clickedInsideNav &&
            !clickedMenuButton
        ) {

            mainNav.classList.remove(
                "open"
            );

        }

    }
);


// ============================================================
// DEMO NOTE
// ============================================================

console.log(
    "Kivu Auto Studio demo loaded successfully."
);

console.log(
    "Forms are currently demo-only. Supabase database connection will be added next."
);
