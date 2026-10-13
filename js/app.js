/* Forkcast: family dinner planner + grocery list. Plain JS, no build step.
   Everything is saved in localStorage on the device. */
(function () {
  'use strict';

  const SEED = window.FORKCAST_SEED;
  const STORE_KEY = 'forkcast.v1';
  const AISLES = SEED.aisles;
  const TAGS = SEED.tags;
  const SPECIALS = {
    leftovers: { id: 'leftovers', name: 'Leftovers night', emoji: '🍱', minutes: 0, tags: [], special: true },
    takeout: { id: 'takeout', name: 'Takeout or eating out', emoji: '🥡', minutes: 0, tags: [], special: true }
  };

  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DOW_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const ICON = {
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    chev: '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    wand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20L15 9M14 4v3M20 10h-3M18.5 5.5l-2 2M9 4.5l.8 1.7M19.5 15l-1.7-.8"/></svg>',
    cart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.8L21 7.5H7"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><rect x="4" y="11" width="16" height="10" rx="2"/></svg>'
  };

  /* ---------- Small helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  const clone = o => JSON.parse(JSON.stringify(o));
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
  const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / 86400000);
  const fmtShort = d => `${DOW[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
  const fmtLong = d => `${DOW_LONG[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`;
  const fmtDuration = min => {
    if (!min) return '0 min';
    const h = Math.floor(min / 60), m = min % 60;
    return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
  };
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + 's')}`;

  /* ---------- State ---------- */
  function freshState() {
    return {
      v: 1,
      meals: clone(SEED.meals),
      plan: {},        // 'YYYY-MM-DD' -> { mealId, cooked }
      groceries: [],   // { id, name, qty, aisle, done, sources[] }
      built: [],       // plan entries already sent to the list: 'YYYY-MM-DD|mealId'
      sample: false,
      settings: { household: '', weekStart: 0, theme: 'system' }
    };
  }

  function normalize(s) {
    const base = freshState();
    const out = Object.assign(base, s || {});
    out.settings = Object.assign(freshState().settings, (s && s.settings) || {});
    if (!Array.isArray(out.meals)) out.meals = clone(SEED.meals);
    if (!Array.isArray(out.groceries)) out.groceries = [];
    if (!Array.isArray(out.built)) out.built = [];
    if (!out.plan || typeof out.plan !== 'object') out.plan = {};
    out.meals.forEach(m => {
      m.tags = Array.isArray(m.tags) ? m.tags : [];
      m.ingredients = Array.isArray(m.ingredients) ? m.ingredients : [];
      m.minutes = Number(m.minutes) || 0;
      m.emoji = m.emoji || '🍽️';
    });
    out.groceries.forEach(g => { g.sources = Array.isArray(g.sources) ? g.sources : []; g.aisle = g.aisle || 'other'; });
    // Forget "already on the list" markers older than five weeks
    const cutoff = keyOf(addDays(today(), -35));
    out.built = out.built.filter(b => b.split('|')[0] >= cutoff);
    return out;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return normalize(JSON.parse(raw));
    } catch (e) { /* storage unavailable: start in memory */ }
    return null;
  }

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* private mode */ }
  }

  let state = null; // set at boot, once every helper below exists

  const ui = {
    tab: 'today',
    weekOffset: 0,
    mealFilter: 'all',
    mealQuery: '',
    pickerFilter: 'all',
    pickerQuery: ''
  };

  function seedSampleWeek() {
    const t = today();
    const sample = [['m-fajitas', 0], ['m-salmon', 1], ['m-pizza', 2], ['leftovers', 3], ['m-chili', 4], ['m-breakfast', 5]];
    sample.forEach(([id, off]) => { state.plan[keyOf(addDays(t, off))] = { mealId: id, cooked: false }; });
    sendPlanToList(Object.keys(state.plan));
    [['Milk', 'dairy'], ['Diapers', 'baby'], ['Wipes', 'baby'], ['Bananas', 'produce']].forEach(([name, aisle]) => addGrocery({ name, aisle }));
    state.sample = true;
  }

  /* ---------- Meals ---------- */
  const mealById = id => SPECIALS[id] || state.meals.find(m => m.id === id) || null;
  const tagLabel = id => (TAGS.find(t => t.id === id) || {}).label || id;
  const aisleLabel = id => (AISLES.find(a => a.id === id) || {}).label || 'Other';
  const entryFor = key => {
    const e = state.plan[key];
    if (!e) return null;
    const meal = mealById(e.mealId);
    return meal ? { ...e, meal } : null;
  };

  function lastHad(mealId, beforeKey) {
    let best = null;
    for (const k in state.plan) {
      if (k < beforeKey && state.plan[k].mealId === mealId && (!best || k > best)) best = k;
    }
    return best ? daysBetween(best, beforeKey) : null;
  }

  function weekStartDate(offset) {
    const t = today();
    const diff = (t.getDay() - state.settings.weekStart + 7) % 7;
    return addDays(t, -diff + offset * 7);
  }
  const weekDays = offset => { const s = weekStartDate(offset); return Array.from({ length: 7 }, (_, i) => addDays(s, i)); };

  function weekRangeLabel(days) {
    const a = days[0], b = days[6];
    return a.getMonth() === b.getMonth()
      ? `${MON[a.getMonth()]} ${a.getDate()} – ${b.getDate()}`
      : `${MON[a.getMonth()]} ${a.getDate()} – ${MON[b.getMonth()]} ${b.getDate()}`;
  }

  // Pick a meal, favoring favorites, skipping ones already in rotation nearby.
  function chooseMeal(excludeIds, filterFn) {
    const ok = m => !filterFn || filterFn(m);
    let pool = state.meals.filter(m => ok(m) && !excludeIds.has(m.id));
    if (!pool.length) pool = state.meals.filter(ok);
    if (!pool.length) return null;
    const weighted = pool.flatMap(m => (m.fav ? [m, m] : [m]));
    return weighted[Math.floor(Math.random() * weighted.length)];
  }

  function recentMealIds(centerKey, span) {
    const ids = new Set();
    for (const k in state.plan) {
      if (Math.abs(daysBetween(k, centerKey)) <= span) ids.add(state.plan[k].mealId);
    }
    return ids;
  }

  /* ---------- Groceries ---------- */
  const UNIT = '(?:lbs?|oz|g|kg|ml|l|cups?|tbsp|tsp|cans?|cartons?|bags?|packs?|packets?|jars?|bottles?|heads?|bunch(?:es)?|box(?:es)?|tubs?|stalks?|ears?|pints?|dozen|cloves?|sticks?|blocks?|wedges?|slices?|loaf|loaves|qts?|quarts?|gal(?:lons?)?|knobs?|balls?|containers?)';
  const QTY_RE = new RegExp(`^(\\d+(?:[.\\/]\\d+)?(?:\\s*-\\s*\\d+)?(?:\\s*${UNIT}\\b\\.?)?)\\s+(.+)$`, 'i');

  function parseLine(line) {
    const s = line.trim().replace(/^[-*•]\s*/, '');
    if (!s) return null;
    const m = s.match(QTY_RE);
    return m ? { qty: m[1].trim(), name: m[2].trim() } : { qty: '', name: s };
  }

  const singular = w => (w.length > 3 && /s$/.test(w) && !/ss$/.test(w) ? w.slice(0, -1) : w);
  const normName = n => String(n).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).map(singular).join(' ');

  function parseQty(q) {
    const m = String(q || '').trim().match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*(.*)$/);
    if (!m) return null;
    const n = m[1].includes('/') ? m[1].split('/').map(Number).reduce((a, b) => a / b) : parseFloat(m[1]);
    return { n, unit: m[2].trim() };
  }
  const unitKey = u => singular(u.toLowerCase().replace(/\.$/, ''));
  const NO_PLURAL = new Set(['lb', 'lbs', 'oz', 'g', 'kg', 'ml', 'l', 'tbsp', 'tsp', 'dozen', 'qt']);
  function withUnit(n, unit) {
    if (!unit) return String(n);
    const base = unitKey(unit);
    if (n > 1 && !NO_PLURAL.has(base) && !/s$/.test(base)) return `${n} ${/(ch|sh|x)$/.test(base) ? base + 'es' : base + 's'}`;
    return `${n} ${n > 1 ? unit : base}`;
  }
  function mergeQty(a, b) {
    if (!a) return b || '';
    if (!b) return a;
    const pa = parseQty(a), pb = parseQty(b);
    if (pa && pb && unitKey(pa.unit) === unitKey(pb.unit)) return withUnit(Math.round((pa.n + pb.n) * 100) / 100, pa.unit);
    return `${a} + ${b}`;
  }

  // Ordered: first match wins, so "chicken broth" lands in pantry, "frozen peas" in frozen.
  const AISLE_RULES = [
    ['frozen', /frozen|ice cream|popsicle|waffle/],
    ['baby', /diaper|wipes|formula|pouch|puffs|teether|sippy|baby food|baby cereal|pull-?ups|toddler snack/],
    ['household', /paper towel|toilet|tissue|detergent|dish soap|soap|trash bag|foil|plastic wrap|ziploc|zip bag|sponge|cleaner|batter(y|ies)|shampoo|toothpaste|lotion/],
    ['pantry', /broth|stock|sauce|seasoning|powder|bouillon|noodle|pasta|spaghetti|macaroni|penne|rice|quinoa|oats|cereal|flour|sugar|oil|vinegar|honey|syrup|peanut butter|jam|jelly|beans|canned|salsa|spice|salt|pepper flakes|coffee|tea|crackers|chips|granola|nuts|almonds|breadcrumb|panko|ketchup|mustard|mayo|ranch|dressing|mix\b/],
    ['meat', /chicken|beef|steak|pork|turkey|sausage|bacon|ham|salmon|shrimp|cod|tilapia|tuna|fish|ground|meatball|brisket|ribs|pepperoni|hot dog|lamb/],
    ['dairy', /milk|cheese|yogurt|butter|egg|cream|mozzarella|cheddar|parmesan|feta|tzatziki|creamer/],
    ['bakery', /bread|bun|roll|tortilla|bagel|pita|naan|croissant|muffin|dough|loaf|english muffin/],
    ['produce', /apple|banana|berr|avocado|lettuce|spinach|kale|broccoli|carrot|onion|garlic|potato|tomato|pepper|cucumber|lemon|lime|cilantro|parsley|basil|zucchini|squash|corn|mushroom|celery|ginger|green bean|grape|orange|herb|scallion|salad|slaw|peach|pear|melon|mango|pineapple|cabbage|asparagus|rosemary|fruit|veg/]
  ];
  function guessAisle(name) {
    const n = String(name).toLowerCase();
    for (const [aisle, re] of AISLE_RULES) if (re.test(n)) return aisle;
    return 'other';
  }

  function addGrocery({ name, qty, aisle, source }) {
    const norm = normName(name);
    let item = state.groceries.find(g => !g.done && normName(g.name) === norm);
    if (item) {
      item.qty = mergeQty(item.qty, qty);
      if (source && !item.sources.includes(source)) item.sources.push(source);
      return { item, merged: true };
    }
    item = { id: uid(), name: name.trim(), qty: qty || '', aisle: aisle || guessAisle(name), done: false, sources: source ? [source] : [] };
    state.groceries.push(item);
    return { item, merged: false };
  }

  const isPending = key => {
    const e = state.plan[key];
    return e && !SPECIALS[e.mealId] && mealById(e.mealId) && !state.built.includes(`${key}|${e.mealId}`);
  };

  // Adds the ingredients for these planned days. Returns how many dinners were added.
  function sendPlanToList(keys) {
    let dinners = 0;
    keys.forEach(key => {
      if (!isPending(key)) return;
      const e = state.plan[key];
      const meal = mealById(e.mealId);
      meal.ingredients.forEach(ing => addGrocery({ name: ing.name, qty: ing.qty, aisle: ing.aisle, source: meal.id }));
      state.built.push(`${key}|${e.mealId}`);
      dinners++;
    });
    return dinners;
  }

  const upcomingKeys = () => Array.from({ length: 7 }, (_, i) => keyOf(addDays(today(), i)));

  /* ---------- Undo + toast ---------- */
  let toastTimer = null;
  let undoFn = null;
  function toast(msg, undo) {
    const t = $('#toast');
    t.innerHTML = `<span class="msg">${esc(msg)}</span>${undo ? '<button type="button" data-action="undo">Undo</button>' : ''}`;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    undoFn = undo || null;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; undoFn = null; }, undo ? 5000 : 2600);
  }

  function change(msg, fn, { undoable = true } = {}) {
    const snap = JSON.stringify(state);
    fn();
    save();
    render();
    if (msg) {
      toast(msg, undoable ? () => { state = normalize(JSON.parse(snap)); save(); render(); refreshSheet(); } : null);
    }
  }

  /* ---------- Rendering: shared bits ---------- */
  const plate = (meal, size = '') => meal
    ? `<div class="plate ${size} ${meal.special ? 'special' : ''}" aria-hidden="true">${esc(meal.emoji)}</div>`
    : `<div class="plate ${size} empty" aria-hidden="true">?</div>`;

  const mealMeta = meal => {
    if (meal.special) return meal.id === 'leftovers' ? 'No cooking tonight' : 'Night off';
    const bits = [`${meal.minutes} min`];
    const tag = meal.tags.find(t => t !== 'quick');
    if (tag) bits.push(tagLabel(tag));
    return bits.join(' · ');
  };

  const ring = (done, total) => {
    const r = 22, c = 2 * Math.PI * r;
    const pct = total ? done / total : 0;
    return `<svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="track" cx="27" cy="27" r="${r}"/><circle class="bar" cx="27" cy="27" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - pct)).toFixed(1)}"/></svg>`;
  };

  /* ---------- Tonight ---------- */
  function renderToday() {
    const t = today();
    const key = keyOf(t);
    const entry = entryFor(key);
    const tomorrowKey = keyOf(addDays(t, 1));
    const tomorrow = entryFor(tomorrowKey);
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    let hero;
    if (entry) {
      const m = entry.meal;
      hero = `
        <article class="tonight">
          <span class="eyebrow tonight-label"><i class="live-dot"></i>Tonight · ${fmtShort(t)}</span>
          ${plate(m, 'xl')}
          <h2>${esc(m.name)}</h2>
          <div class="tag-row" style="justify-content:center">
            <span class="tag">${esc(mealMeta(m))}</span>
            ${m.tags.filter(id => id !== 'quick').slice(1, 3).map(id => `<span class="tag">${esc(tagLabel(id))}</span>`).join('')}
          </div>
          ${entry.cooked ? `<span class="cooked-stamp">${ICON.check}Dinner's done. Nice work.</span>` : ''}
          <div class="btn-row">
            ${entry.cooked
              ? `<button class="btn" type="button" data-action="uncook" data-key="${key}">Mark not cooked</button>`
              : `<button class="btn btn-primary" type="button" data-action="cook" data-key="${key}">${ICON.check}We made it</button>`}
            <button class="btn" type="button" data-action="pick" data-key="${key}">${ICON.swap}Swap</button>
            ${m.special ? '' : `<button class="btn" type="button" data-action="open-meal" data-id="${m.id}">${ICON.book}Recipe</button>`}
          </div>
        </article>`;
    } else {
      hero = `
        <article class="tonight">
          <span class="eyebrow tonight-label"><i class="live-dot"></i>Tonight · ${fmtShort(t)}</span>
          ${plate(null, 'xl')}
          <h2>Nothing on the plate yet</h2>
          <p class="sub">Spin for an idea or choose from your meals.</p>
          <div class="btn-row">
            <button class="btn btn-primary" type="button" data-action="spin" data-key="${key}">${ICON.wand}Spin for dinner</button>
            <button class="btn" type="button" data-action="pick" data-key="${key}">Choose a meal</button>
          </div>
        </article>`;
    }

    const days = weekDays(0);
    const planned = days.filter(d => entryFor(keyOf(d))).length;
    const todo = state.groceries.filter(g => !g.done).length;
    const inCart = state.groceries.length - todo;

    return `
      <div class="page-head">
        <span class="eyebrow">${greet}</span>
        <h1 class="h1">What's for dinner?</h1>
      </div>
      ${state.sample ? `
        <div class="callout">
          <div class="grow"><strong>This is a sample week</strong><span class="sub">Poke around, then clear it when you're ready to plan your own.</span></div>
          <button class="btn btn-sm" type="button" data-action="start-fresh">Start fresh</button>
        </div>` : ''}
      ${hero}
      <button class="next-up" type="button" data-action="${tomorrow ? 'open-day' : 'pick'}" data-key="${tomorrowKey}">
        ${plate(tomorrow && tomorrow.meal, 'sm')}
        <span class="grow">
          <span class="eyebrow">Tomorrow</span>
          <span class="name" style="display:block">${tomorrow ? esc(tomorrow.meal.name) : 'Not planned yet'}</span>
        </span>
        ${ICON.chev}
      </button>
      <section class="section">
        <div class="section-head"><h2 class="h3">This week</h2><button class="link-btn" type="button" data-tab="plan">Open planner</button></div>
        <div class="week-strip">
          ${days.map(d => {
            const k = keyOf(d);
            const e = entryFor(k);
            const cls = k === key ? 'is-today' : k < key ? 'is-past' : '';
            return `<button class="day-pill ${cls}" type="button" data-action="${e ? 'open-day' : 'pick'}" data-key="${k}" aria-label="${fmtLong(d)}: ${e ? esc(e.meal.name) : 'nothing planned'}">
              ${DOW[d.getDay()].slice(0, 2)}<b>${d.getDate()}</b><span class="slot">${e ? esc(e.meal.emoji) : '<i></i>'}</span>
            </button>`;
          }).join('')}
        </div>
      </section>
      <div class="duo">
        <button class="stat-card" type="button" data-tab="grocery">
          <div class="stat-top">${ring(inCart, state.groceries.length)}<span class="eyebrow">List</span></div>
          <div class="num">${todo}</div>
          <div class="lbl">${todo === 1 ? 'item' : 'items'} left to grab${inCart ? `, ${inCart} in the cart` : ''}</div>
        </button>
        <button class="stat-card" type="button" data-tab="plan">
          <div class="stat-top"><span class="eyebrow">Planned</span></div>
          <div class="num">${planned}<small>/7</small></div>
          <div class="lbl">dinners this week</div>
        </button>
      </div>
      <button class="spin-card" type="button" data-action="spin" data-key="${key}">
        <span class="spin-dice" aria-hidden="true">🎲</span>
        <span class="grow"><strong class="h3" style="display:block">Can't decide?</strong><span class="sub">Spin the wheel and let fate pick tonight.</span></span>
        ${ICON.chev}
      </button>`;
  }

  /* ---------- Week plan ---------- */
  function renderPlan() {
    const days = weekDays(ui.weekOffset);
    const todayKey = keyOf(today());
    const keys = days.map(keyOf);
    const entries = keys.map(entryFor);
    const planned = entries.filter(Boolean).length;
    const minutes = entries.reduce((sum, e) => sum + (e && !e.meal.special ? e.meal.minutes : 0), 0);
    const pending = keys.filter(k => k >= todayKey && isPending(k)).length;
    const openNights = keys.filter((k, i) => k >= todayKey && !entries[i]).length;
    const label = ui.weekOffset === 0 ? 'This week' : ui.weekOffset === 1 ? 'Next week' : ui.weekOffset === -1 ? 'Last week' : 'Week of';

    return `
      <div class="page-head">
        <span class="eyebrow">Dinner plan</span>
        <h1 class="h1">The week ahead</h1>
      </div>
      <div class="week-nav">
        <button class="icon-btn" type="button" data-action="week-prev" aria-label="Previous week">${ICON.left}</button>
        <div class="range"><span class="eyebrow" style="display:block">${label}</span>${weekRangeLabel(days)}</div>
        <button class="icon-btn" type="button" data-action="week-next" aria-label="Next week">${ICON.right}</button>
      </div>
      <div class="plan-meter">
        <div class="meter" aria-hidden="true">${entries.map(e => `<span class="${e ? (e.cooked ? 'done' : 'on') : ''}"></span>`).join('')}</div>
        <div class="meter-label"><span>${planned} of 7 dinners planned</span><span class="mono">${fmtDuration(minutes)} cooking</span></div>
      </div>
      <div class="btn-row">
        <button class="btn" type="button" data-action="autofill" ${openNights ? '' : 'disabled'}>${ICON.wand}Fill open nights</button>
        <button class="btn ${pending ? 'btn-primary' : ''}" type="button" data-action="build-week" ${pending ? '' : 'disabled'}>${ICON.cart}${pending ? `Add ${plural(pending, 'dinner')} to list` : 'List is up to date'}</button>
      </div>
      <div class="day-list">
        ${days.map((d, i) => {
          const k = keys[i];
          const e = entries[i];
          const cls = k === todayKey ? 'is-today' : k < todayKey ? 'is-past' : '';
          const card = e
            ? `<button class="day-card" type="button" data-action="open-day" data-key="${k}">
                ${plate(e.meal, 'sm')}
                <span class="grow"><span class="name" style="display:block">${esc(e.meal.name)}</span><span class="meta">${esc(mealMeta(e.meal))}</span></span>
                ${e.cooked ? `<span class="done-dot" aria-label="Cooked">${ICON.check}</span>` : ICON.chev}
              </button>`
            : `<button class="day-card empty" type="button" data-action="pick" data-key="${k}">${ICON.plus}Plan dinner</button>`;
          return `<div class="day-row ${cls}"><div class="day-date">${DOW[d.getDay()]}<b>${d.getDate()}</b></div>${card}</div>`;
        }).join('')}
      </div>
      ${ui.weekOffset !== 0 ? '<button class="btn btn-ghost" type="button" data-action="week-today">Back to this week</button>' : ''}
      <p class="sub" style="font-size:var(--t-sm)">Fill open nights keeps Monday through Thursday quick and favors your hearted meals.</p>`;
  }

  /* ---------- Grocery ---------- */
  function renderGrocery() {
    const todo = state.groceries.filter(g => !g.done);
    const done = state.groceries.filter(g => g.done);
    const pendingDinners = upcomingKeys().filter(isPending).length;
    const onList = new Set(todo.map(g => normName(g.name)));

    const itemRow = g => {
      const from = g.sources.map(mealById).filter(Boolean);
      return `<div class="item ${g.done ? 'is-done' : ''}" data-item="${g.id}">
        <button class="item-main" type="button" data-action="toggle-item" data-id="${g.id}" aria-pressed="${g.done}">
          <span class="check">${ICON.check}</span>
          <span class="item-name">
            <span class="txt">${esc(g.name)}</span>
            ${from.length ? `<span class="item-from" title="For ${esc(from.map(m => m.name).join(', '))}">${from.map(m => esc(m.emoji)).join('')}</span>` : ''}
            <span class="lead"></span>
            ${g.qty ? `<span class="item-qty mono">${esc(g.qty)}</span>` : ''}
          </span>
        </button>
        <button class="item-del" type="button" data-action="del-item" data-id="${g.id}" aria-label="Remove ${esc(g.name)}">${ICON.x}</button>
      </div>`;
    };

    const groups = AISLES.map(a => ({ a, items: todo.filter(g => g.aisle === a.id) })).filter(x => x.items.length);
    const household = state.settings.household.trim();

    return `
      <div class="page-head">
        <span class="eyebrow">Groceries</span>
        <h1 class="h1">Shopping list</h1>
        <p class="sub">${todo.length ? `${plural(todo.length, 'item')} to grab` : 'Nothing left to grab'}${done.length ? ` · ${done.length} in the cart` : ''}</p>
      </div>
      <form class="add-form" id="add-form" autocomplete="off">
        <input class="field" id="add-item" name="item" aria-label="Add an item" placeholder="Add an item, like 2 lb ground turkey" enterkeyhint="done">
        <button class="btn btn-primary" type="submit" aria-label="Add to list">${ICON.plus}</button>
      </form>
      <div class="chip-row" aria-label="Quick add staples">
        ${SEED.staples.map(([name, aisle]) => {
          const on = onList.has(normName(name));
          return `<button class="chip" type="button" data-action="staple" data-name="${esc(name)}" data-aisle="${aisle}" aria-pressed="${on}">${on ? '' : '<span class="plus">+</span>'}${esc(name)}</button>`;
        }).join('')}
      </div>
      ${pendingDinners ? `
        <div class="callout">
          <div class="grow"><strong>${plural(pendingDinners, 'planned dinner')} not on the list</strong><span class="sub">Add their ingredients in one tap. Duplicates get combined.</span></div>
          <button class="btn btn-sm btn-good" type="button" data-action="build-upcoming">Add</button>
        </div>` : ''}
      <div class="receipt">
        <div class="receipt-head">
          <strong>FORKCAST MARKET</strong>
          <span>${esc(household || 'Family run')} · ${fmtShort(today())}</span>
        </div>
        <hr class="rule">
        ${groups.length ? groups.map(({ a, items }) => `
          <div class="aisle">
            <div class="aisle-head" style="--c:var(--a-${a.id})"><i class="swatch"></i>${esc(a.label)}<span class="count">${items.length}</span></div>
            ${items.map(itemRow).join('')}
          </div>`).join('') : `
          <div class="empty-state">
            <div class="big" aria-hidden="true">🧺</div>
            <strong class="h3">${done.length ? 'Everything is in the cart' : 'Your list is clear'}</strong>
            <p class="sub">${done.length ? 'Clear the cart when you get home.' : 'Add items above, tap a staple, or send your planned dinners here.'}</p>
          </div>`}
        ${done.length ? `
          <hr class="rule">
          <div class="aisle">
            <div class="aisle-head" style="--c:var(--basil)"><i class="swatch"></i>In the cart<span class="count">${done.length}</span></div>
            ${done.map(itemRow).join('')}
          </div>` : ''}
        <hr class="rule">
        <div class="receipt-total"><span>ITEMS <b>${state.groceries.length}</b></span><span>IN CART <b>${done.length}</b></span></div>
      </div>
      <div class="btn-row">
        <button class="btn" type="button" data-action="share-list" ${todo.length ? '' : 'disabled'}>${ICON.share}Share list</button>
        <button class="btn" type="button" data-action="clear-cart" ${done.length ? '' : 'disabled'}>${ICON.trash}Clear cart</button>
      </div>`;
  }

  /* ---------- Meal library ---------- */
  function filteredMeals(filter, query) {
    const q = query.trim().toLowerCase();
    return state.meals
      .filter(m => filter === 'all' || (filter === 'fav' ? m.fav : m.tags.includes(filter)))
      .filter(m => !q || m.name.toLowerCase().includes(q) || m.ingredients.some(i => i.name.toLowerCase().includes(q)))
      .sort((a, b) => (b.fav - a.fav) || a.name.localeCompare(b.name));
  }

  const filterChips = (current, action) => [{ id: 'all', label: 'All' }, { id: 'fav', label: '♥ Favorites' }, ...TAGS]
    .map(t => `<button class="chip" type="button" data-action="${action}" data-f="${t.id}" aria-pressed="${current === t.id}">${esc(t.label)}</button>`).join('');

  function mealGridHTML() {
    const list = filteredMeals(ui.mealFilter, ui.mealQuery);
    const cards = list.map(m => `
      <div class="meal-card" role="button" tabindex="0" data-action="open-meal" data-id="${m.id}" aria-label="${esc(m.name)}">
        ${plate(m, 'md')}
        <span class="name">${esc(m.name)}</span>
        <span class="meta"><span class="mono">${m.minutes} min</span>${(t => t ? `<span>${esc(tagLabel(t))}</span>` : '')(m.tags.includes('kid') ? 'kid' : m.tags.find(t => t !== 'quick'))}</span>
        <button class="heart" type="button" data-action="fav" data-id="${m.id}" aria-pressed="${m.fav}" aria-label="Favorite ${esc(m.name)}">${ICON.heart}</button>
      </div>`).join('');
    const empty = !list.length ? `<div class="empty-state" style="grid-column:1/-1"><div class="big" aria-hidden="true">🔍</div><p class="sub">No meals match that. Try another filter or add it as a new meal.</p></div>` : '';
    return cards + empty + `<button class="new-card" type="button" data-action="new-meal">${ICON.plus}New meal</button>`;
  }

  function renderMeals() {
    return `
      <div class="page-head">
        <div class="page-head-row">
          <div>
            <span class="eyebrow">Meal library</span>
            <h1 class="h1">Your dinners</h1>
          </div>
          <button class="btn btn-sm btn-primary" type="button" data-action="new-meal">${ICON.plus}New</button>
        </div>
        <p class="sub">${plural(state.meals.length, 'family dinner')}, ${state.meals.filter(m => m.fav).length} hearted</p>
      </div>
      <div class="search">${ICON.search}<input class="field" id="meal-q" type="search" placeholder="Search meals or ingredients" value="${esc(ui.mealQuery)}" autocomplete="off"></div>
      <div class="chip-row">${filterChips(ui.mealFilter, 'meal-filter')}</div>
      <div class="meal-grid" id="meal-grid">${mealGridHTML()}</div>`;
  }

  /* ---------- Render loop ---------- */
  const VIEWS = { today: renderToday, plan: renderPlan, grocery: renderGrocery, meals: renderMeals };

  function render(animate) {
    Object.keys(VIEWS).forEach(name => {
      const el = $(`#view-${name}`);
      const active = name === ui.tab;
      el.hidden = !active;
      if (active) {
        el.innerHTML = VIEWS[name]();
        if (animate && !reduceMotion()) { el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); }
      } else {
        el.innerHTML = '';
      }
    });
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.tab === ui.tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    const left = state.groceries.filter(g => !g.done).length;
    const badge = $('#grocery-badge');
    badge.hidden = !left;
    badge.textContent = left > 99 ? '99+' : left;
    $('#household-label').textContent = state.settings.household.trim() || 'Family dinner planner';
  }

  function setTab(tab) {
    if (!VIEWS[tab]) return;
    const same = ui.tab === tab;
    ui.tab = tab;
    try { history.replaceState(null, '', '#' + tab); } catch (e) { /* sandboxed */ }
    render(!same);
    window.scrollTo({ top: 0, behavior: same && !reduceMotion() ? 'smooth' : 'auto' });
  }

  /* ---------- Sheets ---------- */
  let sheet = null;
  let sheetCloseTimer = null;

  function openSheet(renderFn, onMount) {
    clearTimeout(sheetCloseTimer);
    const root = $('#sheet-root');
    const el = $('#sheet');
    const body = $('#sheet-body');
    const wasOpen = !!sheet && !root.hidden;
    sheet = { renderFn, onMount };
    root.classList.remove('closing');
    el.classList.remove('closing');
    el.style.transform = '';
    body.innerHTML = renderFn();
    root.hidden = false;
    body.scrollTop = 0;
    if (!wasOpen) document.documentElement.style.overflow = 'hidden';
    if (onMount) onMount(body);
  }

  function refreshSheet() {
    if (!sheet) return;
    const body = $('#sheet-body');
    const top = body.scrollTop;
    body.innerHTML = sheet.renderFn();
    body.scrollTop = top;
    if (sheet.onMount) sheet.onMount(body, true);
  }

  function closeSheet() {
    if (!sheet) return;
    sheet = null;
    if (spinTimer) { clearTimeout(spinTimer); spinTimer = null; }
    const root = $('#sheet-root');
    const el = $('#sheet');
    root.classList.add('closing');
    el.classList.add('closing');
    document.documentElement.style.overflow = '';
    sheetCloseTimer = setTimeout(() => {
      root.hidden = true;
      root.classList.remove('closing');
      el.classList.remove('closing');
      el.style.transform = '';
      $('#sheet-body').innerHTML = '';
    }, reduceMotion() ? 0 : 220);
  }

  // Drag the sheet down to dismiss it
  (function enableSwipe() {
    const el = $('#sheet');
    const body = $('#sheet-body');
    let startY = 0, dy = 0, dragging = false, eligible = false;
    el.addEventListener('touchstart', e => {
      eligible = body.scrollTop <= 0 || !body.contains(e.target);
      startY = e.touches[0].clientY;
      dy = 0;
      dragging = false;
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      if (!eligible) return;
      dy = e.touches[0].clientY - startY;
      if (!dragging && dy > 8) dragging = true;
      if (dragging) {
        e.preventDefault();
        el.style.transition = 'none';
        el.style.transform = `translateY(${Math.max(0, dy)}px)`;
      }
    }, { passive: false });
    el.addEventListener('touchend', () => {
      if (!dragging) return;
      el.style.transition = 'transform 0.25s cubic-bezier(0.2, 0.9, 0.25, 1)';
      if (dy > 110) closeSheet();
      else el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 260);
      dragging = false;
    });
  })();

  /* Day sheet: what's planned for a given night */
  function openDay(key) {
    if (!entryFor(key)) return openPicker(key);
    openSheet(() => {
      const e = entryFor(key);
      if (!e) return '';
      const d = fromKey(key);
      const isToday = key === keyOf(today());
      return `
        <div class="sheet-hero">
          ${plate(e.meal, 'xl')}
          <span class="eyebrow">${isToday ? 'Tonight' : fmtLong(d)}</span>
          <h2 class="h2" id="sheet-title">${esc(e.meal.name)}</h2>
          <div class="tag-row" style="justify-content:center"><span class="tag">${esc(mealMeta(e.meal))}</span></div>
          ${e.cooked ? `<span class="cooked-stamp">${ICON.check}Cooked</span>` : ''}
        </div>
        <div class="btn-row">
          ${e.cooked
            ? `<button class="btn" type="button" data-action="uncook" data-key="${key}">Mark not cooked</button>`
            : `<button class="btn btn-good" type="button" data-action="cook" data-key="${key}">${ICON.check}Mark cooked</button>`}
          <button class="btn" type="button" data-action="pick" data-key="${key}">${ICON.swap}Swap meal</button>
        </div>
        <div class="btn-row">
          ${e.meal.special ? '' : `<button class="btn" type="button" data-action="open-meal" data-id="${e.meal.id}">${ICON.book}Recipe and ingredients</button>`}
          <button class="btn btn-danger" type="button" data-action="clear-day" data-key="${key}">${ICON.trash}Clear night</button>
        </div>`;
    });
  }

  /* Picker: choose a meal for a night */
  function pickerListHTML(key) {
    const current = state.plan[key] && state.plan[key].mealId;
    const list = filteredMeals(ui.pickerFilter, ui.pickerQuery);
    if (!list.length) return '<div class="empty-state"><p class="sub">No meals match. Try a different filter.</p></div>';
    return list.map(m => {
      const ago = lastHad(m.id, key);
      const hint = ago == null ? 'Not on the plan lately' : ago === 0 ? 'Same day' : `Had ${plural(ago, 'day')} ago`;
      return `<button class="pick ${current === m.id ? 'is-current' : ''}" type="button" data-action="assign" data-key="${key}" data-id="${m.id}">
        ${plate(m, 'sm')}
        <span class="grow"><span class="name" style="display:block">${m.fav ? '♥ ' : ''}${esc(m.name)}</span><span class="meta">${m.minutes} min · ${hint}</span></span>
        ${current === m.id ? '<span class="tag">Planned</span>' : ICON.chev}
      </button>`;
    }).join('');
  }

  function openPicker(key) {
    ui.pickerQuery = '';
    ui.pickerFilter = 'all';
    const d = fromKey(key);
    const isToday = key === keyOf(today());
    openSheet(() => `
      <div class="sheet-head">
        <div class="grow">
          <span class="eyebrow">${isToday ? 'Tonight' : fmtLong(d)}</span>
          <h2 class="h2" id="sheet-title">Pick a dinner</h2>
        </div>
        <button class="btn btn-sm" type="button" data-action="spin" data-key="${key}">${ICON.wand}Spin</button>
      </div>
      <div class="search">${ICON.search}<input class="field" id="picker-q" type="search" placeholder="Search meals" value="${esc(ui.pickerQuery)}" autocomplete="off"></div>
      <div class="chip-row">${filterChips(ui.pickerFilter, 'picker-filter')}</div>
      <div class="special-row">
        ${Object.values(SPECIALS).map(s => `<button class="pick" type="button" data-action="assign" data-key="${key}" data-id="${s.id}">${plate(s, 'sm')}<span class="grow"><span class="name" style="display:block;font-size:var(--t-sm)">${s.id === 'leftovers' ? 'Leftovers' : 'Takeout'}</span></span></button>`).join('')}
      </div>
      <div class="pick-list" id="picker-list" data-key="${key}">${pickerListHTML(key)}</div>`);
  }

  function assign(key, mealId) {
    const meal = mealById(mealId);
    if (!meal) return;
    const d = fromKey(key);
    const when = key === keyOf(today()) ? 'tonight' : `for ${DOW_LONG[d.getDay()]}`;
    closeSheet();
    change(`${meal.name} is on ${when}`, () => {
      state.plan[key] = { mealId, cooked: false };
    });
  }

  /* Meal detail */
  function openMeal(id) {
    openSheet(() => {
      const m = mealById(id);
      if (!m || m.special) return '';
      const next7 = Array.from({ length: 7 }, (_, i) => addDays(today(), i));
      const lastKey = Object.keys(state.plan).filter(k => state.plan[k].mealId === id && k <= keyOf(today())).sort().pop();
      return `
        <div class="sheet-hero">
          ${plate(m, 'xl')}
          <h2 class="h2" id="sheet-title">${esc(m.name)}</h2>
          <div class="tag-row" style="justify-content:center">
            <span class="tag mono">${m.minutes} min</span>
            ${m.tags.map(t => `<span class="tag">${esc(tagLabel(t))}</span>`).join('')}
          </div>
          <span class="sub" style="font-size:var(--t-sm)">${lastKey ? `Last on the plan ${fmtShort(fromKey(lastKey))}` : 'Not on the plan yet'}</span>
        </div>
        <div class="btn-row">
          <button class="btn ${m.fav ? 'btn-danger' : ''}" type="button" data-action="fav" data-id="${m.id}">${ICON.heart}${m.fav ? 'Hearted' : 'Heart it'}</button>
          <button class="btn" type="button" data-action="add-ings" data-id="${m.id}">${ICON.cart}Add to list</button>
        </div>
        <section class="section">
          <div class="section-head"><h3 class="h3">Put it on the plan</h3><span class="sub" style="font-size:var(--t-xs)">Next 7 nights</span></div>
          <div class="day-chooser">
            ${next7.map(d => {
              const k = keyOf(d);
              const e = entryFor(k);
              const mine = e && e.mealId === m.id;
              return `<button type="button" data-action="plan-meal" data-key="${k}" data-id="${m.id}" aria-pressed="${!!mine}" aria-label="${fmtLong(d)}${e ? ', currently ' + esc(e.meal.name) : ''}">
                ${DOW[d.getDay()].slice(0, 2)}<b>${d.getDate()}</b><span class="em">${e && !mine ? esc(e.meal.emoji) : ''}</span>
              </button>`;
            }).join('')}
          </div>
        </section>
        <section class="section">
          <div class="section-head"><h3 class="h3">Ingredients</h3><span class="sub mono" style="font-size:var(--t-xs)">${m.ingredients.length}</span></div>
          <ul class="ing-list">
            ${m.ingredients.map(i => `<li style="--c:var(--a-${esc(i.aisle || 'other')})"><i class="swatch" title="${esc(aisleLabel(i.aisle))}"></i><span class="nm">${esc(i.name)}</span><span class="q">${esc(i.qty)}</span></li>`).join('') || '<li class="sub">No ingredients yet. Edit the meal to add some.</li>'}
          </ul>
        </section>
        ${m.notes ? `<div class="notes"><b>Kitchen notes</b>${esc(m.notes)}</div>` : ''}
        <div class="btn-row">
          <button class="btn" type="button" data-action="edit-meal" data-id="${m.id}">${ICON.edit}Edit</button>
          <button class="btn btn-danger" type="button" data-action="confirm-del-meal" data-id="${m.id}">${ICON.trash}Delete</button>
        </div>
        <div class="confirm-box" id="del-confirm" hidden>
          <strong>Delete ${esc(m.name)}?</strong>
          <span class="sub" style="font-size:var(--t-sm)">It also comes off any nights it's planned for.</span>
          <div class="btn-row">
            <button class="btn" type="button" data-action="cancel-confirm">Keep it</button>
            <button class="btn btn-primary" type="button" data-action="del-meal" data-id="${m.id}">Delete meal</button>
          </div>
        </div>`;
    });
  }

  /* Meal editor */
  let draft = null;
  function openEditor(id) {
    const m = id ? mealById(id) : null;
    draft = {
      id: m ? m.id : null,
      emoji: m ? m.emoji : '🍛',
      tags: m ? m.tags.slice() : [],
      name: m ? m.name : '',
      minutes: m ? m.minutes : 30,
      ingredients: m ? m.ingredients.map(i => `${i.qty ? i.qty + ' ' : ''}${i.name}`).join('\n') : '',
      notes: m ? (m.notes || '') : ''
    };
    openSheet(editorHTML);
  }

  function readDraftFields() {
    const f = id => $(id);
    if (!f('#f-name')) return;
    draft.name = f('#f-name').value;
    draft.minutes = f('#f-min').value;
    draft.ingredients = f('#f-ing').value;
    draft.notes = f('#f-notes').value;
  }

  function editorHTML() {
    return `
      <div class="sheet-head"><div class="grow"><span class="eyebrow">${draft.id ? 'Edit meal' : 'New meal'}</span><h2 class="h2" id="sheet-title">${draft.id ? esc(draft.name) || 'Edit meal' : 'Add a family dinner'}</h2></div>${plate({ emoji: draft.emoji }, 'md')}</div>
      <form class="form" id="meal-form" autocomplete="off">
        <label for="f-name">Name
          <input class="field" id="f-name" required maxlength="60" placeholder="Grandma's pot roast" value="${esc(draft.name)}">
        </label>
        <div class="label">Plate
          <div class="emoji-grid">${SEED.emojis.map(e => `<button type="button" data-action="emoji" data-e="${e}" aria-pressed="${draft.emoji === e}" aria-label="Use ${e}">${e}</button>`).join('')}</div>
        </div>
        <label for="f-min">Total time in minutes <span class="hint">30 or less gets the "Under 30 min" tag</span>
          <input class="field mono" id="f-min" type="number" inputmode="numeric" min="0" max="600" value="${esc(draft.minutes)}" style="max-width:140px">
        </label>
        <div class="label">Good for
          <div class="toggle-wrap">${TAGS.filter(t => t.id !== 'quick').map(t => `<button class="chip" type="button" data-action="toggle-tag" data-t="${t.id}" aria-pressed="${draft.tags.includes(t.id)}">${esc(t.label)}</button>`).join('')}</div>
        </div>
        <label for="f-ing">Ingredients <span class="hint">One per line, amount first: "2 lb chicken thighs". Aisles are sorted for you.</span>
          <textarea class="field" id="f-ing" rows="7" placeholder="2 lb chicken thighs&#10;1 bag baby spinach&#10;1 jar salsa">${esc(draft.ingredients)}</textarea>
        </label>
        <label for="f-notes">Kitchen notes <span class="hint">Temps, shortcuts, how the kids like it</span>
          <textarea class="field" id="f-notes" rows="3" style="min-height:90px">${esc(draft.notes)}</textarea>
        </label>
        <div class="btn-row">
          <button class="btn" type="button" data-action="close-sheet">Cancel</button>
          <button class="btn btn-primary" type="submit">Save meal</button>
        </div>
      </form>`;
  }

  function saveDraft() {
    readDraftFields();
    const name = draft.name.trim();
    if (!name) { $('#f-name').focus(); return; }
    const old = draft.id ? mealById(draft.id) : null;
    const prevAisles = new Map(old ? old.ingredients.map(i => [normName(i.name), i.aisle]) : []);
    const ingredients = draft.ingredients.split('\n').map(parseLine).filter(Boolean)
      .map(i => ({ qty: i.qty, name: i.name.charAt(0).toUpperCase() + i.name.slice(1), aisle: prevAisles.get(normName(i.name)) || guessAisle(i.name) }));
    const minutes = Math.max(0, Math.min(600, parseInt(draft.minutes, 10) || 0));
    const tags = draft.tags.filter(t => t !== 'quick');
    if (minutes && minutes <= 30) tags.unshift('quick');
    const meal = { id: draft.id || 'm-' + uid(), name, emoji: draft.emoji, minutes, tags, ingredients, notes: draft.notes.trim(), fav: old ? old.fav : false };
    change(old ? `Saved ${name}` : `${name} added to your meals`, () => {
      if (old) state.meals[state.meals.indexOf(old)] = meal; else state.meals.push(meal);
    }, { undoable: !old });
    openMeal(meal.id);
  }

  /* Spin the wheel */
  let spin = null;
  let spinTimer = null;
  const SPIN_FILTERS = [{ id: 'all', label: 'Anything' }, { id: 'fav', label: '♥ Favorites' }, { id: 'quick', label: 'Under 30 min' }, { id: 'kid', label: 'Toddler-approved' }, { id: 'protein', label: 'High protein' }];
  const spinFilterFn = f => (f === 'all' ? null : f === 'fav' ? m => m.fav : m => m.tags.includes(f));

  const reelItem = m => `<div class="reel-item">${plate(m, '')}<span class="h2">${esc(m.name)}</span><span class="sub mono" style="font-size:var(--t-sm)">${esc(mealMeta(m))}</span></div>`;

  function openSpin(key) {
    spin = { key, filter: 'all', result: null };
    const d = fromKey(key);
    const when = key === keyOf(today()) ? 'tonight' : DOW_LONG[d.getDay()];
    openSheet(() => `
      <div class="sheet-head"><div class="grow"><span class="eyebrow">Dinner roulette</span><h2 class="h2" id="sheet-title">Spin for ${esc(when)}</h2></div></div>
      <div class="chip-row">${SPIN_FILTERS.map(f => `<button class="chip" type="button" data-action="spin-filter" data-f="${f.id}" aria-pressed="${spin.filter === f.id}">${esc(f.label)}</button>`).join('')}</div>
      <div class="reel" id="reel">${spin.result ? reelItem(spin.result) : `<div class="reel-item">${plate(null, '')}<span class="sub">Spinning…</span></div>`}</div>
      <div class="btn-row">
        <button class="btn" type="button" data-action="spin-again">${ICON.wand}Spin again</button>
        <button class="btn btn-primary" type="button" data-action="spin-accept" id="spin-accept" ${spin.result ? '' : 'disabled'}>Make it ${esc(when)}</button>
      </div>`, (body, refreshed) => { if (!refreshed) runSpin(); });
  }

  function runSpin() {
    if (!spin) return;
    clearTimeout(spinTimer);
    const filterFn = spinFilterFn(spin.filter);
    const pool = state.meals.filter(m => !filterFn || filterFn(m));
    const reel = $('#reel');
    const accept = $('#spin-accept');
    if (!pool.length) {
      reel.innerHTML = `<div class="reel-item">${plate(null, '')}<span class="sub">No meals match that filter yet.</span></div>`;
      spin.result = null;
      if (accept) accept.disabled = true;
      return;
    }
    const exclude = recentMealIds(spin.key, 5);
    if (spin.result) exclude.add(spin.result.id);
    const final = chooseMeal(exclude, filterFn);
    spin.result = null;
    if (accept) accept.disabled = true;

    const steps = [];
    let prev = null;
    for (let i = 0; i < 16; i++) {
      let m = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && m === prev) m = pool[(pool.indexOf(m) + 1) % pool.length];
      steps.push(m);
      prev = m;
    }
    steps.push(final);
    if (reduceMotion()) steps.splice(0, steps.length - 1);

    let i = 0;
    const tick = () => {
      if (!spin) return;
      const r = $('#reel');
      if (!r) return;
      const m = steps[i];
      r.classList.remove('rolling', 'landed');
      r.innerHTML = reelItem(m);
      void r.offsetWidth;
      const last = i === steps.length - 1;
      r.classList.add(last ? 'landed' : 'rolling');
      if (last) {
        spin.result = final;
        const a = $('#spin-accept');
        if (a) a.disabled = false;
        return;
      }
      i++;
      spinTimer = setTimeout(tick, 40 + i * i * 1.15);
    };
    tick();
  }

  /* Settings */
  let confirmReset = false;
  function openSettings() {
    confirmReset = false;
    openSheet(() => {
      const s = state.settings;
      const seg = (action, current, opts) => `<div class="segmented" role="group">${opts.map(([v, l]) => `<button type="button" data-action="${action}" data-v="${v}" aria-pressed="${String(current) === String(v)}">${l}</button>`).join('')}</div>`;
      return `
        <div class="sheet-head"><div class="grow"><span class="eyebrow">Forkcast</span><h2 class="h2" id="sheet-title">Settings</h2></div><button class="btn btn-sm" type="button" data-action="close-sheet">Done</button></div>
        <div class="settings-group">
          <label class="label" for="s-household" style="display:flex;flex-direction:column;gap:6px;font-weight:600;color:var(--muted);font-size:var(--t-sm)">Household name
            <input class="field" id="s-household" maxlength="40" placeholder="The Smith family" value="${esc(s.household)}">
          </label>
          <span class="sub" style="font-size:var(--t-xs)">Shows at the top of the app and on your shopping receipt.</span>
        </div>
        <div class="settings-group">
          <h3 class="h3">Week starts on</h3>
          ${seg('set-week-start', s.weekStart, [[0, 'Sunday'], [1, 'Monday']])}
        </div>
        <div class="settings-group">
          <h3 class="h3">Appearance</h3>
          ${seg('set-theme', s.theme, [['system', 'Match phone'], ['dark', 'Dark'], ['light', 'Light']])}
        </div>
        <div class="settings-group">
          <h3 class="h3">Put it on your Home Screen</h3>
          <div class="tip">${ICON.home}<span>In Safari, tap the Share button, then <b>Add to Home Screen</b>. Forkcast opens full screen like an app and keeps working without signal in the store.</span></div>
        </div>
        <div class="settings-group">
          <h3 class="h3">Your data</h3>
          <span class="sub" style="font-size:var(--t-sm)">Everything is saved on this phone. Export a backup to move it to another device.</span>
          <div class="btn-row">
            <button class="btn btn-sm" type="button" data-action="export">${ICON.share}Export backup</button>
            <button class="btn btn-sm" type="button" data-action="import">Import backup</button>
          </div>
          <input type="file" id="import-file" accept="application/json,.json" hidden>
          <div class="btn-row">
            <button class="btn btn-sm btn-danger" type="button" data-action="confirm-reset">${ICON.trash}Clear plan and list</button>
          </div>
          <div class="confirm-box" ${confirmReset ? '' : 'hidden'}>
            <strong>Clear every planned night and the whole shopping list?</strong>
            <span class="sub" style="font-size:var(--t-sm)">Your meal library stays.</span>
            <div class="btn-row">
              <button class="btn btn-sm" type="button" data-action="cancel-reset">Keep everything</button>
              <button class="btn btn-sm btn-primary" type="button" data-action="do-reset">Clear it</button>
            </div>
          </div>
        </div>`;
    });
  }

  function applyTheme() {
    const t = state.settings.theme;
    if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && bg) meta.setAttribute('content', bg);
  }

  /* Share + export */
  function listText() {
    const todo = state.groceries.filter(g => !g.done);
    const lines = [`Grocery list${state.settings.household.trim() ? ' · ' + state.settings.household.trim() : ''}`];
    AISLES.forEach(a => {
      const items = todo.filter(g => g.aisle === a.id);
      if (!items.length) return;
      lines.push('', a.label.toUpperCase());
      items.forEach(g => lines.push(`• ${g.name}${g.qty ? ` (${g.qty})` : ''}`));
    });
    return lines.join('\n');
  }

  function showTextSheet(title, text, note) {
    openSheet(() => `
      <div class="sheet-head"><div class="grow"><h2 class="h2" id="sheet-title">${esc(title)}</h2></div></div>
      <p class="sub">${esc(note)}</p>
      <textarea class="field mono" id="text-out" rows="12" readonly>${esc(text)}</textarea>
      <div class="btn-row"><button class="btn btn-primary" type="button" data-action="copy-text">Copy</button><button class="btn" type="button" data-action="close-sheet">Done</button></div>`);
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  }

  async function shareList() {
    const text = listText();
    if (navigator.share) {
      try { await navigator.share({ title: 'Grocery list', text }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    if (await copyText(text)) { toast('List copied. Paste it into a text.'); return; }
    showTextSheet('Grocery list', text, 'Copy this and send it to whoever is doing the shopping.');
  }

  async function exportData() {
    const json = JSON.stringify(state, null, 2);
    const name = `forkcast-backup-${keyOf(today())}.json`;
    try {
      const file = new File([json], name, { type: 'application/json' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Forkcast backup' }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try {
      const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast('Backup downloaded');
    } catch (e) {
      showTextSheet('Backup', json, 'Copy this text and keep it somewhere safe. Import it on another device to restore.');
    }
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.meals)) throw new Error('bad file');
        change('Backup restored', () => { state = normalize(data); });
        applyTheme();
        closeSheet();
      } catch (e) {
        toast("That file isn't a Forkcast backup. Choose the .json file you exported.");
      }
    };
    reader.readAsText(file);
  }

  /* Confetti for "we made it" */
  function confetti() {
    if (reduceMotion()) return;
    const c = document.createElement('canvas');
    c.className = 'confetti';
    const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const colors = ['--tomato', '--saffron', '--basil', '--a-dairy', '--a-baby'].map(v => css.getPropertyValue(v).trim());
    const bits = Array.from({ length: 90 }, () => ({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.38,
      vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 13 - 4,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 3 + Math.random() * 4,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
    const t0 = performance.now();
    (function frame(t) {
      const age = t - t0;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach(b => {
        b.vy += 0.42; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
        ctx.globalAlpha = Math.max(0, 1 - age / 1600);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      if (age < 1600) requestAnimationFrame(frame); else c.remove();
    })(t0);
  }

  /* ---------- Events ---------- */
  let groceryRenderTimer = null;

  const actions = {
    'open-settings': () => openSettings(),
    'close-sheet': () => closeSheet(),
    'undo': () => { const fn = undoFn; undoFn = null; $('#toast').hidden = true; if (fn) fn(); },

    'open-day': el => openDay(el.dataset.key),
    'pick': el => openPicker(el.dataset.key),
    'assign': el => assign(el.dataset.key, el.dataset.id),
    'clear-day': el => { closeSheet(); change('Night cleared', () => { delete state.plan[el.dataset.key]; }); },
    'cook': el => {
      const k = el.dataset.key;
      change(null, () => { if (state.plan[k]) state.plan[k].cooked = true; });
      refreshSheet();
      confetti();
      toast('Dinner is served. Marked as cooked.');
    },
    'uncook': el => { const k = el.dataset.key; change(null, () => { if (state.plan[k]) state.plan[k].cooked = false; }); refreshSheet(); },
    'start-fresh': () => change('Sample week cleared. The plan is yours.', () => { state.plan = {}; state.groceries = []; state.built = []; state.sample = false; }),

    'week-prev': () => { ui.weekOffset--; render(); },
    'week-next': () => { ui.weekOffset++; render(); },
    'week-today': () => { ui.weekOffset = 0; render(); },
    'autofill': () => {
      const todayKey = keyOf(today());
      const days = weekDays(ui.weekOffset).filter(d => keyOf(d) >= todayKey && !state.plan[keyOf(d)]);
      if (!days.length) return toast('Every night from today on is already planned.');
      change(`Planned ${plural(days.length, 'night')}`, () => {
        days.forEach(d => {
          const k = keyOf(d);
          const weeknight = d.getDay() >= 1 && d.getDay() <= 4;
          const exclude = recentMealIds(k, 6);
          const quickFn = weeknight ? m => m.minutes <= 30 || m.tags.includes('slow') : null;
          const pick = chooseMeal(exclude, quickFn) || chooseMeal(exclude, null);
          if (pick) state.plan[k] = { mealId: pick.id, cooked: false };
        });
      });
    },
    'build-week': () => {
      const todayKey = keyOf(today());
      const keys = weekDays(ui.weekOffset).map(keyOf).filter(k => k >= todayKey);
      let n = 0;
      change('', () => { n = sendPlanToList(keys); });
      toast(`Added ingredients for ${plural(n, 'dinner')}`, null);
      $('#grocery-badge').animate && $('#grocery-badge').animate([{ transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 400 });
    },
    'build-upcoming': () => {
      let n = 0;
      const snap = JSON.stringify(state);
      n = sendPlanToList(upcomingKeys());
      save(); render();
      toast(`Added ingredients for ${plural(n, 'dinner')}`, () => { state = normalize(JSON.parse(snap)); save(); render(); });
    },

    'toggle-item': el => {
      const g = state.groceries.find(x => x.id === el.dataset.id);
      if (!g) return;
      g.done = !g.done;
      save();
      const row = el.closest('.item');
      row.classList.toggle('is-done', g.done);
      row.classList.remove('pop'); void row.offsetWidth; row.classList.add('pop');
      el.setAttribute('aria-pressed', g.done);
      const left = state.groceries.filter(x => !x.done).length;
      const badge = $('#grocery-badge');
      badge.hidden = !left; badge.textContent = left;
      clearTimeout(groceryRenderTimer);
      groceryRenderTimer = setTimeout(() => {
        if (ui.tab === 'grocery') render();
        if (!left && state.groceries.length) { confetti(); toast('Everything is in the cart.'); }
      }, reduceMotion() ? 0 : 650);
    },
    'del-item': el => {
      const g = state.groceries.find(x => x.id === el.dataset.id);
      if (g) change(`Removed ${g.name}`, () => { state.groceries = state.groceries.filter(x => x !== g); });
    },
    'staple': el => {
      const norm = normName(el.dataset.name);
      const existing = state.groceries.find(g => !g.done && normName(g.name) === norm);
      if (existing) change(`Removed ${existing.name}`, () => { state.groceries = state.groceries.filter(g => g !== existing); });
      else change(`Added ${el.dataset.name}`, () => { addGrocery({ name: el.dataset.name, aisle: el.dataset.aisle }); });
    },
    'clear-cart': () => {
      const n = state.groceries.filter(g => g.done).length;
      change(`Cleared ${plural(n, 'item')} from the cart`, () => { state.groceries = state.groceries.filter(g => !g.done); });
    },
    'share-list': () => shareList(),
    'copy-text': async () => {
      const ta = $('#text-out');
      if (await copyText(ta.value)) toast('Copied');
      else { ta.focus(); ta.select(); toast('Selected. Use Copy from the menu.'); }
    },

    'meal-filter': el => { ui.mealFilter = el.dataset.f; render(); },
    'picker-filter': el => {
      ui.pickerFilter = el.dataset.f;
      document.querySelectorAll('[data-action="picker-filter"]').forEach(c => c.setAttribute('aria-pressed', c.dataset.f === ui.pickerFilter));
      const list = $('#picker-list');
      list.innerHTML = pickerListHTML(list.dataset.key);
    },
    'open-meal': el => openMeal(el.dataset.id),
    'fav': el => {
      const m = mealById(el.dataset.id);
      if (!m) return;
      m.fav = !m.fav;
      save();
      if (ui.tab === 'meals' && !sheet) {
        el.setAttribute('aria-pressed', m.fav);
        el.classList.remove('burst'); void el.offsetWidth; el.classList.add('burst');
      } else { render(); refreshSheet(); }
    },
    'add-ings': el => {
      const m = mealById(el.dataset.id);
      if (!m) return;
      change(`Added ${plural(m.ingredients.length, 'ingredient')} for ${m.name}`, () => {
        m.ingredients.forEach(i => addGrocery({ name: i.name, qty: i.qty, aisle: i.aisle, source: m.id }));
      });
    },
    'plan-meal': el => {
      const k = el.dataset.key, id = el.dataset.id;
      const mine = state.plan[k] && state.plan[k].mealId === id;
      const d = fromKey(k);
      change(mine ? `Took it off ${DOW_LONG[d.getDay()]}` : `Planned for ${DOW_LONG[d.getDay()]}`, () => {
        if (mine) delete state.plan[k]; else state.plan[k] = { mealId: id, cooked: false };
      });
      refreshSheet();
    },
    'new-meal': () => openEditor(null),
    'edit-meal': el => openEditor(el.dataset.id),
    'confirm-del-meal': () => { const box = $('#del-confirm'); box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); },
    'cancel-confirm': () => { $('#del-confirm').hidden = true; },
    'del-meal': el => {
      const id = el.dataset.id;
      const m = mealById(id);
      closeSheet();
      change(`Deleted ${m ? m.name : 'meal'}`, () => {
        state.meals = state.meals.filter(x => x.id !== id);
        Object.keys(state.plan).forEach(k => { if (state.plan[k].mealId === id) delete state.plan[k]; });
      });
    },
    'emoji': el => {
      readDraftFields();
      draft.emoji = el.dataset.e;
      refreshSheet();
    },
    'toggle-tag': el => {
      readDraftFields();
      const t = el.dataset.t;
      draft.tags = draft.tags.includes(t) ? draft.tags.filter(x => x !== t) : draft.tags.concat(t);
      refreshSheet();
    },

    'spin': el => openSpin(el.dataset.key),
    'spin-again': () => runSpin(),
    'spin-filter': el => { spin.filter = el.dataset.f; spin.result = null; refreshSheet(); runSpin(); },
    'spin-accept': () => { if (spin && spin.result) assign(spin.key, spin.result.id); },

    'set-week-start': el => { state.settings.weekStart = Number(el.dataset.v); save(); render(); refreshSheet(); },
    'set-theme': el => { state.settings.theme = el.dataset.v; save(); applyTheme(); refreshSheet(); },
    'export': () => exportData(),
    'import': () => $('#import-file').click(),
    'confirm-reset': () => { confirmReset = true; refreshSheet(); },
    'cancel-reset': () => { confirmReset = false; refreshSheet(); },
    'do-reset': () => {
      confirmReset = false;
      closeSheet();
      change('Plan and list cleared', () => { state.plan = {}; state.groceries = []; state.built = []; state.sample = false; });
    }
  };

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action], [data-tab]');
    if (!el || el.disabled) return;
    if (el.dataset.action) {
      const fn = actions[el.dataset.action];
      if (fn) { e.preventDefault(); fn(el, e); }
    } else if (el.dataset.tab) {
      if (sheet) closeSheet();
      setTab(el.dataset.tab);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sheet) closeSheet();
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.meal-card[role="button"]')) { e.preventDefault(); e.target.click(); }
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    if (e.target.id === 'add-form') {
      const input = $('#add-item');
      const lines = input.value.split(/[,\n]/).map(parseLine).filter(Boolean);
      if (!lines.length) return;
      change(lines.length === 1 ? `Added ${lines[0].name}` : `Added ${lines.length} items`, () => {
        lines.forEach(l => addGrocery({ name: l.name.charAt(0).toUpperCase() + l.name.slice(1), qty: l.qty }));
      });
      const again = $('#add-item');
      if (again) again.focus();
    } else if (e.target.id === 'meal-form') {
      saveDraft();
    }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'meal-q') { ui.mealQuery = e.target.value; $('#meal-grid').innerHTML = mealGridHTML(); }
    if (e.target.id === 'picker-q') { ui.pickerQuery = e.target.value; const l = $('#picker-list'); l.innerHTML = pickerListHTML(l.dataset.key); }
    if (e.target.id === 's-household') { state.settings.household = e.target.value; save(); $('#household-label').textContent = e.target.value.trim() || 'Family dinner planner'; }
  });

  document.addEventListener('change', e => {
    if (e.target.id === 'import-file' && e.target.files[0]) importData(e.target.files[0]);
  });

  window.addEventListener('scroll', () => { $('.topbar').classList.toggle('scrolled', window.scrollY > 4); }, { passive: true });

  // Re-render when the app comes back (the date may have rolled over)
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !sheet) render(); });

  window.addEventListener('storage', e => { if (e.key === STORE_KEY && e.newValue) { state = normalize(JSON.parse(e.newValue)); render(); } });

  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onScheme = () => applyTheme();
    if (mq.addEventListener) mq.addEventListener('change', onScheme); else if (mq.addListener) mq.addListener(onScheme);
  }

  /* ---------- Boot ---------- */
  state = load();
  if (!state) {
    state = freshState();
    seedSampleWeek();
    save();
  }
  const start = (location.hash || '').replace('#', '');
  if (VIEWS[start]) ui.tab = start;
  applyTheme();
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
