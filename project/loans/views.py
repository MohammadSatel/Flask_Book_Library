from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.loans.models import Loan
from project.loans.forms import CreateLoan

loans = Blueprint('loans', __name__, template_folder='templates', url_prefix='/loans')

@loans.route('/', methods=['GET'])
def list_loans():
    loans = Loan.query.all()
    return render_template('loans.html', loans=loans)

@loans.route('/json', methods=['GET'])
def list_loans_json():
    loans = Loan.query.all()
    loan_list = [{'customer_name': loan.customer_name, 'book_name': loan.book_name, 'loan_date': loan.loan_date, 'return_date': loan.return_date} for loan in loans]
    return jsonify(loans=loan_list)

@loans.route('/create', methods=['POST','GET'])
def create_loan():
    form = CreateLoan(request.form)
    
    if form.validate():
        customer_name = form.customer_name.data
        book_name = form.book_name.data
        loan_date = form.loan_date.data
        return_date = form.return_date.data

        new_loan = Loan(customer_name=customer_name, book_name=book_name, loan_date=loan_date, return_date=return_date)

        try:
            db.session.add(new_loan)
            db.session.commit()
            return redirect(url_for('loans.list_loans'))
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Error creating loan: {str(e)}'}), 500
    else:
        return jsonify({'error': 'Invalid form data'}), 400

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
