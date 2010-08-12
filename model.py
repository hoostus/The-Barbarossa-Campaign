# vim:ts=8 sw=8 noet
from google.appengine.ext import db

class Game(db.Model):
	player = db.UserProperty(required=True)
	date_started = db.DateTimeProperty(auto_now_add=True)
	last_move = db.DateTimeProperty()
	historical_option = db.BooleanProperty(default=False)

	turn = db.IntegerProperty(choices=range(1, 19))
	phase = db.IntegerProperty()
	luftwaffe = db.IntegerProperty()
	vp = db.IntegerProperty()
	initiative = db.IntegerProperty(choices=range(-14, 7))

	axis_armor_track = db.IntegerProperty(choices=range(0, 6))
	eliminated_panzer_units = db.IntegerProperty(choices=range(0,5))
	axis_strategic_mode = db.StringProperty(choices=set([
		'reserve-offensive', 'defense', 'logistics', 'tank-production', 'economic-warfare', 'exploitation'
		]))

	soviet_armor_track = db.IntegerProperty(choices=range(0, 6))
	soviet_industry_track = db.IntegerProperty(choices=range(0, 6))
	soviet_lend_lease_track = db.IntegerProperty(choices=range(0, 6))

	state = db.StringProperty(default='setup',
			choices=set([ 'setup', 'playing', 'complete' ]))

	scenario = db.StringProperty(default='barbarossa') # TODO: recursive depend... choices=set(scenario.scenarios.keys()))

	def finished(self):
		return self.state == 'complete'
	def setup(self):
		return self.state == 'setup'
	def playing(self):
		return self.state == 'playing'

class Piece(db.Model):
	game = db.ReferenceProperty(Game, required=True)
	type = db.StringProperty()
	x = db.IntegerProperty(required=True, choices=range(1, 20))
	y = db.IntegerProperty(required=True, choices=range(1, 14))
