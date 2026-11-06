'use strict';
// 商品ごとの写真を、ページの長さを増やさずに閲覧する。
(function () {
  if (typeof HTMLDialogElement === 'undefined') return;
  document.querySelectorAll('.gallery-source').forEach(source => {
    const figures = [...source.querySelectorAll('figure')];
    if (!figures.length) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'photo-dialog';
    const titleId = source.id + '-dialog-title';
    dialog.setAttribute('aria-labelledby', titleId);
    dialog.innerHTML = `<header class="gallery-header"><div><p>PRODUCT GALLERY</p><h2 id="${titleId}"></h2></div><button class="gallery-close" type="button" aria-label="写真を閉じる" autofocus>×</button></header><div class="gallery-body"><div class="gallery-stage"></div><div class="gallery-info"><div class="gallery-caption" aria-live="polite"><h3></h3><p></p></div><div><p class="gallery-picker-label">品種・詰め方を選ぶ</p><div class="gallery-picker" role="group" aria-label="写真を選ぶ"></div></div><div class="gallery-controls"><button type="button" data-step="-1" aria-label="前の写真">←</button><span class="gallery-counter"></span><button type="button" data-step="1" aria-label="次の写真">→</button></div></div></div>`;
    dialog.querySelector('h2').textContent = source.dataset.galleryTitle;
    dialog.querySelector('.gallery-picker-label').textContent = source.dataset.galleryPickerLabel || '品種・詰め方を選ぶ';
    const items = figures.map(figure => {
      const caption = figure.querySelector('figcaption');
      const lower = !!figure.closest('.layer-guide');
      const box = !!figure.closest('.boxing-example');
      const title = lower ? (figure.querySelector('img').alt.startsWith('赤') ? '赤いいちごの下段' : 'ミルキーベリーの下段') : box ? '2パックの箱詰め例' : caption.querySelector('strong').textContent;
      const description = lower ? '下段のみを撮影した説明用写真です。完成品は、この上にもう1段重ねた上下2段組みです。' : box ? caption.textContent : caption.querySelector('span')?.textContent || source.dataset.galleryDescription || '上下2段組みのレギュラーパックです。';
      const clone = figure.cloneNode(true);
      const frame = clone.querySelector('.product-photo');
      if (frame) { const parts = frame.style.aspectRatio.split('/').map(Number); frame.style.setProperty('--crop-ratio', String(parts[0] / (parts[1] || 1))); }
      clone.querySelectorAll('img').forEach(img => {
        // 初めて選択したときだけ画像を読み込む。
        img.dataset.src = img.getAttribute('src');
        img.removeAttribute('src');
        img.loading = 'eager';
      });
      return { title, description, figure: clone };
    });
    let current = 0, trigger = null, priorOverflow = '';
    const picker = dialog.querySelector('.gallery-picker');
    const buttons = items.map((item, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = item.title;
      button.addEventListener('click', () => show(index));
      picker.append(button); return button;
    });
    function show(index) {
      current = (index + items.length) % items.length;
      const item = items[current];
      item.figure.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; delete img.dataset.src; });
      dialog.querySelector('.gallery-stage').replaceChildren(item.figure);
      dialog.querySelector('.gallery-caption h3').textContent = item.title;
      dialog.querySelector('.gallery-caption p').textContent = item.description;
      dialog.querySelector('.gallery-counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
      const selected = buttons[current];
      picker.scrollLeft += selected.getBoundingClientRect().left - picker.getBoundingClientRect().left - (picker.clientWidth - selected.clientWidth) / 2;
    }
    function open(link) {
      if (dialog.open) return;
      trigger = link || document.activeElement;
      priorOverflow = document.body.style.overflow;
      dialog.showModal(); document.body.style.overflow = 'hidden'; show(0);
    }
    dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => show(current + Number(button.dataset.step))));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); }
    });
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.style.overflow = priorOverflow;
      if (location.hash === '#' + source.id) history.replaceState(null, '', location.pathname + location.search + '#price');
      if (trigger instanceof HTMLElement && trigger !== document.body) trigger.focus({ preventScroll: true });
    });
    document.body.append(dialog);
    document.querySelectorAll(`a[href="#${source.id}"]`).forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', event => { event.preventDefault(); open(link); });
    });
    source.hidden = true;
    const deepLink = () => { if (location.hash === '#' + source.id) open(document.querySelector(`a[href="#${source.id}"]`)); };
    window.addEventListener('hashchange', deepLink);
    deepLink();
  });
})();
