#!/usr/bin/env python
# vim:ts=8 sw=8 noet
from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util, template

import os
from model import Game

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
		if user:
			game = Game.get_by_key_name(user.user_id())
			if game:
				draw(self.response, 'game.html', {'nickname' : user.nickname()})
			else:
				game = Game(key_name=user.user_id(), player=user)
				game.put()
				self.redirect(self.request.uri)
		else:
			self.redirect(users.create_login_url(self.request.uri))

def main():
        application = webapp.WSGIApplication([
		('/', Welcome),
		('/play', Play),
	], debug=True)
        util.run_wsgi_app(application)

if __name__ == '__main__':
        main()
