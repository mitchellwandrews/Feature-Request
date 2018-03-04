from flask import Flask, render_template, request, redirect
from mysqlconnection import MySQLConnector

app = Flask(__name__)
mydb = MySQLConnector(app, 'database1')

@app.route('/')
def index():
    tickets = mydb.query_db("select * from tickets")
    return render_template('index.html', tickets=tickets)

@app.route('/ticket/new', methods=['POST'])
def new_ticket():
    ticket = request.json
    priority_query = ("select client, client_priority from tickets where client = :ticket")
    priority_data = {'ticket': ticket['client']}
    client_tickets = mydb.query_db(priority_query, priority_data)
    for tick in client_tickets:
        if (int(tick['client_priority']) == int(ticket['client_priority'])):
            pquery = ("update tickets set client_priority = client_priority + 1 where client_priority >= {} and client = '{}'").format(ticket['client_priority'], ticket['client'])
            mydb.query_db(pquery)
            break
    query = ("insert into tickets (title, description, client, client_priority, target_date, product_area) values (:title, :description, :client, :client_priority, :target_date, :product_area)")
    data = {'title': ticket['title'], 'description': ticket['description'], 'client': ticket['client'], 'client_priority': ticket['client_priority'], 'target_date': ticket['target_date'], 'product_area': ticket['product_area']}
    mydb.query_db(query, data)
    return "ok"

@app.route('/ticket', methods=['GET'])
def ticket():
    print(request)
    return "ok"
