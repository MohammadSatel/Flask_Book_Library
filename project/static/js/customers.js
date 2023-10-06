// Function to handle search
function searchCustomers() {
    let input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.querySelector(".table");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        let rowDisplay = false;
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    rowDisplay = true;
                    break;
                }
            }
        }
        tr[i].style.display = rowDisplay ? "" : "none";
    }
}

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", searchCustomers);

// Handle form submission for adding a new customer
$(document).ready(function() {
    $('#addCustomerForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const name = $('#name').val();
        const city = $('#city').val(); // Updated to get city from the form
        const age = $('#age').val(); // Updated to get age from the form

        // Send an AJAX request to create a new customer
        $.ajax({
            url: '/customers/create',
            method: 'POST',
            data: {
                name: name,
                city: city, // Updated to send 'city'
                age: age // Updated to send 'age'
            },
            success: function(response) {
                console.log('Success:', response);
                // Display a success notification
                alert('Customer added successfully!');

                // Close the modal
                $('#addCustomerModal').modal('hide');

                // Reload the page to show the updated Customer list
                location.reload();
            },
            error: function(error) {
                console.log('Error:', error);
                // Display an error notification
                alert('Error adding customer: ' + error.responseJSON.error);
            }
        });
    });
});

// EDIT CUSTOMER
function editCustomer(customerId) {
    console.log('Edit button clicked for customer ID:', customerId);

    // Fetch the existing customer data for the given customerId via an AJAX request
    $.ajax({
        url: `/customers/${customerId}/edit-data`,
        method: 'GET',
        success: function(response) {
            console.log('Success:', response);

            if (response.success) {
                const customerData = response.customer;

                // Pre-fill the modal form fields with the existing customer data
                $('#edit_name').val(customerData.name);
                $('#edit_city').val(customerData.city);
                $('#edit_age').val(customerData.age);

                // Store the customerId in a data attribute of the save button
                $('#saveEditCustomerButton').attr('data-customer-id', customerId);

                // Show the modal for editing
                $('#editCustomerModal').modal('show');
            } else {
                console.log('Error:', response.error);
                alert('Error fetching customer data: ' + response.error);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error:', errorThrown);
            alert('Error fetching customer data: ' + errorThrown);
        }
    });
}

// Event listener for the edit form submission
$(document).ready(function() {
    $('#saveEditCustomerButton').click(function(event) {
        const customerId = $(this).attr('data-customer-id');

        // Get form data
        const name = $('#edit_name').val();
        const city = $('#edit_city').val();
        const age = $('#edit_age').val();

        // Create a data object to send as JSON
        const data = {
            'name': name,
            'city': city,
            'age': age
        };

        // Send an AJAX request to update the customer data
        $.ajax({
            url: `/customers/${customerId}/edit`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                console.log('Success:', response);
                alert('Customer updated successfully!');
                $('#editCustomerModal').modal('hide');
                location.reload();
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log('Error:', errorThrown);
                alert('Error updating customer: ' + errorThrown);
            }
        });
    });
});

// DELETE CUSTOMER
function deleteCustomer(customerId) {
    $.ajax({
        url: `/customers/${customerId}/delete`,
        method: 'POST',
        success: function(response) {
            console.log('Success:', response);
            alert('Customer deleted successfully!');
            location.reload();
        },
        error: function(error) {
            console.log('Error:', error);
            alert('Error deleting customer: ' + error.responseJSON.error);
        }
    });
}
