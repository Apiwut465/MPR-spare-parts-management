/* ===== App Config (hard-coded) =====
 * ถ้าจะใช้โหมด Demo ให้เปลี่ยน CONFIG.MODE เป็น 'demo'
 */
const CONFIG = {
  MODE: 'api', // 'api' | 'demo'
  API_URL: '', // ไม่ใช้แล้ว (คงไว้เฉย ๆ)
  DRIVE_FOLDER_ID: '' // ไม่ใช้แล้ว (คงไว้เฉย ๆ)
};

/* ===== Helpers ===== */
const $  = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

/* ===== Local store ===== */
const store = {
  get k(){ return 'stockapp_v3'; },
  get(){ try{return JSON.parse(localStorage.getItem(this.k)||'{}')}catch{return {}} },
  set(v){ localStorage.setItem(this.k, JSON.stringify(v||{})); }
};

/* ===== App state ===== */
const state = {
  mode: CONFIG.MODE,
  apiUrl: CONFIG.API_URL,
  parts:[], txns:[],
  categories:[], machines:[], depts:[]
};

/* ===== Small utils ===== */
function statusOf(p){
  if(p.Qty==null || p.Min==null) return '';
  if(Number(p.Qty)===0) return 'หมด';
  if(Number(p.Qty) < Number(p.Min)) return 'ต่ำกว่า Min';
  if(Number(p.Qty) <= Number(p.Min)) return 'ใกล้หมด';
  return 'ปกติ';
}
const sumQty = ps => ps.reduce((s,p)=> s + Number(p.Qty||0), 0);

/* ===== Demo seed / Load / Save ===== */
function ensureDemo(){
  const s = store.get();
  if(!s.parts){
    s.parts = [
      {PartID:'P01', Name:'Vacuum (SMC) HG', Category:'Pneumatic', Brand:'SMC', Model:'HG',  Min:10, Qty:100, Location:'C1/1', ImageURL:'https://picsum.photos/seed/p01/600/400'},
      {PartID:'P02', Name:'V-Belt A42',      Category:'Belt',      Brand:'Mitsuboshi', Model:'A42', Min:4,  Qty:2,   Location:'B2/5', ImageURL:'https://picsum.photos/seed/p02/600/400'},
      {PartID:'P03', Name:'Prox Sensor M12', Category:'Sensor',    Brand:'Omron',      Model:'E2E', Min:5,  Qty:0,   Location:'A1/9', ImageURL:'https://picsum.photos/seed/p03/600/400'}
    ];
  }
  if(!s.txns) s.txns=[];
  if(!s.categories) s.categories=['Pneumatic','Belt','Sensor'];
  if(!s.machines) s.machines=['M-01','M-02','Press-3'];
  if(!s.depts) s.depts=['Maintenance','Production','QA'];
  store.set(s);
}

async function loadAll(){
  state.mode  = CONFIG.MODE;
  state.apiUrl= CONFIG.API_URL;

  const fallbackToDemo = (reasonMsg='')=>{
    ensureDemo();
    const s = store.get();
    state.parts = s.parts; state.txns = s.txns;
    state.categories = s.categories||[]; state.machines = s.machines||[]; state.depts = s.depts||[];
    renderDatalists(); renderDashboard();
    if(reasonMsg){
      notify({title:'สลับเป็นโหมดออฟไลน์', message: reasonMsg + ' • ใช้ข้อมูลบนเครื่องชั่วคราว', level:'warn'});
    }
  };

  if(state.mode === 'api'){
    try{
      await refreshAllFromApi(); // มาจาก Supabase Adapter ด้านล่าง
      renderDatalists(); renderDashboard();
    }catch(err){
      fallbackToDemo(err?.message || 'เชื่อมต่อ API ไม่สำเร็จ');
    }
  }else{
    fallbackToDemo();
  }
}

function saveDemo(){
  if(state.mode!=='demo') return;
  const s = store.get();
  s.parts=state.parts; s.txns=state.txns;
  s.categories=state.categories; s.machines=state.machines; s.depts=state.depts;
  store.set(s);
}

/* ===== Renderers ===== */
function renderDatalists(){
  const dl = $('#dlParts'); if(dl){ dl.innerHTML=''; state.parts.forEach(p=>{ const o=document.createElement('option'); o.value=p.PartID; o.label=p.Name; dl.appendChild(o); });}
  const dc = $('#dlCats'); if(dc){ dc.innerHTML=''; state.categories.forEach(c=>{ const o=document.createElement('option'); o.value=c; dc.appendChild(o); });}
  const dm = $('#dlMachines'); if(dm){ dm.innerHTML=''; state.machines.forEach(m=>{ const o=document.createElement('option'); o.value=m; dm.appendChild(o); });}
  const dd = $('#dlDepts'); ifdd:{ const dd2 = $('#dlDepts'); if(dd2){ dd2.innerHTML=''; state.depts.forEach(d=>{ const o=document.createElement('option'); o.value=d; dd2.appendChild(o); }); } }
}

/* === ใส่คอนโทรลตัวกรองในแดชบอร์ด (สถานะ/หมวด/จำนวนที่แสดง) === */
function ensureDashControls(){
  const card = document.querySelector('#page-dashboard .card.soft');
  if(!card) return;
  let legend = card.querySelector('.legend');
  if(!legend){ legend = document.createElement('div'); legend.className = 'legend'; card.prepend(legend); }

  // สถานะ
  if(!document.getElementById('dashSt')){
    const st = document.createElement('select');
    st.id = 'dashSt';
    st.title = 'สถานะ';
    st.innerHTML = `
      <option value="">สถานะ: ทั้งหมด</option>
      <option value="หมด">หมด</option>
      <option value="ใกล้หมด">ใกล้หมด</option>
      <option value="ต่ำกว่า Min">ต่ำกว่า Min</option>
    `;
    st.addEventListener('change', renderDashboard);
    legend.appendChild(st);
  }

  // หมวดหมู่ (อัปเดตรายการทุกครั้ง)
  let cat = document.getElementById('dashCat');
  if(!cat){
    cat = document.createElement('select');
    cat.id = 'dashCat';
    cat.title = 'หมวดหมู่';
    cat.addEventListener('change', renderDashboard);
    legend.appendChild(cat);
  }
  cat.innerHTML = `<option value="">หมวดหมู่: ทั้งหมด</option>` +
                  (state.categories||[]).map(c=>`<option value="${c}">${c}</option>`).join('');

  // จำนวนที่แสดง
  if(!document.getElementById('dashLimit')){
    const lim = document.createElement('select');
    lim.id = 'dashLimit';
    lim.title = 'จำนวนรายการ';
    lim.innerHTML = `
      <option value="10">แสดง 10 รายการ</option>
      <option value="20">แสดง 20 รายการ</option>
      <option value="all">แสดงทั้งหมด</option>
    `;
    lim.addEventListener('change', renderDashboard);
    legend.appendChild(lim);
  }
}

/* --- Dashboard --- */
function renderDashboard(){
  $('#k_sumQty').textContent = sumQty(state.parts).toLocaleString();
  $('#k_near').textContent   = state.parts.filter(p=>['ใกล้หมด','ต่ำกว่า Min'].includes(statusOf(p))).length.toLocaleString();
  $('#k_out').textContent    = state.parts.filter(p=>statusOf(p)==='หมด').length.toLocaleString();

  // สร้าง/อัปเดตตัวกรอง
  ensureDashControls();

  const wrap = $('#dashAlerts'); wrap.innerHTML='';
  const stF  = $('#dashSt')?.value || '';
  const catF = $('#dashCat')?.value || '';
  const limV = $('#dashLimit')?.value || '10';
  const limit = (limV === 'all') ? Infinity : Number(limV) || 10;

  let alerts = state.parts
    .map(p=>({p,st:statusOf(p)}))
    .filter(x=> x.st==='หมด' || x.st==='ใกล้หมด' || x.st==='ต่ำกว่า Min');

  if(stF)  alerts = alerts.filter(x=> x.st === stF);
  if(catF) alerts = alerts.filter(x=> (x.p.Category||'').toLowerCase().includes(catF.toLowerCase()));

  alerts.sort((a,b)=> Number(a.p.Qty||0) - Number(b.p.Qty||0));

  if(alerts.length===0){
    wrap.innerHTML='<div class="meta">ยังไม่มีรายการที่ต้องรีสต็อก</div>';
  }else{
    alerts.slice(0, limit).forEach(({p,st})=>{
      const it = document.createElement('div'); 
      it.className='alert-item';
      if(st==='หมด') it.classList.add('bar-red');
      else it.classList.add('bar-orange');

      const body = document.createElement('div'); body.style.flex='1';
      const title = document.createElement('div'); 
      title.className='alert-title '+(st==='หมด'?'t-red':'t-orange'); 
      // ✅ ไทยล้วน
      title.textContent = `${p.Name || p.PartID || ''} • รุ่น ${p.Model||''}`;

      const meta  = document.createElement('div'); 
      meta.className='alert-meta'; 
      // ✅ "ขั้นต่ำ" แทน Min
      meta.textContent = `คงเหลือ ${p.Qty??0} • ขั้นต่ำ ${p.Min??0} • ${p.Brand||'-'} • ${p.Location||'-'} • ${p.PartID||'-'}`;

      body.appendChild(title); 
      body.appendChild(meta); 
      it.appendChild(body); 
      wrap.appendChild(it);
    });

    if (alerts.length > limit && isFinite(limit)){
      const more = document.createElement('div');
      more.className='meta';
      more.style.padding='6px 2px';
      more.textContent = `มีทั้งหมด ${alerts.length.toLocaleString()} รายการ — ปรับ "จำนวนที่แสดง" เป็น "แสดงทั้งหมด" เพื่อดูทั้งหมด`;
      wrap.appendChild(more);
    }
  }

  const days = Number(document.getElementById('topDays')?.value || 30);
  renderTopIssued(days);
}

// === Top 5 อะไหล่ที่เบิกบ่อย (days=30/90/180) ===
async function renderTopIssued(days = 30){
  const wrap = document.getElementById('dashTop5');
  if(!wrap) return;

  wrap.innerHTML = '<div class="meta">กำลังโหลดสถิติ...</div>';

  const now = new Date();
  const start = new Date(now.getTime() - days*24*60*60*1000);

  let txns = [];
  try{
    if(state.mode === 'api' && window.apiGet){
      // ดึงหลายเดือนให้ครอบคลุมช่วง
      const months = [];
      const cur = new Date(start.getFullYear(), start.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);
      while(cur <= end){
        months.push({ m: cur.getMonth()+1, y: cur.getFullYear() });
        cur.setMonth(cur.getMonth()+1);
      }
      const batches = await Promise.all(
        months.map(({m,y}) => window.apiGet('txns', { month:String(m), year:String(y) }).catch(()=>[]))
      );
      txns = batches.flat();
    }else{
      txns = state.txns || [];
    }
  }catch(_){
    txns = state.txns || [];
  }

  const filtered = txns.filter(t => t.Type === 'เบิก' && new Date(t.Date) >= start);

  const qtyById = new Map();
  filtered.forEach(t=>{
    const id = t.PartID || '';
    const q  = Number(t.Qty || 0);
    if(!id || !q) return;
    qtyById.set(id, (qtyById.get(id)||0) + q);
  });

  if(qtyById.size === 0){
    wrap.innerHTML = '<div class="meta">ยังไม่มีการเบิกในช่วงเวลานี้</div>';
    return;
  }

  const partById = new Map(state.parts.map(p=>[p.PartID, p]));
  const arr = Array.from(qtyById.entries())
    .map(([id,total])=>({
      id,
      total,
      name: partById.get(id)?.Name  || id,
      brand:partById.get(id)?.Brand || '',
      model:partById.get(id)?.Model || ''
    }))
    .sort((a,b)=> b.total - a.total)
    .slice(0,5);

  const max = arr[0].total || 1;

  wrap.innerHTML = '';
  arr.forEach((x,i)=>{
    const it = document.createElement('div');
    it.className = 'top5-item';
    it.innerHTML = `
      <div class="top5-rank">${i+1}</div>
      <div>
        <div class="top5-name">${x.id} — ${x.name}</div>
        <div class="top5-meta">${x.brand||'-'} ${x.model||''}</div>
      </div>
      <div class="top5-qty">${x.total.toLocaleString()} ชิ้น</div>
      <div class="top5-bar"><div class="top5-fill" style="width:${Math.round((x.total/max)*100)}%"></div></div>
    `;
    wrap.appendChild(it);
  });
}

/* --- Search / Issue --- */
function renderGallery(){
  const wrap = $('#galleryWrap'); if(!wrap) return;
  const q = ($('#q')?.value||'').trim().toLowerCase();
  const stF = $('#fltStatus')?.value || '';
  const catF = ($('#fltCat')?.value||'').trim().toLowerCase();

  const items = state.parts.filter(p=>{
    const text = `${p.PartID||''} ${p.Name||''} ${p.Category||''} ${p.Brand||''} ${p.Model||''}`.toLowerCase();
    const stNow = statusOf(p);
    const okQ = q ? text.includes(q) : true;
    const okSt = stF ? stNow===stF : true;
    const okCat = catF ? (p.Category||'').toLowerCase().includes(catF) : true;
    return okQ && okSt && okCat;
  });

  wrap.innerHTML = '';
  if(items.length===0){ wrap.innerHTML='<div class="meta" style="padding:8px 16px">ไม่พบรายการ</div>'; return; }

  items.forEach(p=>{
    const card = document.createElement('div'); card.className='gcard';

    const img = document.createElement('img');
    img.className='gimg'; img.src=p.ImageURL||''; img.alt=p.Name||p.PartID||'';
    card.appendChild(img);

    const box = document.createElement('div'); box.className='gbox';
    const title = document.createElement('div'); title.className='name'; title.textContent = `${p.PartID} — ${p.Name}`;
    const sub   = document.createElement('div'); sub.className='meta'; sub.textContent = `${p.Brand||'-'} ${p.Model||''}`;
    const meta  = document.createElement('div'); meta.className='gmeta';
    const st = statusOf(p);
    // ✅ เปลี่ยน Min -> ขั้นต่ำ
    meta.innerHTML = `<span>${p.Category||'-'}</span><span>คงเหลือ ${p.Qty??0}</span><span>ขั้นต่ำ ${p.Min??0}</span><span>${p.Location||'-'}</span><span class="badge ${st==='หมด'?'red':st==='ใกล้หมด'?'orange':'green'}">${st||'-'}</span>`;
    box.appendChild(title); box.appendChild(sub); box.appendChild(meta); card.appendChild(box);

    const act = document.createElement('div'); act.className='gactions';
    const qty = document.createElement('input');
    const remain = Number(p.Qty||0);
    const isOut = remain <= 0;

    qty.type='number';
    qty.placeholder = isOut ? 'หมดสต็อก' : 'จำนวน';
    qty.className='qty';
    qty.min='1';
    qty.max=String(Math.max(0, remain));
    qty.disabled = isOut;

    qty.addEventListener('input', ()=>{
      let v = Number(qty.value||0);
      if (!v || v < 1) { qty.value = isOut ? '' : '1'; return; }
      const max = Number(qty.max||0);
      if(max>0 && v>max) qty.value = String(max);
    });

    const btn = document.createElement('button'); 
    btn.textContent='เบิก';
    btn.disabled = isOut;
    btn.title = isOut ? 'สินค้าหมดสต็อก' : '';

    btn.addEventListener('click', ()=>{
      if (isOut) return;
      const preset = Number(qty.value||0);
      openIssueModal(p, preset);
    });

    act.appendChild(qty);
    act.appendChild(document.createElement('div')).className='grow';
    act.appendChild(btn);
    card.appendChild(act);

    wrap.appendChild(card);
  });
}

/* ===== Modal (Quick Issue) ===== */
let currentPart = null;
function openIssueModal(part, presetQty=0){
  const remain = Number(part.Qty || 0);
  if (remain <= 0) {
    notify({ title:'หมดสต็อก', message:`${part.PartID} — ${part.Name} หมด ไม่สามารถเบิกได้`, level:'danger' });
    return;
  }

  currentPart = part;
  $('#m_img').src = part.ImageURL || '';
  $('#m_title').textContent = `${part.PartID} — ${part.Name}`;
  // ✅ เปลี่ยน Min -> ขั้นต่ำ
  $('#m_meta').textContent  = `${part.Category||'-'} • คงเหลือ ${part.Qty??0} • ขั้นต่ำ ${part.Min??0} • ${part.Location||'-'}`;
  $('#m_qty').value = presetQty>0 ? presetQty : '';
  $('#m_qty').min = '1';
  $('#m_qty').max = String(remain);

  $('#m_by').value = ''; $('#m_machine').value = ''; $('#m_dept').value = ''; $('#m_note').value = '';

  document.body.classList.add('modal-open');
  $('#issueModal').classList.add('show');
  $('#issueModal').setAttribute('aria-hidden','false');
  setTimeout(()=> $('#m_qty').focus(), 0);
}
function closeModal(){
  $('#issueModal').classList.remove('show');
  $('#issueModal').setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
$$('[data-close]').forEach(el=> el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && $('#issueModal')?.classList.contains('show')) closeModal(); });

async function doQuickIssue(){
  if(!currentPart) return;
  const remainQty = Number(currentPart.Qty||0);
  const qty = Number($('#m_qty').value||0);
  const by  = $('#m_by').value.trim();
  const machine = $('#m_machine').value.trim();
  const dept    = $('#m_dept').value.trim();
  const note    = $('#m_note').value.trim();

  if(!qty || qty<=0) return notify({title:'กรอกจำนวน', message:'โปรดกรอกจำนวนที่เบิกให้ถูกต้อง', level:'warn'});
  if(remainQty <= 0)  return notify({title:'หมดสต็อก', message:'ไม่สามารถเบิกอะไหล่ที่หมดได้', level:'danger'});
  if(qty > remainQty) return notify({title:'คงเหลือไม่พอ', message:`คงเหลือในคลังมีเพียง ${remainQty} ชิ้น`, level:'danger'});
  if(!by) return notify({title:'ชื่อผู้เบิกว่าง', message:'กรอกชื่อผู้เบิกก่อนยืนยัน', level:'warn'});

  if(machine && !state.machines.includes(machine)) state.machines.push(machine);
  if(dept && !state.depts.includes(dept)) state.depts.push(dept);

  const txn = {TxnID:'T-'+Date.now(), Date:new Date().toISOString(), PartID:currentPart.PartID, Type:'เบิก', Qty:qty, By:by, Ref:`M:${machine||'-'} D:${dept||'-'} ${note?'- '+note:''}`};

  if(state.mode==='api'){
    notify({title:'โหมด API ยังไม่พร้อม', message:'โปรดลองใหม่', level:'danger'});
  }else{
    currentPart.Qty = Math.max(0, Number(currentPart.Qty||0) - qty);
    state.txns.push(txn);
    saveDemo();
    notify({title:'เบิกสำเร็จ', message:`${currentPart.PartID} จำนวน ${qty}`});
    renderGallery(); renderDashboard();
  }
  renderDatalists();
  closeModal();
}
$('#m_confirm')?.addEventListener('click', doQuickIssue);

/* ===== Stock list (Manage) ===== */
let _editingId = null;

function renderStock(){
  const tbody = $('#stockTbl tbody'); if(!tbody) return;
  const q = ($('#stockQ')?.value||'').trim().toLowerCase();

  const rows = state.parts
    .filter(p=>{
      if(!q) return true;
      const text = `${p.PartID||''} ${p.Name||''} ${p.Category||''} ${p.Brand||''} ${p.Model||''}`.toLowerCase();
      return text.includes(q);
    })
    .sort((a,b)=> (a.PartID||'').localeCompare(b.PartID||''));

  tbody.innerHTML = '';
  if(rows.length===0){
    tbody.innerHTML = `<tr><td colspan="8" class="meta" style="padding:16px">ไม่พบรายการ</td></tr>`;
    return;
  }

  rows.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.PartID||''}</strong></td>
      <td>${p.Name||''}</td>
      <td>${p.Category||''}</td>
      <td><small>${p.Brand||''}</small> / <small>${p.Model||''}</small></td>
      <td>${p.Qty??0}</td>
      <td>${p.Min??0}</td>
      <td>${p.Location||''}</td>
      <td>
        <div class="act">
          <button class="btn-xs" data-edit="${p.PartID}">แก้ไข</button>
          <button class="btn-xs btn-danger" data-del="${p.PartID}">ลบ</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  $$('[data-edit]').forEach(b=> b.addEventListener('click', ()=> openEditModal(b.dataset.edit)));
  $$('[data-del]').forEach(b=> b.addEventListener('click', ()=> deletePart(b.dataset.del)));
}

function openEditModal(partId){
  const p = state.parts.find(x=>x.PartID===partId); if(!p) return;
  _editingId = partId;
  $('#e_code').value  = p.PartID||'';
  $('#e_name').value  = p.Name||'';
  $('#e_cat').value   = p.Category||'';
  $('#e_brand').value = p.Brand||'';
  $('#e_model').value = p.Model||'';
  $('#e_qty').value   = Number(p.Qty||0);
  $('#e_min').value   = Number(p.Min||0);
  $('#e_loc').value   = p.Location||'';
  $('#e_img').value   = p.ImageURL||'';

  document.body.classList.add('modal-open');
  $('#editModal').classList.add('show');
  $('#editModal').setAttribute('aria-hidden','false');
  setTimeout(()=>$('#e_name').focus(),0);
}
function closeEdit(){ 
  $('#editModal').classList.remove('show'); 
  $('#editModal').setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
  _editingId = null;
}
$('#editModal [data-close]')?.addEventListener('click', closeEdit);
document.addEventListener('keydown', e=>{ if(e.key==='Escape' && $('#editModal')?.classList.contains('show')) closeEdit(); });

$('#e_save')?.addEventListener('click', ()=>{
  if(!_editingId) return closeEdit();
  const idx = state.parts.findIndex(x=>x.PartID===_editingId); if(idx<0) return closeEdit();

  const newCode = $('#e_code').value.trim();
  if(newCode!==_editingId && state.parts.some(x=>x.PartID===newCode)){
    return notify({title:'ซ้ำ!', message:'รหัสนี้มีอยู่แล้ว', level:'danger'});
  }

  state.parts[idx] = {
    ...state.parts[idx],
    PartID:newCode,
    Name:$('#e_name').value.trim(),
    Category:$('#e_cat').value.trim(),
    Brand:$('#e_brand').value.trim(),
    Model:$('#e_model').value.trim(),
    Qty:Number($('#e_qty').value||0),
    Min:Number($('#e_min').value||0),
    Location:$('#e_loc').value.trim(),
    ImageURL:$('#e_img').value.trim()
  };

  if(newCode!==_editingId){
    state.txns.forEach(t=>{ if(t.PartID===_editingId) t.PartID=newCode; });
  }

  saveDemo(); renderStock(); renderDashboard(); renderDatalists();
  notify({title:'บันทึกแล้ว', message:newCode});
  closeEdit();
});

function deletePart(partId){
  const p = state.parts.find(x=>x.PartID===partId); if(!p) return;
  if(!confirm(`ลบอะไหล่ ${p.PartID} — ${p.Name}?`)) return;
  state.parts = state.parts.filter(x=>x.PartID!==partId);
  saveDemo(); renderStock(); renderDashboard(); renderDatalists();
  notify({title:'ลบแล้ว', message:partId});
}

/* ===== Receive (เพิ่มของเข้าสต็อก) ===== */
function initReceivePage(){
  $('#rc_code').value = '';
  $('#rc_name').value = '';
  $('#rc_model').value = '';
  $('#rc_brand').value = '';
  $('#rc_qty').value = '1';
  $('#rc_min').value = '0';
  $('#rc_loc').value = '';
  $('#rc_cat').value = '';
  $('#rc_img').value = '';
  const pv = $('#rc_preview'); if(pv){ pv.src=''; pv.style.display=''; pv.removeAttribute('src'); }
}

function readFileAsDataURL(file){
  return new Promise((res,rej)=>{
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

async function handleReceiveSubmit(){
  const code  = $('#rc_code').value.trim();
  const name  = $('#rc_name').value.trim();
  const model = $('#rc_model').value.trim();
  const brand = $('#rc_brand').value.trim();
  const qty   = Number($('#rc_qty').value||0);
  const min   = Number($('#rc_min').value||0);
  const loc   = $('#rc_loc').value.trim();
  const cat   = $('#rc_cat').value.trim();
  const file  = $('#rc_img').files[0];

  if(!code || !qty || qty<=0) return notify({title:'ข้อมูลไม่ครบ', message:'กรอกรหัสและจำนวนให้ถูกต้อง', level:'warn'});

  let imageURL = '';
  if(file){ try{ imageURL = await readFileAsDataURL(file); }catch{ notify({title:'อ่านรูปไม่สำเร็จ', message:'โปรดลองใหม่', level:'warn'}); } }

  let p = state.parts.find(x=>x.PartID===code);
  if(!p){
    p = { PartID:code, Name:name, Model:model, Brand:brand, Min:min, Qty:0, Location:loc, Category:cat, ImageURL:imageURL };
    state.parts.push(p);
  }else{
    if(name)  p.Name = name;
    if(model) p.Model = model;
    if(brand) p.Brand = brand;
    if(loc)   p.Location = loc;
    if(cat)   p.Category = cat;
    if(!isNaN(min)) p.Min = min;
    if(imageURL) p.ImageURL = imageURL;
  }

  if(cat && !state.categories.includes(cat)) state.categories.push(cat);

  const txn = {TxnID:'T-'+Date.now(), Date:new Date().toISOString(), PartID:code, Type:'รับ', Qty:qty, By:'', Ref:''};

  p.Qty = Number(p.Qty||0) + qty;
  state.txns.push(txn);
  saveDemo();
  notify({title:'บันทึกสำเร็จ (Demo)', message:`รับเข้า ${code} จำนวน ${qty}`});

  renderDatalists();
  renderDashboard();
  renderGallery();
  initReceivePage();
}

/* Preview รูป */
$('#rc_img')?.addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  const pv = $('#rc_preview');
  if(file && pv){
    try{ pv.src = await readFileAsDataURL(file); }catch{ pv.removeAttribute('src'); }
  }else if(pv){ pv.removeAttribute('src'); }
});
$('#rc_clearImg')?.addEventListener('click', ()=>{
  $('#rc_img').value=''; const pv=$('#rc_preview'); if(pv){ pv.removeAttribute('src'); }
});

/* ===== History Page (demo) ===== */
function initHistoryPage(){
  const now = new Date();
  $('#hMonth').value = String(now.getMonth() + 1);

  const ySel = $('#hYear');
  if(ySel && !ySel.dataset.filled){
    const yNow = now.getFullYear();
    for(let y=yNow+1; y>=yNow-5; y--){
      const opt = document.createElement('option');
      opt.value = String(y); opt.textContent = String(y);
      ySel.appendChild(opt);
    }
    ySel.dataset.filled = '1';
  }
  ySel.value = String(now.getFullYear());
}

function renderHistory(){
  const tbody = $('#hTbl tbody'); if(!tbody) return;
  const m = Number($('#hMonth').value);
  const y = Number($('#hYear').value);
  const q = ($('#hQ')?.value||'').trim().toLowerCase();
  const activeChip = $('#hTypeSet .chip.is-active'); const typeF = activeChip ? activeChip.dataset.type : '';

  const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
  const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

  const rows = (state.txns||[])
    .filter(t=>{
      const d = new Date(t.Date);
      if((d.getMonth()+1)!==m || d.getFullYear()!==y) return false;
      if(typeF && t.Type!==typeF) return false;
      if(q){
        const text = `${t.TxnID||''} ${t.PartID||''} ${nameById.get(t.PartID)||''} ${t.By||''} ${t.Ref||''}`.toLowerCase();
        if(!text.includes(q)) return false;
      }
      return true;
    })
    .sort((a,b)=> new Date(a.Date) - new Date(b.Date));

  tbody.innerHTML = '';
  if(rows.length===0){
    tbody.innerHTML = `<tr><td colspan="7" class="meta" style="padding:16px">ไม่มีประวัติในช่วงที่เลือก</td></tr>`;
    return;
  }

  rows.forEach(t=>{
    const tr = document.createElement('tr');
    const thTime = new Date(t.Date).toLocaleString('th-TH', {hour12:false});
    const badge = t.Type==='รับ' ? `<span class="badge in">รับเข้า</span>` : `<span class="badge out">เบิกออก</span>`;
    const model = modelById.get(t.PartID) || '';
    tr.innerHTML = `
      <td>${thTime}</td>
      <td>${t.PartID||''}</td>
      <td>${nameById.get(t.PartID)||''}</td>
      <td>${badge}</td>
      <td>${model}</td>
      <td>${t.Qty??0}</td>
      <td>${t.By||''}</td>`;
    tbody.appendChild(tr);
  });
}

$('#hQ')?.addEventListener('input', renderHistory);
$('#hMonth')?.addEventListener('change', renderHistory);
$('#hYear')?.addEventListener('change', renderHistory);
$('#hTypeSet')?.addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip'); if(!btn) return;
  $$('#hTypeSet .chip').forEach(c=>c.classList.toggle('is-active', c===btn));
  renderHistory();
});

/* ===== Export CSV (demo) ===== */
function initExportPage(){
  const now = new Date();
  $('#exMonth').value = (now.getMonth() + 1);

  const ySel = $('#exYear');
  if(ySel && !ySel.dataset.filled){
    const yNow = now.getFullYear();
    for(let y=yNow+1; y>=yNow-5; y--){
      const opt = document.createElement('option');
      opt.value = String(y); opt.textContent = String(y);
      ySel.appendChild(opt);
    }
    ySel.dataset.filled = '1';
  }
  ySel.value = String(now.getFullYear());
}

function exportCsv(){
  const m = Number($('#exMonth').value);
  const y = Number($('#exYear').value);

  const rows = (state.txns||[])
    .filter(t=>{ const d=new Date(t.Date); return (d.getMonth()+1)===m && d.getFullYear()===y; })
    .sort((a,b)=> new Date(a.Date)-new Date(b.Date));

  const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
  const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

  const header = ['วันที่เวลา','รหัส','ชื่อ','ประเภท','โมเดล','จำนวน','ผู้ดำเนินการ'];

  const body = rows.map(r=>{
    const thTime = new Date(r.Date).toLocaleString('th-TH', {hour12:false});
    const rec = [
      thTime,
      r.PartID || '',
      nameById.get(r.PartID) || '',
      r.Type || '',
      modelById.get(r.PartID) || '',
      r.Qty ?? 0,
      r.By || ''
    ];
    return rec.map(s=>{
      s = String(s ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(',');
  });

  const csv = [header.join(','), ...body].join('\n');
  const blob = new Blob(["\uFEFF" + csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Stock_Txns_${y}-${String(m).padStart(2,'0')}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);

  notify({title:'ส่งออกแล้ว', message:`เดือน ${m}/${y} จำนวน ${rows.length} รายการ`});
}

$('#btnExportCsv')?.addEventListener('click', exportCsv);

/* ===== Tabs ===== */
function switchTab(tab){
  const adminOnly = ['stock','receive','history','export','settings'];
  if(userRole !== 'admin' && adminOnly.includes(tab)){
    tab = (tab==='stock' || tab==='receive') ? 'search' : 'dashboard';
  }

  $$('[data-page]').forEach(p=> p.hidden = (p.id !== `page-${tab}`));
  if(tab==='dashboard') renderDashboard();
  if(tab==='stock')     renderStock();
  if(tab==='receive')   initReceivePage();
  if(tab==='search')    renderGallery();
  if(tab==='history'){  initHistoryPage(); renderHistory(); }
  if(tab==='export')    initExportPage();
}

/* ===== Bottom nav: glass + indicator + ripple + auto-hide ===== */
let _nav=null, _navItems=[], _setActive=null;
function initBottomNav(){
  _nav = document.querySelector('.bottom-nav'); if(!_nav) return;
  _navItems = Array.from(_nav.querySelectorAll('.nav-btn'));

  function ripple(e, btn){
    const s = document.createElement('span');
    s.className = 'ripple';
    const r = btn.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - r.left;
    const y = (e.touches?.[0]?.clientY ?? e.clientY) - r.top;
    s.style.left = x+'px'; s.style.top = y+'px';
    btn.appendChild(s);
    setTimeout(()=> s.remove(), 620);
  }

  _setActive = (btn)=>{
    const visible = _navItems.filter(b => b.style.display !== 'none');
    visible.forEach(b=>b.classList.toggle('active', b===btn));
    const i = visible.indexOf(btn);
    _nav.style.setProperty('--i', i<0?0:i);
    btn.classList.remove('bouncing'); void btn.offsetWidth; btn.classList.add('bouncing');
    if(navigator.vibrate) navigator.vibrate(6);
    switchTab(btn.dataset.tab);
    try{ localStorage.setItem('stockapp_last_tab', btn.dataset.tab); }catch{}
  };

  _navItems.forEach(btn=>{
    btn.addEventListener('click', e=>{ ripple(e, btn); _setActive(btn); });
    btn.addEventListener('touchstart', e=> ripple(e, btn), {passive:true});
  });

  // auto hide on scroll
  let lastY = window.scrollY;
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    const down = y > lastY + 4;
    const up   = y < lastY - 4;
    if(down) _nav.classList.add('hide');
    else if(up) _nav.classList.remove('hide');
    lastY = y;
  }, {passive:true});

  applyRoleToNav();
}

function applyRoleToNav(){
  if(!_nav) return;
  const adminOnly = ['stock','receive','history','export','settings'];
  _nav.setAttribute('data-role', userRole || 'guest');

  _navItems.forEach(btn=>{
    const tab = btn.dataset.tab;
    const isAdminOnly = adminOnly.includes(tab);
    btn.style.display = (userRole==='admin' || !isAdminOnly) ? '' : 'none';
  });

  const visible = _navItems.filter(b => b.style.display !== 'none');
  _nav.style.setProperty('--count', visible.length);

  const last = localStorage.getItem('stockapp_last_tab') || 'dashboard';
  const target = visible.find(b=> b.dataset.tab===last) || visible[0];
  if(target) _setActive ? _setActive(target) : switchTab(target.dataset.tab);
}

/* ===== Toolbar & inputs ===== */
$('#btnSync')?.addEventListener('click', ()=>{ loadAll(); notify({title:'ซิงก์แล้ว', message:'รีเฟรชข้อมูลจากที่จัดเก็บ'}); });
$('#btnClear')?.addEventListener('click', ()=>{ $('#q').value=''; renderGallery(); });
$('#q')?.addEventListener('input', renderGallery);
$('#fltStatus')?.addEventListener('change', renderGallery);
$('#fltCat')?.addEventListener('input', renderGallery);
$('#stockQ')?.addEventListener('input', renderStock);
document.getElementById('topDays')?.addEventListener('change', (e)=>{
  const v = Number(e.target.value || 30);
  renderTopIssued(v);
});

// ===== Quick nav helper =====
function goDashboard(){
  const btn = document.querySelector('.bottom-nav .nav-btn[data-tab="dashboard"]');
  if (btn) {
    btn.click();
  } else {
    switchTab('dashboard');
    try{ localStorage.setItem('stockapp_last_tab','dashboard'); }catch{}
  }
}

/* ===== Login System ===== */
let userRole = localStorage.getItem('stockapp_last_role') || 'guest'; // 'guest' | 'admin'

function updateAuthUI(){
  const btnLoginOpen = $('#btnLoginOpen');
  const btnLogout = $('#btnLogout');
  if(btnLoginOpen) btnLoginOpen.style.display = (userRole === 'admin') ? 'none' : '';
  if(btnLogout)    btnLogout.style.display    = (userRole === 'admin') ? '' : 'none';
  applyRoleToNav();
}

function showLoginModal(){
  document.body.classList.add('modal-open');
  $('#loginModal')?.classList.add('show');
  $('#loginModal')?.setAttribute('aria-hidden','false');
}
function closeLoginModal(){
  $('#loginModal')?.classList.remove('show');
  $('#loginModal')?.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

$('#btnLoginOpen')?.addEventListener('click', showLoginModal);
$('#loginModal [data-close]')?.addEventListener('click', closeLoginModal);
$('#loginRole')?.addEventListener('change', e=>{
  $('#adminPassRow').style.display = e.target.value === 'admin' ? '' : 'none';
});

$('#btnLogin')?.addEventListener('click', ()=>{
  const role = $('#loginRole').value;
  const pass = $('#loginPassword').value;
  const savedPass = localStorage.getItem('stockapp_admin_pass') || '1234';

  if(role==='admin' && pass !== savedPass){
    notify({title:'รหัสผ่านไม่ถูกต้อง', message:'กรุณาลองใหม่', level:'danger'}); 
    return;
  }
  userRole = role;
  localStorage.setItem('stockapp_last_role', userRole);
  notify({title:'เข้าสู่ระบบแล้ว', message: role==='admin' ? 'โหมดผู้ดูแลระบบ' : 'โหมดพนักงาน'});
  closeLoginModal();
  updateAuthUI();
  switchTab('dashboard');
});

$('#btnLogout')?.addEventListener('click', ()=>{
  userRole = 'guest';
  localStorage.setItem('stockapp_last_role', userRole);
  notify({title:'ออกจากระบบแล้ว'});
  updateAuthUI();
  switchTab('dashboard');
});

/* ==========================================================
   🔌 Stock App — Supabase Adapter (แทน Apps Script)
   ต้องมี window.supa = supabase.createClient(...) จาก index.html
   ========================================================== */
(function(){
  const supa = window.supa;

  function startEndOfMonth(m, y){
    const start = new Date(y, m-1, 1, 0,0,0,0);
    const end   = new Date(y, m,   0, 23,59,59,999);
    return { start: start.toISOString(), end: end.toISOString() };
  }
  function dataUrlToBlob(dataUrl){
    const [meta, b64] = dataUrl.split(',');
    const mime = /data:(.*?);base64/.exec(meta)?.[1] || 'image/jpeg';
    const bin  = atob(b64); const len = bin.length;
    const buf  = new Uint8Array(len);
    for(let i=0;i<len;i++) buf[i] = bin.charCodeAt(i);
    return new Blob([buf], {type:mime});
  }
  async function uploadDataUrlToStorage(dataUrl, path){
    const blob = dataUrlToBlob(dataUrl);
    const { error:upErr } = await supa.storage.from('parts').upload(path, blob, {
      upsert:true, contentType: blob.type
    });
    if(upErr) throw upErr;
    const { data } = supa.storage.from('parts').getPublicUrl(path);
    return data.publicUrl;
  }

  // ---------- apiGet ----------
  window.apiGet = async (op, params={})=>{
    if(op === 'parts'){
      const { data, error } = await supa.from('parts').select('*').order('PartID', { ascending:true });
      if(error) throw error; return data || [];
    }
    if(op === 'lists'){
      const { data, error } = await supa.from('lists').select('categories,machines,depts').eq('id','default').maybeSingle();
      if(error) throw error; return data || { categories:[], machines:[], depts:[] };
    }
    if(op === 'txns'){
      const m = Number(params.month), y = Number(params.year);
      const { start, end } = startEndOfMonth(m, y);
      const { data, error } = await supa.from('txns').select('*').gte('Date', start).lte('Date', end).order('Date', { ascending:true });
      if(error) throw error; return data || [];
    }
    throw new Error('Unknown op: '+op);
  };

  // ---------- apiPost ----------
  window.apiPost = async (op, payload={})=>{
    if(op === 'issue'){
      const { partId, qty, by, machine, dept, note } = payload;
      const { data, error } = await supa.rpc('issue_part', {
        part_id: partId, qty, by_name: by||'', machine: machine||'', dept: dept||'', note: note||''
      });
      if(error) throw error;
      return { part: data };
    }
    if(op === 'receive'){
      const { partId, qty } = payload;
      const { data, error } = await supa.rpc('receive_part', { part_id: partId, qty });
      if(error) throw error;
      return { part: data };
    }
    if(op === 'receive_new'){
      const { part, qty, imageBase64 } = payload;
      const id = part.PartID;

      let imageURL = part.ImageURL || '';
      if(imageBase64){
        const path = `parts/${id}_${Date.now()}.jpg`;
        imageURL = await uploadDataUrlToStorage(imageBase64, path);
      }

      const { error: upErr } = await supa.from('parts').upsert({ ...part, ImageURL: imageURL }, { onConflict: 'PartID' });
      if(upErr) throw upErr;

      const { error: recErr } = await supa.rpc('receive_part', { part_id: id, qty });
      if(recErr) throw recErr;

      return { ok:true };
    }
    if(op === 'setpart'){
      const { part } = payload;
      const { error } = await supa.from('parts').upsert({ ...part, UpdatedAt: new Date().toISOString() }, { onConflict:'PartID' });
      if(error) throw error;
      return { ok:true };
    }
    if(op === 'deletepart'){
      const { partId } = payload;
      const { error } = await supa.from('parts').delete().eq('PartID', partId);
      if(error) throw error;
      return { ok:true };
    }
    throw new Error('Unknown op: '+op);
  };

  // ---------- refresh ----------
  window.refreshAllFromApi = async ()=>{
    const [parts, lists] = await Promise.all([
      window.apiGet('parts'),
      window.apiGet('lists')
    ]);
    state.parts = parts;
    state.categories = lists.categories || [];
    state.machines  = lists.machines   || [];
    state.depts     = lists.depts      || [];
  };

  /* ---------- Quick Issue (API) ---------- */
// ---------- Quick Issue (API) ----------
let _issuingBusy = false;
window.doQuickIssue_API = async function(){
  if (_issuingBusy) return;
  if (!currentPart) {
    notify({ title:'ผิดพลาด', message:'ไม่พบรายการที่จะเบิก', level:'danger' });
    return;
  }

  const qty     = Number($('#m_qty').value || 0);
  const by      = $('#m_by').value.trim();
  const machine = $('#m_machine').value.trim();
  const dept    = $('#m_dept').value.trim();
  const note    = $('#m_note').value.trim();

  if (!qty || qty <= 0) return notify({title:'กรอกจำนวน', message:'โปรดกรอกจำนวนที่เบิกให้ถูกต้อง', level:'warn'});
  if (!by)            return notify({title:'ชื่อผู้เบิกว่าง', message:'กรอกชื่อผู้เบิกก่อนยืนยัน', level:'warn'});

  const remain = Number(currentPart.Qty || 0);
  if (remain <= 0)  return notify({title:'หมดสต็อก', message:'ไม่สามารถเบิกอะไหล่ที่หมดได้', level:'danger'});
  if (qty > remain) return notify({title:'คงเหลือไม่พอ', message:`คงเหลือในคลังมีเพียง ${remain} ชิ้น`, level:'danger'});

  _issuingBusy = true;

  // Optimistic UI
  const { i, before } = patchPartQty(currentPart.PartID, -qty);
  renderDashboard(); renderGallery(); renderDatalists();

  try{
    const data = await window.apiPost('issue', {
      partId: currentPart.PartID, qty, by, machine, dept, note
    });
    if (data?.part && i >= 0) state.parts[i] = data.part;

    notify({title:'เบิกสำเร็จ', message:`${currentPart.PartID} จำนวน ${qty}`});

    // ซิงก์ตามหลัง
    try { await refreshAllFromApi(); renderDashboard(); renderGallery(); renderDatalists(); } catch {}

    // ปิดโมดัล + กลับแดชบอร์ด
    $('#issueModal')?.classList.remove('show');
    $('#issueModal')?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    goDashboard();
  }catch(err){
    rollbackPart(i, before);
    renderDashboard(); renderGallery(); renderDatalists();
    notify({title:'เบิกล้มเหลว', message: err.message || 'error', level:'danger'});
  }finally{
    _issuingBusy = false;
  }
};

  /* ---------- Receive (API) ---------- */
  let _receivingBusy = false;
  window.handleReceiveSubmit_API = async function(){
    if(_receivingBusy) return;

    const code  = $('#rc_code').value.trim();
    const name  = $('#rc_name').value.trim();
    const model = $('#rc_model').value.trim();
    const brand = $('#rc_brand').value.trim();
    const qty   = Number($('#rc_qty').value||0);
    const min   = Number($('#rc_min').value||0);
    const loc   = $('#rc_loc').value.trim();
    const cat   = $('#rc_cat').value.trim();
    const file  = $('#rc_img').files?.[0];

    if(!code || !qty || qty<=0) return notify({title:'ข้อมูลไม่ครบ', message:'กรอกรหัสและจำนวนให้ถูกต้อง', level:'warn'});

    _receivingBusy = true;

    let imageBase64 = '';
    if(file && typeof window.readFileAsDataURLCompressed === 'function'){
      try{ imageBase64 = await window.readFileAsDataURLCompressed(file, 1400, .82); }catch{}
    }

    const idx = state.parts.findIndex(x=>x.PartID===code);
    let before = null;

    try{
      if(idx>=0){
        before = {...state.parts[idx]};
        state.parts[idx] = {
          ...before,
          Name: name || before.Name,
          Model: model || before.Model,
          Brand: brand || before.Brand,
          Location: loc || before.Location,
          Category: cat || before.Category,
          Min: isNaN(min) ? before.Min : min,
          Qty: Number(before.Qty||0) + qty,
          ImageURL: imageBase64 || before.ImageURL
        };
      }else{
        state.parts.push({
          PartID:code, Name:name, Model:model, Brand:brand,
          Min:min, Qty:qty, Location:loc, Category:cat,
          ImageURL:imageBase64
        });
      }
      if(cat && !state.categories.includes(cat)) state.categories.push(cat);
      renderDatalists(); renderDashboard(); renderGallery();

      if(idx>=0){
        await window.apiPost('receive', { partId: code, qty });
      }else{
        await window.apiPost('receive_new', {
          part: { PartID:code, Name:name, Model:model, Brand:brand, Min:min, Qty:0, Location:loc, Category:cat },
          qty,
          imageBase64
        });
      }

      notify({title:'บันทึกสำเร็จ', message:`รับเข้า ${code} จำนวน ${qty}`});
      renderGallery(); renderDashboard();

      // ล้างฟอร์ม
      $('#rc_code').value=''; $('#rc_name').value=''; $('#rc_model').value='';
      $('#rc_brand').value=''; $('#rc_qty').value='1'; $('#rc_min').value='0';
      $('#rc_loc').value=''; $('#rc_cat').value=''; $('#rc_img').value='';
      $('#rc_preview')?.removeAttribute('src');

      try{ await refreshAllFromApi(); renderDatalists(); renderDashboard(); renderGallery(); }catch(_){}
      goDashboard();
    }catch(err){
      if(idx>=0 && before){ state.parts[idx] = before; }
      else { state.parts = state.parts.filter(p=>p.PartID!==code); }
      renderDatalists(); renderDashboard(); renderGallery();
      notify({title:'รับเข้าล้มเหลว', message: err.message||'error', level:'danger'});
    }finally{
      _receivingBusy = false;
    }
  };

  /* ---------- Edit/Delete ผ่าน API ---------- */
  $('#e_save')?.addEventListener('click', async (e)=>{
    if(state.mode!=='api') return;
    e.stopImmediatePropagation(); e.preventDefault();

    if(!_editingId) return;
    const newCode = $('#e_code').value.trim();
    if(newCode!==_editingId && state.parts.some(x=>x.PartID===newCode)){
      return notify({title:'ซ้ำ!', message:'รหัสนี้มีอยู่แล้ว', level:'danger'});
    }

    const part = {
      PartID:newCode,
      Name:$('#e_name').value.trim(),
      Category:$('#e_cat').value.trim(),
      Brand:$('#e_brand').value.trim(),
      Model:$('#e_model').value.trim(),
      Qty:Number($('#e_qty').value||0),
      Min:Number($('#e_min').value||0),
      Location:$('#e_loc').value.trim(),
      ImageURL:$('#e_img').value.trim()
    };

    try{
      await window.apiPost('setpart', { part });
      await refreshAllFromApi();
      renderStock(); renderDashboard(); renderDatalists();
      notify({title:'บันทึกแล้ว', message:newCode});
      $('#editModal')?.classList.remove('show');
      $('#editModal')?.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      _editingId = null;
    }catch(err){
      notify({title:'บันทึกล้มเหลว', message: err.message||'error', level:'danger'});
    }
  });

  const __old_deletePart = window.deletePart;
  window.deletePart = async function(partId){
    if(state.mode!=='api') return __old_deletePart(partId);
    const p = state.parts.find(x=>x.PartID===partId); if(!p) return;
    if(!confirm(`ลบอะไหล่ ${p.PartID} — ${p.Name}?`)) return;
    try{
      await window.apiPost('deletepart', { partId });
      await refreshAllFromApi();
      renderStock(); renderDashboard(); renderDatalists();
      notify({title:'ลบแล้ว', message: partId});
    }catch(err){
      notify({title:'ลบไม่สำเร็จ', message: err.message||'error', level:'danger'});
    }
  };

  /* ---------- History (API) ---------- */
  async function renderHistory_API(){
    const tbody = $('#hTbl tbody'); if(!tbody) return;
    const m = Number($('#hMonth')?.value||0);
    const y = Number($('#hYear')?.value||0);
    const q = ($('#hQ')?.value||'').trim().toLowerCase();
    const typeF = $('#hTypeSet .chip.is-active')?.dataset.type || '';

    const rows = await window.apiGet('txns', {month:String(m), year:String(y)});
    const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
    const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

    const filtered = rows.filter(t=>{
      if(typeF && t.Type!==typeF) return false;
      if(q){
        const text = `${t.TxnID||''} ${t.PartID||''} ${nameById.get(t.PartID)||''} ${t.By||''} ${t.Ref||''}`.toLowerCase();
        if(!text.includes(q)) return false;
      }
      return true;
    }).sort((a,b)=> new Date(a.Date) - new Date(b.Date));

    tbody.innerHTML = '';
    if(filtered.length===0){
      tbody.innerHTML = `<tr><td colspan="7" class="meta" style="padding:16px">ไม่มีประวัติในช่วงที่เลือก</td></tr>`;
      return;
    }

    filtered.forEach(t=>{
      const thTime = new Date(t.Date).toLocaleString('th-TH', {hour12:false});
      const badge = t.Type==='รับ' ? `<span class="badge in">รับเข้า</span>` : `<span class="badge out">เบิกออก</span>`;
      const model = modelById.get(t.PartID) || '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${thTime}</td>
        <td>${t.PartID||''}</td>
        <td>${nameById.get(t.PartID)||''}</td>
        <td>${badge}</td>
        <td>${model}</td>
        <td>${t.Qty??0}</td>
        <td>${t.By||''}</td>`;
      tbody.appendChild(tr);
    });
  }

  const __old_renderHistory = window.renderHistory;
  window.renderHistory = function(){
    if(state.mode==='api'){ renderHistory_API(); }
    else { __old_renderHistory(); }
  };

  $('#hQ')?.addEventListener('input', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hMonth')?.addEventListener('change', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hYear')?.addEventListener('change', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hTypeSet')?.addEventListener('click', (e)=>{ 
    if(state.mode!=='api') return;
    const btn = e.target.closest('.chip'); if(!btn) return;
    setTimeout(renderHistory_API, 0);
  });

  /* ---------- Export CSV (API) ---------- */
  $('#btnExportCsv')?.addEventListener('click', async (e)=>{
    if(state.mode!=='api') return;
    e.preventDefault(); e.stopImmediatePropagation();

    const m = Number($('#exMonth').value), y = Number($('#exYear').value);
    const rows = await window.apiGet('txns', {month:String(m), year:String(y)});

    const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
    const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

    const header = ['วันที่เวลา','รหัส','ชื่อ','ประเภท','โมเดล','จำนวน','ผู้ดำเนินการ'];

    const body = rows
      .sort((a,b)=> new Date(a.Date)-new Date(b.Date))
      .map(r=>{
        const thTime = new Date(r.Date).toLocaleString('th-TH',{hour12:false});
        const rec = [
          thTime, r.PartID || '', nameById.get(r.PartID) || '',
          r.Type || '', modelById.get(r.PartID) || '', r.Qty ?? 0, r.By || ''
        ];
        return rec.map(s=>{
          s = String(s ?? '');
          return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
        }).join(',');
      });

    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `Stock_Txns_${y}-${String(m).padStart(2,'0')}.csv`; a.click(); URL.revokeObjectURL(a.href);

    notify({title:'ส่งออกแล้ว', message:`เดือน ${m}/${y} จำนวน ${rows.length} รายการ`});
  }, {capture:true});
})();

/* --- บังคับให้ปุ่มรับเข้าเหลือ handler เดียว (กันยิงซ้ำ) --- */
(function ensureSingleReceiveHandler(){
  const oldBtn = document.getElementById('rc_submit');
  if(!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(btn);

  btn.addEventListener('click', (e)=>{
    if(state.mode === 'api'){
      e.preventDefault(); e.stopImmediatePropagation();
      if (typeof window.handleReceiveSubmit_API === 'function') {
        window.handleReceiveSubmit_API();
      } else {
        notify({title:'โหมด API ยังไม่พร้อม', message:'ไม่พบ handleReceiveSubmit_API()', level:'danger'});
      }
      return;
    }
    e.preventDefault(); e.stopImmediatePropagation();
    handleReceiveSubmit();
  }, {capture:true});
})();

/* --- บังคับให้ปุ่มยืนยันเบิกเหลือ handler เดียว (โหมด API) --- */
(function ensureSingleIssueHandler(){
  const oldBtn = document.getElementById('m_confirm');
  if(!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(btn);

  btn.addEventListener('click', (e)=>{
    e.preventDefault(); e.stopImmediatePropagation();
    if(state.mode === 'api'){
      if (typeof window.doQuickIssue_API === 'function') {
        window.doQuickIssue_API();
      } else {
        notify({title:'โหมด API ยังไม่พร้อม', message:'doQuickIssue_API ยังไม่ได้ export', level:'danger'});
      }
    }else{
      doQuickIssue();
    }
  }, {capture:true});
})();

/* ---------- PERF helpers ---------- */
function patchPartQty(partId, delta){
  const i = state.parts.findIndex(p => p.PartID === partId);
  if(i < 0) return { i:-1 };
  const before = {...state.parts[i]};
  const nextQty = Math.max(0, Number(before.Qty||0) + Number(delta||0));
  state.parts[i] = { ...before, Qty: nextQty };
  return { i, before };
}
function rollbackPart(i, before){
  if(i>=0 && before) state.parts[i] = before;
}

/* บีบอัดรูปก่อนอัปโหลด (ลดแกนยาวสุด ~1400px, quality ~0.82) */
async function readFileAsDataURLCompressed(file, maxSide=1400, quality=0.82){
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', {alpha:false});
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
  return await new Promise((res,rej)=>{
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
}

/* ===== Modern Toasts (notify) ===== */
function notify({ title='', message='', level='info', timeout=2600, icon } = {}){
  let stack = document.getElementById('notiStack');
  if(!stack){
    stack = document.createElement('div');
    stack.id = 'notiStack';
    stack.className = 'noti-stack';
    document.body.appendChild(stack);
  }

  // mapping ระดับ + เผื่อ success/ok
  const map = { danger:'danger', warn:'warn', warning:'warn', ok:'ok', success:'ok', info:'info' };
  const kind = map[level] || 'info';

  // จำกัดจำนวนซ้อน
  while(stack.children.length >= 4){ stack.removeChild(stack.firstElementChild); }

  // ไอคอน SVG (ดูโปรกว่า emoji)
  const svgs = {
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h2v4h-2"/></svg>',
    ok:     '<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
    warn:   '<svg viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><path d="M12 3 2 20h20L12 3z"/><path d="M12 9v4M12 16h.01"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5 14.5 14.5M14.5 9.5 9.5 14.5"/></svg>'
  };

  const el = document.createElement('div');
  el.className = `noti noti--${kind}`;
  el.setAttribute('role', kind==='danger' ? 'alert' : 'status');
  el.innerHTML = `
    <div class="noti__icon" aria-hidden="true">${icon ?? svgs[kind] ?? svgs.info}</div>
    <div class="noti__body">
      ${title ? `<div class="noti__title">${title}</div>` : ''}
      ${message ? `<div class="noti__msg">${message}</div>` : ''}
    </div>
    <button class="noti__close" aria-label="ปิด">×</button>
    ${timeout ? '<div class="noti__progress"></div>' : ''}
  `;
  stack.appendChild(el);

  // ปิดเอง/ด้วยปุ่ม/ลากทิ้ง
  const close = () => {
    if(!el.isConnected) return;
    el.classList.add('out');
    setTimeout(()=> el.remove(), 180);
  };
  el.querySelector('.noti__close').addEventListener('click', close);

  // auto dismiss + pause on hover
  let timer = null;
  if (timeout && timeout > 0){
    el.style.setProperty('--life', `${timeout}ms`);
    timer = setTimeout(close, timeout + 120);
    el.addEventListener('mouseenter', ()=>{ el.classList.add('paused'); if(timer){clearTimeout(timer); timer=null;} });
    el.addEventListener('mouseleave', ()=>{ el.classList.remove('paused'); if(!timer){ timer=setTimeout(close, 800); } });
  }

  // swipe to dismiss (ขวา)
  let startX = 0, dx = 0;
  const onStart = e => { startX = (e.touches?.[0]?.clientX ?? e.clientX) || 0; dx = 0; el.style.transition='none'; };
  const onMove  = e => {
    if(!startX) return;
    const x = (e.touches?.[0]?.clientX ?? e.clientX) || 0;
    dx = x - startX;
    if(dx>0){ el.style.transform = `translateX(${dx}px)`; el.style.opacity = String(1 - Math.min(dx/220, .8)); }
  };
  const onEnd   = () => {
    if(!startX) return;
    if(dx > 90) close();
    else{ el.style.transition='transform .2s ease, opacity .2s ease'; el.style.transform=''; el.style.opacity=''; }
    startX = 0; dx = 0;
  };
  el.addEventListener('mousedown', onStart);  window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onEnd);
  el.addEventListener('touchstart', onStart, {passive:true});
  el.addEventListener('touchmove',  onMove,  {passive:true});
  el.addEventListener('touchend',   onEnd);
  return el;
}

/* =========================================================
   Supabase — Edit & Delete hooks (fixed: use window.supa)
   ========================================================= */
(function enableEditDeleteOnSupabase(){
  // ใช้เฉพาะโหมด API
  if (state.mode !== 'api') return;

  const supa = window.supa;
  if (!supa) { console.warn('Supabase client not found'); return; }

  function readEditForm(){
    return {
      PartID:  $('#e_code').value.trim(),
      Name:    $('#e_name').value.trim(),
      Category:$('#e_cat').value.trim(),
      Brand:   $('#e_brand').value.trim(),
      Model:   $('#e_model').value.trim(),
      Qty:     Number($('#e_qty').value || 0),
      Min:     Number($('#e_min').value || 0),
      Location:$('#e_loc').value.trim(),
      ImageURL:$('#e_img').value.trim()
    };
  }

  async function updateTxnsPartId(oldId, newId){
    if (oldId === newId) return;
    // มี ON UPDATE CASCADE แล้วก็ข้ามได้ แต่เผื่อไว้
    const { error } = await supa
      .from('txns')
      .update({ PartID: newId })
      .eq('PartID', oldId);
    if (error) throw error;
  }

  async function saveEditSupabase(){
    if(!_editingId){
      $('#editModal')?.classList.remove('show');
      $('#editModal')?.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      return;
    }

    const idx = state.parts.findIndex(x=>x.PartID===_editingId);
    if(idx<0) return;

    const before = { ...state.parts[idx] };
    const next   = readEditForm();
    const changingId = (next.PartID !== _editingId);

    if (changingId && state.parts.some(p => p.PartID === next.PartID)) {
      notify({title:'ซ้ำ!', message:'รหัสนี้มีอยู่แล้ว', level:'danger'});
      return;
    }

    // Optimistic UI
    state.parts[idx] = { ...next };
    renderStock(); renderDashboard(); renderDatalists();

    try{
      const { data, error } = await supa
        .from('parts')
        .update(next)              // อัปเดตรวมถึง PartID ใหม่
        .eq('PartID', _editingId)
        .select()
        .single();
      if (error) throw error;

      if (changingId) await updateTxnsPartId(_editingId, next.PartID);

      notify({title:'บันทึกแล้ว', message: next.PartID});
      $('#editModal')?.classList.remove('show');
      $('#editModal')?.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      _editingId = null;
    }catch(err){
      state.parts[idx] = before;  // rollback
      renderStock(); renderDashboard(); renderDatalists();
      notify({title:'บันทึกล้มเหลว', message: err?.message || 'เกิดข้อผิดพลาด', level:'danger'});
    }
  }

  // โอเวอร์ไรด์ปุ่มบันทึกให้ยิงมาที่ Supabase โดยตรง
  (function hookEditSaveButton(){
    const oldBtn = document.getElementById('e_save');
    if(!oldBtn) return;
    const btn = oldBtn.cloneNode(true);
    oldBtn.replaceWith(btn);
    btn.addEventListener('click', (e)=>{
      e.preventDefault(); e.stopImmediatePropagation();
      if (userRole !== 'admin') {
        return notify({title:'สิทธิ์ไม่พอ', message:'ต้องเป็นผู้ดูแลระบบ', level:'danger'});
      }
      saveEditSupabase();
    }, {capture:true});
  })();

  // ลบอะไหล่
  const __old_deletePart = window.deletePart;
  window.deletePart = async function(partId){
    if(state.mode !== 'api'){
      return __old_deletePart ? __old_deletePart(partId) : null;
    }
    const p = state.parts.find(x=>x.PartID===partId); if(!p) return;
    if (userRole !== 'admin') {
      return notify({title:'สิทธิ์ไม่พอ', message:'ต้องเป็นผู้ดูแลระบบ', level:'danger'});
    }
    if(!confirm(`ลบอะไหล่ ${p.PartID} — ${p.Name}?`)) return;

    const before = [...state.parts];
    state.parts = state.parts.filter(x=>x.PartID!==partId);
    renderStock(); renderDashboard(); renderDatalists();

    try{
      const { error } = await supa.from('parts').delete().eq('PartID', partId);
      if (error) throw error;
      notify({title:'ลบแล้ว', message: partId});
    }catch(err){
      state.parts = before;   // rollback
      renderStock(); renderDashboard(); renderDatalists();
      notify({title:'ลบไม่สำเร็จ', message: err?.message || 'เกิดข้อผิดพลาด', level:'danger'});
    }
  };
})();

// ===== Compact bottom-nav labels on very small screens =====
(function compactNavLabels(){
  const tiny = window.matchMedia('(max-width: 360px)').matches;
  if(!tiny) return;

  const map = new Map([
    ['แดชบอร์ด', 'แดช'],
    ['สต็อก', 'สต็อก'],       // คงเดิม
    ['รับเข้า', 'รับ'],
    ['ค้นหา/เบิก', 'ค้นหา'],
    ['ประวัติ', 'ประวัติ'],    // คงเดิม
    ['ส่งออก', 'ส่งออก']       // คงเดิม
  ]);

  document.querySelectorAll('.bottom-nav .nav-btn span').forEach(el=>{
    const t = (el.textContent||'').trim();
    if(map.has(t)) el.textContent = map.get(t);
  });
})();

// ==== Compact bottom-nav labels for tiny screens ====
(function normalizeNavLabels(){
  // เปลี่ยน "ค้นหา/เบิก" -> "ค้นหา" และย่อบางตัว
  const map = new Map([
    ['ค้นหา/เบิก','ค้นหา'],
    ['แดชบอร์ด','แดชบอร์ด'],   // ถ้าจอเล็กมากค่อยย่ออีกที
  ]);

  document.querySelectorAll('.bottom-nav .nav-btn span').forEach(el=>{
    const t = (el.textContent||'').trim();
    if(map.has(t)) el.textContent = map.get(t);
  });

  // จอเล็กมาก (≤ 360px): ย่อเพิ่มเติมให้พอดี 2 บรรทัด
  if (window.matchMedia('(max-width:360px)').matches){
    const tinyMap = new Map([
      ['แดชบอร์ด','แดช'],  // ย่อเหลือคำเดียว
      ['ประวัติ','ประวัติ'], // คงเดิม
      ['ส่งออก','ส่งออก'],   // คงเดิม
      ['ตั้งค่า','ตั้งค่า']    // คงเดิม
    ]);
    document.querySelectorAll('.bottom-nav .nav-btn span').forEach(el=>{
      const t = (el.textContent||'').trim();
      if(tinyMap.has(t)) el.textContent = tinyMap.get(t);
    });
  }
})();

/* -------------------------------------------------------
   ✨ Edit Image: Preview + Upload (demo & API)
   - รองรับพรีวิวรูปเมื่อเลือกไฟล์
   - โหมด demo: เก็บเป็น dataURL ใน localStorage
   - โหมด API: อัปโหลด Supabase Storage แล้วเซ็ต ImageURL
   ------------------------------------------------------- */

/* ช่วยอ่านไฟล์ (อัดขนาด + คุณภาพ ให้เบา) */
async function readFileAsDataURLCompressed(file, maxSide=1400, quality=0.82){
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', {alpha:false});
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
  return await new Promise((res,rej)=>{
    const fr = new FileReader(); fr.onload = () => res(fr.result);
    fr.onerror = rej; fr.readAsDataURL(blob);
  });
}

/* แปลง dataURL -> อัปโหลดขึ้น Supabase Storage แล้วคืน public URL */
async function __uploadDataUrlToStorage(dataUrl, path){
  const supa = window.supa;
  if(!supa) throw new Error('ไม่พบ Supabase client (window.supa)');
  const [meta, b64] = String(dataUrl).split(',');
  const mime = /data:(.*?);base64/.exec(meta)?.[1] || 'image/jpeg';
  const bin  = atob(b64); const len = bin.length; const buf = new Uint8Array(len);
  for(let i=0;i<len;i++) buf[i] = bin.charCodeAt(i);
  const blob = new Blob([buf], {type:mime});
  const { error:upErr } = await supa.storage.from('parts').upload(path, blob, { upsert:true, contentType: blob.type });
  if(upErr) throw upErr;
  const { data } = supa.storage.from('parts').getPublicUrl(path);
  return data.publicUrl;
}

/* ---- ผูกพรีวิวรูป & ปุ่มล้าง ---- */
(function wireEditImagePreview(){
  const fi = document.getElementById('e_imgFile');
  const pv = document.getElementById('e_imgPreview');
  const clearBtn = document.getElementById('e_clearImgEdit');

  // รีเซ็ตพรีวิวทุกครั้งที่เปิด modal แก้ไข
  const __oldOpenEdit = window.openEditModal;
  window.openEditModal = function(part, presetQty=0){
    if(typeof __oldOpenEdit === 'function') __oldOpenEdit(part, presetQty);
    if(pv){
      if(part?.ImageURL){ pv.src = part.ImageURL; }
      else { pv.removeAttribute('src'); }
    }
    if(fi){ fi.value=''; delete fi.dataset._tempDataUrl; }
  };

  fi?.addEventListener('change', async (e)=>{
    const f = e.target.files?.[0];
    if(!f){ pv?.removeAttribute('src'); delete e.target.dataset._tempDataUrl; return; }
    try{
      const dataUrl = await readFileAsDataURLCompressed(f, 1400, .82);
      e.target.dataset._tempDataUrl = dataUrl;   // เก็บไว้ใช้ตอนกดบันทึก
      if(pv) pv.src = dataUrl;
    }catch{ pv?.removeAttribute('src'); delete e.target.dataset._tempDataUrl; }
  });

  clearBtn?.addEventListener('click', ()=>{
    if(fi){ fi.value=''; delete fi.dataset._tempDataUrl; }
    pv?.removeAttribute('src');
  });
})();

/* ---- บันทึก (โหมด DEMO) : แทนที่ handler เดิมให้รองรับรูปไฟล์ ---- */
(function hookEditSaveDemo(){
  if(state?.mode !== 'demo') return;
  const oldBtn = document.getElementById('e_save');
  if(!oldBtn) return;
  const btn = oldBtn.cloneNode(true); oldBtn.replaceWith(btn);

  btn.addEventListener('click', async (e)=>{
    e.preventDefault(); e.stopImmediatePropagation();

    // หาอะไหล่ที่กำลังแก้
    if(!_editingId){ document.getElementById('editModal')?.classList.remove('show'); return; }
    const idx = state.parts.findIndex(x=>x.PartID===_editingId);
    if(idx<0) return;

    const newCode = $('#e_code').value.trim();
    if(newCode!==_editingId && state.parts.some(x=>x.PartID===newCode)){
      return notify({title:'ซ้ำ!', message:'รหัสนี้มีอยู่แล้ว', level:'danger'});
    }

    // อ่านฟอร์ม
    const next = {
      PartID:  newCode,
      Name:    $('#e_name').value.trim(),
      Category:$('#e_cat').value.trim(),
      Brand:   $('#e_brand').value.trim(),
      Model:   $('#e_model').value.trim(),
      Qty:     Number($('#e_qty').value||0),
      Min:     Number($('#e_min').value||0),
      Location:$('#e_loc').value.trim(),
      ImageURL:$('#e_img').value.trim()
    };

    // ถ้ามีไฟล์ใหม่ -> ใช้ dataURL แทน URL เดิม
    const fi = document.getElementById('e_imgFile');
    const temp = fi?.dataset?._tempDataUrl || '';
    if(temp) next.ImageURL = temp;

    // อัปเดต state
    const before = {...state.parts[idx]};
    state.parts[idx] = {...before, ...next};
    if(newCode!==_editingId){ state.txns.forEach(t=>{ if(t.PartID===_editingId) t.PartID=newCode; }); }

    saveDemo(); renderStock(); renderDashboard(); renderDatalists();
    notify({title:'บันทึกแล้ว', message:newCode});
    document.body.classList.remove('modal-open');
    $('#editModal')?.classList.remove('show');
    _editingId = null;
  }, {capture:true});
})();

/* ---- บันทึก (โหมด API) : อัปโหลดรูปขึ้น Storage แล้วอัปเดต parts ---- */
(function hookEditSaveApi(){
  if(state?.mode !== 'api') return;
  const supa = window.supa;
  if(!supa) return;

  const oldBtn = document.getElementById('e_save');
  if(!oldBtn) return;
  const btn = oldBtn.cloneNode(true); oldBtn.replaceWith(btn);

  async function updateTxnsPartId(oldId, newId){
    if (oldId === newId) return;
    const { error } = await supa.from('txns').update({ PartID:newId }).eq('PartID', oldId);
    if(error) throw error;
  }

  btn.addEventListener('click', async (e)=>{
    e.preventDefault(); e.stopImmediatePropagation();
    if(!_editingId) return;

    const idx = state.parts.findIndex(x=>x.PartID===_editingId);
    if(idx<0) return;

    const next = {
      PartID:  $('#e_code').value.trim(),
      Name:    $('#e_name').value.trim(),
      Category:$('#e_cat').value.trim(),
      Brand:   $('#e_brand').value.trim(),
      Model:   $('#e_model').value.trim(),
      Qty:     Number($('#e_qty').value||0),
      Min:     Number($('#e_min').value||0),
      Location:$('#e_loc').value.trim(),
      ImageURL:$('#e_img').value.trim()
    };

    if(next.PartID!==_editingId && state.parts.some(p=>p.PartID===next.PartID)){
      return notify({title:'ซ้ำ!', message:'รหัสดังกล่าวมีอยู่แล้ว', level:'danger'});
    }

    // ถ้ามีรูปไฟล์ใหม่ -> อัปโหลด Storage แล้วได้ URL
    const fi = document.getElementById('e_imgFile');
    const temp = fi?.dataset?._tempDataUrl || '';
    let uploadedUrl = '';
    try{
      if(temp){
        const path = `parts/${next.PartID}_${Date.now()}.jpg`;
        uploadedUrl = await __uploadDataUrlToStorage(temp, path);
      }
    }catch(err){
      return notify({title:'อัปโหลดรูปไม่สำเร็จ', message: err?.message || 'ลองใหม่อีกครั้ง', level:'danger'});
    }
    if(uploadedUrl) next.ImageURL = uploadedUrl;

    // Optimistic UI + rollback
    const before = {...state.parts[idx]};
    state.parts[idx] = {...before, ...next};
    renderStock(); renderDashboard(); renderDatalists();

    try{
      const { error } = await supa.from('parts')
        .update(next).eq('PartID', _editingId);
      if(error) throw error;

      if(next.PartID !== _editingId){
        await updateTxnsPartId(_editingId, next.PartID);
      }

      notify({title:'บันทึกแล้ว', message: next.PartID});
      document.body.classList.remove('modal-open');
      $('#editModal')?.classList.remove('show');
      _editingId = null;
    }catch(err){
      state.parts[idx] = before; // rollback
      renderStock(); renderDashboard(); renderDatalists();
      notify({title:'บันทึกล้มเหลว', message: err?.message || 'เกิดข้อผิดพลาด', level:'danger'});
    }
  }, {capture:true});
})();

/* =========================================================
   QR Codes — resilient + Label Page (open on download)
   ========================================================= */

/* ---------- Multi-CDN loader ---------- */
const QR_CDNs = [
  'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js',
  'https://unpkg.com/qrcode@1.5.3/build/qrcode.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js'
];
function loadScriptWithTimeout(src, timeout = 7000){
  return new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    let done = false;
    const t = setTimeout(()=>{ if(!done){ done=true; s.remove(); reject(new Error('timeout')); }}, timeout);
    s.src = src; s.async = true;
    s.onload = ()=>{ if(!done){ done=true; clearTimeout(t); resolve(); } };
    s.onerror = ()=>{ if(!done){ done=true; clearTimeout(t); reject(new Error('load error')); } };
    document.head.appendChild(s);
  });
}
async function ensureQrLib(){
  if (window.QRCode && typeof window.QRCode.toDataURL === 'function') return true;
  for(const url of QR_CDNs){
    try{ await loadScriptWithTimeout(url); if(window.QRCode?.toDataURL) return true; }catch(_){}
  }
  return false;
}

/* ---------- Payload: 1 PartID ต่อ 1 QR (ผูก Model) ---------- */
function buildQrPayload(partId){
  const p = (state.parts||[]).find(x=>x.PartID===partId);
  const model = p?.Model || '';
  return `MPR:${partId}|${model}`;
}

/* ---------- รูป QR: dataURL (ถ้ามี lib) หรือ URL จากบริการออนไลน์ ---------- */
async function getQrImageSrc(payload, size = 280){
  try{
    const ok = await ensureQrLib();
    if(ok){
      const dataUrl = await QRCode.toDataURL(payload, {
        errorCorrectionLevel:'M', margin:1, scale: Math.max(2, Math.floor(size/40))
      });
      if(dataUrl) return dataUrl;
    }
  }catch(_){}
  const px = Math.max(80, Math.min(800, size));
  return `https://api.qrserver.com/v1/create-qr-code/?size=${px}x${px}&data=${encodeURIComponent(payload)}`;
}

/* =========================================================
   STOCK TABLE: ปุ่ม QR + โมดัลพรีวิว
   ========================================================= */
(function patchStockTableWithQR(){
  const __orig = window.renderStock;
  window.renderStock = function(){
    __orig && __orig();

    // ใส่ปุ่ม QR ให้ทุกแถว (ครั้งเดียว)
    $$('#stockTbl tbody .act').forEach(act=>{
      const editBtn = act.querySelector('[data-edit]');
      if(!editBtn) return;
      const pid = editBtn.dataset.edit;
      if(!act.querySelector(`[data-qr="${pid}"]`)){
        const qrBtn = document.createElement('button');
        qrBtn.className = 'btn-xs';
        qrBtn.textContent = 'QR';
        qrBtn.setAttribute('data-qr', pid);
        act.insertBefore(qrBtn, act.firstChild);
      }
    });

    // คลิก → เปิดพรีวิว
    $$('#stockTbl tbody [data-qr]').forEach(btn=>{
      btn.onclick = async ()=>{
        const pid = btn.getAttribute('data-qr');
        const p = state.parts.find(x=>x.PartID===pid);
        if(!p) return;
        const payload = buildQrPayload(pid);
        const src = await getQrImageSrc(payload, 280);
        openQrPreviewModal({ part: p, payload, src });
      };
    });
  };

  function getQrModal(){
    let modal = document.getElementById('qrModal');
    if(modal) return modal;
    modal = document.createElement('div');
    modal.id = 'qrModal';
    modal.className = 'modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__panel" role="dialog" aria-modal="true">
        <div class="modal__head">
          <button class="modal__close" type="button" data-close aria-label="ปิด">×</button>
          <div class="modal__title">QR อะไหล่</div>
        </div>
        <div class="modal__body">
          <div class="grid">
            <div style="display:flex; gap:12px; align-items:center">
              <img id="qrPrevImg" alt="QR" style="width:220px;height:220px;border-radius:12px;border:1px solid #e5e7eb;background:#fff"/>
              <div>
                <div id="qrPrevTitle" class="name"></div>
                <div id="qrPrevMeta" class="meta"></div>
                <div class="meta" id="qrPrevPayload" style="word-break:break-all"></div>
                <div class="meta" id="qrPrevNote" style="color:#b45309"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal__foot">
          <button class="secondary" data-close>ปิด</button>
          <button id="btnDownloadQr">ดาวน์โหลด PNG</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', close));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.classList.contains('show')) close(); });
    function close(){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
    }
    return modal;
  }

  async function openQrPreviewModal({ part, payload, src }){
    const modal = getQrModal();
    const isExternal = typeof src === 'string' && src.startsWith('http');
    $('#qrPrevImg', modal).src = src;
    $('#qrPrevTitle', modal).textContent = `${part.PartID} — ${part.Name||''}`;
    $('#qrPrevMeta', modal).textContent  = `${part.Brand||'-'} ${part.Model||''} • ${part.Category||'-'} • ที่เก็บ ${part.Location||'-'}`;
    $('#qrPrevPayload', modal).textContent = payload;
    $('#qrPrevNote', modal).textContent = isExternal ? 'โหมดสำรอง: ใช้บริการสร้าง QR ออนไลน์' : '';

    // >>> เปลี่ยนพฤติกรรม: เปิดหน้า Label สวย ๆ แทนดาวน์โหลดทันที <<<
    $('#btnDownloadQr', modal).onclick = ()=>{
      openQrLabelPage({ part, payload, src, isExternal });
    };

    document.body.classList.add('modal-open');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
  }
})();

/* ---------- หน้า Label (เปิดแท็บใหม่) ---------- */
function openQrLabelPage({ part, payload, src, isExternal }){
  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QR — ${part.PartID}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{
    --ink:#0f172a; --muted:#64748b; --line:#e5e7eb; --pri:#2563eb;
  }
  html,body{margin:0;background:#f7fafc;color:var(--ink);font-family:system-ui,-apple-system,'Noto Sans Thai',Segoe UI,Roboto,Arial}
  .toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:10px;display:flex;gap:8px;justify-content:flex-end}
  .btn{cursor:pointer;border:1px solid var(--line);background:#f8fafc;border-radius:10px;padding:8px 12px;font-weight:700}
  .btn.primary{background:var(--pri);border-color:transparent;color:#fff}
  .wrap{max-width:920px;margin:18px auto;padding:0 16px}
  .card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:14px;display:flex;gap:16px;align-items:flex-start}
  .qr{width:min(360px,42vw);height:auto;aspect-ratio:1/1;border:1px solid var(--line);border-radius:12px;background:#fff}
  .name{font-weight:800;font-size:20px;margin-top:4px}
  .meta{color:var(--muted);font-size:14px;margin-top:4px}
  .note{color:#b45309;font-size:13px;margin-top:8px}
  @media print{
    .toolbar{display:none}
    body{background:#fff}
    .wrap{margin:0;padding:0}
    .card{border:none;box-shadow:none}
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button class="btn" onclick="window.print()">พิมพ์/บันทึก PDF</button>
    <a class="btn primary" ${isExternal ? '' : `download="QR_${part.PartID}.png"`} href="${src}" target="_blank" rel="noopener">ดาวน์โหลด PNG</a>
  </div>
  <div class="wrap">
    <div class="card">
      <img class="qr" src="${src}" alt="QR ${part.PartID}">
      <div>
        <div class="name">${part.PartID} — ${part.Name||''}</div>
        <div class="meta">${part.Brand||'-'} • ${part.Category||'-'} • ที่เก็บ ${part.Location||'-'}</div>
        <div class="meta">${payload}</div>
        ${isExternal ? '<div class="note">โหมดสำรอง: ใช้บริการสร้าง QR ออนไลน์</div>' : ''}
      </div>
    </div>
  </div>
</body>
</html>`.trim();

  const w = window.open('', '_blank');
  if(!w){ notify?.({title:'ป๊อปอัปถูกบล็อก', message:'โปรดอนุญาตให้เว็บไซต์เปิดแท็บใหม่', level:'warn'}); return; }
  w.document.open(); w.document.write(html); w.document.close();
}

/* =========================================================
   EXPORT: CSV (+QR payload) & แผ่นพิมพ์ QR (A4)
   ========================================================= */
(function ensureCsvIncludesQr(){
  const oldBtn = document.getElementById('btnExportCsv');
  if(!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.replaceWith(btn);

  btn.addEventListener('click', async (e)=>{
    e.preventDefault(); e.stopImmediatePropagation();
    const m = Number($('#exMonth').value);
    const y = Number($('#exYear').value);

    const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
    const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

    let rows = [];
    try{
      if(state.mode==='api' && window.apiGet){
        rows = await window.apiGet('txns', {month:String(m), year:String(y)});
      }else{
        rows = (state.txns||[]).filter(t=>{
          const d = new Date(t.Date);
          return (d.getMonth()+1)===m && d.getFullYear()===y;
        });
      }
    }catch{ rows = []; }

    rows = rows.sort((a,b)=> new Date(a.Date)-new Date(b.Date));

    const header = ['วันที่เวลา','รหัส','ชื่อ','ประเภท','โมเดล','จำนวน','ผู้ดำเนินการ','QR'];
    const body = rows.map(r=>{
      const thTime = new Date(r.Date).toLocaleString('th-TH', {hour12:false});
      const payload = buildQrPayload(r.PartID||'');
      const rec = [
        thTime, r.PartID || '', nameById.get(r.PartID) || '',
        r.Type || '', modelById.get(r.PartID) || '', r.Qty ?? 0, r.By || '', payload
      ];
      return rec.map(s=>{
        s = String(s ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
      }).join(',');
    });

    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Stock_Txns_${y}-${String(m).padStart(2,'0')}_QR.csv`;
    a.click();
    URL.revokeObjectURL(a.href);

    notify({title:'ส่งออกแล้ว', message:`CSV + QR • เดือน ${m}/${y} จำนวน ${rows.length} รายการ`});
  }, {capture:true});
})();

/* ปุ่ม “แผ่นพิมพ์ QR” (A4) */
(function injectQrSheetButton(){
  const host = document.querySelector('#page-export .row:last-child');
  if(!host || host.querySelector('#btnExportQrSheet')) return;
  const b = document.createElement('button');
  b.id='btnExportQrSheet'; b.textContent='แผ่นพิมพ์ QR';
  b.style.marginLeft='8px';
  host.appendChild(b);

  b.addEventListener('click', async ()=>{
    const m = Number($('#exMonth').value);
    const y = Number($('#exYear').value);

    let txns = [];
    try{
      if(state.mode==='api' && window.apiGet){
        txns = await window.apiGet('txns', {month:String(m), year:String(y)});
      }else{
        txns = (state.txns||[]).filter(t=>{
          const d=new Date(t.Date);
          return (d.getMonth()+1)===m && d.getFullYear()===y;
        });
      }
    }catch{ txns = []; }

    const ids = Array.from(new Set(txns.map(t=>t.PartID).filter(Boolean)));
    const parts = ids.map(id => state.parts.find(p=>p.PartID===id)).filter(Boolean);
    if(parts.length===0){
      return notify({title:'ไม่มีรายการ', message:'เดือนนี้ไม่มีธุรกรรมสำหรับสร้าง QR', level:'warn'});
    }
    try{ await openPrintableQrSheet(parts); }catch(err){
      notify({title:'สร้างแผ่นพิมพ์ไม่สำเร็จ', message: err?.message||'', level:'danger'});
    }
  });
})();

/* แผ่นพิมพ์ QR (A4) */
async function openPrintableQrSheet(parts){
  const items = [];
  for(const p of parts){
    const payload = buildQrPayload(p.PartID);
    const img = await getQrImageSrc(payload, 300);
    items.push({ p, payload, img });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>QR Sheet</title>
<style>
  @page { size: A4; margin: 12mm; }
  body{ font-family: system-ui, -apple-system, 'Noto Sans Thai', Segoe UI, Roboto, Arial; color:#0f172a; }
  .head{ display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
  .grid{ display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; }
  .card{ border:1px solid #e5e7eb; border-radius:12px; padding:10px; display:grid; gap:6px; }
  .meta{ font-size:12px; color:#64748b; }
  .name{ font-weight:700; font-size:14px; }
  .qr{ width:100%; aspect-ratio:1/1; object-fit:contain; background:#fff; border:1px solid #e5e7eb; border-radius:10px; }
  .foot{ font-size:11px; color:#475569; word-break:break-all }
  @media print{ .noprint{ display:none } }
</style>
</head>
<body>
  <div class="head noprint">
    <div><strong>QR Labels</strong> • รวม ${items.length} รายการ</div>
    <div><button onclick="window.print()" style="padding:8px 12px;border-radius:8px;border:1px solid #e5e7eb;background:#f8fafc;cursor:pointer">พิมพ์/บันทึก PDF</button></div>
  </div>
  <div class="grid">
    ${items.map(({p,payload,img})=>`
      <div class="card">
        <img class="qr" src="${img}" alt="QR ${p.PartID}">
        <div class="name">${p.PartID} — ${p.Name||''}</div>
        <div class="meta">${p.Brand||'-'} ${p.Model||''} • ${p.Category||'-'} • ที่เก็บ ${p.Location||'-'}</div>
        <div class="foot">${payload}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`.trim();

  const w = window.open('', '_blank');
  if(!w) throw new Error('บราวเซอร์บล็อกป๊อปอัป');
  w.document.open(); w.document.write(html); w.document.close();
}
/* =========================================================
   📷 QR Scanner — Scan to Issue
   - ปุ่ม "สแกน QR" ในหน้า "ค้นหา/เบิก"
   - ใช้กล้องมือถือ/คอม + อัปโหลดรูป
   - รองรับ BarcodeDetector (เร็ว) และ jsQR (fallback)
   ========================================================= */

(function qrScannerFeature(){

  // --- สร้างปุ่ม "สแกน QR" ในหน้า 'ค้นหา/เบิก' ---
  function injectScanButton(){
    const tb = document.querySelector('#page-search .toolbar');
    if(!tb || tb.querySelector('#btnScanQR')) return;
    const btn = document.createElement('button');
    btn.id = 'btnScanQR';
    btn.className = 'secondary';
    btn.textContent = 'สแกน QR';
    tb.appendChild(btn);
    btn.addEventListener('click', openQrScanner);
  }

  // hook ให้ทุกครั้งที่กดแท็บ "ค้นหา/เบิก" จะมีปุ่มนี้เสมอ
  const __origSwitchTab = window.switchTab;
  window.switchTab = function(tab){
    __origSwitchTab && __origSwitchTab(tab);
    if(tab==='search') injectScanButton();
  };
  // เรียกครั้งแรกหลังโหลด
  injectScanButton();

  // --- Modal DOM สแกนเนอร์ (ใช้สไตล์ modal เดิม) ---
  function ensureQrScanModal(){
    let m = document.getElementById('qrScanModal');
    if(m) return m;
    m = document.createElement('div');
    m.id = 'qrScanModal';
    m.className = 'modal';
    m.setAttribute('aria-hidden','true');
    m.innerHTML = `
      <div class="modal__backdrop" data-close></div>
      <div class="modal__panel" role="dialog" aria-modal="true">
        <div class="modal__head">
          <button class="modal__close" type="button" data-close aria-label="ปิด">×</button>
          <div class="modal__title">สแกนคิวอาร์โค้ด</div>
        </div>
        <div class="modal__body">
          <div class="scan-frame">
            <video id="qrVideo" class="qrscan-video" playsinline muted></video>
            <div class="scan-box" aria-hidden="true"></div>
            <div class="scan-line" aria-hidden="true"></div>
          </div>
          <div class="qrscan-toolbar">
            <select id="qrCamSel" title="เลือกกล้อง"></select>
            <button id="qrTorchBtn" class="secondary" type="button">ไฟฉาย</button>
            <input id="qrFile" type="file" accept="image/*" hidden />
            <button id="qrPickBtn" class="secondary" type="button">สแกนจากรูป</button>
            <div class="grow"></div>
            <button class="secondary" data-close type="button">ปิด</button>
          </div>
          <div class="qr-tip">เคล็ดลับ: ให้ QR อยู่ในกรอบสี่เหลี่ยม • แสงสว่างพอ • กล้องด้านหลังจะโฟกัสดีกว่า</div>
        </div>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', closeQrScanner));
    m.querySelector('#qrPickBtn')?.addEventListener('click', ()=> m.querySelector('#qrFile').click());
    m.querySelector('#qrFile')?.addEventListener('change', e=>{
      const f = e.target.files?.[0]; if(f) scanFromImageFile(f);
      e.target.value = '';
    });
    m.querySelector('#qrCamSel')?.addEventListener('change', e=> startCamera(e.target.value));
    m.querySelector('#qrTorchBtn')?.addEventListener('click', toggleTorch);
    return m;
  }

  // --- สถานะสแกนเนอร์ ---
  let _stream = null, _track = null, _raf = 0;
  let _detector = null;      // BarcodeDetector
  let _useDetector = false;  // เลือกอัตโนมัติ
  let _canvas = null, _ctx = null;

  // multi-CDN loader (ถ้าไม่มีของเดิม)
  function loadJs(url, timeout=7000){
    if (typeof loadScriptWithTimeout === 'function') {
      return loadScriptWithTimeout(url, timeout);
    }
    return new Promise((resolve, reject)=>{
      const s = document.createElement('script');
      let done = false;
      const t = setTimeout(()=>{ if(!done){ done=true; s.remove(); reject(new Error('timeout')); }}, timeout);
      s.src = url; s.async = true;
      s.onload = ()=>{ if(!done){ done=true; clearTimeout(t); resolve(); } };
      s.onerror = ()=>{ if(!done){ done=true; clearTimeout(t); reject(new Error('load error')); } };
      document.head.appendChild(s);
    });
  }

  const JSQR_CDNS = [
    'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js',
    'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js'
  ];
  async function ensureJsQR(){
    if(window.jsQR) return true;
    for(const u of JSQR_CDNS){
      try{ await loadJs(u); if(window.jsQR) return true; }catch(_){}
    }
    return false;
  }

  // --- เปิดสแกนเนอร์ ---
  async function openQrScanner(){
    const modal = ensureQrScanModal();
    document.body.classList.add('modal-open');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');

    // เลือกเครื่องมือ decode
    _useDetector = ('BarcodeDetector' in window);
    if(_useDetector){
      try{ _detector = new BarcodeDetector({ formats: ['qr_code'] }); }
      catch{ _useDetector = false; }
    }
    if(!_useDetector){
      const ok = await ensureJsQR();
      if(!ok){ notify({title:'เปิดสแกนเนอร์ไม่ได้', message:'โหลดตัวถอดรหัส QR ไม่สำเร็จ', level:'danger'}); closeQrScanner(); return; }
    }

    try{
      await startCamera();   // default: กล้องหลัง
      startLoop();
    }catch(err){
      notify({title:'เข้าถึงกล้องไม่ได้', message: err?.message || 'โปรดอนุญาตการใช้กล้อง', level:'danger'});
      closeQrScanner();
    }
  }

  // --- ปิดสแกนเนอร์ ---
  function closeQrScanner(){
    cancelAnimationFrame(_raf); _raf = 0;
    if(_track){ try{ _track.stop(); }catch{} }
    if(_stream){ try{ _stream.getTracks().forEach(t=>t.stop()); }catch{} }
    _track=null; _stream=null;

    const modal = document.getElementById('qrScanModal');
    if(modal){
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      const v = document.getElementById('qrVideo'); if(v){ v.pause?.(); v.srcObject=null; }
    }
  }

  // --- กล้อง ---
  async function startCamera(deviceId){
    stopCamera();
    const cons = { video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: { ideal:'environment' } }, audio:false };
    _stream = await navigator.mediaDevices.getUserMedia(cons);
    _track = _stream.getVideoTracks()[0];

    const video = document.getElementById('qrVideo');
    video.srcObject = _stream;
    await video.play();

    await populateCameras(deviceId);
  }
  function stopCamera(){
    try{ cancelAnimationFrame(_raf); }catch{}
    if(_track) try{ _track.stop(); }catch{}
    if(_stream) try{ _stream.getTracks().forEach(t=>t.stop()); }catch{}
    _track=null; _stream=null;
  }
  async function populateCameras(selectedId){
    const sel = document.getElementById('qrCamSel'); if(!sel) return;
    const devs = await navigator.mediaDevices.enumerateDevices().catch(()=>[]);
    const cams = devs.filter(d=> d.kind==='videoinput');
    sel.innerHTML = cams.map(d => `<option value="${d.deviceId}">${d.label || 'กล้อง'}</option>`).join('');
    const rear = cams.find(c => /back|rear|environment/i.test(c.label||''))?.deviceId;
    sel.value = selectedId || rear || cams[0]?.deviceId || '';
  }
  async function toggleTorch(){
    if(!_track) return;
    const caps = _track.getCapabilities?.();   // Chrome/Android
    if(!caps || !caps.torch) return notify({title:'อุปกรณ์ไม่รองรับไฟฉาย', level:'warn'});
    const now = _track.getSettings?.().torch;
    try{ await _track.applyConstraints({ advanced: [{ torch: !now }] }); }
    catch{ notify({title:'เปิดไฟฉายไม่สำเร็จ', level:'warn'}); }
  }

  // --- วนอ่านภาพและถอดรหัส ---
  function startLoop(){
    const video = document.getElementById('qrVideo');
    _canvas = _canvas || document.createElement('canvas');
    _ctx = _ctx || _canvas.getContext('2d', { willReadFrequently:true });

    const tick = async ()=>{
      if(!video || video.readyState < 2){ _raf = requestAnimationFrame(tick); return; }

      const vw = video.videoWidth, vh = video.videoHeight;
      _canvas.width = vw; _canvas.height = vh;

      let text = '';
      try{
        if(_useDetector && _detector){
          // BarcodeDetector — เร็วและแม่น
          const codes = await _detector.detect(video);
          if(codes && codes.length) text = codes[0].rawValue || codes[0].raw || '';
        }else if(window.jsQR){
          // jsQR — วาดลงแคนวาสแล้วถอด
          _ctx.drawImage(video, 0, 0, vw, vh);
          const id = _ctx.getImageData(0, 0, vw, vh);
          const code = window.jsQR(id.data, id.width, id.height, { inversionAttempts:'attemptBoth' });
          if(code && code.data) text = code.data;
        }
      }catch(_){ /* ignore frame errors */ }

      if(text){
        onDecoded(text);
        return; // ปิด loop เมื่อเจอผลลัพธ์
      }
      _raf = requestAnimationFrame(tick);
    };
    _raf = requestAnimationFrame(tick);
  }

  // --- สแกนจากไฟล์ภาพ ---
  async function scanFromImageFile(file){
    // ใช้ BarcodeDetector กับ ImageBitmap ได้โดยตรง
    if(_useDetector && _detector){
      try{
        const bmp = await createImageBitmap(file);
        const codes = await _detector.detect(bmp);
        if(codes && codes.length){ onDecoded(codes[0].rawValue || ''); return; }
      }catch(_){}
    }
    // fallback -> jsQR
    const ok = await ensureJsQR();
    if(!ok){ notify({title:'สแกนจากรูปไม่ได้', level:'danger'}); return; }
    const img = new Image();
    img.onload = ()=>{
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', {willReadFrequently:true});
      x.drawImage(img,0,0);
      const id = x.getImageData(0,0,c.width,c.height);
      const code = window.jsQR(id.data, id.width, id.height, { inversionAttempts:'attemptBoth' });
      if(code && code.data) onDecoded(code.data);
      else notify({title:'ไม่พบ QR ในรูป', level:'warn'});
    };
    img.onerror = ()=> notify({title:'เปิดรูปไม่สำเร็จ', level:'danger'});
    img.src = URL.createObjectURL(file);
  }

  // --- แปลงข้อความ QR -> PartID ---
  function parseQrPayload(s){
    s = String(s||'').trim();
    // รูปแบบมาตรฐานของแอป:  MPR:<PartID>|<Model>
    const m = /^MPR:([^|]+)(?:\|.*)?$/i.exec(s);
    if(m) return (m[1]||'').trim();
    // เผื่อสแกนเป็นแค่รหัส
    return s;
  }

  // --- เมื่อถอดรหัสได้ ---
  async function onDecoded(text){
    try{ navigator.vibrate?.(20); }catch{}
    const partId = parseQrPayload(text);
    if(!partId){
      notify({title:'QR ไม่ถูกต้อง', level:'warn'}); return;
    }

    // หาอะไหล่ใน state ก่อน
    let part = (state.parts||[]).find(p=> String(p.PartID).trim()===partId);
    // ถ้าไม่เจอและโหมด API -> ลองรีเฟรชด่วน
    if(!part && state.mode==='api'){
      try{ await refreshAllFromApi(); part = (state.parts||[]).find(p=> String(p.PartID).trim()===partId); }catch{}
    }

    if(!part){
      notify({title:'ไม่พบรหัสในสต็อก', message:`${partId}`, level:'danger'});
      return; // ให้ผู้ใช้สแกนใหม่ต่อได้ (ไม่ปิด modal)
    }

    // พบแล้ว -> เปิด modal เบิก พร้อม preset จำนวน 1
    closeQrScanner();
    openIssueModal(part, 1);
  }

})();

/* =========================================================
   ปุ่ม: พิมพ์ QR ทั้งหมด (หน้า 'ส่งออก')
   - ใช้ openPrintableQrSheet(parts) ที่มีอยู่แล้ว
   - ครอบคลุมทั้งโหมด demo / api (ดึงจาก state.parts)
   ========================================================= */
(function injectPrintAllQrAllParts(){
  // หาตำแหน่งเดียวกับปุ่ม "แผ่นพิมพ์ QR" เดิม
  const host = document.querySelector('#page-export .row:last-child');
  if(!host || host.querySelector('#btnPrintAllQr')) return;

  const bAll = document.createElement('button');
  bAll.id = 'btnPrintAllQr';
  bAll.textContent = 'พิมพ์ QR ทั้งหมด';
  bAll.style.marginLeft = '8px';
  host.appendChild(bAll);

  bAll.addEventListener('click', async ()=>{
    // ถ้าเป็นโหมด API อาจอยากรีเฟรชก่อน (เผื่อมีรายการใหม่)
    try{
      if(state.mode === 'api' && typeof refreshAllFromApi === 'function'){
        await refreshAllFromApi();
      }
    }catch{}

    const parts = (state.parts || [])
      .slice()
      .sort((a,b)=> String(a.PartID||'').localeCompare(String(b.PartID||'')));

    if(parts.length === 0){
      return notify({ title:'ไม่มีรายการ', message:'ยังไม่มีอะไหล่ในระบบ', level:'warn' });
    }

    // ถ้าจำนวนเยอะ เตือนให้ผู้ใช้ทราบก่อน (แต่ยังไปต่อได้)
    if(parts.length > 150){
      const ok = confirm(`มีทั้งหมด ${parts.length} รายการ • การสร้าง QR อาจใช้เวลาเล็กน้อย\nต้องการดำเนินการต่อหรือไม่?`);
      if(!ok) return;
    }

    notify({ title:'กำลังเตรียม QR', message:`รวม ${parts.length} รายการ` });
    try{
      await openPrintableQrSheet(parts); // ใช้ฟังก์ชันเดิมที่สร้างหน้า A4 และมีปุ่มพิมพ์ให้
    }catch(err){
      notify({ title:'สร้างแผ่นพิมพ์ไม่สำเร็จ', message: err?.message || '', level:'danger' });
    }
  });
})();

/* ===== Init ===== */
loadAll();
initBottomNav();
updateAuthUI();

