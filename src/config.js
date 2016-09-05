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
  oauthio : {
    publicKey: 'du8nXdQmkjgR3nrfsjHxO07INhk',
    url: 'https://api.datea.io:57',
    api: 'https://api.datea.io:57/api'
  },
  validation : {
    username : {
      minLength : 2,
      maxLength : 30,
    },
    password: {
      minLength : 6,
      maxLength : 32,
      regex : /^(?=.*\d)(?=.*[a-z])(?!.*\s).{6,32}$/
    }
  },
  defaultLocale: 'es'
};

export default config;
