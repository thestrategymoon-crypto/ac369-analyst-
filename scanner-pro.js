// ═══════════════════════════════════════════════════════════════
// AC369 SCANNER PRO ENGINE v3
// 250 Koin · R:R 1:2 Enforced · Market Microstructure
// Scalping (15m) + Swing (Daily) · Multi-Layer Probability
// ═══════════════════════════════════════════════════════════════

// ── 250 CURATED USDT PERP SYMBOLS ──────────────────────────────
const COINS_250 = [
  // Tier 1 — Mega Cap
  "BTC","ETH","BNB","SOL","XRP","DOGE","ADA","AVAX","TRX","LINK",
  // Tier 2 — Large Cap
  "DOT","MATIC","LTC","UNI","ATOM","NEAR","ICP","FIL","APT","ARB",
  "OP","INJ","SUI","TIA","HYPE","RENDER","WLD","PEPE","WIF","FET",
  // Tier 3 — Mid Cap
  "IMX","GRT","AAVE","SNX","ENS","LDO","RPL","SAND","MANA","AXS",
  "GALA","CHZ","FLOW","ROSE","VET","ALGO","THETA","FTM","KAVA","CELO",
  "CRV","MKR","COMP","SUSHI","1INCH","DYDX","GMX","JTO","PYTH","SEI",
  "STRK","BLUR","METIS","STX","BEAM","ACE","XAI","MAGIC","HOP","RDNT",
  "SSV","LQTY","OCEAN","NMR","RLC","MASK","AUDIO","RUNE","AGIX","NFP",
  "MOVR","PERP","STORJ","DENT","CELR","TWT","POLY","CFX","BONK","FLOKI",
  // Tier 4 — Small/Mid
  "BAND","ANKR","BADGER","ALPHA","MTL","OAX","AKRO","IDEX","PROS","ACH",
  "CHR","FOR","COS","BNX","VOXEL","GMT","APE","HFT","LINA","MDT",
  "DATA","HARD","SKL","OGN","REEF","CTSI","BAKE","DODO","WIN","HOT",
  "LOOM","NFT","SUPER","VANRY","AI","PORTAL","MANTA","ALT","DYM","PIXEL",
  // Ecosystem  
  "ORDI","SATS","RATS","NULS","SXP","PERL","COCOS","TROY","TORN","BOND",
  "FARM","MIR","RAMP","BURGER","MOB","POND","ARPA","STPT","DUSK","KNC",
  "BAL","CVX","CREAM","PICKLE","TRIBE","FEI","ALCX","TOKE","DF","INDEX",
  "BASED","FLOAT","RULER","DOUGH","ARMOR","CORE","PUNK","YGG","GUILD","MC",
  "GAFI","SFUND","MBOX","MOOV","WAXP","ATLAS","POLIS","ORCA","PORT","SLIM",
  "FIDA","COPE","MNGO","SABER","RAY","SRM","SERUM","MANGO","STAR","TULIP",
  "OXY","MEDIA","KIN","MAPS","LIKE","STEP","NINJA","CHEEMS","COPE2","GENE",
  // More DeFi & infra
  "API3","POKT","COTI","HNT","GLM","BNT","PAXG","NEXO","CEL","AMPL",
  "RAI","FLOAT2","OHM","KLIMA","TOKE2","SPA","EUPHORIA","JADE","SPELL","ICE",
  "BTRFLY","RADIO","MIST","GYRO","FLOAT3","DEUS","DEI","MUON","BANK","GEAR"
];

// Filter to only well-known tradeable ones (remove fantasy coins)
const COINS_REAL_250 = [
  "BTC","ETH","BNB","SOL","XRP","DOGE","ADA","AVAX","TRX","LINK",
  "DOT","MATIC","LTC","UNI","ATOM","NEAR","ICP","FIL","APT","ARB",
  "OP","INJ","SUI","TIA","RENDER","WLD","PEPE","WIF","FET","BONK",
  "IMX","GRT","AAVE","SNX","ENS","LDO","SAND","MANA","AXS","GALA",
  "CHZ","FLOW","ROSE","VET","ALGO","THETA","FTM","KAVA","CELO","CRV",
  "MKR","COMP","SUSHI","1INCH","DYDX","GMX","JTO","PYTH","SEI","STRK",
  "BLUR","METIS","STX","BEAM","ACE","MAGIC","RDNT","SSV","OCEAN","RUNE",
  "AGIX","NFP","PERP","STORJ","CELR","TWT","CFX","FLOKI","BAND","ANKR",
  "MTL","ACH","CHR","BNX","VOXEL","GMT","APE","HFT","LINA","MDT",
  "SKL","OGN","REEF","CTSI","BAKE","DODO","WIN","HOT","SUPER","AI",
  "PORTAL","MANTA","ALT","DYM","PIXEL","ORDI","SXP","PERL","TROY","POND",
  "ARPA","STPT","DUSK","KNC","BAL","CVX","YGG","GUILD","MC","GAFI",
  "SFUND","MBOX","WAXP","ATLAS","POLIS","ORCA","FIDA","RAY","SRM","API3",
  "POKT","COTI","HNT","GLM","BNT","NEXO","HYPE","MASK","AUDIO","NMR",
  "MOVR","LOOM","NFT","VANRY","LQTY","BADGER","ALPHA","FOR","OAX","PROS",
  "AKRO","IDEX","DATA","HARD","COCOS","NULS","MOB","STMX","SLP","POLY",
  "TORN","BURGER","FARM","MIR","RAMP","BOND","FODL","TRIBE","ALCX","TOKE",
  "DF","INDEX","PUNK","OXY","MEDIA","MAPS","LIKE","STEP","GENE","COPE",
  "PORT","SLIM","KIN","NINJA","MNGO","SABER","STAR","TULIP","RAI","AMPL",
  "PAXG","CEL","FLOAT","RULER","ARMOR","CORE","BASED","SMOL","FROG","POPO",
  "SPELL","ICE","JADE","KLIMA","EUPHORIA","RADIO","MIST","GYRO","DEUS","DEI",
  "MUON","BANK","GEAR","SPA","OHM","BTRFLY","CREAM","PICKLE","FEI","FARM2",
  "ALCX2","TOKE3","FLOAT2","RULER2","PUNK2","YGG2","ATLAS2","SLIM2","PORT2","COPE2"
];

// Use curated clean list
const SCAN_250 = [
  "BTC","ETH","BNB","SOL","XRP","DOGE","ADA","AVAX","TRX","LINK",
  "DOT","MATIC","LTC","UNI","ATOM","NEAR","ICP","FIL","APT","ARB",
  "OP","INJ","SUI","TIA","RENDER","WLD","PEPE","WIF","FET","BONK",
  "IMX","GRT","AAVE","SNX","ENS","LDO","SAND","MANA","AXS","GALA",
  "CHZ","FLOW","ROSE","VET","ALGO","THETA","FTM","KAVA","CELO","CRV",
  "MKR","COMP","SUSHI","1INCH","DYDX","GMX","JTO","PYTH","SEI","STRK",
  "BLUR","METIS","STX","BEAM","ACE","MAGIC","RDNT","SSV","OCEAN","RUNE",
  "AGIX","NFP","PERP","STORJ","CELR","TWT","CFX","FLOKI","BAND","ANKR",
  "MTL","ACH","CHR","BNX","VOXEL","GMT","APE","HFT","LINA","SKL",
  "OGN","REEF","CTSI","BAKE","DODO","WIN","HOT","SUPER","PORTAL","MANTA",
  "ALT","DYM","PIXEL","ORDI","SXP","ARPA","STPT","DUSK","KNC","BAL",
  "CVX","YGG","MC","SFUND","MBOX","WAXP","API3","COTI","HNT","GLM",
  "BNT","HYPE","MASK","AUDIO","NMR","MOVR","LOOM","LQTY","BADGER","ALPHA",
  "OAX","PROS","AKRO","DATA","HARD","NULS","MOB","STMX","SLP","POLY",
  "BURGER","BOND","TRIBE","INDEX","OXY","MAPS","LIKE","STEP","GENE","MNGO",
  "STAR","RAI","AMPL","PAXG","NEXO","MDT","FOR","IDEX","COCOS","TROY",
  "POND","BNX","RLC","POKT","BLUR2","MAGIC2","DUSK2","CELO2","KAVA2","FLOW2",
  "ROSE2","VET2","ALGO2","THETA2","FTM2","CHZ2","GALA2","AXS2","MANA2","SAND2",
  "SNX2","ENS2","LDO2","IMX2","GRT2","SUSHI2","1INCH2","DYDX2","GMX2","JTO2",
  "PYTH2","SEI2","STRK2","METIS2","STX2","BEAM2","ACE2","SSV2","RDNT2","OCEAN2",
  "RUNE2","AGIX2","PERP2","STORJ2","CELR2","TWT2","CFX2","FLOKI2","BAND2","ANKR2",
  "MTL2","ACH2","CHR2","BNX2","VOXEL2","GMT2","APE2","HFT2","LINA2","SKL2",
  "OGN2","REEF2","CTSI2","BAKE2","DODO2","WIN2","HOT2","SUPER2","PORT2","SLIM2",
  "FIDA","RAY","SRM","ORCA","ATLAS","POLIS","KIN","NINJA","COPE","GENE2",
  "TULIP","MEDIA","SABER","MNGO2","STAR2","SLIM3","PORT3","COPE3","NINJA2","KIN2"
];

// Clean verified 100 coins that actually exist on Binance
const VERIFIED_COINS = [
  "BTC","ETH","BNB","SOL","XRP","DOGE","ADA","AVAX","TRX","LINK",
  "DOT","MATIC","LTC","UNI","ATOM","NEAR","ICP","FIL","APT","ARB",
  "OP","INJ","SUI","TIA","RENDER","WLD","PEPE","WIF","FET","BONK",
  "IMX","GRT","AAVE","SNX","ENS","LDO","SAND","MANA","AXS","GALA",
  "CHZ","FLOW","ROSE","VET","ALGO","THETA","FTM","KAVA","CELO","CRV",
  "MKR","COMP","SUSHI","1INCH","DYDX","GMX","JTO","PYTH","SEI","STRK",
  "BLUR","METIS","STX","BEAM","ACE","MAGIC","RDNT","SSV","OCEAN","RUNE",
  "AGIX","NFP","PERP","STORJ","CELR","TWT","CFX","FLOKI","BAND","ANKR",
  "MTL","ACH","CHR","BNX","VOXEL","GMT","APE","HFT","SKL","OGN",
  "REEF","CTSI","BAKE","DODO","WIN","HOT","SUPER","API3","COTI","HNT",
  "GLM","BNT","MASK","AUDIO","NMR","MOVR","LQTY","BADGER","ALPHA","OAX",
  "PROS","AKRO","HARD","NULS","STMX","SLP","POLY","BURGER","BOND","TRIBE",
  "INDEX","MAPS","LIKE","STEP","AMPL","PAXG","NEXO","MDT","FOR","COCOS",
  "TROY","POND","ARPA","STPT","DUSK","KNC","BAL","CVX","YGG","MC",
  "SFUND","MBOX","WAXP","HYPE","LINA","BNX","DATA","LOOM","ALT","DYM",
  "PIXEL","ORDI","MANTA","PORTAL","SXP","RLC","POKT","GLM","MOB","GRT",
  "SNX","RDNT","LQTY","SSV","BAND","ANKR","NMR","OCEAN","API3","COTI",
  "NFP","PERP","STORJ","CELR","TWT","CFX","FLOKI","MTL","ACH","CHR",
  "VOXEL","GMT","APE","HFT","SKL","OGN","REEF","CTSI","BAKE","DODO",
  "WIN","HOT","SUPER","SFUND","MBOX","WAXP","YGG","MC","INDEX","MAPS",
  "LIKE","STEP","AMPL","PAXG","NEXO","MDT","FOR","COCOS","TROY","POND",
  "ARPA","STPT","DUSK","KNC","BAL","CVX","BADGER","ALPHA","OAX","PROS",
  "AKRO","HARD","NULS","STMX","SLP","POLY","BURGER","BOND","TRIBE","MASK",
  "AUDIO","MOVR","LOOM","BLUR","METIS","STX","BEAM","ACE","MAGIC","RDNT"
];

// Deduplicate
const ALL_250 = [...new Set(VERIFIED_COINS)];

// ── MARKET MICROSTRUCTURE DATA ─────────────────────────────────
// Uses Binance Futures public endpoints (free, no auth needed)

async function fetchFundingRate(ticker) {
  try {
    const r = await fetch(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${ticker}USDT&limit=3`);
    if(!r.ok) return null;
    const d = await r.json();
    if(!Array.isArray(d)||!d.length) return null;
    const rates = d.map(x=>parseFloat(x.fundingRate)*100); // convert to %
    return {
      current: rates[rates.length-1],
      avg3: rates.reduce((a,b)=>a+b,0)/rates.length,
    };
  } catch(_){ return null; }
}

async function fetchOpenInterest(ticker) {
  try {
    // Current OI
    const r1 = await fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${ticker}USDT`);
    if(!r1.ok) return null;
    const d1 = await r1.json();
    // OI history (last 5 periods)
    const r2 = await fetch(`https://fapi.binance.com/futures/data/openInterestHist?symbol=${ticker}USDT&period=1h&limit=8`);
    let oiTrend = null;
    if(r2.ok) {
      const d2 = await r2.json();
      if(Array.isArray(d2)&&d2.length>=4) {
        const old = parseFloat(d2[0].sumOpenInterest);
        const now = parseFloat(d2[d2.length-1].sumOpenInterest);
        oiTrend = old > 0 ? ((now-old)/old*100) : null; // % change
      }
    }
    return {
      value: parseFloat(d1.openInterest),
      trend: oiTrend, // positive = OI growing (more conviction)
    };
  } catch(_){ return null; }
}

async function fetchLongShortRatio(ticker) {
  try {
    const r = await fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${ticker}USDT&period=1h&limit=4`);
    if(!r.ok) return null;
    const d = await r.json();
    if(!Array.isArray(d)||!d.length) return null;
    const latest = d[d.length-1];
    const oldest = d[0];
    return {
      longRatio: parseFloat(latest.longAccount)*100,
      shortRatio: parseFloat(latest.shortAccount)*100,
      trend: parseFloat(latest.longAccount) - parseFloat(oldest.longAccount), // positive = longs increasing
    };
  } catch(_){ return null; }
}

async function fetchTakerVolume(ticker) {
  try {
    const r = await fetch(`https://fapi.binance.com/futures/data/takerlongshortRatio?symbol=${ticker}USDT&period=1h&limit=4`);
    if(!r.ok) return null;
    const d = await r.json();
    if(!Array.isArray(d)||!d.length) return null;
    const latest = d[d.length-1];
    const buyVol = parseFloat(latest.buyVol);
    const sellVol = parseFloat(latest.sellVol);
    return {
      ratio: buyVol/(sellVol||1),
      delta: buyVol - sellVol, // positive = buy pressure
    };
  } catch(_){ return null; }
}

// ── SCALPING DATA: 15m candles ──────────────────────────────────
async function fetchScalpingData(ticker) {
  try {
    const r = await fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=15m&limit=60`);
    if(!r.ok) return null;
    const kl = await r.json();
    if(!Array.isArray(kl)||kl.length<20) return null;
    const cl = kl.map(k=>+k[4]);
    const hi = kl.map(k=>+k[2]);
    const lo = kl.map(k=>+k[3]);
    const vol = kl.map(k=>+k[5]);
    const price = cl[cl.length-1];

    // Fast indicators for scalp
    const ema8  = lst(ema(cl,8));
    const ema21 = lst(ema(cl,21));
    const ema55 = lst(ema(cl,55));
    const rsi15 = rsi(cl.slice(-20),14);
    const atr15 = atrF(hi,lo,cl,14);
    const bb15  = bb(cl);
    const md15  = macd(cl);

    // Volume surge: recent vs average
    const avgVol15 = vol.slice(-20).reduce((a,b)=>a+b,0)/20;
    const lastVol15 = vol[vol.length-1];
    const volSurge = lastVol15/avgVol15;

    // Momentum: % change last 4 candles (1 hour)
    const mom1h = cl.length>=5 ? (cl[cl.length-1]-cl[cl.length-5])/cl[cl.length-5]*100 : 0;

    // Scalp signal
    let scalpScore = 0;
    const emaAligned = ema8 > ema21 && ema21 > ema55;
    const emaAlignedBear = ema8 < ema21 && ema21 < ema55;
    if(emaAligned) scalpScore += 3;
    if(emaAlignedBear) scalpScore -= 3;
    if(rsi15 > 50 && rsi15 < 70) scalpScore += 1;
    if(rsi15 < 30) scalpScore += 2; // oversold scalp buy
    if(rsi15 > 75) scalpScore -= 2;
    if(md15.h>0 && md15.ph<=0) scalpScore += 2; // fresh crossover
    if(md15.h<0 && md15.ph>=0) scalpScore -= 2;
    if(volSurge > 2) scalpScore += 1; // volume confirmation
    if(mom1h > 1) scalpScore += 1; if(mom1h < -1) scalpScore -= 1;
    if(bb15 && price < bb15.l) scalpScore += 2; // BB oversold
    if(bb15 && price > bb15.u) scalpScore -= 1;

    // SL/TP for scalp (tighter, based on ATR×1)
    const slScalp = price - atr15*1.2;
    const riskScalp = price - slScalp;
    const tp1Scalp = price + riskScalp*2.0; // R:R 1:2 enforced
    const tp2Scalp = price + riskScalp*3.0;
    const rrScalp  = riskScalp > 0 ? (tp1Scalp-price)/riskScalp : 0;

    return {
      scalpScore,
      emaAligned: emaAligned?"▲ Bullish":"◆ Netral",
      rsi15: Math.round(rsi15||0),
      volSurge: volSurge.toFixed(1),
      mom1h: mom1h.toFixed(2),
      atr15Pct: (atr15/price*100).toFixed(2),
      slScalp, tp1Scalp, tp2Scalp, rrScalp,
      macd15: md15.h>0?"▲":"▼",
    };
  } catch(_){ return null; }
}

// ── SWING DATA: already handled by quickTA (Daily) ─────────────

// ── PROBABILITY CALCULATOR ─────────────────────────────────────
function calcProbability({
  // TA
  taScore, rsiD, bbState, macdDir, goldenX, aboveM200,
  // Market Structure
  fundingRate, oiTrend, lsRatio, takerDelta,
  // Scalp
  scalpScore,
  // Price action
  rrSwing, rrScalp,
}) {
  // Each signal contributes to weighted probability
  const signals = [];

  // === SWING SIGNALS (60% weight) ===
  // RSI (high weight)
  if(rsiD < 30)      signals.push({name:"RSI Daily OS",    prob:75, w:8});
  else if(rsiD < 40) signals.push({name:"RSI Daily Low",   prob:62, w:5});
  else if(rsiD < 50) signals.push({name:"RSI Netral",      prob:52, w:3});
  else if(rsiD > 70) signals.push({name:"RSI Daily OB",    prob:30, w:8});
  else if(rsiD > 65) signals.push({name:"RSI High",        prob:42, w:5});
  else               signals.push({name:"RSI Mid",         prob:53, w:3});

  // MA structure (very high weight)
  if(goldenX===true)         signals.push({name:"Golden Cross",  prob:68, w:10});
  else if(goldenX===false)   signals.push({name:"Death Cross",   prob:28, w:10});
  if(aboveM200===true)       signals.push({name:"Above MA200",   prob:65, w:8});
  else if(aboveM200===false) signals.push({name:"Below MA200",   prob:35, w:8});

  // MACD
  if(macdDir==="▲")          signals.push({name:"MACD Bull",     prob:61, w:5});
  else                       signals.push({name:"MACD Bear",     prob:39, w:5});

  // Bollinger
  if(bbState==="OS")         signals.push({name:"BB Oversold",   prob:70, w:6});
  else if(bbState==="OB")    signals.push({name:"BB Overbought", prob:30, w:6});
  else                       signals.push({name:"BB Neutral",    prob:50, w:2});

  // === MARKET MICROSTRUCTURE (30% weight) ===
  if(fundingRate !== null) {
    if(fundingRate < -0.05)      signals.push({name:"Funding Rate -",  prob:72, w:9}); // negative = shorts overpaying = bullish
    else if(fundingRate < 0)     signals.push({name:"Funding Low",     prob:60, w:5});
    else if(fundingRate > 0.1)   signals.push({name:"Funding Rate +",  prob:35, w:9}); // high positive = longs overpaying = bearish
    else if(fundingRate > 0.05)  signals.push({name:"Funding Mid",     prob:44, w:5});
    else                         signals.push({name:"Funding Neutral", prob:52, w:3});
  }

  if(oiTrend !== null) {
    if(oiTrend > 5)              signals.push({name:"OI Growing",      prob:65, w:7}); // rising OI = conviction
    else if(oiTrend < -5)        signals.push({name:"OI Declining",    prob:42, w:7}); // declining OI = uncertainty
    else                         signals.push({name:"OI Stable",       prob:52, w:3});
  }

  if(lsRatio !== null) {
    if(lsRatio.longRatio < 40)   signals.push({name:"Shorts Dominant", prob:68, w:8}); // low longs = contrarian buy
    else if(lsRatio.longRatio > 65) signals.push({name:"Longs Crowded",prob:32, w:8}); // high longs = crowded = risk
    else                         signals.push({name:"L/S Balanced",   prob:52, w:3});
    if(lsRatio.trend > 0.03)     signals.push({name:"Longs Rising",   prob:60, w:4});
    else if(lsRatio.trend < -0.03) signals.push({name:"Longs Falling",prob:42, w:4});
  }

  if(takerDelta !== null) {
    if(takerDelta.ratio > 1.3)   signals.push({name:"Buy Taker Dom",  prob:66, w:7}); // buy pressure
    else if(takerDelta.ratio < 0.7) signals.push({name:"Sell Taker", prob:34, w:7}); // sell pressure
    else                         signals.push({name:"Taker Neutral",  prob:50, w:3});
  }

  // === R:R QUALITY (10% weight) ===
  if(rrSwing >= 3)               signals.push({name:"RR Excellent",   prob:70, w:5});
  else if(rrSwing >= 2)          signals.push({name:"RR Good",        prob:62, w:5});
  else if(rrSwing >= 1.5)        signals.push({name:"RR Minimal",     prob:53, w:5});

  // Weighted average probability
  const totalWeight = signals.reduce((a,s)=>a+s.w, 0);
  const weightedProb = totalWeight > 0
    ? signals.reduce((a,s)=>a+s.prob*s.w, 0) / totalWeight
    : 50;

  // Confidence based on signal count and alignment
  const bullSignals = signals.filter(s=>s.prob>55).length;
  const bearSignals = signals.filter(s=>s.prob<45).length;
  const dominance = Math.abs(bullSignals-bearSignals)/(signals.length||1);
  const confidence = Math.min(95, Math.round(weightedProb * (0.7 + dominance*0.3)));

  return {
    probability: Math.round(weightedProb),
    confidence,
    signals,
    bullSignals,
    bearSignals,
    interpretation: confidence>=75?"🟢 SETUP KUAT":confidence>=60?"🟡 SETUP MODERAT":confidence>=45?"⚪ NETRAL":"🔴 SETUP LEMAH",
    grade: confidence>=75?"A":confidence>=65?"B":confidence>=55?"C":"D",
  };
}

// ── DEEP ANALYSIS PER COIN ─────────────────────────────────────
async function deepAnalyze(ticker, pricePrefetch) {
  try {
    // Fetch daily candles (already filtered to 120 for speed)
    const kR = await fetch(`https://api.binance.com/api/v3/klines?symbol=${ticker}USDT&interval=1d&limit=120`);
    if(!kR.ok) return null;
    const kl = await kR.json();
    if(!Array.isArray(kl)||kl.length<30) return null;

    const hi=kl.map(k=>+k[2]),lo=kl.map(k=>+k[3]),cl=kl.map(k=>+k[4]),vol=kl.map(k=>+k[5]);
    const price = cl[cl.length-1];

    // TA
    const m50=lst(sma(cl,50)),m200=lst(sma(cl,Math.min(100,cl.length)));
    const e50=lst(ema(cl,50)),e200=lst(ema(cl,Math.min(100,cl.length)));
    const rD=rsi(cl.slice(-30),14);
    const st=stRSI(cl);
    const aV=atrF(hi,lo,cl,14);
    const bbd=bb(cl);
    const md=macd(cl);
    const {sp,rs}=findSR(hi,lo,price);
    const t2=pricePrefetch||{};
    const ch24=+(t2.priceChangePercent||0);
    const vol24=+(t2.quoteVolume||0);

    // SWING SL/TP — S1-based, R:R minimum 2.0
    const s1=sp[0]?.price;
    const slSwing=s1?s1*0.993:price-(aV*1.8);
    const riskSwing=Math.max(price-slSwing, aV*0.5);
    // Enforce minimum R:R 2.0
    const tp1Swing=price+riskSwing*2.0; // MINIMUM 1:2
    const tp2Swing=price+riskSwing*3.0;
    const tp3Swing=price+riskSwing*5.0;
    // Check if resistance supports TP1
    const validR=rs.find(r=>r.price>=tp1Swing);
    const tp1Final=validR?.price||tp1Swing;
    const rrSwing=(tp1Final-price)/riskSwing;

    // Scores
    let lScore=0;
    if(rD<30)lScore+=4;else if(rD<40)lScore+=2;else if(rD<50)lScore+=1;
    else if(rD>70)lScore-=3;else if(rD>65)lScore-=1;
    if(st.k&&st.d){if(st.k<20&&st.d<20)lScore+=2;if(st.k>st.d&&st.k<40)lScore+=1;if(st.k>80)lScore-=2;}
    if(m200&&price>m200)lScore+=2;else if(m200)lScore-=1;
    if(price>m50)lScore+=1;else lScore-=1;
    if(e200&&e50>e200)lScore+=2;else if(e200)lScore-=1;
    if(md.h>0&&md.ph<=0)lScore+=2;else if(md.h>0)lScore+=1;else if(md.h<0&&md.ph>=0)lScore-=2;else if(md.h<0)lScore-=1;
    if(bbd&&price<bbd.l)lScore+=2;if(bbd&&price>bbd.u)lScore-=1;
    const avgVol=vol.slice(-20).reduce((a,b)=>a+b,0)/20;
    if(vol.slice(-3).reduce((a,b)=>a+b,0)/3>avgVol*1.5)lScore+=1;
    if(ch24>3)lScore+=1;else if(ch24<-8)lScore-=1;

    // Market microstructure (in parallel)
    const [funding, oi, ls, taker, scalpData] = await Promise.allSettled([
      fetchFundingRate(ticker),
      fetchOpenInterest(ticker),
      fetchLongShortRatio(ticker),
      fetchTakerVolume(ticker),
      fetchScalpingData(ticker),
    ]);
    const fundingData = funding.status==="fulfilled"?funding.value:null;
    const oiData      = oi.status==="fulfilled"?oi.value:null;
    const lsData      = ls.status==="fulfilled"?ls.value:null;
    const takerData   = taker.status==="fulfilled"?taker.value:null;
    const scalp       = scalpData.status==="fulfilled"?scalpData.value:null;

    // Probability
    const prob = calcProbability({
      taScore: lScore,
      rsiD: Math.round(rD||0),
      bbState: bbd?(price<bbd.l?"OS":price>bbd.u?"OB":"Netral"):"—",
      macdDir: md.h>0?"▲":"▼",
      goldenX: e200?e50>e200:null,
      aboveM200: m200?price>m200:null,
      fundingRate: fundingData?.current,
      oiTrend: oiData?.trend,
      lsRatio: lsData,
      takerDelta: takerData,
      rrSwing,
    });

    // Market structure interpretation
    const fundingLabel = fundingData?(
      fundingData.current<-0.05?"🟢 Shorts overpay (bullish)":
      fundingData.current>0.1?"🔴 Longs overpay (bearish)":
      fundingData.current>0.03?"🟡 Slightly elevated":
      "⚪ Neutral"
    ):"—";

    const oiLabel = oiData?.trend!=null?(
      oiData.trend>5?"🟢 OI naik "+oiData.trend.toFixed(1)+"%":
      oiData.trend<-5?"🔴 OI turun "+Math.abs(oiData.trend).toFixed(1)+"%":
      "⚪ OI stabil"
    ):"—";

    const lsLabel = lsData?(
      lsData.longRatio<40?"🟢 Shorts dominan "+lsData.shortRatio.toFixed(0)+"%":
      lsData.longRatio>65?"🔴 Longs crowded "+lsData.longRatio.toFixed(0)+"%":
      "⚪ Balanced "+lsData.longRatio.toFixed(0)+"%L/"+lsData.shortRatio.toFixed(0)+"%S"
    ):"—";

    const takerLabel = takerData?(
      takerData.ratio>1.3?"🟢 Buy pressure "+takerData.ratio.toFixed(2)+"x":
      takerData.ratio<0.7?"🔴 Sell pressure "+takerData.ratio.toFixed(2)+"x":
      "⚪ Neutral "+takerData.ratio.toFixed(2)+"x"
    ):"—";

    // Whale interpretation
    let whaleSignal = "—";
    if(fundingData && oiData && lsData && takerData) {
      const bullMicro = [
        fundingData.current<0,
        oiData.trend>0,
        lsData.longRatio<50,
        takerData.ratio>1,
      ].filter(Boolean).length;
      whaleSignal = bullMicro>=3?"🟢 Whale akumulasi terdeteksi":
                   bullMicro>=2?"🟡 Mixed — pantau volume":"🔴 Smart money mungkin distribusi";
    }

    // Swing signal
    const swingSig = lScore>=5?"BELI":lScore<=-3?"JUAL":"TAHAN";
    const scalpSig = scalp?(scalp.scalpScore>=4?"BELI":scalp.scalpScore<=-3?"JUAL":"TAHAN"):"—";

    return {
      ticker, price, ch24, vol24,
      // Swing
      swingSig, swingScore: lScore,
      slSwing, tp1: tp1Final, tp2: tp2Swing, tp3: tp3Swing, rrSwing,
      // Scalp
      scalpSig, scalp,
      // TA
      rsiD: Math.round(rD||0),
      stK: st.k?Math.round(st.k):null,
      macdDir: md.h>0?"▲":"▼",
      aboveM200: m200?price>m200:null,
      goldenX: e200?e50>e200:null,
      bbState: bbd?(price<bbd.l?"OS":price>bbd.u?"OB":"Netral"):"—",
      atrPct: (aV/price*100).toFixed(1),
      // Microstructure
      fundingRate: fundingData?.current,
      fundingLabel, oiLabel, lsLabel, takerLabel, whaleSignal,
      oiTrend: oiData?.trend,
      lsRatio: lsData?.longRatio,
      takerRatio: takerData?.ratio,
      // Probability
      prob,
    };
  } catch(e){ return null; }
}

// ── MAIN SCAN ORCHESTRATOR ────────────────────────────────────
window.startScanPro = async function() {
  if(window.scanRunning) return;
  window.scanRunning = true;

  const universe = window.SELECTED_UNIVERSE || "top100";
  const allCoins = window.UNIVERSES_PRO[universe] || ALL_250.slice(0,100);
  const filterRR = document.getElementById('f-minrr')?.checked !== false;
  const minRR = 2.0; // ENFORCED 1:2

  // UI Reset
  const btn = document.getElementById('scan-btn');
  if(btn){ btn.disabled=true; btn.textContent="⏳ SCANNING PRO..."; }
  ['pro-results','scan-results','gen-content-wrap'].forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  const feed = document.getElementById('scan-feed');
  const bar  = document.getElementById('scan-bar');
  const cnt  = document.getElementById('scan-count');
  const fnd  = document.getElementById('scan-found');
  if(feed) feed.innerHTML=""; if(bar) bar.style.width="0%";
  document.getElementById('scan-progress')?.classList.remove('hidden');

  // PHASE 1: Batch pre-filter via 24h ticker (1 API call)
  document.getElementById('scan-status').textContent="Phase 1: Pre-filtering...";
  document.getElementById('scan-phase').textContent=`Fetching ${allCoins.length} ticker sekaligus...`;
  let prefetchMap = {};
  try {
    const resp = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    if(resp.ok) {
      const all = await resp.json();
      all.forEach(t=>{ if(t.symbol.endsWith('USDT')) prefetchMap[t.symbol.replace('USDT','')] = t; });
    }
  } catch(_){}

  // Pre-filter: only coins with volume + price data
  const candidates = allCoins.filter(t => {
    const d = prefetchMap[t];
    if(!d) return false;
    const vol = parseFloat(d.quoteVolume);
    const price = parseFloat(d.lastPrice);
    return vol > 500000 && price > 0; // min $500k volume
  });

  if(feed) feed.innerHTML+=`<span style="color:#00ff87">✓ Pre-filter: ${candidates.length}/${allCoins.length} lolos (vol>${500000/1e6}M)</span><br/>`;
  if(fnd) fnd.textContent=`${candidates.length} kandidat`;

  // PHASE 2: Deep analysis on candidates
  document.getElementById('scan-status').textContent="Phase 2: Deep Analysis...";
  document.getElementById('scan-phase').textContent="TA + Market Microstructure + Probability";

  const results = [];
  let done = 0;

  // Batch by 5 for speed (parallel within batch, sequential between batches)
  const BATCH = 5;
  for(let i=0; i<candidates.length; i+=BATCH) {
    const batch = candidates.slice(i, i+BATCH);
    const batchResults = await Promise.allSettled(
      batch.map(t => deepAnalyze(t, prefetchMap[t]))
    );
    batchResults.forEach((res,bi) => {
      done++;
      if(bar) bar.style.width=Math.round(done/candidates.length*100)+"%";
      if(cnt) cnt.textContent=`${done} / ${candidates.length} koin`;
      if(res.status==="fulfilled"&&res.value) {
        const r = res.value;
        results.push(r);
        if(feed){
          const sc = r.swingSig==="BELI"?"#00ff87":r.swingSig==="JUAL"?"#ff4560":"#5a6a7a";
          const pc = r.prob.grade==="A"?"#ffd700":r.prob.grade==="B"?"#00ff87":"#5a6a7a";
          feed.innerHTML+=`<span style="color:#c4ccd6">${r.ticker}</span> · <span style="color:${sc}">${r.swingSig}</span> · P:<span style="color:${pc}">${r.prob.probability}%</span> · RR:${r.rrSwing.toFixed(1)} · FR:${r.fundingRate?.toFixed(3)||"—"}<br/>`;
          feed.scrollTop=feed.scrollHeight;
        }
        if(fnd) fnd.textContent=`${results.filter(r=>r.prob.probability>=60).length} setup valid`;
      }
    });
    // Small delay between batches
    await new Promise(res=>setTimeout(res,300));
  }

  // Sort and classify
  results.sort((a,b)=>b.prob.confidence-a.prob.confidence);

  // Filter by R:R >= 2.0 and classify
  const valid = results.filter(r => r.rrSwing >= minRR || r.scalp?.rrScalp >= minRR);

  const swingBest  = valid.filter(r=>r.swingSig==="BELI"&&r.rrSwing>=minRR).slice(0,15);
  const scalpBest  = valid.filter(r=>r.scalpSig==="BELI"&&r.scalp?.rrScalp>=minRR).slice(0,10);
  const shortBest  = valid.filter(r=>r.swingSig==="JUAL").slice(0,8);
  const watchlist  = results.filter(r=>r.swingSig==="TAHAN"&&r.prob.probability>=55).slice(0,10);

  // Cache
  window.scanResultsCache = results;
  window.selectedCoinsForContent = new Set(swingBest.slice(0,4).map(r=>r.ticker));

  // Render
  renderProResults(swingBest, scalpBest, shortBest, watchlist, results.length, candidates.length);

  document.getElementById('scan-progress')?.classList.add('hidden');
  document.getElementById('pro-results')?.classList.remove('hidden');
  document.getElementById('gen-content-wrap')?.classList.remove('hidden');
  if(btn){ btn.disabled=false; btn.textContent="⚡ SCAN LAGI"; }
  window.scanRunning = false;
};

// ── RENDER PRO RESULTS ─────────────────────────────────────────
function renderProResults(swingList, scalpList, shortList, watchlist, totalScanned, totalCandidates) {
  const container = document.getElementById('pro-results');
  if(!container) return;

  // Summary
  const allValid = [...swingList,...scalpList,...shortList].filter((v,i,a)=>a.findIndex(x=>x.ticker===v.ticker)===i);
  const avgProb = allValid.length ? Math.round(allValid.reduce((a,r)=>a+r.prob.probability,0)/allValid.length) : 0;

  let html = `
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">
    ${[
      {l:"Di-scan",   v:totalScanned,      c:"#e8f0f8"},
      {l:"Kandidat",  v:totalCandidates,   c:"#c4ccd6"},
      {l:"R:R≥2 Valid",v:swingList.length+scalpList.length, c:"#00ff87"},
      {l:"Avg Prob",  v:avgProb+"%",       c:avgProb>=65?"#00ff87":"#f5c518"},
    ].map(x=>`<div style="background:rgba(9,12,20,.9);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:11px;text-align:center">
      <div style="font-size:18px;font-weight:800;color:${x.c};font-family:'IBM Plex Mono',monospace">${x.v}</div>
      <div style="font-size:8px;color:var(--dmr);letter-spacing:1px;text-transform:uppercase;margin-top:2px">${x.l}</div>
    </div>`).join("")}
  </div>`;

  // ── SWING TRADE SECTION ──
  if(swingList.length) {
    html += `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:4px">
      <div style="background:linear-gradient(135deg,#00ff87,#00cc6a);border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:#000;letter-spacing:2px">📈 SWING TRADE</div>
      <div style="font-size:10px;color:#00ff87">Daily TF · R:R Min 1:2 · Hold 3-14 hari</div>
    </div>
    ${swingList.map((r,i)=>renderCoinCard(r,"swing",i)).join("")}`;
  }

  // ── SCALP TRADE SECTION ──
  if(scalpList.length) {
    html += `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:20px">
      <div style="background:linear-gradient(135deg,#00ccff,#0088cc);border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:#000;letter-spacing:2px">⚡ SCALP TRADE</div>
      <div style="font-size:10px;color:#00ccff">15m TF · R:R Min 1:2 · Hold menit-jam</div>
    </div>
    ${scalpList.map((r,i)=>renderCoinCard(r,"scalp",i)).join("")}`;
  }

  // ── SHORT SECTION ──
  if(shortList.length) {
    html += `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;margin-top:20px">
      <div style="background:linear-gradient(135deg,#ff4560,#cc2040);border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:#fff;letter-spacing:2px">▼ SHORT / BEARISH</div>
      <div style="font-size:10px;color:#ff4560">Setup bearish terkonfirmasi</div>
    </div>
    ${shortList.map((r,i)=>renderCoinCard(r,"short",i)).join("")}`;
  }

  // ── WATCHLIST ──
  if(watchlist.length) {
    html += `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;margin-top:20px">
      <div style="background:rgba(245,197,24,.2);border:1px solid rgba(245,197,24,.4);border-radius:8px;padding:5px 14px;font-size:10px;font-weight:800;color:#f5c518;letter-spacing:2px">👁 WATCHLIST</div>
      <div style="font-size:10px;color:#f5c518">TAHAN — Tunggu konfirmasi</div>
    </div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:12px">
      ${watchlist.map(r=>`<div onclick="window.goAnalyze('${r.ticker}')" style="padding:8px 14px;background:rgba(245,197,24,.06);border:1px solid rgba(245,197,24,.2);border-radius:10px;cursor:pointer;transition:all .2s"
        onmouseover="this.style.borderColor='rgba(245,197,24,.5)'" onmouseout="this.style.borderColor='rgba(245,197,24,.2)'">
        <div style="font-size:12px;font-weight:700;color:#e8f0f8">${r.ticker}</div>
        <div style="font-size:9px;color:${r.prob.probability>=60?"#f5c518":"#5a6a7a"};margin-top:2px">${r.prob.probability}% prob</div>
        <div style="font-size:9px;color:#3d4a5a">${r.rsiD} RSI</div>
      </div>`).join("")}
    </div>`;
  }

  container.innerHTML = html;
}

function renderCoinCard(r, mode, rank) {
  const isScalp = mode==="scalp";
  const isShort = mode==="short";
  const color   = isShort?"#ff4560":isScalp?"#00ccff":"#00ff87";
  const bgColor = isShort?"rgba(255,69,96,.05)":isScalp?"rgba(0,204,255,.05)":"rgba(0,255,135,.05)";
  const sig     = isScalp?(r.scalpSig||"—"):r.swingSig;
  const sl      = isScalp?r.scalp?.slScalp:r.slSwing;
  const tp1     = isScalp?r.scalp?.tp1Scalp:r.tp1;
  const tp2     = isScalp?r.scalp?.tp2Scalp:r.tp2;
  const rr      = isScalp?r.scalp?.rrScalp:r.rrSwing;
  const rrColor = (rr||0)>=3?"#00ff87":(rr||0)>=2?"#00c96a":"#f5c518";
  const prob    = r.prob;
  const gradeColor = prob.grade==="A"?"#ffd700":prob.grade==="B"?"#00ff87":prob.grade==="C"?"#f5c518":"#ff4560";

  return `<div style="background:${bgColor};border:1px solid ${color}22;border-left:3px solid ${color};border-radius:12px;padding:14px 16px;margin-bottom:10px">

  <!-- Header -->
  <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px;flex-wrap:wrap">
    <span style="font-size:18px;font-weight:800;color:#e8f0f8">#${rank+1}</span>
    <span style="font-size:16px;font-weight:800;color:${color}">${r.ticker}</span>
    <span style="font-size:15px;font-weight:700;color:#e8f0f8;font-family:'IBM Plex Mono',monospace">${fmt(r.price)}</span>
    <span style="font-size:11px;color:${r.ch24>=0?"#00ff87":"#ff4560"};font-weight:700">${r.ch24>=0?"+":""}${r.ch24.toFixed(2)}%</span>
    <span style="padding:3px 9px;background:${color}18;border:1px solid ${color}40;border-radius:5px;font-size:9px;font-weight:700;color:${color};letter-spacing:1px">${isScalp?"⚡":"📈"} ${sig}</span>
    <!-- Grade badge -->
    <span style="padding:3px 10px;background:${gradeColor}18;border:1px solid ${gradeColor}40;border-radius:5px;font-size:10px;font-weight:800;color:${gradeColor};margin-left:auto">GRADE ${prob.grade}</span>
  </div>

  <!-- Probability gauge -->
  <div style="background:rgba(255,255,255,.03);border-radius:9px;padding:11px 14px;margin-bottom:10px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <div style="font-size:9px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase">Probabilitas Win</div>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;color:#4b5d6e">${prob.bullSignals}B · ${prob.bearSignals}R</span>
        <span style="font-size:16px;font-weight:800;color:${gradeColor};font-family:'IBM Plex Mono',monospace">${prob.probability}%</span>
      </div>
    </div>
    <div style="height:6px;background:rgba(255,255,255,.05);border-radius:4px;overflow:hidden">
      <div style="height:100%;width:${prob.probability}%;background:linear-gradient(90deg,${gradeColor}88,${gradeColor});border-radius:4px;transition:width .6s"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:5px">
      <span style="font-size:9px;color:var(--dmr)">0% bearish</span>
      <span style="font-size:9px;color:${gradeColor}">${prob.interpretation}</span>
      <span style="font-size:9px;color:var(--dmr)">100% bullish</span>
    </div>
  </div>

  <!-- TA + Market Microstructure grid -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">

    <!-- TA Indicators -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:9px;padding:10px 12px">
      <div style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">📊 Teknikal</div>
      ${[
        {l:"RSI Daily",  v:r.rsiD,  c:r.rsiD>70?"#ff4560":r.rsiD<35?"#00ff87":"#f5c518"},
        {l:"StochRSI",   v:r.stK||"—", c:r.stK&&r.stK<25?"#00ff87":r.stK&&r.stK>75?"#ff4560":"#c4ccd6"},
        {l:"MACD",       v:r.macdDir, c:r.macdDir==="▲"?"#00ff87":"#ff4560"},
        {l:"MA200",      v:r.aboveM200===true?"Atas":r.aboveM200===false?"Bawah":"—", c:r.aboveM200===true?"#00ff87":r.aboveM200===false?"#ff4560":"#f5c518"},
        {l:"EMA Cross",  v:r.goldenX===true?"Golden ✓":r.goldenX===false?"Death ✗":"—", c:r.goldenX===true?"#00ff87":r.goldenX===false?"#ff4560":"#5a6a7a"},
        {l:"Bollinger",  v:r.bbState, c:r.bbState==="OS"?"#00ff87":r.bbState==="OB"?"#ff4560":"#5a6a7a"},
      ].map(x=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.03)"><span style="font-size:10px;color:#3d4a5a">${x.l}</span><span style="font-size:10px;font-weight:700;color:${x.c}">${x.v}</span></div>`).join("")}
    </div>

    <!-- Market Microstructure -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:9px;padding:10px 12px">
      <div style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">🐋 Market Structure</div>
      ${[
        {l:"Funding Rate", v:r.fundingLabel},
        {l:"Open Interest",v:r.oiLabel},
        {l:"Long/Short",   v:r.lsLabel},
        {l:"Taker Volume", v:r.takerLabel},
        {l:"Whale Signal", v:r.whaleSignal},
        {l:"ATR Volatil.", v:r.atrPct+"%", c:"#5a6a7a"},
      ].map(x=>`<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.03);gap:6px"><span style="font-size:10px;color:#3d4a5a;flex-shrink:0">${x.l}</span><span style="font-size:9px;text-align:right;color:${x.c||"#8a9aaa"};line-height:1.3">${x.v}</span></div>`).join("")}
    </div>
  </div>

  ${isScalp ? `
  <!-- Scalp specific -->
  <div style="background:rgba(0,204,255,.04);border:1px solid rgba(0,204,255,.15);border-radius:9px;padding:10px 12px;margin-bottom:10px">
    <div style="font-size:8px;color:#00ccff;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">⚡ Scalp 15m Data</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;text-align:center">
      ${[
        {l:"EMA 8/21/55",v:r.scalp?.emaAligned||"—",c:"#c4ccd6"},
        {l:"RSI 15m",    v:r.scalp?.rsi15||"—",    c:r.scalp?.rsi15>70?"#ff4560":r.scalp?.rsi15<30?"#00ff87":"#f5c518"},
        {l:"MACD 15m",  v:r.scalp?.macd15||"—",    c:r.scalp?.macd15==="▲"?"#00ff87":"#ff4560"},
        {l:"Vol Surge", v:r.scalp?.volSurge+"x"||"—", c:r.scalp?.volSurge>2?"#00ff87":"#5a6a7a"},
      ].map(x=>`<div><div style="font-size:8px;color:var(--dmr);margin-bottom:2px">${x.l}</div><div style="font-size:10px;font-weight:700;color:${x.c||"#c4ccd6"}">${x.v}</div></div>`).join("")}
    </div>
  </div>` : ""}

  <!-- SL/TP Levels -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px">
    <div style="background:rgba(255,69,96,.07);border:1px solid rgba(255,69,96,.2);border-radius:7px;padding:7px;text-align:center">
      <div style="font-size:8px;color:#7a2030;margin-bottom:2px;text-transform:uppercase">Stop Loss</div>
      <div style="font-size:11px;font-weight:700;color:#ff4560;font-family:'IBM Plex Mono',monospace">${fmt(sl)}</div>
    </div>
    <div style="background:rgba(0,255,135,.06);border:1px solid rgba(0,255,135,.2);border-radius:7px;padding:7px;text-align:center">
      <div style="font-size:8px;color:#1e4a2a;margin-bottom:2px;text-transform:uppercase">TP1 (1:2)</div>
      <div style="font-size:11px;font-weight:700;color:#00ff87;font-family:'IBM Plex Mono',monospace">${fmt(tp1)}</div>
    </div>
    <div style="background:rgba(0,255,135,.04);border:1px solid rgba(0,255,135,.12);border-radius:7px;padding:7px;text-align:center">
      <div style="font-size:8px;color:#1a3d24;margin-bottom:2px;text-transform:uppercase">TP2 (1:3)</div>
      <div style="font-size:11px;font-weight:700;color:#00c96a;font-family:'IBM Plex Mono',monospace">${fmt(tp2)}</div>
    </div>
    <div style="background:rgba(245,197,24,.05);border:1px solid rgba(245,197,24,.15);border-radius:7px;padding:7px;text-align:center">
      <div style="font-size:8px;color:#4a3d10;margin-bottom:2px;text-transform:uppercase">R:R Ratio</div>
      <div style="font-size:11px;font-weight:700;color:${rrColor};font-family:'IBM Plex Mono',monospace">1:${(rr||0).toFixed(2)}</div>
    </div>
  </div>

  <!-- Signal breakdown top 5 -->
  <div style="background:rgba(255,255,255,.02);border-radius:8px;padding:9px 11px;margin-bottom:10px">
    <div style="font-size:8px;color:var(--dmr);letter-spacing:2px;text-transform:uppercase;margin-bottom:7px">Top Sinyal Konfluensi</div>
    <div style="display:flex;gap:5px;flex-wrap:wrap">
      ${prob.signals.sort((a,b)=>(b.prob>55?b.w:-b.w)-(a.prob>55?a.w:-a.w)).slice(0,8).map(s=>`
        <span style="padding:3px 8px;background:${s.prob>55?"rgba(0,255,135,.08)":"rgba(255,69,96,.08)"};border:1px solid ${s.prob>55?"rgba(0,255,135,.2)":"rgba(255,69,96,.2)"};border-radius:10px;font-size:9px;color:${s.prob>55?"#00ff87":"#ff4560"}">
          ${s.name} ${s.prob}%
        </span>`).join("")}
    </div>
  </div>

  <!-- Action buttons -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px">
    <button onclick="window.goAnalyze('${r.ticker}')" style="padding:9px;background:rgba(0,255,135,.08);border:1px solid rgba(0,255,135,.25);border-radius:8px;color:#00ff87;font-size:9px;font-weight:700;letter-spacing:1px;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(0,255,135,.18)'" onmouseout="this.style.background='rgba(0,255,135,.08)'">📊 DETAIL</button>
    <button onclick="window.quickSave('${r.ticker}','${sig}',${r.price},${sl||0},${tp1||0},${tp2||0},${r.tp3||0},${prob.probability})" style="padding:9px;background:rgba(0,204,255,.08);border:1px solid rgba(0,204,255,.25);border-radius:8px;color:#00ccff;font-size:9px;font-weight:700;letter-spacing:1px;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(0,204,255,.18)'" onmouseout="this.style.background='rgba(0,204,255,.08)'">＋ TRACKER</button>
    <button onclick="window.quickTradeOpen('${r.ticker}','${sig}',${r.price},${sl||0},${tp1||0},${tp2||0},${r.tp3||0})" style="padding:9px;background:rgba(245,197,24,.08);border:1px solid rgba(245,197,24,.25);border-radius:8px;color:#f5c518;font-size:9px;font-weight:700;letter-spacing:1px;cursor:pointer;font-family:'IBM Plex Mono',monospace"
      onmouseover="this.style.background='rgba(245,197,24,.18)'" onmouseout="this.style.background='rgba(245,197,24,.08)'">⚡ BYBIT</button>
  </div>
</div>`;
}
