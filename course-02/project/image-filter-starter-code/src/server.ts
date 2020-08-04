import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}} endpoint to filter an image from a public url.
      /*
      1. validate the image_url query
      2. call filterImageFromURL(image_url) to filter the image
      3. send the resulting file in the response
      4. deletes any files on the server on finish of the response
      QUERY PARAMATERS
      image_url: URL of a publicly accessible image
      RETURNS
      the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
      */
/**************************************************************************** */
//! END @TODO1

  app.get( "/filteredimage/", async ( req, res ) => {
    const imgUrl = req.query.image_url;

    //check if param was provided
    var badParam = !imgUrl || imgUrl.length == 0;
    if (!badParam) {
      // make sure url's valid
      var paramParts = imgUrl.split('//');
      if (paramParts.length) {
        badParam = paramParts[0].indexOf('http') == -1;
      }
    }
    if ( badParam) {
      return res.status(400).send(`2: valid url is required`);
    }

    var file = await filterImageFromURL(imgUrl);

    //delete it
    var fileArr = [file];
    if (file) {
      deleteLocalFiles(fileArr);
      return res.status(200).send(`SUCCESS: saved image as: ${file}`);
    }
    else
      return res.status(400).send(`ERROR saving image: ${imgUrl}`);
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();