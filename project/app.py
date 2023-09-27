from flask import Flask, render_template
import os
import logging

logging.basicConfig(filename=os.path.join(os.path.dirname(__file__), 'app.log'), level=logging.DEBUG)

app = Flask(__name__)
app.template_folder = os.path.abspath('../front/templates')
app.static_folder = os.path.abspath('../front/static')

@app.route('/')
def index():
    app.logger.info('Accessed homepage.')
    return render_template('index.html')

@app.route('/books')
def books():
    app.logger.info('Accessed books.')
    return render_template('books.html')

@app.route('/customers')
def customers():
    app.logger.info('Accessed customers.')
    return render_template('customers.html')

@app.route('/loans')
def loans():
    app.logger.info('Accessed loans.')
    return render_template('loans.html')

if __name__ == '__main__':
    app.run(debug=True)
