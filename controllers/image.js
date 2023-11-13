import fetch from 'node-fetch';

// Change these to whatever model you want to use
const MODEL_ID = 'face-detection';
const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = API_CLARIFAI;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'kyle-hek';       
const APP_ID = 'smart-brain';  
const IMAGE_URL = imageUrl;

//setting up json that will be sent to clarifai
const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};

return requestOptions;
}

const handleAPICall = (req, res) => {
    fetch(
        "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", 
        returnClarifaiRequestOptions(req.body.input)
    )
    .then((response) => response.text())
    .then(result => {
        res.json(result);
    })
    .catch(err => res.status(500).json('Unable to communicate with API'));
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
        db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

export {
    handleImage,
    handleAPICall
}