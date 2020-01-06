export default function clearSession() {
  localStorage.removeItem('piskelImg');
  localStorage.removeItem('piskelPrimaryColor');
  localStorage.removeItem('piskelSecondaryColor');
  localStorage.removeItem('piskelTool');
  localStorage.removeItem('piskelFps');
  localStorage.removeItem('piskelCounter');
  location.reload();
}
