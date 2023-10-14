// Function to filter loans based on search input
const filterLoans = (searchTerm) => {
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
};


// Function to fetch and log book data
const fetchBooks = () => {
    return axios.get('/loans/books/json')
        .then(response => {
            console.log('Books API response:', response.data.books);
            return response.data.books;  // Return books for further processing
        })
        .catch(error => {
            console.error('Error fetching books:', error);
        });
};


// Function to fetch and log customer data
const fetchCustomers = () => {
    return axios.get('/loans/customers/json')
        .then(response => {
            console.log('Customers API response:', response.data.customers);
            return response.data.customers;
        })
        .catch(error => {
            console.error('Error fetching customers:', error);
        });
};


// Function to fetch customer details based on customer name
const fetchCustomerDetails = (customerName) => {
    return axios.get(`/loans/customers/details/${customerName}`)
        .then(response => {
            return response.data.customer;
        })
        .catch(error => {
            console.error('Error fetching customer details:', error);
        });
};


// Function to fetch book details based on book name
const fetchBookDetails = (bookName) => {
    return axios.get(`/loans/books/details/${bookName}`)
        .then(response => {
            return response.data.book;
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
};


// Function to populate dropdown options
const populateDropdown = (elementId, data) => {
    const dropdown = document.getElementById(elementId);

    dropdown.innerHTML = '';

    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;  
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
};


// Function to handle loan submission
const handleLoanSubmission = (event) => {
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
        .then(customerDetails => {
            formData.customer_details = customerDetails;
            // Use axios to make an AJAX POST request
            return axios.post('/loans/create', formData);
        })
        .then(response => {
            console.log('Loan added successfully!');
        })
        .catch(error => {
            console.error('Error adding loan:', error.response ? error.response.data : error.message);
            alert('Error adding loan: ' + (error.response ? error.response.data.error : error.message));
        });
};


// Function to fetch loan details based on loan ID
const fetchLoanDetails = (loanId) => {
    return axios.get(`/loans/${loanId}/details`)
        .then(response => {
            const loanDetails = response.data.loan;

            // Fetch book details based on book name
            return fetchBookDetails(loanDetails.book_name)
                .then(bookDetails => {
                    loanDetails.book_details = bookDetails;
                    return loanDetails;
                });
        })
        .catch(error => {
            console.error('Error fetching loan details:', error);
            throw error; 
        });
};


// Function to handle deleting a loan
const deleteLoan = (loanId) => {
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
};


// Function to ensure DOM is fully loaded
const setupEventListeners = () => {
    const addLoanButton = document.getElementById('addLoanButton');
    if (addLoanButton) {
        addLoanButton.addEventListener('click', handleLoanSubmission);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            filterLoans(searchTerm);
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const loanId = button.dataset.loanId;
            console.log('Delete button clicked for loan ID:', loanId);
            deleteLoan(loanId);
        });
    });
};


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
