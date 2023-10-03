from flask import render_template, Blueprint, current_app

customers = Blueprint('customers', __name__, template_folder='templates', static_folder='static')

@customers.route('/customers')
def index():
    return render_template('customers.html')

# You don't need to run the app here, just define the blueprint