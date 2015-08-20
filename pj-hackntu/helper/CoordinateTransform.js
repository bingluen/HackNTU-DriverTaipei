var Proj4 = require('proj4');

var CoordinateTransforms = {
  Proj_WGS84: new Proj4.Proj('WGS84'),
  // For 台灣本島用，不適用澎湖
  Proj_TW97: new Proj4.Proj("+title=TWD97 TM2+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=公尺 +no_defs"),
  TW97_WGS84: function(x, y) {
    var PointSource = new Proj4.toPoint(new Array(x, y));
    var PointDest = Proj4.transform(this.Proj_TW97, this.Proj_WGS84, PointSource);
    return PointDest;
  },
  WGS84_TW97: function(x, y) {
    var PointSource = new Proj4.toPoint(new Array(x, y));
    var PointDest = Proj4.transform(this.Proj_WGS84, this.Proj_TW97, PointSource);
    return PointDest;
  }
}


module.exports = CoordinateTransforms;
