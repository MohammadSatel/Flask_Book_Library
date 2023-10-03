from flask import current_app, render_template, Blueprint, Flask, send_from_directory
import os

customers = Blueprint('customers', __name__, template_folder='templates', static_folder='static')


@customers.route('/customers')
def index():
    css_file = 'styles.css'  # Correct CSS file path
    js_file = 'script.js'     # Correct JS file path
    return render_template('customers.html', css_file=css_file, js_file=js_file)

@customers.route('/customers/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(current_app.root_path, 'static'), filename)



# from flask import current_app, render_template, Blueprint


# customers = Blueprint('customers', __name__, template_folder='templates', static_folder='static')


# @customers.route('/customers')
# def index():
#     return render_template('customers.html')

