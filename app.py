from flask import Flask, render_template, request, redirect, url_for, jsonify, abort, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://laura@localhost:5432/todoapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

migrate = Migrate(app, db)


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    # nullable=False is the dafault since this column refers to a primary key of a parent
    list_id = db.Column(db.Integer, db.ForeignKey(
        'todolists.id'), nullable=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'


class TodoList(db.Model):
    __tablename__ = 'todolists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    # lazy=True is the default setting anyway
    todos = db.relationship('Todo', backref='list', lazy=True)

# Do not use this anymore when using migrations
# db.create_all()

# HTML form submission
# @app.route('/todos/create', methods=['POST'])
# def create_todo():
#     todo_description = request.form.get('description', '')
#     todo = Todo(description=todo_description)
#     db.session.add(todo)
#     db.session.commit()
#     # url_for could also contain a second argument for data
#     return redirect(url_for('index'))


@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {}
    try:
        todo_description = request.get_json()['description']
        todo = Todo(description=todo_description)
        db.session.add(todo)
        db.session.commit()
        body['description'] = todo.description
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@app.route('/todos/<todo_id>/setCompleted', methods=['POST'])
def setCompletedTodo(todo_id):
    try:
        # folgende Zeile: holt 'completed' aus body des fetch
        completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return redirect(url_for('index'))


@app.route('/todos/<todo_id>', methods=['DELETE'])
def deleteTodo(todo_id):
    try:
        todo = Todo.query.get(todo_id)
        db.session.delete(todo)
        db.session.commit()
    except:
        db.session.rollback()
    finally:
        db.session.close()
    return jsonify({'success': True})


@app.route('/lists/create', methods=['POST'])
def create_list():
    error = False
    body = {}
    try:
        list_name = request.get_json()['name']
        todolist = TodoList(name=list_name)
        db.session.add(todolist)
        db.session.commit()
        body['name'] = todolist.name
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@app.route('/lists/<list_id>')
def get_list_todos(list_id):
    return render_template(
        'index.html',
        lists=TodoList.query.all(),
        active_list=TodoList.query.get(list_id),
        todos=Todo.query.filter_by(list_id=list_id).all()
    )


@app.route('/static/<path>')
def send_static(path):
    return send_from_directory('static', path)


@app.route('/')
def index():
    return redirect(url_for('get_list_todos', list_id=1))
