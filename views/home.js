const { esc, layout } = require('./layout');

function formatTime(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderHome({ profile, commit, messages, visitorTypes, errors, form, posted }) {
  const firstName = profile.name.split(' ')[0];

  const interests = profile.interests.map((item) => `
        <li class="interest">
          <span class="interest-icon" aria-hidden="true">${esc(item.icon)}</span>
          <div>
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.detail)}</p>
          </div>
        </li>`).join('');

  const projects = profile.projects.map((p) => `
        <article class="project">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <ul class="tags">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener">View source &rarr;</a>` : '<span class="project-link muted">Private repository</span>'}
        </article>`).join('');

  const errorBox = errors.length > 0
    ? `<div class="alert alert-error" role="alert">${errors.map((e) => `<p>${esc(e)}</p>`).join('')}</div>`
    : '';

  const successBox = posted
    ? '<div class="alert alert-success" role="status"><p>Thanks for signing the guestbook!</p></div>'
    : '';

  const options = visitorTypes.map((v) =>
    `<option value="${esc(v)}"${form.visitorType === v ? ' selected' : ''}>${esc(v)}</option>`).join('');

  const messageList = messages.length === 0
    ? '<p class="empty">No messages yet. Be the first to sign the guestbook.</p>'
    : `<ul class="messages">${messages.map((m) => `
          <li class="message">
            <div class="avatar" aria-hidden="true">${esc(m.name.charAt(0).toUpperCase())}</div>
            <div>
              <p class="message-meta"><strong>${esc(m.name)}</strong><span class="badge">${esc(m.visitorType)}</span><time datetime="${esc(m.postedAt)}">${esc(formatTime(m.postedAt))}</time></p>
              <p class="message-text">${esc(m.message)}</p>
            </div>
          </li>`).join('')}
        </ul>`;

  const body = `
  <main>
    <section class="hero">
      <div class="hero-text">
        <p class="kicker">Hi, I'm ${esc(firstName)} 👋</p>
        <h1>${esc(profile.name)}</h1>
        <p class="role">${esc(profile.role)} · ${esc(profile.location)}</p>
        <p class="tagline">${esc(profile.tagline)}</p>
        <div class="actions">
          <a class="button" href="/resume">View resume</a>
          <a class="button button-ghost" href="mailto:${esc(profile.email)}">Email me</a>
        </div>
        <ul class="socials">
          <li><a href="${esc(profile.github)}" target="_blank" rel="noopener">GitHub</a></li>
          <li><a href="${esc(profile.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></li>
        </ul>
      </div>
    </section>

    <section id="about" class="section">
      <h2>About me</h2>
      <div class="about-grid">
        <div class="about-text">
          ${profile.about.map((para) => `<p>${esc(para)}</p>`).join('')}
        </div>
        <dl class="facts">
          <div><dt>Studying at</dt><dd>${esc(profile.university)}</dd></div>
          <div><dt>Based in</dt><dd>${esc(profile.location)}</dd></div>
          <div><dt>Open to</dt><dd>${esc(profile.openTo)}</dd></div>
        </dl>
      </div>
    </section>

    <section id="interests" class="section">
      <h2>What I'm into</h2>
      <ul class="interests">${interests}
      </ul>
    </section>

    <section id="projects" class="section">
      <h2>Projects <span class="count">${profile.projects.length}</span></h2>
      <div class="projects">${projects}
      </div>
    </section>

    <section class="section resume-cta">
      <div>
        <h2>Resume</h2>
        <p>Education, skills, experience and certifications on one printable page.</p>
      </div>
      <a class="button" href="/resume">Open resume</a>
    </section>

    <section id="guestbook" class="section">
      <h2>Guestbook <span class="count">${messages.length}</span></h2>
      <p class="section-intro">Visited my site? Leave a note below. Every message is also available as JSON at <a href="/api/messages"><code>/api/messages</code></a>.</p>
      <div class="guestbook">
        <form method="POST" action="/messages" class="guest-form" novalidate>
          ${successBox}
          ${errorBox}
          <label>Your name
            <input name="name" value="${esc(form.name || '')}" maxlength="40" placeholder="e.g. Asha Patil" autocomplete="name">
          </label>
          <label>You are a
            <select name="visitorType">${options}</select>
          </label>
          <label>Message
            <textarea name="message" rows="4" maxlength="300" placeholder="Say hello, give feedback, or share an idea">${esc(form.message || '')}</textarea>
          </label>
          <button type="submit" class="button">Sign guestbook</button>
        </form>
        <div class="guest-list">${messageList}
        </div>
      </div>
    </section>
  </main>`;

  return layout({ title: `${profile.name} | Profile`, active: 'home', profile, commit, body });
}

module.exports = renderHome;
