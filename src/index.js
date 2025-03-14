import TemplatePrueba from '@templates/TemplatePrueba.js';
import '@styles/main.css';

(async function App() {
  const main = null || document.getElementById('main');
  main.innerHTML = await TemplatePrueba();
})();