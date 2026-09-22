// Preserve links shared before the sections became separate pages.
function redirectLegacySection() {
  const page = { '#proposed': 'proposed.html', '#sequence': 'sequence.html' }[window.location.hash];
  if (page) window.location.replace(new URL(page, window.location.href));
}
redirectLegacySection();
window.addEventListener('hashchange', redirectLegacySection);
