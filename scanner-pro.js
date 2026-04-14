// ═══════════════════════════════════════════════════════════════
// AC369 SCANNER PRO v5
// Dynamic fetch semua koin Binance · Outperform BTC 2x (24-48h)
// Inverse BTC · Volume Anomali · R:R 1:2 Enforced
// Scalping 15m + Swing Daily · Multi-Layer Probability
// ═══════════════════════════════════════════════════════════════

const STABLES_SET = new Set([
  "USDT","USDC","BUSD","DAI","TUSD","USDP","FDUSD","FRAX",
  "LUSD","USDD","GUSD","SUSD","CUSD","XUSD","OUSD","EURS"
]);

// ── PHASE 1: DYNAMIC FETCH ALL USDT TRADEABLE ───────────────────
async function fetchAllCoins() {
  const [tickerRes, infoRes] = await Promise.allSettled([
    fetch('https://api.binance.com/api/v3/ticker/24hr'),
    fetch('https://api.binance.com/api/v3/exchangeInfo'),
  ]);

  // Valid trading symbols
  const tradingSet = new Set();
  if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
    const info = await infoRes.value.json();
    info.symbols
      .filter(s => s.status === 'TRADING' && s.quoteAsset === 'USDT')
      .forEach(s => tradingSet.add(s.baseAsset));
  }

  if (tickerRes.status !== 'fulfilled' || !tickerRes.value.ok)
    throw new Error('Gagal fetch ticker Binance');

  const all = await tickerRes.value.json();
  const map = {};

  const coins = all
    .filter(t => {
      if (!t.symbol.endsWith('USDT')) return false;
      const base = t.symbol.replace('USDT', '');
      if (STABLES_SET.has(base)) return false;
      // Skip leverage & inverse tokens
      if (/UP$|DOWN$|BULL$|BEAR$|LONG$|SHORT$|\dL$|\dS$/.test(base)) return false;
      if (base.includes('USDT')) return false;
      if (tradingSet.size > 0 && !tradingSet.has(base)) return false;
      const vol = +t.quoteVolume;
      return vol > 200000 && +t.lastPrice > 0;
    })
    .map(t => {
      const base = t.symbol.replace('USDT', '');
      const coin = {
        ticker:  base,
        price:   +t.lastPrice,
        ch24:    +t.priceChangePercent,
        vol24:   +t.quoteVolume,
        high24:  +t.highPrice,
        low24:   +t.lowPrice,
        count:   +t.count,
        open24:  +t.openPrice,
      };
      map[base] = coin;
      return coin;
    })
    .sort((a, b) => b.vol24 - a.vol24);

  return { coins, map };
}

// ── PHASE 2: FETCH 48h DATA FOR OUTPERFORM DETECTION ────────────
// Uses 2d kline to get yesterday + today performance
async function fetch48hChange(ticker) {
  try {
    const r = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=1d&limit=3`
    );
    if (!r.ok) return null;
    const kl = await r.json();
    if (!Array.isArray(kl) || kl.length < 2) return null;
    const open48 = +kl[0][1]; // open 2 days ago
    const close  = +kl[kl.length - 1][4]; // latest close
    const ch48   = open48 > 0 ? (close - open48) / open48 * 100 : null;
    const ch24   = kl.length >= 2 ? (+kl[kl.length-1][4] - +kl[kl.length-2][4]) / +kl[kl.length-2][4] * 100 : null;
    return { ch48, ch24 };
  } catch (_) { return null; }
}

// ── PHASE 3: ANOMALY DETECTION ENGINE ───────────────────────────
// Primary: outperform BTC ≥ 2x in 24h AND/OR 48h
// Secondary: inverse BTC, volume spike, decorrelated
function detectAnomalies(coins, coinMap, btc24, btc48) {
  const anomalies = [];

  coins.forEach(c => {
    if (c.ticker === 'BTC' || c.ticker === 'ETH') return;
    const flags = [];
    let score = 0;

    // ── OUTPERFORM BTC (PRIMARY SIGNAL) ──────────────────────
    // 24h outperform
    if (btc24 !== 0) {
      const ratio24 = c.ch24 / (Math.abs(btc24) || 0.01);
      if (c.ch24 > 0 && ratio24 >= 4) {
        flags.push({ type:'OUTPERFORM_4X', label:`+${c.ch24.toFixed(1)}% vs BTC ${btc24.toFixed(1)}% (${ratio24.toFixed(1)}x)`, score:12 });
        score += 12;
      } else if (c.ch24 > 0 && ratio24 >= 2) {
        flags.push({ type:'OUTPERFORM_2X', label:`+${c.ch24.toFixed(1)}% outperform BTC ${ratio24.toFixed(1)}x`, score:9 });
        score += 9;
      }
    }

    // 48h outperform (uses prefetched data if available)
    if (c.ch48 != null && btc48 != null && btc48 !== 0) {
      const ratio48 = c.ch48 / (Math.abs(btc48) || 0.01);
      if (c.ch48 > 0 && ratio48 >= 3) {
        flags.push({ type:'OUTPERFORM_48H', label:`48h: +${c.ch48.toFixed(1)}% vs BTC (${ratio48.toFixed(1)}x)`, score:10 });
        score += 10;
      } else if (c.ch48 > 0 && ratio48 >= 2) {
        flags.push({ type:'OUTPERFORM_48H', label:`48h outperform ${ratio48.toFixed(1)}x`, score:7 });
        score += 7;
      }
    }

    // ── INVERSE BTC ───────────────────────────────────────────
    if (btc24 < -1.5 && c.ch24 > 2) {
      flags.push({ type:'INVERSE_BTC', label:`Naik ${c.ch24.toFixed(1)}% saat BTC -${Math.abs(btc24).toFixed(1)}%`, score:10 });
      score += 10;
    }
    if (btc24 < -0.5 && c.ch24 > 4) {
      flags.push({ type:'STRENGTH_BTC_DOWN', label:`Strong +${c.ch24.toFixed(1)}% saat BTC lemah`, score:7 });
      score += 7;
    }

    // ── DECORRELATED ─────────────────────────────────────────
    if (Math.abs(btc24) < 1 && c.ch24 > 6) {
      flags.push({ type:'DECORRELATED_UP', label:`+${c.ch24.toFixed(1)}% mandiri (BTC flat)`, score:8 });
      score += 8;
    }
    if (Math.abs(btc24) < 1 && c.ch24 < -6) {
      flags.push({ type:'DECORRELATED_DOWN', label:`${c.ch24.toFixed(1)}% mandiri (BTC flat)`, score:5 });
      score += 5;
    }

    // ── VOLUME ANOMALY ─────────────────────────────────────────
    if (c.ch24 > 10 && c.vol24 > 5000000) {
      flags.push({ type:'VOL_PRICE_SURGE', label:`Surge +${c.ch24.toFixed(1)}% vol $${(c.vol24/1e6).toFixed(0)}M`, score:6 });
      score += 6;
    }
    if (c.ch24 > 20) {
      flags.push({ type:'EXTREME_MOVE', label:`Extreme +${c.ch24.toFixed(1)}% dalam 24h`, score:8 });
      score += 8;
    }

    if (score >= 7 && flags.length > 0) {
      const sorted = flags.sort((a, b) => b.score - a.score);
      anomalies.push({
        ...c,
        anomalyScore: score,
        flags: sorted,
        primaryFlag: sorted[0],
        isOutperform: flags.some(f => f.type.startsWith('OUTPERFORM')),
        isInverse:    flags.some(f => f.type === 'INVERSE_BTC' || f.type === 'STRENGTH_BTC_DOWN'),
        isDecorl:     flags.some(f => f.type.startsWith('DECORRELATED')),
        anomalyType:
          flags.some(f => f.type.startsWith('OUTPERFORM')) ? '🚀 OUTPERFORM' :
          flags.some(f => f.type === 'INVERSE_BTC')        ? '🔄 INVERSE BTC' :
          flags.some(f => f.type.startsWith('DECORRELATED'))? '⚡ DECORRELATED' :
          '📊 ANOMALI',
      });
    }
  });

  return anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore);
}

// ── TA HELPERS ───────────────────────────────────────────────────
const _S  = a  => window.sma(a[0], a[1]);
const sma = (a,p) => window.sma(a,p);
const ema = (a,p) => window.ema(a,p);
const rsi = (a,p) => window.rsi(a,p);
const mcd = a    => window.macd(a);
const lst = a    => window.lst(a);
const sRSI= a    => window.stRSI(a);
const atr = (h,l,c,p) => window.atrF(h,l,c,p);
const boll= a    => window.bb(a);
const SR  = (h,l,p) => window.findSR(h,l,p);
const fmt = n    => window.fmt(n);

// ── MARKET MICROSTRUCTURE ────────────────────────────────────────
async function getMicro(ticker) {
  const [fr, ls, tk, oi] = await Promise.allSettled([
    fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${ticker}USDT&limit=3`).then(r=>r.ok?r.json():null),
    fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${ticker}USDT&period=1h&limit=4`).then(r=>r.ok?r.json():null),
    fetch(`https://fapi.binance.com/futures/data/takerlongshortRatio?symbol=${ticker}USDT&period=1h&limit=4`).then(r=>r.ok?r.json():null),
    fetch(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${ticker}USDT&period=1h&limit=8`).then(r=>r.ok?r.json():null),
  ]);

  let funding=null, lsR=null, taker=null, oiR=null;
  try { const d=fr.value; if(Array.isArray(d)&&d.length){const rates=d.map(x=>+x.fundingRate*100);funding={cur:rates[rates.length-1],avg:rates.reduce((a,b)=>a+b,0)/rates.length};} } catch(_){}
  try { const d=ls.value; if(Array.isArray(d)&&d.length){const n=d[d.length-1],o=d[0];lsR={long:+n.longAccount*100,short:+n.shortAccount*100,trend:+n.longAccount-+o.longAccount};} } catch(_){}
  try { const d=tk.value; if(Array.isArray(d)&&d.length){const n=d[d.length-1];const b=+n.buyVol,s=+n.sellVol;taker={ratio:b/(s||1),delta:b-s};} } catch(_){}
  try { const d=oi.value; if(Array.isArray(d)&&d.length>=2){const o=+d[0].sumOpenInterest,n=+d[d.length-1].sumOpenInterest;oiR={trend:o>0?(n-o)/o*100:0};} } catch(_){}

  // Labels
  const fLbl = funding?( funding.cur<-0.05?`🟢 Short overpay (${funding.cur.toFixed(3)}%)`: funding.cur>0.1?`🔴 Long overpay (${funding.cur.toFixed(3)}%)`: `⚪ Neutral (${funding.cur.toFixed(3)}%)` ):'—';
  const oLbl = oiR?( oiR.trend>5?`🟢 OI +${oiR.trend.toFixed(1)}%`: oiR.trend<-5?`🔴 OI ${oiR.trend.toFixed(1)}%`: `⚪ OI ±${Math.abs(oiR.trend).toFixed(1)}%` ):'—';
  const lLbl = lsR?( lsR.long<40?`🟢 Shorts ${lsR.short.toFixed(0)}%`: lsR.long>65?`🔴 Longs ${lsR.long.toFixed(0)}%`: `⚪ ${lsR.long.toFixed(0)}%L/${lsR.short.toFixed(0)}%S` ):'—';
  const tLbl = taker?( taker.ratio>1.3?`🟢 Buy ${taker.ratio.toFixed(2)}x`: taker.ratio<0.7?`🔴 Sell ${taker.ratio.toFixed(2)}x`: `⚪ Neutral ${taker.ratio.toFixed(2)}x` ):'—';

  const microBull = [funding?.cur<0, oiR?.trend>0, lsR?.long<50, taker?.ratio>1].filter(Boolean).length;
  const whaleLbl  = (funding&&oiR&&lsR&&taker)
    ? microBull>=3 ? '🟢 Akumulasi terdeteksi'
    : microBull>=2 ? '🟡 Mixed signal'
    : '🔴 Kemungkinan distribusi'
    : '—';

  return { funding, lsR, taker, oiR, fLbl, oLbl, lLbl, tLbl, whaleLbl };
}

// ── SCALP 15m ────────────────────────────────────────────────────
async function getScalp(ticker) {
  try {
    const r = await fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=15m&limit=60`);
    if (!r.ok) return null;
    const kl = await r.json();
    if (!Array.isArray(kl)||kl.length<20) return null;
    const cl=kl.map(k=>+k[4]),hi=kl.map(k=>+k[2]),lo=kl.map(k=>+k[3]),vl=kl.map(k=>+k[5]);
    const p=cl[cl.length-1];
    const e8=lst(ema(cl,8)),e21=lst(ema(cl,21)),e55=lst(ema(cl,55));
    const r15=rsi(cl.slice(-20),14);
    const a15=atr(hi,lo,cl,14);
    const b15=boll(cl);
    const m15=mcd(cl);
    const avgV=vl.slice(-20).reduce((a,b)=>a+b,0)/20;
    const vSurge=vl[vl.length-1]/(avgV||1);
    const mom=cl.length>=5?(cl[cl.length-1]-cl[cl.length-5])/cl[cl.length-5]*100:0;
    let sc=0;
    if(e8>e21&&e21>e55)sc+=3; else if(e8<e21&&e21<e55)sc-=3;
    if(r15<30)sc+=2; else if(r15>75)sc-=2; else if(r15>50&&r15<70)sc+=1;
    if(m15.h>0&&m15.ph<=0)sc+=2; else if(m15.h>0)sc+=1;
    if(m15.h<0&&m15.ph>=0)sc-=2; else if(m15.h<0)sc-=1;
    if(vSurge>2)sc+=1; if(mom>1)sc+=1; else if(mom<-1)sc-=1;
    if(b15&&p<b15.l)sc+=2; else if(b15&&p>b15.u)sc-=1;
    const sl=p-a15*1.2, risk=p-sl;
    const tp1=p+risk*2, tp2=p+risk*3, rrS=risk>0?(tp1-p)/risk:0;
    return {
      sc, rsi15:Math.round(r15||0),
      ema:e8>e21&&e21>e55?'▲ Bull':e8<e21&&e21<e55?'▼ Bear':'◆ Mix',
      macd:m15.h>0?'▲':'▼',
      vSurge:vSurge.toFixed(1), mom:mom.toFixed(2),
      atrP:(a15/p*100).toFixed(2),
      sl, tp1, tp2, rr:rrS,
    };
  } catch (_) { return null; }
}

// ── PROBABILITY ENGINE ────────────────────────────────────────────
function calcProb(o) {
  const S = [];
  const {rsiD,macd,gx,abM200,bb,fr,ls,tk,oi,rr,anomalyFlags} = o;

  // RSI
  if(rsiD<30)      S.push({n:'RSI OS',      p:77,w:9});
  else if(rsiD<40) S.push({n:'RSI Low',     p:64,w:6});
  else if(rsiD<50) S.push({n:'RSI Neutral-',p:53,w:3});
  else if(rsiD>70) S.push({n:'RSI OB',      p:27,w:9});
  else if(rsiD>62) S.push({n:'RSI High',    p:40,w:5});
  else             S.push({n:'RSI Mid',     p:54,w:3});

  // MA structure
  if(gx===true)          S.push({n:'Golden Cross',  p:71,w:12});
  else if(gx===false)    S.push({n:'Death Cross',   p:25,w:12});
  if(abM200===true)      S.push({n:'Above MA200',   p:67,w:10});
  else if(abM200===false)S.push({n:'Below MA200',   p:33,w:10});

  // MACD
  if(macd==='▲')S.push({n:'MACD+',p:63,w:6}); else S.push({n:'MACD-',p:37,w:6});

  // BB
  if(bb==='OS')       S.push({n:'BB OS',     p:72,w:8});
  else if(bb==='OB')  S.push({n:'BB OB',     p:28,w:8});
  else                S.push({n:'BB Neutral',p:51,w:2});

  // Microstructure
  if(fr!=null){
    if(fr<-0.05)    S.push({n:'Funding-',    p:75,w:11});
    else if(fr<0)   S.push({n:'Funding Low', p:62,w:7});
    else if(fr>0.1) S.push({n:'Funding+',   p:32,w:11});
    else if(fr>0.05)S.push({n:'Funding Mid', p:43,w:7});
    else            S.push({n:'Funding Neut',p:52,w:3});
  }
  if(oi!=null){
    if(oi>5)      S.push({n:'OI Growing',  p:67,w:9});
    else if(oi<-5)S.push({n:'OI Falling',  p:40,w:9});
    else          S.push({n:'OI Stable',   p:52,w:3});
  }
  if(ls!=null){
    if(ls<40)     S.push({n:'Shorts Dom',  p:71,w:10});
    else if(ls>65)S.push({n:'Longs Crowd', p:29,w:10});
    else          S.push({n:'L/S Balanced',p:52,w:3});
  }
  if(tk!=null){
    if(tk>1.3)    S.push({n:'Buy Pressure', p:68,w:9});
    else if(tk<0.7)S.push({n:'Sell Pressure',p:32,w:9});
    else           S.push({n:'Taker Neut',  p:51,w:3});
  }

  // R:R
  if(rr>=3)S.push({n:'RR Excellent',p:70,w:5});
  else if(rr>=2)S.push({n:'RR Good',p:63,w:5});

  // Anomaly bonus
  if(anomalyFlags?.some(f=>f.type.startsWith('OUTPERFORM')))
    S.push({n:'BTC Outperform',p:68,w:8});
  if(anomalyFlags?.some(f=>f.type==='INVERSE_BTC'||f.type==='STRENGTH_BTC_DOWN'))
    S.push({n:'Inverse BTC Strength',p:66,w:7});

  const totW = S.reduce((a,s)=>a+s.w,0)||1;
  const wP   = S.reduce((a,s)=>a+s.p*s.w,0)/totW;
  const bull  = S.filter(s=>s.p>55).length;
  const bear  = S.filter(s=>s.p<45).length;
  const dom   = Math.abs(bull-bear)/(S.length||1);
  const conf  = Math.min(95, Math.round(wP*(0.60+dom*0.40)));

  return {
    prob:Math.round(wP), conf, signals:S, bull, bear,
    grade:conf>=78?'A':conf>=65?'B':conf>=52?'C':'D',
    label:conf>=75?'🟢 SETUP KUAT':conf>=60?'🟡 MODERAT':conf>=45?'⚪ NETRAL':'🔴 LEMAH',
  };
}

// ── DEEP ANALYZE PER COIN ─────────────────────────────────────────
async function deepAnalyze(ticker, prefetch, anomaly) {
  try {
    const kR = await fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=1d&limit=120`);
    if (!kR.ok) return null;
    const kl = await kR.json();
    if (!Array.isArray(kl)||kl.length<25) return null;

    const hi=kl.map(k=>+k[2]),lo=kl.map(k=>+k[3]),cl=kl.map(k=>+k[4]),vl=kl.map(k=>+k[5]);
    const price=cl[cl.length-1];
    const ch24=prefetch?.ch24||0, vol24=prefetch?.vol24||0;

    // Core TA
    const m50=lst(sma(cl,50)), m200=lst(sma(cl,Math.min(100,cl.length)));
    const e50=lst(ema(cl,50)), e200=lst(ema(cl,Math.min(100,cl.length)));
    const rD=rsi(cl.slice(-30),14);
    const st=sRSI(cl);
    const aV=atr(hi,lo,cl,14);
    const bbd=boll(cl);
    const md=mcd(cl);
    const {sp,rs}=SR(hi,lo,price);

    // Volume ratio vs 20d avg
    const avgV=vl.slice(-20).reduce((a,b)=>a+b,0)/20;
    const vRatio=vl.slice(-3).reduce((a,b)=>a+b,0)/3/(avgV||1);

    // SL/TP — enforced R:R 1:2
    const s1=sp[0]?.price;
    const slSw=s1?s1*0.993:price-aV*1.8;
    const risk=Math.max(price-slSw, aV*0.4);
    const tp1Base=price+risk*2.0; // MINIMUM 1:2
    const validR=rs.find(r=>r.price>=tp1Base);
    const tp1=validR?.price||tp1Base;
    const tp2=price+risk*3.0, tp3=price+risk*5.0;
    const rrSw=(tp1-price)/risk;

    // TA score
    let sc=0;
    if(rD<30)sc+=4; else if(rD<40)sc+=2; else if(rD<50)sc+=1;
    else if(rD>70)sc-=3; else if(rD>65)sc-=1;
    if(st.k&&st.d){if(st.k<20&&st.d<20)sc+=2;if(st.k>st.d&&st.k<40)sc+=1;if(st.k>80)sc-=2;}
    if(m200&&price>m200)sc+=2; else if(m200)sc-=1;
    if(price>m50)sc+=1; else sc-=1;
    if(e200&&e50>e200)sc+=2; else if(e200)sc-=1;
    if(md.h>0&&md.ph<=0)sc+=2; else if(md.h>0)sc+=1;
    else if(md.h<0&&md.ph>=0)sc-=2; else if(md.h<0)sc-=1;
    if(bbd&&price<bbd.l)sc+=2; else if(bbd&&price>bbd.u)sc-=1;
    if(vRatio>1.5)sc+=1;
    if(ch24>3)sc+=1; else if(ch24<-8)sc-=1;
    if(anomaly?.isOutperform)sc+=2;
    if(anomaly?.isInverse)sc+=2;

    // Parallel: micro + scalp
    const [micro, scalp] = await Promise.allSettled([
      getMicro(ticker),
      getScalp(ticker),
    ]);
    const M = micro.status==='fulfilled'?micro.value:{fLbl:'—',oLbl:'—',lLbl:'—',tLbl:'—',whaleLbl:'—'};
    const SC2= scalp.status==='fulfilled'?scalp.value:null;

    const abM200=m200?price>m200:null;
    const gx=e200?e50>e200:null;
    const bbS=bbd?(price<bbd.l?'OS':price>bbd.u?'OB':'Netral'):'—';

    const prob=calcProb({
      rsiD:Math.round(rD||0), macd:md.h>0?'▲':'▼',
      gx, abM200, bb:bbS,
      fr:M.funding?.cur, ls:M.lsR?.long,
      tk:M.taker?.ratio, oi:M.oiR?.trend,
      rr:rrSw, anomalyFlags:anomaly?.flags,
    });

    const swigSig=sc>=5?'BELI':sc<=-3?'JUAL':'TAHAN';
    const scalpSig=SC2?(SC2.sc>=4?'BELI':SC2.sc<=-3?'JUAL':'TAHAN'):'—';

    return {
      ticker,price,ch24,vol24,vRatio,
      swigSig,sc,
      slSw,tp1,tp2,tp3,rrSw,
      scalpSig,scalp:SC2,
      rsiD:Math.round(rD||0),stK:st.k?Math.round(st.k):null,
      macd:md.h>0?'▲':'▼',abM200,gx,
      bbS,atrP:(aV/price*100).toFixed(1),
      micro:M,
      prob,
      anomaly:anomaly||null,
      isAnomaly:!!anomaly&&anomaly.anomalyScore>=7,
    };
  } catch (_) { return null; }
}

// ── MAIN SCAN ─────────────────────────────────────────────────────
window.startScanPro = async function() {
  if (window.scanRunning) return;
  window.scanRunning = true;

  const univ    = window.SELECTED_UNIVERSE||'top100';
  const volFilt = document.getElementById('f-vol')?.checked!==false;
  const showSc  = document.getElementById('f-scalp')?.checked!==false;
  const MIN_RR  = 2.0;

  // UI
  const btn=document.getElementById('scan-btn');
  if(btn){btn.disabled=true;btn.textContent='⏳ FETCHING...';}
  ['pro-results','scan-results','gen-content-wrap'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  const feed=document.getElementById('scan-feed');
  const bar=document.getElementById('scan-bar');
  const cnt=document.getElementById('scan-count');
  const fnd=document.getElementById('scan-found');
  const stat=document.getElementById('scan-status');
  const phase=document.getElementById('scan-phase');
  if(feed)feed.innerHTML=''; if(bar)bar.style.width='0%';
  document.getElementById('scan-progress')?.classList.remove('hidden');

  // ── STEP 1: Fetch all coins ──────────────────────────────────
  if(stat)stat.textContent='Phase 1: Fetching semua koin...';
  if(phase)phase.textContent='Dynamic fetch dari Binance';
  const {coins:allCoins,map:coinMap} = await fetchAllCoins();
  if(feed)feed.innerHTML+=`<span style="color:#00ff87">✓ ${allCoins.length} koin aktif ditemukan dari Binance</span><br/>`;

  // Apply universe filter
  let universe = allCoins;
  const uList = window.UNIVERSES_PRO?.[univ];
  if(uList) {
    const uSet=new Set(uList);
    universe=allCoins.filter(c=>uSet.has(c.ticker));
  } else if(univ==='top250'){ universe=allCoins.slice(0,250); }
  else if(univ==='top200')  { universe=allCoins.slice(0,200); }
  else if(univ==='top100')  { universe=allCoins.slice(0,100); }
  else if(univ==='dynamic') { universe=allCoins.slice(0,400); }

  if(volFilt) universe=universe.filter(c=>c.vol24>1000000);

  // ── STEP 2: BTC reference ───────────────────────────────────
  const btcCoin=coinMap['BTC'];
  const btc24=btcCoin?.ch24||0;
  let btc48=null;
  try{const d=await fetch48hChange('BTC');btc48=d?.ch48||null;}catch(_){}
  if(feed)feed.innerHTML+=`<span style="color:#f5c518">📊 BTC 24h: ${btc24>=0?'+':''}${btc24.toFixed(2)}% | 48h: ${btc48!=null?(btc48>=0?'+':'')+btc48.toFixed(2)+'%':'fetching...'}</span><br/>`;

  // ── STEP 3: Fetch 48h for top candidates ────────────────────
  if(stat)stat.textContent='Phase 2: Fetching 48h data...';
  if(phase)phase.textContent='Ambil 48h candle untuk outperform detection';

  // Only fetch 48h for high-volume coins (top 80)
  const top80=universe.slice(0,80);
  const batch48=await Promise.allSettled(top80.map(c=>fetch48hChange(c.ticker)));
  batch48.forEach((res,i)=>{
    if(res.status==='fulfilled'&&res.value){
      top80[i].ch48=res.value.ch48;
      top80[i].ch24_verify=res.value.ch24;
    }
  });
  // Merge back
  const coin48Map={};
  top80.forEach(c=>{if(c.ch48!=null)coin48Map[c.ticker]=c.ch48;});
  universe.forEach(c=>{if(coin48Map[c.ticker]!=null)c.ch48=coin48Map[c.ticker];});
  if(feed)feed.innerHTML+=`<span style="color:#00ccff">✓ 48h data fetched untuk ${Object.keys(coin48Map).length} koin</span><br/>`;

  // ── STEP 4: Anomaly Detection ────────────────────────────────
  if(stat)stat.textContent='Phase 3: Anomali detection...';
  const anomalies=detectAnomalies(universe,coinMap,btc24,btc48);
  const anomalyMap={};
  anomalies.forEach(a=>{anomalyMap[a.ticker]=a;});
  if(feed)feed.innerHTML+=`<span style="color:#ff8c00">🔍 ${anomalies.length} anomali · ${anomalies.filter(a=>a.isOutperform).length} outperform BTC · ${anomalies.filter(a=>a.isInverse).length} inverse BTC</span><br/>`;
  if(fnd)fnd.textContent=`${anomalies.length} anomali`;

  // ── STEP 5: Deep TA (priority: anomalies + top volume) ───────
  if(stat)stat.textContent='Phase 4: Deep TA + Microstructure...';
  if(phase)phase.textContent='Parallel: Funding · OI · L/S · 15m Scalp';

  const anomalyTickers=new Set(anomalies.slice(0,25).map(a=>a.ticker));
  const prioritized=[
    ...universe.filter(c=>anomalyTickers.has(c.ticker)),
    ...universe.filter(c=>!anomalyTickers.has(c.ticker)).slice(0,75),
  ].slice(0,100);

  const results=[];
  let done=0;
  const BATCH=4;

  for(let i=0;i<prioritized.length;i+=BATCH){
    const batch=prioritized.slice(i,i+BATCH);
    const bRes=await Promise.allSettled(
      batch.map(c=>deepAnalyze(c.ticker,c,anomalyMap[c.ticker]||null))
    );
    bRes.forEach(res=>{
      done++;
      if(bar)bar.style.width=Math.round(done/prioritized.length*100)+'%';
      if(cnt)cnt.textContent=`${done} / ${prioritized.length} koin`;
      if(res.status==='fulfilled'&&res.value){
        const r=res.value;
        results.push(r);
        if(feed){
          const sc2=r.swigSig==='BELI'?'#00ff87':r.swigSig==='JUAL'?'#ff4560':'#5a6a7a';
          const gc2=r.prob.grade==='A'?'#ffd700':r.prob.grade==='B'?'#00ff87':'#5a6a7a';
          const aFlag=r.isAnomaly?`<span style="color:#f5c518">[${r.anomaly.anomalyType}]</span> `:'';
          feed.innerHTML+=`${aFlag}<span style="color:#c4ccd6">${r.ticker}</span> · <span style="color:${sc2}">${r.swigSig}</span> · P:<span style="color:${gc2}">${r.prob.prob}%</span> · RR:${r.rrSw.toFixed(1)} · FR:${r.micro?.funding?.cur?.toFixed(3)||'—'}<br/>`;
          feed.scrollTop=feed.scrollHeight;
        }
        const valid=results.filter(r=>r.rrSw>=MIN_RR&&r.prob.prob>=50).length;
        if(fnd)fnd.textContent=`${anomalies.length} anomali · ${valid} setup valid`;
      }
    });
    await new Promise(res=>setTimeout(res,280));
  }

  // Cache
  window.scanResultsCache=results;
  window.selectedCoinsForContent=new Set(
    results.filter(r=>r.swigSig==='BELI'&&r.rrSw>=2&&r.prob.prob>=60).slice(0,5).map(r=>r.ticker)
  );

  // Classify
  const swingBuy  = results.filter(r=>r.swigSig==='BELI'&&r.rrSw>=MIN_RR).sort((a,b)=>b.prob.conf-a.prob.conf).slice(0,15);
  const scalpBuy  = showSc?results.filter(r=>r.scalpSig==='BELI'&&(r.scalp?.rr||0)>=MIN_RR).sort((a,b)=>b.prob.conf-a.prob.conf).slice(0,10):[];
  const shortList = results.filter(r=>r.swigSig==='JUAL').sort((a,b)=>b.prob.conf-a.prob.conf).slice(0,8);
  const anomRes   = results.filter(r=>r.isAnomaly).sort((a,b)=>b.anomaly.anomalyScore-a.anomaly.anomalyScore).slice(0,15);
  const watchlist = results.filter(r=>r.swigSig==='TAHAN'&&r.prob.prob>=55).sort((a,b)=>b.prob.prob-a.prob.prob).slice(0,10);

  renderResults(swingBuy,scalpBuy,shortList,anomRes,watchlist,results.length,universe.length,btc24,btc48);

  document.getElementById('scan-progress')?.classList.add('hidden');
  document.getElementById('pro-results')?.classList.remove('hidden');
  document.getElementById('gen-content-wrap')?.classList.remove('hidden');
  if(btn){btn.disabled=false;btn.textContent='⚡ SCAN LAGI';}
  window.scanRunning=false;
};

// ── RENDER ────────────────────────────────────────────────────────
function renderResults(swingList,scalpList,shortList,anomList,watchlist,scanned,total,btc24,btc48){
  const el=document.getElementById('pro-results');
  if(!el)return;
  const allV=[...swingList,...scalpList,...shortList].filter((v,i,a)=>a.findIndex(x=>x.ticker===v.ticker)===i);
  const avgP=allV.length?Math.round(allV.reduce((a,r)=>a+r.prob.prob,0)/allV.length):0;

  let html=`
  <!-- Summary -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
    ${[
      {l:'Di-scan',  v:scanned,                       c:'#e8f0f8'},
      {l:'Universe', v:total,                          c:'#c4ccd6'},
      {l:'R:R≥2',    v:swingList.length+scalpList.length, c:'#00ff87'},
      {l:'Anomali',  v:anomList.length,                c:'#f5c518'},
    ].map(x=>`<div style="background:rgba(9,12,20,.9);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:11px;text-align:center">
      <div style="font-size:18px;font-weight:800;color:${x.c};font-family:'IBM Plex Mono',monospace">${x.v}</div>
      <div style="font-size:8px;color:var(--dmr);letter-spacing:1px;text-transform:uppercase;margin-top:2px">${x.l}</div>
    </div>`).join('')}
  </div>

  <!-- BTC Baseline -->
  <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:10px 14px;margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap">
    <span style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase">BTC Baseline</span>
    <span style="font-size:14px;font-weight:800;color:${btc24>=0?'#00ff87':'#ff4560'};font-family:'IBM Plex Mono',monospace">24h: ${btc24>=0?'+':''}${btc24.toFixed(2)}%</span>
    ${btc48!=null?`<span style="font-size:12px;font-weight:700;color:${btc48>=0?'#00c96a':'#d93848'};font-family:'IBM Plex Mono',monospace">48h: ${btc48>=0?'+':''}${btc48.toFixed(2)}%</span>`:''}
    <span style="font-size:10px;color:#4b5d6e">${btc24<-2?'Bear market — inverse BTC lebih signifikan':btc24>3?'Bull market — cari outperform 2x':'Sideways — decorrelated moves menarik'}</span>
  </div>`;

  // Sections
  const sections=[
    {list:swingList,  mode:'swing',  color:'#00ff87', icon:'📈', label:'SWING TRADE',  sub:'Daily · R:R≥1:2 · Hold 3-14 hari'},
    {list:anomList,   mode:'anomaly',color:'#f5c518', icon:'⚠️', label:'ANOMALI',       sub:'Outperform BTC 2x+ · Inverse · Decorrelated'},
    {list:scalpList,  mode:'scalp',  color:'#00ccff', icon:'⚡', label:'SCALP 15m',    sub:'15m TF · R:R≥1:2 · Hold menit-jam'},
    {list:shortList,  mode:'short',  color:'#ff4560', icon:'▼',  label:'SHORT',         sub:'Setup bearish terkonfirmasi'},
  ];

  sections.forEach(s=>{
    if(!s.list.length)return;
    const grad=s.mode==='short'?`linear-gradient(135deg,${s.color},${s.color}88)`:
               s.mode==='swing'?'linear-gradient(135deg,#00ff87,#00cc6a)':
               s.mode==='anomaly'?'linear-gradient(135deg,#f5c518,#ff8c00)':
               `linear-gradient(135deg,${s.color},${s.color}88)`;
    html+=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:11px;margin-top:${s.mode==='swing'?'4':'20'}px">
      <div style="background:${grad};border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:${s.mode==='short'?'#fff':'#000'};letter-spacing:2px">${s.icon} ${s.label}</div>
      <div style="font-size:10px;color:${s.color}">${s.sub}</div>
    </div>
    ${s.list.map((r,i)=>card(r,s.mode,i,s.color)).join('')}`;
  });

  // Watchlist
  if(watchlist.length){
    html+=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;margin-top:20px">
      <div style="background:rgba(245,197,24,.18);border:1px solid rgba(245,197,24,.4);border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:#f5c518;letter-spacing:2px">👁 WATCHLIST</div>
      <div style="font-size:10px;color:#f5c518">Tunggu konfirmasi entry</div>
    </div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px">
    ${watchlist.map(r=>`<div onclick="window.goAnalyze('${r.ticker}')" style="padding:8px 14px;background:rgba(245,197,24,.04);border:1px solid rgba(245,197,24,.15);border-radius:10px;cursor:pointer;transition:all .2s"
      onmouseover="this.style.borderColor='rgba(245,197,24,.4)'" onmouseout="this.style.borderColor='rgba(245,197,24,.15)'">
      <div style="font-size:12px;font-weight:700;color:#e8f0f8">${r.ticker}</div>
      <div style="font-size:9px;color:#f5c518;margin-top:1px">${r.prob.prob}% prob · ${r.prob.label}</div>
      <div style="font-size:9px;color:#3d4a5a">${r.rsiD} RSI · ${fmt(r.price)}</div>
      ${r.isAnomaly?`<div style="font-size:8px;color:#f5c518;margin-top:2px">${r.anomaly.anomalyType}</div>`:''}
    </div>`).join('')}
    </div>`;
  }
  el.innerHTML=html;
}

function card(r,mode,rank,color){
  const isScalp=mode==='scalp',isAnomaly=mode==='anomaly',isShort=mode==='short';
  const sl=isScalp?r.scalp?.sl:r.slSw;
  const tp1=isScalp?r.scalp?.tp1:r.tp1;
  const tp2=isScalp?r.scalp?.tp2:r.tp2;
  const rr=isScalp?r.scalp?.rr:r.rrSw;
  const sig=isScalp?(r.scalpSig||'—'):r.swigSig;
  const P=r.prob;
  const gc=P.grade==='A'?'#ffd700':P.grade==='B'?'#00ff87':P.grade==='C'?'#f5c518':'#ff4560';
  const rrC=(rr||0)>=3?'#00ff87':(rr||0)>=2?'#00c96a':'#f5c518';

  return `<div style="background:rgba(9,12,20,.92);border:1px solid ${color}22;border-left:3px solid ${color};border-radius:12px;padding:13px 15px;margin-bottom:10px">

  <!-- Header row -->
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;flex-wrap:wrap">
    <span style="font-size:13px;color:#5a6a7a">#${rank+1}</span>
    <span style="font-size:17px;font-weight:800;color:${color}">${r.ticker}</span>
    <span style="font-size:14px;font-weight:700;color:#e8f0f8;font-family:'IBM Plex Mono',monospace">${fmt(r.price)}</span>
    <span style="font-size:11px;font-weight:700;color:${r.ch24>=0?'#00ff87':'#ff4560'}">${r.ch24>=0?'+':''}${r.ch24.toFixed(2)}%</span>
    ${r.anomaly?.ch48!=null?`<span style="font-size:10px;color:${r.anomaly.ch48>=0?'#00c96a':'#d93848'}">${r.anomaly.ch48>=0?'+':''}${r.anomaly.ch48?.toFixed(1)||''}% 48h</span>`:''}
    <span style="padding:2px 8px;background:${color}18;border:1px solid ${color}40;border-radius:5px;font-size:9px;font-weight:700;color:${color}">${sig}</span>
    ${r.isAnomaly?`<span style="padding:2px 8px;background:rgba(245,197,24,.1);border:1px solid rgba(245,197,24,.3);border-radius:5px;font-size:9px;color:#f5c518">${r.anomaly.anomalyType}</span>`:''}
    <span style="margin-left:auto;padding:2px 9px;background:${gc}18;border:1px solid ${gc}40;border-radius:5px;font-size:10px;font-weight:800;color:${gc}">GRADE ${P.grade}</span>
  </div>

  <!-- Probability -->
  <div style="background:rgba(255,255,255,.03);border-radius:8px;padding:9px 12px;margin-bottom:9px">
    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
      <span style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase">Probabilitas Win</span>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:9px;color:#4b5d6e">${P.bull}B·${P.bear}R·${P.signals.length}sig</span>
        <span style="font-size:15px;font-weight:800;color:${gc};font-family:'IBM Plex Mono',monospace">${P.prob}%</span>
      </div>
    </div>
    <div style="height:5px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden">
      <div style="height:100%;width:${P.prob}%;background:linear-gradient(90deg,${gc}88,${gc});border-radius:3px;transition:width .6s"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:4px">
      <span style="font-size:8px;color:var(--dmr)">0% Bearish</span>
      <span style="font-size:9px;color:${gc}">${P.label}</span>
      <span style="font-size:8px;color:var(--dmr)">100% Bullish</span>
    </div>
  </div>

  <!-- Anomaly flags if any -->
  ${r.isAnomaly&&r.anomaly?.flags?.length?`
  <div style="background:rgba(245,197,24,.04);border:1px solid rgba(245,197,24,.15);border-radius:8px;padding:8px 11px;margin-bottom:9px">
    <div style="font-size:8px;color:#f5c518;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">⚠️ Anomali Signals</div>
    <div style="display:flex;gap:5px;flex-wrap:wrap">
      ${r.anomaly.flags.map(f=>`<span style="padding:2px 7px;background:rgba(245,197,24,.08);border:1px solid rgba(245,197,24,.22);border-radius:7px;font-size:9px;color:#f5c518">${f.label}</span>`).join('')}
    </div>
    <div style="margin-top:6px;font-size:9px;color:#6a5010">Score anomali: ${r.anomaly.anomalyScore}/30</div>
  </div>`:''}

  <!-- TA + Micro grid -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:9px">
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:9px 11px">
      <div style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px">📊 Teknikal</div>
      ${[
        {l:'RSI',   v:r.rsiD,   c:r.rsiD>70?'#ff4560':r.rsiD<35?'#00ff87':'#f5c518'},
        {l:'MACD',  v:r.macd,   c:r.macd==='▲'?'#00ff87':'#ff4560'},
        {l:'MA200', v:r.abM200===true?'Atas':r.abM200===false?'Bawah':'—', c:r.abM200===true?'#00ff87':r.abM200===false?'#ff4560':'#f5c518'},
        {l:'EMA X', v:r.gx===true?'Golden✓':r.gx===false?'Death✗':'—', c:r.gx===true?'#00ff87':r.gx===false?'#ff4560':'#5a6a7a'},
        {l:'BB',    v:r.bbS,    c:r.bbS==='OS'?'#00ff87':r.bbS==='OB'?'#ff4560':'#5a6a7a'},
        {l:'Vol',   v:r.vRatio?(r.vRatio>1.5?'Surge '+r.vRatio.toFixed(1)+'x':'Normal'):'—', c:r.vRatio>1.5?'#00ff87':'#5a6a7a'},
      ].map(x=>`<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.03)">
        <span style="font-size:10px;color:#3d4a5a">${x.l}</span>
        <span style="font-size:10px;font-weight:700;color:${x.c||'#c4ccd6'}">${x.v}</span>
      </div>`).join('')}
    </div>
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:8px;padding:9px 11px">
      <div style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px">🐋 Market Structure</div>
      ${[
        {l:'Funding',v:r.micro?.fLbl||'—'},
        {l:'OI',     v:r.micro?.oLbl||'—'},
        {l:'L/S',    v:r.micro?.lLbl||'—'},
        {l:'Taker',  v:r.micro?.tLbl||'—'},
        {l:'Whale',  v:r.micro?.whaleLbl||'—'},
        {l:'ATR',    v:r.atrP+'%',c:'#5a6a7a'},
      ].map(x=>`<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,.03);gap:4px">
        <span style="font-size:10px;color:#3d4a5a;flex-shrink:0">${x.l}</span>
        <span style="font-size:9px;color:${x.c||'#8a9aaa'};text-align:right;line-height:1.3">${x.v}</span>
      </div>`).join('')}
    </div>
  </div>

  <!-- Scalp data -->
  ${isScalp&&r.scalp?`<div style="background:rgba(0,204,255,.04);border:1px solid rgba(0,204,255,.15);border-radius:8px;padding:8px 11px;margin-bottom:9px">
    <div style="font-size:8px;color:#00ccff;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">⚡ Scalp 15m</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;text-align:center">
      ${[{l:'EMA',v:r.scalp.ema},{l:'RSI',v:r.scalp.rsi15,c:r.scalp.rsi15>70?'#ff4560':r.scalp.rsi15<30?'#00ff87':'#f5c518'},{l:'MACD',v:r.scalp.macd,c:r.scalp.macd==='▲'?'#00ff87':'#ff4560'},{l:'Vol',v:r.scalp.vSurge+'x',c:+r.scalp.vSurge>2?'#00ff87':'#5a6a7a'}]
        .map(x=>`<div><div style="font-size:8px;color:var(--dmr);margin-bottom:2px">${x.l}</div><div style="font-size:10px;font-weight:700;color:${x.c||'#c4ccd6'}">${x.v}</div></div>`).join('')}
    </div>
  </div>`:''}

  <!-- SL/TP -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-bottom:9px">
    ${[
      {l:'SL',     v:fmt(sl),   c:'#ff4560', bg:'rgba(255,69,96,.07)',   bd:'rgba(255,69,96,.2)'},
      {l:'TP1 1:2',v:fmt(tp1),  c:'#00ff87', bg:'rgba(0,255,135,.06)',   bd:'rgba(0,255,135,.2)'},
      {l:'TP2 1:3',v:fmt(tp2),  c:'#00c96a', bg:'rgba(0,255,135,.03)',   bd:'rgba(0,255,135,.1)'},
      {l:'R:R',    v:`1:${(rr||0).toFixed(2)}`,c:rrC,bg:'rgba(245,197,24,.05)',bd:'rgba(245,197,24,.15)'},
    ].map(x=>`<div style="background:${x.bg};border:1px solid ${x.bd};border-radius:7px;padding:6px;text-align:center">
      <div style="font-size:8px;color:${x.c}55;margin-bottom:2px">${x.l}</div>
      <div style="font-size:10px;font-weight:700;color:${x.c};font-family:'IBM Plex Mono',monospace">${x.v}</div>
    </div>`).join('')}
  </div>

  <!-- Top signals -->
  <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:9px">
    ${P.signals.sort((a,b)=>(b.p>55?b.w:-b.w)-(a.p>55?a.w:-a.w)).slice(0,7).map(s=>`
      <span style="padding:2px 6px;background:${s.p>55?'rgba(0,255,135,.06)':'rgba(255,69,96,.06)'};border:1px solid ${s.p>55?'rgba(0,255,135,.16)':'rgba(255,69,96,.16)'};border-radius:7px;font-size:8px;color:${s.p>55?'#00c96a':'#ff4560'}">${s.n} ${s.p}%</span>`).join('')}
  </div>

  <!-- Actions -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
    <button onclick="window.goAnalyze('${r.ticker}')" style="padding:8px;background:rgba(0,255,135,.07);border:1px solid rgba(0,255,135,.22);border-radius:8px;color:#00ff87;font-size:9px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(0,255,135,.16)'" onmouseout="this.style.background='rgba(0,255,135,.07)'">📊 DETAIL</button>
    <button onclick="window.quickSave('${r.ticker}','${sig}',${r.price},${sl||0},${tp1||0},${tp2||0},${r.tp3||0},${P.prob})" style="padding:8px;background:rgba(0,204,255,.07);border:1px solid rgba(0,204,255,.22);border-radius:8px;color:#00ccff;font-size:9px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(0,204,255,.16)'" onmouseout="this.style.background='rgba(0,204,255,.07)'">＋ TRACKER</button>
    <button onclick="window.quickTradeOpen('${r.ticker}','${sig}',${r.price},${sl||0},${tp1||0},${tp2||0},${r.tp3||0})" style="padding:8px;background:rgba(245,197,24,.07);border:1px solid rgba(245,197,24,.22);border-radius:8px;color:#f5c518;font-size:9px;font-weight:700;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(245,197,24,.16)'" onmouseout="this.style.background='rgba(245,197,24,.07)'">⚡ BYBIT</button>
  </div>
</div>`;
}
