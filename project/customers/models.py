#form imports
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

# Flask forms (wtforms) allow you to easily create forms in format:
# variable_name = Field_type('Label that will show', validators=[V_func1(), V_func2(),...])
class CreateCustomer(FlaskForm):
    first = StringField('first name', validators=[DataRequired()])
    last = TextAreaField('last name')
    submit = SubmitField('create customer')
