from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.loans.models import Loan
from project.loans.forms import CreateLoan

loans = Blueprint('loans', __name__, template_folder='templates', url_prefix='/loans')

# Route to display loans in HTML
@loans.route('/', methods=['GET'])
def list_loans():
    # Fetch all loans from the database
    loans = Loan.query.all()
    return render_template('loans.html', loans=loans)

# Route to fetch loans in JSON format
@loans.route('/json', methods=['GET'])
def list_loans_json():
    # Fetch all loans from the database and convert to JSON
    loans = Loan.query.all()
    loan_list = [{'name': loan.name, 'author': loan.author, 'time': loan.time} for loan in loans]
    return jsonify(loans=loan_list)

# Route to create a new loan
@loans.route('/create', methods=['POST','GET'])
def create_loan():
    data = request.form

    # Validate the form data
    if 'name' not in data or 'author' not in data or 'time' not in data:
        return jsonify({'error': 'Invalid form data'}), 400

    new_loan = Loan(name=data['name'], author=data['author'], time=data['time'])

    try:
        # Add the new loan to the session and commit to save to the database
        db.session.add(new_loan)
        db.session.commit()
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error creating loan: {str(e)}'}), 500

# Route to update an existing loan
@loans.route('/<int:loan_id>/edit', methods=['POST'])
def edit_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({'error': 'loan not found'}), 404

    data = request.form
    loan.name = data['name']
    loan.author = data['author']
    loan.time = data['time']

    try:
        # Update the loan in the database
        db.session.commit()
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error updating loan: {str(e)}'}), 500

# Route to delete a loan
@loans.route('/<int:loan_id>/delete', methods=['POST'])
def delete_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return jsonify({'error': 'loan not found'}), 404

    try:
        # Delete the loan from the database
        db.session.delete(loan)
        db.session.commit()
        return redirect(url_for('loans.list_loans'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error deleting loan: {str(e)}'}), 500