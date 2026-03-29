// ===============================
// Portal State Management
// ===============================
let currentUser = null;
let currentReceipt = null;

// Sample receipts data (in production, this would come from a backend API)
const sampleReceipts = [
    {
        id: 'EBM-2026-001',
        date: '2026-01-28',
        amount: 150000,
        currency: 'RWF',
        service: 'Customs Clearance',
        cargoType: 'Electronics',
        status: 'Paid'
    },
    {
        id: 'EBM-2026-002',
        date: '2026-01-25',
        amount: 280000,
        currency: 'RWF',
        service: 'Freight Forwarding',
        cargoType: 'Textiles',
        status: 'Paid'
    },
    {
        id: 'EBM-2026-003',
        date: '2026-01-20',
        amount: 95000,
        currency: 'RWF',
        service: 'Cargo Documentation',
        cargoType: 'Machinery Parts',
        status: 'Paid'
    },
    {
        id: 'EBM-2025-215',
        date: '2025-12-15',
        amount: 320000,
        currency: 'RWF',
        service: 'Customs Clearance',
        cargoType: 'Agricultural Products',
        status: 'Paid'
    },
    {
        id: 'EBM-2025-198',
        date: '2025-11-28',
        amount: 180000,
        currency: 'RWF',
        service: 'Freight Forwarding',
        cargoType: 'Medical Supplies',
        status: 'Paid'
    }
];

// ===============================
// Initialize Portal
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();

    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }

    // Search and filter
    const searchInput = document.getElementById('searchReceipts');
    if (searchInput) {
        searchInput.addEventListener('input', filterReceipts);
    }

    const filterMonth = document.getElementById('filterMonth');
    if (filterMonth) {
        filterMonth.addEventListener('change', filterReceipts);
    }

    const filterYear = document.getElementById('filterYear');
    if (filterYear) {
        filterYear.addEventListener('change', filterReceipts);
    }
}

// ===============================
// Authentication Functions
// ===============================
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // In production, this would make an API call to your backend
    // For demo purposes, we'll simulate authentication
    
    if (email && password) {
        // Simulate API delay
        setTimeout(() => {
            const user = {
                name: email.split('@')[0],
                email: email,
                receipts: sampleReceipts
            };
            
            currentUser = user;
            
            // Store in localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('uqwUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('uqwUser', JSON.stringify(user));
            }
            
            showDashboard();
            loadReceipts();
        }, 500);
    } else {
        showMessage('loginMessage', 'Please enter valid credentials', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showMessage('registerMessage', 'Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('registerMessage', 'Password must be at least 6 characters', 'error');
        return;
    }
    
    // In production, this would make an API call to your backend
    setTimeout(() => {
        showMessage('registerMessage', 'Account created successfully! You can now login.', 'success');
        
        // After 2 seconds, switch to login
        setTimeout(() => {
            showLogin();
        }, 2000);
    }, 500);
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // In production, this would send a password reset email
    setTimeout(() => {
        showMessage('forgotMessage', 'Password reset instructions sent to ' + email, 'success');
        
        setTimeout(() => {
            showLogin();
        }, 3000);
    }, 500);
}

function checkLoginStatus() {
    // Check localStorage first, then sessionStorage
    let userData = localStorage.getItem('uqwUser') || sessionStorage.getItem('uqwUser');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        showDashboard();
        loadReceipts();
    } else {
        showLogin();
    }
}

function logout() {
    localStorage.removeItem('uqwUser');
    sessionStorage.removeItem('uqwUser');
    currentUser = null;
    showLogin();
}

// ===============================
// Section Navigation
// ===============================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.portal-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show requested section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
}

function showLogin() {
    showSection('loginSection');
    document.getElementById('loginForm').reset();
    document.getElementById('loginMessage').style.display = 'none';
}

function showRegister() {
    showSection('registerSection');
    document.getElementById('registerForm').reset();
    document.getElementById('registerMessage').style.display = 'none';
}

function showDashboard() {
    showSection('dashboardSection');
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
    }
}

function showForgotPassword() {
    showSection('forgotPasswordSection');
    document.getElementById('forgotPasswordForm').reset();
    document.getElementById('forgotMessage').style.display = 'none';
}

function showMessage(elementId, message, type) {
    const messageEl = document.getElementById(elementId);
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'auth-message ' + type;
    }
}

// ===============================
// Receipt Management
// ===============================
function loadReceipts() {
    if (!currentUser || !currentUser.receipts) return;
    
    const receipts = currentUser.receipts;
    
    // Update stats
    document.getElementById('totalReceipts').textContent = receipts.length;
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const thisMonthReceipts = receipts.filter(r => {
        const receiptDate = new Date(r.date);
        return receiptDate.getMonth() + 1 === currentMonth && 
               receiptDate.getFullYear() === currentYear;
    });
    document.getElementById('thisMonth').textContent = thisMonthReceipts.length;
    
    // For demo, downloads is 0
    document.getElementById('downloads').textContent = '0';
    
    // Display receipts
    displayReceipts(receipts);
}

function displayReceipts(receipts) {
    const receiptsList = document.getElementById('receiptsList');
    
    if (!receipts || receipts.length === 0) {
        receiptsList.innerHTML = `
            <div class="no-receipts">
                <i class="fas fa-inbox"></i>
                <p>No receipts found</p>
                <small>Your EBM receipts will appear here</small>
            </div>
        `;
        return;
    }
    
    receiptsList.innerHTML = receipts.map(receipt => `
        <div class="receipt-card" onclick="viewReceipt('${receipt.id}')">
            <div class="receipt-header">
                <div>
                    <div class="receipt-number">${receipt.id}</div>
                    <div class="receipt-date">
                        <i class="fas fa-calendar"></i> ${formatDate(receipt.date)}
                    </div>
                </div>
            </div>
            <div class="receipt-body">
                <div class="receipt-field">
                    <label>Service</label>
                    <span>${receipt.service}</span>
                </div>
                <div class="receipt-field">
                    <label>Cargo Type</label>
                    <span>${receipt.cargoType}</span>
                </div>
                <div class="receipt-field">
                    <label>Amount</label>
                    <span class="receipt-amount">${formatCurrency(receipt.amount, receipt.currency)}</span>
                </div>
                <div class="receipt-field">
                    <label>Status</label>
                    <span style="color: var(--success-color);">
                        <i class="fas fa-check-circle"></i> ${receipt.status}
                    </span>
                </div>
            </div>
            <div class="receipt-footer">
                <button class="btn btn-outline" onclick="event.stopPropagation(); downloadReceipt('${receipt.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn btn-primary" onclick="event.stopPropagation(); viewReceipt('${receipt.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');
}

function filterReceipts() {
    if (!currentUser || !currentUser.receipts) return;
    
    const searchTerm = document.getElementById('searchReceipts').value.toLowerCase();
    const filterMonth = document.getElementById('filterMonth').value;
    const filterYear = document.getElementById('filterYear').value;
    
    let filtered = currentUser.receipts;
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(r => 
            r.id.toLowerCase().includes(searchTerm) ||
            r.service.toLowerCase().includes(searchTerm) ||
            r.cargoType.toLowerCase().includes(searchTerm) ||
            r.amount.toString().includes(searchTerm)
        );
    }
    
    // Filter by month
    if (filterMonth) {
        filtered = filtered.filter(r => {
            const receiptDate = new Date(r.date);
            return (receiptDate.getMonth() + 1) === parseInt(filterMonth);
        });
    }
    
    // Filter by year
    if (filterYear) {
        filtered = filtered.filter(r => {
            const receiptDate = new Date(r.date);
            return receiptDate.getFullYear() === parseInt(filterYear);
        });
    }
    
    displayReceipts(filtered);
}

function viewReceipt(receiptId) {
    const receipt = currentUser.receipts.find(r => r.id === receiptId);
    if (!receipt) return;
    
    currentReceipt = receipt;
    
    const modalBody = document.getElementById('receiptModalBody');
    modalBody.innerHTML = `
        <div class="receipt-display">
            <div class="receipt-display-header">
                <h2>U.Q.W Ltd</h2>
                <p>Customs Clearing & Forwarding Agency</p>
                <p style="font-size: 0.9rem;">RRA Licensed | Rwanda</p>
            </div>
            
            <div class="receipt-display-row">
                <div class="receipt-display-item">
                    <label>Receipt Number</label>
                    <strong>${receipt.id}</strong>
                </div>
                <div class="receipt-display-item">
                    <label>Date</label>
                    <strong>${formatDate(receipt.date)}</strong>
                </div>
            </div>
            
            <div class="receipt-display-row">
                <div class="receipt-display-item">
                    <label>Client Name</label>
                    <strong>${currentUser.name}</strong>
                </div>
                <div class="receipt-display-item">
                    <label>Client Email</label>
                    <strong>${currentUser.email}</strong>
                </div>
            </div>
            
            <div class="receipt-display-row">
                <div class="receipt-display-item">
                    <label>Service</label>
                    <strong>${receipt.service}</strong>
                </div>
                <div class="receipt-display-item">
                    <label>Cargo Type</label>
                    <strong>${receipt.cargoType}</strong>
                </div>
            </div>
            
            <div class="receipt-display-row">
                <div class="receipt-display-item">
                    <label>Payment Status</label>
                    <strong style="color: var(--success-color);">${receipt.status}</strong>
                </div>
                <div class="receipt-display-item">
                    <label>Payment Method</label>
                    <strong>Mobile Money</strong>
                </div>
            </div>
            
            <div class="receipt-display-total">
                <label style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">Total Amount</label>
                <h3>${formatCurrency(receipt.amount, receipt.currency)}</h3>
            </div>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--border-color); text-align: center; font-size: 0.85rem; color: var(--text-light);">
                <p>Contact: +250 788 655 645 | mwibukajules@yahoo.com</p>
                <p>This is an official EBM receipt from U.Q.W Ltd</p>
            </div>
        </div>
    `;
    
    document.getElementById('receiptModal').classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('active');
    currentReceipt = null;
}

function downloadReceipt(receiptId) {
    if (!receiptId && currentReceipt) {
        receiptId = currentReceipt.id;
    }
    
    // In production, this would generate and download a PDF
    // For now, we'll show a message
    alert('Downloading receipt ' + receiptId + '...\n\nIn production, this would download a PDF of your EBM receipt.');
    
    // Update downloads count
    const downloadsEl = document.getElementById('downloads');
    if (downloadsEl) {
        const current = parseInt(downloadsEl.textContent);
        downloadsEl.textContent = current + 1;
    }
}

function printReceipt() {
    if (!currentReceipt) return;
    
    // In production, this would open a print dialog with a formatted receipt
    window.print();
}

// ===============================
// Utility Functions
// ===============================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatCurrency(amount, currency = 'RWF') {
    return new Intl.NumberFormat('en-RW', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(amount);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('receiptModal');
    if (event.target === modal) {
        closeReceiptModal();
    }
}
