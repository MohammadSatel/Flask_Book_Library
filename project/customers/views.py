from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.customers.models import Customer
from project.customers.forms import CreateCustomer

customers = Blueprint('customers', __name__, template_folder='templates', url_prefix='/customers')

# Route to display customers and handle CRUD actions
@customers.route('/', methods=['GET'])
def list_customers():
    # Fetch all customers from the database
    customers = Customer.query.all()
    return render_template('customers.html', customers=customers)

# Route to create a new customer
@customers.route('/create', methods=['POST'])
def create_customer():
    data = request.form
    new_customer = Customer(name=data['name'], author=data['author'], time=data['time'])
    db.session.add(new_customer)
    db.session.commit()
    return redirect(url_for('customers.list_customers'))

# Route to update an existing customer
@customers.route('/<int:customer_id>/edit', methods=['POST'])
def edit_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return 'customer not found', 404

    data = request.form
    customer.name = data['name']
    customer.author = data['author']
    customer.time = data['time']

    db.session.commit()
    return redirect(url_for('customers.list_customers'))

# Route to delete a customer
@customers.route('/<int:customer_id>/delete', methods=['POST'])
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return 'customer not found', 404

    db.session.delete(customer)
    db.session.commit()
    return redirect(url_for('customers.list_customers'))

# Route to view a customer
@customers.route('/<int:customer_id>')
def view_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if customer:
        return render_template('view_customer.html', customer=customer)
    return 'customer not found', 404
