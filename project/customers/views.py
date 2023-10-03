from flask import current_app, render_template, Blueprint


customers = Blueprint('customers', __name__, template_folder='templates', static_folder='static')


@customers.route('/customers')
def index():
    return render_template('customers.html')

