from flask import render_template, Blueprint

books = Blueprint('books', __name__, template_folder='templates')

@books.route('/books')
def index():
    return render_template('books.html')