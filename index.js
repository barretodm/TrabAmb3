const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// pega pack de cartas aleatorias
app.get('/api/pack', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * 8) + 1;
    const d = await fetch(
      `https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${
        pg}`,
    );
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i++) {
      const c = r.data[i];
      const a = c.attributes;
      if (!a.name || a.name == '' || !a.image) continue;

      let pw = 50;
      if (a.house == 'Gryffindor') pw = 90;
      if (a.house == 'Slytherin') pw = 85;
      if (a.house == 'Hufflepuff') pw = 75;
      if (a.house == 'Ravenclaw') pw = 80;

      let mg = 50;
      if (a.species == 'human') mg = 70;
      if (a.species == 'half-giant') mg = 88;
      if (a.species == 'giant') mg = 95;
      if (a.species == 'house elf') mg = 82;
      if (a.species == 'ghost') mg = 60;
      if (a.species == 'werewolf') mg = 91;
      if (a.species == 'vampire') mg = 87;
      if (a.species == 'centaur') mg = 78;

      let df = 50;
      if (a.ancestry == 'pure-blood') df = 90;
      if (a.ancestry == 'half-blood') df = 75;
      if (a.ancestry == 'muggle-born') df = 70;
      if (a.ancestry == 'muggle') df = 40;
      if (a.ancestry == 'squib') df = 35;

      const hp = df + Math.floor(Math.random() * 20) + 80;

      const obj = {};
      obj.id = c.id;
      obj.name = a.name;
      obj.house = a.house || 'Unknown';
      obj.species = a.species || 'Unknown';
      obj.ancestry = a.ancestry || 'Unknown';
      obj.image = a.image;
      obj.power = pw;
      obj.magic = mg;
      obj.defense = df;
      obj.hp = hp;
      obj.maxHp = hp;

      tmp.push(obj);
    }

    // embaralha
    for (let x = tmp.length - 1; x > 0; x--) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x];
      tmp[x] = tmp[y];
      tmp[y] = z;
    }

    // retorna 4 cartas
    res.json({ cards: tmp.slice(0, 4) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao buscar personagens' });
  }
});

// pega feiticos disponiveis
app.get('/api/spells', async (req, res) => {
  try {
    const d = await fetch('https://api.potterdb.com/v1/spells?page[size]=100');
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i++) {
      const s = r.data[i];
      const a = s.attributes;
      if (!a.name || a.name == '') continue;

      let dmg = 30;
      if (a.category == 'Charm') dmg = 45;
      if (a.category == 'Curse') dmg = 90;
      if (a.category == 'Hex') dmg = 65;
      if (a.category == 'Jinx') dmg = 55;
      if (a.category == 'Spell') dmg = 50;
      if (a.category == 'Transfiguration') dmg = 40;
      if (a.category == 'Counter-spell') dmg = 35;
      if (a.category == 'Healing spell') dmg = -40;

      const obj = {};
      obj.id = s.id;
      obj.name = a.name;
      obj.effect = a.effect || 'Efeito desconhecido';
      obj.category = a.category || 'Spell';
      obj.light = a.light || 'Unknown';
      obj.damage = dmg;

      tmp.push(obj);
    }

    // embaralha e retorna 20
    for (let x = tmp.length - 1; x > 0; x--) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x];
      tmp[x] = tmp[y];
      tmp[y] = z;
    }

    res.json({ spells: tmp.slice(0, 20) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao buscar feiticos' });
  }
});

// monta deck cpu com personagens aleatorios
app.post('/api/cpu-deck', async (req, res) => {
  try {
    const pg = Math.floor(Math.random() * 8) + 1;
    const d = await fetch(
      `https://api.potterdb.com/v1/characters?page[size]=100&page[number]=${
        pg}`,
    );
    const r = await d.json();

    const tmp = [];
    for (let i = 0; i < r.data.length; i++) {
      const c = r.data[i];
      const a = c.attributes;
      if (!a.name || a.name == '' || !a.image) continue;

      let pw = 50;
      if (a.house == 'Gryffindor') pw = 90;
      if (a.house == 'Slytherin') pw = 85;
      if (a.house == 'Hufflepuff') pw = 75;
      if (a.house == 'Ravenclaw') pw = 80;

      let mg = 50;
      if (a.species == 'human') mg = 70;
      if (a.species == 'half-giant') mg = 88;
      if (a.species == 'giant') mg = 95;
      if (a.species == 'house elf') mg = 82;
      if (a.species == 'ghost') mg = 60;
      if (a.species == 'werewolf') mg = 91;
      if (a.species == 'vampire') mg = 87;
      if (a.species == 'centaur') mg = 78;

      let df = 50;
      if (a.ancestry == 'pure-blood') df = 90;
      if (a.ancestry == 'half-blood') df = 75;
      if (a.ancestry == 'muggle-born') df = 70;
      if (a.ancestry == 'muggle') df = 40;
      if (a.ancestry == 'squib') df = 35;

      const hp = df + Math.floor(Math.random() * 20) + 80;

      const obj = {};
      obj.id = c.id;
      obj.name = a.name;
      obj.house = a.house || 'Unknown';
      obj.species = a.species || 'Unknown';
      obj.ancestry = a.ancestry || 'Unknown';
      obj.image = a.image;
      obj.power = pw;
      obj.magic = mg;
      obj.defense = df;
      obj.hp = hp;
      obj.maxHp = hp;

      tmp.push(obj);
    }

    for (let x = tmp.length - 1; x > 0; x--) {
      const y = Math.floor(Math.random() * (x + 1));
      const z = tmp[x];
      tmp[x] = tmp[y];
      tmp[y] = z;
    }

    res.json({ deck: tmp.slice(0, 2) });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: 'erro ao montar deck cpu' });
  }
});

app.listen(3000, () => {
  console.log('rodando na porta 3000');
});
