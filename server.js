const app = require('./app');

// Render (and most hosts) tell the app which port to use through PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Profile site running on http://localhost:${PORT}`);
});
