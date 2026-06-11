// Script injetado no <head> do /admin-core-sys: adiciona "Usuários" no menu lateral
// e mostra a gestão (/api/admin/ui) INLINE na área de conteúdo (como as outras seções),
// não num overlay nem aba nova. Clicar em outra seção fecha. JS sem backticks/${}.
export const MENU_INJECT = `<script>(function(){
function sbRight(){try{var a=document.querySelector('a[href="/admin-core-sys"]')||document.querySelector('a[href^="/admin-core-sys"]');if(!a)return 240;var sb=a;while(sb.parentElement&&sb.parentElement.querySelectorAll('a[href^="/admin-core-sys"]').length>=3)sb=sb.parentElement;var r=Math.round(sb.getBoundingClientRect().right);return (r>80&&r<520)?r:240}catch(e){return 240}}
function showU(){var fr=document.getElementById('mi-embed');if(!fr){fr=document.createElement('iframe');fr.id='mi-embed';fr.title='Gestão de Usuários';fr.src='/api/admin/ui';document.documentElement.appendChild(fr)}var L=sbRight();fr.style.cssText='position:fixed;top:0;left:'+L+'px;width:calc(100vw - '+L+'px);height:100vh;border:0;background:#FCFAF8;z-index:2147483600;display:block'}
function hideU(){var fr=document.getElementById('mi-embed');if(fr)fr.style.display='none'}
function inject(){try{if(document.getElementById('mi-usuarios'))return;var ref=document.querySelector('a[href="/admin-core-sys/marketing"]')||document.querySelector('a[href^="/admin-core-sys/"]:not([href="/admin-core-sys"])');if(!ref)return;var c=ref.cloneNode(true);c.id='mi-usuarios';c.setAttribute('href','#');c.style.cursor='pointer';var wk=document.createTreeWalker(c,NodeFilter.SHOW_TEXT);var t;while(t=wk.nextNode()){if(t.nodeValue&&t.nodeValue.trim()){t.nodeValue='Usuários';break}}ref.parentNode.insertBefore(c,ref.nextSibling)}catch(e){}}
document.addEventListener('click',function(e){if(!e.target||!e.target.closest)return;if(e.target.closest('#mi-usuarios')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showU();return}if(e.target.closest('a[href^="/admin-core-sys"]'))hideU()},true);
function boot(){inject();try{var mo=new MutationObserver(function(){if(!document.getElementById('mi-usuarios'))inject()});mo.observe(document.body,{childList:true,subtree:true})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();</script>`;
