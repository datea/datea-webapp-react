import allowedTypes from './upload-mimetypes';
export * from './marker';

const config = {
  app: {
    name : 'datea',
    //url  : 'http://datea.pe',
    url : 'http://127.0.0.1:9000'
  },
	api : {
		//url    : 'https://api.datea.io/api/v2/',
		//imgUrl : 'http://api.datea.io'
		url    : 'http://127.0.0.1:8000/api/v2/',
		imgUrl : 'http://127.0.0.1:8000'
	},

  facebookAppId: '222271061161837',

  validation : {
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
  map : {
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
  keys: {
    google: 'AIzaSyBqMKdCCMaxkAouJ3DhxWuH7Dbhho0Uw8U',
    mapbox : 'pk.eyJ1IjoicmRlcnRlYW5vIiwiYSI6ImNqZW9jMDZpczByOGcyeW12bmhpeXk4OXoifQ.0k1Ludxm8__Eo9MkdDUOmg'
  }
};

export default config;
