// Página "Comportamento" — servida em /api/admin/analytics, embutida inline no /admin-core-sys.
// Mostra os números do Microsoft Clarity (Data Export API). Heatmaps/gravações ficam no Clarity (link).
export const ANALYTICS_UI_HTML = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Comportamento · Beauthé</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#FBF9F8;--card:#fff;--border:oklch(0.928 0.006 264.531);--dark:oklch(0.21 0.034 264.665);--muted:#8b8893;--accent:oklch(0.514 0.222 16.935);--accentBg:oklch(0.969 0.015 12.422)}
*{box-sizing:border-box;font-family:Inter,Outfit,ui-sans-serif,system-ui,sans-serif}
body{margin:0;background:var(--bg);color:var(--dark)}
.wrap{max-width:1120px;margin:0 auto;padding:30px 30px 48px}
.head{display:flex;align-items:center;gap:11px;margin-bottom:4px}
.head h1{font-size:25px;font-weight:800;margin:0;letter-spacing:-.015em}
.head .ic{width:34px;height:34px;border-radius:10px;background:var(--accentBg);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px}
.sub{color:var(--muted);font-size:14px;margin:0 0 18px}
.bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:20px}
.btn{background:var(--dark);color:#fff;border:none;padding:10px 18px;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600;text-decoration:none;display:inline-block}
.btn.ghost{background:#fff;border:1px solid var(--border);color:var(--dark)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;margin-bottom:18px}
.stat{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:18px 20px}
.stat .v{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.stat .l{color:var(--muted);font-size:12.5px;font-weight:500;margin-top:5px}
.card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:22px 24px;margin-bottom:18px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card h2{font-size:15px;font-weight:700;margin:0 0 14px}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:10px;border-bottom:1px solid var(--border)}
tr:last-child td{border-bottom:0}
th{color:var(--muted);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.muted{color:var(--muted);font-size:13px}
.note{background:var(--accentBg);border-radius:16px;padding:15px 18px;font-size:13.5px;color:var(--dark);margin-bottom:18px;line-height:1.5}
#login{max-width:400px;margin:80px auto;text-align:center}
a{color:var(--accent)}
details{font-size:12px;color:var(--muted);margin-top:10px}
pre{white-space:pre-wrap;word-break:break-all;background:#f6f4f2;padding:10px;border-radius:10px}
</style></head>
<body>
<div id="app" style="display:none">
  <div class="wrap">
    <div class="head"><div class="ic">📊</div><h1>Comportamento</h1></div>
    <p class="sub">Como os clientes navegam na loja — dados do Microsoft Clarity (últimas 72h). <span id="upd"></span></p>
    <div class="bar">
      <button class="btn ghost" onclick="load(true)">↻ Atualizar agora</button>
      <a class="btn" href="https://clarity.microsoft.com/projects/view/x5jtni06em/dashboard" target="_blank" rel="noopener">Abrir Clarity (mapas de calor &amp; gravações) →</a>
    </div>
    <div id="content"></div>
    <div class="note">🔥 <b>Mapas de calor</b> e 🎥 <b>gravações de sessão</b> não têm API/embed — ficam no Clarity (botão acima). Aqui ficam os <b>números</b>, atualizados a cada ~6h (limite de 10 consultas/dia da API).</div>
  </div>
</div>
<div id="login" style="display:none">
  <h2>Faça login primeiro</h2>
  <p class="muted">Sua sessão de admin não está ativa.</p>
  <p><a href="/admin-core-sys">→ Ir para o painel e entrar</a></p>
</div>
<script>
var api=function(p,o){o=o||{};return fetch('/api'+p,Object.assign({credentials:'include',headers:{'Content-Type':'application/json'}},o)).then(function(r){return r.json().catch(function(){return {};}).then(function(d){return {ok:r.ok,status:r.status,data:d};});});};
function fmt(v){if(v==null||v==='')return '—';var n=Number(String(v).replace(/[^0-9.]/g,''));if(isNaN(n))return String(v);return n.toLocaleString('pt-BR',{maximumFractionDigits:1});}
function ago(ms){if(!ms)return '';var min=Math.round((Date.now()-Number(ms))/60000);if(min<1)return 'agora';if(min<60)return 'há '+min+' min';return 'há '+Math.round(min/60)+'h';}
function statCard(value,label){var d=document.createElement('div');d.className='stat';var v=document.createElement('div');v.className='v';v.textContent=value;var l=document.createElement('div');l.className='l';l.textContent=label;d.appendChild(v);d.appendChild(l);return d;}
var LBL={DeadClickCount:'Dead clicks (% sessões)',RageClickCount:'Rage clicks (% sessões)',ExcessiveScroll:'Scroll excessivo (% sessões)',QuickbackClick:'Quickbacks (% sessões)',ErrorClickCount:'Cliques c/ erro (% sessões)',ScriptErrorCount:'Erros de script (% sessões)'};
function render(res){
  var c=document.getElementById('content');c.innerHTML='';
  document.getElementById('upd').textContent=res&&res.fetched_at?('· atualizado '+ago(res.fetched_at)+(res.stale?' (cache)':'')):'';
  if(!res||!res.configured){c.innerHTML='<div class="card"><h2>Falta configurar o token do Clarity</h2><p class="muted">Gere um token em <a href="https://clarity.microsoft.com/projects/view/x5jtni06em/settings" target="_blank" rel="noopener">Clarity &rarr; Settings &rarr; Data Export</a> e me peça pra setar o secret <b>CLARITY_API_TOKEN</b>. Aí os números aparecem aqui.</p></div>';return;}
  if(res.error){var e=document.createElement('div');e.className='card';e.innerHTML='<h2>Aviso</h2><p class="muted">'+res.error+'</p>';c.appendChild(e);if(!res.metrics||!res.metrics.length)return;}
  var metrics=Array.isArray(res.metrics)?res.metrics:[];
  var by={};metrics.forEach(function(m){if(m&&m.metricName)by[m.metricName]=(m.information||[]);});
  var grid=document.createElement('div');grid.className='grid';var n=0;
  var tr=(by.Traffic||[])[0];
  if(tr){[['Sessões',tr.totalSessionCount],['Usuários únicos',tr.distinctUserCount],['Páginas/sessão',tr.pagesPerSessionPercentage],['Sessões de bot',tr.totalBotSessionCount]].forEach(function(p){if(p[1]!=null){grid.appendChild(statCard(fmt(p[1]),p[0]));n++;}});}
  var sd=(by.ScrollDepth||[])[0];if(sd&&sd.averageScrollDepth!=null){grid.appendChild(statCard(fmt(sd.averageScrollDepth)+'%','Scroll médio'));n++;}
  var et=(by.EngagementTime||[])[0];if(et){var v=et.activeTime!=null?et.activeTime:et.totalTime;if(v!=null){grid.appendChild(statCard(fmt(v),'Tempo de engajamento'));n++;}}
  ['DeadClickCount','RageClickCount','ExcessiveScroll','QuickbackClick','ErrorClickCount','ScriptErrorCount'].forEach(function(k){var x=(by[k]||[])[0];if(x){var val=x.sessionsWithMetricPercentage!=null?fmt(x.sessionsWithMetricPercentage)+'%':(x.subTotal!=null?fmt(x.subTotal):null);if(val!=null){grid.appendChild(statCard(val,LBL[k]));n++;}}});
  if(n)c.appendChild(grid);
  var pp=by.PopularPages||by.PopularUrls||[];
  if(pp.length){var card=document.createElement('div');card.className='card';card.innerHTML='<h2>Páginas mais vistas</h2>';var t=document.createElement('table');t.innerHTML='<thead><tr><th>Página</th><th>Visitas</th></tr></thead>';var tb=document.createElement('tbody');pp.slice(0,15).forEach(function(p){var r2=document.createElement('tr');var a=document.createElement('td');a.textContent=p.url||p.Url||p.pageTitle||p.PageTitle||'—';var b=document.createElement('td');b.textContent=fmt(p.visitsCount||p.totalSessionCount||p.VisitsCount);r2.appendChild(a);r2.appendChild(b);tb.appendChild(r2);});t.appendChild(tb);card.appendChild(t);c.appendChild(card);}
  if(!n&&!pp.length){var d=document.createElement('div');d.className='card';d.innerHTML='<h2>Sem dados ainda</h2><p class="muted">O Clarity precisa de visitas reais nas últimas 72h pra gerar números. Assim que a loja tiver tráfego, eles aparecem aqui automaticamente.</p>';var det=document.createElement('details');det.innerHTML='<summary>Resposta da API (debug)</summary><pre>'+JSON.stringify(res.metrics,null,1).slice(0,1800)+'</pre>';d.appendChild(det);c.appendChild(d);}
}
function load(force){var c=document.getElementById('content');c.innerHTML='<p class="muted">Carregando…</p>';api('/admin/clarity'+(force?'/refresh':''),force?{method:'POST'}:{}).then(function(r){if(r.status===401){document.getElementById('app').style.display='none';document.getElementById('login').style.display='block';return;}render(r.data||{});});}
async function init(){var me=await api('/admin/me');if(!me.ok){document.getElementById('login').style.display='block';return;}document.getElementById('app').style.display='block';load(false);}
init();
</script>
</body></html>`;
