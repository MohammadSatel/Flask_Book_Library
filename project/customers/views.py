from flask import render_template, Blueprint


customers = Blueprint('customers', __name__, template_folder='templates')

@customers.route('/customers')
def index():
    return render_template('customers.html')  # - BUGG, CANT ACCESS CUSTOMERS.HTML. THUNDER "GET" WORKS,  FIXED (CLEAR CACHE OMG)