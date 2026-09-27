// Escapes text so that anything typed by a visitor is shown as text, never run as HTML
function esc(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (ch) => map[ch]);
}

function layout({ title, active, profile, commit, body }) {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' class="active" aria-current="page"' : ''}>${label}</a>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(profile.name)} - ${esc(profile.role)}">
  <title>${esc(title)}</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header class="topbar">
    <div class="topbar-inner">
      <a class="brand" href="/"><span class="brand-prompt">~/</span>${esc(profile.handle)}</a>
      <nav aria-label="Main">
        ${link('/#about', 'About', 'about')}
        ${link('/#projects', 'Projects', 'projects')}
        ${link('/resume', 'Resume', 'resume')}
        ${link('/#guestbook', 'Guestbook', 'guestbook')}
      </nav>
    </div>
  </header>
${body}
  <footer class="site-footer">
    <div class="footer-inner">
      <span>&copy; ${new Date().getFullYear()} ${esc(profile.name)}</span>
      <span class="build"><span class="dot" aria-hidden="true"></span>deployed commit <code id="commit">${esc(commit)}</code></span>
    </div>
  </footer>
</body>
</html>`;
}

module.exports = { esc, layout };
