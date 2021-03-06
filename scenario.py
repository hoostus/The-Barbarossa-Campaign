# vim:ts=8 sw=8 noet
from model import Piece
import itertools

class Scenario(object):
	def setup(self, game):
		""" Setup needs to take care:
		# Setting start Turn
		# Setting start phase
		# Luftwaffe units
		# VP marker
		# Initiative marker
		# Axis Economic Display + Axis Strategic Mode
		# Soviet Economic Display

		# Control points
		# Center Economic Display
		# Setup deck (shuffle + historical gameplay option)
		# Reserve boxes
		# Combat chit cups
		# Removed pieces box
		# [MAP] assorted markers: hedgehogs, fortificatoins, capture bonuses,
			event markers, partisans, defense markers, berlin logistics
		# [MAP] Soviet setup (special units + line)
		# [MAP] Axis setup (special units + line; choice during 1941 setup)
		"""

		raise Exception('Abstract Base Class method')

	def starting_pieces(self):
		""" Return a list of tuples for the soviet starting positions """
		raise Exception('Abstract Base Class method')

class Barbarossa(Scenario):
	def __init__(self):
		self.ussr_line = [
			[1, 8], [2, 8],
			[5, 4], [5, 5], [6, 6], [7, 5], [8, 6], [9, 6],
			[10, 6], [10, 7], [10, 8], [11, 8], [12, 9]
		]

		self.fortified = ['Sevastopol']
		self.finns = [[1, 7], [2, 7]]

		#self.rumanian_setup = [[12, 8], [11, 7], [11, 6]]
		self.greater_germany_setup = [[6, 5], [7, 4], [8, 5], [9, 5], [10, 5]]
		#self.german_line_setup = self.rumanian_setup + self.greater_germany_setup + [11, 5]

	def setup(self, game):
		game.turn = 1
		game.phase = 1

		game.luftwaffe = 3

		game.vp = 0
		game.initiative = 0

		game.axis_armor_track = 0
		game.eliminated_panzer_units = 0
		game.axis_strategic_mode = 'tank-production'

		game.soviet_armor_track = 0
		game.soviet_industry_track = 0
		game.soviet_lend_lease_track = 0

		game.fortified = self.fortified

		# eventually I'll have a proper setup but I need to do some actual
		# game-code work for a change...so we'll just go with a hard-coded setup
		# for now
		#game.state = 'setup'
		game.state = 'playing'

		for ussr in self.ussr_line:
			p = Piece(game=game, side='ussr', type='line', y=ussr[0], x=ussr[1])
			p.put()

		for finn in self.finns:
			p = Piece(game=game, side='axis', type='finn', y=finn[0], x=finn[1])
			p.put()

		Piece(game=game, side='axis', type='panzer', y=6, x=5).put()
		Piece(game=game, side='axis', type='panzer', y=8, x=5).put()
		Piece(game=game, side='axis', type='panzer', y=9, x=5).put()

		Piece(game=game, side='axis', type='mountain', y=11, x=7).put()

		Piece(game=game, side='axis', type='rumanian', y=11, x=6).put()
		Piece(game=game, side='axis', type='rumanian', y=12, x=8).put()

		for german in itertools.chain(self.greater_germany_setup, [[11, 5]]):
			p = Piece(game=game, side='axis', type='line', y=german[0], x=german[1])
			p.put()


	def starting_pieces(self):
		return {
			'ussr_line': self.ussr_line,
			'finnish' : self.finns
		}

class FallBlau(Scenario):
	def setup(self, game):
		game.turn = 5
		game.phase = 1 # events phase

		game.luftwaffe = 2

		game.vp = 2
		game.initiative = 2

		game.axis_armor_track = 1
		game.eliminated_panzer_units = 1
		game.axis_strategic_mode = 'tank-production'

		game.soviet_armor_track = 1
		game.soviet_industry_track = 2
		game.soviet_lend_lease_track = 1

		game.state = 'playing'

class Destruction(Scenario):
	def setup(self, game):
		game.turn = 12
		game.phase = 1 # events phase

		game.luftwaffe = 0

		game.vp = 3
		game.initiative = -9

		game.axis_armor_track = 3
		game.eliminated_panzer_units = 2
		game.axis_strategic_mode = 'defense'

		game.soviet_armor_track = 3
		game.soviet_industry_track = 3
		game.soviet_lend_lease_track = 3

		game.state = 'playing'

class IronDream(Scenario):
	def setup(self, game):
		game.turn = 15
		game.phase = 1 # events phase

		game.luftwaffe = 0

		game.vp = -14
		game.initiative = -9

		game.axis_armor_track = 3
		game.eliminated_panzer_units = 3
		game.axis_strategic_mode = 'defense'

		game.soviet_armor_track = 4
		game.soviet_industry_track = 4
		game.soviet_lend_lease_track = 4

		game.state = 'playing'

		self.hedgehogs = [[5, 4], [6, 4], [12, 4]]
		self.guard = [[6, 5], [12, 5]]
		self.guard_tank = [[7, 5], [9, 5]]
		self.tank = [[10, 5], [11, 4]]
		self.shock = [[8, 6], [13, 3]]
		self.ussr_line = [[5, 5], [13, 4]]

		self.hungarian = [[12, 3], [12, 4]]
		self.motorized = [[7, 3]]
		self.panzer = [[8, 5]]
		self.elite_panzer = [[11, 3]]
		self.german_line = [[5, 4], [7, 4], [9, 4], [10, 4], [13, 2]]

		# defense >1 at Prague
		# defense >1 at Berlin
		# Berlin logistics at Berlin

class Kursk(Scenario):
	def setup(self, game):
		game.turn = 9
		game.phase = 1

		game.luftwaffe = 1

		game.vp = 3
		game.initiative = -5

		game.axis_armor_track = 3
		game.eliminated_panzer_units = 2
		game.axis_strategic_mode = 'tank-production'

		game.soviet_armor_track = 3
		game.soviet_industry_track = 2
		game.soviet_lend_lease_track = 2

		game.state = 'playing'

class OperationSaturn(Scenario):
	def setup(self, game):
		game.turn = 7
		game.phase = 7 # Soviet counterattack phase

		game.luftwaffe = 0

		game.vp = 3
		game.initiative = 1

		game.axis_armor_track = 2
		game.eliminated_panzer_units = 1
		game.axis_strategic_mode = 'tank-production'

		game.soviet_armor_track = 3
		game.soviet_industry_track = 2
		game.soviet_lend_lease_track = 2

		game.state = 'playing'

scenarios = {
	'barbarossa' : Barbarossa(),
	'fall-blau' : FallBlau(),
	'kursk' : Kursk(),
	'operation-saturn' : OperationSaturn(),
	'destruction' : Destruction(),
	'iron-dream' : IronDream()
}

def get_scenario(name):
	return scenarios[name]
