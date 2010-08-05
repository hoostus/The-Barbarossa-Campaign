#!/usr/bin/env python
# vim:ts=8 sw=8 noet
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

import os
import cgi

from flash import Flash
from model import Game
import scenario

templates = os.path.join(os.path.dirname(__file__), 'templates')

def draw(response, template_file, params):
	path = os.path.join(templates, template_file)
	response.out.write(template.render(path, params))

class Welcome(webapp.RequestHandler):
        def get(self):
		draw(self.response, 'index.html', {})

class Play(webapp.RequestHandler):
	def get(self):
		user = users.get_current_user()
		if not user:
			self.redirect(users.create_login_url(self.request.uri))
		else:
			game = Game.get_by_key_name(user.user_id())
			if not game:
				draw(self.response, 'pick-scenario.html', {})
			elif game.setup():
				draw(self.response, 'setup.html', {'nickname' : user.nickname()})
			elif game.playing():
				draw(self.response, 'game.html', {'nickname' : user.nickname()})
			elif game.finished():
				# display finished state and let them start again
				raise Exception('Not Implemented')
			else:
				raise Exception('Not Implemented')

class SelectScenario(webapp.RequestHandler):
	def post(self):
		user = users.get_current_user()
		if not user:
			self.redirect('/')
		else:
			game = Game.get_by_key_name(user.user_id())

			if game:
				self.flash = Flash()
				self.flash.msg = ['You cannot select a scenario.',
						'You already have a game in progress.']
				self.redirect('/play')
			else:
				scenario_name = self.request.get('scenario')
				historical = self.request.get('historical')
				game = Game(key_name=user.user_id(),
					player=user,
					scenario=scenario_name,
					historical=(historical == 'on'))
				scenario.get_scenario(scenario_name).setup(game)
				game.put()
				self.redirect('/play')

def main():
        application = webapp.WSGIApplication([
		('/', Welcome),
		('/play', Play),
		('/select-scenario', SelectScenario),
	], debug=True)
        util.run_wsgi_app(application)

if __name__ == '__main__':
        main()
