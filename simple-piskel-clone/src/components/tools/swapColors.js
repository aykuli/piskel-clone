export default function swapHandler(primaryColor, secondaryColor, ctx, refreshLocalStorageValue) {
  const buf = primaryColor.value;
  primaryColor.value = secondaryColor.value; // eslint-disable-line
  secondaryColor.value = buf; // eslint-disable-line
  ctx.fillStyle = primaryColor.value;

  refreshLocalStorageValue('piskelPrimaryColor', primaryColor.value);
  refreshLocalStorageValue('piskelSecondaryColor', secondaryColor.value);
  return [primaryColor.value, secondaryColor.value];
}
