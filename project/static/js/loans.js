// Function to populate book dropdown
function populateBookDropdown() {
    $.ajax({
        url: '/books/json',
        method: 'GET',
        success: function(response) {
            const books = response.books;
            const bookDropdown = $('#book_name');
            bookDropdown.empty();  // Clear previous options
            books.forEach(function(book) {
                bookDropdown.append($('<option>').val(book.name).text(book.name));
            });
        },
        error: function(error) {
            console.error('Error fetching book names: ', error);
        }
    });
}

// Function to populate customer dropdown
function populateCustomerDropdown() {
    $.ajax({
        url: '/customers/json',
        method: 'GET',
        success: function(response) {
            const customers = response.customers;  // Assuming your response has a 'customers' property
            const customerDropdown = $('#customer_name');
            customerDropdown.empty();  // Clear previous options
            if (customers && customers.length > 0) {
                customers.forEach(function(customer) {
                    customerDropdown.append($('<option>').val(customer.name).text(customer.name));
                });
            } else {
                console.error('No customers found.');
            }
        },
        error: function(error) {
            console.error('Error fetching customer names: ', error);
        }
    });
}

// Function to fetch book details based on the selected book name
function fetchBookDetails(bookName) {
    return $.ajax({
        url: `/books/details/${bookName}`,
        method: 'GET',
    });
}

$(document).ready(function() {
    populateBookDropdown();  // Populate book dropdown
    populateCustomerDropdown();  // Populate customer dropdown

    $('#addLoanForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get the loan and return dates and format them
        const loanDate = new Date($('#loan_date').val());
        const formattedLoanDate = loanDate.toISOString().split('T')[0];

        const returnDate = new Date($('#return_date').val());
        const formattedReturnDate = returnDate.toISOString().split('T')[0];

        const formData = {
            customer_name: $('#customer_name').val(),
            book_name: $('#book_name').val(),
            loan_date: formattedLoanDate,
            return_date: formattedReturnDate
        };

        const bookName = formData.book_name;

        fetchBookDetails(bookName)
            .then(function(bookDetails) {
                formData.book_details = bookDetails;

                $.ajax({
                    url: '/loans/create',
                    method: 'POST',
                    data: JSON.stringify(formData),  // Stringify the data
                    contentType: 'application/json',  // Set content type
                    success: function(response) {
                        alert('Loan added successfully!');
                        $('#addLoanModal').modal('hide');
                        location.reload();
                    },
                    error: function(error) {
                        alert('Error adding loan: ' + error.responseJSON.error);
                    }
                });
            })
            .catch(function(error) {
                console.error('Error fetching book details: ', error);
            });
    });
});
