const signin = async ( req, res, db, bcrypt ) => {
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
};

module.exports = {
	signin,
};