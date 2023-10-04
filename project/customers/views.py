from flask import render_template, Blueprint, Flask

customers = Blueprint('customers', __name__, template_folder='templates', static_folder='static')


@customers.route('/customers')
def index():
    return render_template('customers.html')

