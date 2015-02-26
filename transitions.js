(function(ctx) {

  var oldOpen = ctx.open;
  var oldClose = ctx.close;

  function animateIn(frame) {
    // XXX: Force a sync flush to make sure we get an animation.
    document.body.clientTop;
    document.body.scrollIntoView();

    requestAnimationFrame(() => {
      frame.style.transform = 'translateX(0%)';
      frame.style.opacity = '1';
    });
  }

  /**
   * When the page requests a new frame, instead slide in an iframe.
   */
  ctx.open = function(url) {
    var nextFrame = document.createElement('iframe');
    nextFrame.src = url;

    nextFrame.style.position = 'absolute';
    nextFrame.style.top = '0px';
    nextFrame.style.left = '0';
    nextFrame.style.height = '100%';
    nextFrame.style.width = '100%';
    nextFrame.style.border = '0';
    nextFrame.style.opacity = '0';
    nextFrame.style.zIndex = '100000';
    nextFrame.style.transform = 'translateX(100%)';
    nextFrame.style.transition = 'transform 0.6s ease, opacity 0.3s linear';

    document.body.appendChild(nextFrame);

    animateIn(nextFrame);
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
