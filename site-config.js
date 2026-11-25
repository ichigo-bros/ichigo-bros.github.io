/* 運営用設定：販売状態・価格・入数はこのファイルで変更します。 */
window.FARM_CONFIG = {
  // selling: 販売中 / preorder: 予約受付 / paused: 休止中
  salesStatus: 'selling',
  reopening: '11月下旬〜6月上旬の販売を予定しています。',
  reservationShipping: '発送時期は、ご予約確認の際にお知らせします。',
  // 準備中の商品がある間、告知バーに添える案内。全商品の価格が確定したら空にしてください。
  comingSoon: 'スカイベリー、ミルキーベリー、ミックス、DXは準備ができ次第販売します。',
  // ご自宅用（お届け先＝注文者）の場合に、送り主として使う農園の情報。
  farmSender: { name: 'いちご兄弟農園', tel: '08055493814', zip: '3230056', addr: '栃木県小山市上泉明地67' },
  // price: null は準備中（表示は「準備中」、注文フォームでは数量を入力できません）。確定後に税込円の数値を設定してください。
  products: [
    { id: 'regular-red', group: 'regular', label: 'とちおとめ／とちあいか', price: 800, packs: 1, variants: ['とちおとめ', 'とちあいか'] },
    { id: 'regular-sky', group: 'regular', label: 'スカイベリー', price: null, packs: 1, variants: ['スカイベリー'] },
    { id: 'regular-white', group: 'regular', label: 'ミルキーベリー', price: null, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'regular-mix', group: 'regular', label: 'お好みの品種＋ミルキー', price: null, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'sp-red', group: 'sp', label: 'とちおとめ／とちあいか', price: 1000, packs: 1, variants: ['とちおとめ', 'とちあいか'] },
    { id: 'sp-sky', group: 'sp', label: 'スカイベリー', price: null, packs: 1, variants: ['スカイベリー'] },
    { id: 'sp-white', group: 'sp', label: 'ミルキーベリー', price: null, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'sp-mix', group: 'sp', label: 'お好みの品種＋ミルキー', price: null, packs: 1, variants: ['とちおとめ＋ミルキー', 'とちあいか＋ミルキー', 'スカイベリー＋ミルキー'] },
    { id: 'dx-red', group: 'dx', label: 'とちおとめ／とちあいか／スカイベリー', price: null, packs: 1, variants: ['とちおとめ', 'とちあいか', 'スカイベリー'] },
    { id: 'dx-mix', group: 'dx', label: 'ミックス（とちおとめ・とちあいか・スカイベリー）', price: null, packs: 1, variants: ['ミックス（とちおとめ・とちあいか・スカイベリー）'] },
    { id: 'dx-milky-mix', group: 'dx', label: '赤い2種類＋ミルキーベリー1列', price: null, packs: 1, variants: ['ミックス＋ミルキー'], choices: ['とちおとめ＋とちあいか＋ミルキーベリー1列', 'とちおとめ＋スカイベリー＋ミルキーベリー1列', 'とちあいか＋スカイベリー＋ミルキーベリー1列'] },
    { id: 'dx-white', group: 'dx', label: 'ミルキーベリー', price: null, packs: 1, variants: ['ミルキーベリー'] },
    { id: 'otoku-small', group: 'otoku', label: 'お徳用パック（小）', price: 300, packs: 1, variants: [] },
    { id: 'otoku-large', group: 'otoku', label: 'お徳用パック（大）', price: 1000, packs: 1, variants: [] }
  ]
};
