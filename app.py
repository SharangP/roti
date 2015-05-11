import os
import datetime

from flask import Flask, request
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
    posted = db.Column(db.DateTime)
    votes = db.Column(db.Integer)

    def __init__(self, content, author):
        self.content = content
        self.author = author
        self.posted = datetime.datetime.now()
        self.votes = 0

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
manager.create_api(Post, methods=['GET', 'POST'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8000))
