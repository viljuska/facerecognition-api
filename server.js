const express                  = require( 'express' ),
      app                      = express(),
      bcrypt                   = require( 'bcrypt' ),
      cors                     = require( 'cors' ),
      knex                     = require( 'knex' ),
      { register }             = require( './controllers/register' ),
      { signin }               = require( './controllers/signin' ),
      { profile }              = require( './controllers/profile' ),
      { image, handleApiCall } = require( './controllers/image' ),
      PORT                     = process.env.PORT || 3000,
      environment              = process.env.NODE_ENV || 'development';

// const db = knex( {
// 	'client'    : 'pg',
// 	'connection': {
// 		'host'    : '127.0.0.1',
// 		'user'    : 'postgres',
// 		'password': '2657',
// 		'database': 'facerecognitionbrain',
// 	},
// } );

const connectionString = {
	      production : 'postgres://facerecognition_user:akElhzA4fk0qkNlV1dCkPpyTboURhEDb@dpg-clhrikt8td7s73bqruhg-a/facerecognition_caet',
	      development: 'postgres://facerecognition_user:akElhzA4fk0qkNlV1dCkPpyTboURhEDb@dpg-clhrikt8td7s73bqruhg-a.frankfurt-postgres.render.com/facerecognition_caet',// External url
      },
      db               = knex( {
	      'client'    : 'pg',
	      'connection': {
		      'connectionString': connectionString[ environment ],
		      'ssl'             : false, // Just for development
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

app.listen( PORT, () => {
	console.log( `Server running on port ${ PORT }` );
} );
