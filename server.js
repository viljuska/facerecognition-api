const express    = require( 'express' ),
      app        = express(),
      bcrypt     = require( 'bcrypt' ),
      saltRounds = 10,
      cors       = require( 'cors' ),
      knex       = require( 'knex' );

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

app.post( '/signin', async ( req, res ) => {
	const { email: req_email = '', pass: req_pass = '' } = req.body;

	if ( !req_email || !req_pass ) {
		return res.status( 400 ).json( 'incorrect form submission' );
	}

	try {
		const [ user_login ] = await db.select( '*' ).from( 'login' ).where( { email: req_email } );

		// Check if user exists
		if ( !user_login ) {
			return res.status( 404 ).json( 'User does not exist' );
		}

		// Check if password is correct
		if ( !bcrypt.compareSync( req_pass, user_login.hash ) ) {
			return res.status( 400 ).json( 'wrong credentials' );
		}

		const [ user ] = await db.select( '*' ).from( 'users' ).where( { email: req_email } );

		return res.json( user );
	} catch ( e ) {
		console.log( e );

		return res.status( 500 ).json( 'Server error' );
	}
} );

app.post( '/register', async ( req, res ) => {
	let { email, name, pass } = req.body;

	// There are sync and async versions of bcrypt
	const salt = bcrypt.genSaltSync( saltRounds );
	const hash = bcrypt.hashSync( pass, salt );

	try {
		// One way to do it
		const user_inserted = await db( 'users' )
			.insert( {
				email,
				name,
				joined: new Date(),
			} )
			.returning( '*' );

		const login_inserted = await db( 'login' )
			.insert( {
				email,
				hash,
			} )
			.returning( '*' );

		if ( user_inserted.length && login_inserted.length ) {
			return res.json( user_inserted[ 0 ] );
		}
	} catch ( e ) {
		console.log( e );
	}

	return res.status( 400 ).json( 'unable to register' );
} );

app.get( '/profile/:id', async ( req, res ) => {
	const { id } = req.params;

	try {
		const user = await db.select( '*' ).from( 'users' ).where( { id } );

		if ( user.length ) {
			return res.json( user[ 0 ] );
		}
	} catch ( e ) {
		console.log( e );
		return res.status( 500 ).json( 'server error' );
	}

	return res.status( 404 ).json( 'no such user' );
} );

app.put( '/image', async ( req, res ) => {
	const { id } = req.body;

	try {
		const user = await db( 'users' )
			.where( { id } )
			.increment( 'entries', 1 )
			.returning( 'entries' );

		if ( user.length ) {
			return res.json( user[ 0 ] );
		}
	} catch ( e ) {
		console.log( e );
		return res.status( 500 ).json( 'server error' );
	}

	return res.status( 404 ).json( 'not found' );
} );

app.get( '/signout', ( req, res ) => {
	return res.json( 'signout' );
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