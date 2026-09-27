const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const profile = require('../data/profile');

let server;
let base;

// Start the app on a random free port before the tests and stop it afterwards
before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    base = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

function postMessage(fields) {
  return fetch(`${base}/messages`, {
    method: 'POST',
    body: new URLSearchParams(fields),
    redirect: 'manual',
  });
}

test('GET /health returns status ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('home page shows my name and projects', async () => {
  const res = await fetch(`${base}/`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.ok(html.includes(profile.name));
  assert.ok(html.includes(profile.projects[0].title));
});

test('resume page loads', async () => {
  const res = await fetch(`${base}/resume`);
  assert.equal(res.status, 200);
  assert.ok((await res.text()).includes('Education'));
});

test('GET /api/projects returns the project list as JSON', async () => {
  const res = await fetch(`${base}/api/projects`);
  assert.equal(res.status, 200);
  const list = await res.json();
  assert.ok(Array.isArray(list));
  assert.equal(list.length, profile.projects.length);
});

test('valid guestbook message is saved', async () => {
  const res = await postMessage({ name: 'Asha', visitorType: 'Classmate', message: 'Nice website!' });
  assert.equal(res.status, 302);
  const messages = await (await fetch(`${base}/api/messages`)).json();
  const last = messages[messages.length - 1];
  assert.equal(last.name, 'Asha');
  assert.equal(last.visitorType, 'Classmate');
});

test('invalid guestbook message is rejected with 400', async () => {
  const res = await postMessage({ name: '', message: 'hi' });
  assert.equal(res.status, 400);
});

test('unknown visitor type is rejected with 400', async () => {
  const res = await postMessage({ name: 'Ravi', visitorType: 'Alien', message: 'Hello there!' });
  assert.equal(res.status, 400);
});

test('HTML typed into the form is escaped, not executed', async () => {
  await postMessage({ name: 'Tester', visitorType: 'Other', message: '<script>alert(1)</script>' });
  const html = await (await fetch(`${base}/`)).text();
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

test('unknown page returns 404', async () => {
  const res = await fetch(`${base}/does-not-exist`);
  assert.equal(res.status, 404);
});
