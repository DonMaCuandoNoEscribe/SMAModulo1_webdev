// ---------- DATA (swap with your pipeline outputs) ----------
const DATA = {
  kpis: {
    sideoutPct: 0.63,
    pointServePct: 0.48,
    hitEff: 0.245,
    recvQuality: 2.18,
    blocksPerSet: 2.1,
    serveErrorPct: 0.12,
    series: {
      so: [0.55,0.61,0.58,0.65,0.66,0.63,0.64,0.62],
      ps: [0.42,0.45,0.47,0.48,0.46,0.49,0.50,0.48],
      eff:[0.18,0.21,0.19,0.24,0.27,0.25,0.26,0.245]
    }
  },
  rotation: {
    // Ensure >=30pp spread for visual clarity
    sideout:   [0.44,0.52,0.74,0.63,0.58,0.47],
    pointserve:[0.30,0.38,0.62,0.51,0.46,0.33]
  },
  serveTargetOpp: { zones: [0.12,0.27,0.10,0.08,0.26,0.17] },
  receiveQualityByZone: { avg: [1.45,2.70,1.60,2.80,1.95,2.20] },
  setterDistribution: {
    roles: ["OH1","MB1","OP","OH2","MB2"],
    byRotation: [
      [0.36,0.22,0.24,0.12,0.06],
      [0.34,0.24,0.26,0.10,0.06],
      [0.30,0.28,0.26,0.10,0.06],
      [0.32,0.24,0.28,0.10,0.06],
      [0.35,0.22,0.27,0.10,0.06],
      [0.33,0.23,0.29,0.09,0.06],
    ]
  },
  attackEfficiencyByZone: {
    zones: ["4L","3M","2R","5BL","6BM","1BR"],
    eff:   [0.12,0.33,0.28,0.06,0.22,0.18]
  },
  runLengths: { bins: [0.28,0.24,0.18,0.12,0.08,0.06,0.04] }, // 1..7+
  onOff: { players: ["OH1","OH2","MB1","MB2","OP","S"], plusMinus: [ -5.0, +3.8, +8.5, -2.5, +1.2, +6.9 ] }
};

// ---------- helpers ----------
function el(tag, attrs={}, parent){
  const n = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==="text") n.textContent = v; else n.setAttribute(k,v);
  }
  if(parent) parent.appendChild(n);
  return n;
}
const minmax = arr => [Math.min(...arr), Math.max(...arr)];
const fmtPct = x => (x*100).toFixed(0) + "%";
const fmt1 = x => x.toFixed(1);
const lerp = (a,b,t)=> a+(b-a)*t;
const colorScaleLoHi = t => `hsl(${lerp(0,120,t)} 70% 55%)`; // 0=red, 120=green

// Traffic-light palette + helpers for fixed thresholds
const COLORS = { bad: "hsl(0 75% 55%)", warn: "hsl(45 92% 58%)", good: "hsl(135 70% 52%)" };
function trafficColor(value, thresholds){
  const [tBad, tGood] = thresholds;
  return value < tBad ? COLORS.bad : (value < tGood ? COLORS.warn : COLORS.good);
}
// Qualitative cool palette (categorical)
const COOL_ZONE_COLORS = [
  'hsl(200 75% 60%)','hsl(210 75% 60%)','hsl(220 75% 60%)',
  'hsl(230 75% 60%)','hsl(240 75% 60%)','hsl(250 75% 60%)'
];

// Consistent bar styling
const BAR_STYLE = { rx: 8, stroke: '#ffffff22', strokeWidth: 1 };

// ---------- KPIs ----------
function renderKPIs(){
  const row = document.getElementById("kpiRow");
  const {sideoutPct, pointServePct, hitEff, recvQuality, blocksPerSet, serveErrorPct, series} = DATA.kpis;
  const items = [
    {name:"SO%", val: fmtPct(sideoutPct), spark: series.so},
    {name:"PS%", val: fmtPct(pointServePct), spark: series.ps},
    {name:"Efic. Ataque", val: (hitEff*100).toFixed(1)+"%", spark: series.eff},
    {name:"Rec. 0–3", val: recvQuality.toFixed(2)},
    {name:"Bloq/Set", val: fmt1(blocksPerSet)},
    {name:"Err Saque", val: fmtPct(serveErrorPct)},
  ];
  row.innerHTML = "";
  items.forEach(it => {
    const card = document.createElement("div");
    card.className = "kpi";
    card.innerHTML = `<div class="name">${it.name}</div><div class="val">${it.val}</div>`;
    if(it.spark){
      const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("class","spark");
      const w = 220, h = 36, pad=6;
      svg.setAttribute("viewBox",`0 0 ${w} ${h}`);
      const [mn,mx] = minmax(it.spark);
      const xs = it.spark.map((_,i)=> pad + i*( (w-2*pad)/(it.spark.length-1) ));
      const ys = it.spark.map(v => h-pad - ( (v-mn)/(mx-mn+1e-9) )*(h-2*pad) );
      for(let i=1;i<xs.length;i++){
        el("line",{x1:xs[i-1], y1:ys[i-1], x2:xs[i], y2:ys[i], stroke:"#ffffffcc", "stroke-width":1.5}, svg);
      }
      card.appendChild(svg);
    }
    row.appendChild(card);
  });
}

// ---------- Rotation heatmap ----------
function renderRotationHeatmap(mode="so"){
  const cont = document.getElementById("rotationHeatmap");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 560 160"}, cont);
  for(let x=0;x<=6;x++) el("line",{x1: x*80+40, y1:30, x2: x*80+40, y2:130, class:"gridline"}, svg);
  el("line",{x1:40, y1:130, x2:520, y2:130, class:"gridline"}, svg);

  const vals = mode==="so" ? DATA.rotation.sideout : DATA.rotation.pointserve;
  const thr = mode==="so" ? [0.55, 0.65] : [0.45, 0.55];
  const baseY = 130;
  const maxH = 90; // pixels
  vals.forEach((v,i)=>{
    const fill = trafficColor(v, thr);
    const x = 40 + i*80;
    const h = Math.max(4, v * maxH);
    const y = baseY - h;
    el("rect",{x:x-30, y, width:60, height:h, fill, rx: BAR_STYLE.rx, stroke: BAR_STYLE.stroke, 'stroke-width': BAR_STYLE.strokeWidth}, svg);
    el("text",{x:x, y:45, "text-anchor":"middle", fill:"#ccd2ff", "font-size":"12", text:`R${i+1}`}, svg);
    el("text",{x:x, y:118, "text-anchor":"middle", fill:"#eef2ff", "font-size":"14", "font-weight":"700", text: fmtPct(v)}, svg);
  });
}

// ---------- Serve target heatmap ----------
function renderServeTarget(){
  const cont = document.getElementById("serveTargetHeatmap");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 360 220"}, cont);
  const vals = DATA.serveTargetOpp.zones;
  const zoneNames = ["1","2","3","4","5","6"];
  const baseY = 180;
  const maxH = 110; // pixels
  el("line",{x1:24, y1:baseY, x2:336, y2:baseY, class:"gridline"}, svg);
  zoneNames.forEach((z,i)=>{
    const v = vals[i];
    const fill = COOL_ZONE_COLORS[i % COOL_ZONE_COLORS.length];
    const x = 30 + i*55;
    const h = Math.max(6, (v / Math.max(...vals)) * maxH);
    const y = baseY - h;
    el("rect",{x, y, width:45, height:h, fill, rx: BAR_STYLE.rx, stroke: BAR_STYLE.stroke, 'stroke-width': BAR_STYLE.strokeWidth}, svg);
    el("text",{x: x+22.5, y:50, "text-anchor":"middle", fill:"#ccd2ff", "font-size":"12", text:`Zona ${z}`}, svg);
    el("text",{x: x+22.5, y:baseY-20, "text-anchor":"middle", fill:"#eef2ff", "font-size":"13", "font-weight":"700", text:(v*100).toFixed(0)+"%"}, svg);
  });
}

// ---------- Receive quality bars ----------
function renderReceiveQuality(){
  const cont = document.getElementById("receiveQualityBars");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 420 240"}, cont);
  const vals = DATA.receiveQualityByZone.avg; // 0..3
  const maxY = 3.0;
  vals.forEach((v,i)=>{
    const x = 36 + i*62;
    const h = (v/maxY)*160;
    const y = 190 - h;
    el("rect",{x, y, width:48, height:h, fill: trafficColor(v, [1.8, 2.3]), rx: BAR_STYLE.rx, stroke: BAR_STYLE.stroke, 'stroke-width': BAR_STYLE.strokeWidth}, svg);
    el("text",{x:x+24, y:210, "text-anchor":"middle", fill:"#ccd2ff", "font-size":"12", text:`Z${i+1}`}, svg);
    el("text",{x:x+24, y:y-6, "text-anchor":"middle", fill:"#eef2ff", "font-size":"12", text:v.toFixed(2)}, svg);
  });
  el("line",{x1:24, y1:190, x2:400, y2:190, class:"gridline"}, svg);
}

// ---------- Setter distribution (stacked) ----------
function renderSetterDistribution(){
  const cont = document.getElementById("setterDistribution");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 520 260"}, cont);
  const roles = DATA.setterDistribution.roles;
  const rows = DATA.setterDistribution.byRotation;
  const colors = roles.map((_,i)=> `hsl(${(i/(roles.length-1||1))*120} 70% 55%)`);

  rows.forEach((row,rIdx)=>{
    let x = 40;
    row.forEach((p,i)=>{
      const w = p*400;
      el("rect",{x, y: 40 + rIdx*32, width:w, height:24, fill: colors[i]}, svg);
      x += w;
    });
    el("text",{x: 20, y: 57 + rIdx*32, "text-anchor":"end", fill:"#ccd2ff", "font-size":"12", text:`R${rIdx+1}`}, svg);
  });

  roles.forEach((name,i)=>{
    const x = 40 + i*85;
    el("rect",{x, y: 230, width:12, height:12, fill: colors[i]}, svg);
    el("text",{x: x+18, y: 240, fill:"#eef2ff", "font-size":"12", text:name}, svg);
  });
}

// ---------- Attack efficiency by zone ----------
function renderAttackEfficiency(){
  const cont = document.getElementById("attackEfficiencyBars");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 520 260"}, cont);
  const zones = DATA.attackEfficiencyByZone.zones;
  const eff = DATA.attackEfficiencyByZone.eff;

  zones.forEach((z,i)=>{
    const v = eff[i];
    const x = 40 + i*70;
    const mn = Math.min(0, ...eff);
    const mx = Math.max(...eff);
    const h = ((v - Math.min(0,mn)) / (mx - Math.min(0,mn) + 1e-9)) * 180;
    const y = 210 - h;
    el("rect",{x, y, width:56, height:h, fill: trafficColor(v, [0.20, 0.27]), rx: BAR_STYLE.rx, stroke: BAR_STYLE.stroke, 'stroke-width': BAR_STYLE.strokeWidth}, svg);
    el("text",{x:x+28, y:230, "text-anchor":"middle", fill:"#ccd2ff", "font-size":"12", text:z}, svg);
    el("text",{x:x+28, y:y-6, "text-anchor":"middle", fill:"#eef2ff", "font-size":"12", text:(v*100).toFixed(1)+"%"}, svg);
  });
  el("line",{x1:30, y1:210, x2:500, y2:210, class:"gridline"}, svg);
}

// ---------- Run length histogram ----------
function renderRunLengthHist(){
  const cont = document.getElementById("runLengthHist");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 520 240"}, cont);
  const p = DATA.runLengths.bins; // 1..7+
  const maxP = Math.max(...p);
  p.forEach((v,i)=>{
    const x = 40 + i*64;
    const h = (v/maxP)*150;
    const y = 180 - h;
    el("rect",{x, y, width:48, height:h, fill: `hsl(${(v/maxP)*120} 70% 55%)`}, svg);
    const lbl = (i<6 ? (i+1) : "7+");
    el("text",{x:x+24, y:200, "text-anchor":"middle", fill:"#ccd2ff", "font-size":"12", text:lbl}, svg);
    el("text",{x:x+24, y:y-6, "text-anchor":"middle", fill:"#eef2ff", "font-size":"12", text:(v*100).toFixed(0)+"%"}, svg);
  });
  el("line",{x1:30, y1:180, x2:500, y2:180, class:"gridline"}, svg);
}

// ---------- On/Off impact ----------
function renderOnOff(){
  const cont = document.getElementById("onOffBars");
  cont.innerHTML = "";
  const svg = el("svg",{viewBox:"0 0 520 260"}, cont);
  const names = DATA.onOff.players;
  const vals = DATA.onOff.plusMinus;
  const maxAbs = Math.max(...vals.map(v=>Math.abs(v))) || 1;

  names.forEach((n,i)=>{
    const v = vals[i];
    const cx = 260; // zero line center
    const scale = 200 / maxAbs;
    const w = Math.abs(v) * scale;
    const x = v >= 0 ? cx : cx - w;
    const y = 36 + i*32;
    el("rect",{x, y, width:w, height:22, fill: v>=0 ? "hsl(135 70% 52%)" : "hsl(0 70% 55%)"}, svg);
    el("text",{x:20, y:y+16, "text-anchor":"start", fill:"#eef2ff", "font-size":"12", text:n}, svg);
    el("text",{x: v>=0 ? x+w+6 : x-6, y:y+16, "text-anchor": v>=0 ? "start" : "end", fill:"#ccd2ff", "font-size":"12", text: (v>0?"+":"")+v.toFixed(1)}, svg);
  });
  el("line",{x1:260, y1:20, x2:260, y2:230, class:"gridline"}, svg);
}

// ---------- interactions ----------
function wireTabs(){
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(t => t.addEventListener("click", () => {
    tabs.forEach(a => a.classList.remove("active"));
    t.classList.add("active");
    renderRotationHeatmap(t.getAttribute("data-rot-mode"));
  }));
}

// ---------- init ----------
renderKPIs();
renderRotationHeatmap("so");
renderServeTarget();
renderReceiveQuality();
renderSetterDistribution();
renderAttackEfficiency();
renderRunLengthHist();
renderOnOff();
wireTabs();
