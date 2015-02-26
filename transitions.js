(function(ctx) {

  var oldOpen = ctx.open;

  /**
   * When the page requests a new frame, instead slide in an iframe.
   */
  ctx.open = function(url) {
    var nextFrame = document.createElement('iframe');
    nextFrame.src = url;
    document.body.appendChild(nextFrame);

    nextFrame.style.position = 'absolute';
    nextFrame.style.top = '0px';
    nextFrame.style.height = '100%';
    nextFrame.style.width = '100%';
    nextFrame.style.border = '0';
    nextFrame.style.zIndex = '100000';
  };

  /**
   * Message to the parent to close the current frame.
   */
  ctx.close = function() {
    parent.window.postMessage({action: 'removeframe', pathname: location.pathname}, '*');
  };

  ctx.addEventListener('message', e => {
    if (e.data.action === 'removeframe') {
      // Find the frame and remove it.
      var frame = document.querySelector('iframe[src^="' + e.data.pathname + '"]');
      frame.parentNode.removeChild(frame);
    }
  }, false);

}(window));
