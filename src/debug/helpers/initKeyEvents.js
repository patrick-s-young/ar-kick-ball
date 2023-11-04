import { KeyEvents } from '@debug';

const keyEvents = new KeyEvents();

export const initKeyEvents = ({
  mesh
}) => {
  keyEvents.addTimeOutAction({
    timeoutDuration: 500,
    timeoutCallback: () => mesh.setClipAction('Idle')
  })
  keyEvents.addSubscriber({ 
    keyName: 'ArrowUp', 
    keyAction: 'keydown', 
    callBack: () => { 
      mesh.setDirection(0); 
      mesh.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowRight', 
    keyAction: 'keydown', 
    callBack: () => { 
      mesh.setDirection(-Math.PI/2); 
      mesh.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowDown', 
    keyAction: 'keydown', 
    callBack: () => { 
      mesh.setDirection(Math.PI); 
      mesh.setClipAction('Walk'); }
    });
  keyEvents.addSubscriber({ 
    keyName: 'ArrowLeft', 
    keyAction: 'keydown', 
    callBack: () => { 
      mesh.setDirection(Math.PI/2); 
      mesh.setClipAction('Walk'); }
    });

}