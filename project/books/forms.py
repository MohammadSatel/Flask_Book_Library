#form imports
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired

# Flask forms (wtforms) allow you to easily create forms in format:
# variable_name = Field_type('Label that will show', validators=[V_func1(), V_func2(),...])
class CreateBook(FlaskForm):
    name = StringField('book name', validators=[DataRequired()])
    author = TextAreaField('book author')
    submit = SubmitField('create book')
