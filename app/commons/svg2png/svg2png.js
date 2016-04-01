/**
 * Created by Mathmoose on 2016-02-16.
 */

angular.module("twitterShare", [])
  .factory("twitterShareService",['$http', '$q', function($http, $q) {

    return {
      share: function() {
       svg2png($q, 1920, 1080).then(function(res){
         uploadToImgur($http, res);
       }).catch(function(err) {
         console.log(err);
       });

      }
    };
  }]);

/**
 * Creates a base64 png image from svg
 *
 * @param $q
 * @param width
 * @param height
 * @returns {IPromise<T>}
 */
function svg2png($q, width, height) {

  var defer = $q.defer();

  var config = {
    svgId: "visualization"
  };

  var canvas = document.createElement('canvas');
  canvas.id = "canvas1";
  canvas.width = width;
  canvas.height = height;
  document.getElementById('pngcon').appendChild(canvas);

  var svg = document.getElementById(config.svgId);
  var xml = new XMLSerializer().serializeToString(svg);
  var imgSrc = 'data:image/svg+xml;base64,' + btoa(xml);

  var context = canvas.getContext("2d");

  var image = new Image();
  image.src = imgSrc;

  var imageData;

  image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    imageData = canvas.toDataURL();

    if(imageData !== undefined) defer.resolve(imageData);
    else defer.reject("unable to create image data");
  };

  return defer.promise;
}

/**
 * Simply upload a base64 image to imgur and returns the url to the image
 *
 * @param $http
 * @param image
 */
function uploadToImgur($http, image) {
  $http.get('/config/config.json')
    .then(function(res) {
      var config = res.data;

      // We only want what is behind the type definition
      image = image.split(',')[1];

      $http({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: "Client-ID " + config.client_id
        },
        data: {
          image: image,
          type: 'base64'
        }
      }).then(function(res) {
        console.log(res);
      }).catch(function(err) {
        console.log(err);
      })
    });
}


function share()
{

}
