// Tela de login do admin — servida pelo Worker em /admin-core-sys quando NÃO há sessão.
// Posta em /api/admin/login (que já existe) e, no sucesso, recarrega o painel.
export const LOGIN_UI_HTML = `<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entrar · Beauthé Core System</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#FFE8DD;--card:#fff;--border:oklch(0.928 0.006 264.531);--dark:oklch(0.21 0.034 264.665);--muted:#8b8893;--accent:oklch(0.514 0.222 16.935);--accentBg:oklch(0.969 0.015 12.422)}
*{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
body{margin:0;min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--dark);padding:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:36px 34px;width:100%;max-width:380px;box-shadow:0 8px 34px rgba(16,24,40,.10)}
.logo{width:46px;height:46px;border-radius:13px;background:var(--dark);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;margin-bottom:18px}
h1{font-size:21px;font-weight:800;margin:0 0 3px;letter-spacing:-.01em}
.sub{color:var(--muted);font-size:13.5px;margin:0 0 18px}
label{display:block;font-size:12px;color:var(--muted);margin:14px 0 6px;font-weight:500}
input{width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:#fff;color:var(--dark)}
input:focus{outline:none;border-color:var(--accent)}
button{width:100%;margin-top:24px;background:var(--dark);color:#fff;border:none;padding:13px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600}
button:disabled{opacity:.6;cursor:default}
.msg{margin-top:14px;font-size:13px;padding:10px 13px;border-radius:11px;background:var(--accentBg);color:var(--accent);display:none;font-weight:500}
.foot{margin-top:18px;text-align:center;font-size:12.5px}.foot a{color:var(--muted);text-decoration:none}
</style></head>
<body>
<form class="card" id="f">
  <div class="logo">B.</div>
  <h1>Core System V2</h1>
  <p class="sub">Entre para acessar o painel da Beauthé.</p>
  <label>Usuário</label><input id="u" autocomplete="username" autofocus>
  <label>Senha</label><input id="p" type="password" autocomplete="current-password">
  <button id="b" type="submit">Entrar</button>
  <div id="m" class="msg"></div>
  <div class="foot"><a href="/">&larr; Voltar para a loja</a></div>
</form>
<script>
var f=document.getElementById('f'),b=document.getElementById('b'),m=document.getElementById('m');
function err(t){m.textContent=t;m.style.display='block'}
f.addEventListener('submit',function(e){
  e.preventDefault();
  var u=document.getElementById('u').value.trim(),p=document.getElementById('p').value;
  if(!u||!p){err('Preencha usuário e senha.');return}
  b.disabled=true;b.textContent='Entrando…';m.style.display='none';
  fetch('/api/admin/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})})
   .then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{ok:r.ok,d:d}})})
   .then(function(x){if(x.ok){location.replace('/admin-core-sys?_='+Date.now())}else{err((x.d&&x.d.error)||'Falha no login.');b.disabled=false;b.textContent='Entrar'}})
   .catch(function(){err('Erro de conexão. Tente de novo.');b.disabled=false;b.textContent='Entrar'});
});
</script>
</body></html>`;
