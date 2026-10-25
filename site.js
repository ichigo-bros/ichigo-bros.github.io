'use strict';
(function () {
  const config = window.FARM_CONFIG;
  if (!config || !Array.isArray(config.products)) return; // 設定が読めない場合は注文を無効のままにする
  const $ = id => document.getElementById(id);
  const form = $('order-form');
  const names = { regular: 'レギュラーパック', sp: 'SPパック', dx: 'DXパック（2パック詰め）' };
  const headings = { regular: 'レギュラーパック（10〜15粒・270g以上）', sp: 'SPパック（大粒1段並べ・300g以上）', dx: 'DXパック（2パック詰め・各12〜15粒）' };
  const timeLabels = { '': '指定なし', '0812': '午前中', '1416': '14〜16時', '1618': '16〜18時', '1820': '18〜20時', '1921': '19〜21時' };
  const payLabels = { bank: '銀行振込（楽天銀行）', cod: '代金引換（現金・クレジットカード・電子マネー）' };
  const yen = n => n.toLocaleString('ja-JP') + '円';
  const value = id => $(id).value.trim();
  const same = () => $('of-same').checked;
  const sender = f => value((same() ? 'of-r' : 'of-s') + f);
  const sale = ['selling', 'preorder'].includes(config.salesStatus) ? config.salesStatus : 'paused';
  const enabled = () => sale !== 'paused';
  const stateText = {
    paused: { notice: '🍓 現在、いちごの販売・ご注文受付は休止中です。次回は' + config.reopening, cta: '販売再開のご案内', mail: 'メール注文は休止中', copy: 'DM用コピーは休止中', shipping: '現在は販売・ご注文受付を休止しています。次回は' + config.reopening },
    selling: { notice: '🍓 今シーズンのいちごを販売中です。直売・配送を承ります。', cta: 'ご注文はこちら', mail: 'メールで注文する', copy: '注文文をコピーする', shipping: 'ご入金確認後（または注文確定後）3営業日以内に発送いたします。' },
    preorder: { notice: '🍓 いちごのご予約を受け付けています。' + config.reservationShipping, cta: 'ご予約はこちら', mail: 'メールで予約する', copy: '予約文をコピーする', shipping: config.reservationShipping }
  }[sale];

  // 商品表とフォームの両方を同じ価格設定から作る
  document.querySelectorAll('[data-price-group]').forEach(table => {
    const body = document.createElement('tbody');
    config.products.filter(p => p.group === table.dataset.priceGroup).forEach(p => {
      const tr = document.createElement('tr');
      const label = document.createElement('td'); label.textContent = p.label;
      const price = document.createElement('td'); price.className = 'yen'; price.textContent = (p.variants.length > 1 ? '各 ' : '') + yen(p.price);
      tr.append(label, price); body.append(tr);
    });
    table.replaceChildren(body);
  });
  const entries = [];
  Object.keys(names).forEach(group => {
    const fieldset = document.createElement('fieldset'); fieldset.className = 'of-group';
    const legend = document.createElement('legend'); legend.textContent = headings[group]; fieldset.append(legend);
    config.products.filter(p => p.group === group).forEach(p => p.variants.forEach((variant, index) => {
      const id = 'qty-' + p.id + '-' + index;
      const row = document.createElement('div'); row.className = 'of-row';
      const label = document.createElement('label'); label.htmlFor = id; label.textContent = variant;
      const price = document.createElement('span'); price.className = 'of-price'; price.textContent = yen(p.price);
      const input = document.createElement('input');
      input.id = id; input.type = 'number'; input.min = '0'; input.max = '30'; input.step = '1'; input.value = '0'; input.inputMode = 'numeric';
      input.setAttribute('aria-label', names[group] + '・' + variant + 'の数量（' + (group === 'dx' ? 'セット' : 'パック') + '）');
      row.append(label, price, input); fieldset.append(row);
      entries.push({ input, product: p, name: names[group] + '／' + variant });
    }));
    $('of-products').append(fieldset);
  });

  document.querySelector('.notice').textContent = stateText.notice;
  $('sales-notice').textContent = stateText.notice.replace('🍓 ', '');
  document.querySelectorAll('[data-order-cta]').forEach(el => { el.textContent = stateText.cta; });
  document.querySelectorAll('[data-shipping-guide]').forEach(el => { el.textContent = stateText.shipping; });
  $('legal-shipping').textContent = sale === 'selling'
    ? '前払いの場合、指定日が無ければ入金確認後3営業日以内に発送します。代金引換の場合、指定日が無ければご注文確認後3営業日以内に発送します。'
    : stateText.shipping;
  $('flow-title').textContent = sale === 'preorder' ? 'ご予約からお届けまで（配送）' : sale === 'paused' ? '販売再開・ご注文のご案内' : 'ご購入までの流れ（配送）';
  $('order-title').textContent = sale === 'preorder' ? '📝 かんたん予約フォーム' : '📝 かんたん注文フォーム';
  $('order-lead').textContent = enabled() ? '品種ごとに数量とお届け先を入力してください。メールまたはInstagram DMを送信した時点で、農園に内容が届きます。' : stateText.shipping + ' 現在はメール用の注文文作成・DM用コピーをご利用いただけません。';
  $('of-mail').textContent = '✉️ ' + stateText.mail;
  $('of-copy').textContent = '📋 ' + stateText.copy;
  $('of-mail').disabled = $('of-copy').disabled = !enabled();
  $('send-help').textContent = enabled()
    ? '入力だけでは注文は送信されません。作成した内容を確認して、メールまたはInstagram DMで送信してください。'
    : '現在は受付休止中のため、メール・コピーのボタンはご利用いただけません。次回は' + config.reopening;

  function today() { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
  $('of-date').min = today();
  function quantity(entry) {
    const raw = entry.input.value.trim();
    if (entry.input.validity.badInput || !/^\d+$/.test(raw)) return null;
    const q = Number(raw); return Number.isInteger(q) && q >= 0 && q <= 30 ? q : null;
  }
  function totals() {
    let total = 0, packs = 0, count = 0, invalid = false;
    entries.forEach(e => { const q = quantity(e); if (q === null) { invalid = true; return; } total += q * e.product.price; packs += q * e.product.packs; count += q; });
    return { total, packs, count, invalid };
  }
  function clearPreview() { $('message-preview').hidden = true; $('order-message').value = ''; $('copy-status').textContent = ''; }
  function refresh() {
    const result = totals(); $('of-total').textContent = result.invalid ? '数量を確認してください' : yen(result.total);
    $('gift-cod-note').hidden = same() || value('of-pay') !== 'cod';
    clearPreview(); $('order-errors').textContent = '';
  }
  function syncSender() {
    $('of-sender').hidden = same();
    $('of-sender').querySelectorAll('input').forEach(el => { el.disabled = same(); el.required = !same(); });
    refresh();
  }
  function normalizeContact(raw) {
    return raw.normalize('NFKC').replace(/[‐‑‒–—―ー−]/g, '-').replace(/[\s()-]/g, '');
  }
  function validate() {
    if (!enabled()) { $('order-errors').textContent = stateText.shipping; return false; }
    $('of-date').min = today();
    form.querySelectorAll('input, select, textarea').forEach(el => el.setCustomValidity(''));
    entries.forEach(e => { if (quantity(e) === null) e.input.setCustomValidity('数量は0〜30の整数で入力してください。'); });
    if (!totals().invalid && totals().count === 0) entries[0].input.setCustomValidity('商品を1点以上選んでください。');
    ['r', ...(same() ? [] : ['s'])].forEach(prefix => {
      ['name', 'addr'].forEach(f => { const el = $('of-' + prefix + f); el.value = el.value.trim(); if (!el.value) el.setCustomValidity('入力してください。'); });
      ['tel', 'zip'].forEach(f => {
        const el = $('of-' + prefix + f); el.value = normalizeContact(el.value);
        if (!(f === 'tel' ? /^0\d{9,10}$/ : /^\d{7}$/).test(el.value)) el.setCustomValidity(f === 'tel' ? '電話番号を0から始まる10〜11桁で入力してください。' : '郵便番号を7桁で入力してください。');
      });
    });
    if (value('of-date') && value('of-date') < today()) $('of-date').setCustomValidity('過去の日付は選べません。');
    if (!form.checkValidity()) {
      $('order-errors').textContent = '入力内容を確認してください。数量は0〜30の整数、お届け先とご依頼主の各項目は必須です。';
      form.reportValidity(); return false;
    }
    $('order-errors').textContent = ''; return true;
  }
  function build() {
    const result = totals();
    const date = value('of-date');
    const dateLabel = date ? date.split('-').map((s, i) => i ? Number(s) : s).join('/') : '指定なし';
    const lines = ['いちご兄弟農園 ' + (sale === 'preorder' ? 'ご予約希望' : 'ご注文希望'), '', '【ご注文内容】'];
    entries.forEach(e => { const q = quantity(e); if (q > 0) lines.push('・' + e.name + ' × ' + q + (e.product.group === 'dx' ? 'セット' : 'パック')); });
    lines.push('商品合計：' + yen(result.total) + '（税込・送料別）', '', '【お届け先】', 'お名前：' + value('of-rname'), 'お電話番号：' + value('of-rtel'), '郵便番号：' + value('of-rzip'), 'ご住所：' + value('of-raddr'), '', '【ご依頼主（送り主）】');
    if (same()) lines.push('お届け先と同じ');
    else lines.push('お名前：' + sender('name'), 'お電話番号：' + sender('tel'), '郵便番号：' + sender('zip'), 'ご住所：' + sender('addr'));
    lines.push('', '【配送のご希望】', 'お届け日：' + dateLabel, '時間帯：' + timeLabels[value('of-time')], 'お支払い方法：' + payLabels[value('of-pay')]);
    if (!same() && value('of-pay') === 'cod') lines.push('※代金引換のため、お届け先の受取人がお支払いします。');
    if (sale === 'preorder') lines.push('発送時期：' + config.reservationShipping);
    if (value('of-memo')) lines.push('品種のご希望・備考：' + value('of-memo'));
    const csv = [date.replace(/-/g, '/'), value('of-time'), value('of-rtel'), value('of-rzip'), value('of-raddr'), value('of-rname'), sender('tel'), sender('zip'), sender('addr'), sender('name'), 'いちご ' + result.packs + 'パック'].map(s => '"' + s.replace(/"/g, '""') + '"').join(',');
    lines.push('', '▼店舗用・ヤマトB2取込データ（お届け日,時間帯ｺｰﾄﾞ,届け先TEL,〒,住所,氏名,依頼主TEL,〒,住所,氏名,品名）', csv);
    return lines.join('\n');
  }
  function preview(message) { $('message-preview').hidden = false; $('order-message').value = message; }
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', e => { if (e.target.setCustomValidity) e.target.setCustomValidity(''); refresh(); });
  form.addEventListener('change', refresh);
  $('of-same').addEventListener('change', syncSender);
  $('of-mail').addEventListener('click', () => {
    clearPreview(); if (!validate()) return;
    const msg = build(); preview(msg);
    $('copy-status').textContent = 'メールアプリが開かない場合は、下の文章を手動でコピーしてメールに貼り付けてください。';
    window.location.href = 'mailto:ichigo.brothers@gmail.com?subject=' + encodeURIComponent('いちごの' + (sale === 'preorder' ? 'ご予約' : 'ご注文') + '（' + sender('name') + '）') + '&body=' + encodeURIComponent(msg);
  });
  $('of-copy').addEventListener('click', async () => {
    clearPreview(); if (!validate()) return;
    const msg = build(); preview(msg);
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(msg);
      if ($('order-message').value !== msg) return;
      $('copy-status').textContent = 'コピーしました。「Instagramを開く」からDMに貼り付けて送信してください。';
    } catch (_) {
      if ($('order-message').value !== msg) return;
      $('copy-status').textContent = '自動コピーできませんでした。下の文章を選択し、手動でコピーしてください。';
      $('order-message').focus(); $('order-message').select();
    }
  });
  $('select-message').addEventListener('click', () => { $('order-message').focus(); $('order-message').select(); });
  syncSender();
})();

/* フィードのURLは既存のものを継続利用。失敗時は手動の画像を残す。 */
(async function () {
  const BEHOLD_FEED_URL = 'https://feeds.behold.so/QarVyzzlJm2PSsWcTt8V';
  function safeUrl(raw, instagramOnly) {
    if (typeof raw !== 'string') return null;
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:' || url.username || url.password) return null;
      if (instagramOnly && !['instagram.com', 'www.instagram.com'].includes(url.hostname)) return null;
      return url.href;
    } catch (_) { return null; }
  }
  try {
    const response = await fetch(BEHOLD_FEED_URL);
    if (!response.ok) return;
    const data = await response.json();
    const posts = Array.isArray(data) ? data : data && data.posts;
    if (!Array.isArray(posts)) return;
    const fragment = document.createDocumentFragment();
    let count = 0;
    for (const p of posts.slice(0, 30)) {
      if (!p || typeof p !== 'object') continue;
      const src = [p.thumbnailUrl, p.sizes && p.sizes.medium && p.sizes.medium.mediaUrl, p.mediaUrl].map(v => safeUrl(v, false)).find(Boolean);
      const link = p.permalink ? safeUrl(p.permalink, true) : 'https://www.instagram.com/ichigo_brothers/';
      if (!src || !link) continue;
      const a = document.createElement('a'); a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
      const img = document.createElement('img'); img.src = src; img.alt = 'いちご兄弟農園のInstagram投稿 ' + (count + 1); img.loading = 'lazy'; img.width = 320; img.height = 320;
      img.addEventListener('error', () => { img.src = 'images/hero.jpg'; }, { once: true });
      a.append(img); fragment.append(a);
      if (++count === 6) break;
    }
    if (count) document.getElementById('insta-grid').replaceChildren(fragment);
  } catch (_) { /* 通信・JSONエラーでも静的なギャラリーを維持 */ }
})();
