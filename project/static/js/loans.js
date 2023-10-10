// Function to fetch and log book data
function fetchBooks() {
    return axios.get('/books/json')
        .then(function (response) {
            console.log('Books API response:', response.data.books);
            return response.data.books;  // Return books for further processing
        })
        .catch(function (error) {
            console.error('Error fetching books:', error);
        });
}

// Function to fetch and log customer data
function fetchCustomers() {
    return axios.get('/customers/json')
        .then(function (response) {
            console.log('Customers API response:', response.data.customers);
            return response.data.customers;  // Return customers for further processing
        })
        .catch(function (error) {
            console.error('Error fetching customers:', error);
        });
}

// Function to fetch customer details based on customer name
function fetchCustomerDetails(customerName) {
    return axios.get(`/customers/${customerName}/edit-data`)
        .then(function (response) {
            return response.data.customer;  // Assuming the customer details are in response.data.customer
        })
        .catch(function (error) {
            console.error('Error fetching customer details:', error);
        });
}

// Function to fetch book details based on book name
function fetchBookDetails(bookName) {
    return axios.get(`/books/details/${bookName}`)
        .then(function (response) {
            return response.data.book;  // Assuming the book details are in response.data.book
        })
        .catch(function (error) {
            console.error('Error fetching book details:', error);
        });
}

// Function to populate dropdown options
function populateDropdown(elementId, data) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = '';

    data.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.name;  // Assuming 'name' is the property for the value
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
}

// Function to remove the selected book (simulate removal)
function removeBook(bookId) {
    console.log(`Book with ID ${bookId} removed.`);
}

// Function to handle loan submission
function handleLoanSubmission(event) {
    event.preventDefault();

    const bookId = document.getElementById('book_name').value;
    const customerName = document.getElementById('customer_name').value;
    const loanDate = document.getElementById('loan_date').value;
    const returnDate = document.getElementById('return_date').value;
    
    const formData = {
        customer_name: customerName,
        book_id: bookId,
        loan_date: loanDate,
        return_date: returnDate
    };
    

    // Fetch customer details based on selected customer
    fetchCustomerDetails(customerName)
        .then(function (customerDetails) {
            formData.customer_details = customerDetails;
            return axios.post('/loans/create', formData);
        })
        .then(function (response) {
            alert('Loan added successfully!');
            // Remove the selected book (simulate removal)
            removeBook(bookId);
            document.getElementById('addLoanModal').classList.remove('show');
            document.body.classList.remove('modal-open');
            location.reload();
        })
        .catch(function (error) {
            console.error('Error adding loan:', error.response ? error.response.data : error.message);
            alert('Error adding loan: ' + (error.response ? error.response.data.error : error.message));
        });
}

// Function to ensure DOM is fully loaded
function setupEventListeners() {
    const addLoanButton = document.getElementById('addLoanButton');

    if (addLoanButton) {
        addLoanButton.addEventListener('click', handleLoanSubmission);
    }
    
    const loanDateInput = document.getElementById('loan_date');
    const returnDateInput = document.getElementById('return_date');

    loanDateInput.addEventListener('focus', function () {
        loanDateInput.type = 'date';
        loanDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    });

    returnDateInput.addEventListener('focus', function () {
        returnDateInput.type = 'date';
        returnDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    });
}

// Document loaded event handler
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded. Fetching book and customer data...');

    // Fetch books and populate the book dropdown
    fetchBooks()
        .then(function (books) {
            populateDropdown('book_name', books);
        })
        .then(function () {
            return fetchCustomers();  // Fetch customers after books
        })
        .then(function (customers) {
            populateDropdown('customer_name', customers);
        })
        .then(function () {
            // Setup event listeners after fetching data
            setupEventListeners();
        });
});
