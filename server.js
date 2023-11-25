const express    = require( 'express' ),
      app        = express(),
      database   = require( './db.json' ),
      fs         = require( 'fs' ),
      bcrypt     = require( 'bcrypt' ),
      saltRounds = 10,
      cors       = require( 'cors' );

/**
 * Get user by id
 *
 * @param id
 * @returns {*}
 */
function getUser( id ) {
	return database.users.any( user => user.id === Number( id ) );
}

// Setup middleware to parse the body of the request
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );
app.use( cors() );

app.get( '/', ( req, res ) => {
	res.json( database.users );
} );

app.post( '/signin', ( req, res ) => {
	const { email: req_email = '', pass: req_pass = '' } = req.body;

	if ( !req_email || !req_pass ) {
		return res.status( 400 ).json( 'incorrect form submission' );
	}

	// Loop through the users in the database and check if the user exists and the password is correct using bcrypt
	for ( const user of database.users ) {
		const { email, pass } = user;

		if ( req_email === email ) {
			if ( !bcrypt.compareSync( req_pass, pass ) ) {
				return res.status( 400 ).json( 'wrong credentials' );
			}

			return res.json( user );
		}
	}

	res.status( 400 ).json( 'error logging in' );
} );

app.post( '/register', ( req, res ) => {
	let { email, name, pass } = req.body;

	// There are sync and async versions of bcrypt
	const salt = bcrypt.genSaltSync( saltRounds );
	const hash = bcrypt.hashSync( pass, salt );

	database.users.push( {
		id     : database.users.length + 1,
		name   : name,
		email  : email,
		pass   : hash,
		entries: 0,
		joined : new Date(),
	} );

	fs.writeFile( 'db.json', JSON.stringify( database ), ( err ) => {
		if ( err ) {
			console.log( err );
		}
	} );

	res.json( database.users[ database.users.length - 1 ] );
} );

app.get( '/profile/:id', ( req, res ) => {
	const { id } = req.params;
	const user   = getUser( id );

	if ( user.length ) {
		return res.json( user[ 0 ] );
	}

	res.status( 404 ).json( 'no such user' );
} );

app.put( '/image', ( req, res ) => {
	const { id } = req.body;
	const user   = getUser( id );

	if ( user.length ) {
		database.users[ +id - 1 ].entries++;

		fs.writeFile( 'db.json', JSON.stringify( database ), ( err ) => {
			if ( err ) {
				console.log( err );
			}
		} );

		return res.json( database.users[ +id - 1 ].entries );
	}

	res.status( 404 ).json( 'not found' );
} );

app.get( '/signout', ( req, res ) => {
	res.json( 'signout' );
} );

app.listen( 3000, () => {
	console.log( 'Server running on port 3000' );
} );

/*
 / -> res = this is working

 /signin -> POST = success or fail

 /register -> POST = new user

 /profile/:userid -> GET = user

 /image -> PUT = user

 /signout -> GET
 */