from flask import render_template, Blueprint
from project import db,app
from project.books.models import Book
from project.books.forms import CreateBook

books = Blueprint('books', __name__, template_folder='templates', url_prefix='/books')

@books.route('/books')
def index():
    return render_template('books.html')




