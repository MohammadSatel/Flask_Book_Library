# Import necessary modules
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField  # Changed to IntegerField for 'age'
from wtforms.validators import DataRequired

# Flask forms (wtforms) allow you to easily create forms in this format:
# variable_name = Field_type('Label that will show', validators=[V_func1(), V_func2(),...])
class CreateCustomer(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])  # Changed label and added required validation
    city = StringField('City', validators=[DataRequired()])  # Added a field for 'city'
    age = IntegerField('Age', validators=[DataRequired()])  # Added a field for 'age'
    submit = SubmitField('Create Customer')  # Changed label for submit button
