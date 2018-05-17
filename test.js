const request = require('request')


request.get('file://Users/voidsky/Desktop/aboutme.html', function (err, res, body) {
  if(err){
    console.log(err);
  }
  if (!err) {
    console.log(body);
  }
});
