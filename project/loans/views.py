from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.loans.models import Loan
from project.loans.forms import CreateLoan

loans = Blueprint('loans', __name__, template_folder='templates', url_prefix='/loans')

# Route to display loans and handle CRUD actions
@loans.route('/', methods=['GET'])
def list_loans():
    # Fetch all loans from the database
    loans = Loan.query.all()
    return render_template('loans.html', loans=loans)

# Route to create a new loan
@loans.route('/create', methods=['POST'])
def create_loan():
    data = request.form
    new_loan = Loan(name=data['name'], author=data['author'], time=data['time'])
    db.session.add(new_loan)
    db.session.commit()
    return redirect(url_for('loans.list_loans'))

# Route to update an existing loan
@loans.route('/<int:loan_id>/edit', methods=['POST'])
def edit_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return 'loan not found', 404

    data = request.form
    loan.name = data['name']
    loan.author = data['author']
    loan.time = data['time']

    db.session.commit()
    return redirect(url_for('loans.list_loans'))

# Route to delete a loan
@loans.route('/<int:loan_id>/delete', methods=['POST'])
def delete_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return 'loan not found', 404

    db.session.delete(loan)
    db.session.commit()
    return redirect(url_for('loans.list_loans'))

# Route to view a loan
@loans.route('/<int:loan_id>')
def view_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if loan:
        return render_template('view_loan.html', loan=loan)
    return 'loan not found', 404