import os

from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.security import RoleMixin, UserMixin, SQLAlchemyUserDatastore
from flask.ext.security import Security, login_required, roles_required, current_user
from flask.ext.security.forms import RegisterForm, TextField, Required
from flask.ext.security.signals import user_registered

app = Flask(__name__)
app.config['DEBUG'] = 'PRODUCTION' not in os.environ
DATABASE_URL = os.environ.get("DATABASE_URL",
                              "postgresql://roti:roti@localhost/roti")
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'development_key')
app.config['SECURITY_PASSWORD_HASH'] = 'bcrypt'
app.config['SECURITY_PASSWORD_SALT'] = '$2a$12$skCRnkqE5L01bHEke678Ju'
app.config['SECURITY_REGISTERABLE'] = True
app.config['SECURITY_REGISTER_URL'] = '/register'
app.config['SECURITY_REGISTER_USER_TEMPLATE'] = 'register.html'
app.config['SECURITY_SEND_REGISTER_EMAIL'] = False
app.config['SECURITY_LOGIN_USER_TEMPLATE'] = 'login.html'
app.config['SECURITY_LOGIN_URL'] = '/login'
app.config['SECURITY_CHANGEABLE'] = False


# Fake emails for now
class FakeMail(object):
    def send(self, message):
        pass

app.extensions = getattr(app, 'extensions', {})
app.extensions['mail'] = FakeMail()

db = SQLAlchemy(app)

roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.String(), db.ForeignKey('user.email')),
    db.Column('role_id', db.String(), db.ForeignKey('role.name'))
)


class Role(db.Model, RoleMixin):
    __tablename__ = 'role'

    name = db.Column(db.String(), primary_key=True)


class User(db.Model, UserMixin):
    __tablename__ = 'user'

    email = db.Column(db.String(), primary_key=True)
    firstname = db.Column(db.String())
    lastname = db.Column(db.String())
    password = db.Column(db.String())
    active = db.Column(db.Boolean, default=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('user', lazy='dynamic'))

    @property
    def id(self):
        return self.email

    def is_active(self):
        return True

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.active

    def is_anonymous(self):
        return False

    def serialize(self):
        return {
            'email': self.email
        }


class ExtendedRegisterForm(RegisterForm):
    firstname = TextField('First Name', [Required()])
    lastname = TextField('Last Name', [Required()])

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore, register_form=ExtendedRegisterForm)


@user_registered.connect_via(app)
def user_registered_sighandler(app, user, confirm_token):
    default_role = user_datastore.find_role("user")
    user_datastore.add_role_to_user(user, default_role)
    db.session.commit()


@app.before_first_request
def create_user():
    db.create_all()
    test_user = user_datastore.get_user("test@user.com")
    if test_user is None:
        test_user = user_datastore.create_user(email='test@user.com', password='testtest',
                               firstname='test', lastname='test')
        default_role = user_datastore.find_role("user")
        if default_role is None:
            default_role = user_datastore.create_role(name="user")
        user_datastore.add_role_to_user(test_user, default_role)
        db.session.commit()


@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@app.route('/')
@login_required
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8000))
