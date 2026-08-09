// State Management
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

// DOM Elements
const form = document.getElementById('transaction-form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const list = document.getElementById('transaction-list');
const emptyState = document.getElementById('empty-state');

const balanceDisplay = document.getElementById('total-balance');
const incomeDisplay = document.getElementById('total-income');
const expenseDisplay = document.getElementById('total-expenses');
const dateDisplay = document.getElementById('current-date');
const filterButtons = document.querySelectorAll('.filter-btn');

// Custom Category Dropdown Elements
const categoryBtn = document.getElementById('category-btn');
const categoryMenu = document.getElementById('category-menu');
const categorySelected = document.getElementById('category-selected');

// Initialize App
function init() {
    // Set Header Date (Indian Locale Format)
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    dateDisplay.innerText = new Date().toLocaleDateString('en-IN', options);

    // Setup event listeners
    form.addEventListener('submit', addTransaction);
    setupFilters();
    setupCategoryDropdown();

    // Initial render
    updateUI();
}

// Add New Transaction
function addTransaction(e) {
    e.preventDefault();

    const transaction = {
        id: crypto.randomUUID(),
        description: descInput.value.trim(),
        amount: parseFloat(amountInput.value),
        type: typeInput.value,
        category: categoryBtn.dataset.value || 'Other',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    transactions.unshift(transaction);
    updateLocalStorage();
    updateUI();

    form.reset();
    // Reset category to default
    categorySelected.innerHTML = `<i data-lucide="utensils" class="w-4 h-4"></i> Food & Dining`;
    categoryBtn.dataset.value = "Food";
    lucide.createIcons();
}

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    updateUI();
}

// Format number to Indian Currency System style
function formatRupee(amount) {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// Calculate Metrics and Render
function updateUI() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    balanceDisplay.innerText = `${balance < 0 ? '-' : ''}₹${formatRupee(Math.abs(balance))}`;
    incomeDisplay.innerText = `+₹${formatRupee(income)}`;
    expenseDisplay.innerText = `-₹${formatRupee(expenses)}`;

    balanceDisplay.className = balance < 0
        ? "text-3xl font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg"
        : "text-3xl font-bold text-slate-900";

    const filtered = transactions.filter(t => {
        if (currentFilter === 'all') return true;
        return t.type === currentFilter;
    });

    list.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filtered.forEach(t => renderRow(t));
    }

    lucide.createIcons();
}

// Render Transaction Row
function renderRow(t) {
    const isIncome = t.type === 'income';
    const amountClass = isIncome ? 'text-emerald-600 font-semibold' : 'text-slate-900 font-semibold';
    const amountPrefix = isIncome ? '+' : '-';

    const item = document.createElement('li');
    item.className = "flex justify-between items-center py-4 group hover:bg-slate-50/50 px-2 rounded-xl transition-colors";
    
    item.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm shadow-xs border border-slate-200/50">
                ${getCategoryIcon(t.category)}
            </div>
            <div>
                <h4 class="text-sm font-medium text-slate-900">${t.description}</h4>
                <div class="flex items-center gap-2 mt-0.5">
                    <span class="text-xs text-slate-400">${t.date}</span>
                    <span class="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                    <span class="text-xs font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">${t.category}</span>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <span class="${amountClass}">${amountPrefix}₹${formatRupee(t.amount)}</span>
            <button onclick="deleteTransaction('${t.id}')" class="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 cursor-pointer">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    list.appendChild(item);
}

// Category Icon Mapping
function getCategoryIcon(category) {
    const mapping = {
        'Food': 'utensils',
        'Shopping': 'shopping-bag',
        'Housing': 'home',
        'Transport': 'car',
        'Entertainment': 'film',
        'Salary': 'wallet',
        'Other': 'sparkles'
    };
    const icon = mapping[category] || 'circle';
    return `<i data-lucide="${icon}" class="w-5 h-5 text-slate-500"></i>`;
}

// Filter Setup
function setupFilters() {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.className = "filter-btn px-3 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:bg-slate-50 cursor-pointer");
            e.target.className = "filter-btn px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 cursor-pointer";
            
            currentFilter = e.target.dataset.filter;
            updateUI();
        });
    });
}

// Category Dropdown Setup
function setupCategoryDropdown() {
    categoryBtn.addEventListener('click', () => {
        categoryMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.value;
            categorySelected.innerHTML = item.innerHTML;
            categoryMenu.classList.add('hidden');
            categoryBtn.dataset.value = value;
            lucide.createIcons();
        });
    });
}

// LocalStorage Update
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

init();
