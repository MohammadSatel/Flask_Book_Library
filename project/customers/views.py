from flask import render_template, Blueprint

customers = Blueprint('customers', __name__, template_folder='templates')

@customers.route('/customers')
def index():
    return render_template('customers.html')