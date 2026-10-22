// Homepage – web kanceláře slouží k náběru zakázek: představí kancelář, makléře a jejich práci.
// Nabídka nemovitostí je až níž jako ukázka prezentace; hledání je štíhlá sekundární lišta pod hero.
const HERO = { tgh: { src: 'assets/hero-praha-2400.jpg', set: 'assets/hero-praha-1280.jpg 1280w, assets/hero-praha-2400.jpg 2400w' } };
HERO.test = HERO.tgh;
const HP_CARDS = 4; // ukázka nabídky – víc karet by z homepage dělalo inzertní server

// Zhuštěný postup prodeje – texty vychází z PROCESS na stránce Chci prodat (prodat.js)
const STEPS = [
  ['Nacenění a strategie', 'Stanovíme reálnou cenu nemovitosti a nastavíme prodejní strategii podle vašich požadavků.'],
  ['Příprava prezentace', 'Nemovitost nafotíme, natočíme a popíšeme tak, aby vynikly všechny její důležité přednosti.'],
  ['Inzerce a prohlídky', 'Nabídku umístíme na důležité realitní servery, oslovíme poptávající z naší databáze a provedeme zájemce prohlídkou.'],
  ['Smlouvy a předání', 'Připravíme smlouvy a podklady, zajistíme vklad do katastru a předání nemovitosti včetně přepisu energií.'],
];

// Značky zdrojů hodnocení – vlastní inline SVG / textový odznak, nic se nehotlinkuje.
// Produkce: použít oficiální podklady podle pravidel značek Google a Firmy.cz.
const MARK = {
  Google: '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.5z"/></svg>',
  'Firmy.cz': '<span class="hp-mark-firmy" aria-hidden="true">Firmy.cz</span>',
};
const rateLabel = src => (MARK[src] ? `na ${src}` : src); // „4,5 na Google“, u obecného zdroje jen jeho název
function rating(r) {
  const mark = MARK[r.src]; // obecný zdroj (např. „Hodnocení klientů“) = bez značky, jen hvězda
  const isText = r.src === 'Firmy.cz';
  return `<div class="hp-rate${isText ? ' hp-rate--text' : ''}${mark ? '' : ' hp-rate--plain'}">${mark ? `<span class="hp-rate__mark">${mark}</span>` : ''}`
    + `<b>${String(r.v).replace('.', ',')}</b><span class="stars" aria-hidden="true">${ico('star')}</span>`
    + `<small${isText ? ' class="sr-only"' : ''}>${esc(rateLabel(r.src))}</small></div>`;
}

const refCity = r => r.c || r.city || ''; // CMS musí město dodat – dnes ho data nemají
const initial = n => n.replace(/^(Ing|Mgr|Bc|MUDr|JUDr|PhDr|RNDr)\.\s*/, '')[0];

window.PAGE = {
  note: 'Reference: město se zobrazí, jen když ho CMS pošle (pole c / city) – dnešní data ho nemají. Počty u lokality na homepage jsou simulované; výpis počítá nad reálnými daty.',
  render(key) {
    const o = OFFICES[key];
    const dk = dataKey(key);
    document.title = `Prodej a pronájem nemovitostí ${o.region} | ${o.name}`;
    // TGH: původní hero z webu kanceláře měl nízkou kvalitu → stock Praha při západu slunce (Magnific, premium licence, autor tan4ikk)
    const hero = HERO[key];
    $$('[data-bind="hero"]').forEach(i => { i.srcset = hero?.set || ''; i.sizes = '100vw'; i.src = hero?.src || o.hero; });
    $$('[data-bind="region"]').forEach(e => (e.textContent = o.region));
    $$('[data-bind="total"]').forEach(e => (e.textContent = o.total));
    $$('[data-all]').forEach(a => (a.href = href('vypis.html')));

    // hero: tváře makléřů + hodnocení = důvěra hned na prvním pohledu
    const faces = o.agents.slice(0, 4);
    $('#hero-faces').innerHTML = `<span class="hp-faces__img">${faces.map(a => `<img src="${esc(a.img)}" alt="" width="40" height="40">`).join('')}</span><span>Seznamte se s&nbsp;našimi makléři</span>`;
    $('#hero-ratings').innerHTML = o.ratings.map(rating).join('');

    // proč s námi – jen čísla, která kancelář opravdu má
    const sold = (window.SOLD?.[dk] || []);
    const stats = [[o.total, 'nemovitostí právě nabízíme pro naše klienty']];
    if (sold.length) stats.push([sold.length, 'realizovaných nemovitostí']);
    if (o.satisfied) stats.push([o.satisfied, 'spokojených klientů']);
    stats.push(['až 100', 'realitních serverů, kde vaši nemovitost inzerujeme'], ['od 2006', 'tradice značky NEXT Reality']);
    $('#stats').innerHTML = stats.slice(0, 4).map(([b, s]) => `<div class="hp-stat"><b>${esc(b)}</b><span>${s}</span></div>`).join('');

    $('#steps').innerHTML = STEPS.map(([h, p]) => `<li><h3>${h}</h3><p>${p}</p></li>`).join('');

    $('#agents').innerHTML = o.agents.map(a => `<article class="agent">
      <div class="agent__photo"><img src="${esc(a.img)}" alt="" loading="lazy"></div>
      <div class="agent__body">
        <h3 class="agent__name"><a href="${href('makleri.html')}">${esc(a.n)}</a></h3>
        <p class="agent__role">${esc(a.r)}</p>
        <div class="agent__contact">
          <a href="tel:${a.tel.replace(/\s/g, '')}">${ico('phone')}<span>${esc(a.tel)}</span></a>
          <a href="mailto:${esc(a.mail)}">${ico('mail')}<span>${esc(a.mail)}</span></a>
        </div>
      </div></article>`).join('');

    // reference: tři vedle sebe, „Jméno · Město“, dlouhý text sbalený na 5 řádků s tlačítkem
    $('#ratings').innerHTML = o.ratings.map(rating).join('');
    $('#refs').innerHTML = o.refs.slice(0, 3).map((r, i) => {
      const city = refCity(r);
      return `<figure class="ref hp-ref">
        ${ico('quote', 'icon icon--lg hp-ref__q')}
        <blockquote id="ref-q-${i}">„${esc(r.q)}“</blockquote>
        <button type="button" class="hp-ref__more" aria-expanded="false" aria-controls="ref-q-${i}" hidden>Číst celou referenci</button>
        <figcaption><span class="ref__avatar" aria-hidden="true">${esc(initial(r.n))}</span>
          <span><b>${esc(r.n)}${city ? `<span class="hp-ref__city"> · ${esc(city)}</span>` : ''}</b>${r.d ? `<span>${esc(r.d)}</span>` : ''}</span></figcaption>
      </figure>`;
    }).join('');
    refClamp();

    // realizováno – důkaz práce; kancelář bez realizací v datech sekci nezobrazí
    $('#realizovano').hidden = !sold.length;
    if (sold.length) {
      $('#sold-lead').textContent = `Na webu máme ${sold.length} realizovaných nemovitostí. Tady jsou některé z nich.`;
      // nadpis mluví o prodeji → přednostně prodané, ne pronajaté (štítek „Prodáno“ u pronájmu by mátl)
      const show = [...sold.filter(x => !x.rent), ...sold.filter(x => x.rent)];
      $('#sold').innerHTML = show.slice(0, HP_CARDS).map(x => card({ ...x, st: 'sold' })).join('');
    }

    $('#cards').innerHTML = o.listings.slice(0, HP_CARDS).map(x => card(x)).join('');
    // developerské projekty jen jako odkaz – nejsou jádrem webu kanceláře
    $('#projects').hidden = !o.projects.length;
    $('#projects').innerHTML = `${ico('projekt')}<span><b>Developerské projekty:</b> ${o.projects.map(p => `<a href="${href('projekty.html')}">${esc(p.n)}</a>`).join(', ')}</span>`
      + `<a class="hp-projects__all" href="${href('projekty.html')}">Všechny projekty ${ico('arrow')}</a>`;

    $('#office-contact').innerHTML = [
      `<div>${ico('projekt')}<span>${esc(o.name)}</span></div>`,
      o.address ? `<div>${ico('pin')}<span>${esc(o.address)}</span></div>` : '',
      o.phone ? `<a href="tel:${o.phone}">${ico('phone')}${esc(o.phone)}</a>` : '',
      o.email ? `<a href="mailto:${o.email}">${ico('mail')}${esc(o.email)}</a>` : '',
      `<a href="${href('makleri.html')}">${ico('people')}<span>Kontakty na makléře</span></a>`,
    ].join('');
    updateCount(true);
  },
  checks() {
    const cta = $('#hero-cta').getBoundingClientRect().bottom + scrollY;
    const find = $('.hp-find').getBoundingClientRect().top + scrollY;
    const tops = $$('#refs .ref').map(c => Math.round(c.getBoundingClientRect().top));
    const perRow = tops.filter(t => t === tops[0]).length;
    const cards = $$('#cards .pcard').length;
    return check('Odhad ceny nad ohybem', cta < innerHeight, Math.round(cta) + ' / ' + innerHeight)
      + check('Hledání nad ohybem', innerWidth >= 768 ? find < innerHeight : null, Math.round(find) + ' px')
      + check('Referencí v řadě', innerWidth >= 768 ? perRow === 3 : null, perRow + (innerWidth >= 768 ? ' (cíl 3)' : ''))
      + check('Karet nabídky ≤ 4', cards <= HP_CARDS, cards);
  },
  init() {
    // rychlý odhad na homepage → průvodce na stránce Chci prodat
    $('#estimate').addEventListener('submit', e => { e.preventDefault(); location.href = href('prodat.html') + '#odhad'; });
    // rozbalení dlouhé reference na místě
    $('#refs').addEventListener('click', e => {
      const b = e.target.closest('.hp-ref__more'); if (!b) return;
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.closest('.ref').classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', open);
      b.textContent = open ? 'Sbalit referenci' : 'Číst celou referenci';
    });
    addEventListener('resize', () => { clearTimeout(refClamp.t); refClamp.t = setTimeout(refClamp, 150); });
    document.fonts?.ready.then(refClamp);
    addEventListener('load', refClamp, { once: true });

    $$('[data-deal]').forEach(b => b.addEventListener('click', () => { $$('[data-deal]').forEach(x => x.setAttribute('aria-pressed', x === b)); updateCount(); }));
    $('#f-type').addEventListener('change', () => updateCount());
    // odeslání hledání → výpis s filtry (dispozice a další filtry jsou až ve výpisu)
    $('#search').addEventListener('submit', e => {
      e.preventDefault();
      const p = new URLSearchParams();
      if ($('[data-deal="pronajem"]').getAttribute('aria-pressed') === 'true') p.set('deal', 'pronajem');
      if ($('#f-type').value) p.set('type', $('#f-type').value);
      if ($('#f-loc').value.trim()) p.set('loc', $('#f-loc').value.trim());
      location.href = href('vypis.html', p.toString() ? '&' + p : '');
    });
    // našeptávač
    const loc = $('#f-loc'), sug = $('#suggest'), list = $('#suggest-list');
    loc.addEventListener('input', () => {
      const o = OFFICES[office];
      const q = loc.value.trim().toLowerCase();
      const hits = (q ? o.suggest.filter(([n]) => n.toLowerCase().includes(q)) : o.suggest).slice(0, 6);
      list.innerHTML = hits.length
        ? hits.map(([n, t]) => {
            const i = n.toLowerCase().indexOf(q);
            const label = q && i > -1 ? esc(n.slice(0, i)) + '<mark>' + esc(n.slice(i, i + q.length)) + '</mark>' + esc(n.slice(i + q.length)) : esc(n);
            return `<li role="option">${ico(t === 'projekt' ? 'projekt' : 'pin')}<span>${label}</span><small>${t}</small></li>`;
          }).join('')
        : `<li aria-disabled="true" style="cursor:default;color:var(--text-muted)">Nic nenalezeno – zkuste obec nebo ulici</li>`;
      sug.classList.add('is-open'); loc.setAttribute('aria-expanded', 'true');
      updateCount();
    });
    loc.addEventListener('focus', () => loc.dispatchEvent(new Event('input')));
    list.addEventListener('mousedown', e => { const li = e.target.closest('li[role=option]'); if (!li) return; loc.value = li.querySelector('span').textContent; updateCount(); });
    loc.addEventListener('blur', () => setTimeout(() => { sug.classList.remove('is-open'); loc.setAttribute('aria-expanded', 'false'); }, 120));
  },
};

// Tlačítko „Číst celou referenci“ jen u textu, který se do 5 řádků nevejde
function refClamp() {
  $$('#refs .ref').forEach(f => {
    if (f.classList.contains('is-open')) return;
    const q = $('blockquote', f);
    $('.hp-ref__more', f).hidden = q.scrollHeight <= q.clientHeight + 2;
  });
}

// Živý počet výsledků (kategorie = reálné počty, pronájem / lokalita = simulace)
function updateCount(instant) {
  const o = OFFICES[office];
  const type = $('#f-type').value;
  let n = type ? o.cats[type] : o.total;
  if (n == null) n = Math.round(o.total * 0.08);
  if ($('[data-deal="pronajem"]').getAttribute('aria-pressed') === 'true') n = Math.max(1, Math.round(n * 0.18));
  if ($('#f-loc').value.trim()) n = Math.max(1, Math.round(n * 0.3));
  const btn = $('#search-btn');
  if (instant) { $('#live-count').textContent = nab(n, true); return; }
  btn.classList.add('is-loading');
  clearTimeout(updateCount.t);
  updateCount.t = setTimeout(() => { btn.classList.remove('is-loading'); $('#live-count').textContent = nab(n, true); }, 250);
}
