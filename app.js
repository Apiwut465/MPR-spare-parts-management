/* =========================================
   1. CONFIG & INIT
   ========================================= */
window.SUPA = {
  url: 'https://utldpbyewkohuoyhzaat.supabase.co',
  anon: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGRwYnlld2tvaHVveWh6YWF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjg4MTIsImV4cCI6MjA3MDc0NDgxMn0.65_11061GKODroeQFB_1vqBR54spYTs8oSgfujhMCoc'
};

// ใช้ชื่อ Bucket 'parts' ให้ตรงกับ Supabase
const IMAGE_BUCKET = 'parts'; 

let supa;
let allParts = [];
let checksByPartId = {};
let qrSelected = new Set();
let videoStream = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.addEventListener("DOMContentLoaded", () => {
  try {
    const { createClient } = supabase;
    supa = createClient(window.SUPA.url, window.SUPA.anon);
    
    bindEvents();
    refreshAll();
    
    if($('#checkDate')) {
      $('#checkDate').value = new Date().toISOString().slice(0, 10);
    }
  } catch (err) {
    console.error("Supabase Init Error:", err);
    alert("ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาตรวจสอบ Config");
  }
});

/* =========================================
   2. DATA & LOGIC
   ========================================= */

function normalizePart(p) {
    return {
        PartID: p.PartID || p.partid || p.part_id || "",
        Name: p.Name || p.name || "",
        Category: p.Category || p.category || "-",
        Brand: p.Brand || p.brand || "",
        Model: p.Model || p.model || "",
        Location: p.Location || p.location || "-",
        Min: Number(p.Min || p.min || 0),
        Qty: Number(p.Qty || p.qty || 0),
        ImageURL: p.ImageURL || p.imageurl || p.image_url || ""
    };
}

// แก้ไขฟังก์ชัน refreshAll ให้โหลดตามลำดับ (Sequential)
async function refreshAll() {
  showToast("กำลังโหลดข้อมูล...", "");
  try {
      // 1. โหลดรายชื่ออะไหล่ให้เสร็จก่อน (สำคัญมาก!)
      await loadParts();
      
      // 2. ค่อยโหลดประวัติ (ถึงจะเอาชื่อกับโมเดลมาแมตช์ได้)
      await loadTxns();
      
      // 3. โหลดส่วนอื่นๆ
      await loadChecks();
      
      updateDashboard();
      renderParts();
      renderIssueCards();
      renderCheckCards();
      renderQrList();
      
      showToast(`ข้อมูลอัปเดตแล้ว (${allParts.length} รายการ)`, "success");
  } catch (err) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
  }
}

async function loadParts() {
  const { data, error } = await supa.from("parts").select("*").order("Name", {ascending: true});
  
  if(error) {
      console.error("Load Parts Error:", error);
      throw error;
  }
  
  allParts = (data || []).map(normalizePart);
  
  const cats = [...new Set(allParts.map(p=>p.Category).filter(Boolean))];
  updateDatalist("#categoryList", cats);
  updateDatalist("#issueCategoryFilter", cats, true);
  
  const dlPart = $("#partIdList"); 
  if(dlPart) {
      dlPart.innerHTML = "";
      allParts.forEach(p => {
        const o = document.createElement("option");
        o.value = p.PartID; o.label = p.Name;
        dlPart.appendChild(o);
      });
  }
}

async function loadTxns() {
  const { data, error } = await supa
    .from("txns")
    .select("*")
    .order("Date", {ascending: false})
    .limit(100);

  if(error) console.error("Load Txns Error:", error);

  const tbody = $("#txnsTbody"); 
  if(!tbody) return;
  tbody.innerHTML = "";
  
  if(!data || !data.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#b2bec3;">ยังไม่มีประวัติการเคลื่อนไหว</td></tr>`;
      return;
  }

  const table = tbody.closest('table');
  if(table) table.className = "history-table";

  (data || []).forEach(item => {
    const t = {
        Date: item.Date || item.date || item.created_at,
        Type: item.Type || item.type,
        PartID: item.PartID || item.partid || item.part_id,
        Qty: item.Qty || item.qty,
        By: item.By || item.by || item.user,
        Ref: item.Ref || item.ref || item.note
    };

    // หา Model
    const part = allParts.find(p => p.PartID === t.PartID) || {};
    const partName = part.Name || '-';
    const partModel = part.Model || '-';

    const tr = document.createElement("tr");
    tr.className = "history-row"; 
    
    let dateStr = "-", timeStr = "";
    if(t.Date) {
        const dateObj = new Date(t.Date);
        dateStr = dateObj.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' });
        timeStr = dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    }

    let typeHtml = '';
    let qtyColor = '';
    const type = (t.Type || '').toString().trim().toUpperCase();
    
    if (['IN', 'รับเข้า', 'รับ', 'RECEIVE', 'ADD'].includes(type)) {
        typeHtml = `<span class="history-badge h-in"><i class="fa-solid fa-arrow-down"></i> รับเข้า</span>`;
        qtyColor = '#00b894'; 
    } else {
        typeHtml = `<span class="history-badge h-out"><i class="fa-solid fa-arrow-up"></i> เบิกออก</span>`;
        qtyColor = '#ff7675'; 
    }

    tr.innerHTML = `
      <td style="color:#636e72; font-size:0.85rem;">
        <div style="font-weight:bold;">${dateStr}</div>
        <div>${timeStr}</div>
      </td>
      <td>${typeHtml}</td>
      <td><span class="h-part">${t.PartID || '-'}</span></td>
      <td>
        <div style="font-weight:600; color:#2d3436; font-size:0.9rem;">${partName}</div>
        <div style="font-size:0.8rem; color:#636e72; background:#f1f2f6; display:inline-block; padding:0 5px; border-radius:4px;">
           Model: ${partModel}
        </div>
      </td>
      <td style="color:${qtyColor};" class="h-qty">${t.Qty || 0}</td>
      <td style="font-weight:500;">${t.By || '-'}</td>
      <td style="color:#636e72; font-size:0.9rem;">${t.Ref || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadChecks() {
  const dateInput = $("#checkDate");
  if(!dateInput) return;
  const date = dateInput.value;
  
  const { data, error } = await supa.from("stock_checks").select("*").eq("Date", date);
  if(error) console.error("Load Checks Error:", error);
  
  checksByPartId = {};
  (data||[]).forEach(c => {
      const pid = c.PartID || c.partid || c.part_id;
      const counted = c.QtyCounted !== undefined ? c.QtyCounted : c.qtycounted;
      if(pid) {
          checksByPartId[pid] = { QtyCounted: counted };
      }
  });
}

function updateDatalist(id, items, isSelect=false) {
  const el = $(id);
  if(!el) return;
  el.innerHTML = "";
  if(isSelect) {
    const o = document.createElement("option"); o.value="all"; o.textContent="ทุกหมวดหมู่";
    el.appendChild(o);
    items.forEach(i => { const op=document.createElement("option"); op.value=i; op.textContent=i; el.appendChild(op); });
  } else {
    items.forEach(i => { const op=document.createElement("option"); op.value=i; el.appendChild(op); });
  }
}

function getStatus(p) {
  if((p.Qty||0) <= 0) return "out";
  if((p.Qty||0) < (p.Min||0)) return "low";
  return "ok";
}

/* =========================================
   3. RENDERING
   ========================================= */
function updateDashboard() {
  const total = allParts.length;
  const out = allParts.filter(p => getStatus(p)==='out').length;
  const low = allParts.filter(p => getStatus(p)==='low').length;
  
  $("#statTotalParts").textContent = total;
  $("#statNearLow").textContent = low;
  $("#statOut").textContent = out;
  
  const ul = $("#lowList"); 
  if(!ul) return;
  ul.innerHTML = "";
  
  const alerts = allParts.filter(p => getStatus(p) !== 'ok');
  
  if(alerts.length === 0) {
    ul.innerHTML = `<div style="text-align:center; padding:20px; color:#00b894;"><i class="fa-solid fa-check-circle fa-2x"></i><br>สต็อกปกติทั้งหมด เยี่ยมมาก!</div>`;
  } else {
    alerts.forEach(p => {
      const st = getStatus(p);
      const div = document.createElement("div");
      div.className = `alert-item alert-${st}`;
      div.innerHTML = `
        <div class="alert-info">
          <h4>${p.Name}</h4>
          <span>${p.PartID} | คงเหลือ: <b>${p.Qty}</b> (Min: ${p.Min})</span>
        </div>
        <button class="btn btn-sm btn-outline" onclick="openDetail('${p.PartID}')">ดู</button>
      `;
      ul.appendChild(div);
    });
  }
}

function renderParts() {
  const tbody = $("#partsTbody"); 
  if(!tbody) return;
  tbody.innerHTML = "";
  
  const search = $("#searchInput").value.toLowerCase();
  const filter = $("#statusFilter").value;
  
  const list = allParts.filter(p => {
    const txt = (p.PartID+p.Name+p.Model).toLowerCase();
    if(search && !txt.includes(search)) return false;
    if(filter !== 'all' && getStatus(p) !== filter) return false;
    return true;
  });
  
  list.forEach(p => {
    const st = getStatus(p);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:600; color:#0984e3;">${p.PartID}</td>
      <td>${p.Name}</td>
      <td><span class="meta-tag">${p.Category||'-'}</span></td>
      <td>${p.Brand||''} ${p.Model||''}</td>
      <td style="text-align:center;">${p.Min}</td>
      <td style="text-align:center;">
        <span class="status-badge bg-${st}" style="position:static; display:inline-block;">${p.Qty}</span>
      </td>
      <td>${p.Location||'-'}</td>
      <td style="text-align:right;">
        <button class="btn btn-outline" style="padding:5px 10px;" onclick="openEdit('${p.PartID}')"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-outline" style="padding:5px 10px;" onclick="showQr('${p.PartID}')"><i class="fa-solid fa-qrcode"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderIssueCards() {
  const container = $("#issueCards"); 
  if(!container) return;
  container.innerHTML = "";
  
  const search = $("#issueSearch").value.toLowerCase();
  const cat = $("#issueCategoryFilter").value;
  
  const list = allParts.filter(p => {
    const text = (p.PartID + p.Name + p.Brand + p.Model).toLowerCase();
    if(search && !text.includes(search)) return false;
    if(cat !== 'all' && p.Category !== cat) return false;
    return true;
  });
  
  if(!list.length) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#b2bec3;">
        <i class="fa-solid fa-box-open" style="font-size:3rem; margin-bottom:10px;"></i><br>ไม่พบรายการอะไหล่
      </div>`;
      return;
  }
  
  list.forEach(p => {
    const st = getStatus(p);
    const card = document.createElement("div");
    card.className = "item-card";
    
    const imgHtml = p.ImageURL 
        ? `<img src="${p.ImageURL}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="fallback-img" style="display:none; width:100%; height:100%; align-items:center; justify-content:center; background:#f1f2f6; color:#b2bec3; position:absolute; top:0; left:0;"><i class="fa-solid fa-image-slash" style="font-size:2.5rem;"></i></div>`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f1f2f6; color:#b2bec3;"><i class="fa-solid fa-image" style="font-size:2.5rem;"></i></div>`;

    let statusBadge = '<span class="status-badge bg-ok" style="right:10px; top:10px;">OK</span>';
    if (st === 'out') statusBadge = '<span class="status-badge bg-out" style="right:10px; top:10px;">หมด</span>';
    else if (st === 'low') statusBadge = '<span class="status-badge bg-low" style="right:10px; top:10px;">ต่ำ</span>';

    card.innerHTML = `
      <div class="item-img" style="height: 150px; cursor:pointer; position:relative;" onclick="openDetail('${p.PartID}')">
        ${imgHtml}
        ${statusBadge}
      </div>
      <div class="item-body" style="padding: 15px;">
        <div class="item-code" style="font-weight:800; color:#0984e3; font-size:0.95rem; margin-bottom:5px;">${p.PartID}</div>
        <div class="item-name" style="margin-bottom: 8px; font-size:1rem; line-height:1.4; height:2.8em; overflow:hidden;">${p.Name}</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">
            <span style="font-size:0.8rem; color:#2d3436; background:#dfe6e9; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
               <i class="fa-solid fa-tag" style="color:#636e72; font-size:0.75rem;"></i> ${p.Brand || '-'}
            </span>
            <span style="font-size:0.8rem; color:#2d3436; background:#dfe6e9; padding:3px 8px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
               <i class="fa-solid fa-gear" style="color:#636e72; font-size:0.75rem;"></i> ${p.Model || '-'}
            </span>
        </div>
        <div class="item-meta" style="display:flex; gap:6px; margin-bottom:15px; flex-wrap:wrap;">
          <span class="meta-tag" style="background:#e3f2fd; color:#0984e3; font-weight:700;">คงเหลือ: ${p.Qty}</span>
          <span class="meta-tag" style="background:#fff3cd; color:#856404; font-weight:600;">Min: ${p.Min}</span>
          <span class="meta-tag" style="background:#f1f2f6; color:#636e72;">Loc: ${p.Location||'-'}</span>
        </div>
        <div class="item-action" style="display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
          <input type="number" min="1" class="qty-input" placeholder="จำนวน" id="qty-${p.PartID}"
                 style="flex: 1; width: 0; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; text-align: center; outline: none; font-size: 1rem;"
                 onfocus="this.style.borderColor='#00b894'; this.style.boxShadow='0 0 0 3px rgba(0, 184, 148, 0.1)';"
                 onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none';">
          <button class="btn btn-primary" onclick="doIssue('${p.PartID}')" style="flex: 0 0 auto; padding: 10px 20px; border-radius: 8px; white-space: nowrap; font-weight: 600; box-shadow: 0 4px 10px rgba(0, 97, 255, 0.3);">เบิก</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderCheckCards() {
  const container = $("#checkCards"); 
  if(!container) return;
  container.innerHTML = "";
  const search = $("#checkSearch").value.toLowerCase();
  
  const list = allParts.filter(p => {
      const text = (p.PartID + p.Name + p.Brand + p.Model).toLowerCase();
      return !search || text.includes(search);
  });
  
  const doneCount = Object.keys(checksByPartId).length;
  $("#checkDone").textContent = doneCount;
  $("#checkTotal").textContent = allParts.length;
  const pct = allParts.length ? (doneCount/allParts.length)*100 : 0;
  $("#checkProgress").style.width = pct + "%";
  
  if(!list.length) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px; color:#b2bec3;">ไม่พบรายการอะไหล่</div>`;
      return;
  }
  
  list.forEach(p => {
    const checked = checksByPartId[p.PartID];
    const card = document.createElement("div");
    card.className = "item-card";
    
    if(checked) {
        card.style.border = "2px solid #00b894";
        card.style.background = "#f0fdf4";
        card.style.boxShadow = "0 4px 12px rgba(0, 184, 148, 0.15)";
    }
    
    const imgHtml = p.ImageURL 
        ? `<img src="${p.ImageURL}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center; background:#f1f2f6; color:#b2bec3; position:absolute; top:0; left:0;"><i class="fa-solid fa-image-slash" style="font-size:2.5rem;"></i></div>`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#f1f2f6; color:#b2bec3;"><i class="fa-solid fa-image" style="font-size:2.5rem;"></i></div>`;

    card.innerHTML = `
      <div class="item-img" style="height: 140px; cursor:pointer; position:relative;" onclick="openDetail('${p.PartID}')">
        ${imgHtml}
        ${checked ? '<span class="status-badge bg-ok"><i class="fa-solid fa-check"></i> เช็คแล้ว</span>' : ''}
      </div>
      <div class="item-body" style="padding: 12px;">
        <div class="item-code" style="font-weight:bold; color:#0984e3; font-size:0.9rem; margin-bottom:4px;">${p.PartID}</div>
        <div class="item-name" style="margin-bottom: 6px; font-size:0.95rem; line-height:1.4; height:2.8em; overflow:hidden;">${p.Name}</div>
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">
            <span style="font-size:0.8rem; color:#2d3436; background:#e2e8f0; padding:2px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
               <i class="fa-solid fa-tag" style="color:#636e72; font-size:0.75rem;"></i> ${p.Brand || '-'}
            </span>
            <span style="font-size:0.8rem; color:#2d3436; background:#e2e8f0; padding:2px 8px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
               <i class="fa-solid fa-gear" style="color:#636e72; font-size:0.75rem;"></i> ${p.Model || '-'}
            </span>
        </div>
        <div class="item-meta" style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
          <span class="meta-tag" style="background:#e3f2fd; color:#0984e3; font-weight:600;">ระบบ: ${p.Qty}</span>
          ${checked ? `<span class="meta-tag" style="background:#dcfce7; color:#166534; font-weight:600;">นับได้: ${checked.QtyCounted}</span>` : ''}
        </div>
        <div class="item-action" style="display: flex; align-items: center; gap: 8px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
          <input type="number" class="qty-input" placeholder="ระบุจำนวน" value="${checked ? checked.QtyCounted : ''}" id="chk-${p.PartID}" 
                 style="flex: 1; width: 0; padding: 8px 12px; border: 1px solid ${checked ? '#00b894' : '#cbd5e1'}; border-radius: 8px; text-align: center; font-weight: ${checked ? 'bold' : 'normal'}; color: ${checked ? '#00b894' : '#2d3436'}; outline: none;"
                 onfocus="this.style.borderColor='#00b894'; this.style.boxShadow='0 0 0 3px rgba(0, 184, 148, 0.1)';"
                 onblur="this.style.borderColor='${checked ? '#00b894' : '#cbd5e1'}'; this.style.boxShadow='none';">
          <button class="btn" onclick="doCheck('${p.PartID}')"
                  style="flex: 0 0 auto; background: ${checked ? '#00b894' : 'white'}; color: ${checked ? 'white' : '#636e72'}; border: ${checked ? 'none' : '1px solid #cbd5e1'}; padding: 8px 16px; border-radius: 8px; transition: all 0.2s; white-space: nowrap; box-shadow: ${checked ? '0 4px 10px rgba(0, 184, 148, 0.3)' : 'none'};">
            ${checked ? '<i class="fa-solid fa-pen-to-square"></i> แก้ไข' : 'บันทึก'}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderQrList() {
  const container = $("#qrSelectList"); 
  if(!container) return;
  container.innerHTML = "";
  
  const search = $("#qrSearch").value.toLowerCase();
  const list = allParts.filter(p => !search || (p.PartID+p.Name).toLowerCase().includes(search));
  
  const selCount = $("#qrSelectedCount");
  if(selCount) selCount.textContent = qrSelected.size;
  
  list.forEach(p => {
    const isSel = qrSelected.has(p.PartID);
    const div = document.createElement("div");
    div.className = "item-card";
    if(isSel) { div.style.background = "#e3f2fd"; div.style.borderColor = "#2196f3"; }
    div.innerHTML = `
      <div class="item-body" style="cursor:pointer; padding: 12px;" onclick="toggleQrSel('${p.PartID}')">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
           <div class="item-code" style="font-weight:bold; color:#0984e3;">${p.PartID}</div>
           ${isSel ? '<i class="fa-solid fa-check-circle" style="color:#2196f3; font-size:1.2rem;"></i>' : '<i class="fa-regular fa-circle" style="color:#b2bec3; font-size:1.2rem;"></i>'}
        </div>
        <div class="item-name" style="font-size:0.95rem; margin: 4px 0; font-weight:600;">${p.Name}</div>
        <div style="font-size:0.85rem; color:#636e72; background:#f1f2f6; padding:2px 6px; border-radius:4px; display:inline-block;">Model: ${p.Model || '-'}</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleQrSel(id) {
  if(qrSelected.has(id)) qrSelected.delete(id); else qrSelected.add(id);
  renderQrList();
}

/* =========================================
   4. ACTIONS & DB
   ========================================= */
async function doIssue(id) {
  const qtyInput = $(`#qty-${id}`);
  const qty = Number(qtyInput.value);
  if(!qty || qty <= 0) return showToast("ใส่จำนวนให้ถูกต้อง", "error");
  const by = $("#issueBy").value;
  if(!by) return showToast("ระบุชื่อผู้เบิก", "error");
  
  showToast("กำลังบันทึก...", "");
  const { error } = await supa.rpc("issue_part", {
    part_id: id, qty: qty, by_name: by,
    machine: $("#issueMachine").value,
    dept: $("#issueDept").value,
    note: $("#issueNote").value
  });
  
  if(error) { showToast("เกิดข้อผิดพลาด: "+error.message, "error"); }
  else { showToast("เบิกสำเร็จ", "success"); qtyInput.value = ""; refreshAll(); }
}

async function doCheck(id) {
  const val = $(`#chk-${id}`).value;
  if(val === "") return;
  const counted = Number(val);
  const payload = {
    Date: $("#checkDate").value,
    PartID: id,
    QtySystem: allParts.find(p=>p.PartID===id)?.Qty || 0,
    QtyCounted: counted,
    By: $("#checkBy").value
  };
  await supa.from("stock_checks").upsert(payload, { onConflict: "Date,PartID" });
  await supa.from("parts").update({Qty: counted}).eq("PartID", id);
  showToast("บันทึกรีเช็คเรียบร้อย", "success");
  refreshAll();
}

// --- Export CSV Logic ---
async function exportHistoryCsv() {
    showToast("กำลังเตรียมไฟล์ CSV...", "");
    const { data: txns, error } = await supa.from("txns").select("*").order("Date", {ascending: false});
    if (error) return showToast("ไม่สามารถดึงข้อมูลได้", "error");

    let csvContent = "\uFEFF"; // BOM for Thai support
    csvContent += "วันที่,เวลา,ประเภท,Part ID,ชื่ออะไหล่,Model,จำนวน,ผู้ทำรายการ,รายละเอียด\n";

    txns.forEach(t => {
        const dateObj = new Date(t.Date);
        const dateStr = dateObj.toLocaleDateString('th-TH');
        const timeStr = dateObj.toLocaleTimeString('th-TH');
        
        const part = allParts.find(p => p.PartID === t.PartID) || {};
        const name = (part.Name || "").replace(/,/g, " ");
        const model = (part.Model || "").replace(/,/g, " ");
        const typeRaw = (t.Type || '').toString().trim().toUpperCase();
        const type = (['IN', 'รับเข้า', 'รับ', 'RECEIVE', 'ADD'].includes(typeRaw)) ? 'รับเข้า' : 'เบิกออก';
        const detail = (t.Ref || "").replace(/,/g, " ");

        csvContent += `${dateStr},${timeStr},${type},${t.PartID},"${name}","${model}",${t.Qty},${t.By},"${detail}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `history_stock_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("ดาวน์โหลดเสร็จสิ้น", "success");
}

/* =========================================
   5. MODALS & UTILS
   ========================================= */
function openModal(id) { $(`#${id}`).classList.add("show"); }
function closeModal(id) { $(`#${id}`).classList.remove("show"); }

function bindEvents() {
  $$(".close-modal").forEach(b => b.onclick = function() {
    this.closest(".modal").classList.remove("show");
    if(this.closest("#qrScanModal")) stopScan();
  });
  
  $("#btnRefresh").onclick = refreshAll;
  
  // Bind Export Button
  const btnExport = $("#btnExportHistory");
  if(btnExport) btnExport.onclick = exportHistoryCsv;
  
  $("#searchInput").oninput = renderParts;
  $("#statusFilter").onchange = renderParts;
  $("#issueSearch").oninput = renderIssueCards;
  $("#issueCategoryFilter").onchange = renderIssueCards;
  $("#checkSearch").oninput = renderCheckCards;
  $("#qrSearch").oninput = renderQrList;
  
  $$(".nav-btn").forEach(b => b.onclick = function() {
    $$(".nav-btn").forEach(x => x.classList.remove("active"));
    this.classList.add("active");
    $$(".screen").forEach(s => s.classList.remove("active"));
    $(`#${this.dataset.screen}`).classList.add("active");
  });

  $("#btnOpenReceive").onclick = function() {
      $("#formReceive").reset();
      $("#receivePartID").value = "";
      $("#selectedPartInfo").style.display = "none";
      $("#receiveDropdown").classList.remove("active");
      openModal("receiveModal");
  };

  const searchInput = $("#receiveSearchInput");
  const dropdown = $("#receiveDropdown");

  if(searchInput && dropdown) {
      searchInput.addEventListener("input", function() {
          const text = this.value.toLowerCase().trim();
          if(text.length < 1) {
              dropdown.classList.remove("active");
              return;
          }
          const matches = allParts.filter(p => {
              const str = `${p.PartID} ${p.Name} ${p.Model || ''}`.toLowerCase();
              return str.includes(text);
          });
          renderDropdown(matches);
      });
  }

  function renderDropdown(list) {
      if(!dropdown) return;
      dropdown.innerHTML = "";
      if(list.length === 0) {
          dropdown.innerHTML = `<div class="dropdown-item" style="color:#b2bec3; text-align:center;">ไม่พบข้อมูล</div>`;
          dropdown.classList.add("active");
          return;
      }
      list.forEach(p => {
          const div = document.createElement("div");
          div.className = "dropdown-item";
          div.innerHTML = `
              <div class="dd-main">${p.Name}</div>
              <div class="dd-sub">
                  <span>ID: <b>${p.PartID}</b></span>
                  ${p.Model ? `<span class="dd-model"><i class="fa-solid fa-gear"></i> ${p.Model}</span>` : ''}
              </div>
          `;
          div.onclick = () => selectPartReceive(p);
          dropdown.appendChild(div);
      });
      dropdown.classList.add("active");
  }

  function selectPartReceive(p) {
      if(!dropdown) return;
      $("#receivePartID").value = p.PartID;
      $("#receiveSearchInput").value = "";
      $("#selectedPartInfo").style.display = "block";
      $("#selPartName").textContent = p.Name;
      $("#selPartID").textContent = p.PartID;
      $("#selPartModel").textContent = p.Model || '-';
      dropdown.classList.remove("active");
  }

  document.addEventListener("click", (e) => {
      if(dropdown && !e.target.closest("#receiveModal")) {
          dropdown.classList.remove("active");
      }
  });

  const imgInput = $("#partImageFile");
  if(imgInput) {
      imgInput.onchange = function(e) {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(ev) {
                  $("#imgPreview").src = ev.target.result;
                  $("#imgPreviewBox").style.display = "block";
                  $("#btnRemoveImg").style.display = "none";
              };
              reader.readAsDataURL(file);
          }
      };
  }

  const btnRmImg = $("#btnRemoveImg");
  if(btnRmImg) {
      btnRmImg.onclick = function() {
          if(confirm("ต้องการลบรูปภาพนี้ออกใช่ไหม?")) {
              $("#partImageURL").value = "";
              $("#partImageFile").value = "";
              $("#imgPreview").src = "";
              $("#imgPreviewBox").style.display = "none";
              $("#btnRemoveImg").style.display = "none";
          }
      };
  }
}

// --- Auto Run ID Logic ---
function generateNextId() {
    let max = 0;
    allParts.forEach(p => {
        // หาตัวเลขจากท้ายสตริง (เช่น MPR-005 -> 5)
        const match = p.PartID.match(/(\d+)$/);
        if(match) {
            const num = parseInt(match[1], 10);
            if(num > max) max = num;
        }
    });
    const next = max + 1;
    // สร้างรูปแบบ MPR-AUTO-XXXX (ปรับ prefix ได้ตามต้องการ)
    return `MPR-AUTO-${String(next).padStart(4, '0')}`;
}

function openEdit(id) {
  const p = allParts.find(x => x.PartID === id);
  $("#partImageFile").value = "";
  
  if(p) {
    // Edit Mode
    $("#partPartID").value = p.PartID; $("#partPartID").readOnly = true;
    $("#partName").value = p.Name;
    $("#partCategory").value = p.Category || "";
    $("#partBrand").value = p.Brand || "";
    $("#partModel").value = p.Model || "";
    $("#partLocation").value = p.Location || "";
    $("#partMin").value = p.Min;
    $("#partQty").value = p.Qty;
    $("#partImageURL").value = p.ImageURL || "";
    if(p.ImageURL) { 
        $("#imgPreview").src = p.ImageURL; 
        $("#imgPreviewBox").style.display = "block";
        $("#btnRemoveImg").style.display = "inline-flex";
    } else { 
        $("#imgPreviewBox").style.display = "none";
        $("#btnRemoveImg").style.display = "none";
    }
  } else {
    // Add New Mode -> Auto Run ID
    $("#formPart").reset();
    
    // Auto Generate ID and set to input
    const newId = generateNextId();
    $("#partPartID").value = newId;
    $("#partPartID").readOnly = false;
    
    $("#imgPreviewBox").style.display = "none";
    $("#btnRemoveImg").style.display = "none";
    $("#partImageURL").value = "";
  }
  openModal("partModal");
}
window.openPartModal = openEdit;

function openDetail(id) {
  const p = allParts.find(x => x.PartID === id);
  if(!p) return;
  const div = $("#detailBody");
  const imgShow = p.ImageURL ? `<img src="${p.ImageURL}" style="max-height:200px; border-radius:15px; margin:0 auto; display:block;">` : '<div style="height:100px; background:#f1f2f6; border-radius:15px; display:flex; align-items:center; justify-content:center; color:#b2bec3;">No Image</div>';
  
  div.innerHTML = `
    <div style="text-align:center; margin-bottom:15px;">${imgShow}</div>
    <h2 style="color:#2d3436;">${p.Name}</h2>
    <div style="color:#0984e3; font-weight:bold; margin-bottom:10px;">${p.PartID}</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; background:#f8f9fa; padding:15px; border-radius:10px;">
      <div><b>หมวด:</b> ${p.Category||'-'}</div>
      <div><b>ยี่ห้อ:</b> ${p.Brand||'-'}</div>
      <div><b>รุ่น:</b> ${p.Model||'-'}</div>
      <div><b>ที่เก็บ:</b> ${p.Location||'-'}</div>
      <div><b>Min:</b> ${p.Min}</div>
      <div><b>คงเหลือ:</b> <span style="font-size:1.2rem; font-weight:bold; color:${getStatus(p)==='ok'?'#00b894':'#ff7675'}">${p.Qty}</span></div>
    </div>
  `;
  openModal("detailModal");
}
window.openDetail = openDetail;

function showQr(id) {
  const p = allParts.find(x => x.PartID === id);
  openModal("qrDisplayModal");
  $("#qrDisplayArea").innerHTML = "";
  new QRCode($("#qrDisplayArea"), { text: `MPR:${p.PartID}|${p.Model}`, width: 150, height: 150 });
  $("#qrDisplayTitle").textContent = p.PartID;
  $("#qrDisplaySub").textContent = p.Name;
  $("#btnInitPrintSingle").onclick = () => { qrSelected.clear(); qrSelected.add(id); printQr(); };
}
window.showQr = showQr;

/* =========================================
   6. CAMERA & PRINT
   ========================================= */
function startQrScan() {
  openModal("qrScanModal");
  const video = $("#qrVideo");
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(stream => {
    videoStream = stream;
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(tickScan);
  });
}
window.startQrScan = startQrScan;

function stopScan() {
  if(videoStream) videoStream.getTracks().forEach(t => t.stop());
}

function tickScan() {
  const video = $("#qrVideo");
  if(video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if(code) {
      handleScan(code.data);
      return;
    }
  }
  if($("#qrScanModal").classList.contains("show")) requestAnimationFrame(tickScan);
}

function handleScan(txt) {
  stopScan();
  closeModal("qrScanModal");
  let pid = txt.startsWith("MPR:") ? txt.split("|")[0].replace("MPR:", "") : txt;
  
  if($("#screen-issue").style.display === "block") {
    $("#issueSearch").value = pid; renderIssueCards();
  } else if($("#screen-check").style.display === "block") {
    $("#checkSearch").value = pid; renderCheckCards();
  } else {
    $("#searchInput").value = pid; renderParts();
  }
  showToast(`สแกนเจอ: ${pid}`, "success");
}

function printQr() {
  const area = $("#qrPrintArea"); area.innerHTML = "";
  const list = allParts.filter(p => qrSelected.has(p.PartID));
  if(!list.length) return showToast("กรุณาเลือกรายการก่อนพิมพ์", "error");
  
  list.forEach(p => {
    const wrap = document.createElement("div");
    wrap.style.cssText = `
      display: inline-flex; flex-direction: column; justify-content: space-between; align-items: center;
      width: 7.2cm; height: 4.8cm; border: 2px solid #000; border-radius: 10px; padding: 8px 10px; margin: 5px;
      box-sizing: border-box; page-break-inside: avoid; font-family: 'Prompt', sans-serif; float: left; background: white; overflow: hidden;
    `;
    const header = document.createElement("div");
    header.style.cssText = `font-weight: 800; font-size: 13pt; line-height: 1.2; border-bottom: 2px solid #000; width: 100%; text-align: center; white-space: nowrap; margin-bottom: 4px; padding-bottom: 2px;`;
    header.textContent = p.PartID;
    wrap.appendChild(header);

    const qrDiv = document.createElement("div");
    qrDiv.style.cssText = "flex-grow: 1; display:flex; align-items:center; justify-content:center; margin: 2px 0;";
    new QRCode(qrDiv, { text: `MPR:${p.PartID}|${p.Model}`, width: 80, height: 80, correctLevel: QRCode.CorrectLevel.L });
    wrap.appendChild(qrDiv);

    const footer = document.createElement("div");
    footer.style.cssText = "width: 100%; text-align: center; font-size: 9pt; line-height: 1.3;";
    footer.innerHTML = `
      <div style="font-weight: bold; font-size: 10pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; margin-bottom: 4px;">${p.Name}</div>
      <div style="display: flex; justify-content: space-between; border-top: 1px dotted #888; padding-top: 3px; font-size: 8pt;">
        <span style="max-width: 65%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight:600; color:#333;">Model: ${p.Model || '-'}</span>
        <span style="white-space: nowrap; font-weight:600; color:#333;">Loc: ${p.Location || '-'}</span>
      </div>`;
    wrap.appendChild(footer);
    area.appendChild(wrap);
  });
  setTimeout(() => window.print(), 500);
}

$("#btnPrintSelectedQr").onclick = printQr;
$("#qrSelectAllVisible").onclick = () => {
  const search = $("#qrSearch").value.toLowerCase();
  allParts.filter(p => !search || (p.PartID+p.Name).toLowerCase().includes(search)).forEach(p => qrSelected.add(p.PartID));
  renderQrList();
};
$("#qrClearAll").onclick = () => { qrSelected.clear(); renderQrList(); };

function showToast(msg, type) {
  const t = $("#statusLine");
  t.textContent = msg;
  t.className = type;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// Form Handlers
$("#formPart").onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button[type='submit']");
    btn.disabled = true; btn.textContent = "กำลังบันทึก...";
    
    try {
        const file = $("#partImageFile").files[0];
        let finalImageUrl = $("#partImageURL").value;
        
        if(file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `part-${Date.now()}.${fileExt}`;
            const { data, error: uploadError } = await supa.storage.from(IMAGE_BUCKET).upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: urlData } = supa.storage.from(IMAGE_BUCKET).getPublicUrl(fileName);
            finalImageUrl = urlData.publicUrl;
        }

        const payload = {
            PartID: $("#partPartID").value,
            Name: $("#partName").value,
            Category: $("#partCategory").value,
            Brand: $("#partBrand").value,
            Model: $("#partModel").value,
            Location: $("#partLocation").value,
            Min: $("#partMin").value || 0,
            Qty: $("#partQty").value || 0,
            ImageURL: finalImageUrl
        };
        const { error } = await supa.from("parts").upsert(payload);
        if(error) throw error;
        showToast("บันทึกสำเร็จ", "success");
        closeModal("partModal");
        refreshAll();
    } catch(err) {
        console.error(err);
        showToast(err.message, "error");
    } finally {
        btn.disabled = false; btn.textContent = "บันทึกข้อมูล";
    }
};

$("#formReceive").onsubmit = async (e) => {
    e.preventDefault();
    const pid = $("#receivePartID").value;
    const qty = $("#receiveQty").value;
    
    if(!pid) { showToast("กรุณาเลือกอะไหล่ก่อน", "error"); return; }

    const { error } = await supa.rpc("receive_part", { part_id: pid, qty: Number(qty) });
    if(error) showToast(error.message, "error");
    else { 
        showToast("รับของสำเร็จ", "success"); 
        e.target.reset(); 
        $("#selectedPartInfo").style.display = "none";
        closeModal("receiveModal"); 
        refreshAll(); 
    }
};
