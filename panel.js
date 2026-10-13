(function(){
function mount(DATA){
if(!document.getElementById('td-css')){const st=document.createElement('style');st.id='td-css';st.textContent="#td{font-size:14px;padding:.25rem 0 .5rem}#td button{font-family:inherit}#td .seg{display:inline-flex;gap:2px;padding:3px;background:var(--surface-1);border-radius:10px;flex-wrap:wrap}#td .tab{padding:5px 14px;border-radius:8px;border:.5px solid transparent;background:transparent;color:var(--text-secondary);cursor:pointer;font-size:13px}#td .tab:hover{color:var(--text-primary)}#td .tab.on{background:var(--surface-2);color:var(--text-primary);border-color:var(--border);font-weight:500}#td .ib{background:transparent;border:none;color:var(--text-muted);cursor:pointer;padding:4px;font-size:16px;line-height:1;border-radius:6px}#td .ib:hover{color:var(--text-primary);background:var(--surface-1)}#td .stat{border-radius:var(--radius);padding:10px 14px}#td .stat p{margin:0}#td button.stat{border:1.5px solid transparent;text-align:left;cursor:pointer;width:100%;height:auto;font:inherit;transition:opacity .15s,filter .15s,box-shadow .15s}#td button.stat:hover{filter:brightness(.97)}#td .stats.filtering button.stat:not(.on){filter:grayscale(1);opacity:.45}#td .stats.filtering button.stat:not(.on):hover{opacity:.75}#td button.stat.on{border-color:currentColor;box-shadow:0 0 0 3px var(--surface-2),0 0 0 5px currentColor}#td .fbar{display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 12px;border-radius:var(--radius);font-size:13px;font-weight:500;border-left:4px solid currentColor}#td .sec{border:.5px solid var(--border);border-radius:12px;margin-bottom:14px;background:var(--surface-2);overflow:hidden}#td .row{display:flex;align-items:flex-start;gap:10px;padding:10px 14px 10px 11px;border-top:.5px solid var(--border);border-left:3px solid transparent;border-radius:0}#td .row:hover{filter:brightness(.98)}#td .sub .row{padding-left:41px}#td .pill{display:inline-flex;align-items:center;gap:4px;font-size:11px;padding:2px 9px;border-radius:999px;white-space:nowrap;font-weight:500}#td .meta{font-size:12px;color:var(--text-muted);display:inline-flex;align-items:center;gap:4px;white-space:nowrap}#td .ck{background:transparent;border:none;cursor:pointer;padding:0;font-size:20px;line-height:1;color:var(--text-muted)}#td .ck:hover{color:var(--text-success)}#td .av{width:20px;height:20px;border-radius:50%;background:var(--bg-accent);color:var(--text-accent);font-size:10px;font-weight:500;display:inline-flex;align-items:center;justify-content:center}#td .ed{padding:12px 14px 14px 44px;background:var(--surface-1);display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}#td .ed label{font-size:12px;color:var(--text-secondary);display:flex;flex-direction:column;gap:4px}#td .ed input,#td .ed select,#td .ed textarea{width:100%;box-sizing:border-box;font-size:13px}#td .add{width:100%;box-sizing:border-box;border:none;border-top:.5px solid var(--border);background:transparent;font-size:13px;padding:10px 14px 10px 44px;height:auto;border-radius:0}#td .add:focus{background:var(--surface-1);outline:none;box-shadow:none}#td .done{text-decoration:line-through;color:var(--text-muted)}#td .dot{width:14px;height:14px;border-radius:50%;border:none;cursor:pointer;padding:0;flex-shrink:0}#td button.spill{height:auto;cursor:pointer;font-family:inherit;line-height:1.5;border:.5px solid transparent}#td button.spill:hover{filter:brightness(.94)}#td .sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}";document.head.appendChild(st)}
let data=DATA;
const STATUS=["Not Started","In Progress","Stuck","Done"],PRI=["Low","Medium","High","Critical"];
const SC={"Not Started":["--surface-1","--text-secondary","ti-circle-dashed"],"In Progress":["--bg-accent","--text-accent","ti-progress"],"Stuck":["--bg-danger","--text-danger","ti-alert-triangle"],"Done":["--bg-success","--text-success","ti-check"]};
const PCOL={"Critical":"#E24B4A","High":"#EF9F27","Medium":"#378ADD","Low":"#B4B2A9"};
const SECCOL=["#7F77DD","#1D9E75","#D85A30","#D4537E","#378ADD","#BA7517","#639922"];
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};
const ui={board:data.boards[0]&&data.boards[0].id,open:new Set(),col:new Set(),edit:null,confirm:null,showDone:true,dirty:false,sent:false,focus:null,filter:null};
const root=document.getElementById('td');
const uid=p=>p+Math.random().toString(36).slice(2,10);
const now=()=>new Date().toISOString();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const dayDiff=s=>Math.round((new Date(s+'T00:00:00')-today())/864e5);
const short=s=>new Date(s+'T00:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'});
const fmt=iso=>{if(!iso)return'';const d=new Date(iso);return d.toLocaleDateString(undefined,{month:'short',day:'numeric'})+', '+d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})};
const initials=n=>n.split(/[\s.]+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const board=()=>data.boards.find(b=>b.id===ui.board);
const secColor=(s,i)=>s.color||SECCOL[i%SECCOL.length];
function touch(){ui.dirty=true;ui.sent=false;data.updated_at=now()}
function findItem(id){for(const b of data.boards)for(const s of b.sections)for(const t of s.tasks){if(t.id===id)return{item:t,list:s.tasks};const st=(t.subtasks||[]).find(x=>x.id===id);if(st)return{item:st,list:t.subtasks}}return{}}
function findSec(id){for(const b of data.boards){const s=b.sections.find(x=>x.id===id);if(s)return{s,b}}return{}}
function statusPill(s,id){const c=SC[s]||SC["Not Started"];const nx=STATUS[(STATUS.indexOf(s)+1)%STATUS.length];return `<button class="pill spill" data-act="cycle" data-id="${id}" title="Click to change to ${nx}" aria-label="Status: ${esc(s)}. Click to change to ${nx}" style="background:var(${c[0]});color:var(${c[1]});${s==="Not Started"?'border:.5px solid var(--border-strong)':''}"><i class="ti ${c[2]}" aria-hidden="true"></i>${esc(s)}</button>`}
function priPill(p){if(!p)return'';return `<span class="pill" style="background:${rgba(PCOL[p],.16)};color:var(--text-primary)"><i class="ti ti-flag" aria-hidden="true" style="color:${PCOL[p]}"></i>${esc(p)}</span>`}
function duePill(t){if(!t.due_date)return'';const n=dayDiff(t.due_date),d=t.status==="Done";let txt=short(t.due_date),col='--text-muted',bg='';
  if(!d){if(n<0){txt='Overdue · '+txt;col='--text-danger';bg='--bg-danger'}else if(n===0){txt='Due today';col='--text-warning';bg='--bg-warning'}else if(n===1){txt='Tomorrow';col='--text-warning';bg='--bg-warning'}else if(n<=7){txt='In '+n+' days';col='--text-accent';bg='--bg-accent'}}
  return bg?`<span class="pill" style="background:var(${bg});color:var(${col})"><i class="ti ti-calendar" aria-hidden="true"></i>${esc(txt)}</span>`:`<span class="meta"><i class="ti ti-calendar" aria-hidden="true"></i>${esc(txt)}</span>`}
function nameOrInput(kind,id,name,style){if(ui.edit&&ui.edit.id===id)return `<input data-rename="${kind}" data-id="${id}" value="${esc(name)}" style="height:30px;font-size:14px;max-width:240px">`;return `<span style="${style||''}">${esc(name)}</span>`}
function delBtn(key,act,id,label){return ui.confirm===key?`<button data-act="${act}" data-id="${id}" style="font-size:12px;height:26px;padding:0 10px;color:var(--text-danger);border-color:var(--border-danger)">Delete ${label}</button>`:`<button class="ib" data-act="ask" data-key="${key}" aria-label="Delete ${label}"><i class="ti ti-trash" aria-hidden="true"></i></button>`}
function itemRow(t,isSub){
  const d=t.status==="Done",open=ui.open.has(t.id),subs=(t.subtasks||[]),sd=subs.filter(x=>x.status==="Done").length;
  const over=!d&&t.due_date&&dayDiff(t.due_date)<0;
  const stripe=d?'transparent':(t.priority?PCOL[t.priority]:'transparent');
  const bg=over?rgba('#E24B4A',.06):t.status==="Stuck"?rgba('#E24B4A',.04):'transparent';
  const metas=[duePill(t),t.assignee?`<span class="meta"><span class="av">${esc(initials(t.assignee))}</span>${esc(t.assignee)}</span>`:'',!isSub&&subs.length?`<span class="meta"><i class="ti ti-subtask" aria-hidden="true"></i>${sd}/${subs.length}</span>`:'',t.notes?`<span class="meta"><i class="ti ti-notes" aria-hidden="true"></i>Notes</span>`:''].filter(Boolean).join('');
  let h=`<div class="row" style="border-left-color:${stripe};background:${bg}"><button class="ck" data-act="done" data-id="${t.id}" aria-label="${d?'Mark not done':'Mark done'}" style="${d?'color:var(--text-success)':''}"><i class="ti ti-${d?'circle-check':'circle'}" aria-hidden="true"></i></button>
  <div data-act="open" data-id="${t.id}" style="flex:1;min-width:0;cursor:pointer"><div class="${d?'done':''}" style="line-height:1.4;${isSub?'font-size:13px':''}">${esc(t.title)}</div>${metas?`<div style="display:flex;flex-wrap:wrap;gap:8px 12px;margin-top:5px;align-items:center">${metas}</div>`:''}</div>
  <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">${d?'':priPill(t.priority)}${statusPill(t.status||"Not Started",t.id)}
  <button class="ib" data-act="open" data-id="${t.id}" aria-label="Details"><i class="ti ti-chevron-${open?'up':'down'}" aria-hidden="true"></i></button></div></div>`;
  if(open){h+=`<div class="ed">
  <label style="grid-column:1/-1">Title<input data-f="title" data-id="${t.id}" value="${esc(t.title)}"></label>
  <label>Status<select data-f="status" data-id="${t.id}">${STATUS.map(s=>`<option ${s===(t.status||"Not Started")?'selected':''}>${s}</option>`).join('')}</select></label>
  <label>Priority<select data-f="priority" data-id="${t.id}"><option value="">None</option>${PRI.map(p=>`<option ${p===t.priority?'selected':''}>${p}</option>`).join('')}</select></label>
  <label>Due date<input type="date" data-f="due_date" data-id="${t.id}" value="${esc(t.due_date||'')}"></label>
  <label>Assignee<input data-f="assignee" data-id="${t.id}" value="${esc(t.assignee||'')}" placeholder="Name"></label>
  <label style="grid-column:1/-1">Notes<textarea data-f="notes" data-id="${t.id}" rows="3" placeholder="Context, links, next steps">${esc(t.notes||'')}</textarea></label>
  <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:center"><span class="meta"><i class="ti ti-clock" aria-hidden="true"></i>Last updated ${esc(fmt(t.updated_at))}</span>${delBtn('t'+t.id,'tdel',t.id,isSub?'subtask':'task')}</div></div>`}
  if(!isSub&&(open||subs.length)){h+=`<div class="sub">${subs.filter(x=>ui.showDone||x.status!=="Done").map(x=>itemRow(x,true)).join('')}${open?`<input class="add" data-add="sub" data-id="${t.id}" placeholder="+ Add a subtask" style="padding-left:74px">`:''}</div>`}
  return h}
const FLABEL={open:'open',week:'due-this-week',overdue:'overdue',done:'done'};
const FSTY={open:['--bg-accent','--text-accent'],week:['--bg-warning','--text-warning'],overdue:['--bg-danger','--text-danger'],done:['--bg-success','--text-success']};
const FCOUNT=b=>b.sections.reduce((n,s)=>n+s.tasks.filter(matchF).length,0);
function matchF(t){if(!ui.filter)return true;const d=t.status==="Done";const n=t.due_date?dayDiff(t.due_date):null;
  if(ui.filter==='open')return !d;if(ui.filter==='done')return d;if(d||n===null)return false;
  if(ui.filter==='overdue')return n<0;if(ui.filter==='week')return n>=0&&n<=7;return true}
function visible(t){return ui.filter?matchF(t):(ui.showDone||t.status!=="Done")}
function stats(b){let o=0,w=0,od=0,dn=0;for(const s of b.sections)for(const t of s.tasks){if(t.status==="Done"){dn++;continue}o++;if(t.due_date){const n=dayDiff(t.due_date);if(n<0)od++;else if(n<=7)w++}}
  const card=(k,l,v,ic,bg,c)=>`<button class="stat ${ui.filter===k?'on':''}" data-act="filter" data-key="${k}" aria-pressed="${ui.filter===k}" title="${ui.filter===k?'Clear filter':'Show only '+FLABEL[k]+' tasks'}" style="background:var(${bg});color:var(${c})"><p style="font-size:12px;color:var(${c});display:flex;align-items:center;gap:5px"><i class="ti ${ic}" aria-hidden="true"></i>${l}${ui.filter===k?'<i class="ti ti-filter" aria-hidden="true" style="margin-left:auto"></i>':''}</p><p style="font-size:22px;font-weight:500;color:var(${c})">${v}</p></button>`;
  return `<div class="stats ${ui.filter?'filtering':''}" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin:14px 0 10px">${card('open','Open',o,'ti-list-check','--bg-accent','--text-accent')}${card('week','Due this week',w,'ti-calendar-event','--bg-warning','--text-warning')}${card('overdue','Overdue',od,'ti-alarm','--bg-danger','--text-danger')}${card('done','Done',dn,'ti-circle-check','--bg-success','--text-success')}</div>
  ${ui.filter?`<div class="fbar" style="background:var(${FSTY[ui.filter][0]});color:var(${FSTY[ui.filter][1]})"><i class="ti ti-filter" aria-hidden="true"></i>Filtered: showing ${esc(FLABEL[ui.filter])} tasks only (${FCOUNT(b)} of ${b.sections.reduce((n,s)=>n+s.tasks.length,0)})<span style="flex:1"></span><button data-act="filter" data-key="${ui.filter}" style="font-size:12px;height:26px;padding:0 10px;color:inherit;border-color:currentColor"><i class="ti ti-x" aria-hidden="true"></i> Clear filter</button></div>`:''}
  <div class="meta" style="margin-bottom:16px;gap:12px;flex-wrap:wrap">Priority stripe:${PRI.slice().reverse().map(p=>`<span><span class="sw" style="background:${PCOL[p]}"></span>${p}</span>`).join('')}</div>`}
function doneCount(b){let n=0;for(const s of b.sections)for(const t of s.tasks){if(t.status==="Done"){n++;continue}n+=(t.subtasks||[]).filter(x=>x.status==="Done").length}return n}
function clearBtn(b){const n=doneCount(b);if(!n)return'';return ui.confirm==='clr'+b.id?`<button data-act="clrdone" style="font-size:13px;height:30px;margin-right:6px;color:var(--text-danger);border-color:var(--border-danger)"><i class="ti ti-trash" aria-hidden="true"></i> Delete ${n} completed</button>`:`<button data-act="ask" data-key="clr${b.id}" style="font-size:13px;height:30px;margin-right:6px"><i class="ti ti-trash" aria-hidden="true"></i> Clear completed</button>`}
function render(){
  const b=board();
  const sync=ui.sent?['--text-accent','ti-loader-2','Sent for commit']:ui.dirty?['--text-warning','ti-point-filled','Unsaved changes']:['--text-success','ti-cloud-check','Synced with GitHub'];
  let h=`<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><div class="seg">${data.boards.map(x=>x.id===ui.board&&ui.edit&&ui.edit.id===x.id?nameOrInput('board',x.id,x.name):`<button class="tab ${x.id===ui.board?'on':''}" data-act="board" data-id="${x.id}">${esc(x.name)}</button>`).join('')}<button class="tab" data-act="badd" aria-label="Add board"><i class="ti ti-plus" aria-hidden="true"></i></button></div>
  <span style="flex:1"></span>
  <span class="meta" style="color:var(${sync[0]})"><i class="ti ${sync[1]}" aria-hidden="true"></i>${sync[2]}</span>
  <button data-act="save" style="font-size:13px;background:var(--fill-accent,var(--text-accent));color:var(--on-accent,#fff);border:none;padding:0 14px;height:32px;border-radius:8px"><i class="ti ti-brand-github" aria-hidden="true"></i> Save to GitHub ↗</button></div>`;
  if(!b){h+=`<div class="sec" style="padding:2rem;text-align:center;margin-top:14px"><p style="margin:0 0 4px;font-weight:500">Create your first board</p><p style="margin:0 0 12px;font-size:13px;color:var(--text-secondary)">Boards hold sections, and sections hold tasks.</p><button data-act="badd">Add board</button></div>`;root.innerHTML=h;return}
  h+=stats(b);
  h+=`<div style="display:flex;align-items:center;gap:4px;margin-bottom:10px">${ui.edit&&ui.edit.id===b.id?'':`<span style="font-size:18px;font-weight:500;margin-right:4px">${esc(b.name)}</span>`}
  <button class="ib" data-act="ren" data-id="${b.id}" aria-label="Rename board"><i class="ti ti-pencil" aria-hidden="true"></i></button>${delBtn('b'+b.id,'bdel',b.id,'board')}
  <span style="flex:1"></span>
  <label style="display:flex;gap:6px;align-items:center;font-size:13px;color:var(--text-secondary);margin-right:8px;cursor:pointer"><input type="checkbox" data-act="showdone" ${ui.showDone?'checked':''} style="margin:0">Show done</label>
  ${clearBtn(b)}<button data-act="sadd" style="font-size:13px;height:30px"><i class="ti ti-layout-rows" aria-hidden="true"></i> Add section</button></div>`;
  if(ui.filter&&!b.sections.some(s=>s.tasks.some(matchF)))h+=`<div class="sec" style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:13px">No ${esc(FLABEL[ui.filter])} tasks on this board.</div>`;
  if(!b.sections.length)h+=`<div class="sec" style="padding:1.5rem;text-align:center;color:var(--text-secondary);font-size:13px">Add a section to start organizing this board.</div>`;
  b.sections.forEach((s,i)=>{if(ui.filter&&!s.tasks.some(matchF))return;const c=ui.col.has(s.id),col=secColor(s,i),tot=s.tasks.length,dn=s.tasks.filter(t=>t.status==="Done").length,pct=tot?Math.round(dn/tot*100):0;
    h+=`<div class="sec" style="border-color:${rgba(col,.45)}"><div style="display:flex;align-items:center;gap:8px;padding:10px 12px 10px 10px;background:${rgba(col,.12)};border-left:4px solid ${col};border-radius:0">
    <button class="ib" data-act="col" data-id="${s.id}" aria-label="${c?'Expand':'Collapse'} section"><i class="ti ti-chevron-${c?'right':'down'}" aria-hidden="true"></i></button>
    ${nameOrInput('section',s.id,s.name,'font-weight:500;font-size:15px')}
    <span class="pill" style="background:${rgba(col,.22)};color:var(--text-primary)">${tot-dn} open${dn?` · ${dn} done`:''}</span>
    <span style="flex:1"></span>
    <button class="dot" data-act="color" data-id="${s.id}" data-i="${i}" aria-label="Change section color" title="Change color" style="background:${col}"></button>
    <button class="ib" data-act="ren" data-id="${s.id}" aria-label="Rename section"><i class="ti ti-pencil" aria-hidden="true"></i></button>${delBtn('s'+s.id,'sdel',s.id,'section')}</div>
    <div style="height:3px;background:${rgba(col,.15)}"><div style="height:3px;width:${pct}%;background:${col}"></div></div>`;
    if(!c){h+=s.tasks.filter(visible).map(t=>itemRow(t,false)).join('');h+=`<input class="add" data-add="task" data-id="${s.id}" placeholder="+ Add a task">`}
    h+=`</div>`});
  root.innerHTML=h;
  if(ui.edit){const el=root.querySelector('[data-rename]');if(el){el.focus();el.select()}}
  else if(ui.focus){const el=root.querySelector(`[data-add][data-id="${ui.focus}"]`);if(el)el.focus();ui.focus=null}
}
function commitRename(el){const n=el.value.trim(),id=el.dataset.id;if(n){if(el.dataset.rename==='board'){const b=data.boards.find(x=>x.id===id);if(b&&b.name!==n){b.name=n;touch()}}else{const {s}=findSec(id);if(s&&s.name!==n){s.name=n;touch()}}}ui.edit=null;render()}
root.addEventListener('click',e=>{const el=e.target.closest('[data-act]');if(!el){if(ui.confirm){ui.confirm=null;render()}return}
  const a=el.dataset.act,id=el.dataset.id;if(a!=='ask'&&!a.endsWith('del'))ui.confirm=null;
  if(a==='board'){ui.board=id;ui.edit=null}
  else if(a==='badd'){const b={id:uid('b_'),name:'New board',sections:[]};data.boards.push(b);ui.board=b.id;ui.edit={id:b.id};touch()}
  else if(a==='ren'){ui.edit={id}}
  else if(a==='ask'){ui.confirm=el.dataset.key}
  else if(a==='color'){const {s}=findSec(id);const cur=secColor(s,+el.dataset.i);s.color=SECCOL[(SECCOL.indexOf(cur)+1)%SECCOL.length];touch()}
  else if(a==='bdel'){data.boards=data.boards.filter(b=>b.id!==id);ui.board=data.boards[0]&&data.boards[0].id;ui.confirm=null;touch()}
  else if(a==='sadd'){const b=board();const used=b.sections.map((x,i)=>secColor(x,i));const s={id:uid('s_'),name:'New section',color:SECCOL.find(c=>!used.includes(c))||SECCOL[b.sections.length%SECCOL.length],tasks:[]};b.sections.push(s);ui.edit={id:s.id};touch()}
  else if(a==='sdel'){const b=board();b.sections=b.sections.filter(s=>s.id!==id);ui.confirm=null;touch()}
  else if(a==='col'){ui.col.has(id)?ui.col.delete(id):ui.col.add(id)}
  else if(a==='open'){ui.open.has(id)?ui.open.delete(id):ui.open.add(id)}
  else if(a==='done'){const {item}=findItem(id);item.status=item.status==="Done"?"Not Started":"Done";item.updated_at=now();touch()}
  else if(a==='tdel'){const {list}=findItem(id);const i=list.findIndex(x=>x.id===id);list.splice(i,1);ui.open.delete(id);ui.confirm=null;touch()}
  else if(a==='cycle'){const {item}=findItem(id);const s=item.status||"Not Started";item.status=STATUS[(STATUS.indexOf(s)+1)%STATUS.length];item.updated_at=now();touch()}
  else if(a==='clrdone'){const b=board();for(const s of b.sections){s.tasks=s.tasks.filter(t=>t.status!=="Done");for(const t of s.tasks)if(t.subtasks)t.subtasks=t.subtasks.filter(x=>x.status!=="Done")}ui.confirm=null;touch()}
  else if(a==='showdone'){ui.showDone=el.checked}
  else if(a==='filter'){const k=el.dataset.key;ui.filter=ui.filter===k?null:k}
  else if(a==='save'){ui.sent=true;ui.dirty=false;render();sendPrompt('Save my to-dos to GitHub:\n```json\n'+JSON.stringify(data)+'\n```');return}
  else return;
  render()});
root.addEventListener('change',e=>{const el=e.target;if(!el.dataset.f)return;const {item}=findItem(el.dataset.id);if(!item)return;const f=el.dataset.f,v=el.value.trim();
  if(f==='title'&&!v){el.value=item.title;return}
  if((item[f]||'')===v)return;if(v)item[f]=v;else delete item[f];item.updated_at=now();touch();render()});
root.addEventListener('keydown',e=>{const el=e.target;
  if(el.dataset.rename){if(e.key==='Enter')commitRename(el);else if(e.key==='Escape'){ui.edit=null;render()}return}
  if(el.dataset.add&&e.key==='Enter'){const v=el.value.trim();if(!v)return;const t={id:uid('t_'),title:v,status:"Not Started",updated_at:now()};
    if(el.dataset.add==='task'){t.subtasks=[];findSec(el.dataset.id).s.tasks.push(t)}else{const {item}=findItem(el.dataset.id);(item.subtasks=item.subtasks||[]).push(t)}
    ui.focus=el.dataset.id;touch();render()}});
root.addEventListener('focusout',e=>{const el=e.target;if(el.dataset&&el.dataset.rename&&ui.edit)commitRename(el)});
render();
}
window.TDPanel={mount:mount,version:1};
})();
