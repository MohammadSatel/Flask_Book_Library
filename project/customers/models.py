from project import db, app


class Customer(db.Model):

    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)
    last = db.Column(db.String(500))

    # initialise an instance (row) of a table/entity
    def __init__(self, name, last):
        self.name = name
        self.last = last

    # __repr__ is used to represent an instance, such as for print() function

    def __repr__(self):
        return f"Name: {self.name}"


with app.app_context():
    db.create_all()
