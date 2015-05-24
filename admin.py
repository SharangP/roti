from app import *
import json

pending_orders = Order.query.filter_by(pending=True).all()
if len(pending_orders) > 0:
    print("Pending Orders")
    for order in pending_orders:
        print("Order %d:" % order.id)
        print("Vendor: %s" % json.dumps(order.vendor.to_dict(), indent=2, sort_keys=True))
        print("Customer: %s" % json.dumps(order.customer.to_dict(), indent=2, sort_keys=True))
        print("Product: %s" % json.dumps(order.product.to_dict(), indent=2, sort_keys=True))
        print("Amount: %d" % order.amount)
        print("Created: %s" % order.created_time)
        print("-" * 50)
else:
    print("No pending orders")
