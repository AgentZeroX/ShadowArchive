let currentMode = "domain";
const urlInput = document.getElementById("urlInput");
const previewPanel = document.getElementById("previewPanel");
const resultsList = document.getElementById("resultsList");
const previewTitle = document.getElementById("previewTitle");

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill current tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]?.url?.startsWith("http")) {
      urlInput.value = tabs[0].url;
    }
  });

  // Assign modes
  document.getElementById("domainBtn").onclick    = () => openCDXTab("domain");
  document.getElementById("wildcardBtn").onclick  = () => openCDXTab("wildcard");
  document.getElementById("pathBtn").onclick      = () => openCDXTab("path");
  document.getElementById("sensitiveBtn").onclick = () => openCDXTab("sensitive");
  document.getElementById("paramBtn").onclick     = () => openCDXTab("parameter");

  // ✅ UPDATED Preview Button (replaced block)
  document.getElementById("previewBtn").onclick = () => {
    let q = buildQuery(currentMode);
    q += "&output=json&limit=50&fl=timestamp,original,statuscode,mimetype";
    chrome.tabs.create({ url: q });  // opens the raw JSON in a new tab
  };

  // Copy all
  document.getElementById("copyAllBtn").onclick = () => {
    const urls = Array.from(resultsList.querySelectorAll(".url-text")).map(el => el.textContent);
    navigator.clipboard.writeText(urls.join("\n")).then(() => {
      alert("All URLs copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy");
    });
  };
});

async function showPreview() {
  let query = buildQuery(currentMode);
  query += "&output=json&limit=50&fl=timestamp,original,statuscode,mimetype";

  try {
    const res = await fetch(query);
    if (!res.ok) throw new Error("HTTP error");
    const data = await res.json();

    resultsList.innerHTML = "";
    previewTitle.textContent = `${currentMode.toUpperCase()} — ${data.length} results`;

    data.forEach(row => {
      const [timestamp, original, status, mime] = row;
      const isJuicy = /.(env|bak|old|backup|git|key|pem|crt|sql|config|secret|token|passwd|id_rsa|DS_Store|kubeconfig)/i.test(original);

      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <span class="timestamp">${timestamp.slice(0,8)}</span>
        <span class="status" style="background:${status==200?'#3fb95020':'#f8514920'};color:${status==200?'#3fb950':'#f85149'}">${status}</span>
        ${isJuicy ? '<span class="juicy">JUICY</span>' : ''}
        <span class="url-text" onclick="openArchived('${timestamp}','${original}')">${original}</span>
      `;
      resultsList.appendChild(div);
    });

    if (data.length === 0) {
      resultsList.innerHTML = "<div style='padding:12px;color:#aaaaaa;text-align:center;'>No results found</div>";
    }
  } catch (e) {
    resultsList.innerHTML = `<div style="padding:12px;color:#f85149">Error: ${e.message}</div>`;
  }
}

function buildQuery(mode) {
  let url = urlInput.value.trim() || "https://example.com";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const parsed = new URL(url);
  const hostname = parsed.hostname;
  const base = parsed.origin + parsed.pathname;

  let q = `https://web.archive.org/cdx/search/cdx?url=`;

  if (mode === "domain")     q += `${hostname}/*`;
  else if (mode === "wildcard") q += `*.${hostname}/*`;
  else if (mode === "path")     q += `${base}/*`;
  else if (mode === "sensitive" || mode === "parameter") q += `*.${hostname}/*`;

  // Filters
  q += document.getElementById("statusFilter").value || "";
  q += document.getElementById("mimeFilter").value || "";

  // Custom extensions (Sensitive only)
  if (mode === "sensitive") {
    const custom = document.getElementById("customExt").value.trim();
    if (custom) {
      const exts = custom.split(",").map(e => e.trim().replace(/^\./, "\\.")).join("|");
      q += `&filter=original:.*\\.(${exts})$`;
    } else {
      q += `&filter=original:.*\\.(env|bak|old|backup|sql|json|yaml|yml|key|pem|crt|git|config|secret|token|passwd|id_rsa|DS_Store)$`;
    }
  }

  // Parameter hunting
  if (mode === "parameter") {
    q += `&filter=original:.*\\?.*(key|token|pass|secret|api|auth|cred|file|id=|access_token|auth_token)`;
  }

  q += "&collapse=urlkey";
  return q;
}

function openCDXTab(mode) {
  const q = buildQuery(mode);
  chrome.tabs.create({ url: q });
}

window.openArchived = (ts, orig) => {
  chrome.tabs.create({ url: `https://web.archive.org/web/${ts}/${orig}` });
};

// External archives
window.openArchiveToday = () => {
  const u = encodeURIComponent(urlInput.value || "https://example.com");
  chrome.tabs.create({ url: `https://archive.today/?url=${u}` });
};

window.openUrlscan = () => {
  const host = new URL(urlInput.value || "https://example.com").hostname;
  chrome.tabs.create({ url: `https://urlscan.io/search/#domain%3A${host}` });
};

window.openOTX = () => {
  const host = new URL(urlInput.value || "https://example.com").hostname;
  chrome.tabs.create({ url: `https://otx.alienvault.com/indicator/domain/${host}` });
};

window.openCrtsh = () => {
  const host = new URL(urlInput.value || "https://example.com").hostname;
  chrome.tabs.create({ url: `https://crt.sh/?q=%25.${host}` });
};

window.openSecurityTrails = () => {
  const host = new URL(urlInput.value || "https://example.com").hostname;
  chrome.tabs.create({ url: `https://securitytrails.com/domain/${host}` });
};
