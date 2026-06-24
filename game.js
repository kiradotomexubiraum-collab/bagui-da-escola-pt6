// ── Títulos dinâmicos por cena ──
const titles = {
  'capa':          'Ecos do Abismo',
  'scene-1':       'Ecos do Abismo | O Cruzamento',
  'scene-2':       'Ecos do Abismo | A Câmara',
  'scene-3':       'Ecos do Abismo | A Revelação',
  'scene-4':       'Ecos do Abismo | Portal do Eco',
  'scene-final':   'Ecos do Abismo | Epílogo',
  'scene-secreto': '★ Ecos do Abismo | A Origem ★'
};

// ── Três mensagens sorteadas no final normal ──
const endingMsgs = [
  "Você emerge sob um céu cor de âmbar. O vento carrega pó antigo e o cheiro de algo que, talvez, você um dia já amou. Nunca saberá o que ficou para trás — e talvez seja melhor assim.",
  "A luz bate nos seus olhos como uma acusação. Você sobreviveu. Mas a sombra do Abismo ainda pulsa no seu peito, suave, como um segundo coração que não era seu e agora é.",
  "O portal fecha-se atrás de você com um som de pedra sobre pedra. No silêncio que resta, você percebe: saiu, mas algo no Abismo aprendeu a andar com seus passos."
];

// ── Estado do jogo ──
let choices = {};  // registra as escolhas feitas pelo jogador
let history = [];  // pilha de navegação para o botão Voltar

// ──────────────────────────────────────────────
// Registra uma escolha e navega para a próxima cena
// code  → identificador da escolha (ex: 'A2', 'B3')
// next  → id da cena de destino
// prev  → id da cena atual (entra no histórico)
// ──────────────────────────────────────────────
function choose(code, next, prev) {
  choices[code] = true;
  goTo(next, prev);
  if (next === 'scene-4') updateSecretButton();
}

// ──────────────────────────────────────────────
// Navega para uma cena pelo id
// ──────────────────────────────────────────────
function goTo(sceneId, fromId) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  document.getElementById(sceneId).classList.add('active');

  if (fromId) history.push(fromId);
  if (titles[sceneId]) document.title = titles[sceneId];
  if (sceneId === 'scene-final') setEndingMsg();
  if (sceneId === 'scene-4') updateSecretButton();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────
// Lê o atributo data-voltar do botão e navega de volta
// ──────────────────────────────────────────────
function goBack(btn) {
  const prev = btn.getAttribute('data-voltar');
  if (prev) goTo(prev, null);
  else if (history.length > 0) goTo(history.pop(), null);
}

// ──────────────────────────────────────────────
// Sorteia uma das três mensagens de encerramento
// ──────────────────────────────────────────────
function setEndingMsg() {
  const idx = Math.floor(Math.random() * endingMsgs.length);
  document.getElementById('ending-random').textContent = endingMsgs[idx];
}

// ──────────────────────────────────────────────
// LÓGICA DO FINAL SECRETO
// O botão secreto só aparece se o jogador:
//   → escolheu o DIÁRIO na cena 2  (registra choices['A2'])
//   → investigou A ORIGEM na cena 3 (registra choices['B3'])
// Ambas precisam ser verdadeiras ao mesmo tempo.
// ──────────────────────────────────────────────
function updateSecretButton() {
  const unlocked = choices['A2'] && choices['B3'];
  const btn = document.getElementById('btn-secret');
  if (btn) btn.style.display = unlocked ? 'block' : 'none';
}

// ──────────────────────────────────────────────
// Reinicia o jogo zerando estado e histórico
// ──────────────────────────────────────────────
function restart() {
  choices = {};
  history = [];
  document.title = titles['capa'];
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  document.getElementById('scene-capa').classList.add('active');
  const btn = document.getElementById('btn-secret');
  if (btn) btn.style.display = 'none';
}
