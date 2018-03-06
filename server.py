from flask import Flask, render_template, request, jsonify
from mysqlconnection import MySQLConnector

app = Flask(__name__)
mydb = MySQLConnector(app, 'database1')

@app.route('/')
def index():
    return render_template('index.html')

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

@app.route('/tickets')
def tickets():
    my_tickets = mydb.query_db("select * from tickets")
    return jsonify({'tickets': my_tickets})

@app.route('/ticket/<ticket_id>')
def ticket(ticket_id):
    query = "select * from tickets where id = :id"
    data = {'id': ticket_id}
    my_ticket = mydb.query_db(query, data)
    return jsonify({'ticket': my_ticket})

@app.route('/ticket/delete', methods=['POST'])
def delete():
    ticket_id = request.json
    query = "delete from tickets where id = :id"
    data = {'id': int(ticket_id['id'])}
    mydb.query_db(query, data)
    return "ok"

@app.route('/ticket/update', methods=['POST'])
def update():
    ticket = request.json
    # priority_query = ("select client, client_priority from tickets where client = :ticket")
    # priority_data = {'ticket': ticket['client']}
    # client_tickets = mydb.query_db(priority_query, priority_data)
    # for tick in client_tickets:
    #     if (int(tick['client_priority']) == int(ticket['client_priority'])):
    #         pquery = ("update tickets set client_priority = client_priority + 1 where client_priority >= {} and client = '{}'").format(ticket['client_priority'], ticket['client'])
    #         mydb.query_db(pquery)
    #         break
    query = ("update tickets set title = :title, description = :description, client = :client, client_priority = :client_priority, target_date = :target_date, product_area = :product_area where id = :id")
    data = {'title': ticket['title'], 'description': ticket['description'], 'client': ticket['client'], 'client_priority': ticket['client_priority'], 'target_date': ticket['target_date'], 'product_area': ticket['product_area'], 'id': ticket['id']}
    mydb.query_db(query, data)
    return "ok"
