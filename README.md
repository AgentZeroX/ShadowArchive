# ShadowArchive

A specialized reconnaissance extension designed to unearth archived URLs and sensitive files. Perfect for penetration testers, bug hunters, and security researchers looking for historical data leaks.

## Features
* **Instant Archive Discovery:** Quickly fetch and filter archived URLs directly from the Wayback Machine CDX API.
* **Five Specialized Search Modes:**
    * **Main Domain URLs:** Scans the root domain (`example.com/*`).
    * **Wildcard Domain URLs:** Discovers subdomains and their assets (`*.example.com/*`).
    * **Specific Path URLs:** Drills down into specific directories (`example.com/path/*`).
    * **Sensitive Hunt:** Automated filtering for high-value files like `.env`, `.bak`, `.sql`, `.json`, and private keys.
    * **Parameter Hunting:** Identifies URLs containing sensitive parameters such as `?token=`, `?apikey=`, and `?auth=`.
* **Juicy Detection:** Built-in logic highlights suspicious files in the preview panel to speed up manual analysis.
* **Multi-Archive Integration:** Pivot your research to `archive.today`, `urlscan.io`, `AlienVault OTX`, and `crt.sh` with a single click.

---

## Installation
1. **Clone this repository:**
   ```bash
   git clone [https://github.com/mka/ShadowArchive.git](https://github.com/mka/ShadowArchive.git)

2. Open Chrome and navigate to chrome://extensions/.
3. Enable "Developer mode" in the top-right corner.
4. Click "Load unpacked" and select the folder where you saved the project.
5. The ShadowArchive icon will now appear in your Chrome toolbar.

