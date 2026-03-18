# ShadowArchive
A specialized reconnaissance extension designed to unearth archived URLs and sensitive files. Perfect for penetration testers, bug hunters, and security researchers looking for historical data leaks.

Features
Instant Archive Discovery: Quickly fetch and filter archived URLs directly from the Wayback Machine CDX API.

Five Specialized Search Modes:

Main Domain URLs: Scans the root domain (example.com/*).

Wildcard Domain URLs: Discovers subdomains and their assets (*.example.com/*).

Specific Path URLs: Drills down into specific directories (example.com/path/*).

Sensitive Hunt: Automated filtering for high-value files like .env, .bak, .sql, .json, and private keys.

Parameter Hunting: Identifies URLs containing sensitive parameters such as ?token=, ?apikey=, and ?auth=.

Juicy Detection: Built-in logic highlights suspicious files in the preview panel to speed up manual analysis.

Multi-Archive Integration: Pivot your research to archive.today, urlscan.io, AlienVault OTX, and crt.sh with a single click.

Installation
Clone this repository:

Bash
   git clone https://github.com/mka/ShadowArchive.git

Open Chrome and navigate to chrome://extensions/.

Enable "Developer mode" in the top-right corner.

Click "Load unpacked" and select the folder where you saved the project.

The ShadowArchive icon will now appear in your Chrome toolbar.

Usage:

Navigate to the target webpage.

Click the ShadowArchive icon in your toolbar.

Select your preferred search mode (e.g., Sensitive Hunt).

Use the Preview Results button to view the top 50 matches or click a mode to open the full raw results in a new tab.

Use "Copy All URLs" to instantly move your findings into other tools like httpx or nuclei.

Example Queries:

Sensitive Hunt
https://web.archive.org/cdx/search/cdx?url=*.example.com/*&filter=original:.*\\.(env|bak|sql|key|config|token)

Parameter Hunting
https://web.archive.org/cdx/search/cdx?url=*.example.com/*&filter=original:.*\\?.*(key|token|auth|secret)

Contributing
Pull requests are welcome! Feel free to suggest new features, UI improvements, or custom sensitive file signatures via GitHub issues.

Author
AgentZeroX - Penetration Tester & Security Researcher
