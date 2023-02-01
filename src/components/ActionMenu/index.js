
export const ActionMenu = ({ 
  menuParent, 
  clipActionsMap,
  setClipAction }) => {

  const flexContainer = document.createElement('div');
    flexContainer.style.position = 'absolute';
  flexContainer.style.display = 'flex';
  flexContainer.style.justifyContent = 'space-around';
  flexContainer.style.width = '100vw';
  flexContainer.style.marginTop = '5vh';
  menuParent.appendChild(flexContainer);


  for (const [key, value] of clipActionsMap.entries()) {
    flexContainer.appendChild(navButton({ label: key }));
  }

  
  function navButton ({ label }) {
    const div = document.createElement('div');
    div.style.width = '50px';
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
    setClipAction(label);
  }


  return {
    
  }
}