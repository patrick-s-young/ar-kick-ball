import { App } from './App';
import { DebugApp } from './DebugApp';
  document.addEventListener("DOMContentLoaded", () => {
  const app = DebugApp(); //App();
  window.app = app;
});