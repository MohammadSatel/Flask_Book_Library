from project import db , app

class Loan(db.Model):
    __tablename__ = 'Loans'

    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(64), nullable=False)
    book_name = db.Column(db.String(64), nullable=False)
    loan_date = db.Column(db.String(20), nullable=False)
    return_date = db.Column(db.String(20), nullable=False)
    original_year_published = db.Column(db.String(10))  # Updated to store as a string
    original_book_type = db.Column(db.String(64))

    def __init__(self, customer_name, book_name, loan_date, return_date, original_year_published, original_book_type):
        self.customer_name = customer_name
        self.book_name = book_name
        self.loan_date = loan_date
        self.return_date = return_date
        self.original_year_published = original_year_published
        self.original_book_type = original_book_type

    def __repr__(self):
        return f"Customer: {self.customer_name}, Book: {self.book_name}, Loan Date: {self.loan_date}, Return Date: {self.return_date}"


with app.app_context():
    db.create_all()