// Model
const model = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    extinguishers: JSON.parse(localStorage.getItem('extinguishers')) || [],
    accidents: JSON.parse(localStorage.getItem('accidents')) || [],
    equipments: JSON.parse(localStorage.getItem('equipments')) || [],
    currentUser: null
};

// Controller
const controller = {
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}Page`).classList.add('active');
    },

    login() {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const user = model.users.find(u => 
            u.email === email && 
            CryptoJS.AES.decrypt(u.password, 'secret-key').toString(CryptoJS.enc.Utf8) === password
        );

        if (!user) {
            alert("E-mail ou mot de passe incorrect.");
            return;
        }

        model.currentUser = user;
        document.getElementById('userName').textContent = `${user.nom} ${user.prenom}`;
        this.showPage('dashboard');
    },

    register() {
        const nom = document.getElementById('registerNom').value.trim();
        const prenom = document.getElementById('registerPrenom').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();

        if (!nom || !prenom || !email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        if (model.users.some(u => u.email === email)) {
            alert("Cet e-mail est déjà enregistré.");
            return;
        }

        const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret-key').toString();
        model.users.push({ nom, prenom, email, password: encryptedPassword });
        localStorage.setItem('users', JSON.stringify(model.users));
        alert("Inscription réussie! Connectez-vous maintenant.");
        this.showPage('login');
    },

    logout() {
        model.currentUser = null;
        this.showPage('login');
    },

    addExtinguisher() {
        const type = prompt("Type d'extincteur:");
        const refillDate = prompt("Date de remplissage (YYYY-MM-DD):");
        const expiryDate = prompt("Date d'expiration (YYYY-MM-DD):");
        const location = prompt("Emplacement:");

        if (type && refillDate && expiryDate && location) {
            model.extinguishers.push({ type, refillDate, expiryDate, location });
            localStorage.setItem('extinguishers', JSON.stringify(model.extinguishers));
            this.updateTable('extinguishers', 'extinguishersTable');
        }
    },

    addAccident() {
        const name = prompt("Nom et prénom:");
        const date = prompt("Date (YYYY-MM-DD):");
        const location = prompt("Lieu:");
        const cause = prompt("Cause:");

        if (name && date && location && cause) {
            model.accidents.push({ name, date, location, cause });
            localStorage.setItem('accidents', JSON.stringify(model.accidents));
            this.updateTable('accidents', 'accidentsTable');
        }
    },

    addEquipment() {
        const nom = prompt("Nom:");
        const prenom = prompt("Prénom:");
        const functionn = prompt("Fonction:");
        const equipment = prompt("Équipement:");

        if (nom && prenom && functionn && equipment) {
            model.equipments.push({ nom, prenom, functionn, equipment });
            localStorage.setItem('equipments', JSON.stringify(model.equipments));
            this.updateTable('equipments', 'equipmentsTable');
        }
    },

    updateTable(dataType, tableId) {
        const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        model[dataType].forEach(item => {
            const row = document.createElement('tr');
            for (const key in item) {
                const cell = document.createElement('td');
                cell.textContent = item[key];
                row.appendChild(cell);
            }
            const actionCell = document.createElement('td');
            actionCell.innerHTML = `
                <button onclick="controller.deleteItem('${dataType}', ${JSON.stringify(item)})">Supprimer</button>
            `;
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    },

    deleteItem(dataType, item) {
        const index = model[dataType].findIndex(i => JSON.stringify(i) === JSON.stringify(item));
        if (index !== -1) {
            model[dataType].splice(index, 1);
            localStorage.setItem(dataType, JSON.stringify(model[dataType]));
            this.updateTable(dataType, `${dataType}Table`);
        }
    }
};

// Initialize
window.onload = () => {
    controller.updateTable('extinguishers', 'extinguishersTable');
    controller.updateTable('accidents', 'accidentsTable');
    controller.updateTable('equipments', 'equipmentsTable');
};
