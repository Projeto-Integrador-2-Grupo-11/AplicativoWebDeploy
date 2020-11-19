const middleware = {}

middleware['check-auth'] = require('../middleware/check-auth.js');
middleware['check-auth'] = middleware['check-auth'].default || middleware['check-auth']

middleware['isLogged'] = require('../middleware/isLogged.js');
middleware['isLogged'] = middleware['isLogged'].default || middleware['isLogged']

export default middleware
