import json
from unicodedata import name
from flask import render_template, url_for, redirect, Blueprint
from project import db,app
from project.customers.models import Customer
from project.customers.forms import CreateCustomer

# image upload
from distutils.log import debug
import os
from flask import  flash, request
from werkzeug.utils import secure_filename
from flask import send_from_directory


customers = Blueprint('customers', __name__, template_folder='templates',url_prefix='/customers')

# UPLOAD_FOLDER = 'UPLOAD_FOLDER'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

# display images from server
@customers.route('/uploads/<name>')
def download_file(name):
    return send_from_directory("../" +os.path.join(app.config['UPLOAD_FOLDER']), name)

# check what type allow
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@customers.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # print( request.form.get("author"))
        

        
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            student = customers(name=request.form.get("stdent_name"),age=request.form.get("age"),img=filename)
            db.session.add(student)
            db.session.commit()
            print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # return redirect(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('customers.list_customers'))
    return  render_template('upl.html')



# add a new student

@customers.route('/test', methods=['GET'])
def test():
    return "test"


@customers.route('/add_customer', methods=['GET', 'POST'])
def add_customer():
    form = add_customer()

    if form.validate_on_submit():

        customers = customers(name=form.name.data,age=form.age.data)

        db.session.add(customers)
        db.session.commit()

        return redirect(url_for('customers.list_customers'))
    return render_template('customers.html', form=form)


@customers.route('/customers_lst')
def list_customers():
    stu_list = customers.query.all()
    # JSON instead HTML
    # res = []
    # for x in clubs_list:
    #     res.append({x.name: x.description})
    # return json.dumps(res)
    return render_template('customers.html', stu_list=stu_list)
















from flask import render_template, Blueprint

customers = Blueprint('customers', __name__, template_folder='templates')

@customers.route('/customers')
def index():
    return render_template('customers.html')