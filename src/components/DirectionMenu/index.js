
export const DirectionMenu = ({ 
  menuParent, 
  setDirection }) => {

  const flexContainer = document.createElement('div');
  flexContainer.style.display = 'flex';
  flexContainer.style.justifyContent = 'space-around';
  flexContainer.style.width = '100vw';
  menuParent.appendChild(flexContainer);

  


  ['TOP', 'RIGHT', 'BOTTOM', 'LEFT'].forEach(item => flexContainer.appendChild(navButton({ label: item })))
  
  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '50px';
    div.style.backgroundColor = 'orange';
    div.style.display = 'flex';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';
    div.innerHTML = label;
    div.onclick = () => onClick({ label });
    return div;
  }

  function onClick ({ label }) {
    setDirection(label);
  }


  return {
    
  }
}