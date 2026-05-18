
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK_mppJk1xlVq0yLbh6tRx0mNNvIDA4yY",
  authDomain: "invitation-wedding-18601.firebaseapp.com",
  projectId: "invitation-wedding-18601",
  storageBucket: "invitation-wedding-18601.firebasestorage.app",
  messagingSenderId: "210302966679",
  appId: "1:210302966679:web:e0c25767bc77cf2a4f42d2",
  measurementId: "G-0Z7SMSJXN7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
$(document).ready(function () {
    $('input[name="name"]').on('input', function () {
        const nameValue = $(this).val();
        $('input[name="nameWishing"]').val(nameValue);
    });
    $('input[name="nameWishing"]').on('input', function () {
        const nameValue = $(this).val();
        $('input[name="name"]').val(nameValue);
    });
    $('select[name="relationship"]').on('change', function () {
        const relationship = $(this).val();
        $('select[name="relationship"]').val(relationship);

    });
    $('#wishingForm').on('submit', async function (e) {
        e.preventDefault();

        let isValid = true;
        const nameField = $('input[name="nameWishing"]');
        // const messageWishingField = $('textarea[name="messageWishing"]');
        // const suggestionField = $('select[name="suggestion"]');
        // if (!messageWishingField.val() && !suggestionField.val()) {
        //     messageWishingField.next('.error-message').show();
        //     messageWishingField.addClass('mb-0');
        //     isValid = false;
        // }
        // else {
        //     messageWishingField.next('.error-message').hide();
        //     messageWishingField.removeClass('mb-0');


        // }
        if (nameField.val().trim() === '') {
            nameField.next('.error-message').show();
            isValid = false;
        } else {
            nameField.next('.error-message').hide();
        }
        if (isValid) {
            const formData = $(this).serializeArray();
            const formObject = {};
            $.each(formData, function (_, field) {
                formObject[field.name] = field.value;
            });
            if (!formObject.messageWishing) {
                formObject.messageWishing = formObject.suggestion;
            }
            formObject.timestamp = new Date();
            try {
                await signInAnonymously(auth);
                await addDoc(collection(db, 'rsvp_entries'), formObject);
                $('.contact__msg_wishing').show();
                $('#wishingForm')[0].reset();
                loadData();
            } catch (error) {
                console.error('Error handling the form submission', error);
            }
        }
    });
    // const musicControl = $('#music-control')[0];
    // const audioElement = document.getElementById('backgroundMusic');

    // $('#music-control').on('click', function () {
    //     this.style.animation = 'none'; // Stop the tada animation
    //     if (audioElement.paused) {
    //         audioElement.play();
    //         $(this).removeClass('ti-control-play').addClass('ti-control-pause');
    //     } else {
    //         audioElement.pause();
    //         $(this).removeClass('ti-control-pause').addClass('ti-control-play');
    //     }
    // });
    async function loadData() {
        try {
            const q = query(collection(db, 'rsvp_entries'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            let delay = 3000; // Initial delay
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                setTimeout(() => {
                    Toastify({
                        text: `Lời chúc từ ${data.nameWishing} (${data.relationship}): ${data.messageWishing}`,
                        duration: 7500,
                        newWindow: true,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "linear-gradient(to right, #BD945A, #D2B27A)",
                            top: '0px!important',
                            
                        },
                        onClick: function () { } // Callback after click
                    }).showToast();
                }, delay);
                delay += 8000;
            });
        } catch (error) {
            console.error('Error loading data', error);
        }
    }

    // Initial data load
    signInAnonymously(auth).then(() => {
        loadData();
    }).catch(error => {
        console.error('Authentication failed', error);
    });
});

