from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.loans.models import Loan
from project.loans.forms import CreateLoan
from project.books.models import Book  # Import the Book model
from project.customers.models import Customer  # Import the Customer model

# Create a Blueprint for loans
loans = Blueprint('loans', __name__, template_folder='templates', url_prefix='/loans')

# Route to list all loans
@loans.route('/', methods=['GET'])
def list_loans():
    loans = Loan.query.all()
    return render_template('loans.html', loans=loans)

# Route to get loan data in JSON format
@loans.route('/json', methods=['GET'])
def list_loans_json():
    loans = Loan.query.all()
    loan_list = [{'customer_name': loan.customer_name, 'book_name': loan.book_name, 'loan_date': loan.loan_date, 'return_date': loan.return_date} for loan in loans]
    return jsonify(loans=loan_list)

@loans.route('/create', methods=['POST'])
def create_loan():
    form = CreateLoan(request.form)

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

        new_loan = Loan(customer_name=customer_name, book_name=book_name, loan_date=loan_date, return_date=return_date)

        try:
            db.session.add(new_loan)
            db.session.commit()

            # Update book status to 'loaned'
            book.status = 'loaned'
            db.session.commit()

            return redirect(url_for('loans.list_loans'))
        except Exception as e:
            db.session.rollback()
            error_message = f'Error creating loan: {str(e)}'
            print('Error creating loan:', error_message)  # Log the error message
            return jsonify({'error': error_message}), 500
    else:
        error_message = 'Invalid form data'
        print('Invalid form data:', error_message)  # Log the error message
        return jsonify({'error': error_message}), 400



# Route to end a loan
@loans.route('/end/<int:loan_id>', methods=['POST'])
def end_loan(loan_id):
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

        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        db.session.rollback()

# Route to edit a loan
@loans.route('/<int:loan_id>/edit', methods=['POST'])
def edit_loan(loan_id):
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
            db.session.commit()
            return redirect(url_for('loans.list_loans'))
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Error updating loan: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Invalid form data'}), 400

# Route to delete a loan
@loans.route('/<int:loan_id>/delete', methods=['POST'])
def delete_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({'error': 'Loan not found'}), 404

    try:
        db.session.delete(loan)
        db.session.commit()
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error deleting loan: {str(e)}'}), 500
