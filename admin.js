import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://k9-efootball-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.adminLogin = function() {
    const user = document.getElementById("admin-user").value;
    const pass = document.getElementById("admin-pass").value;
    const errorText = document.getElementById("login-error");

    if (user === "K9ESCOBAR211_" && pass === "AA211_90") {
        document.getElementById("admin-login").classList.add("hidden");
        document.getElementById("admin-dashboard").classList.remove("hidden");
        loadApplications();
    } else {
        errorText.innerText = "İstifadəçi adı və ya şifrə səhvdir!";
    }
};

window.adminLogout = function() {
    document.getElementById("admin-login").classList.remove("hidden");
    document.getElementById("admin-dashboard").classList.add("hidden");
};

function loadApplications() {
    const appsRef = ref(db, 'applications');
    onValue(appsRef, (snapshot) => {
        const data = snapshot.val();
        const listDiv = document.getElementById("applications-list");
        listDiv.innerHTML = "";

        if (!data) {
            listDiv.innerHTML = "<p style='margin-top:10px; color:#aaa; font-size:13px;'>Hələ heç bir müraciət yoxdur.</p>";
            return;
        }

        for (let key in data) {
            const item = data[key];
            const card = document.createElement("div");
            card.className = "app-card";
            card.innerHTML = `
                <p><strong>Ad:</strong> ${item.name}</p>
                <p><strong>Nömrə:</strong> ${item.phone}</p>
                <p><strong>Yaş:</strong> ${item.age}</p>
                <p><strong>Güc:</strong> ${item.power}</p>
                <p><strong>Təcrübə:</strong> ${item.experience}</p>
                <p><strong>Status:</strong> <span style="color:${item.status.includes('Qəbul') ? '#4caf50' : item.status.includes('Rədd') ? '#f44336' : '#ffc107'}">${item.status}</span></p>
                <p><strong>Baxdı:</strong> ${item.actionBy || 'Yoxdur'}</p>
                <div class="action-btns">
                    <button class="accept-btn" onclick="updateStatus('${key}', 'Qəbul edildi ✅')">Qəbul Et</button>
                    <button class="reject-btn" onclick="updateStatus('${key}', 'Rədd edildi ❌')">Rədd Et</button>
                </div>
            `;
            listDiv.appendChild(card);
        }
    });
}

window.updateStatus = function(firebaseKey, newStatus) {
    const adminSelect = document.getElementById("active-admin-name");
    const selectedAdmin = adminSelect.value;

    if (!selectedAdmin) {
        alert("Zəhmət olmasa əməliyyat edən adminin adını yuxarıdakı siyahıdan seçin!");
        return;
    }

    const itemRef = ref(db, 'applications/' + firebaseKey);
    update(itemRef, {
        status: newStatus,
        actionBy: selectedAdmin
    }).then(() => {
        alert("Status yeniləndi!");
    }).catch((error) => {
        alert("Xəta: " + error.message);
    });
};
