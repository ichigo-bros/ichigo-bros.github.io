'use strict';
// 農園指定の送料。クール便・資材・消費税込み。
(function (root) {
  const regions = [
    ['北海道', ['北海道'], [1500,1800,2300,2800]],
    ['北東北', ['青森県','秋田県','岩手県'], [1200,1500,2000,2500]],
    ['南東北・関東・信越・北陸・中部', ['宮城県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','神奈川県','東京都','山梨県','新潟県','長野県','富山県','石川県','福井県','静岡県','愛知県','三重県','岐阜県'], [1100,1400,1900,2400]],
    ['関西', ['大阪府','京都府','滋賀県','奈良県','和歌山県','兵庫県'], [1200,1500,2000,2500]],
    ['中国・四国', ['岡山県','広島県','山口県','鳥取県','島根県','香川県','徳島県','愛媛県','高知県'], [1300,1600,2100,2600]],
    ['九州', ['福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県'], [1500,1800,2300,2800]],
    ['沖縄', ['沖縄県'], [1800,2500,3200,4200]]
  ];
  const sizes = {four:[80,80,100,100,120,120],two:[60,80,100,100,100,100],flat:[60,80,80,100,100,100]};
  const labels = {four:'4P箱',two:'2P箱',flat:'平箱'};
  function calculate(counts, prefecture) {
    for(const key of ['regular','dx','sp'])if(!Number.isSafeInteger(counts[key]) || counts[key]<0 || counts[key]>10000)throw new Error('数量が不正です');
    const region=regions.find(r=>r[1].includes(prefecture));
    if(!region)return null;
    const boxes={four:counts.dx+(counts.regular>2?Math.ceil(counts.regular/4):0),two:counts.regular>0&&counts.regular<=2?1:0,flat:Math.ceil(counts.sp/2)};
    // 大きい箱から順にまとめ、6箱ごとに分ける。DXとレギュラーは別箱。
    const units=Object.keys(boxes).flatMap(type=>Array(boxes[type]).fill(type));
    const parcels=[];
    for(let i=0;i<units.length;i+=6){
      const group=units.slice(i,i+6), size=Math.max(...group.map(type=>sizes[type][group.length-1]));
      const contents=Object.keys(boxes).map(type=>({type,count:group.filter(t=>t===type).length})).filter(x=>x.count);
      parcels.push({size,fee:region[2][[60,80,100,120].indexOf(size)],contents});
    }
    return {boxes,parcels,total:parcels.reduce((sum,p)=>sum+p.fee,0)};
  }
  root.FARM_SHIPPING={regions,sizes,labels,calculate};
})(typeof window==='undefined'?globalThis:window);
