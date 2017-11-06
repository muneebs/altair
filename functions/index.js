/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const request = require('superagent');

// [START init_algolia]
// Initialize Algolia, requires installing Algolia dependencies:
// https://www.algolia.com/doc/api-client/javascript/getting-started/#install
//
// App ID and API Key are stored in functions config variables
const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;
const GOOGLE_API_KEY = functions.config().google.api_key;

const ALGOLIA_INDEX_NAME = 'customers';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
// [END init_algolia]

// Update the search index every time a customer is written.
exports.onCustomerCreated = functions.firestore
  .document('customers/{customerId}')
  .onCreate(event => {
    const address = event.data.data().address;
    if (typeof address === 'string') {
      // geocode the address
      request
        .get('https://maps.googleapis.com/maps/api/geocode/json')
        .type('application/json')
        .query({ components: 'country:ZA' })
        .query({ sensor: false })
        .query({ address: address })
        .query({ key: GOOGLE_API_KEY })
        .then(response => {
          return response.body;
        })
        .then(({ results }) => {
          // only take the first result
          const result = results[0];
          const myAddresss = {
            address: result.formatted_address,
            location: {
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng
            }
          };
          event.data.ref.set(
            {
              address: myAddresss
            },
            { merge: true }
          );
        })
        .catch(error => {
          console.log('unable to run geocode', error);
        });
    }
    event.data.ref.set(
      {
        updatedAt: new Date(),
        createdAt: new Date()
      },
      { merge: true }
    );

    const customer = event.data.data();
    customer.objectID = event.params.customerId;
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.saveObject(customer);
  });

exports.onCustomerDeleted = functions.firestore
  .document('customers/{customerId}')
  .onDelete(event => {
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    return index.deleteObject(event.params.customerId);
  });

// [START get_firebase_user]
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

function getFirebaseUser(req, res, next) {
  console.log('Check if request is authorized with Firebase ID token');

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>'
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    console.log("Found 'Authorization' header");
    idToken = req.headers.authorization.split('Bearer ')[1];
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;
      next();
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
}
// [END get_firebase_user]

// [START get_algolia_user_token]
// This complex HTTP function will be created as an ExpressJS app:
// https://expressjs.com/en/4x/api.html
const app = require('express')();

// We'll enable CORS support to allow the function to be invoked
// from our app client-side.
app.use(require('cors')({ origin: true }));

// Then we'll also use a special 'getFirebaseUser' middleware which
// verifies the Authorization header and adds a `user` field to the
// incoming request:
// https://gist.github.com/abehaskins/832d6f8665454d0cd99ef08c229afb42
app.use(getFirebaseUser);

// Add a route handler to the app to generate the secured key
app.get('/', (req, res) => {
  // Create the params object as described in the Algolia documentation:
  // https://www.algolia.com/doc/guides/security/api-keys/#generating-api-keys
  const params = {
    // This filter ensures that only documents where owner == createdBy will be readable
    filters: `_tags:user_${req.user.user_id} AND createdBy = ${req.user
      .user_id}`,
    // We also proxy the user_id as a unique token for this key.
    userToken: `user_${req.user.user_id}`
  };

  // Call the Algolia API to generate a unique key based on our search key
  const key = client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, params);

  // Then return this key as {key: '...key'}
  res.json({ key });
});

// Finally, pass our ExpressJS app to Cloud Functions as a function
// called 'getSearchKey';
exports.getSearchKey = functions.https.onRequest(app);
// [END get_algolia_user_token]
