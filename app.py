import os
import datetime

from flask import Flask, request, render_template
from flask.json import jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", "postgresql://localhost/crikit")

db = SQLAlchemy(app)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    author = db.Column(db.String(120))
    posted = db.Column(db.DateTime, default=datetime.datetime.now)
    votes = db.Column(db.Integer, default=0)

    def __init__(self, content, author):
        self.content = content
        self.author = author

    def __repr__(self):
        return "<Post %(id)s %(content)s %(author)s %(posted)s %(votes)s>" % self.serialize()

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'author': self.author,
            'posted': self.posted,
            'votes': self.votes
        }

db.create_all()

manager = APIManager(app, flask_sqlalchemy_db=db)
manager.create_api(Post, methods=['GET', 'POST', 'PATCH'])

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8000))
