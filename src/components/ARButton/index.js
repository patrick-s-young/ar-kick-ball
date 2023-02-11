export const ARButton = () => {
  const arButton = document.createElement('button');
  arButton.setAttribute( 'width', 38 );
  arButton.setAttribute( 'height', 38 );
  arButton.style.width = '20vw';
  arButton.style.height = '10vh';
  arButton.style.marginLeft = '40vw';
  arButton.style.marginTop = '40vh';
  document.body.appendChild(arButton);

  const setVisible = (isVisible) => arButton.style.display = isVisible ? 'block' : 'none';

  return {
    get self() { return arButton },
    setVisible
  }
}
    