// Homepage – vykreslení z dat kanceláře, našeptávač, živý počet.
const CATS = [['byt', 'Byty'], ['dum', 'Domy'], ['pozemek', 'Pozemky'], ['komercni', 'Komerční'], ['ostatni', 'Ostatní']];

window.PAGE = {
  note: 'Počty u lokality a dispozice jsou na homepage simulované; výpis počítá nad reálnými daty.',
  render(key) {
    const o = OFFICES[key];
    document.title = `Reality a nemovitosti ${o.region} | ${o.name}`;
    $$('[data-bind="hero"]').forEach(i => (i.src = o.hero));
    $$('[data-bind="region"]').forEach(e => (e.textContent = o.region));
    $$('[data-bind="total"]').forEach(e => (e.textContent = o.total));

    $('#cats').innerHTML = CATS.map(([k, l]) => `<a class="cat" href="${href('vypis.html', '&type=' + k)}"><span class="cat__ico">${ico(k)}</span><span><b>${l}</b>${o.cats[k] != null ? `<span>${o.cats[k]} nabídek</span>` : '<span>Zobrazit</span>'}</span></a>`).join('')
      + `<a class="cat" href="#projekty"><span class="cat__ico">${ico('projekt')}</span><span><b>Projekty</b><span>${o.projects.length} v prodeji</span></span></a>`;
    $('#cards').innerHTML = o.listings.map(x => card(x)).join('');
    $$('[data-all]').forEach(a => (a.href = href('vypis.html')));

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

    $('#ratings').innerHTML = o.ratings.map(r => `<div class="rating"><b>${String(r.v).replace('.', ',')}</b><span class="stars">${ico('star')}</span><small>${esc(r.src)}</small></div>`).join('');
    $('#refs').innerHTML = o.refs.map(r => `<figure class="ref" style="margin:0"><blockquote>„${esc(r.q)}“</blockquote>
      <footer><span class="ref__avatar">${esc(r.n.replace(/^(Ing|Mgr|Bc)\.\s*/, '')[0])}</span><span><b>${esc(r.n)}</b>${r.d ? `<span>${esc(r.d)}</span>` : ''}</span></footer></figure>`).join('');

    $('#projects').innerHTML = o.projects.map(p => `<article class="project">
      <div class="project__media"><img src="${esc(p.img)}" alt="" loading="lazy"><div class="pcard__badges"><span class="badge badge--free">V prodeji</span></div></div>
      <div class="project__body"><h3 class="t-h3"><a href="${href('projekty.html')}">${esc(p.n)}</a></h3>${p.d ? `<p>${esc(p.d)}</p>` : ''}</div></article>`).join('');

    const sold = (window.SOLD?.[dataKey(key)] || []).length;
    const stats = [['od 2006', 'tradice značky NEXT Reality'], ['až 100', 'realitních serverů pro inzerci'], [o.total, 'nemovitostí v aktuální nabídce']];
    if (sold) stats.push([sold, 'realizovaných nemovitostí na mapě']);
    else if (o.satisfied) stats.push([o.satisfied, 'spokojených klientů']);
    $('#stats').innerHTML = stats.map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('');

    $('#office-contact').innerHTML = [
      `<div>${ico('projekt')}<span>${esc(o.name)}</span></div>`,
      o.address ? `<div>${ico('pin')}<span>${esc(o.address)}</span></div>` : '',
      o.phone ? `<a href="tel:${o.phone}">${ico('phone')}${esc(o.phone)}</a>` : '',
      o.email ? `<a href="mailto:${o.email}">${ico('mail')}${esc(o.email)}</a>` : '',
    ].join('');
    updateCount(true);
  },
  checks() {
    const next = $('#nabidka').getBoundingClientRect().top + scrollY;
    const tops = $$('#cards .pcard').map(c => Math.round(c.getBoundingClientRect().top));
    const perRow = tops.filter(t => t === tops[0]).length;
    const hs = $$('#cards .pcard').filter(c => Math.round(c.getBoundingClientRect().top) === tops[0]).map(c => c.offsetHeight);
    return check('Další sekce nad ohybem', next < innerHeight, Math.round(next) + ' / ' + innerHeight)
      + check('Karet v řadě', innerWidth >= 1440 ? perRow >= 4 : null, perRow + (innerWidth >= 1440 ? ' (cíl 4)' : ''))
      + check('Stejná výška karet', new Set(hs).size === 1, [...new Set(hs)].join('/') + ' px');
  },
  init() {
    // rychlý odhad na homepage → průvodce na stránce Chci prodat
    $('#estimate').addEventListener('submit', e => { e.preventDefault(); location.href = href('prodat.html') + '#odhad'; });
    $$('[data-deal]').forEach(b => b.addEventListener('click', () => { $$('[data-deal]').forEach(x => x.setAttribute('aria-pressed', x === b)); updateCount(); }));
    $$('#disp-field .chip').forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true'); updateCount(); }));
    $('#f-type').addEventListener('change', () => updateCount());
    // odeslání hledání → výpis s filtry
    $('#search').addEventListener('submit', e => {
      e.preventDefault();
      const p = new URLSearchParams();
      if ($('[data-deal="pronajem"]').getAttribute('aria-pressed') === 'true') p.set('deal', 'pronajem');
      if ($('#f-type').value) p.set('type', $('#f-type').value);
      if ($('#f-loc').value.trim()) p.set('loc', $('#f-loc').value.trim());
      const d = $$('#disp-field .chip[aria-pressed="true"]').map(c => c.textContent.replace('4+ a větší', '4+'));
      if (d.length) p.set('disp', d.join(','));
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

// Živý počet výsledků (kategorie = reálné počty, dispozice/lokalita = simulace)
function updateCount(instant) {
  const o = OFFICES[office];
  const type = $('#f-type').value;
  let n = type ? o.cats[type] : o.total;
  const disp = $$('#disp-field .chip[aria-pressed="true"]').length;
  if (n == null) n = Math.round(o.total * 0.08);
  if ($('[data-deal="pronajem"]').getAttribute('aria-pressed') === 'true') n = Math.max(1, Math.round(n * 0.18));
  if (disp) n = Math.max(1, Math.round(n * Math.min(1, disp * 0.22)));
  if ($('#f-loc').value.trim()) n = Math.max(1, Math.round(n * 0.3));
  $('#disp-field').style.display = !type || type === 'byt' ? '' : 'none';
  const btn = $('#search-btn');
  if (instant) { $('#live-count').textContent = nab(n, true); return; }
  btn.classList.add('is-loading');
  clearTimeout(updateCount.t);
  updateCount.t = setTimeout(() => { btn.classList.remove('is-loading'); $('#live-count').textContent = nab(n, true); }, 250);
}
