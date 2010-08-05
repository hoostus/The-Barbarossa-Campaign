# vim:ts=8 sw=8 noet
from google.appengine.ext import db

class Game(db.Model):
	player = db.UserProperty(required=True)
	date_started = db.DateTimeProperty(auto_now_add=True)
	last_move = db.DateTimeProperty()
	historical_option = db.BooleanProperty(default=False)
	turn = db.IntegerProperty(required=True, choices=range(1, 19))

	phase = db.IntegerProperty(required=True

	state = db.StringProperty(default='setup',
			choices=set([
				'setup',
				'playing',
				'complete'
			])
	)

	scenario = db.StringProperty(default='barbarossa',
		choices=set([
			'barbarossa',
			'fall-blau',
			'kursk',
			'operation-saturn',
			'destruction',
			'iron-dream']))

	def finished(self):
		return self.state == 'complete'
	def setup(self):
		return self.state == 'setup'
	def playing(self):
		return self.state == 'playing'
