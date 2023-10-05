from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project import db
from project.books.models import Book
from project.books.forms import CreateBook

# Create a Blueprint named 'books' with appropriate settings
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
    # Create a list of dictionaries representing each book with the required fields
    book_list = [{'name': book.name, 'author': book.author, 'year_published': book.year_published, 'book_type': book.book_type} for book in books]
    return jsonify(books=book_list)

@books.route('/create', methods=['POST', 'GET'])
def create_book():
    # Create an instance of the CreateBook form using request.form
    form = CreateBook(request.form)

    if form.validate_on_submit():
        name = form.name.data
        author = form.author.data
        year_published = form.year_published.data
        book_type = form.book_type.data

        # Create a new book with the form data
        new_book = Book(name=name, author=author, year_published=year_published, book_type=book_type)

        try:
            # Add the new book to the session and commit to save to the database
            db.session.add(new_book)
            db.session.commit()
            return redirect(url_for('books.list_books'))
        except Exception as e:
            # Handle any exceptions, such as database errors
            db.session.rollback()
            return jsonify({'error': f'Error creating book: {str(e)}'}), 500

    return render_template('books.html', form=form)

# Route to update an existing book
@books.route('/<int:book_id>/edit', methods=['POST'])
def edit_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    data = request.form
    book.name = data['name']
    book.author = data['author']
    book.year_published = data['year_published']
    book.book_type = data['book_type']


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
    
    
    