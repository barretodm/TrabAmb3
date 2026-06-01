const express = require('express');
const fetch = require('node-fetch');

// Importando constantes
const {
  API_BASE_URL,
  MAX_RANDOM_PAGES,
  PAGE_SIZE,
  CARDS_IN_PACK,
  CARDS_IN_CPU_DECK,
  NUMBER_OF_SPELLS_RETURNED,
  DEFAULT_POWER,
  GRYFFINDOR_POWER,
  SLYTHERIN_POWER,
  HUFFLEPUFF_POWER,
  RAVENCLAW_POWER,
  DEFAULT_MAGIC,
  HUMAN_MAGIC,
  HALF_GIANT_MAGIC,
  GIANT_MAGIC,
  HOUSE_ELF_MAGIC,
  GHOST_MAGIC,
  WEREWOLF_MAGIC,
  VAMPIRE_MAGIC,
  CENTAUR_MAGIC,
  DEFAULT_DEFENSE,
  PURE_BLOOD_DEFENSE,
  HALF_BLOOD_DEFENSE,
  MUGGLE_BORN_DEFENSE,
  MUGGLE_DEFENSE,
  SQUIB_DEFENSE,
  HP_BASE,
  HP_VARIANCE,
  DEFAULT_DAMAGE,
  CHARM_DAMAGE,
  CURSE_DAMAGE,
  HEX_DAMAGE,
  JINX_DAMAGE,
  SPELL_CATEGORY_DAMAGE,
  TRANSFIGURATION_DAMAGE,
  COUNTER_SPELL_DAMAGE,
  HEALING_SPELL_DAMAGE,
} = require('./constants');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Funções Auxiliares
// A partir daqui o nome das variáveis foi alterado para nomes mais significativos.

// embaralha
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[randomIndex];
    shuffled[randomIndex] = temp;
  }
  return shuffled;
}

// Função de validação para personagens e feitiços, substituindo o if ineficaz.
function isValidCharacter(attributes) {
  return (
    attributes && attributes.name && attributes.name !== '' && attributes.image
  );
}

function isValidSpell(attributes) {
  return attributes && attributes.name && attributes.name !== '';
}

// Separada a lógica de cálculo de cada atributo em funções distintas.

function calculatePower(house) {
  let power = DEFAULT_POWER;
  if (house === 'Gryffindor') power = GRYFFINDOR_POWER;
  if (house === 'Slytherin') power = SLYTHERIN_POWER;
  if (house === 'Hufflepuff') power = HUFFLEPUFF_POWER;
  if (house === 'Ravenclaw') power = RAVENCLAW_POWER;
  return power;
}

function calculateMagic(species) {
  let magic = DEFAULT_MAGIC;
  if (species === 'human') magic = HUMAN_MAGIC;
  if (species === 'half-giant') magic = HALF_GIANT_MAGIC;
  if (species === 'giant') magic = GIANT_MAGIC;
  if (species === 'house elf') magic = HOUSE_ELF_MAGIC;
  if (species === 'ghost') magic = GHOST_MAGIC;
  if (species === 'werewolf') magic = WEREWOLF_MAGIC;
  if (species === 'vampire') magic = VAMPIRE_MAGIC;
  if (species === 'centaur') magic = CENTAUR_MAGIC;
  return magic;
}

function calculateDefense(ancestry) {
  let defense = DEFAULT_DEFENSE;
  if (ancestry === 'pure-blood') defense = PURE_BLOOD_DEFENSE;
  if (ancestry === 'half-blood') defense = HALF_BLOOD_DEFENSE;
  if (ancestry === 'muggle-born') defense = MUGGLE_BORN_DEFENSE;
  if (ancestry === 'muggle') defense = MUGGLE_DEFENSE;
  if (ancestry === 'squib') defense = SQUIB_DEFENSE;
  return defense;
}

function calculateHp(defense) {
  return defense + Math.floor(Math.random() * HP_VARIANCE) + HP_BASE;
}

function calculateDamage(category) {
  let damage = DEFAULT_DAMAGE;
  if (category === 'Charm') damage = CHARM_DAMAGE;
  if (category === 'Curse') damage = CURSE_DAMAGE;
  if (category === 'Hex') damage = HEX_DAMAGE;
  if (category === 'Jinx') damage = JINX_DAMAGE;
  if (category === 'Spell') damage = SPELL_CATEGORY_DAMAGE;
  if (category === 'Transfiguration') damage = TRANSFIGURATION_DAMAGE;
  if (category === 'Counter-spell') damage = COUNTER_SPELL_DAMAGE;
  if (category === 'Healing spell') damage = HEALING_SPELL_DAMAGE;
  return damage;
}

// O loop original foi substituído por uma iteração de array ".forEach()"
// para adequação às regras do linter (com o auxílio do vscode)
function processCharactersData(apiCharactersData) {
  const processedCharacters = [];

  apiCharactersData.forEach((character) => {
    const { attributes } = character;

    if (isValidCharacter(attributes)) {
      const power = calculatePower(attributes.house);
      const magic = calculateMagic(attributes.species);
      const defense = calculateDefense(attributes.ancestry);
      const hp = calculateHp(defense);

      processedCharacters.push({
        id: character.id,
        name: attributes.name,
        house: attributes.house || 'Unknown',
        species: attributes.species || 'Unknown',
        ancestry: attributes.ancestry || 'Unknown',
        image: attributes.image,
        power,
        magic,
        defense,
        hp,
        maxHp: hp,
      });
    }
  });

  return processedCharacters;
}

function processSpellsData(apiSpellsData) {
  const processedSpells = [];

  apiSpellsData.forEach((spell) => {
    const { attributes } = spell;

    if (isValidSpell(attributes)) {
      const damage = calculateDamage(attributes.category);

      processedSpells.push({
        id: spell.id,
        name: attributes.name,
        effect: attributes.effect || 'Efeito desconhecido',
        category: attributes.category || 'Spell',
        light: attributes.light || 'Unknown',
        damage,
      });
    }
  });

  return processedSpells;
}

// As rotas '/api/pack' e '/api/cpu-deck' faziam a mesma sequência de operações.
// Por isso a chamada foi isolada aqui.
// As rotas agora atuam apenas recebendo pedidos e devolvendo respostas.
async function fetchAndProcessCharacters() {
  const randomPage = Math.floor(Math.random() * MAX_RANDOM_PAGES) + 1;
  const response = await fetch(
    `${API_BASE_URL}/characters?page[size]=${PAGE_SIZE}&page[number]=${randomPage}`,
  );
  const jsonResponse = await response.json();

  const characters = processCharactersData(jsonResponse.data);
  return shuffleArray(characters);
}

// Controladores de Rotas

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    const shuffledCharacters = await fetchAndProcessCharacters();
    // retorna 4 cartas
    res.json({ cards: shuffledCharacters.slice(0, CARDS_IN_PACK) });
  } catch (error) {
    // Console removido.
    res.status(500).json({
      error: 'Erro ao buscar personagens',
      details: error.message,
    });
  }
});

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    const shuffledCharacters = await fetchAndProcessCharacters();
    res.json({ deck: shuffledCharacters.slice(0, CARDS_IN_CPU_DECK) });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao montar deck cpu',
      details: error.message,
    });
  }
});

// pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/spells?page[size]=${PAGE_SIZE}`,
    );
    const jsonResponse = await response.json();

    const spells = processSpellsData(jsonResponse.data);
    const shuffledSpells = shuffleArray(spells);

    // embaralha e retorna 20
    res.json({ spells: shuffledSpells.slice(0, NUMBER_OF_SPELLS_RETURNED) });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar feiticos',
      details: error.message,
    });
  }
});

app.listen(3000, () => {
  process.stdout.write('Rodando na porta 3000\n');
});
