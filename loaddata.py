import sys
import json
import app
import ipdb

MODEL_LOAD_ORDER = {
        "role": 0,
        "user": 1,
        "vendor": 2,
        "product": 3,
        "order": 4
    }

def loaddata(fname):
    '''
    loaddata for specified json file
    '''
    with open(fname, 'rb') as f:
        data = json.load(f)
    data = sorted(data, key=lambda x: MODEL_LOAD_ORDER[x["model"]])
    for d in data:
        model = getattr(app, d["model"].title())
        m = model(**d["fields"])
        app.db.session.merge(m)
    app.db.session.commit()


if __name__=='__main__':
    for fname in sys.argv[1:]:
        loaddata(fname)
