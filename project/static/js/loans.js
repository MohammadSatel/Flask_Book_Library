// Function to fetch and log book data
function fetchBooks() {
    axios.get('/books/json')
        .then(function (response) {
            console.log('Books API response:', response.data.books);
        })
        .catch(function (error) {
            console.error('Error fetching books:', error);
        });
}

// Function to fetch and log customer data
function fetchCustomers() {
    axios.get('/customers/json')
        .then(function (response) {
            console.log('Customers API response:', response.data.customers);
        })
        .catch(function (error) {
            console.error('Error fetching customers:', error);
        });
}




// Update the function to populate book dropdown
function populateBookDropdown() {
    axios.get('/books/json')
        .then(function (response) {
            const books = response.data.books;
            const bookDropdown = document.getElementById('book_name');
            bookDropdown.innerHTML = '';

            books.forEach(function (book) {
                const option = document.createElement('option');
                option.value = book.name;
                option.textContent = book.name;
                bookDropdown.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error('Error fetching book names:', error);
        });
}


// Update the function to populate customer dropdown
function populateCustomerDropdown() {
    axios.get('/customers/json')  // Update the route to fetch customer data
        .then(function (response) {
            const customers = response.data.customers;
            const customerDropdown = document.getElementById('customer_name');
            customerDropdown.innerHTML = '';  // Clear previous options

            customers.forEach(function (customer) {
                const option = document.createElement('option');
                option.value = customer.name;  // Use customer name as the value
                option.textContent = customer.name;
                customerDropdown.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error('Error fetching customer names:', error);
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

// Function to fetch customer details based on customer name
function fetchCustomerDetails(customerName) {
    return axios.get(`/customers/details/${customerName}`)
        .then(function (response) {
            return response.data.customer;  // Assuming the customer details are in response.data.customer
        })
        .catch(function (error) {
            console.error('Error fetching customer details:', error);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM content loaded. Fetching book and customer data...');
    populateBookDropdown();
    populateCustomerDropdown();

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

    const addLoanForm = document.getElementById('addLoanForm');
    addLoanForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const loanDate = new Date(document.getElementById('loan_date').value);
        const formattedLoanDate = loanDate.toISOString().split('T')[0];

        const returnDate = new Date(document.getElementById('return_date').value);
        const formattedReturnDate = returnDate.toISOString().split('T')[0];

        const bookId = document.getElementById('book_name').value;
        const customerId = document.getElementById('customer_name').value;

        const formData = {
            customer_id: customerId,  // Fixed incorrect variable name
            book_id: bookId,  // Fixed incorrect variable name
            loan_date: formattedLoanDate,
            return_date: formattedReturnDate
        };

        // Fetch book details based on selected book
        fetchBookDetails(bookId)
            .then(function (bookDetails) {
                formData.book_details = bookDetails;
                // Fetch customer details based on selected customer
                return fetchCustomerDetails(customerId);
            })
            .then(function (customerDetails) {
                formData.customer_details = customerDetails;
                return axios.post('/loans/create', formData);
            })
            .then(function (response) {
                alert('Loan added successfully!');
                document.getElementById('addLoanModal').classList.remove('show');
                document.body.classList.remove('modal-open');
                location.reload();
            })
            .catch(function (error) {
                console.error('Error adding loan:', error.response ? error.response.data : error.message);
                alert('Error adding loan: ' + (error.response ? error.response.data.error : error.message));
            });
    });
});
// Call the functions to fetch and log data
fetchBooks();
fetchCustomers();
