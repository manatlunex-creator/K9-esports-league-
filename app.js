import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://k9-efootball-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

setTimeout(() => {
    const intro = document.getElementById("intro-screen");
    const main = document.getElementById("main-content");
    if (intro) intro.style.display = "none";
    if (main) main.classList.remove("hidden");
}, 3500);

const cvForm = document.getElementById("cv-form");
const statusDisplay = document.getElementById("status-display");

cvForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("cv-name").value;
    const code = document.getElementById("country-code").value;
    const phoneNum = document.getElementById("cv-phone").value;
    const age = document.getElementById("cv-age").value;
    const power = document.getElementById("cv-power").value;
    const experience = document.getElementById("cv-experience").value;

    if (!code) {
        alert("Zəhmət olmasa ölkə kodunu seçin!");
        return;
    }

    const fullPhone = `${code} ${phoneNum}`;
    const applicantId = "user_" + Date.now();

    const applicationData = {
        id: applicantId,
        name: name,
        phone: fullPhone,
        age: age,
        power: power,
        experience: experience,
        status: "Gözləmədədir ⏳",
        actionBy: "Yoxdur"
    };

    push(ref(db, 'applications'), applicationData)
        .then(() => {
            alert("Müraciətiniz uğurla göndərildi!");
            localStorage.setItem("k9_applicant_id", applicantId);
            cvForm.reset();
            loadMyStatus(applicantId);
        })
        .catch((error) => {
            alert("Xəta baş verdi: " + error.message);
        });
});

function loadMyStatus(appId) {
    const appsRef = ref(db, 'applications');
    onValue(appsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            let found = false;
            for (let key in data) {
                if (data[key].id === appId) {
                    const item = data[key];
                    statusDisplay.innerHTML = `
                        <p><strong>Ad:</strong> ${item.name}</p>
                        <p><strong>Status:</strong> <span style="color:${item.status.includes('Qəbul') ? '#4caf50' : item.status.includes('Rədd') ? '#f44336' : '#ffc107'}">${item.status}</span></p>
                        <p><strong>Baxdı:</strong> ${item.actionBy || 'Hələ baxılmayıb'}</p>
                    `;
                    found = true;
                    break;
                }
            }
            if (!found) {
                statusDisplay.innerHTML = `<p>Müraciət tapılmadı.</p>`;
            }
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const savedId = localStorage.getItem("k9_applicant_id");
    if (savedId) {
        loadMyStatus(savedId);
    }
});
