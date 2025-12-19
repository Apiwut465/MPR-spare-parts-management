// ========== i18n (TH/EN) ==========

const i18n = {
  th: {
    appTitle: "Spare Parts Stock",
    appSubtitle: "ระบบจัดการสต็อกอะไหล่สำหรับ Maintenance & ฝ่ายบัญชี",
    btnRefresh: "รีเฟรชข้อมูล",

    statTotalPartsLabel: "จำนวนอะไหล่ทั้งหมด",
    statNearLowLabel: "อะไหล่ใกล้หมด / ต่ำกว่า Min",
    statOutLabel: "หมดสต็อก",

    tabPlan: "รายการที่ควรวางแผนซื้อ",
    tabStock: "สต็อกอะไหล่",
    tabIssue: "เบิกอะไหล่",
    tabCheck: "รีเช็คสต็อก",
    tabHistory: "ประวัติการเคลื่อนไหว",
    tabQr: "พิมพ์ QR Code",

    planTitle: "รายการอะไหล่ที่ควรวางแผนสั่งซื้อ",
    planSubtitle:
      "แสดงรายการอะไหล่ที่ใกล้หมด ต่ำกว่า Min หรือหมดสต็อก เพื่อใช้วางแผนจัดซื้อ",
    lowStatusAll: "ทุกสถานะ",
    lowStatusOut: "หมดสต็อก",
    lowStatusLow: "ต่ำกว่า Min",
    lowStatusNear: "ใกล้หมด",
    lowCategoryAll: "ทุกหมวดหมู่",
    lowSearchPlaceholder: "ค้นหาจากรหัส / ชื่อ / รุ่น",

    stockPanelTitle: "สต็อกอะไหล่ทั้งหมด",
    stockSearchPlaceholder: "ค้นหารหัส / ชื่อ / รุ่น / ยี่ห้อ",
    stockStatusAll: "ทุกสถานะ",
    stockStatusOk: "ปกติ",
    stockStatusNear: "ใกล้หมด",
    stockStatusLow: "ต่ำกว่า Min",
    stockStatusOut: "หมดสต็อก",

    exportLabel: "ส่งออกรายการ:",
    exportScopeCritical: "ใกล้หมด / ต่ำกว่า Min / หมด",
    exportScopeOut: "เฉพาะหมดสต็อก",
    exportScopeAll: "ทั้งหมด",
    btnExportCsv: "ส่งออก CSV",

    thName: "ชื่ออะไหล่",
    thCategory: "หมวดหมู่",
    thBrand: "ยี่ห้อ",
    thModel: "รุ่น",
    thMin: "Min",
    thQty: "คงเหลือ",
    thLocation: "ที่เก็บ",
    thActions: "จัดการ",

    issuePanelTitle: "เบิกอะไหล่",
    issueByLabel: "ผู้เบิก / ช่าง",
    issueDeptLabel: "แผนก",
    issueDeptPlaceholder: "-- เลือกแผนก --",
    issueMachineLabel: "เครื่องจักร",
    issueMachinePlaceholder: "-- เลือกเครื่องจักร --",
    issueNoteLabel: "หมายเหตุ",
    issueScanQr: "สแกน QR เพื่อเลือกอะไหล่",
    issueSearchPlaceholder: "ค้นหาจากรหัส / ชื่อ / รุ่น / ยี่ห้อ",
    issueStatusAll: "ทุกสถานะ",
    issueStatusOk: "ปกติ",
    issueStatusNear: "ใกล้หมด",
    issueStatusLow: "ต่ำกว่า Min",
    issueStatusOut: "หมดสต็อก",
    issueCategoryAll: "ทุกหมวดหมู่",
    issueQtyLabel: "จำนวน",
    issueQtyPlaceholder: "จำนวนที่ต้องการเบิก",
    issueBtnText: "เบิก",

    checkPanelTitle: "รีเช็คสต็อก",
    checkDateLabel: "วันที่รีเช็ค",
    checkByLabel: "ผู้เช็ค",
    checkProgressLabel: "เช็คแล้ว",
    checkSearchPlaceholder: "ค้นหาจากรหัส / ชื่อ / รุ่น / ยี่ห้อ",

    checkRealCountLabel: "นับได้จริง",
    checkRealCountPlaceholder: "จำนวนที่นับได้จริง",
    checkSaveButton: "บันทึก",
    checkDiffLabel: "ส่วนต่าง",
    checkChipChecked: "เช็คแล้ว",
    checkChipNotChecked: "ยังไม่เช็ค",

    historyTitle: "ประวัติการเคลื่อนไหวล่าสุด",
    historySubtitle: "แสดง 50 รายการล่าสุดของการเบิก / รับเข้าสต็อก",
    historyThDateTime: "วันที่ / เวลา",
    historyThType: "ประเภท",
    historyThQty: "จำนวน",
    historyThBy: "โดย",
    historyThNote: "หมายเหตุ",

    qrPanelTitle: "พิมพ์ QR Code",
    qrSearchPlaceholder:
      "ค้นหาจาก PartID / ชื่อ / รุ่น / ยี่ห้อ / หมวดหมู่",
    qrSelectAllVisible: "เลือกทั้งหมด (เฉพาะที่เห็น)",
    qrClearAll: "ล้างการเลือก",
    qrResultLabel: "รายการทั้งหมด",
    qrSelectedLabel: "เลือกแล้ว",
    qrPrintSelectedQr: "พิมพ์ QR ที่เลือก (A6)",
    qrModalTitle: "QR Code สำหรับอะไหล่",
    qrPrintOne: "พิมพ์ป้าย A6 รายการนี้",

    partModalTitle: "จัดการอะไหล่",
    tabPartInfo: "เพิ่ม / แก้ไขอะไหล่",
    tabReceive: "รับเข้าสต็อก",
    formPartIdLabel: "รหัสอะไหล่",
    formNameLabel: "ชื่ออะไหล่",
    formCategoryLabel: "หมวดหมู่",
    formBrandLabel: "ยี่ห้อ",
    formModelLabel: "รุ่น / Model",
    formLocationLabel: "ที่เก็บ",
    formMinLabel: "Min (จุดเตือน)",
    formQtyLabel: "คงเหลือปัจจุบัน",
    formImageUrlLabel: "ลิงก์รูปภาพ (ถ้ามี)",
    formImageFileLabel: "หรืออัปโหลดไฟล์รูป (อัปโหลดเข้า Supabase)",
    formImagePreviewLabel: "พรีวิวรูป",
    btnSavePart: "บันทึกอะไหล่",
    btnClearPart: "ล้างฟอร์ม",

    receivePartIdLabel: "รหัสอะไหล่ที่รับเข้า",
    receiveQtyLabel: "จำนวนรับเข้า",
    btnSaveReceive: "บันทึกรับเข้าสต็อก",
    btnClearReceive: "ล้างฟอร์ม",

    partDetailTitle: "รายละเอียดอะไหล่",

    qrScanTitle: "สแกน QR จากกล้อง",
    qrScanHint:
      "เล็งกล้องไปที่ QR Code ระบบจะค้นหาอะไหล่ให้อัตโนมัติเมื่อสแกนสำเร็จ",
    qrScanClose: "ปิด"
  },

  en: {
    appTitle: "Spare Parts Stock",
    appSubtitle: "Spare parts stock system for Maintenance & Accounting",
    btnRefresh: "Refresh",

    statTotalPartsLabel: "Total parts",
    statNearLowLabel: "Near min / under min / out",
    statOutLabel: "Out of stock",

    tabPlan: "Plan to Purchase",
    tabStock: "Stock",
    tabIssue: "Issue Parts",
    tabCheck: "Stock Recheck",
    tabHistory: "Transaction History",
    tabQr: "Print QR Code",

    planTitle: "Parts that should be planned for purchase",
    planSubtitle:
      "Show parts that are near min, below min, or out of stock for purchase planning.",
    lowStatusAll: "All statuses",
    lowStatusOut: "Out of stock",
    lowStatusLow: "Below Min",
    lowStatusNear: "Near Min",
    lowCategoryAll: "All categories",
    lowSearchPlaceholder: "Search by ID / name / model",

    stockPanelTitle: "All spare parts in stock",
    stockSearchPlaceholder: "Search by ID / name / model / brand",
    stockStatusAll: "All statuses",
    stockStatusOk: "Normal",
    stockStatusNear: "Near Min",
    stockStatusLow: "Below Min",
    stockStatusOut: "Out of stock",

    exportLabel: "Export:",
    exportScopeCritical: "Near / below Min / out",
    exportScopeOut: "Only out of stock",
    exportScopeAll: "All items",
    btnExportCsv: "Export CSV",

    thName: "Part name",
    thCategory: "Category",
    thBrand: "Brand",
    thModel: "Model",
    thMin: "Min",
    thQty: "Qty",
    thLocation: "Location",
    thActions: "Actions",

    issuePanelTitle: "Issue parts",
    issueByLabel: "Issuer / Technician",
    issueDeptLabel: "Department",
    issueDeptPlaceholder: "-- Select department --",
    issueMachineLabel: "Machine",
    issueMachinePlaceholder: "-- Select machine --",
    issueNoteLabel: "Note",
    issueScanQr: "Scan QR to select part",
    issueSearchPlaceholder: "Search by ID / name / model / brand",
    issueStatusAll: "All statuses",
    issueStatusOk: "Normal",
    issueStatusNear: "Near Min",
    issueStatusLow: "Below Min",
    issueStatusOut: "Out of stock",
    issueCategoryAll: "All categories",
    issueQtyLabel: "Quantity",
    issueQtyPlaceholder: "Qty to issue",
    issueBtnText: "Issue",

    checkPanelTitle: "Stock recheck",
    checkDateLabel: "Check date",
    checkByLabel: "Checker",
    checkProgressLabel: "Checked",
    checkSearchPlaceholder: "Search by ID / name / model / brand",

    checkRealCountLabel: "Actual count",
    checkRealCountPlaceholder: "Enter actual quantity",
    checkSaveButton: "Save",
    checkDiffLabel: "Difference",
    checkChipChecked: "Checked",
    checkChipNotChecked: "Not checked",

    historyTitle: "Latest stock movements",
    historySubtitle: "Show 50 latest issue / receive transactions",
    historyThDateTime: "Date / time",
    historyThType: "Type",
    historyThQty: "Qty",
    historyThBy: "By",
    historyThNote: "Note",

    qrPanelTitle: "Print QR Codes",
    qrSearchPlaceholder:
      "Search by PartID / name / model / brand / category",
    qrSelectAllVisible: "Select all (visible only)",
    qrClearAll: "Clear selection",
    qrResultLabel: "Total",
    qrSelectedLabel: "Selected",
    qrPrintSelectedQr: "Print selected QR (A6)",
    qrModalTitle: "QR Code for part",
    qrPrintOne: "Print A6 label for this part",

    partModalTitle: "Manage part",
    tabPartInfo: "Add / Edit part",
    tabReceive: "Receive stock",
    formPartIdLabel: "Part ID",
    formNameLabel: "Part name",
    formCategoryLabel: "Category",
    formBrandLabel: "Brand",
    formModelLabel: "Model",
    formLocationLabel: "Location",
    formMinLabel: "Min (alert point)",
    formQtyLabel: "Current qty",
    formImageUrlLabel: "Image URL (optional)",
    formImageFileLabel: "Or upload image file (upload to Supabase)",
    formImagePreviewLabel: "Preview",
    btnSavePart: "Save part",
    btnClearPart: "Clear form",

    receivePartIdLabel: "Part ID to receive",
    receiveQtyLabel: "Receive qty",
    btnSaveReceive: "Save receive",
    btnClearReceive: "Clear form",

    partDetailTitle: "Part detail",

    qrScanTitle: "Scan QR from camera",
    qrScanHint:
      "Point the camera to the QR code. The system will search the part automatically when detected.",
    qrScanClose: "Close"
  }
};

let currentLang = "th";

function t(key) {
  const dict = i18n[currentLang] || i18n.th;
  return dict[key] || i18n.th[key] || "";
}

function applyI18n() {
  // text nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const txt = t(key);
    if (txt) el.textContent = txt;
  });

  // placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const txt = t(key);
    if (txt) el.placeholder = txt;
  });

  // ต้อง re-render card ต่าง ๆ ให้ใช้ข้อความภาษาใหม่
  renderParts();
  renderIssueCards();
  renderCheckCards();
  renderQrSelectList();
  updateDashboard();
}

function setupLanguageSwitcher() {
  const btnTh = document.getElementById("langTh");
  const btnEn = document.getElementById("langEn");

  function updateButtons() {
    if (btnTh && btnEn) {
      if (currentLang === "th") {
        btnTh.classList.add("btn-secondary");
        btnTh.classList.remove("btn-ghost");
        btnEn.classList.add("btn-ghost");
        btnEn.classList.remove("btn-secondary");
      } else {
        btnEn.classList.add("btn-secondary");
        btnEn.classList.remove("btn-ghost");
        btnTh.classList.add("btn-ghost");
        btnTh.classList.remove("btn-secondary");
      }
    }
  }

  if (btnTh) {
    btnTh.addEventListener("click", () => {
      currentLang = "th";
      updateButtons();
      applyI18n();
    });
  }
  if (btnEn) {
    btnEn.addEventListener("click", () => {
      currentLang = "en";
      updateButtons();
      applyI18n();
    });
  }

  updateButtons();
}

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

const IMAGE_BUCKET = "part-images";

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
let checksByPartId = {};
let currentCheckDate = null;

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
  el.classList.remove("hidden");
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("hidden");
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

  // datalist category
  const dlCat = $("#categoryList");
  if (dlCat) {
    dlCat.innerHTML = "";
    (lists.categories || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      dlCat.appendChild(opt);
    });
  }

  // filter หน้าเบิก
  const issueCatSel = $("#issueCategoryFilter");
  if (issueCatSel) {
    issueCatSel.innerHTML = `<option value="all" data-i18n="issueCategoryAll">${t(
      "issueCategoryAll"
    )}</option>`;
    (lists.categories || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      issueCatSel.appendChild(opt);
    });
  }

  // filter หน้า plan
  const lowCatSel = $("#lowCategoryFilter");
  if (lowCatSel) {
    lowCatSel.innerHTML = `<option value="all" data-i18n="lowCategoryAll">${t(
      "lowCategoryAll"
    )}</option>`;
    (lists.categories || []).forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      lowCatSel.appendChild(opt);
    });
  }

  // machines
  const selMachine = $("#issueMachine");
  if (selMachine) {
    selMachine.innerHTML = `<option value="" data-i18n="issueMachinePlaceholder">${t(
      "issueMachinePlaceholder"
    )}</option>`;
    (lists.machines || []).forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m;
      selMachine.appendChild(opt);
    });
  }

  // departments
  const selDept = $("#issueDept");
  if (selDept) {
    selDept.innerHTML = `<option value="" data-i18n="issueDeptPlaceholder">${t(
      "issueDeptPlaceholder"
    )}</option>`;
    (lists.depts || []).forEach((d) => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      selDept.appendChild(opt);
    });
  }

  applyI18n();
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

// ========== Load stock_checks ==========

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

// ========== Render: Stock table + Dashboard ==========

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

    tr.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn-manage-part") ||
        e.target.closest(".btn-qrcode")
      )
        return;
      openPartDetail(p);
    });

    const btnManage = tr.querySelector(".btn-manage-part");
    if (btnManage) {
      btnManage.addEventListener("click", (e) => {
        e.stopPropagation();
        openPartModal(p);
      });
    }

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

  const statusFilter = $("#lowStatusFilter")?.value || "all";
  const catFilter = $("#lowCategoryFilter")?.value || "all";
  const search = ($("#lowSearch")?.value || "").trim().toLowerCase();

  let critical = allParts.filter((p) =>
    ["near", "low", "out"].includes(stockLevel(p))
  );

  if (statusFilter !== "all") {
    critical = critical.filter((p) => stockLevel(p) === statusFilter);
  }

  if (catFilter !== "all") {
    critical = critical.filter((p) => (p.Category || "") === catFilter);
  }

  if (search) {
    critical = critical.filter((p) => {
      const t = `${p.PartID || ""} ${p.Name || ""} ${p.Brand || ""} ${
        p.Model || ""
      }`.toLowerCase();
      return t.includes(search);
    });
  }

  if (!critical.length) {
    const li = document.createElement("li");
    li.textContent = "ยังไม่มีอะไหล่ตามเงื่อนไขตัวกรอง 🎉";
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

// ========== Modal: Part ==========

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

  const fileInput = $("#partImageFile");
  if (fileInput) fileInput.value = "";

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
    if (title)
      title.textContent = `${t("partModalTitle")} : ${p.PartID || ""}`;
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
    if (title) title.textContent = t("partModalTitle");
  }

  $$("#partModal .tab").forEach((b) => b.classList.remove("active"));
  $$("#partModal .tab-content").forEach((c) => c.classList.remove("active"));
  $('#partModal .tab[data-tab="tab-part"]')?.classList.add("active");
  $("#tab-part")?.classList.add("active");

  showModal("partModal");
}

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

// ========== Render: Issue Cards ==========

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
            <label>${t("issueQtyLabel")}</label>
            <input
              type="number"
              min="1"
              class="issue-qty-input"
              data-partid="${p.PartID}"
              placeholder="${t("issueQtyPlaceholder")}"
            />
          </div>
          <div class="issue-btns">
            <button type="button" class="btn btn-primary btn-issue-card" data-partid="${
              p.PartID
            }">${t("issueBtnText")}</button>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-issue-card") || e.target.closest("input"))
        return;
      openPartDetail(p);
    });

    wrap.appendChild(card);
  });

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

// ========== Render: Check Cards ==========

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
              ? `<span class="chip chip-checked">${t("checkChipChecked")}</span>`
              : `<span class="chip chip-notchecked">${t(
                  "checkChipNotChecked"
                )}</span>`
          }
        </div>
        <div class="part-card-status">
          <span class="${levelCls}">${levelLabel}</span>
        </div>

        <div class="check-bottom-card">
          <div class="check-qty-card">
            <label>${t("checkRealCountLabel")}</label>
            <input
              type="number"
              min="0"
              class="check-qty-input"
              data-partid="${p.PartID}"
              value="${counted === "" ? "" : counted}"
              placeholder="${t("checkRealCountPlaceholder")}"
            />
          </div>
          <div class="issue-btns">
            <button type="button"
              class="btn btn-primary btn-xs btn-check-save-card"
              data-partid="${p.PartID}"
            >${t("checkSaveButton")}</button>
          </div>
        </div>
        <div class="hint">
          ${t("checkDiffLabel")}: ${diff === "" ? "-" : diff}
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-check-save-card") || e.target.closest("input"))
        return;
      openPartDetail(p);
    });

    wrap.appendChild(card);
  });

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

// ========== Render: QR Select List ==========

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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
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
  <\/script>
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

// ========== Actions: issue from card ==========

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

// ========== Actions: Receive stock ==========

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

// ========== Actions: save single check ==========

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

// ========== Export CSV ==========

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

  // Tabs main
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

  // Filters stock
  $("#searchInput")?.addEventListener("input", renderParts);
  $("#statusFilter")?.addEventListener("change", renderParts);

  // Filters issue
  $("#issueSearch")?.addEventListener("input", renderIssueCards);
  $("#issueStatusFilter")?.addEventListener("change", renderIssueCards);
  $("#issueCategoryFilter")?.addEventListener("change", renderIssueCards);

  // QR scan
  $("#btnScanQr")?.addEventListener("click", (e) => {
    e.preventDefault();
    startQrScan();
  });

  // Filter check
  $("#checkSearch")?.addEventListener("input", renderCheckCards);

  // Plan filters
  $("#lowStatusFilter")?.addEventListener("change", updateDashboard);
  $("#lowCategoryFilter")?.addEventListener("change", updateDashboard);
  $("#lowSearch")?.addEventListener("input", updateDashboard);

  // QR select page
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

  // Forms
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

  $("#btnExportCsv")?.addEventListener("click", exportParts);

  $("#btnQrPrint")?.addEventListener("click", () => {
    if (lastQrPartID) {
      qrSelected = new Set([lastQrPartID]);
      printSelectedQr();
    } else {
      setStatus("ไม่พบข้อมูลอะไหล่สำหรับพิมพ์ QR", "error");
    }
  });

  const dateInput = $("#checkDate");
  if (dateInput && !dateInput.value) {
    dateInput.value = todayStr();
  }
  dateInput?.addEventListener("change", (e) => {
    const v = e.target.value || todayStr();
    loadChecksForDate(v);
  });

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

// ========== QR Scan (camera) ==========

let qrScanStream = null;
let qrScanFrameId = null;

async function startQrScan() {
  const video = document.getElementById("qrVideo");
  if (!video) {
    setStatus("ไม่พบ element วิดีโอสำหรับสแกน QR (#qrVideo)", "error");
    return;
  }

  showModal("qrScanModal");

  try {
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

function handleQrResult(text) {
  stopQrScan();
  hideModal("qrScanModal");

  let partId = text.trim();
  const m = text.match(/^MPR:([^|]+)/i);
  if (m) {
    partId = m[1].trim();
  }

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

// ========== Init ==========

document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSwitcher();
  bindUI();
  if (supa) {
    refreshAll();
  }
  applyI18n();
});
