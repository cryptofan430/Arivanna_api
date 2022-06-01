'use strict';

module.exports.bye = async function(event) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(
      {
        message: 'bye World!',// this is the return response. PUT YOUR RETURN DATA HERE
        params: event.queryStringParameters,//this doesnt apear required 
        secret: process.env.A_VARIABLE// this appears required
      },
      null,
      2
    ),
  };
};

module.exports.hello = async function(event) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        message: 'hello World!',
        params: event.queryStringParameters,
        secret: process.env.A_VARIABLE
      },
      null,
      2
    ),
  };
};