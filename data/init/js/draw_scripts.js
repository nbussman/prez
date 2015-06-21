(function() {
  var App;
  App = {
    fillStyle: "solid",
    strokeStyle: "#ECD018",
    lineWidth: 3,
    lineCap :"round"
  };
  /*
    Init 
  */
  App.init = function() {
    App.socket = io.connect('http://localhost:4000');
    App.socket.on('draw', function(data) {
      console.log(data);
      return App.draw(data.elem, data.x, data.y, data.type);
    });
    App.draw = function(elem, x, y, type) {
      if (!elem)
        return false;
      ctx =  document.getElementById(elem).getContext("2d");
      console.log("x:"+x+" y:"+y+" type:"+type);
      ctx.fillStyle = App.fillStyle;
      ctx.strokeStyle = App.strokeStyle;
      ctx.lineWidth = App.lineWidth;
      ctx.lineCap = App.lineCap;

      if (type === "dragstart") {
        ctx.beginPath();
        return ctx.moveTo(x, y);
      } else if (type === "drag") {
        ctx.lineTo(x, y);
        return ctx.stroke();
      } else {
        return ctx.closePath();
      }
    };
  };
  /*
    Draw Events
  */

  $('canvas').live('drag dragstart dragend',function(e) {
    var offset, type, x, y;
    type = e.handleObj.type;

    elem = $(this).attr("id");
    offset = $(this).offset();
    e.offsetX = e.layerX - offset.left;
    e.offsetY = e.layerY - offset.top;

    x = e.offsetX;
    y = e.offsetY;
    App.draw(elem ,x, y, type);
    App.socket.emit('drawClick', {
      elem: elem,
      x: x,
      y: y,
      type: type
    });
  });
  $(function() {
    return App.init();
  });
}).call(this);
