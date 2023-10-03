from project import app

app.static_folder = 'static'

if __name__ == '__main__':
    app.run(debug=True)
    