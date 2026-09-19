// One-off: replace the newsletter submit handler with the live subscribe flow.
import { readFileSync, writeFileSync } from "node:fs";

const f = "public_html/assets/js/site.js";
const src = readFileSync(f, "utf8");

const startMarker = 'one("[data-newsletter]")?.addEventListener("submit", (event) => {';
const endMarker = 'showToast(language === "bn" ? "';
// Locate the handler block by its opening line and the closing "});" that
// follows the toast line — anchored on ASCII-only substrings to avoid
// invisible-character mismatches in the Bengali literals.
const startIdx = src.indexOf(startMarker);
if (startIdx < 0) { console.error("START NOT FOUND"); process.exit(1); }
const closeIdx = src.indexOf("  });", src.indexOf("connected.\");", startIdx));
if (closeIdx < 0) { console.error("END NOT FOUND"); process.exit(1); }
const endIdx = closeIdx + "  });".length;

const bnPending = "নিউজলেটার চালুর আগে আপনার সম্মতি নেওয়া হবে।";
const enPending = "Newsletter sign-up will open when the approved consent system is connected.";
const bnUnavailable = "সাবস্ক্রিপশন এখন পাওয়া যাচ্ছে না। পরে চেষ্টা করুন।";
const enUnavailable = "Subscription is unavailable right now. Please try again later.";
const bnDisabled = "সাবস্ক্রিপশন সংগ্রহ এখনো চালু হয়নি।";
const enDisabled = "Subscription collection is not enabled yet.";
const bnError = "সমস্যা হয়েছে। আবার চেষ্টা করুন।";
const enError = "Something went wrong. Please try again.";
const bnThanks = "ধন্যবাদ!";
const enThanks = "Thank you!";

const replacement = `  one("[data-newsletter]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput?.value.trim().toLowerCase();
    if (!email) return;
    // Consent gate: without the owner-approved privacy workflow the form stays
    // informational and nothing is submitted or stored.
    if (!form.dataset.consentConfirmed) {
      showToast(language === "bn" ? "${bnPending}" : "${enPending}");
      return;
    }
    const res = await hostingerApi.call("subscribe.php", { email, language, source: "footer" });
    if (res.offline) {
      showToast(language === "bn" ? "${bnUnavailable}" : "${enUnavailable}");
      return;
    }
    if (res.success) {
      showToast(res.message || (language === "bn" ? "${bnThanks}" : "${enThanks}"));
      form.reset();
    } else if (res.notEnabled) {
      showToast(language === "bn" ? "${bnDisabled}" : "${enDisabled}");
    } else {
      showToast(res.error || (language === "bn" ? "${bnError}" : "${enError}"));
    }
  });`;

writeFileSync(f, src.slice(0, startIdx) + replacement + src.slice(endIdx));
console.log("handler replaced OK");
