import { NaiveBroadphase } from "cannon-es";

export const DirectionMenu = ({ 
  menuParent, 
  setDirection }) => {

  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'inline';
  flexContainer.style.position = 'absolute';
  flexContainer.style.width = '100vw';
  flexContainer.style.marginTop = '70vh';
  flexContainer.style.justifyContent = 'center';
  menuParent.appendChild(flexContainer);

  


  [
    'spacer', 'TOP', 'spacer',
    'LEFT', 'spacer', 'RIGHT',
    'spacer', 'BOTTOM', 'spacer'].forEach(item => flexContainer.appendChild(navButton({ label: item })))
  
  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.width = '33%';
    div.style.height = '16vw';
    div.style.backgroundColor = label === 'spacer' ? undefined : 'orange';
    div.style.display = 'inline-block';
    div.style.textAlign = 'center';
    div.innerHTML = label === 'spacer' ? '&nbsp;' : label;
    div.onclick = label === 'spacer' ? undefined : () => onClick({ label });
    return div;
  }

  function onClick ({ label }) {
    setDirection(label);
  }


  return {
    
  }
}