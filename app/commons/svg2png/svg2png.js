/**
 * Created by Mathmoose on 2016-02-16.
 */

angular.module("twitterShare", [])

  .factory("twitterShareService", function() {
    return {
      share: share,
      svg2png: svg2png
    };
  });

/*
  Converts svg to png and return the data url

  TODO: return only data url from svg2png and create a function that
  uploads this to some API form image store. Then simply share this on twitter

 */
function svg2png(width, height) {

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
    imageData = canvas.toDataURL("image/png");

    var a = document.createElement("a");
    a.id = "imagepng";
    a.innerHTML = "outputfile";
    a.href = imageData;
    a.download = "char.png";
    document.body.appendChild(a);
    document.getElementById("imagepng").click();

  }

}

function share()
{

}
