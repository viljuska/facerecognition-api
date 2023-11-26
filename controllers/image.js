const image = async ( req, res, db ) => {
	const { id } = req.body;

	try {
		// Destructure object inside array
		const [ { entries } ] = await db( 'users' )
			.where( { id } )
			.increment( 'entries', 1 )
			.returning( 'entries' );

		if ( entries ) {
			return res.json( entries );
		}
	} catch ( e ) {
		console.log( e );
		return res.status( 500 ).json( 'server error' );
	}

	return res.status( 404 ).json( 'not found' );
};

module.exports = {
	image,
};