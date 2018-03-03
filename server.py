from flask import Flask, render_template, session
from mysqlconnection import MySQLConnector

app = Flask(__name__)
mysql = MySQLConnector(app, 'database1')

@app.route('/')
def index():
    tickets = mysql.query_db("select name from tickets")
    return render_template('index.html', tickets=tickets)
