const { layout } = require('./layout');

function renderNotFound({ profile, commit }) {
  const body = `
  <main>
    <section class="not-found">
      <p class="kicker">404</p>
      <h1>This page doesn't exist.</h1>
      <p>The link may be broken, or the page may have moved.</p>
      <a class="button" href="/">Back to home</a>
    </section>
  </main>`;

  return layout({ title: 'Page not found', active: '', profile, commit, body });
}

module.exports = renderNotFound;
