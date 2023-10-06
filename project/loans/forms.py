#form imports
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

# Flask forms (wtforms) allow you to easily create forms in format:
# variable_name = Field_type('Label that will show', validators=[V_func1(), V_func2(),...])
class CreateLoan(FlaskForm):
    customer_name = StringField('Customer Name', validators=[DataRequired()])
    book_name = StringField('Book Name', validators=[DataRequired()])
    loan_date = StringField('Loan Date', validators=[DataRequired()])
    return_date = StringField('Return Date', validators=[DataRequired()])
    submit = SubmitField('Create Loan')
