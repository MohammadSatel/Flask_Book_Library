from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.books.models import Book
from project.books.forms import CreateBook

books = Blueprint('books', __name__, template_folder='templates', url_prefix='/books')

# Route to display books in HTML
@books.route('/', methods=['GET'])
def list_books():
    # Fetch all books from the database
    books = Book.query.all()
    return render_template('books.html', books=books)

# Route to fetch books in JSON format
@books.route('/json', methods=['GET'])
def list_books_json():
    # Fetch all books from the database and convert to JSON
    books = Book.query.all()
    book_list = [{'name': book.name, 'author': book.author, 'time': book.time} for book in books]
    return jsonify(books=book_list)

# Route to create a new book
@books.route('/create', methods=['POST'])
def create_book():
    data = request.form

    # Validate the form data
    if 'name' not in data or 'author' not in data or 'time' not in data:
        return jsonify({'error': 'Invalid form data'}), 400

    new_book = Book(name=data['name'], author=data['author'], time=data['time'])

    try:
        # Add the new book to the session and commit to save to the database
        db.session.add(new_book)
        db.session.commit()
        return redirect(url_for('books.list_books'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error creating book: {str(e)}'}), 500

# Route to update an existing book
@books.route('/<int:book_id>/edit', methods=['POST'])
def edit_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    data = request.form
    book.name = data['name']
    book.author = data['author']
    book.time = data['time']

    try:
        # Update the book in the database
        db.session.commit()
        return redirect(url_for('books.list_books'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error updating book: {str(e)}'}), 500

# Route to delete a book
@books.route('/<int:book_id>/delete', methods=['POST'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    try:
        # Delete the book from the database
        db.session.delete(book)
        db.session.commit()
        return redirect(url_for('books.list_books'))
    except Exception as e:
        # Handle any exceptions, such as database errors
        db.session.rollback()
        return jsonify({'error': f'Error deleting book: {str(e)}'}), 500





# from flask import render_template, Blueprint, request, redirect, url_for, jsonify
# from project import db
# from project.books.models import Book
# from project.books.forms import CreateBook

# books = Blueprint('books', __name__, template_folder='templates', url_prefix='/books')

# # Route to display books and handle CRUD actions
# @books.route('/', methods=['GET'])
# def list_books():
#     # Fetch all books from the database
#     books = Book.query.all()
#     return render_template('books.html', books=books)

# # Route to create a new book
# @books.route('/create', methods=['POST'])
# def create_book():
#     data = request.form
#     new_book = Book(name=data['name'], author=data['author'], time=data['time'])
#     db.session.add(new_book)
#     db.session.commit()
#     return redirect(url_for('books.list_books'))

# # Route to update an existing book
# @books.route('/<int:book_id>/edit', methods=['POST'])
# def edit_book(book_id):
#     book = Book.query.get(book_id)
#     if not book:
#         return 'Book not found', 404

#     data = request.form
#     book.name = data['name']
#     book.author = data['author']
#     book.time = data['time']

#     db.session.commit()
#     return redirect(url_for('books.list_books'))

# # Route to delete a book
# @books.route('/<int:book_id>/delete', methods=['POST'])
# def delete_book(book_id):
#     book = Book.query.get(book_id)
#     if not book:
#         return 'Book not found', 404

#     db.session.delete(book)
#     db.session.commit()
#     return redirect(url_for('books.list_books'))

# # Route to view a book
# @books.route('/<int:book_id>')
# def view_book(book_id):
#     book = Book.query.get(book_id)
#     if book:
#         return render_template('view_book.html', book=book)
#     return 'Book not found', 404
