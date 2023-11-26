const saltRounds = 10,
      register   = async ( req, res, db, bcrypt ) => {
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
      };

module.exports = {
	register,
};