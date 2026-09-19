// One-off: restructure the City Gold Guide section so ALL text (intro + CTA)
// sits in the guide-head column under the heading, instead of the intro and
// button spanning full width below the image/heading grid.
import { readFileSync, writeFileSync } from "node:fs";

for (const lang of ["en", "bn"]) {
  const f = `public_html/${lang}/index.html`;
  let s = readFileSync(f, "utf8");
  if (s.includes('guide-head-fixed')) { console.log("skip", lang); continue; }

  // Capture the intro paragraph and actions block that follow the guide-top grid
  const introStart = s.indexOf('<p class="guide-intro">');
  const actionsStart = s.indexOf('<div class="guide-actions">');
  const actionsEnd = s.indexOf('</div>', actionsStart) + '</div>'.length;
  if (introStart < 0 || actionsStart < 0) { console.error("anchors missing", lang); continue; }

  const intro = s.slice(introStart, s.indexOf('</p>', introStart) + 4);
  const actions = s.slice(actionsStart, actionsEnd);
  // Remove them from below the grid
  s = s.slice(0, introStart) + s.slice(actionsEnd).replace(/^\s*/, '');

  // Insert inside .guide-head, after the h2
  const gh = s.indexOf('<div class="guide-head">');
  if (gh < 0) { console.error("guide-head anchor missing", lang); continue; }
  const h2End = s.indexOf('</h2>', gh) + '</h2>'.length;
  s = s.slice(0, h2End) + intro + actions + s.slice(h2End);

  writeFileSync(f, s);
  console.log("restructured guide-head:", lang);
}
console.log("done");
