const setupClarifaiRequest = ( imageUrl ) => {
	      const PAT     = 'a902e646fca3485688eeae7d1b8a1e9d';
	      const USER_ID = 'viljuska';
	      const APP_ID  = 'facerecognitionbrain';
	      const raw     = JSON.stringify( {
		      'user_app_id': {
			      'user_id': USER_ID,
			      'app_id' : APP_ID,
		      },
		      'inputs'     : [
			      {
				      'data': {
					      'image': {
						      'url': imageUrl,
					      },
				      },
			      },
		      ],
	      } );

	      return {
		      method : 'POST',
		      headers: {
			      'Accept'       : 'application/json',
			      'Authorization': 'Key ' + PAT,
		      },
		      body   : raw,
	      };
      },
      handleApiCall        = ( req, res ) => {
	      const { input } = req.body;
	      console.log(input);

	      // todo: add choice to select model
	      fetch( 'https://api.clarifai.com/v2/models/' + 'face-detection' + '/outputs', setupClarifaiRequest( input ) )
		      .then( response => response.json() )
		      .then( data => res.json( data ) )
		      .catch( error => {
			      console.log( 'error', error );
			      return res.status( 400 ).json( 'unable to work with API' );
		      } );
      },
      image                = async ( req, res, db ) => {
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
	handleApiCall,
};