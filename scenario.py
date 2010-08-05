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

class Barbarossa(Scenario):
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

		game.state = 'setup'

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
