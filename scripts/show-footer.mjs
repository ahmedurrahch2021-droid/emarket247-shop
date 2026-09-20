import fs from "node:fs";
const root = fs.existsSync("public_html") ? "public_html" : "F:/EMARKET247/Project 011/emarket247-shop-main/public_html";
const strip = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, "[ICON]").replace(/></g, ">\n<");
const h = fs.readFileSync(`${root}/en/shop/index.html`, "utf8");
const fs0 = h.indexOf('<footer class="site-footer">');
const fe = h.indexOf("</footer>", fs0);
console.log("FOOTER COUNT in en/shop:", (h.match(/<footer class="site-footer">/g) || []).length);
console.log(strip(h.slice(fs0, fe + 9)));
