from flask import render_template, Blueprint

loans = Blueprint('loans', __name__, template_folder='templates', static_folder='static')

@loans.route('/loans')
def index():
    return render_template('loans.html')

## CRUD FOR LOANS