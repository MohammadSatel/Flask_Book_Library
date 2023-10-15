from flask import render_template, Blueprint


# Blueprint for core
core = Blueprint('core', __name__, template_folder='templates', static_folder='static')


# Route to homepage
@core.route('/')
def index():
    print('Homepage accessed')
    return render_template('index.html')
