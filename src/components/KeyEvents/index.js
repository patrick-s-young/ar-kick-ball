// SUBSCRIBE TO KEYBOARD INPUTS
export function KeyEvents () {
  this.subscribers = {
    keydown: {},
    keyup: {}
  }
  this.addSubscriber = this.addSubscriber.bind(this);
  this.onKeyDown = this.onKeyDown.bind(this);
  this.onKeyUp = this.onKeyUp.bind(this);
  this.keyState = {};
  this.timeoutId;
  this.timeoutDuration;
  this.timeoutCallback;
  document.addEventListener('keydown', this.onKeyDown);
  document.addEventListener('keyup', this.onKeyUp);
}
KeyEvents.prototype.addTimeOutAction = function({
  timeoutDuration,
  timeoutCallback
}) {
  this.timeoutDuration = timeoutDuration;
  this.timeoutCallback = timeoutCallback;
}

KeyEvents.prototype.addSubscriber = function ({
  keyName,
  keyAction,
  callBack
  }) {
    if (this.subscribers[keyAction][keyName] === undefined) {
      this.subscribers[keyAction][keyName] = [callBack];
    } else {
      this.subscribers[keyAction][keyName].push(callBack);
    }
    this.keyState[keyName] = 'keyup';
}

KeyEvents.prototype.onKeyDown = function ({ code:keyName }) {
  if (this.subscribers.keydown[keyName] === undefined) return;
  this.subscribers.keydown[keyName].forEach(callBack => callBack());
  clearTimeout(this.timeoutId);
}

KeyEvents.prototype.onKeyUp = function ({ code:keyName }) {
  this.timeoutId = setTimeout(() => this.timeoutCallback(), this.timeoutDuration);
}

