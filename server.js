const express                  = require( 'express' ),
      app                      = express(),
      bcrypt                   = require( 'bcrypt' ),
      cors                     = require( 'cors' ),
      knex                     = require( 'knex' ),
      { register }             = require( './controllers/register' ),
      { signin }               = require( './controllers/signin' ),
      { profile }              = require( './controllers/profile' ),
      { image, handleApiCall } = require( './controllers/image' );

const db = knex( {
	'client'    : 'pg',
	'connection': {
		'host'    : '127.0.0.1',
		'user'    : 'postgres',
		'password': '2657',
		'database': 'facerecognitionbrain',
	},
} );

// Setup middleware to parse the body of the request
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );
app.use( cors() );

app.get( '/', ( req, res ) => {
	return res.json( 'success' );
} );

app.post(
	'/signin',
	( req, res ) => signin( req, res, db, bcrypt ),
);

app.post(
	'/register',
	( req, res ) => register( req, res, db, bcrypt ),
);

app.get(
	'/profile/:id',
	( req, res ) => profile( req, res, db ),
);

app.post(
	'/imageurl',
	( req, res ) => handleApiCall( req, res ),
);

app.put(
	'/image',
	( req, res ) => image( req, res, db ),
);

app.listen( 3000, () => {
	console.log( 'Server running on port 3000' );
} );
