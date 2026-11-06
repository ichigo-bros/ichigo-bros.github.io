/* 運営用設定：販売状態・価格・入数はこのファイルで変更します。 */
window.FARM_CONFIG = {
  // selling: 販売中 / preorder: 予約受付 / paused: 休止中
  salesStatus: 'paused',
  reopening: '11月下旬〜6月上旬の販売を予定しています。',
  reservationShipping: '発送時期は、ご予約確認の際にお知らせします。',
  // price: null は価格準備中。確定後に税込円の数値を設定してください。
  products: [
    { id: 'regular-red', group: 'regular', label: 'とちおとめ／とちあいか／スカイベリー', price: null, packs: 1, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'regular-white', group: 'regular', label: 'ミルキーベリー', price: null, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'regular-mix', group: 'regular', label: 'お好みの品種＋ミルキー', price: null, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'sp-red', group: 'sp', label: 'とちおとめ／とちあいか／スカイベリー', price: null, packs: 1, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'sp-white', group: 'sp', label: 'ミルキーベリー', price: null, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'sp-mix', group: 'sp', label: 'お好みの品種＋ミルキー', price: null, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'dx-red', group: 'dx', label: 'とちおとめ／とちあいか／スカイベリー', price: null, packs: 2, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'dx-mix', group: 'dx', label: '赤い3品種からお好みで3種まで', price: null, packs: 2, variants: ['DXミックス'], choices: ['とちおとめ', 'とちあいか', 'スカイベリー', 'とちおとめ＋とちあいか', 'とちおとめ＋スカイベリー', 'とちあいか＋スカイベリー', 'とちおとめ＋とちあいか＋スカイベリー'] },
    { id: 'dx-milky-mix', group: 'dx', label: '赤い2種類＋ミルキーベリー1列', price: null, packs: 2, variants: ['ミックス＋ミルキー'], choices: ['とちおとめ＋とちあいか＋ミルキーベリー1列', 'とちおとめ＋スカイベリー＋ミルキーベリー1列', 'とちあいか＋スカイベリー＋ミルキーベリー1列'] },
    { id: 'dx-white', group: 'dx', label: 'ミルキーベリー', price: null, packs: 2, variants: ['ミルキーベリー'] },
    { id: 'otoku-small', group: 'otoku', label: 'お徳用パック（小）', price: null, packs: 1, variants: [] },
    { id: 'otoku-large', group: 'otoku', label: 'お徳用パック（大）', price: null, packs: 1, variants: [] }
  ]
};
