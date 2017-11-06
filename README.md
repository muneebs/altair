![logo](./src/assets/logo.png)
# Altair - Customer manager

Altair is a simple customer management application I built as a coding test for [Redblade Software](http://www.redblade.io).

A working demo is deployed at: [https://altair-e7ed4.firebaseapp.com](https://altair-e7ed4.firebaseapp.com)

# Requirements
- [Firebase](https://firebase.google.com) - a realtime database for web/mobile applications created by Google Inc.
- [Algolia Search](https://algolia.com) - used to index our firebase data store and to provide fulltext search.
- [NodeJS](https://www.nodejs.org) (8.7.0)
- [Yarn](https://yarnpkg.com) or [NPM](https://www.npmjs.com/)


# Setup
Create a .env file in the root directory with the following variables:

```
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABSE_URL
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_SENDER_ID
REACT_APP_ALGOLIA_APP_ID=YOUR_ALGOLIA_APP_ID
REACT_APP_ALGOLIA_SEARCH_KEY=YOUR_ALGOLIA_SEARCH_KEY
```

The app uses firebase functions to add customers to the Algolia search index and to geocode addresses.

Configure your firebase functions:

```
firebase functions:config:set algolia.app_id='YOUR_APP_ID' \
algolia.api_key='YOUR_API_KEY' \
algolia.search_key='YOUR_SEARCH_KEY' \
google.api_key='YOUR_GOOGLE_WEB_KEY'
```

create a .firebaserc file with the following contents

```
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

clone the altair-redux repository in a parent folder i.e ../altair-redux
```
cd ../ && git clone https://github.com/muneebs/altair-redux.git
```

```
cd altair-redux
npm install
npm link
```

```
cd ../altair
```

now link the redux project and start the app

```
npm link altair-redux
```

```
npm install
```

```
npm start
```

# Build

Create a production-ready optimized build

```
export GENERATE_SOURCEMAP=false && yarn build
```

# Deploy

if you have firebase configured, simply run:

```
firebase deploy
```
