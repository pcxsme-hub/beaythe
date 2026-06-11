// Página de gestão de usuários (admins + clientes). Servida em /api/admin/ui pelo Worker.
// Usa o mesmo cookie de sessão do painel. JS sem backticks/template-interpolation de propósito.
export const ADMIN_UI_HTML = `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gestão de Usuários · Beauthé</title>
<style>
*{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
body{margin:0;background:#FCFAF8;color:#2C2826}
header{background:#2C2826;color:#fff;padding:16px 24px;display:flex;justify-content:space-between;align-items:center}
header h1{font-size:17px;margin:0;font-weight:600}
header .who{font-size:13px;opacity:.85}
.wrap{max-width:1000px;margin:22px auto;padding:0 16px}
.tabs{display:flex;gap:8px;margin-bottom:16px}
.tabs button{background:#fff;border:1px solid #F1EBE6;padding:8px 16px;border-radius:10px;cursor:pointer;font-size:14px}
.tabs button.active{background:#C4A49A;color:#fff;border-color:#C4A49A}
.card{background:#fff;border:1px solid #F1EBE6;border-radius:14px;padding:18px;margin-bottom:16px}
.card h2{font-size:15px;margin:0 0 12px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid #F1EBE6}
th{color:#8a807b;font-weight:500;font-size:11px;text-transform:uppercase}
input,select{padding:9px 11px;border:1px solid #F1EBE6;border-radius:9px;font-size:14px;width:100%}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:end}
.row>div{flex:1;min-width:130px}
label{display:block;font-size:12px;color:#8a807b;margin-bottom:4px}
button.btn{background:#C4A49A;color:#fff;border:none;padding:10px 18px;border-radius:9px;cursor:pointer;font-size:14px}
button.mini{font-size:12px;padding:5px 10px;border-radius:7px;border:1px solid #F1EBE6;background:#fff;cursor:pointer;margin-left:6px}
button.mini.danger{color:#c0392b;border-color:#eaccc8}
.badge{font-size:11px;padding:2px 9px;border-radius:20px;background:#F1EBE6}
.badge.ok{background:#d8efe0;color:#1d7a4d}
.msg{padding:10px 14px;border-radius:9px;margin-bottom:12px;font-size:13px;display:none}
.muted{color:#8a807b;font-size:12px}
#login{max-width:380px;margin:70px auto;text-align:center}
a{color:#a98a80}
</style></head>
<body>
<div id="app" style="display:none">
  <header><h1>Gestão de Usuários — Beauthé</h1><div class="who" id="who"></div></header>
  <div class="wrap">
    <div id="msg" class="msg"></div>
    <div class="tabs">
      <button id="tab-a" class="active" onclick="show('a')">Admins</button>
      <button id="tab-c" onclick="show('c')">Clientes</button>
    </div>
    <div id="view-a">
      <div class="card"><h2>Criar novo admin</h2>
        <div class="row">
          <div><label>Usuário</label><input id="nu" placeholder="ex: maria" autocomplete="off"></div>
          <div><label>Senha (mín. 8)</label><input id="np" type="password" placeholder="••••••••" autocomplete="new-password"></div>
          <div style="flex:0 0 130px"><label>Papel</label><select id="nr"><option value="admin">admin</option><option value="owner">owner</option><option value="editor">editor</option></select></div>
          <div style="flex:0 0 auto"><button class="btn" onclick="createAdmin()">Criar</button></div>
        </div>
        <p class="muted" style="margin:10px 0 0">Para recuperar a senha de um admin, use "Resetar senha" na lista abaixo (outro admin faz por você). Se ficar trancado fora do único admin, recrie em /admin-core-sys após remover pelo console do D1.</p>
      </div>
      <div class="card"><h2>Admins</h2><table id="t-a"><thead><tr><th>ID</th><th>Usuário</th><th>Papel</th><th>Último login</th><th></th></tr></thead><tbody></tbody></table></div>
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
function msg(t,ok){var m=document.getElementById('msg');m.textContent=t;m.style.display='block';m.style.background=ok?'#d8efe0':'#fdecea';m.style.color=ok?'#1d7a4d':'#c0392b';setTimeout(function(){m.style.display='none';},4000);}
function fmtDate(ms){if(!ms)return '—';var n=Number(ms);return isNaN(n)?'—':new Date(n).toLocaleString('pt-BR');}
function cell(t){var td=document.createElement('td');td.textContent=t;return td;}
function mini(label,danger,fn){var b=document.createElement('button');b.className='mini'+(danger?' danger':'');b.textContent=label;b.onclick=fn;return b;}
function show(v){document.getElementById('view-a').style.display=v==='a'?'':'none';document.getElementById('view-c').style.display=v==='c'?'':'none';document.getElementById('tab-a').className=v==='a'?'active':'';document.getElementById('tab-c').className=v==='c'?'active':'';if(v==='c')loadClientes();}
async function init(){var me=await api('/admin/me');if(!me.ok){document.getElementById('login').style.display='block';return;}document.getElementById('who').textContent=(me.data.username||'admin')+' · '+(me.data.role||'');document.getElementById('app').style.display='block';loadAdmins();}
async function loadAdmins(){var r=await api('/admin/users');var tb=document.querySelector('#t-a tbody');tb.innerHTML='';(r.data||[]).forEach(function(u){var tr=document.createElement('tr');tr.appendChild(cell(u.id));var nu=cell(u.username);nu.style.fontWeight='600';tr.appendChild(nu);var rl=document.createElement('td');var sp=document.createElement('span');sp.className='badge';sp.textContent=u.role;rl.appendChild(sp);tr.appendChild(rl);tr.appendChild(cell(fmtDate(u.last_login_at)));var act=document.createElement('td');act.style.textAlign='right';act.appendChild(mini('Resetar senha',false,function(){resetPw(u.id,u.username);}));act.appendChild(mini('Remover',true,function(){delAdmin(u.id,u.username);}));tr.appendChild(act);tb.appendChild(tr);});}
async function createAdmin(){var r=await api('/admin/users',{method:'POST',body:JSON.stringify({username:document.getElementById('nu').value.trim(),password:document.getElementById('np').value,role:document.getElementById('nr').value})});if(r.ok){msg('Admin criado!',true);document.getElementById('nu').value='';document.getElementById('np').value='';loadAdmins();}else msg(r.data.error||'Erro ao criar.',false);}
async function resetPw(id,name){var p=prompt('Nova senha para "'+name+'" (mín. 8 caracteres):');if(!p)return;var r=await api('/admin/users/'+id+'/reset-password',{method:'POST',body:JSON.stringify({password:p})});msg(r.ok?'Senha de "'+name+'" alterada!':(r.data.error||'Erro'),r.ok);}
async function delAdmin(id,name){if(!confirm('Remover o admin "'+name+'"?'))return;var r=await api('/admin/users/'+id,{method:'DELETE'});if(r.ok){msg('Admin removido.',true);loadAdmins();}else msg(r.data.error||'Erro',false);}
async function loadClientes(){var r=await api('/admin/customers');var tb=document.querySelector('#t-c tbody');tb.innerHTML='';if(!(r.data||[]).length){var tr=document.createElement('tr');var td=cell('Nenhum cliente cadastrado ainda.');td.colSpan=6;td.className='muted';tr.appendChild(td);tb.appendChild(tr);return;}(r.data||[]).forEach(function(u){var tr=document.createElement('tr');tr.appendChild(cell(u.id));tr.appendChild(cell(u.email));tr.appendChild(cell(u.name||'—'));var v=document.createElement('td');var sp=document.createElement('span');sp.className='badge'+(u.email_verified?' ok':'');sp.textContent=u.email_verified?'sim':'não';v.appendChild(sp);tr.appendChild(v);tr.appendChild(cell(fmtDate(u.createdAt)));var act=document.createElement('td');act.style.textAlign='right';act.appendChild(mini('Remover',true,function(){delCliente(u.id);}));tr.appendChild(act);tb.appendChild(tr);});}
async function delCliente(id){if(!confirm('Remover este cliente?'))return;var r=await api('/admin/customers/'+id,{method:'DELETE'});if(r.ok){msg('Cliente removido.',true);loadClientes();}else msg(r.data.error||'Erro',false);}
init();
</script>
</body></html>`;
