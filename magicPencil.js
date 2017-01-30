var Pencil, ToolWithStroke, createShape,

createShape = LC.createShape;
console.log("yo script ran");

var Magic =  function(lc, msPaint) {
  console.log("yo pencil created");
  this.eventTimeThreshold = 10;
  this.msPaint = msPaint;

  return {
    name: 'Magic',
    iconName: 'line',
    makePoint: function(x, y, lc){
      return LC.createShape('Point',{
        x: x,
      y: y,
      size: this.strokeWidth,
      color: this.color
      })
    },
    didBecomeActive: function(lc){
        this.color = lc.getColor('primary');
      this.currentShape = LC.createShape('LinePath');
    },
    begin: function (x, y, lc) {
      this.color = lc.getColor('primary');
      this.currentShape = LC.createShape('LinePath');
      this.currentShape.addPoint(this.makePoint(x, y, lc));
      return this.lastEventTime = Date.now();
    },

    continue: function (x, y, lc) {
      console.log("aaaa");
      var timeDiff;
      timeDiff = Date.now() - this.lastEventTime;
      if (timeDiff > this.eventTimeThreshold) {
        this.lastEventTime += timeDiff;
        this.currentShape.addPoint(this.makePoint(x, y, lc));
        return lc.drawShapeInProgress(this.currentShape);
      }
    },

    end: function (x, y, lc) {
      var shapeData = {
        strokeWidth: this.strokeWidth,
        color: this.color,
      };
      var lp = [];
      for (var i = 0; i < this.currentShape.points.length(); i++) {
      }
      this.msPaint
      console.log("shape ended");
      lc.saveShape(this.currentShape);
      return this.currentShape = void 0;
    },
    willBecomeInactive: function(lc){
      console.log("uuuh");
    }


  }
}

