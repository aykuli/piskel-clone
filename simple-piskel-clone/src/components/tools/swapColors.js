function swapHandler(primaryColor, secondaryColor, ctx) {
  const buf = primaryColor;
  primaryColor = secondaryColor;

  secondaryColor = buf;
  ctx.fillStyle = primaryColor;
  localStorage.removeItem('piskelPrimaryColor');
  localStorage.setItem('piskelPrimaryColor', primaryColor);
  localStorage.removeItem('piskelSecondaryColor');
  localStorage.setItem('piskelSecondaryColor', secondaryColor);
}

export { swapHandler };
