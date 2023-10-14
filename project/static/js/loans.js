// Function to filter loans based on search input
function filterLoans(searchTerm) {
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        const customerName = row.querySelector('td:first-child').textContent.toLowerCase();
        const bookName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (customerName.includes(searchTerm) || bookName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


// Function to fetch and log book data
function fetchBooks() {
    return axios.get('/loans/books/json')
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
    return axios.get('/loans/customers/json')
        .then(function (response) {
            console.log('Customers API response:', response.data.customers);
            return response.data.customers;
        })
        .catch(function (error) {
            console.error('Error fetching customers:', error);
        });
}


// Function to fetch customer details based on customer name
function fetchCustomerDetails(customerName) {
    return axios.get(`/loans/customers/details/${customerName}`)
        .then(function (response) {
            return response.data.customer;
        })
        .catch(function (error) {
            console.error('Error fetching customer details:', error);
        });
}


// Function to fetch book details based on book name
function fetchBookDetails(bookName) {
    return axios.get(`/loans/books/details/${bookName}`)
        .then(function (response) {
            return response.data.book;
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


// Function to handle loan submission
function handleLoanSubmission(event) {
    const loanDate = new Date(document.getElementById('loan_date').value);
    const returnDate = new Date(document.getElementById('return_date').value);

    const formData = {
        customer_name: document.getElementById('customer_name').value,
        book_name: document.getElementById('book_name').value,
        loan_date: loanDate.toISOString(),
        return_date: returnDate.toISOString(),
        csrf_token: document.getElementById('csrf_token').value
    };

    fetchCustomerDetails(formData.customer_name)
        .then(function (customerDetails) {
            formData.customer_details = customerDetails;
            // Use axios to make an AJAX POST request
            return axios.post('/loans/create', formData);
        })
        .then(function (response) {
            console.log('Loan added successfully!');
        })
        .catch(function (error) {
            console.error('Error adding loan:', error.response ? error.response.data : error.message);
            alert('Error adding loan: ' + (error.response ? error.response.data.error : error.message));
        });
}


// Function to fetch loan details based on loan ID
function fetchLoanDetails(loanId) {
    return axios.get(`/loans/${loanId}/details`)
        .then(function (response) {
            const loanDetails = response.data.loan;

            // Fetch book details based on book name
            return fetchBookDetails(loanDetails.book_name)
                .then(function (bookDetails) {
                    loanDetails.book_details = bookDetails;
                    return loanDetails;
                });
        })
        .catch(function (error) {
            console.error('Error fetching loan details:', error);
            throw error; // Propagate the error to be caught in deleteLoan function
        });
}


// Function to handle deleting a loan
function deleteLoan(loanId) {
    fetchLoanDetails(loanId)
        .then(loanDetails => {
            const bookDetails = {
                name: loanDetails.book_name,
                author: loanDetails.original_author,
                year_published: loanDetails.original_year_published,
                book_type: loanDetails.original_book_type
            };

            // Delete the loan and return the book to the books database
            return axios.post(`/loans/${loanId}/delete`, bookDetails);
        })
        .then(() => {
            alert('Loan deleted successfully.');
            const deletedLoanRow = document.getElementById(`loan-${loanId}`);
            if (deletedLoanRow) {
                deletedLoanRow.remove();
            }
            window.location.reload();
        })
        .catch(error => {
            console.error('Error deleting loan:', error);
            alert('An error occurred while deleting the loan.');
        });
}


// Function to ensure DOM is fully loaded
function setupEventListeners() {
    const addLoanButton = document.getElementById('addLoanButton');
    if (addLoanButton) {
        addLoanButton.addEventListener('click', handleLoanSubmission);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = searchInput.value.toLowerCase();
            filterLoans(searchTerm);
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const loanId = button.dataset.loanId;
            console.log('Delete button clicked for loan ID:', loanId);
            deleteLoan(loanId);
        });
    });
}


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
