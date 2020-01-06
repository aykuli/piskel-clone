function swapHandler(primaryColor, secondaryColor, ctx, refreshLocalStorageValue) {
  const buf = primaryColor.value;
  primaryColor.value = secondaryColor.value;
  secondaryColor.value = buf;
  ctx.fillStyle = primaryColor.value;

  refreshLocalStorageValue('piskelPrimaryColor', primaryColor.value);
  refreshLocalStorageValue('piskelSecondaryColor', secondaryColor.value);
}

export { swapHandler };
