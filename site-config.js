/* 運営用設定：販売状態・価格・入数はこのファイルで変更します。 */
window.FARM_CONFIG = {
  // selling: 販売中 / preorder: 予約受付 / paused: 休止中
  salesStatus: 'paused',
  reopening: '11月下旬〜6月上旬の販売を予定しています。',
  reservationShipping: '発送時期は、ご予約確認の際にお知らせします。',
  products: [
    { id: 'regular-red', group: 'regular', label: 'とちおとめ／とちあいか／スカイベリー', price: 600, packs: 1, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'regular-white', group: 'regular', label: 'ミルキーベリー', price: 1000, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'regular-mix', group: 'regular', label: 'お好みの品種＋ミルキー', price: 800, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'sp-red', group: 'sp', label: 'とちおとめ／とちあいか／スカイベリー', price: 750, packs: 1, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'sp-white', group: 'sp', label: 'ミルキーベリー', price: 1300, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'sp-mix', group: 'sp', label: 'お好みの品種＋ミルキー', price: 1050, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'dx-red', group: 'dx', label: 'とちおとめ／とちあいか／スカイベリー', price: 1600, packs: 2, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'dx-mix', group: 'dx', label: '各種ミックス（3種まで）', price: 1600, packs: 2, variants: ['ミックス（品種おまかせ・3種まで）'] },
    { id: 'dx-milky-mix', group: 'dx', label: 'ミックス＋ミルキー', price: 2100, packs: 2, variants: ['ミックス＋ミルキー（赤いちごの品種おまかせ）'] },
    { id: 'dx-white', group: 'dx', label: 'ミルキーベリー', price: 3000, packs: 2, variants: ['ミルキーベリー'] },
    { id: 'otoku-small', group: 'otoku', label: 'お徳用パック（小）', price: 300, packs: 1, variants: [] },
    { id: 'otoku-large', group: 'otoku', label: 'お徳用パック（大）', price: 1000, packs: 1, variants: [] }
  ]
};
