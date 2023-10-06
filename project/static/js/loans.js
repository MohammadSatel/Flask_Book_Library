// Function to populate book dropdown
function populateBookDropdown() {
    axios.get('/books/json')
        .then(function(response) {
            const books = response.data.books;
            const bookDropdown = document.getElementById('book_name');
            bookDropdown.innerHTML = '';

            books.forEach(function(book) {
                const option = document.createElement('option');
                option.value = book.name;
                option.textContent = book.name;
                bookDropdown.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Error fetching book names:', error);
        });
}

// Function to populate customer dropdown
function populateCustomerDropdown() {
    axios.get('/customers/json')
        .then(function(response) {
            const customers = response.data.customers;
            const customerDropdown = document.getElementById('customer_name');
            customerDropdown.innerHTML = '';

            if (customers && customers.length > 0) {
                customers.forEach(function(customer) {
                    const option = document.createElement('option');
                    option.value = customer.name;
                    option.textContent = customer.name;
                    customerDropdown.appendChild(option);
                });
            } else {
                console.error('No customers found.');
            }
        })
        .catch(function(error) {
            console.error('Error fetching customer names:', error);
        });
}

// Function to fetch book details based on the selected book name
function fetchBookDetails(bookName) {
    return axios.get(`/books/details/${bookName}`)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.error('Error fetching book details:', error);
            throw new Error('Error fetching book details');
        });
}

document.addEventListener('DOMContentLoaded', function() {
    populateBookDropdown();
    populateCustomerDropdown();

    const loanDateInput = document.getElementById('loan_date');
    const returnDateInput = document.getElementById('return_date');

    loanDateInput.addEventListener('focus', function() {
        loanDateInput.type = 'date';
        loanDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    });

    returnDateInput.addEventListener('focus', function() {
        returnDateInput.type = 'date';
        returnDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    });

    const addLoanForm = document.getElementById('addLoanForm');
    addLoanForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const loanDate = new Date(document.getElementById('loan_date').value);
        const formattedLoanDate = loanDate.toISOString().split('T')[0];

        const returnDate = new Date(document.getElementById('return_date').value);
        const formattedReturnDate = returnDate.toISOString().split('T')[0];

        const formData = {
            customer_name: document.getElementById('customer_name').value,
            book_name: document.getElementById('book_name').value,
            loan_date: formattedLoanDate,
            return_date: formattedReturnDate
        };

        const bookName = formData.book_name;

        fetchBookDetails(bookName)
            .then(function(bookDetails) {
                formData.book_details = bookDetails;

                return axios.post('/loans/create', formData);
            })
            .then(function(response) {
                alert('Loan added successfully!');
                document.getElementById('addLoanModal').classList.remove('show');
                document.body.classList.remove('modal-open');
                location.reload();
            })
            .catch(function(error) {
                console.error('Error adding loan:', error.response ? error.response.data : error.message);
                alert('Error adding loan: ' + (error.response ? error.response.data.error : error.message));
            });
    });
});
