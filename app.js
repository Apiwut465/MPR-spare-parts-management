// app.js
/* ===== App Config (hard-coded) ===== */
const CONFIG = {
  MODE: 'api', // 'api' | 'demo'
  API_URL: '',
  DRIVE_FOLDER_ID: ''
};

/* ============ I18N ============ */
const I18N = {
  th: {
    // Buttons
    'btn.sync':'ซิงก์','btn.login':'เข้าสู่ระบบ','btn.logout':'ออกจากระบบ','btn.clear':'ล้าง',
    'btn.clearImage':'ลบรูป','btn.receiveSave':'บันทึกรับเข้า','btn.cancel':'ยกเลิก','btn.confirmIssue':'ยืนยันเบิก',
    'btn.save':'บันทึก','btn.setAdminPass':'ตั้งรหัสผ่านใหม่','btn.exportCsv':'ดาวน์โหลดไฟล์ CSV',

    // Nav
    'nav.dashboard':'แดชบอร์ด','nav.stock':'สต็อก','nav.receive':'รับเข้า','nav.search':'ค้นหา/เบิก',
    'nav.history':'ประวัติ','nav.export':'ส่งออก','nav.settings':'ตั้งค่า',

    // KPI/Units
    'kpi.partsLeft':'📦 อะไหล่คงเหลือ','kpi.nearOut':'⚠️ ใกล้หมด','kpi.outOfStock':'🚨 ขาดสต็อก',
    'unit.piece':'ชิ้น','unit.item':'รายการ',

    // Dashboard
    'dash.alertTitle':'อะไหล่ใกล้/หมดสต็อก',
    'legend.red':'จุดแดง = หมด','legend.orange':'จุดส้ม = ใกล้หมด',
    'dash.none':'ยังไม่มีรายการที่ต้องรีสต็อก',
    'dash.top5':'Top 5 อะไหล่ที่เบิกบ่อย','dash.loading':'กำลังโหลดสถิติ...',
    'dash.noTxns':'ยังไม่มีการเบิกในช่วงเวลานี้',

    // Days
    'days.30':'30 วัน','days.90':'90 วัน','days.180':'180 วัน',

    // Stock
    'stock.title':'สต็อกทั้งหมด',
    'col.code':'รหัส','col.name':'ชื่อ','col.category':'หมวด','col.brandModel':'ยี่ห้อ/โมเดล','col.qty':'คงเหลือ',
    'col.location':'ที่เก็บ','col.actions':'จัดการ','col.datetime':'วัน-เวลา','col.type':'ประเภท','col.model':'โมเดล','col.by':'ผู้ดำเนินการ',

    // Receive & forms
    'receive.title':'เพิ่มของเข้าสต็อก',
    'receive.note':'* ถ้ารหัสมีอยู่แล้ว ระบบจะอัปเดตรายการและเพิ่มจำนวนให้',
    'form.code':'รหัส','form.codeLong':'รหัส (Code)','form.name':'ชื่อ','form.model':'โมเดล','form.brand':'ยี่ห้อ','form.qty':'จำนวน','form.min':'ขั้นต่ำ',
    'form.qtyLong':'คงเหลือ (Qty)','form.minLong':'ขั้นต่ำ (Min)',
    'form.location':'ชั้นที่เก็บ','form.category':'หมวดหมู่','form.image':'แนบรูป (ไฟล์ภาพ)','form.imageUrl':'รูป (URL)',

    // Search filters
    'filter.status':'สถานะ','filter.category':'หมวดหมู่',
    'status.all':'ทั้งหมด','status.below':'ต่ำกว่า Min','status.near':'ใกล้หมด','status.out':'หมด','status.ok':'ปกติ',

    // History/Export/Settings
    'history.title':'ประวัติการทำรายการ','history.month':'เดือน','history.year':'ปี','history.type':'ประเภท',
    'type.all':'ทั้งหมด','type.in':'รับเข้า','type.out':'เบิกออก',
    'export.title':'ส่งออกประวัติเป็น CSV','export.note':'ไฟล์เข้ารหัส UTF-8 (มี BOM) รองรับภาษาไทย เปิดได้ทั้ง Excel และ Google Sheets',
    'settings.title':'ตั้งรหัสผ่านผู้ดูแลระบบ','settings.conn':'การเชื่อมต่อ','settings.note':'* ค่า API และโฟลเดอร์ Drive ถูกกำหนดไว้ในโค้ดแล้ว — ไม่ต้องตั้งจากหน้าเว็บ',

    // Modals
    'modal.issue.title':'เบิกอะไหล่','modal.issue.qty':'จำนวนที่เบิก *','modal.issue.by':'ชื่อผู้เบิก *','modal.issue.machine':'เครื่องจักร','modal.issue.dept':'แผนก','modal.issue.note':'หมายเหตุ',
    'modal.edit.title':'แก้ไขอะไหล่',
    'modal.login.title':'เข้าสู่ระบบ','modal.login.selectRole':'เลือกประเภทผู้ใช้งาน','modal.login.password':'รหัสผ่าน',
    'role.guest':'พนักงาน (ไม่ต้องใช้รหัส)','role.admin':'แอดมิน',

    // Placeholders
    'ph.stock.search':'ค้นหา: รหัส/ชื่อ/หมวด/ยี่ห้อ/โมเดล',
    'ph.code':'เช่น P-0001','ph.partName':'ชื่ออะไหล่','ph.model':'เช่น E2E','ph.brand':'เช่น OMRON',
    'ph.location':'เช่น ชั้น A2 กล่อง 05','ph.category':'เช่น Bearing / Sensor / Belt',
    'ph.search':'ค้นหา: รหัส/ชื่อ/หมวดหมู่/ยี่ห้อ/โมเดล','ph.filterCat':'เช่น Bearing',
    'ph.history.search':'ค้นหา: รหัส/ชื่อ/ผู้ดำเนินการ/หมายเหตุ',
    'ph.newPass':'รหัสผ่านใหม่','ph.password':'รหัสผ่าน',
    'ph.requestBy':'ผู้เบิก','ph.machine':'เครื่องจักร','ph.dept':'แผนก','ph.note':'เพิ่มเติม (ถ้ามี)',

    // Months
    'month.1':'ม.ค.','month.2':'ก.พ.','month.3':'มี.ค.','month.4':'เม.ย.','month.5':'พ.ค.','month.6':'มิ.ย.',
    'month.7':'ก.ค.','month.8':'ส.ค.','month.9':'ก.ย.','month.10':'ต.ค.','month.11':'พ.ย.','month.12':'ธ.ค.',

    // Status label (badge)
    'badge.in':'รับเข้า','badge.out':'เบิกออก',
    'st.below':'ต่ำกว่า Min','st.near':'ใกล้หมด','st.out':'หมด','st.ok':'ปกติ',

    // Notifications
    'noti.offline':'สลับเป็นโหมดออฟไลน์',
    'noti.apiFail':'เชื่อมต่อ API ไม่สำเร็จ',
    'noti.noItems':'ไม่พบรายการ',
    'noti.outOfStock':'หมดสต็อก','noti.cannotIssue':'ไม่สามารถเบิกอะไหล่ที่หมดได้',
    'noti.fillQty':'กรอกจำนวน','noti.fillQtyMsg':'โปรดกรอกจำนวนที่เบิกให้ถูกต้อง',
    'noti.notEnough':'คงเหลือไม่พอ','noti.onlyLeft':'คงเหลือในคลังมีเพียง {n} ชิ้น',
    'noti.emptyBy':'ชื่อผู้เบิกว่าง','noti.emptyByMsg':'กรอกชื่อผู้เบิกก่อนยืนยัน',
    'noti.issued':'เบิกสำเร็จ','noti.synced':'ซิงก์แล้ว','noti.syncedMsg':'รีเฟรชข้อมูลจากที่จัดเก็บ',
    'noti.demoSaved':'บันทึกสำเร็จ (Demo)','noti.readImgFail':'อ่านรูปไม่สำเร็จ','noti.tryAgain':'กรุณาลองใหม่',
    'noti.dupTitle':'ซ้ำ!','noti.dupMsg':'รหัสนี้มีอยู่แล้ว',
    'noti.saved':'บันทึกแล้ว','noti.deleted':'ลบแล้ว',
    'noti.incomplete':'ข้อมูลไม่ครบ','noti.exported':'ส่งออกแล้ว','noti.exportedMsg':'เดือน {m}/{y} จำนวน {n} รายการ',
    'noti.apiNotReady':'โหมด API ยังไม่พร้อม','noti.loginOk':'เข้าสู่ระบบแล้ว','noti.adminMode':'โหมดผู้ดูแลระบบ','noti.guestMode':'โหมดพนักงาน',
    'noti.loggedOut':'ออกจากระบบแล้ว',
    'noti.error':'ผิดพลาด','noti.noIssueTarget':'ไม่พบรายการที่จะเบิก','noti.issueFail':'เบิกล้มเหลว','noti.receiveFail':'รับเข้าล้มเหลว',
    'noti.noPerm':'สิทธิ์ไม่พอ','noti.needAdmin':'ต้องเป็นผู้ดูแลระบบ','noti.deleteFail':'ลบไม่สำเร็จ','noti.genericErr':'เกิดข้อผิดพลาด',

    // Others
    'confirm.delete':'ลบอะไหล่ {id} — {name}?',
    'unit.pc':'ชิ้น'
  },
  zh: {
    // Buttons
    'btn.sync':'同步','btn.login':'登录','btn.logout':'登出','btn.clear':'清除',
    'btn.clearImage':'清除图片','btn.receiveSave':'保存入库','btn.cancel':'取消','btn.confirmIssue':'确认领取',
    'btn.save':'保存','btn.setAdminPass':'设置新密码','btn.exportCsv':'下载 CSV 文件',

    // Nav
    'nav.dashboard':'仪表盘','nav.stock':'库存','nav.receive':'入库','nav.search':'搜索/领取',
    'nav.history':'历史','nav.export':'导出','nav.settings':'设置',

    // KPI/Units
    'kpi.partsLeft':'📦 零件库存总数','kpi.nearOut':'⚠️ 即将耗尽','kpi.outOfStock':'🚨 缺货',
    'unit.piece':'件','unit.item':'项',

    // Dashboard
    'dash.alertTitle':'即将耗尽 / 缺货的零件',
    'legend.red':'红点 = 缺货','legend.orange':'橙点 = 即将耗尽',
    'dash.none':'暂无需要补货的项目',
    'dash.top5':'Top 5 领取最频繁的零件','dash.loading':'正在加载统计…',
    'dash.noTxns':'此时间范围内暂无领取记录',

    // Days
    'days.30':'30 天','days.90':'90 天','days.180':'180 天',

    // Stock
    'stock.title':'全部库存',
    'col.code':'编号','col.name':'名称','col.category':'分类','col.brandModel':'品牌/型号','col.qty':'库存',
    'col.location':'库位','col.actions':'操作','col.datetime':'日期时间','col.type':'类型','col.model':'型号','col.by':'操作人',

    // Receive & forms
    'receive.title':'入库',
    'receive.note':'* 如编号已存在，系统将更新并累加数量',
    'form.code':'编号','form.codeLong':'编号 (Code)','form.name':'名称','form.model':'型号','form.brand':'品牌','form.qty':'数量','form.min':'最小值',
    'form.qtyLong':'库存 (Qty)','form.minLong':'最小值 (Min)',
    'form.location':'库位','form.category':'分类','form.image':'上传图片','form.imageUrl':'图片 (URL)',

    // Search filters
    'filter.status':'状态','filter.category':'分类',
    'status.all':'全部','status.below':'低于 Min','status.near':'即将耗尽','status.out':'缺货','status.ok':'正常',

    // History/Export/Settings
    'history.title':'操作历史','history.month':'月份','history.year':'年份','history.type':'类型',
    'type.all':'全部','type.in':'入库','type.out':'出库',
    'export.title':'导出历史为 CSV','export.note':'UTF-8（含 BOM）编码，支持在 Excel/Google 表格中打开',
    'settings.title':'设置管理员密码','settings.conn':'连接','settings.note':'* API 与 Drive 目录已在代码中设定，无需在此设置',

    // Modals
    'modal.issue.title':'领取零件','modal.issue.qty':'领取数量 *','modal.issue.by':'领取人 *','modal.issue.machine':'机器','modal.issue.dept':'部门','modal.issue.note':'备注',
    'modal.edit.title':'编辑零件',
    'modal.login.title':'登录','modal.login.selectRole':'选择用户类型','modal.login.password':'密码',
    'role.guest':'员工（无需密码）','role.admin':'管理员',

    // Placeholders
    'ph.stock.search':'搜索：编号/名称/分类/品牌/型号',
    'ph.code':'如 P-0001','ph.partName':'零件名称','ph.model':'如 E2E','ph.brand':'如 OMRON',
    'ph.location':'如 A2 层 05 号箱','ph.category':'如 Bearing / Sensor / Belt',
    'ph.search':'搜索：编号/名称/分类/品牌/型号','ph.filterCat':'如 Bearing',
    'ph.history.search':'搜索：编号/名称/操作人/备注',
    'ph.newPass':'新密码','ph.password':'密码',
    'ph.requestBy':'领取人','ph.machine':'机器','ph.dept':'部门','ph.note':'补充（如有）',

    // Months
    'month.1':'一月','month.2':'二月','month.3':'三月','month.4':'四月','month.5':'五月','month.6':'六月',
    'month.7':'七月','month.8':'八月','month.9':'九月','month.10':'十月','month.11':'十一月','month.12':'十二月',

    // Status label (badge)
    'badge.in':'入库','badge.out':'出库',
    'st.below':'低于 Min','st.near':'即将耗尽','st.out':'缺货','st.ok':'正常',

    // Notifications
    'noti.offline':'已切换为离线模式',
    'noti.apiFail':'API 连接失败',
    'noti.noItems':'未找到项目',
    'noti.outOfStock':'缺货','noti.cannotIssue':'无法领取缺货的零件',
    'noti.fillQty':'请输入数量','noti.fillQtyMsg':'请输入正确的数量',
    'noti.notEnough':'库存不足','noti.onlyLeft':'库存仅剩 {n} 件',
    'noti.emptyBy':'请输入领取人','noti.emptyByMsg':'请先填写领取人',
    'noti.issued':'领取成功','noti.synced':'已同步','noti.syncedMsg':'已刷新数据',
    'noti.demoSaved':'保存成功（演示）','noti.readImgFail':'读取图片失败','noti.tryAgain':'请重试',
    'noti.dupTitle':'重复！','noti.dupMsg':'该编号已存在',
    'noti.saved':'已保存','noti.deleted':'已删除',
    'noti.incomplete':'信息不完整','noti.exported':'已导出','noti.exportedMsg':'月份 {m}/{y} 共 {n} 条',
    'noti.apiNotReady':'API 模式尚未就绪','noti.loginOk':'已登录','noti.adminMode':'管理员模式','noti.guestMode':'员工模式',
    'noti.loggedOut':'已登出',
    'noti.error':'错误','noti.noIssueTarget':'未找到要领取的项目','noti.issueFail':'领取失败','noti.receiveFail':'入库失败',
    'noti.noPerm':'权限不足','noti.needAdmin':'需要管理员权限','noti.deleteFail':'删除失败','noti.genericErr':'发生错误',

    'confirm.delete':'删除零件 {id} — {name}？',
    'unit.pc':'件'
  }
};

const i18n = {
  lang: (localStorage.getItem('stockapp_lang') || 'th'),
  t(key, params={}){
    const dict = I18N[this.lang] || I18N.th;
    const base = dict[key] ?? I18N.th[key] ?? key;
    return base.replace(/\{(\w+)\}/g, (_,k)=> params[k] ?? '');
  },
  locale(){ return this.lang === 'th' ? 'th-TH' : 'zh-CN'; },
  apply(){
    // text nodes
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      el.textContent = i18n.t(el.getAttribute('data-i18n'));
    });
    // placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      el.setAttribute('placeholder', i18n.t(el.getAttribute('data-i18n-placeholder')));
    });
    // set html lang
    document.documentElement.lang = (this.lang === 'th' ? 'th' : 'zh');
    // language button label
    const b = document.getElementById('btnLang');
    if(b) b.textContent = (this.lang === 'th' ? '中文' : 'TH');
  },
  toggle(){
    this.lang = (this.lang === 'th' ? 'zh' : 'th');
    localStorage.setItem('stockapp_lang', this.lang);
    this.apply();
    // re-render views so dynamic texts use current language
    renderDashboard(); renderStock(); renderGallery(); renderHistory();
    applyRoleToNav(); // update nav labels highlight positions unchanged
  }
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
const state = { mode: CONFIG.MODE, apiUrl: CONFIG.API_URL, parts:[], txns:[], categories:[], machines:[], depts:[] };

/* ===== Status utils (return code) ===== */
function statusOf(p){
  if(p.Qty==null || p.Min==null) return 'ok';
  const q = Number(p.Qty||0), m = Number(p.Min||0);
  if(q===0) return 'out';
  if(q < m) return 'below';
  if(q <= m+2) return 'near';
  return 'ok';
}
const statusBadgeClass = s => (s==='out'?'red':s==='near'||s==='below'?'orange':'green');
const statusLabel = s => i18n.t('st.'+s);
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
      notify({title:i18n.t('noti.offline'), message: i18n.t('noti.apiFail') + ' • ' + i18n.t('noti.syncedMsg') , level:'warn'});
    }
  };

  if(state.mode === 'api'){
    try{
      await refreshAllFromApi();
      renderDatalists(); renderDashboard();
    }catch(err){
      fallbackToDemo(err?.message || i18n.t('noti.apiFail'));
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
  const dd = $('#dlDepts'); if(dd){ dd.innerHTML=''; state.depts.forEach(d=>{ const o=document.createElement('option'); o.value=d; dd.appendChild(o); });}
}

/* --- Dashboard --- */
function renderDashboard(){
  $('#k_sumQty').textContent = sumQty(state.parts).toLocaleString(i18n.locale());
  const nearOrBelow = state.parts.filter(p=>['near','below'].includes(statusOf(p))).length;
  const outStock    = state.parts.filter(p=>statusOf(p)==='out').length;
  $('#k_near').textContent = nearOrBelow.toLocaleString(i18n.locale());
  $('#k_out').textContent  = outStock.toLocaleString(i18n.locale());

  const wrap = $('#dashAlerts'); wrap.innerHTML='';
  const alerts = state.parts
    .map(p=>({p,st:statusOf(p)}))
    .filter(x=> x.st==='out' || x.st==='near' || x.st==='below')
    .sort((a,b)=> Number(a.p.Qty||0) - Number(b.p.Qty||0));
  if(alerts.length===0){ wrap.innerHTML=`<div class="meta">${i18n.t('dash.none')}</div>`; }
  else{
    alerts.forEach(({p,st})=>{
      const it = document.createElement('div'); 
      it.className='alert-item ' + (st==='out'?'bar-red':'bar-orange');

      const body = document.createElement('div'); body.style.flex='1';
      const title = document.createElement('div'); title.className='alert-title '+(st==='out'?'t-red':'t-orange'); title.textContent = `${p.PartID} — ${p.Name}`;
      const meta  = document.createElement('div'); meta.className='alert-meta'; 
      meta.textContent = `${i18n.t('col.qty')} ${p.Qty??0} • Min ${p.Min??0} • ${p.Category||'-'} • ${p.Location||'-'}`;
      body.appendChild(title); body.appendChild(meta); it.appendChild(body); wrap.appendChild(it);
    });
  }

  const days = Number(document.getElementById('topDays')?.value || 30);
  renderTopIssued(days);
}

// === Top 5 อะไหล่ที่เบิกบ่อย (days=30/90/180) ===
async function renderTopIssued(days = 30){
  const wrap = document.getElementById('dashTop5');
  if(!wrap) return;
  wrap.innerHTML = `<div class="meta">${i18n.t('dash.loading')}</div>`;

  const now = new Date();
  const start = new Date(now.getTime() - days*24*60*60*1000);

  let txns = [];
  try{
    if(state.mode === 'api' && window.apiGet){
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
    wrap.innerHTML = `<div class="meta">${i18n.t('dash.noTxns')}</div>`;
    return;
  }

  const partById = new Map(state.parts.map(p=>[p.PartID, p]));
  const arr = Array.from(qtyById.entries())
    .map(([id,total])=>({ id,total, name: partById.get(id)?.Name  || id, brand:partById.get(id)?.Brand || '', model:partById.get(id)?.Model || '' }))
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
      <div class="top5-qty">${x.total.toLocaleString(i18n.locale())} ${i18n.t('unit.piece')}</div>
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
  if(items.length===0){ wrap.innerHTML=`<div class="meta" style="padding:8px 16px">${i18n.t('noti.noItems')}</div>`; return; }

  items.forEach(p=>{
    const card = document.createElement('div'); card.className='gcard';

    const img = document.createElement('img');
    img.className='gimg'; img.src=p.ImageURL||''; img.alt=p.Name||p.PartID||''; card.appendChild(img);

    const box = document.createElement('div'); box.className='gbox';
    const title = document.createElement('div'); title.className='name'; title.textContent = `${p.PartID} — ${p.Name}`;
    const sub   = document.createElement('div'); sub.className='meta'; sub.textContent = `${p.Brand||'-'} ${p.Model||''}`;
    const meta  = document.createElement('div'); meta.className='gmeta';
    const st = statusOf(p);
    meta.innerHTML = `<span>${p.Category||'-'}</span><span>${i18n.t('col.qty')} ${p.Qty??0}</span><span>Min ${p.Min??0}</span><span>${p.Location||'-'}</span><span class="badge ${statusBadgeClass(st)}">${statusLabel(st)||'-'}</span>`;
    box.appendChild(title); box.appendChild(sub); box.appendChild(meta); card.appendChild(box);

    const act = document.createElement('div'); act.className='gactions';
    const qty = document.createElement('input');
    const remain = Number(p.Qty||0);
    const isOut = remain <= 0;

    qty.type='number';
    qty.placeholder = isOut ? i18n.t('noti.outOfStock') : i18n.t('form.qty');
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
    btn.textContent=i18n.t('type.out'); // "เบิก"/"出库" as action label
    btn.disabled = isOut;
    btn.title = isOut ? i18n.t('noti.outOfStock') : '';

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
    notify({ title:i18n.t('noti.outOfStock'), message:`${part.PartID} — ${part.Name} ${i18n.t('noti.cannotIssue')}`, level:'danger' });
    return;
  }

  currentPart = part;
  $('#m_img').src = part.ImageURL || '';
  $('#m_title').textContent = `${part.PartID} — ${part.Name}`;
  $('#m_meta').textContent  = `${part.Category||'-'} • ${i18n.t('col.qty')} ${part.Qty??0} • Min ${part.Min??0} • ${part.Location||'-'}`;
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

  if(!qty || qty<=0) return notify({title:i18n.t('noti.fillQty'), message:i18n.t('noti.fillQtyMsg'), level:'warn'});
  if(remainQty <= 0)  return notify({title:i18n.t('noti.outOfStock'), message:i18n.t('noti.cannotIssue'), level:'danger'});
  if(qty > remainQty) return notify({title:i18n.t('noti.notEnough'), message:i18n.t('noti.onlyLeft',{n:remainQty}), level:'danger'});
  if(!by) return notify({title:i18n.t('noti.emptyBy'), message:i18n.t('noti.emptyByMsg'), level:'warn'});

  if(machine && !state.machines.includes(machine)) state.machines.push(machine);
  if(dept && !state.depts.includes(dept)) state.depts.push(dept);

  const txn = {TxnID:'T-'+Date.now(), Date:new Date().toISOString(), PartID:currentPart.PartID, Type:'เบิก', Qty:qty, By:by, Ref:`M:${machine||'-'} D:${dept||'-'} ${note?'- '+note:''}`};

  if(state.mode==='api'){
    notify({title:i18n.t('noti.apiNotReady'), message:i18n.t('noti.tryAgain'), level:'danger'});
  }else{
    currentPart.Qty = Math.max(0, Number(currentPart.Qty||0) - qty);
    state.txns.push(txn);
    saveDemo();
    notify({title:i18n.t('noti.issued'), message:`${currentPart.PartID} ${i18n.t('form.qty')} ${qty}`});
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
    tbody.innerHTML = `<tr><td colspan="8" class="meta" style="padding:16px">${i18n.t('noti.noItems')}</td></tr>`;
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
          <button class="btn-xs" data-edit="${p.PartID}">${i18n.t('btn.save').replace(i18n.t('btn.save'),'แก้ไข'=== 'แก้ไข' ? (i18n.lang==='th'?'แก้ไข':'编辑') : '')}</button>
          <button class="btn-xs btn-danger" data-del="${p.PartID}">${i18n.lang==='th'?'ลบ':'删除'}</button>
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
    return notify({title:i18n.t('noti.dupTitle'), message:i18n.t('noti.dupMsg'), level:'danger'});
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
  notify({title:i18n.t('noti.saved'), message:newCode});
  closeEdit();
});

function deletePart(partId){
  const p = state.parts.find(x=>x.PartID===partId); if(!p) return;
  if(!confirm(i18n.t('confirm.delete',{id:p.PartID,name:p.Name||''}))) return;
  state.parts = state.parts.filter(x=>x.PartID!==partId);
  saveDemo(); renderStock(); renderDashboard(); renderDatalists();
  notify({title:i18n.t('noti.deleted'), message:partId});
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

  if(!code || !qty || qty<=0) return notify({title:i18n.t('noti.incomplete'), message:i18n.t('noti.fillQtyMsg'), level:'warn'});

  let imageURL = '';
  if(file){ try{ imageURL = await readFileAsDataURL(file); }catch{ notify({title:i18n.t('noti.readImgFail'), message:i18n.t('noti.tryAgain'), level:'warn'}); } }

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
  notify({title:i18n.t('noti.demoSaved'), message:`${i18n.t('type.in')} ${code} ${i18n.t('form.qty')} ${qty}`});

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
$('#rc_clearImg')?.addEventListener('click', ()=>{ $('#rc_img').value=''; const pv=$('#rc_preview'); if(pv){ pv.removeAttribute('src'); }});

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
    tbody.innerHTML = `<tr><td colspan="7" class="meta" style="padding:16px">${i18n.t('dash.noTxns')}</td></tr>`;
    return;
  }

  rows.forEach(t=>{
    const tr = document.createElement('tr');
    const timeStr = new Date(t.Date).toLocaleString(i18n.locale(), {hour12:false});
    const badge = t.Type==='รับ' ? `<span class="badge in">${i18n.t('badge.in')}</span>` : `<span class="badge out">${i18n.t('badge.out')}</span>`;
    const model = modelById.get(t.PartID) || '';
    tr.innerHTML = `
      <td>${timeStr}</td>
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

  const header = [i18n.t('col.datetime'),i18n.t('col.code'),i18n.t('col.name'),i18n.t('col.type'),i18n.t('col.model'),i18n.t('col.qty'),i18n.t('col.by')];

  const body = rows.map(r=>{
    const timeStr = new Date(r.Date).toLocaleString(i18n.locale(), {hour12:false});
    const rec = [ timeStr, r.PartID||'', nameById.get(r.PartID)||'', r.Type||'', modelById.get(r.PartID)||'', r.Qty??0, r.By||'' ];
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

  notify({title:i18n.t('noti.exported'), message:i18n.t('noti.exportedMsg',{m,y,n:rows.length})});
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

/* ===== Bottom nav (เดิม) ===== */
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
$('#btnSync')?.addEventListener('click', ()=>{ loadAll(); notify({title:i18n.t('noti.synced'), message:i18n.t('noti.syncedMsg')}); });
$('#btnClear')?.addEventListener('click', ()=>{ $('#q').value=''; renderGallery(); });
$('#q')?.addEventListener('input', renderGallery);
$('#fltStatus')?.addEventListener('change', renderGallery);
$('#fltCat')?.addEventListener('input', renderGallery);
$('#stockQ')?.addEventListener('input', renderStock);
document.getElementById('topDays')?.addEventListener('change', (e)=>{ renderTopIssued(Number(e.target.value||30)); });

// Language toggle
document.getElementById('btnLang')?.addEventListener('click', ()=> i18n.toggle());

// ===== Quick nav helper =====
function goDashboard(){
  const btn = document.querySelector('.bottom-nav .nav-btn[data-tab="dashboard"]');
  if (btn) { btn.click(); }
  else { switchTab('dashboard'); try{ localStorage.setItem('stockapp_last_tab','dashboard'); }catch{} }
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
function showLoginModal(){ document.body.classList.add('modal-open'); $('#loginModal')?.classList.add('show'); $('#loginModal')?.setAttribute('aria-hidden','false'); }
function closeLoginModal(){ $('#loginModal')?.classList.remove('show'); $('#loginModal')?.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); }

$('#btnLoginOpen')?.addEventListener('click', showLoginModal);
$('#loginModal [data-close]')?.addEventListener('click', closeLoginModal);
$('#loginRole')?.addEventListener('change', e=>{ $('#adminPassRow').style.display = e.target.value === 'admin' ? '' : 'none'; });

$('#btnLogin')?.addEventListener('click', ()=>{
  const role = $('#loginRole').value;
  const pass = $('#loginPassword').value;
  const savedPass = localStorage.getItem('stockapp_admin_pass') || '1234';

  if(role==='admin' && pass !== savedPass){
    notify({title:i18n.t('noti.error'), message:i18n.t('noti.tryAgain'), level:'danger'}); 
    return;
  }
  userRole = role;
  localStorage.setItem('stockapp_last_role', userRole);
  notify({title:i18n.t('noti.loginOk'), message: role==='admin' ? i18n.t('noti.adminMode') : i18n.t('noti.guestMode')});
  closeLoginModal();
  updateAuthUI();
  switchTab('dashboard');
});

$('#btnLogout')?.addEventListener('click', ()=>{
  userRole = 'guest';
  localStorage.setItem('stockapp_last_role', userRole);
  notify({title:i18n.t('noti.loggedOut')});
  updateAuthUI();
  switchTab('dashboard');
});

/* ==========================================================
   🔌 Stock App — Supabase Adapter (เดิม) 
   (ส่วนนี้คงไว้ แก้เฉพาะข้อความแจ้งเตือนบางจุดให้ใช้ i18n)
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
    const { error:upErr } = await supa.storage.from('parts').upload(path, blob, { upsert:true, contentType: blob.type });
    if(upErr) throw upErr;
    const { data } = supa.storage.from('parts').getPublicUrl(path);
    return data.publicUrl;
  }

  // apiGet
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

  // apiPost (เดิม)
  window.apiPost = async (op, payload={})=>{
    if(op === 'issue'){
      const { partId, qty, by, machine, dept, note } = payload;
      const { data, error } = await supa.rpc('issue_part', { part_id: partId, qty, by_name: by||'', machine: machine||'', dept: dept||'', note: note||'' });
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

  // refresh
  window.refreshAllFromApi = async ()=>{
    const [parts, lists] = await Promise.all([ window.apiGet('parts'), window.apiGet('lists') ]);
    state.parts = parts;
    state.categories = lists.categories || [];
    state.machines  = lists.machines   || [];
    state.depts     = lists.depts      || [];
  };

  // Quick Issue (API)
  let _issuingBusy = false;
  window.doQuickIssue_API = async function(){
    if (_issuingBusy) return;
    if (!currentPart) {
      notify({ title:i18n.t('noti.error'), message:i18n.t('noti.noIssueTarget'), level:'danger' });
      return;
    }

    const qty     = Number($('#m_qty').value || 0);
    const by      = $('#m_by').value.trim();
    const machine = $('#m_machine').value.trim();
    const dept    = $('#m_dept').value.trim();
    const note    = $('#m_note').value.trim();

    if (!qty || qty <= 0) return notify({title:i18n.t('noti.fillQty'), message:i18n.t('noti.fillQtyMsg'), level:'warn'});
    if (!by)            return notify({title:i18n.t('noti.emptyBy'), message:i18n.t('noti.emptyByMsg'), level:'warn'});

    const remain = Number(currentPart.Qty || 0);
    if (remain <= 0)  return notify({title:i18n.t('noti.outOfStock'), message:i18n.t('noti.cannotIssue'), level:'danger'});
    if (qty > remain) return notify({title:i18n.t('noti.notEnough'), message:i18n.t('noti.onlyLeft',{n:remain}), level:'danger'});

    _issuingBusy = true;

    // Optimistic UI
    const { i, before } = patchPartQty(currentPart.PartID, -qty);
    renderDashboard(); renderGallery(); renderDatalists();

    try{
      const data = await window.apiPost('issue', { partId: currentPart.PartID, qty, by, machine, dept, note });
      if (data?.part && i >= 0) state.parts[i] = data.part;

      notify({title:i18n.t('noti.issued'), message:`${currentPart.PartID} ${i18n.t('form.qty')} ${qty}`});

      try { await refreshAllFromApi(); renderDashboard(); renderGallery(); renderDatalists(); } catch {}

      $('#issueModal')?.classList.remove('show');
      $('#issueModal')?.setAttribute('aria-hidden','true');
      document.body.classList.remove('modal-open');
      goDashboard();
    }catch(err){
      rollbackPart(i, before);
      renderDashboard(); renderGallery(); renderDatalists();
      notify({title:i18n.t('noti.issueFail'), message: err.message || 'error', level:'danger'});
    }finally{
      _issuingBusy = false;
    }
  };

  // Receive (API)
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

    if(!code || !qty || qty<=0) return notify({title:i18n.t('noti.incomplete'), message:i18n.t('noti.fillQtyMsg'), level:'warn'});

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
        state.parts[idx] = { ...before, Name: name || before.Name, Model: model || before.Model, Brand: brand || before.Brand, Location: loc || before.Location, Category: cat || before.Category, Min: isNaN(min) ? before.Min : min, Qty: Number(before.Qty||0) + qty, ImageURL: imageBase64 || before.ImageURL };
      }else{
        state.parts.push({ PartID:code, Name:name, Model:model, Brand:brand, Min:min, Qty:qty, Location:loc, Category:cat, ImageURL:imageBase64 });
      }
      if(cat && !state.categories.includes(cat)) state.categories.push(cat);
      renderDatalists(); renderDashboard(); renderGallery();

      if(idx>=0){ await window.apiPost('receive', { partId: code, qty }); }
      else{
        await window.apiPost('receive_new', { part: { PartID:code, Name:name, Model:model, Brand:brand, Min:min, Qty:0, Location:loc, Category:cat }, qty, imageBase64 });
      }

      notify({title:i18n.t('noti.saved'), message:`${i18n.t('type.in')} ${code} ${i18n.t('form.qty')} ${qty}`});
      renderGallery(); renderDashboard();

      // clear form
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
      notify({title:i18n.t('noti.receiveFail'), message: err.message||'error', level:'danger'});
    }finally{
      _receivingBusy = false;
    }
  };

  // Edit/Delete via API (ข้อความแจ้งเตือนใช้ i18n แล้วในส่วนอื่น)
  const __old_renderHistory = window.renderHistory;
  window.renderHistory = function(){
    if(state.mode==='api'){ renderHistory_API(); }
    else { __old_renderHistory(); }
  };

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
      tbody.innerHTML = `<tr><td colspan="7" class="meta" style="padding:16px">${i18n.t('dash.noTxns')}</td></tr>`;
      return;
    }

    filtered.forEach(t=>{
      const timeStr = new Date(t.Date).toLocaleString(i18n.locale(), {hour12:false});
      const badge = t.Type==='รับ' ? `<span class="badge in">${i18n.t('badge.in')}</span>` : `<span class="badge out">${i18n.t('badge.out')}</span>`;
      const model = modelById.get(t.PartID) || '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${timeStr}</td>
        <td>${t.PartID||''}</td>
        <td>${nameById.get(t.PartID)||''}</td>
        <td>${badge}</td>
        <td>${model}</td>
        <td>${t.Qty??0}</td>
        <td>${t.By||''}</td>`;
      tbody.appendChild(tr);
    });
  }

  $('#hQ')?.addEventListener('input', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hMonth')?.addEventListener('change', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hYear')?.addEventListener('change', ()=>{ if(state.mode==='api') renderHistory_API(); });
  $('#hTypeSet')?.addEventListener('click', (e)=>{ if(state.mode!=='api') return; const btn = e.target.closest('.chip'); if(!btn) return; setTimeout(renderHistory_API, 0); });

  // Export CSV (API) — ใช้ i18n ในส่วน exportCsv ของ demo แล้ว ด้าน API ด้านล่างคงโค้ดเดิมของคุณไว้เพื่อความสมบูรณ์
  $('#btnExportCsv')?.addEventListener('click', async (e)=>{
    if(state.mode!=='api') return;
    e.preventDefault(); e.stopImmediatePropagation();

    const m = Number($('#exMonth').value), y = Number($('#exYear').value);
    const rows = await window.apiGet('txns', {month:String(m), year:String(y)});

    const nameById  = new Map(state.parts.map(p=>[p.PartID, p.Name||'']));
    const modelById = new Map(state.parts.map(p=>[p.PartID, p.Model||'']));

    const header = [i18n.t('col.datetime'),i18n.t('col.code'),i18n.t('col.name'),i18n.t('col.type'),i18n.t('col.model'),i18n.t('col.qty'),i18n.t('col.by')];

    const body = rows
      .sort((a,b)=> new Date(a.Date)-new Date(b.Date))
      .map(r=>{
        const timeStr = new Date(r.Date).toLocaleString(i18n.locale(),{hour12:false});
        const rec = [ timeStr, r.PartID || '', nameById.get(r.PartID) || '', r.Type || '', modelById.get(r.PartID) || '', r.Qty ?? 0, r.By || '' ];
        return rec.map(s=>{
          s = String(s ?? '');
          return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
        }).join(',');
      });

    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob(["\uFEFF"+csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `Stock_Txns_${y}-${String(m).padStart(2,'0')}.csv`; a.click(); URL.revokeObjectURL(a.href);

    notify({title:i18n.t('noti.exported'), message:i18n.t('noti.exportedMsg',{m,y,n:rows.length})});
  }, {capture:true});
})();

/* --- Single handlers (เดิม) --- */
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
        notify({title:i18n.t('noti.apiNotReady'), message:i18n.t('noti.tryAgain'), level:'danger'});
      }
      return;
    }
    e.preventDefault(); e.stopImmediatePropagation();
    handleReceiveSubmit();
  }, {capture:true});
})();

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
        notify({title:i18n.t('noti.apiNotReady'), message:'doQuickIssue_API', level:'danger'});
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

/* บีบอัดรูปก่อนอัปโหลด (เดิม) */
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
function notify({ title='', message='', level='info', timeout=3000, icon, action } = {}){
  // stack container
  let stack = document.getElementById('notiStack');
  if(!stack){
    stack = document.createElement('div');
    stack.id = 'notiStack';
    stack.className = 'noti-stack';
    document.body.appendChild(stack);
  }

  // level mapping
  const map = { danger:'danger', warn:'warn', warning:'warn', ok:'ok', success:'ok', info:'info' };
  const kind = map[level] || 'info';

  // limit stack
  while(stack.children.length >= 4){ stack.removeChild(stack.firstElementChild); }

  // SVG icons
  const svgs = {
    info:   '<svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h2v4h-2"/></svg>',
    ok:     '<svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
    warn:   '<svg viewBox="0 0 24 24" fill="none" stroke="#b45309" stroke-width="2"><path d="M12 3 2 20h20L12 3z"/><path d="M12 9v4M12 16h.01"/></svg>',
    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5 14.5 14.5M14.5 9.5 9.5 14.5"/></svg>'
  };

  // toast element
  const el = document.createElement('div');
  el.className = `noti noti--${kind}`;
  el.setAttribute('role', kind==='danger' ? 'alert' : 'status');

  el.innerHTML = `
    <div class="noti__icon" aria-hidden="true">${icon ?? svgs[kind] ?? svgs.info}</div>
    <div class="noti__body">
      ${title ? `<div class="noti__title">${title}</div>` : ''}
      ${message ? `<div class="noti__msg">${message}</div>` : ''}
    </div>
    <button class="noti__close" aria-label="Close">×</button>
    ${timeout ? '<div class="noti__progress"></div>' : ''}
  `;

  // optional action button
  if(action && action.label){
    const btn = document.createElement('button');
    btn.className = 'noti__action';
    btn.textContent = action.label;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      try{ action.onClick?.(); }catch{}
      close();
    });
    el.appendChild(btn);
  }

  stack.appendChild(el);

  // close helpers
  const close = () => {
    if(!el.isConnected) return;
    el.classList.add('out');
    setTimeout(()=> el.remove(), 180);
  };

  // close button
  el.querySelector('.noti__close').addEventListener('click', (e)=>{ e.stopPropagation(); close(); });

  // tap anywhere to close (mobile friendly)
  el.addEventListener('click', (e)=>{
    // ignore clicks on action/close
    if(e.target.closest('.noti__action, .noti__close')) return;
    close();
  });

  // auto dismiss + pause on hover/hold
  let timer = null, paused = false;
  const startTimer = () => {
    if(timeout && timeout>0 && !paused){
      el.style.setProperty('--life', `${timeout}ms`);
      timer = setTimeout(close, timeout + 120);
    }
  };
  const clearTimer = ()=> { if(timer){ clearTimeout(timer); timer=null; } };

  // desktop: hover pause
  el.addEventListener('mouseenter', ()=>{ paused=true; el.classList.add('paused'); clearTimer(); });
  el.addEventListener('mouseleave', ()=>{ paused=false; el.classList.remove('paused'); clearTimer(); startTimer(); });

  // mobile: long press to pause/resume
  let holdT=null;
  const holdStart = ()=>{ if(holdT) return; holdT = setTimeout(()=>{ paused=true; el.classList.add('paused'); clearTimer(); }, 220); };
  const holdEnd   = ()=>{ if(holdT){ clearTimeout(holdT); holdT=null; } if(paused){ paused=false; el.classList.remove('paused'); startTimer(); } };
  el.addEventListener('touchstart', holdStart, {passive:true});
  el.addEventListener('touchend',   holdEnd);
  el.addEventListener('touchcancel',holdEnd);

  // swipe to dismiss (right)
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
  el.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  el.addEventListener('touchstart', onStart, {passive:true});
  el.addEventListener('touchmove',  onMove,  {passive:true});
  el.addEventListener('touchend',   onEnd);

  // haptics (mobile) — เล็ก ๆ
  try{ if(navigator.vibrate) navigator.vibrate(8); }catch{}

  startTimer();
  return el;
}

/* ===== Init ===== */
i18n.apply();            // apply static labels before first render
loadAll();
initBottomNav();
updateAuthUI();
