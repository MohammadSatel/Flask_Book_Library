from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields import DateField
from wtforms.validators import DataRequired

class CreateLoan(FlaskForm):
    customer_name = StringField('Customer Name', validators=[DataRequired()])
    book_name = StringField('Book Name', validators=[DataRequired()])
    loan_date = DateField('Loan Date', format='%Y-%m-%d', validators=[DataRequired()])
    return_date = DateField('Return Date', format='%Y-%m-%d', validators=[DataRequired()])
    csrf_token = StringField('CSRF Token')  # Add a CSRF token field

    # New fields for capturing original book details
    original_year_published = StringField('Original Year Published', validators=[DataRequired()])
    original_book_type = StringField('Original Book Type', validators=[DataRequired()])

    submit = SubmitField('Create Loan')
