# vim:ts=8 sw=8 noet
from google.appengine.ext import db

class Game(db.Model):
	player = db.UserProperty(required=True)
	started = db.DateTimeProperty(auto_now_add=True)
	last_move = db.DateTimeProperty()

	scenario = db.StringProperty(default='barbarossa', choices=set(['barbarossa', 'fall-blau', 'point-kursk', 'operation-saturn', 'destruction', 'iron-dream']))
	historical_option = db.BooleanProperty(default=False)
