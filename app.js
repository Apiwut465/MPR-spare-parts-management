// ========== Supabase client ==========
let supa = null;

(function initSupabase() {
  if (!window.SUPA || !window.SUPA.url || !window.SUPA.anon) {
    console.error("Missing window.SUPA config");
    return;
  }
  const { createClient } = supabase;
  supa = createClient(window.SUPA.url, window.SUPA.anon);
})();

// ========== Image upload config ==========
const IMAGE_BUCKET = "part-images"; // เปลี่ยนชื่อ bucket ตามที่ตั้งใน Supabase ได้

async function uploadPartImage(file, partIdForName) {
  if (!supa) {
    console.error("Supabase client not ready");
    setStatus("ไม่สามารถอัปโหลดรูปได้ (Supabase ยังไม่พร้อม)", "error");
    return null;
  }
  if (!file) return null;

  try {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeId = (partIdForName || "part").replace(/[^a-zA-Z0-9_-]/g, "");
    const path =
      "parts/" +
      safeId +
      "-" +
      Date.now() +
      "-" +
      Math.random().toString(36).slice(2, 8) +
      "." +
      ext;

    const { data, error } = await supa.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/*"
      });

    if (error) {
      console.error("upload error", error);
      setStatus("อัปโหลดรูปไม่สำเร็จ: " + error.message, "error");
      return null;
    }

    const {
      data: { publicUrl }
    } = supa.storage.from(IMAGE_BUCKET).getPublicUrl(data.path);

    return publicUrl;
  } catch (err) {
    console.error(err);
    setStatus("เกิดข้อผิดพลาดระหว่างอัปโหลดรูป", "error");
    return null;
  }
}

// ========== State ==========
let allParts = [];
let lists = null;
let checksByPartId = {}; // {PartID: row}
let currentCheckDate = null;

// สำหรับหน้าเลือก / พิมพ์ QR
let qrSelected = new Set();
let lastQrPartID = null;

// ========== Helpers ==========
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function setStatus(msg, type = "info") {
  const el = $("#statusLine");
  if (!el) return;
  el.textContent = msg;
  el.className = "status " + type;
}

function stockLevel(p) {
  const qty = p.Qty ?? 0;
  const min = p.Min ?? 0;
  if (qty <= 0) return "out";
  if (qty < min) return "low";
  if (qty <= min + 2) return "near";
  return "ok";
}

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// ข้อความใน QR (ใช้ทั้ง modal และ export/print)
function buildQrText(p) {
  return `MPR:${p.PartID || ""}|${p.Model || ""}`;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * สร้าง PartID ใหม่อัตโนมัติรูปแบบ P-0001, P-0002 ...
 * โดยดูเลขสูงสุดของรหัสที่ขึ้นต้นด้วย P- เดิม แล้ว +1
 */
function generateNewPartId() {
  const prefix = "P-";
  let maxNum = 0;

  (allParts || []).forEach((p) => {
    const id = (p.PartID || "").trim();
    const m = id.match(/^P-(\d{4})$/i);
    if (m) {
      const num = parseInt(m[1], 10);
      if (!Number.isNaN(num) && num > maxNum) maxNum = num;
    }
  });

  const next = maxNum + 1;
  return prefix + String(next).padStart(4, "0");
}

// ===== Modal helpers =====
function showModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "flex";
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = "none";

  // ถ้าปิด modal สแกน QR ให้หยุดกล้องด้วย
  if (id === "qrScanModal") {
    stopQrScan();
  }
}

// ========== Load lists (หมวดหมู่ / เครื่องจักร / แผนก) ==========
async function loadLists() {
  if (!supa) return;
  const { data, error } = await supa
    .from("lists")
    .select("*")
    .eq("id", "default");

  if (error) {
    console.error(error);
    setStatus("โหลดข้อมูล lists ไม่สำเร็จ: " + error.message, "error");
    return;
  }
  if (!data || !data.length) return;
  lists = data[0];

  // หมวดหมู่ datalist (ฟอร์มเพิ่ม)
  const dlCat = $("#categoryList");
  if (dlCat) {
    dlCat.innerHTML = "";
    (lists.categories || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      dlCat.appendChild(opt);
    });
  }

  // หมวดหมู่ filter หน้าเบิก
  const issueCatSel = $("#issueCategoryFilter");
  if (issueCatSel) {
    issueCatSel.innerHTML = '<option value="all">ทุกหมวดหมู่</option>';
    (lists.categories || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      issueCatSel.appendChild(opt);
    });
  }

  // เครื่องจักร
  const selMachine = $("#issueMachine");
  if (selMachine) {
    selMachine.innerHTML = '<option value="">-- เลือกเครื่องจักร --</option>';
    (lists.machines || []).forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      selMachine.appendChild(opt);
    });
  }

  // แผนก
  const selDept = $("#issueDept");
  if (selDept) {
    selDept.innerHTML = '<option value="">-- เลือกแผนก --</option>';
    (lists.depts || []).forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      selDept.appendChild(opt);
    });
  }
}

// ========== Load parts ==========
async function loadParts() {
  if (!supa) return;
  setStatus("กำลังโหลดข้อมูลสต็อก...", "info");

  const { data, error } = await supa
    .from("parts")
    .select("*")
    .order("Name", { ascending: true });

  if (error) {
    console.error(error);
    setStatus("โหลดสต็อกไม่สำเร็จ: " + error.message, "error");
    return;
  }

  allParts = data || [];
  renderParts();
  updateDashboard();
  updatePartDatalist();
  renderIssueCards();
  renderCheckCards();
  renderQrSelectList();

  setStatus("โหลดข้อมูลสต็อกล่าสุดแล้ว", "success");
}

// ========== Load txns ==========
async function loadTxns() {
  if (!supa) return;
  const { data, error } = await supa
    .from("txns")
    .select("Date,PartID,Type,Qty,By,Ref")
    .order("Date", { ascending: false })
    .limit(50);

  if (error) {
    console.error(error);
    setStatus("โหลดประวัติไม่สำเร็จ: " + error.message, "error");
    return;
  }

  const tbody = $("#txnsTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (!data || !data.length) {
    const tr = document.createElement("tr");
    tr.innerHTML =
      '<td colspan="6" class="empty">ยังไม่มีประวัติการเคลื่อนไหว</td>';
    tbody.appendChild(tr);
    return;
  }

  data.forEach((row) => {
    const tr = document.createElement("tr");
    const d = row.Date ? new Date(row.Date) : null;
    const dateStr = d ? d.toLocaleString("th-TH") : "";
    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${row.Type || ""}</td>
      <td>${row.PartID || ""}</td>
      <td class="number">${row.Qty ?? ""}</td>
      <td>${row.By || ""}</td>
      <td>${row.Ref || ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ========== Load recheck (stock_checks) ==========
async function loadChecksForDate(dateStr) {
  if (!supa) return;
  currentCheckDate = dateStr;

  const { data, error } = await supa
    .from("stock_checks")
    .select("*")
    .eq("Date", dateStr)
    .order("CreatedAt", { ascending: true });

  if (error) {
    console.error(error);
    setStatus("โหลดข้อมูลรีเช็คไม่สำเร็จ: " + error.message, "error");
    return;
  }

  checksByPartId = {};
  (data || []).forEach((row) => {
    if (row.PartID) checksByPartId[row.PartID] = row;
  });

  renderCheckCards();
}

// ========== Render: Dashboard / ตารางสต็อก ==========
function renderParts() {
  const tbody = $("#partsTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const search = ($("#searchInput")?.value || "").trim().toLowerCase();
  const statusFilter = $("#statusFilter")?.value || "all";

  const filtered = (allParts || []).filter((p) => {
    const text = `${p.PartID || ""} ${p.Name || ""} ${p.Brand || ""} ${
      p.Model || ""
    }`.toLowerCase();
    if (search && !text.includes(search)) return false;

    const level = stockLevel(p);
    if (statusFilter === "all") return true;
    if (statusFilter === "ok" && level === "ok") return true;
    if (statusFilter === "near" && level === "near") return true;
    if (statusFilter === "low" && level === "low") return true;
    if (statusFilter === "out" && level === "out") return true;
    return false;
  });

  if (!filtered.length) {
    const tr = document.createElement("tr");
    const keyword = ($("#searchInput")?.value || "").trim();
    tr.innerHTML = `
      <td colspan="9" class="empty">
        ไม่พบอะไหล่ที่ตรงกับคำว่า
        ${
          keyword
            ? `"<strong>${escapeHtml(keyword)}</strong>"`
            : "<strong>(คำค้นว่าง)</strong>"
        }<br />
        <button type="button"
          class="btn btn-primary btn-xs btn-add-part-from-search">
          เพิ่มอะไหล่ใหม่จากคำค้นนี้
        </button>
      </td>
    `;
    tbody.appendChild(tr);

    const btnAdd = tr.querySelector(".btn-add-part-from-search");
    if (btnAdd) {
      btnAdd.addEventListener("click", () => {
        openNewPartFromSearch(keyword);
      });
    }
    return;
  }

  filtered.forEach((p) => {
    const tr = document.createElement("tr");
    const level = stockLevel(p);
    tr.classList.add("level-" + level);
    tr.innerHTML = `
      <td>${p.PartID || ""}</td>
      <td>${p.Name || ""}</td>
      <td>${p.Category || ""}</td>
      <td>${p.Brand || ""}</td>
      <td>${p.Model || ""}</td>
      <td class="number">${p.Min ?? 0}</td>
      <td class="number">${p.Qty ?? 0}</td>
      <td>${p.Location || ""}</td>
      <td class="actions-cell">
        <button type="button"
          class="btn btn-xs btn-outline btn-manage-part"
          data-partid="${p.PartID || ""}">
          จัดการ
        </button>
        <button type="button"
          class="btn btn-xs btn-outline btn-qrcode"
          data-partid="${p.PartID || ""}">
          QR
        </button>
      </td>
    `;

    // คลิกทั้งแถว = เปิดรายละเอียดอะไหล่
    tr.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn-manage-part") ||
        e.target.closest(".btn-qrcode")
      )
        return;
      openPartDetail(p);
    });

    // ปุ่มจัดการ
    const btnManage = tr.querySelector(".btn-manage-part");
    if (btnManage) {
      btnManage.addEventListener("click", (e) => {
        e.stopPropagation();
        openPartModal(p);
      });
    }

    // ปุ่ม QR
    const btnQr = tr.querySelector(".btn-qrcode");
    if (btnQr) {
      btnQr.addEventListener("click", (e) => {
        e.stopPropagation();
        openQrModal(p);
      });
    }

    tbody.appendChild(tr);
  });
}

function updateDashboard() {
  const total = allParts.length;
  const low = allParts.filter((p) => stockLevel(p) === "low").length;
  const out = allParts.filter((p) => stockLevel(p) === "out").length;
  const near = allParts.filter((p) => stockLevel(p) === "near").length;

  $("#statTotalParts").textContent = total;
  $("#statNearLow").textContent = near + low + out;
  $("#statOut").textContent = out;

  const ul = $("#lowList");
  if (!ul) return;
  ul.innerHTML = "";

  const critical = allParts.filter((p) =>
    ["near", "low", "out"].includes(stockLevel(p))
  );

  if (!critical.length) {
    const li = document.createElement("li");
    li.textContent = "ยังไม่มีอะไหล่ใกล้หมด 🎉";
    ul.appendChild(li);
    return;
  }

  critical.sort((a, b) => {
    const ratioA =
      (a.Min || 0) === 0 ? (a.Qty || 0) : (a.Qty || 0) / (a.Min || 1);
    const ratioB =
      (b.Min || 0) === 0 ? (b.Qty || 0) : (b.Qty || 0) / (b.Min || 1);
    return ratioA - ratioB;
  });

  critical.forEach((p) => {
    const level = stockLevel(p);
    let label = "";
    if (level === "out") label = "หมดสต็อก";
    else if (level === "low") label = "ต่ำกว่า Min";
    else label = "ใกล้หมด";

    const li = document.createElement("li");
    li.className = "plan-item";
    li.innerHTML = `
      <div class="plan-main">
        <div class="plan-title">${p.PartID || ""} - ${p.Name || ""}</div>
        <div class="plan-sub">${p.Brand || "-"} ${p.Model || ""}</div>
      </div>
      <div class="plan-status">
        คงเหลือ ${p.Qty ?? 0} / Min ${p.Min ?? 0}
        <span class="tag tag-${level}">${label}</span>
      </div>
    `;
    li.addEventListener("click", () => openPartDetail(p));
    ul.appendChild(li);
  });
}

function updatePartDatalist() {
  const dl = $("#partIdList");
  if (!dl) return;
  dl.innerHTML = "";
  allParts.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.PartID || "";
    opt.label = `${p.PartID || ""} - ${p.Name || ""}`;
    dl.appendChild(opt);
  });
}

// ========== Modal: เปิด / ปิด ==========
function fillPartForm(p) {
  $("#partPartID").value = p.PartID || "";
  $("#partName").value = p.Name || "";
  $("#partCategory").value = p.Category || "";
  $("#partBrand").value = p.Brand || "";
  $("#partModel").value = p.Model || "";
  $("#partMin").value = p.Min ?? 0;
  $("#partQty").value = p.Qty ?? 0;
  $("#partLocation").value = p.Location || "";
  $("#partImageURL").value = p.ImageURL || "";
  $("#receivePartID").value = p.PartID || "";

  // เคลียร์ file input ทุกครั้ง
  const fileInput = $("#partImageFile");
  if (fileInput) fileInput.value = "";

  // พรีวิวรูป (ถ้ามี)
  const prevRow = $("#partImagePreviewRow");
  const prevImg = $("#partImagePreview");
  if (prevRow && prevImg) {
    if (p.ImageURL) {
      prevRow.style.display = "block";
      prevImg.src = p.ImageURL;
    } else {
      prevRow.style.display = "none";
      prevImg.src = "";
    }
  }
}

function openPartModal(p) {
  const title = $("#partModal .modal-title");
  if (p) {
    fillPartForm(p);
    if (title) title.textContent = `จัดการอะไหล่ : ${p.PartID || ""}`;
  } else {
    $("#formPart")?.reset();
    $("#formReceive")?.reset();
    $("#partImageURL") && ($("#partImageURL").value = "");
    const fileInput = $("#partImageFile");
    if (fileInput) fileInput.value = "";
    const prevRow = $("#partImagePreviewRow");
    const prevImg = $("#partImagePreview");
    if (prevRow && prevImg) {
      prevRow.style.display = "none";
      prevImg.src = "";
    }
    if (title) title.textContent = "จัดการอะไหล่";
  }

  // default tab = เพิ่ม/แก้ไข
  $$("#partModal .tab").forEach((b) => b.classList.remove("active"));
  $$("#partModal .tab-content").forEach((c) => c.classList.remove("active"));
  $('#partModal .tab[data-tab="tab-part"]')?.classList.add("active");
  $("#tab-part")?.classList.add("active");

  showModal("partModal");
}

/**
 * ใช้ตอนกดปุ่ม "เพิ่มอะไหล่ใหม่" จากผลค้นหาไม่เจอ
 */
function openNewPartFromSearch(keyword) {
  const newId = generateNewPartId();

  const draft = {
    PartID: newId,
    Name: (keyword || "").trim(),
    Category: "",
    Brand: "",
    Model: "",
    Min: 0,
    Qty: 1,
    Location: "",
    ImageURL: ""
  };

  fillPartForm(draft);

  const title = $("#partModal .modal-title");
  if (title) title.textContent = "เพิ่มอะไหล่ใหม่และรับเข้าสต็อก";

  // โฟกัส tab เพิ่ม/แก้ไข
  $$("#partModal .tab").forEach((b) => b.classList.remove("active"));
  $$("#partModal .tab-content").forEach((c) => c.classList.remove("active"));
  $('#partModal .tab[data-tab="tab-part"]')?.classList.add("active");
  $("#tab-part")?.classList.add("active");

  showModal("partModal");
}

function openPartDetail(p) {
  if (!p) return;
  const body = $("#partDetailBody");
  if (!body) return;

  const level = stockLevel(p);
  let label = "";
  let cls = "tag tag-ok";
  if (level === "out") {
    label = "หมดสต็อก";
    cls = "tag tag-out";
  } else if (level === "low") {
    label = "ต่ำกว่า Min";
    cls = "tag tag-low";
  } else if (level === "near") {
    label = "ใกล้หมด";
    cls = "tag tag-near";
  } else {
    label = "ปกติ";
  }

  const qrText = buildQrText(p);

  body.innerHTML = `
    <div class="part-detail-layout">
      <div class="part-detail-image">
        ${
          p.ImageURL
            ? `<img src="${p.ImageURL}" alt="${p.Name || ""}" />`
            : '<div class="part-card-noimage">ไม่มีรูปสำหรับอะไหล่นี้</div>'
        }
      </div>
      <div class="part-detail-info">
        <div class="part-detail-title">
          <div class="code">${p.PartID || "-"}</div>
          <div class="name">${p.Name || ""}</div>
        </div>
        <div class="part-detail-sub">
          <span>${p.Brand || "-"}</span>
          ${p.Model ? `• <span>${p.Model}</span>` : ""}
        </div>
        <div class="part-detail-tags">
          ${p.Category ? `<span class="chip">${p.Category}</span>` : ""}
          <span class="chip">คงเหลือ ${p.Qty ?? 0}</span>
          <span class="chip">Min ${p.Min ?? 0}</span>
          ${p.Location ? `<span class="chip">${p.Location}</span>` : ""}
        </div>
        <div class="part-detail-status">
          <span class="${cls}">${label}</span>
        </div>
        <div class="part-detail-qrtext">
          รหัสสำหรับ QR: <code>${qrText}</code>
        </div>
      </div>
    </div>
  `;

  showModal("partDetailModal");
}

// Modal QR แสดงการ์ดพร้อม QR code
function openQrModal(p) {
  const body = $("#qrModalBody");
  if (!body) return;

  const qrText = buildQrText(p);
  lastQrPartID = p.PartID || null;

  body.innerHTML = `
    <div class="qr-card">
      <div id="qrCanvas"></div>
      <div class="qr-info">
        <div class="qr-title">${p.PartID || ""} — ${p.Name || ""}</div>
        <div class="qr-sub">
          ${(p.Brand || "")} ${p.Model || ""} ${
    p.Location ? " • ที่เก็บ " + p.Location : ""
  }
        </div>
        <div class="qr-sub qr-code-text">${qrText}</div>
      </div>
    </div>
  `;

  // สร้าง QR จริง
  const canvas = document.getElementById("qrCanvas");
  if (canvas) {
    canvas.innerHTML = "";
    new QRCode(canvas, {
      text: qrText,
      width: 180,
      height: 180
    });
  }

  showModal("qrModal");
}

// ========== Render: การ์ดหน้าเบิก ==========
function renderIssueCards() {
  const wrap = $("#issueCards");
  if (!wrap) return;
  wrap.innerHTML = "";

  const searchRaw = ($("#issueSearch")?.value || "").trim();
  const search = searchRaw.toLowerCase();
  const statusFilter = $("#issueStatusFilter")?.value || "all";
  const catFilter = $("#issueCategoryFilter")?.value || "all";

  let parts = allParts.slice();

  if (search) {
    parts = parts.filter((p) => {
      const t = `${p.PartID || ""} ${p.Name || ""} ${p.Category || ""} ${
        p.Brand || ""
      } ${p.Model || ""}`.toLowerCase();
      return t.includes(search);
    });
  }

  if (statusFilter !== "all") {
    parts = parts.filter((p) => stockLevel(p) === statusFilter);
  }

  if (catFilter !== "all") {
    parts = parts.filter((p) => (p.Category || "") === catFilter);
  }

  if (!parts.length) {
    wrap.innerHTML = `
      <div class="empty-message">
        ไม่พบอะไหล่ที่ต้องการ
        ${
          searchRaw
            ? `ตามคำค้น "<strong>${escapeHtml(searchRaw)}</strong>"`
            : ""
        }<br/>
        <button type="button"
          class="btn btn-primary btn-xs btn-add-part-from-search">
          เพิ่มอะไหล่ใหม่และรับเข้าสต็อก
        </button>
      </div>
    `;

    const btn = wrap.querySelector(".btn-add-part-from-search");
    if (btn) {
      btn.addEventListener("click", () => openNewPartFromSearch(searchRaw));
    }
    return;
  }

  parts.forEach((p) => {
    const level = stockLevel(p);
    let label = "";
    let cls = "tag tag-ok";
    if (level === "out") {
      label = "หมดสต็อก";
      cls = "tag tag-out";
    } else if (level === "low") {
      label = "ต่ำกว่า Min";
      cls = "tag tag-low";
    } else if (level === "near") {
      label = "ใกล้หมด";
      cls = "tag tag-near";
    } else {
      label = "ปกติ";
      cls = "tag tag-ok";
    }

    const card = document.createElement("div");
    card.className = "part-card issue-card";
    card.innerHTML = `
      <div class="part-card-image">
        ${
          p.ImageURL
            ? `<img src="${p.ImageURL}" alt="${p.Name || ""}" />`
            : '<div class="part-card-noimage">ไม่มีรูปสำหรับอะไหล่นี้</div>'
        }
      </div>
      <div class="part-card-body">
        <div class="part-card-title">${p.PartID || ""} — ${p.Name || ""}</div>
        <div class="part-card-subtitle">${
          `${p.Brand || ""} ${p.Model || ""}`.trim() ||
          "ไม่มีข้อมูลรุ่น / ยี่ห้อ"
        }</div>
        <div class="part-card-tags">
          ${p.Category ? `<span class="chip">${p.Category}</span>` : ""}
          <span class="chip">คงเหลือ ${p.Qty ?? 0}</span>
          <span class="chip">ขั้นต่ำ ${p.Min ?? 0}</span>
          ${p.Location ? `<span class="chip">${p.Location}</span>` : ""}
        </div>
        <div class="part-card-status">
          <span class="${cls}">${label}</span>
        </div>
        <div class="issue-bottom">
          <div class="issue-qty">
            <label>จำนวน</label>
            <input
              type="number"
              min="1"
              class="issue-qty-input"
              data-partid="${p.PartID}"
              placeholder="จำนวนที่ต้องการเบิก"
            />
          </div>
          <div class="issue-btns">
            <button type="button" class="btn btn-primary btn-issue-card" data-partid="${
              p.PartID
            }">เบิก</button>
          </div>
        </div>
      </div>
    `;

    // คลิกการ์ด = เปิดรายละเอียด
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-issue-card") || e.target.closest("input"))
        return;
      openPartDetail(p);
    });

    wrap.appendChild(card);
  });

  // bind ปุ่มเบิกแต่ละการ์ด
  $$(".btn-issue-card", wrap).forEach((btn) => {
    btn.addEventListener("click", () => {
      const partID = btn.dataset.partid;
      const input = wrap.querySelector(
        `.issue-qty-input[data-partid="${partID}"]`
      );
      const qty = Number(input?.value || 0);
      issueFromCard(partID, qty, btn, input);
    });
  });
}

// ========== Render: การ์ดรีเช็ค ==========
function renderCheckCards() {
  const wrap = $("#checkCards");
  if (!wrap) return;
  wrap.innerHTML = "";

  const search = ($("#checkSearch")?.value || "").trim().toLowerCase();

  let parts = allParts.slice();
  if (search) {
    parts = parts.filter((p) => {
      const t = `${p.PartID || ""} ${p.Name || ""} ${p.Category || ""} ${
        p.Brand || ""
      } ${p.Model || ""}`.toLowerCase();
      return t.includes(search);
    });
  }

  const total = allParts.length;
  const done = Object.keys(checksByPartId).length;
  $("#checkTotal").textContent = total;
  $("#checkDone").textContent = done;

  if (!parts.length) {
    wrap.innerHTML =
      '<div class="empty-message">ไม่พบอะไหล่สำหรับรีเช็ค</div>';
    return;
  }

  parts.forEach((p) => {
    const level = stockLevel(p);
    let levelLabel = "";
    let levelCls = "tag tag-ok";
    if (level === "out") {
      levelLabel = "หมดสต็อก";
      levelCls = "tag tag-out";
    } else if (level === "low") {
      levelLabel = "ต่ำกว่า Min";
      levelCls = "tag tag-low";
    } else if (level === "near") {
      levelLabel = "ใกล้หมด";
      levelCls = "tag tag-near";
    } else {
      levelLabel = "ปกติ";
      levelCls = "tag tag-ok";
    }

    const chk = checksByPartId[p.PartID];
    const counted =
      chk && typeof chk.QtyCounted === "number" ? chk.QtyCounted : "";
    const diff =
      chk && typeof chk.QtyCounted === "number"
        ? chk.QtyCounted - (chk.QtySystem ?? p.Qty ?? 0)
        : "";

    const card = document.createElement("div");
    card.className =
      "part-card check-card" + (chk ? " check-card-done" : "");
    card.innerHTML = `
      <div class="part-card-image">
        ${
          p.ImageURL
            ? `<img src="${p.ImageURL}" alt="${p.Name || ""}" />`
            : '<div class="part-card-noimage">ไม่มีรูปสำหรับอะไหล่นี้</div>'
        }
      </div>
      <div class="part-card-body">
        <div class="part-card-title">${p.PartID || ""} — ${p.Name || ""}</div>
        <div class="part-card-subtitle">${
          `${p.Brand || ""} ${p.Model || ""}`.trim() ||
          "ไม่มีข้อมูลรุ่น / ยี่ห้อ"
        }</div>
        <div class="part-card-tags">
          ${p.Category ? `<span class="chip">${p.Category}</span>` : ""}
          <span class="chip">คงเหลือระบบ ${p.Qty ?? 0}</span>
          <span class="chip">Min ${p.Min ?? 0}</span>
          ${p.Location ? `<span class="chip">${p.Location}</span>` : ""}
          ${
            chk
              ? '<span class="chip chip-checked">เช็คแล้ว</span>'
              : '<span class="chip chip-notchecked">ยังไม่เช็ค</span>'
          }
        </div>
        <div class="part-card-status">
          <span class="${levelCls}">${levelLabel}</span>
        </div>

        <div class="check-bottom-card">
          <div class="check-qty-card">
            <label>นับได้จริง</label>
            <input
              type="number"
              min="0"
              class="check-qty-input"
              data-partid="${p.PartID}"
              value="${counted === "" ? "" : counted}"
              placeholder="จำนวนที่นับได้จริง"
            />
          </div>
          <div class="issue-btns">
            <button type="button"
              class="btn btn-primary btn-xs btn-check-save-card"
              data-partid="${p.PartID}"
            >บันทึก</button>
          </div>
        </div>
        <div class="hint">
          ส่วนต่าง: ${diff === "" ? "-" : diff}
        </div>
      </div>
    `;

    // คลิกการ์ด = ดูรายละเอียด
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-check-save-card") || e.target.closest("input"))
        return;
      openPartDetail(p);
    });

    wrap.appendChild(card);
  });

  // bind ปุ่มบันทึกรีเช็ค
  $$(".btn-check-save-card", wrap).forEach((btn) => {
    btn.addEventListener("click", () => {
      const partID = btn.dataset.partid;
      const input = wrap.querySelector(
        `.check-qty-input[data-partid="${partID}"]`
      );
      const counted = Number(input?.value || 0);
      saveSingleCheck(partID, counted, btn);
    });
  });
}

// ========== Render: หน้าเลือกพิมพ์ QR ==========
function renderQrSelectList() {
  const wrap = $("#qrSelectList");
  if (!wrap) return;

  const search = ($("#qrSearch")?.value || "").trim().toLowerCase();

  let parts = allParts.slice();
  if (search) {
    parts = parts.filter((p) => {
      const t = `${p.PartID || ""} ${p.Name || ""} ${p.Brand || ""} ${
        p.Model || ""
      } ${p.Category || ""}`.toLowerCase();
      return t.includes(search);
    });
  }

  const resultEl = $("#qrResultCount");
  if (resultEl) resultEl.textContent = parts.length;
  const selEl = $("#qrSelectedCount");
  if (selEl) selEl.textContent = qrSelected.size;

  wrap.innerHTML = "";

  if (!parts.length) {
    wrap.innerHTML =
      '<div class="empty-message">ไม่พบอะไหล่สำหรับสร้าง QR</div>';
    return;
  }

  parts.forEach((p) => {
    const checked = qrSelected.has(p.PartID);
    const card = document.createElement("label");
    card.className = "qr-select-card";
    card.innerHTML = `
      <input type="checkbox"
             class="qr-select-checkbox"
             data-partid="${p.PartID || ""}"
             ${checked ? "checked" : ""} />
      <div class="qr-select-main">
        <div class="qr-select-id">${p.PartID || ""}</div>
        <div class="qr-select-name">${p.Name || ""}</div>
        <div class="qr-select-sub">
          ${
            [p.Brand, p.Model, p.Category]
              .filter(Boolean)
              .join(" • ") || "&nbsp;"
          }
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });

  $$(".qr-select-checkbox", wrap).forEach((cb) => {
    cb.addEventListener("change", () => {
      const pid = cb.dataset.partid;
      if (!pid) return;
      if (cb.checked) {
        qrSelected.add(pid);
      } else {
        qrSelected.delete(pid);
      }
      const selEl2 = $("#qrSelectedCount");
      if (selEl2) selEl2.textContent = qrSelected.size;
    });
  });
}

function clearAllQrSelection() {
  qrSelected.clear();
  renderQrSelectList();
  setStatus("ยกเลิกการเลือกทั้งหมดแล้ว", "info");
}

function selectAllVisibleQr() {
  const search = ($("#qrSearch")?.value || "").trim().toLowerCase();

  let parts = allParts.slice();
  if (search) {
    parts = parts.filter((p) => {
      const t = `${p.PartID || ""} ${p.Name || ""} ${p.Brand || ""} ${
        p.Model || ""
      } ${p.Category || ""}`.toLowerCase();
      return t.includes(search);
    });
  }

  parts.forEach((p) => {
    if (p.PartID) qrSelected.add(p.PartID);
  });

  renderQrSelectList();
}

function printSelectedQr() {
  if (!qrSelected || !qrSelected.size) {
    setStatus("กรุณาเลือกอะไหล่ที่จะพิมพ์ QR ก่อน", "error");
    return;
  }

  const selectedParts = allParts.filter((p) => qrSelected.has(p.PartID));
  if (!selectedParts.length) {
    setStatus("ไม่พบอะไหล่ที่เลือกสำหรับพิมพ์ QR", "error");
    return;
  }

  const qrData = selectedParts.map((p) => ({
    id: p.PartID,
    text: buildQrText(p)
  }));

  const cardsHtml = selectedParts
    .map((p) => {
      const title = `${p.PartID || ""} — ${p.Name || ""}`;
      const modelLine = p.Model || "-";
      const brandLine = p.Brand || "-";
      const catLine = p.Category || "-";
      const locationLine = p.Location || "-";
      const qrCodeText = buildQrText(p);

      return `
      <div class="qr-page">
        <div class="qr-print-card">
          <div class="qr-main-qr" id="qrc-${escapeHtml(p.PartID)}"></div>

          <div class="qr-main-text">
            <div class="qr-main-title">${escapeHtml(title)}</div>

            <table class="qr-info-table">
              <tr>
                <th>MODEL</th>
                <td>${escapeHtml(modelLine)}</td>
              </tr>
              <tr>
                <th>ยี่ห้อ</th>
                <td>${escapeHtml(brandLine)}</td>
              </tr>
              <tr>
                <th>หมวดหมู่</th>
                <td>${escapeHtml(catLine)}</td>
              </tr>
              <tr>
                <th>ที่เก็บ</th>
                <td>${escapeHtml(locationLine)}</td>
              </tr>
              <tr>
                <th>QR CODE</th>
                <td>${escapeHtml(qrCodeText)}</td>
              </tr>
            </table>

            <div class="qr-main-foot">Spare Parts Stock • Maintenance</div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("โปรดอนุญาตป๊อปอัปของเบราว์เซอร์เพื่อสั่งพิมพ์");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8" />
  <title></title>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Prompt", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff;
    }

    @page {
      size: A6;
      margin: 5mm;
    }

    .qr-page {
      width: 100%;
      height: 100%;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      break-after: page;
    }

    .qr-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    .qr-print-card {
      width: 100%;
      height: 100%;
      padding: 6mm 6mm 5mm;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      text-align: center;
    }

    .qr-main-qr {
      width: 60mm;
      height: 60mm;
      margin-bottom: 4mm;
    }
    .qr-main-qr img,
    .qr-main-qr canvas {
      width: 100%;
      height: 100%;
    }

    .qr-main-text {
      max-width: 70mm;
    }

    .qr-main-title {
      font-size: 4mm;
      font-weight: 600;
      margin-bottom: 2mm;
    }

    .qr-info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 3mm;
      margin-bottom: 2mm;
    }

    .qr-info-table th,
    .qr-info-table td {
      padding: 1mm 1.5mm;
      border-bottom: 0.2mm solid #e5e7eb;
      text-align: left;
    }

    .qr-info-table th {
      width: 26mm;
      font-weight: 600;
      color: #111827;
      background: #f3f4f6;
    }

    .qr-info-table td {
      color: #4b5563;
    }

    .qr-info-table tr:first-child th,
    .qr-info-table tr:first-child td {
      font-weight: 700;
    }

    .qr-main-foot {
      font-size: 2.6mm;
      color: #9ca3af;
      margin-top: 1.2mm;
    }
  </style>
</head>
<body>
  ${cardsHtml}

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script>
    const qrData = ${JSON.stringify(qrData)};
    qrData.forEach(function (item) {
      var el = document.getElementById("qrc-" + item.id);
      if (el) {
        new QRCode(el, {
          text: item.text,
          width: 240,
          height: 240
        });
      }
    });

    setTimeout(function () {
      window.print();
    }, 1500);
  </script>
</body>
</html>`);
  printWindow.document.close();

  setStatus("กำลังเตรียมหน้าพิมพ์ QR แบบ A6 + ตารางข้อมูล...", "info");
}

// ========== Update state helper ==========
function updateLocalPart(updated) {
  if (!updated || !updated.PartID) return;
  const idx = allParts.findIndex((p) => p.PartID === updated.PartID);
  if (idx >= 0) {
    allParts[idx] = updated;
  } else {
    allParts.push(updated);
  }
  renderParts();
  updateDashboard();
  updatePartDatalist();
  renderIssueCards();
  renderCheckCards();
  renderQrSelectList();
}

// ========== Actions: Save Part ==========
async function onSavePart(ev) {
  ev.preventDefault();
  if (!supa) return;

  const btn = ev.target.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  const partId = $("#partPartID").value.trim();
  const name = $("#partName").value.trim();

  if (!partId) {
    setStatus("กรุณากรอกรหัสอะไหล่ (PartID)", "error");
    if (btn) btn.disabled = false;
    return;
  }
  if (!name) {
    setStatus("กรุณากรอกชื่ออะไหล่", "error");
    if (btn) btn.disabled = false;
    return;
  }

  // จัดการรูปภาพ: ถ้ามีไฟล์ใหม่ → อัปโหลด, ถ้าไม่มีใช้ URL เดิม
  let imageUrl = $("#partImageURL").value.trim() || null;
  const fileInput = $("#partImageFile");
  const file = fileInput && fileInput.files ? fileInput.files[0] : null;

  if (file) {
    setStatus("กำลังอัปโหลดรูปอะไหล่...", "info");
    const uploaded = await uploadPartImage(file, partId);
    if (!uploaded) {
      if (btn) btn.disabled = false;
      return;
    }
    imageUrl = uploaded;
    $("#partImageURL").value = uploaded;

    const prevRow = $("#partImagePreviewRow");
    const prevImg = $("#partImagePreview");
    if (prevRow && prevImg) {
      prevRow.style.display = "block";
      prevImg.src = uploaded;
    }
  }

  const payload = {
    PartID: partId,
    Name: name,
    Category: $("#partCategory").value.trim() || null,
    Brand: $("#partBrand").value.trim() || null,
    Model: $("#partModel").value.trim() || null,
    Min: Number($("#partMin").value || 0),
    Qty: Number($("#partQty").value || 0),
    Location: $("#partLocation").value.trim() || null,
    ImageURL: imageUrl
  };

  setStatus("กำลังบันทึกอะไหล่...", "info");
  const { data, error } = await supa.from("parts").upsert(payload).select();

  if (error) {
    console.error(error);
    setStatus("บันทึกอะไหล่ไม่สำเร็จ: " + error.message, "error");
  } else {
    setStatus("บันทึกอะไหล่เรียบร้อย", "success");
    if (data && data[0]) updateLocalPart(data[0]);
  }

  if (btn) btn.disabled = false;
}

// ========== Actions: เบิกจากการ์ด ==========
async function issueFromCard(partID, qty, btn, input) {
  if (!supa) return;
  if (!partID || qty <= 0) {
    setStatus("กรุณากรอกจำนวนเบิกให้ถูกต้อง", "error");
    return;
  }

  if (btn) btn.disabled = true;

  setStatus("กำลังบันทึกการเบิก...", "info");
  const { data, error } = await supa.rpc("issue_part", {
    part_id: partID,
    qty,
    by_name: $("#issueBy")?.value.trim() || null,
    machine: $("#issueMachine")?.value || null,
    dept: $("#issueDept")?.value || null,
    note: $("#issueNote")?.value.trim() || null
  });

  if (error) {
    console.error(error);
    setStatus("เบิกไม่สำเร็จ: " + error.message, "error");
  } else {
    setStatus("บันทึกการเบิกเรียบร้อย", "success");
    if (input) input.value = "";
    if (data) updateLocalPart(data);
    await loadTxns();
  }

  if (btn) btn.disabled = false;
}

// ========== Actions: รับเข้าสต็อก ==========
async function onReceive(ev) {
  ev.preventDefault();
  if (!supa) return;

  const btn = ev.target.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  const partID = $("#receivePartID").value.trim();
  const qty = Number($("#receiveQty").value || 0);

  if (!partID || qty <= 0) {
    setStatus("กรุณากรอกรหัสอะไหล่และจำนวนรับเข้าให้ถูกต้อง", "error");
    if (btn) btn.disabled = false;
    return;
  }

  setStatus("กำลังบันทึกรับเข้าสต็อก...", "info");
  const { data, error } = await supa.rpc("receive_part", {
    part_id: partID,
    qty
  });

  if (error) {
    console.error(error);
    setStatus("รับเข้าสต็อกไม่สำเร็จ: " + error.message, "error");
  } else {
    setStatus("บันทึกรับเข้าสต็อกเรียบร้อย", "success");
    ev.target.reset();
    if (data) updateLocalPart(data);
    await loadTxns();
  }

  if (btn) btn.disabled = false;
}

// ========== Actions: บันทึกรีเช็ค + ปรับยอด Qty ==========
async function saveSingleCheck(partID, counted, btn) {
  if (!supa) return;
  if (counted < 0) {
    setStatus("จำนวนที่นับได้ต้องไม่ติดลบ", "error");
    return;
  }

  const part = allParts.find((p) => p.PartID === partID);
  if (!part) return;

  const dateVal = $("#checkDate")?.value || todayStr();
  const byName = $("#checkBy")?.value.trim() || null;
  const qtySystem = part.Qty ?? 0;

  const payload = {
    Date: dateVal,
    PartID: partID,
    QtySystem: qtySystem,
    QtyCounted: counted,
    By: byName
  };

  if (btn) btn.disabled = true;
  setStatus("กำลังบันทึกผลรีเช็ค...", "info");

  const { error } = await supa
    .from("stock_checks")
    .upsert(payload, { onConflict: "Date,PartID" });

  if (error) {
    console.error(error);
    setStatus("บันทึกประวัติรีเช็คไม่สำเร็จ: " + error.message, "error");
    if (btn) btn.disabled = false;
    return;
  }

  const { data: updated, error: err2 } = await supa
    .from("parts")
    .update({ Qty: counted })
    .eq("PartID", partID)
    .select()
    .single();

  if (err2) {
    console.error(err2);
    setStatus(
      "บันทึกรีเช็คแล้ว แต่ปรับยอดสต็อกไม่สำเร็จ: " + err2.message,
      "error"
    );
  } else {
    setStatus("บันทึกรีเช็คและปรับยอดสต็อกเรียบร้อย", "success");
    if (updated) updateLocalPart(updated);
  }

  await loadChecksForDate(dateVal);

  if (btn) btn.disabled = false;
}

// ========== Actions: Export CSV ==========
function csvEscape(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportParts() {
  if (!allParts.length) {
    setStatus("ยังไม่มีข้อมูลสำหรับส่งออก", "error");
    return;
  }

  const scope = $("#exportScope")?.value || "critical";
  let parts = allParts.slice();

  if (scope === "out") {
    parts = parts.filter((p) => stockLevel(p) === "out");
  } else if (scope === "critical") {
    parts = parts.filter((p) =>
      ["out", "low", "near"].includes(stockLevel(p))
    );
  }

  if (!parts.length) {
    setStatus("ไม่พบอะไหล่ตามเงื่อนไขสำหรับส่งออก", "error");
    return;
  }

  const headers = [
    "PartID",
    "Name",
    "Category",
    "Brand",
    "Model",
    "Qty",
    "Min",
    "Location",
    "Status",
    "QR_Text"
  ];

  const rows = parts.map((p) => {
    const level = stockLevel(p);
    return [
      p.PartID || "",
      p.Name || "",
      p.Category || "",
      p.Brand || "",
      p.Model || "",
      p.Qty ?? 0,
      p.Min ?? 0,
      p.Location || "",
      level,
      buildQrText(p)
    ];
  });

  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((r) => r.map(csvEscape).join(","))
  ];

  const csv = lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const suffix = scope === "all" ? "all" : scope;
  a.href = url;
  a.download = `parts_${suffix}_${todayStr()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  setStatus("ส่งออก CSV เรียบร้อย", "success");
}

// ========== UI Bindings ==========
function bindUI() {
  if (!supa) {
    setStatus(
      "กรุณาตั้งค่า window.SUPA.url และ window.SUPA.anon ใน index.html ให้ถูกต้อง",
      "error"
    );
    return;
  }

  // Tabs ใน modal part
  $$("#partModal .tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      $$("#partModal .tab").forEach((b) => b.classList.remove("active"));
      $$("#partModal .tab-content").forEach((c) =>
        c.classList.remove("active")
      );
      btn.classList.add("active");
      const tab = $("#" + tabId);
      if (tab) tab.classList.add("active");
    });
  });

  // Tabs หน้าหลัก
  $$(".main-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scr = btn.dataset.screen;
      $$(".main-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      $$(".screen").forEach((s) => s.classList.remove("active"));
      const target = $("#" + scr);
      if (target) target.classList.add("active");
    });
  });

  // Filter ตารางสต็อก
  $("#searchInput")?.addEventListener("input", renderParts);
  $("#statusFilter")?.addEventListener("change", renderParts);

  // Filter หน้าเบิก
  $("#issueSearch")?.addEventListener("input", renderIssueCards);
  $("#issueStatusFilter")?.addEventListener("change", renderIssueCards);
  $("#issueCategoryFilter")?.addEventListener("change", renderIssueCards);

  // ปุ่มสแกน QR หน้าเบิก
  $("#btnScanQr")?.addEventListener("click", (e) => {
    e.preventDefault();
    startQrScan();
  });

  // Filter หน้ารีเช็ค
  $("#checkSearch")?.addEventListener("input", renderCheckCards);

  // หน้าเลือกพิมพ์ QR
  $("#qrSearch")?.addEventListener("input", renderQrSelectList);
  $("#qrSelectAllVisible")?.addEventListener("click", (e) => {
    e.preventDefault();
    selectAllVisibleQr();
  });
  $("#qrClearAll")?.addEventListener("click", (e) => {
    e.preventDefault();
    clearAllQrSelection();
  });
  $("#btnPrintSelectedQr")?.addEventListener("click", (e) => {
    e.preventDefault();
    printSelectedQr();
  });

  // Form actions
  $("#formPart")?.addEventListener("submit", onSavePart);
  $("#formReceive")?.addEventListener("submit", onReceive);

  $("#btnClearPart")?.addEventListener("click", () => {
    $("#formPart")?.reset();
    $("#partImageURL") && ($("#partImageURL").value = "");
    const fileInput = $("#partImageFile");
    if (fileInput) fileInput.value = "";
    const prevRow = $("#partImagePreviewRow");
    const prevImg = $("#partImagePreview");
    if (prevRow && prevImg) {
      prevRow.style.display = "none";
      prevImg.src = "";
    }
  });
  $("#btnClearReceive")?.addEventListener("click", () => {
    $("#formReceive")?.reset();
  });

  $("#btnRefresh")?.addEventListener("click", () => {
    refreshAll();
  });

  // Export CSV
  $("#btnExportCsv")?.addEventListener("click", exportParts);

  // ปุ่มพิมพ์ QR ใน modal (พิมพ์เฉพาะรายการเดียว)
  $("#btnQrPrint")?.addEventListener("click", () => {
    if (lastQrPartID) {
      qrSelected = new Set([lastQrPartID]);
      printSelectedQr();
    } else {
      setStatus("ไม่พบข้อมูลอะไหล่สำหรับพิมพ์ QR", "error");
    }
  });

  // วันที่รีเช็ค default = วันนี้
  const dateInput = $("#checkDate");
  if (dateInput && !dateInput.value) {
    dateInput.value = todayStr();
  }
  dateInput?.addEventListener("change", (e) => {
    const v = e.target.value || todayStr();
    loadChecksForDate(v);
  });

  // modal close buttons + คลิกพื้นหลัง (รวม qrScanModal)
  ["partModal", "partDetailModal", "qrModal", "qrScanModal"].forEach((id) => {
    const root = document.getElementById(id);
    if (!root) return;

    root.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => hideModal(id));
    });

    root.addEventListener("click", (e) => {
      if (e.target === root) hideModal(id);
    });
  });

  hideModal("partModal");
  hideModal("partDetailModal");
  hideModal("qrModal");
  hideModal("qrScanModal");
}

// ========== Refresh All ==========
async function refreshAll() {
  if (!supa) return;
  setStatus("กำลังโหลดข้อมูลทั้งหมด...", "info");

  const today = todayStr();
  const dateInput = $("#checkDate");
  if (dateInput && !dateInput.value) dateInput.value = today;

  await Promise.all([loadLists(), loadParts(), loadTxns()]);
  await loadChecksForDate(dateInput ? dateInput.value : today);

  setStatus("โหลดข้อมูลล่าสุดแล้ว", "success");
}

// ========== Init ==========
document.addEventListener("DOMContentLoaded", () => {
  bindUI();
  if (supa) {
    refreshAll();
  }
});

// ========== QR Scan (สแกนจากกล้อง) ==========
let qrScanStream = null;
let qrScanFrameId = null;

async function startQrScan() {
  const video = document.getElementById("qrVideo");
  if (!video) {
    setStatus("ไม่พบ element วิดีโอสำหรับสแกน QR (#qrVideo)", "error");
    return;
  }

  // เปิด modal สแกน
  showModal("qrScanModal");

  try {
    // ขอสิทธิ์กล้อง (ใช้กล้องหลังถ้ามี)
    qrScanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = qrScanStream;
    await video.play();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    function tick() {
      if (!video.videoWidth || !video.videoHeight) {
        qrScanFrameId = requestAnimationFrame(tick);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (window.jsQR) {
        const code = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: "dontInvert"
        });
        if (code && code.data) {
          handleQrResult(code.data);
          return;
        }
      }

      qrScanFrameId = requestAnimationFrame(tick);
    }

    qrScanFrameId = requestAnimationFrame(tick);
    setStatus("กำลังสแกน QR จากกล้อง...", "info");
  } catch (err) {
    console.error(err);
    setStatus("ไม่สามารถเปิดกล้องได้ กรุณาเช็คสิทธิ์กล้องหรือใช้ HTTPS", "error");
    hideModal("qrScanModal");
  }
}

function stopQrScan() {
  try {
    if (qrScanFrameId) {
      cancelAnimationFrame(qrScanFrameId);
      qrScanFrameId = null;
    }
    if (qrScanStream) {
      qrScanStream.getTracks().forEach((t) => t.stop());
      qrScanStream = null;
    }
  } catch (_) {}
}

/**
 * จัดการผลลัพธ์ที่สแกนได้จาก QR
 * รูปแบบที่สร้างไว้: MPR:PartID|Model
 */
function handleQrResult(text) {
  stopQrScan();
  hideModal("qrScanModal");

  let partId = text.trim();

  const m = text.match(/^MPR:([^|]+)/i);
  if (m) {
    partId = m[1].trim();
  }

  // ใส่รหัสลงช่องค้นหาหน้าเบิก
  const searchInput = document.getElementById("issueSearch");
  if (searchInput) {
    searchInput.value = partId;
    renderIssueCards();
  }

  const p = allParts.find((x) => x.PartID === partId);
  if (p) {
    setStatus(`สแกน QR สำเร็จ: ${partId} - ${p.Name || ""}`, "success");
  } else {
    setStatus(`สแกนได้: ${text} (ไม่พบรหัส ${partId} ในสต็อก)`, "error");
  }
}
