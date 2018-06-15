import allowedTypes from './upload-mimetypes';
import urlJoin from 'url-join';

const config = {
  app: {
    name : 'datea',
    url  : WEB_URL, // see .env and webpack config for this
  },
	api : {
		url    : API_URL,
		imgUrl : MEDIA_URL
	},
  landingPath : 'welcome',

  facebookAppId: '222271061161837',

  validation : {
    debounceMs : 1000,
    username : {
      minLength : 2,
      maxLength : 30,
    },
    password: {
      minLength : 6,
      maxLength : 32,
      regex : /^(?=.*\d)(?=.*[a-z])(?!.*\s).{6,32}$/
    },
    allowedFileTypes : allowedTypes,
    allowedImageTypes : [
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml'
    ]
  },
  mapOpts : {
    minZoom : 2,
    maxZoom: 18,
    /*tileUrl : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    tileAttribution : 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',*/
    tileUrl : 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${token}',
    tileAttribution : `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
		<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>
			Imagery © <a href="http://mapbox.com">Mapbox</a>`
  },
  geolocation: {
    ipLocationAccuracy: 10000,
  },
  defaultLocale: 'es',
  locales : ['es', 'fr'],
  keys: {
    google: 'AIzaSyBqMKdCCMaxkAouJ3DhxWuH7Dbhho0Uw8U',
    mapbox : 'pk.eyJ1IjoicmRlcnRlYW5vIiwiYSI6ImNqZW9jMDZpczByOGcyeW12bmhpeXk4OXoifQ.0k1Ludxm8__Eo9MkdDUOmg'
  }
};

export default config;
