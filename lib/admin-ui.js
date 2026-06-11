// Página de gestão de usuários — servida em /api/admin/ui, embutida inline no /admin-core-sys.
// Identidade visual alinhada ao painel (Inter, cards 24px, accent coral, oklch como o Tailwind v4 do app).
export const ADMIN_UI_HTML = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gestão de Usuários · Beauthé</title>
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
.sub{color:var(--muted);font-size:14px;margin:0 0 22px}
.tabs{display:flex;gap:8px;margin-bottom:18px}
.tabs button{background:#fff;border:1px solid var(--border);color:var(--dark);padding:9px 18px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600;transition:.12s}
.tabs button.active{background:var(--accentBg);border-color:transparent;color:var(--accent)}
.card{background:var(--card);border:1px solid var(--border);border-radius:24px;padding:22px 24px;margin-bottom:18px;box-shadow:0 1px 2px rgba(16,24,40,.04)}
.card h2{font-size:15px;font-weight:700;margin:0 0 16px}
.row{display:flex;gap:12px;flex-wrap:wrap;align-items:end}
.row>div{flex:1;min-width:150px}
label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:500}
input,select{width:100%;padding:11px 13px;border:1px solid var(--border);border-radius:12px;font-size:14px;background:#fff;color:var(--dark)}
input:focus,select:focus{outline:none;border-color:var(--accent)}
.btn{background:var(--dark);color:#fff;border:none;padding:11px 22px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:600}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:12px 10px;border-bottom:1px solid var(--border)}
tr:last-child td{border-bottom:0}
th{color:var(--muted);font-weight:500;font-size:11px;text-transform:uppercase;letter-spacing:.04em}
.mini{font-size:12px;padding:7px 13px;border-radius:9px;border:1px solid var(--border);background:#fff;color:var(--dark);cursor:pointer;margin-left:8px;font-weight:600}
.mini.danger{color:var(--accent);border-color:var(--accentBg)}
.badge{font-size:11px;padding:3px 11px;border-radius:20px;background:#f1f0f3;color:var(--muted);font-weight:600}
.badge.role{background:var(--accentBg);color:var(--accent)}
.badge.ok{background:oklch(0.962 0.044 156.743);color:oklch(0.527 0.154 150.069)}
.msg{padding:11px 15px;border-radius:12px;margin-bottom:14px;font-size:13px;display:none;font-weight:500}
.muted{color:var(--muted);font-size:12px}
#login{max-width:400px;margin:80px auto;text-align:center}
a{color:var(--accent)}
</style></head>
<body>
<div id="app" style="display:none">
  <div class="wrap">
    <div class="head"><div class="ic">👤</div><h1>Gestão de Usuários</h1></div>
    <p class="sub">Crie e gerencie os administradores do painel e veja os clientes cadastrados na loja. <span id="who"></span></p>
    <div id="msg" class="msg"></div>
    <div class="tabs"><button id="tab-a" class="active" onclick="show('a')">Admins</button><button id="tab-c" onclick="show('c')">Clientes</button></div>
    <div id="view-a">
      <div class="card"><h2>Criar novo admin</h2>
        <div class="row">
          <div><label>Usuário</label><input id="nu" placeholder="ex: maria" autocomplete="off"></div>
          <div><label>Senha (mín. 8)</label><input id="np" type="password" placeholder="••••••••" autocomplete="new-password"></div>
          <div style="flex:0 0 140px"><label>Papel</label><select id="nr"><option value="admin">admin</option><option value="owner">owner</option><option value="editor">editor</option></select></div>
          <div style="flex:0 0 auto"><button class="btn" onclick="createAdmin()">Criar</button></div>
        </div>
        <p class="muted" style="margin:12px 0 0">Para recuperar a senha de um admin, use "Resetar senha" abaixo (outro admin faz por você). Tenha sempre 2 admins como backup de acesso.</p>
      </div>
      <div class="card"><h2>Administradores</h2><table id="t-a"><thead><tr><th>ID</th><th>Usuário</th><th>Papel</th><th>Último login</th><th></th></tr></thead><tbody></tbody></table></div>
    </div>
    <div id="view-c" style="display:none">
      <div class="card"><h2>Clientes da loja</h2><table id="t-c"><thead><tr><th>ID</th><th>E-mail</th><th>Nome</th><th>Verificado</th><th>Cadastro</th><th></th></tr></thead><tbody></tbody></table></div>
    </div>
  </div>
</div>
<div id="login" style="display:none">
  <h2>Faça login primeiro</h2>
  <p class="muted">Sua sessão de admin não está ativa.</p>
  <p><a href="/admin-core-sys">→ Ir para o painel e entrar</a></p>
</div>
<script>
var api=function(p,o){o=o||{};return fetch('/api'+p,Object.assign({credentials:'include',headers:{'Content-Type':'application/json'}},o)).then(function(r){return r.json().catch(function(){return {};}).then(function(d){return {ok:r.ok,status:r.status,data:d};});});};
function msg(t,ok){var m=document.getElementById('msg');m.textContent=t;m.style.display='block';m.style.background=ok?'oklch(0.962 0.044 156.743)':'oklch(0.971 0.013 17.38)';m.style.color=ok?'oklch(0.527 0.154 150.069)':'oklch(0.514 0.222 16.935)';setTimeout(function(){m.style.display='none';},4000);}
function fmtDate(ms){if(!ms)return '—';var n=Number(ms);return isNaN(n)?'—':new Date(n).toLocaleString('pt-BR');}
function cell(t){var td=document.createElement('td');td.textContent=t;return td;}
function mini(label,danger,fn){var b=document.createElement('button');b.className='mini'+(danger?' danger':'');b.textContent=label;b.onclick=fn;return b;}
function show(v){document.getElementById('view-a').style.display=v==='a'?'':'none';document.getElementById('view-c').style.display=v==='c'?'':'none';document.getElementById('tab-a').className=v==='a'?'active':'';document.getElementById('tab-c').className=v==='c'?'active':'';if(v==='c')loadClientes();}
async function init(){var me=await api('/admin/me');if(!me.ok){document.getElementById('login').style.display='block';return;}document.getElementById('who').textContent='· logado como '+(me.data.username||'admin')+' ('+(me.data.role||'')+')';document.getElementById('app').style.display='block';loadAdmins();}
async function loadAdmins(){var r=await api('/admin/users');var tb=document.querySelector('#t-a tbody');tb.innerHTML='';(r.data||[]).forEach(function(u){var tr=document.createElement('tr');tr.appendChild(cell(u.id));var nu=cell(u.username);nu.style.fontWeight='600';tr.appendChild(nu);var rl=document.createElement('td');var sp=document.createElement('span');sp.className='badge role';sp.textContent=u.role;rl.appendChild(sp);tr.appendChild(rl);tr.appendChild(cell(fmtDate(u.last_login_at)));var act=document.createElement('td');act.style.textAlign='right';act.appendChild(mini('Resetar senha',false,function(){resetPw(u.id,u.username);}));act.appendChild(mini('Remover',true,function(){delAdmin(u.id,u.username);}));tr.appendChild(act);tb.appendChild(tr);});}
async function createAdmin(){var r=await api('/admin/users',{method:'POST',body:JSON.stringify({username:document.getElementById('nu').value.trim(),password:document.getElementById('np').value,role:document.getElementById('nr').value})});if(r.ok){msg('Admin criado!',true);document.getElementById('nu').value='';document.getElementById('np').value='';loadAdmins();}else msg(r.data.error||'Erro ao criar.',false);}
async function resetPw(id,name){var p=prompt('Nova senha para "'+name+'" (mín. 8 caracteres):');if(!p)return;var r=await api('/admin/users/'+id+'/reset-password',{method:'POST',body:JSON.stringify({password:p})});msg(r.ok?'Senha de "'+name+'" alterada!':(r.data.error||'Erro'),r.ok);}
async function delAdmin(id,name){if(!confirm('Remover o admin "'+name+'"?'))return;var r=await api('/admin/users/'+id,{method:'DELETE'});if(r.ok){msg('Admin removido.',true);loadAdmins();}else msg(r.data.error||'Erro',false);}
async function loadClientes(){var r=await api('/admin/customers');var tb=document.querySelector('#t-c tbody');tb.innerHTML='';if(!(r.data||[]).length){var tr=document.createElement('tr');var td=cell('Nenhum cliente cadastrado ainda.');td.colSpan=6;td.className='muted';tr.appendChild(td);tb.appendChild(tr);return;}(r.data||[]).forEach(function(u){var tr=document.createElement('tr');tr.appendChild(cell(u.id));tr.appendChild(cell(u.email));tr.appendChild(cell(u.name||'—'));var v=document.createElement('td');var sp=document.createElement('span');sp.className='badge'+(u.email_verified?' ok':'');sp.textContent=u.email_verified?'sim':'não';v.appendChild(sp);tr.appendChild(v);tr.appendChild(cell(fmtDate(u.createdAt)));var act=document.createElement('td');act.style.textAlign='right';act.appendChild(mini('Remover',true,function(){delCliente(u.id);}));tr.appendChild(act);tb.appendChild(tr);});}
async function delCliente(id){if(!confirm('Remover este cliente?'))return;var r=await api('/admin/customers/'+id,{method:'DELETE'});if(r.ok){msg('Cliente removido.',true);loadClientes();}else msg(r.data.error||'Erro',false);}
init();
</script>
</body></html>`;
