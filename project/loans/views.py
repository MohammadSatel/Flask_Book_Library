from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db 
from project.loans.models import Loan
from project.loans.forms import CreateLoan
from project.books.models import Book
from project.customers.models import Customer

# Create a Blueprint for loans
loans = Blueprint('loans', __name__, template_folder='templates', url_prefix='/loans')

# Update the routes to provide book and customer data in JSON format
@loans.route('/books/json', methods=['GET'])
def list_books_json():
    # Fetch all books from the database
    books = Book.query.all()
    # Create a list of book names
    book_list = [{'name': book.name} for book in books]
    # Return book data in JSON format
    return jsonify({'books': book_list})

@loans.route('/customers/json', methods=['GET'])
def list_customers_json():
    # Fetch all customers from the database
    customers = Customer.query.all()
    # Create a list of customer names
    customer_list = [{'name': customer.name} for customer in customers]
    # Return customer data in JSON format
    return jsonify({'customers': customer_list})

# Route to list all loans
@loans.route('/', methods=['GET'])
def list_loans():
    # Fetch all loans from the database
    loans = Loan.query.all()
    # Render the loans.html template with the loans
    return render_template('loans.html', loans=loans)

# Route to get loan data in JSON format
@loans.route('/json', methods=['GET'])
def list_loans_json():
    # Fetch all loans from the database
    loans = Loan.query.all()
    # Create a list of loan details
    loan_list = [{'customer_name': loan.customer_name, 'book_name': loan.book_name,
                  'loan_date': loan.loan_date, 'return_date': loan.return_date} for loan in loans]
    # Return loan data in JSON format
    return jsonify(loans=loan_list)

# Route to get customer data by name in JSON format
@loans.route('/customers/details/<string:customer_name>', methods=['GET'])
def get_customer_details(customer_name):
    # Find the customer by their name
    customer = Customer.query.filter_by(name=customer_name).first()

    if customer:
        # Create a dictionary with customer details
        customer_data = {
            'id': customer.id,
            'name': customer.name,
            'city': customer.city,
            'age': customer.age
        }
        # Return customer data in JSON format
        return jsonify(customer=customer_data)
    else:
        return jsonify({'error': 'Customer not found'}), 404

# Route to create a new loan
@loans.route('/create', methods=['POST'])
def create_loan():
    try:
        # Get form data
        form = CreateLoan(request.form)
        form.csrf_token.data = request.cookies.get('csrf_token')  # Set CSRF token from the request


        if form.validate():
            customer_name = form.customer_name.data
            book_name = form.book_name.data
            loan_date = form.loan_date.data
            return_date = form.return_date.data

            # Check if the book is available
            book = Book.query.filter_by(name=book_name, status='available').first()

            if not book:
                return jsonify({'error': 'Book not available for loan.'}), 400

            # Check if the customer exists
            customer = Customer.query.filter_by(name=customer_name).first()
            if not customer:
                return jsonify({'error': 'Customer not found.'}), 400

            # Create a new loan
            new_loan = Loan(customer_name=customer_name, book_name=book_name, loan_date=loan_date, return_date=return_date)

            # Add the new loan to the database
            db.session.add(new_loan)
            db.session.commit()

            # Update book status to 'loaned'
            book.status = 'loaned'
            db.session.commit()

            # Redirect to the list of loans
            return redirect(url_for('loans.list_loans'))
        else:
            error_message = 'Invalid form data'
            print('Invalid form data:', form.errors)  # Log the form validation errors
            return jsonify({'error': 'Invalid form data'}), 400
    except Exception as e:
        db.session.rollback()
        error_message = f'Error creating loan: {str(e)}'
        print('Error creating loan:', error_message)  # Log the error message
        return jsonify({'error': error_message}), 500

# Route to end a loan
@loans.route('/end/<int:loan_id>', methods=['POST'])
def end_loan(loan_id):
    # Find the loan by ID
    loan = Loan.query.get(loan_id)

    if not loan:
        return jsonify({'error': 'Loan not found'}), 404

    # Check if the loan is active
    if loan.status == 'ended':
        return jsonify({'error': 'Loan already ended.'}), 400

    # Retrieve the book associated with the loan
    book = Book.query.filter_by(name=loan.book_name).first()

    if not book:
        return jsonify({'error': 'Book not found'}), 404

    try:
        # Update loan status to 'ended'
        loan.status = 'ended'
        db.session.commit()

        # Update book status to 'available'
        book.status = 'available'
        db.session.commit()

        # Redirect to the list of loans
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        db.session.rollback()
        error_message = f'Error ending loan: {str(e)}'
        print('Error ending loan:', error_message)  # Log the error message
        return jsonify({'error': error_message}), 500

# Route to edit a loan
@loans.route('/<int:loan_id>/edit', methods=['POST'])
def edit_loan(loan_id):
    # Find the loan by ID
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404

    form = CreateLoan(request.form)

    if form.validate():
        loan.customer_name = form.customer_name.data
        loan.book_name = form.book_name.data
        loan.loan_date = form.loan_date.data
        loan.return_date = form.return_date.data

        try:
            # Update the loan in the database
            db.session.commit()
            # Redirect to the list of loans
            return redirect(url_for('loans.list_loans'))
        except Exception as e:
            db.session.rollback()
            error_message = f'Error updating loan: {str(e)}'
            print('Error updating loan:', error_message)  # Log the error message
            return jsonify({'error': error_message}), 500
    else:
        error_message = 'Invalid form data'
        print('Invalid form data:', error_message)  # Log the error message
        return jsonify({'error': error_message}), 400

# Route to delete a loan
@loans.route('/<int:loan_id>/delete', methods=['POST'])
def delete_loan(loan_id):
    # Find the loan by ID
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404

    try:
        # Delete the loan from the database
        db.session.delete(loan)
        db.session.commit()
        # Redirect to the list of loans
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        db.session.rollback()
        error_message = f'Error deleting loan: {str(e)}'
        print('Error deleting loan:', error_message)  # Log the error message
        return jsonify({'error': error_message}), 500
