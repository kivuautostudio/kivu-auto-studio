// ============================================================
// KIVU AUTO STUDIO
// COMPLETE JAVASCRIPT WITH SUPABASE DATABASE
// ============================================================


// ============================================================
// SUPABASE CONFIGURATION
// ============================================================

const SUPABASE_URL =
    "https://whejtexmpckfculfbbqm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_qlkN4x7-ERSoEJ0WtDOrEg_3JxqAjYL";


// ============================================================
// SUPABASE INSERT HELPER
// ============================================================

async function insertIntoSupabase(
    tableName,
    data
) {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${tableName}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Prefer":
                        "return=minimal"
                },

                body:
                    JSON.stringify(data)
            }
        );


    if (!response.ok) {

        let errorMessage =
            "Database request failed.";

        try {

            const errorData =
                await response.json();

            console.error(
                "Supabase error:",
                errorData
            );

            errorMessage =
                errorData.message ||
                errorData.hint ||
                errorMessage;

        } catch (error) {

            console.error(
                "Could not read Supabase error:",
                error
            );

        }


        throw new Error(
            errorMessage
        );

    }


    return true;

}


// ============================================================
// CURRENT YEAR
// ============================================================

const currentYear =
    document.getElementById(
        "currentYear"
    );

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


// ============================================================
// MOBILE NAVIGATION
// ============================================================

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );

const mainNav =
    document.getElementById(
        "mainNav"
    );


if (
    mobileMenuBtn &&
    mainNav
) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            mainNav.classList.toggle(
                "open"
            );

        }
    );


    const navLinks =
        mainNav.querySelectorAll(
            "a"
        );


    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mainNav.classList.remove(
                        "open"
                    );

                }
            );

        }
    );

}


// ============================================================
// PREVENT PAST BOOKING DATES
// ============================================================

const bookingDate =
    document.getElementById(
        "bookingDate"
    );


function setMinimumBookingDate() {

    if (!bookingDate) {
        return;
    }


    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    bookingDate.min =
        `${year}-${month}-${day}`;

}


setMinimumBookingDate();


// ============================================================
// BOOKING FORM
// ============================================================

const bookingForm =
    document.getElementById(
        "bookingForm"
    );

const bookingMessage =
    document.getElementById(
        "bookingMessage"
    );


if (bookingForm) {

    bookingForm.addEventListener(
        "submit",

        async function (event) {

            event.preventDefault();


            const submitButton =
                bookingForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            if (bookingMessage) {

                bookingMessage.textContent =
                    "";

            }


            try {

                const formData =
                    new FormData(
                        bookingForm
                    );


                const booking = {

                    name:
                        String(
                            formData.get(
                                "name"
                            )
                        ).trim(),

                    phone:
                        String(
                            formData.get(
                                "phone"
                            )
                        ).trim(),

                    email:
                        String(
                            formData.get(
                                "email"
                            ) || ""
                        ).trim() || null,

                    vehicle:
                        String(
                            formData.get(
                                "vehicle"
                            )
                        ).trim(),

                    service:
                        String(
                            formData.get(
                                "service"
                            )
                        ).trim(),

                    preferred_date:
                        String(
                            formData.get(
                                "date"
                            )
                        ).trim(),

                    preferred_time:
                        String(
                            formData.get(
                                "time"
                            )
                        ).trim(),

                    notes:
                        String(
                            formData.get(
                                "notes"
                            ) || ""
                        ).trim() || null,

                    status:
                        "New"

                };


                await insertIntoSupabase(
                    "bookings",
                    booking
                );


                if (bookingMessage) {

                    bookingMessage.textContent =
                        "Booking received successfully. We will contact you to confirm your appointment.";

                    bookingMessage.style.color =
                        "#15803d";

                }


                bookingForm.reset();

                setMinimumBookingDate();


                console.log(
                    "Booking saved successfully:",
                    booking
                );

            } catch (error) {

                console.error(
                    "Booking submission failed:",
                    error
                );


                if (bookingMessage) {

                    bookingMessage.textContent =
                        "We could not submit your booking. Please try again.";

                    bookingMessage.style.color =
                        "#b91c1c";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Booking";

                }

            }

        }
    );

}


// ============================================================
// SERVICE REQUEST / QUOTE FORM
// ============================================================

const quoteForm =
    document.getElementById(
        "quoteForm"
    );

const quoteMessage =
    document.getElementById(
        "quoteMessage"
    );


if (quoteForm) {

    quoteForm.addEventListener(
        "submit",

        async function (event) {

            event.preventDefault();


            const submitButton =
                quoteForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Submitting...";

            }


            if (quoteMessage) {

                quoteMessage.textContent =
                    "";

            }


            try {

                const formData =
                    new FormData(
                        quoteForm
                    );


                const request = {

                    name:
                        String(
                            formData.get(
                                "name"
                            )
                        ).trim(),

                    phone:
                        String(
                            formData.get(
                                "phone"
                            )
                        ).trim(),

                    email:
                        String(
                            formData.get(
                                "email"
                            ) || ""
                        ).trim() || null,

                    vehicle:
                        String(
                            formData.get(
                                "vehicle"
                            )
                        ).trim(),

                    request_type:
                        String(
                            formData.get(
                                "requestType"
                            )
                        ).trim(),

                    description:
                        String(
                            formData.get(
                                "description"
                            )
                        ).trim(),

                    preferred_contact:
                        String(
                            formData.get(
                                "preferredContact"
                            )
                        ).trim(),

                    status:
                        "New"

                };


                await insertIntoSupabase(
                    "service_requests",
                    request
                );


                if (quoteMessage) {

                    quoteMessage.textContent =
                        "Your service request has been received. Our team will review it and contact you.";

                    quoteMessage.style.color =
                        "#15803d";

                }


                quoteForm.reset();


                console.log(
                    "Service request saved successfully:",
                    request
                );

            } catch (error) {

                console.error(
                    "Service request failed:",
                    error
                );


                if (quoteMessage) {

                    quoteMessage.textContent =
                        "We could not submit your request. Please try again.";

                    quoteMessage.style.color =
                        "#b91c1c";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Service Request";

                }

            }

        }
    );

}


// ============================================================
// CONTACT FORM
// ============================================================

const contactForm =
    document.getElementById(
        "contactForm"
    );

const contactFormMessage =
    document.getElementById(
        "contactFormMessage"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",

        async function (event) {

            event.preventDefault();


            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending...";

            }


            if (contactFormMessage) {

                contactFormMessage.textContent =
                    "";

            }


            try {

                const formData =
                    new FormData(
                        contactForm
                    );


                const message = {

                    name:
                        String(
                            formData.get(
                                "name"
                            )
                        ).trim(),

                    email:
                        String(
                            formData.get(
                                "email"
                            )
                        ).trim(),

                    message:
                        String(
                            formData.get(
                                "message"
                            )
                        ).trim(),

                    status:
                        "New"

                };


                await insertIntoSupabase(
                    "contact_messages",
                    message
                );


                if (contactFormMessage) {

                    contactFormMessage.textContent =
                        "Message sent successfully. We will get back to you.";

                    contactFormMessage.style.color =
                        "#15803d";

                }


                contactForm.reset();


                console.log(
                    "Contact message saved successfully:",
                    message
                );

            } catch (error) {

                console.error(
                    "Contact message failed:",
                    error
                );


                if (contactFormMessage) {

                    contactFormMessage.textContent =
                        "We could not send your message. Please try again.";

                    contactFormMessage.style.color =
                        "#b91c1c";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Message";

                }

            }

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


if (
    "IntersectionObserver"
    in window
) {

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
// READY
// ============================================================

console.log(
    "Kivu Auto Studio loaded."
);

console.log(
    "Supabase database connection active."
);
