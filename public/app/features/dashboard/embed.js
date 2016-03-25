(function() {
  'use strict';

  var GE = window.GrafanaEmbed || {};
  var dashboard = document.getElementById('grafana-dashboard');
  var iframe = document.createElement('iframe');

  ['grafanaUrl', 'embedUrl', 'dashnav'].forEach(function(i) {
    if (window[i]) { GE[i] = GE[i] || window[i]; }
  });

  var queryParams = GE.queryParams || {};

  queryParams.embed = true;

  if (GE.embedUrl) {
    queryParams.embed_url = encodeURIComponent(GE.embedUrl);
  }

  var src = GE.grafanaUrl + '/dashboard/db/' + GE.dashboard;
  var keys = Object.keys(queryParams);
  if (keys.length > 0) {
    src += "?";

    for (var i=0; i<keys.length; i++) {
      if (i > 0) { src += "&"; }

      var k = keys[i];
      src += k + "=" + queryParams[k];
    }
  }

  iframe.src = src;
  iframe.id = 'grafana-embed-frame';
  iframe.width = "100%";
  iframe.height = "0px";
  iframe.frameBorder = "0";
  iframe.scrolling = "no";

  dashboard.appendChild(iframe);

  // Thanks http://amendsoft-javascript.blogspot.ca/2010/04/find-x-and-y-coordinate-of-html-control.html
  function findPosY(obj)
  {
    var top = 0;
    if(obj.offsetParent)
    {
      while(1)
      {
        top += obj.offsetTop;
        if(!obj.offsetParent) {
          break;
        }
        obj = obj.offsetParent;
      }
    }
    else if(obj.y)
    {
      top += obj.y;
    }
    return top;
  }

  function postMessageReceived(e) {
    if (!e) { return; }
    if (GE.grafanaUrl.indexOf(e.origin) === -1) { return; }

    if (e.data) {
      if (e.data.type === 'grafana-resize' && e.data.height) {
        iframe.height = e.data.height + "px";
      }

      if (e.data.type === 'grafana-scroll' && e.data.top) {
        // find iframe offset
        var destY = findPosY(iframe) + e.data.top;
        window.scrollTo(0, destY);
      }
    }
  }
  window.addEventListener('message', postMessageReceived, false);

})();
