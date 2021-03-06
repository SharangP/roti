import os
import json
import datetime
import decimal

from flask import Flask, render_template, redirect, request
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy.orm import class_mapper
from flask.ext.login import LoginManager, AnonymousUserMixin, logout_user
from flask.ext.security import RoleMixin, UserMixin, SQLAlchemyUserDatastore
from flask.ext.security import Security, login_required, current_user
from flask.ext.security.forms import RegisterForm, TextField, Required
from flask.ext.security.signals import user_registered
from flask_debugtoolbar import DebugToolbarExtension

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
app.config['SECURITY_LOGOUT_URL'] = '/logout'
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
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.String(), db.ForeignKey('role.name'))
)

class Serializable(object):
    def to_dict(self):
        ignore_cols = getattr(self, "__ignore_columns__", [])
        return dict((c.name, self._serialize(getattr(self, c.name))) for c in class_mapper(self.__class__).columns if c.name not in ignore_cols)

    def _serialize(self, value):
        if isinstance(value, decimal.Decimal):
            return float(value)
        elif isinstance(value, Serializable):
            return value.to_dict()
        return value

class Role(db.Model, RoleMixin, Serializable):
    __tablename__ = 'role'

    name = db.Column(db.String(), primary_key=True)

class Product(db.Model, Serializable):
    __tablename__ = 'product'

    id = db.Column(db.Integer(), primary_key=True)
    vendor = db.Column(db.Integer(), db.ForeignKey('vendor.id'))
    name = db.Column(db.String())
    image = db.Column(db.String())
    price = db.Column(db.Float(asdecimal=True))
    description = db.Column(db.Text())
    #TODO: add unique(vendor,name)

class Vendor(db.Model, Serializable):
    __tablename__ = 'vendor'

    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    image = db.Column(db.String())
    description = db.Column(db.String())
    address = db.Column(db.String())
    products = db.relationship('Product', backref='product')

class Order(db.Model, Serializable):
    __tablename__ = 'order'

    id = db.Column(db.Integer(), primary_key=True)
    vendor_id = db.Column(db.Integer(), db.ForeignKey('vendor.id'))
    vendor = db.relationship('Vendor', foreign_keys='Order.vendor_id')
    customer_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    customer = db.relationship('User', foreign_keys='Order.customer_id')
    product_id = db.Column(db.Integer(), db.ForeignKey('product.id'))
    product = db.relationship('Product', foreign_keys='Order.product_id')
    amount = db.Column(db.Integer())
    pending = db.Column(db.Boolean(), default=True)
    created_time = db.Column(db.DateTime(), default=datetime.datetime.utcnow())
    # TODO add order completed column

class User(db.Model, UserMixin, Serializable):
    __tablename__ = 'user'
    __ignore_columns__ = ["password"]

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(), unique=True)
    firstname = db.Column(db.String())
    lastname = db.Column(db.String())
    password = db.Column(db.String())
    active = db.Column(db.Boolean, default=False)
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('user', lazy='dynamic'))
    vendor = db.relationship('Vendor', uselist=False, backref='user')

    @property
    def name(self):
        return "%s %s" % (self.firstname, self.lastname)

    def is_active(self):
        return True

    def get_id(self):
        return self.email

    def is_authenticated(self):
        return self.active

    def is_anonymous(self):
        return False

    def get_name(self):
        return "%s %s" % (self.firstname, self.lastname)


class ExtendedRegisterForm(RegisterForm):
    firstname = TextField('First Name', [Required()])
    lastname = TextField('Last Name', [Required()])

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore, register_form=ExtendedRegisterForm)


class AnonymousUser(AnonymousUserMixin):
    def __init__(self):
        self.id = None
        self.roles = []

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.anonymous_user = AnonymousUser
login_manager.login_view = '/login'


@login_manager.user_loader
def load_user(userid):
    return User.query.filter_by(email=userid).first()


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

app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
toolbar = DebugToolbarExtension(app)


@app.route('/register', methods=['GET'])
def register():
    return render_template('register.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(request.args.get('next') or '/')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/vendor/<int:vendor_id>')
def vendor(vendor_id):
    return render_template('vendor.html', vendor_id=vendor_id)

@app.route('/order/<int:order_id>')
@login_required
def order(order_id):
    order = Order.query.get_or_404(order_id)
    return render_template("order.html", order=order)

@app.route('/order')
@login_required
def orders():
    orders = Order.query.filter_by(customer_id=current_user.id).all()
    return render_template("orders.html", orders=orders)

@app.route('/search')
def results():
    return render_template('search.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/make')
def make_rotis():
    return render_template('make.html')

@app.route('/setup', methods=['GET', 'POST'])
@login_required
def setup():
    if request.method == 'POST':
        raise NotImplementedError #TODO
    else:
        return render_template('setup.html')

#API

@app.route('/api/vendor', methods=['GET']) #TODO: make this an actual query
def api_vendor_list():
    vendors = []
    for vendor in Vendor.query.all():
        vendors.append(dict(
            id=vendor.id,
            image=vendor.image,
            address=vendor.address,
            description=vendor.description,
            user=vendor.user.get_name()))
    return json.dumps(vendors)

@app.route('/api/vendor/<int:vendor_id>', methods=['GET']) #TODO: make this an actual query
def api_vendor_get(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    vendor_dict = vendor.to_dict()
    vendor_dict["user"] = vendor.user.to_dict()
    vendor_dict["products"] = [p.to_dict() for p in vendor.products]
    return json.dumps(vendor_dict)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8000))
