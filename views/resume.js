const { esc, layout } = require('./layout');

function entries(list) {
  return list.map((e) => `
        <div class="entry">
          <div class="entry-head">
            <h3>${esc(e.title)}</h3>
            <span class="entry-years">${esc(e.years)}</span>
          </div>
          <p class="entry-place">${esc(e.place)}</p>
          ${e.note ? `<p class="entry-note">${esc(e.note)}</p>` : ''}
        </div>`).join('');
}

function renderResume({ profile, commit }) {
  const r = profile.resume;
  const certifications = r.certifications || [];

  const skills = r.skills.map((s) => `
        <div class="skill-group">
          <h3>${esc(s.group)}</h3>
          <ul class="tags">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
        </div>`).join('');

  const projects = profile.projects.map((p) => `
        <div class="entry">
          <div class="entry-head">
            <h3>${esc(p.title)}</h3>
            <span class="entry-years">${esc(p.tech.join(', '))}</span>
          </div>
          <p class="entry-note">${esc(p.summary)}</p>
        </div>`).join('');

  const body = `
  <main class="resume">
    <div class="resume-head">
      <div>
        <h1>${esc(profile.name)}</h1>
        <p>${esc(profile.role)}</p>
        <p class="resume-contact">${esc(profile.email)} · ${esc(profile.location)} · <a href="${esc(profile.github)}">GitHub</a> · <a href="${esc(profile.linkedin)}">LinkedIn</a></p>
      </div>
      <button type="button" class="button no-print" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="resume-grid">
      <div>
        <section class="resume-section">
          <h2>Education</h2>${entries(r.education)}
        </section>
        <section class="resume-section">
          <h2>Projects</h2>${projects}
        </section>
        <section class="resume-section">
          <h2>Experience</h2>${entries(r.experience)}
        </section>
      </div>
      <aside>
        <section class="resume-section">
          <h2>Skills</h2>${skills}
        </section>
        ${certifications.length > 0 ? `<section class="resume-section">
          <h2>Certifications</h2>
          <ul class="plain">${certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        </section>` : ''}
        <section class="resume-section">
          <h2>Interests</h2>
          <ul class="plain">${profile.interests.map((i) => `<li>${esc(i.title)}</li>`).join('')}</ul>
        </section>
      </aside>
    </div>
  </main>`;

  return layout({ title: `${profile.name} | Resume`, active: 'resume', profile, commit, body });
}

module.exports = renderResume;
