import request from 'superagent';

function fetch(url, options = {}, requestLib = request) {

  options = Object.assign({
      method      : 'GET',
      headers     : {},
      body        : {},
      credentials : 'include'
  }, options);

  let req = request(options.method, url);
  // body for POST
  options.body && req.send(options.body);
  // headers
  if (!options.headers.Accept) options.headers.Accept = 'application/json';
  req.set(options.headers);
  // query for GET
  options.query && Object.keys(options.query).length && req.query(options.query);
  // credentials
  options.credentials != 'omit' && req.withCredentials();
  // timeout
  options.timeout && req.timeout(options.timeout);

  // state var
  let state = 'pending';
  let prom = new Promise(function (resolve, reject) {
    req.end((err, res) =>{
        if (!err && [200, 201, 302].indexOf(res.status) !== -1 ) {
          state = 'resolved';
          resolve(res);
        } else {
          state = 'rejected';
          if (err.timeout) {
            res = {
              ok     : false,
              status : 'timeout'
            }
          }
          reject({error: err, response: res});
        }
    });
  });

  return {
    abort : () => {
      state == 'pending' && req.abort();
      state = 'aborted';
    },
    promise  : () => prom,
    state    : () => state,
    then     : (func) => prom.then(func), // should we do this?
    catch    : (func) => prom.catch(func) // ^ ^ ^ ^
  };
};

fetch.post = function (url, params = {}, options = {}) {
  let opts = Object.assign(options, {body : params, method: 'POST'});
  return fetch(url, opts);
}

fetch.put = function (url, params = {}, options = {}) {
  let opts = Object.assign(options, {body : params, method: 'PUT'});
  return fetch(url, opts);
}

fetch.get = function (url, query = {}, options = {}) {
  let opts = Object.assign(options, {query: query});
  return fetch(url, opts);
}

fetch.delete = function (url, query = {}, options = {}) {
  let opts = Object.assign(options, {body : query, method: 'DELETE'});
  return fetch(url, opts);
}


export default fetch
