const employees = [
    { id: 1, name: 'John Doe', age: 30, department: 'IT', salary: 50000, specialization: 'Javacript' },
    { id: 2, name: 'Alice Smith', age: 28, department: 'HR', salary: 45000, specialization: 'Python' },
    { id: 3, name: 'Bob Johnson', age: 35, department: 'Finance', salary: 60000, specialization: 'Java' },
    { id: 4, name: 'Maria Garcia', age: 32, department: 'Marketing', salary: 42000, specialization: 'SEO' },
    { id: 5, name: 'David Brown', age: 40, department: 'IT', salary: 70000, specialization: 'DevOps' },
    { id: 6, name: 'Emma Wilson', age: 26, department: 'HR', salary: 38000, specialization: 'Recruitment' },
    { id: 7, name: 'Liam Miller', age: 29, department: 'Sales', salary: 47000, specialization: 'CRM' },
    { id: 8, name: 'Olivia Davis', age: 45, department: 'Finance', salary: 80000, specialization: 'Accounting' },
    { id: 9, name: 'Noah Martinez', age: 33, department: 'IT', salary: 55000, specialization: 'Javacript' },
    { id: 10, name: 'Ava Anderson', age: 38, department: 'Legal', salary: 65000, specialization: 'Compliance' },
    { id: 11, name: 'William Thomas', age: 27, department: 'Support', salary: 36000, specialization: 'Customer Success' },
    { id: 12, name: 'Sophia Jackson', age: 31, department: 'Marketing', salary: 43000, specialization: 'Content' },
    { id: 13, name: 'James White', age: 36, department: 'IT', salary: 62000, specialization: 'Fullstack' },
    { id: 14, name: 'Isabella Harris', age: 34, department: 'R&D', salary: 72000, specialization: 'AI' },
    { id: 15, name: 'Benjamin Martin', age: 41, department: 'Sales', salary: 68000, specialization: 'BusinessDev' }
];

// Fonction utilitaire pour formater la monnaie
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

// Fonction pour créer un tableau HTML
function createTable(employees) {
    return `
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Âge</th>
                    <th>Département</th>
                    <th>Salaire</th>
                    <th>Spécialisation</th>
                </tr>
            </thead>
            <tbody>
                ${employees.map(employee => `
                    <tr>
                        <td>${employee.id}</td>
                        <td>${employee.name}</td>
                        <td>${employee.age} ans</td>
                        <td><span class="badge bg-primary">${employee.department}</span></td>
                        <td>${formatCurrency(employee.salary)}</td>
                        <td><span class="badge bg-secondary">${employee.specialization}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Fonction pour afficher une alerte
function showAlert(message, type = 'info') {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.setAttribute('role', 'alert');
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const container = document.getElementById('employeesDetails');
    container.insertAdjacentElement('beforebegin', alertElement);

    // Supprimer uniquement cette alerte après 4 secondes
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 4000);
}

// Fonction pour afficher tous les employés
function displayEmployees() {
    document.getElementById('employeesDetails').innerHTML = createTable(employees);
    showAlert('Liste de tous les employés affichée', 'success');
}

// --- Dropdowns dépendants : Département -> Spécialisation ---
function getDepartmentMap() {
    const map = {};
    employees.forEach(emp => {
        if (!map[emp.department]) map[emp.department] = new Set();
        map[emp.department].add(emp.specialization);
    });
    return map; // { department: Set(specializations) }
}

function populateDepartmentSelect() {
    const deptSelect = document.getElementById('departmentSelect');
    if (!deptSelect) return;
    const map = getDepartmentMap();
    // clear existing (keep first option)
    deptSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    Object.keys(map).sort().forEach(dept => {
        const opt = document.createElement('option');
        opt.value = dept;
        opt.textContent = dept;
        deptSelect.appendChild(opt);
    });
}

function populateSpecializations(department) {
    const specSelect = document.getElementById('specializationSelect');
    if (!specSelect) return;
    // clear existing (keep first option)
    specSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    if (!department) {
        // show all specializations across departments
        const allSpecs = new Set();
        employees.forEach(e => allSpecs.add(e.specialization));
        Array.from(allSpecs).sort().forEach(spec => {
            const opt = document.createElement('option');
            opt.value = spec;
            opt.textContent = spec;
            specSelect.appendChild(opt);
        });
        return;
    }
    const map = getDepartmentMap();
    const specs = map[department] ? Array.from(map[department]).sort() : [];
    specs.forEach(spec => {
        const opt = document.createElement('option');
        opt.value = spec;
        opt.textContent = spec;
        specSelect.appendChild(opt);
    });
}

function filterByDepartmentAndSpecialization() {
    const dept = document.getElementById('departmentSelect')?.value || '';
    const spec = document.getElementById('specializationSelect')?.value || '';
    let results = employees.slice();
    if (dept) results = results.filter(e => e.department === dept);
    if (spec) results = results.filter(e => e.specialization === spec);
    if (results.length > 0) {
        document.getElementById('employeesDetails').innerHTML = createTable(results);
        showAlert(`${results.length} employé(s) trouvé(s)`, 'success');
    } else {
        document.getElementById('employeesDetails').innerHTML = '';
        showAlert('Aucun employé trouvé pour ces critères', 'warning');
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    populateDepartmentSelect();
    populateSpecializations('');
});

// Fonction pour calculer le total des salaires
function calculateTotalSalaries() {
    const totalSalaries = employees.reduce((acc, employee) => acc + employee.salary, 0);
    document.getElementById('employeesDetails').innerHTML = `
        <div class="card text-center">
            <div class="card-body">
                <h5 class="card-title">Total des salaires</h5>
                <p class="card-text display-4">${formatCurrency(totalSalaries)}</p>
            </div>
        </div>
    `;
    showAlert('Calcul du total des salaires effectué', 'info');
}


// Fonction pour trouver un employé par ID
function findEmployeeById(employeeId) {
    const id = Number(employeeId);
    if (!Number.isInteger(id) || id <= 0) {
        showAlert('Veuillez saisir un ID valide (nombre entier positif)', 'warning');
        return;
    }
    const foundEmployee = employees.find(employee => employee.id === id);
    if (foundEmployee) {
        document.getElementById('employeesDetails').innerHTML = createTable([foundEmployee]);
        showAlert('Employé trouvé', 'success');
    } else {
        document.getElementById('employeesDetails').innerHTML = '';
        showAlert('Aucun employé trouvé avec cet ID', 'danger');
    }
}
