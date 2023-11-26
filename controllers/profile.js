const profile = async ( req, res, db ) => {
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
};

module.exports = {
	profile,
};