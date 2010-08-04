# vim:ts=8 sw=8 noet
from google.appengine.ext import db

class Game(db.Model):
	player = db.UserProperty(required=True)
	started = db.DateTimeProperty(auto_now_add=True)
	last_move = db.DateTimeProperty()
