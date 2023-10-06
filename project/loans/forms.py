# forms.py
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

class CreateLoan(FlaskForm):
    customer_name = StringField('Customer Name', validators=[DataRequired()])
    book_name = StringField('Book Name', validators=[DataRequired()])
    loan_date = StringField('Loan Date', validators=[DataRequired()])
    return_date = StringField('Return Date', validators=[DataRequired()])
    submit = SubmitField('Create Loan')
