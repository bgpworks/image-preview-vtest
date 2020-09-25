const potrace = require("potrace");
const fs = require("fs");

module.exports = function traceSvg(filePath, traceParams) {
  return new Promise(function (resolve, reject) {
    var trace = new Potrace(traceParams);

    trace.loadImage(filePath, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(trace.getSVG());
      }
    });
  });
};

function traceSvg(filePath, traceParams) {
  return new Promise(function (resolve, reject) {
    var trace = new Potrace(traceParams);

    trace.loadImage(filePath, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(trace.getSVG());
      }
    });
  });
}
