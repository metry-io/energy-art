/**
 * Created by Mathmoose on 2016-02-16.
 */

angular.module("twitterShare", [])
  .factory("twitterShareService", ['$http', '$q', '$location', function ($http, $q, $location) {

    var width = 0;
    var height = 0;

    function getWidth() {
      return width;
    }

    function getHeight() {
      return height;
    }

    return {
      share: function () {
        svg2png($q, getWidth(), getHeight()).then(function (res) {
          return uploadToImgur($http, res);
        }).then(function (res) {
            var a = document.getElementById("twitterShare");
          a.id="tempTwitter";
            a.href = "https://twitter.com/intent/tweet?url=" + encodeURI(res);
            document.body.appendChild(a);
            document.getElementById("tempTwitter").click();
          })
          .catch(function (err) {
            console.log(err);
          });

      },
      setDimensions: function (w, h) {
        width = w;
        height = h;
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

  var svg = document.getElementById(config.svgId);
  var canvas = document.createElement('canvas');
  canvas.id = "canvas1";
  canvas.width = width;
  canvas.height = height;
  document.getElementById('pngcon').appendChild(canvas);

  var xml = new XMLSerializer().serializeToString(svg);
  var imgSrc = 'data:image/svg+xml;base64,' + btoa(xml);

  var context = canvas.getContext("2d");


  var image = new Image();
  image.src = imgSrc;

  var imageData;

  image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000000";
    imageData = canvas.toDataURL();

    if (imageData !== undefined) defer.resolve(imageData);
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
  return $http.get('/config/config.json')
    .then(function (res) {
      return res.data;
    })
    .then(function (config) {
      // We only want what is behind the type definition
      image = image.split(',')[1];

      return $http({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: "Client-ID " + config.client_id
        },
        data: {
          image: image,
          type: 'base64'
        }
      }).then(function (res) {
        return "http://i.imgur.com/" + res.data.data.id;
      }).catch(function (err) {
        console.log(err);
      })
    });
}


function share() {

}
