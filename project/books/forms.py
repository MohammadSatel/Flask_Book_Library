#form imports
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired

# Flask forms (wtforms) allow you to easily create forms in format:
# variable_name = Field_type('Label that will show', validators=[V_func1(), V_func2(),...])
class CreateBook(FlaskForm):
    name = StringField('Book Name', validators=[DataRequired()])
    author = StringField('Author')  # Change to StringField for author
    year_published = IntegerField('Year Published', validators=[DataRequired()])
    book_type = SelectField('Book Type', choices=[(1, 'Up to 10 days'), (2, 'Up to 5 days'), (3, 'Up to 2 days')], coerce=int, validators=[DataRequired()])
    submit = SubmitField('Create Book')