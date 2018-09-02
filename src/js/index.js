window.onload = function() {
  var canvas,
    ctx,
    nodes,
    links,
    dragNode,
    dragPoint;

  fetch("data.json")
    .then(response => response.json())
    .then(json => {
      nodes = json.nodes;
      links = json.links;
      render();
      if (check()) {
        console.log(false);
      } else {
        console.log(true);
      }
    });

  canvas = document.getElementById('viewport');
  ctx = canvas.getContext('2d');

   function render() {
    ctx.fillStyle = "#f3f3f3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    links.forEach(function(link) {
      let i0 = link[0],
          i1 = link[1];
      ctx.fillStyle = "#000";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nodes[i0].x, nodes[i0].y);
      ctx.lineTo(nodes[i1].x, nodes[i1].y);
      ctx.stroke();
      ctx.closePath();
    });

    nodes.forEach(function(node, index) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      ctx.fillStyle= '#000';
      ctx.fill();
      ctx.fillStyle= '#fff';
      ctx.font = "italic 30pt Arial";
      ctx.fillText(index, node.x - 15, node.y + 15);
      ctx.closePath();
    });
  };

  function getMousePosFromEvent(evt) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  function getNodeByPos(pos) {
    let result;
    nodes.forEach(function(node) {
      var halfWidth = 15,
        halfHeight = 15;
      if ((pos.x >= node.x - halfWidth) && (pos.x < node.x + halfWidth) && (pos.y >= node.y - halfHeight) && (pos.y < node.y + halfHeight)) {
        result = node;
      }
    });
    return result;
  };

  function check() {
    return links.some(function(link) {
      var i0 = link[0],
          i1 = link[1],
          p1 = nodes[i0],
          p2 = nodes[i1];
        return links.some(function(link1) {
          if (link1 != link) {
            var j0 = link1[0],
                j1 = link1[1],
                p3 = nodes[j0],
                p4 = nodes[j1];
            return checkIntersectionOfTwoLineSegments(p1, p2, p3, p4);
          }
        });
    });
  }

  function checkIntersectionOfTwoLineSegments(p1, p2, p3, p4) {
    let tmp;
    if (p2.x < p1.x) {
        tmp = p1;
        p1 = p2;
        p2 = tmp;
    }

    if (p4.x < p3.x) {
        tmp = p3;
        p3 = p4;
        p4 = tmp;
    }

    if (p2.x < p3.x) {
        return false;
    }

    if((p1.x - p2.x == 0) && (p3.x - p4.x == 0)) {
        if(p1.x == p3.x) {
            if (!((Math.max(p1.y, p2.y) < Math.min(p3.y, p4.y)) || (Math.min(p1.y, p2.y) > Math.max(p3.y, p4.y)))) {
                return true;
            }
        }
        return false;
    }

    if (p1.x - p2.x == 0) {
        var Xa = p1.x;
        var A2 = (p3.y - p4.y) / (p3.x - p4.x);
        var b2 = p3.y - A2 * p3.x;
        var Ya = A2 * Xa + b2;
        if (p3.x <= Xa && p4.x >= Xa && Math.min(p1.y, p2.y) <= Ya &&
                Math.max(p1.y, p2.y) >= Ya) {
            return true;
        }
        return false;
    }

    if (p3.x - p4.x == 0) {
        var Xa = p3.x;
        var A1 = (p1.y - p2.y) / (p1.x - p2.x);
        var b1 = p1.y - A1 * p1.x;
        var Ya = A1 * Xa + b1;
        if (p1.x <= Xa && p2.x >= Xa && Math.min(p3.y, p4.y) <= Ya && Math.max(p3.y, p4.y) >= Ya) {
          return true;
        }
        return false;
    }

    var A1 = (p1.y - p2.y) / (p1.x - p2.x);
    var A2 = (p3.y - p4.y) / (p3.x - p4.x);
    var b1 = p1.y - A1 * p1.x;
    var b2 = p3.y - A2 * p3.x;

    if (A1 == A2) {
        return false;
    }

    var Xa = (b2 - b1) / (A1 - A2);

    if ((Xa-0.001< Math.max(p1.x, p3.x)) || (Xa+0.001 > Math.min( p2.x, p4.x))) {
        return false;
    } else {
        return true;
    }
  }

  canvas.addEventListener('mousedown', function(event) {
    var pos = getMousePosFromEvent(event);
    dragNode = getNodeByPos(pos);
    if (dragNode !== undefined) {
      dragPoint = {
        x: pos.x - dragNode.x,
        y: pos.y - dragNode.y
      }
    }
  }, false);

  canvas.addEventListener('mouseup', function() {
    dragNode = undefined;
    if (check()) {
      console.log(false);
    } else {
      console.log(true);
    }
  }, false);

  canvas.addEventListener('mousemove', function(event) {
    var pos;
    if (dragNode !== undefined) {
      pos = getMousePosFromEvent(event);
      dragNode.x = pos.x - dragPoint.x;
      dragNode.y = pos.y - dragPoint.y;
      render();
    }
  }, false);
};
