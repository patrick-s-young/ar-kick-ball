

export function XRManager({ 
  startButton,
  onReady
}) {

  let xrSession;

  if ('xr' in window.navigator) {
    console.log('xr detected')
  } else {
    return console.log('no xr')
  }

  if ('xr' in window.navigator) {
    startButton.obj.addEventListener('click', onClickArButton);
    navigator.xr.isSessionSupported('immersive-ar')
      .then(isSupported => startButton.disabled = !isSupported);
  }


  function onClickArButton () {
    if (!xrSession) {
      navigator.xr.requestSession('immersive-ar', { requiredFeatures: [ 'hit-test'], optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body }})
        .then(session => onSessionStart(session));
    } else {
      xrSession.end()
        .then(() => onSessionEnd());
    }
  }
 

  const onSessionStart = async (session) => {
    xrSession = session;
    startButton.setVisible(false);
    onReady();
  }

  const onSessionEnd = () => {
    console.log('onSessionEnd')
  }

  return {
    get obj() { return xrSession },
    get xrSession() { return xrSession}
  }
}