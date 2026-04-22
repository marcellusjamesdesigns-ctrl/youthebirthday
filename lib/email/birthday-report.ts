import type {
  ColorPalette,
  CaptionCategory,
  Destination,
  CelebrationStyle,
  CosmicProfile,
  Restaurant,
  Activity,
} from "@/lib/db/schema";
import { buildMapsQuery } from "@/lib/utils/maps-query";

interface ReportData {
  name: string;
  ageTurning: number;
  birthdayTitle: string;
  birthdayArchetype: string;
  isSubscription?: boolean;
  buyerEmail?: string;
  birthdayEra: string;
  celebrationNarrative: string;
  palettes: ColorPalette[];
  captions: CaptionCategory[];
  celebrationStyle: CelebrationStyle | null;
  destinations: Destination[];
  restaurants: Restaurant[];
  activities: Activity[];
  cosmicProfile: CosmicProfile | null;
  dashboardUrl: string;
}

// ─── Google-search link helpers ────────────────────────────────────────
// Emails are static so we give users real actionable links. Destinations
// and restaurants open on Google Maps; activities run a plain Google
// search since they're often less place-specific.

function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Escape a string for safe insertion into HTML attributes / text content.
// Keeps < > & " ' from breaking the email when the AI returns punctuation.
function esc(s: unknown): string {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildReportEmailHtml(data: ReportData): string {
  // Colors-as-table because Gmail Android strips flex and inline-block
  // spacing gets inconsistent across clients. A row of <td>s is the
  // email-safe way to render swatches.
  const paletteHtml = data.palettes
    .map(
      (p) => `
    <div style="margin-bottom:24px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#a8a39d;margin:0 0 10px;">${esc(p.name)} — ${esc(p.mood)}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:4px 0;"><tr>
        ${p.colors
          .map(
            (c) => `<td style="width:44px;height:44px;background:${esc(c.hex)};border-radius:8px;" title="${esc(c.name)}"></td>`,
          )
          .join("")}
      </tr></table>
      <p style="font-size:11px;color:#777;margin:8px 0 0;word-break:break-all;line-height:1.5;">${p.colors.map((c) => esc(c.hex)).join(" · ")}</p>
    </div>
  `,
    )
    .join("");

  const captionHtml = data.captions
    .map(
      (cat) => `
    <div style="margin-bottom:20px;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;margin:0 0 10px;">${esc(cat.category)}</p>
      ${cat.captions
        .map(
          (c) => `<p style="font-size:14px;color:#f5f0eb;margin:0 0 8px;padding:12px 14px;background:#1a1a1d;border-radius:10px;line-height:1.55;word-break:break-word;">${esc(c)}</p>`,
        )
        .join("")}
    </div>
  `,
    )
    .join("");

  const destHtml = data.destinations
    .map((d) => {
      const query = `${d.city} ${d.country}`.trim();
      return `
    <div style="padding:14px 16px;background:#1a1a1d;border-radius:10px;margin-bottom:10px;">
      <p style="font-size:15px;font-weight:600;color:#f5f0eb;margin:0 0 6px;line-height:1.4;">${esc(d.city)}, ${esc(d.country)}</p>
      <p style="font-size:13px;color:#a8a39d;margin:0 0 8px;line-height:1.55;word-break:break-word;">${esc(d.whyItFitsYou)}</p>
      ${d.timingNote ? `<p style="font-size:12px;color:#d4af37;margin:0 0 10px;line-height:1.5;">${esc(d.timingNote)}</p>` : ""}
      <a href="${mapsLink(query)}" target="_blank" rel="noopener" style="display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;text-decoration:none;border:1px solid #d4af3740;padding:6px 12px;border-radius:999px;">Open in Google Maps →</a>
    </div>
  `;
    })
    .join("");

  const restaurantHtml = data.restaurants
    .map((r) => {
      // Use the shared Maps-query helper. Restaurants usually have a
      // clean venue name in `r.name` per the schema contract, but we
      // route through the helper for consistent fallback behavior
      // (venue parsing + city append).
      const cityHint = data.destinations[0]?.city ?? "";
      const query = buildMapsQuery(
        { name: r.name, address: r.address },
        cityHint,
      );
      return `
    <div style="padding:14px 16px;background:#1a1a1d;border-radius:10px;margin-bottom:10px;">
      <p style="font-size:15px;font-weight:600;color:#f5f0eb;margin:0 0 6px;line-height:1.4;">${esc(r.name)} <span style="color:#d4af37;font-weight:400;font-size:13px;">· ${esc(r.priceRange)}</span></p>
      <p style="font-size:12px;color:#a8a39d;margin:0 0 4px;">${esc(r.cuisine)}</p>
      <p style="font-size:13px;color:#a8a39d;margin:0 0 10px;line-height:1.55;word-break:break-word;">${esc(r.whyItFitsYou)}</p>
      <a href="${mapsLink(query)}" target="_blank" rel="noopener" style="display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;text-decoration:none;border:1px solid #d4af3740;padding:6px 12px;border-radius:999px;">Find on Google Maps →</a>
    </div>
  `;
    })
    .join("");

  const activityHtml = data.activities
    .map((a) => {
      // Prefer venueName (v7 prompt) so "Sound bath at Restoration Yoga"
      // searches "Restoration Yoga {city}" rather than the full phrase.
      // Falls back to parsing " at {venue}" for legacy records.
      const cityHint = data.destinations[0]?.city ?? "";
      const query = buildMapsQuery(
        { name: a.name, venueName: a.venueName, neighborhood: a.neighborhood },
        cityHint,
      );
      return `
    <div style="padding:14px 16px;background:#1a1a1d;border-radius:10px;margin-bottom:10px;">
      <p style="font-size:15px;font-weight:600;color:#f5f0eb;margin:0 0 6px;line-height:1.4;">${esc(a.name)}</p>
      <p style="font-size:13px;color:#a8a39d;margin:0 0 8px;line-height:1.55;word-break:break-word;">${esc(a.description)}</p>
      <p style="font-size:12px;color:#d4af37;margin:0 0 10px;">${esc(a.neighborhood)} · ${esc(a.priceRange)} · ${esc(a.bestTimeOfDay)}</p>
      <a href="${mapsLink(query)}" target="_blank" rel="noopener" style="display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;text-decoration:none;border:1px solid #d4af3740;padding:6px 12px;border-radius:999px;">Open in Google Maps →</a>
    </div>
  `;
    })
    .join("");

  const cosmicHtml = data.cosmicProfile
    ? `
    <div style="margin-top:32px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#9b72cf;margin:0 0 14px;">Your Cosmic Layer</p>
      <p style="font-size:13px;color:#f5f0eb;margin:0 0 12px;line-height:1.6;">
        <span style="display:inline-block;margin-right:14px;">☉ ${esc(data.cosmicProfile.sunSign)}</span>
        ${data.cosmicProfile.moonSign ? `<span style="display:inline-block;margin-right:14px;">☽ ${esc(data.cosmicProfile.moonSign)}</span>` : ""}
        ${data.cosmicProfile.risingSign ? `<span style="display:inline-block;">↑ ${esc(data.cosmicProfile.risingSign)}</span>` : ""}
      </p>
      <p style="font-size:14px;color:#f5f0eb;font-style:italic;line-height:1.7;margin:0;word-break:break-word;">${esc(data.cosmicProfile.birthdayMessage)}</p>
    </div>
  `
    : "";

  const celebrationHtml = data.celebrationStyle
    ? `
    <div style="margin-top:32px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 10px;">Your Celebration</p>
      <p style="font-size:18px;font-weight:600;color:#f5f0eb;margin:0 0 10px;line-height:1.4;">${esc(data.celebrationStyle.primaryStyle)}</p>
      <p style="font-size:14px;color:#a8a39d;line-height:1.7;margin:0 0 14px;word-break:break-word;">${esc(data.celebrationStyle.description)}</p>
      <p style="font-size:12px;color:#a8a39d;line-height:1.8;margin:0;">
        ${[data.celebrationStyle.aesthetic, data.celebrationStyle.outfit, data.celebrationStyle.playlist]
          .filter(Boolean)
          .map(
            (t) => `<span style="display:inline-block;font-size:11px;padding:5px 11px;border:1px solid #333;border-radius:999px;color:#a8a39d;margin:0 4px 6px 0;">${esc(t)}</span>`,
          )
          .join("")}
      </p>
    </div>
  `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(data.birthdayTitle)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0b;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;width:100%;">
          <tr><td style="padding:0 8px;">

    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.35em;color:#a8a39d;text-align:center;margin:0 0 24px;">You the Birthday</p>

    <h1 style="font-size:28px;font-weight:400;color:#f5f0eb;text-align:center;margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;line-height:1.3;word-break:break-word;">${esc(data.birthdayTitle)}</h1>

    <p style="text-align:center;margin:14px 0;line-height:1.8;">
      <span style="display:inline-block;font-size:11px;padding:5px 12px;border:1px solid #d4af3740;border-radius:999px;color:#d4af37;margin:0 2px 6px;">${esc(data.birthdayArchetype)}</span>
      <span style="display:inline-block;font-size:11px;padding:5px 12px;border:1px solid #333;border-radius:999px;color:#a8a39d;margin:0 2px 6px;">${esc(data.birthdayEra)}</span>
    </p>

    <p style="font-size:13px;color:#a8a39d;text-align:center;margin:0 0 24px;">${esc(data.name)} · turning ${data.ageTurning}</p>

    <p style="font-size:14px;color:#f5f0eb;line-height:1.75;font-style:italic;text-align:center;padding:0 8px;margin:0 0 32px;word-break:break-word;">${esc(data.celebrationNarrative)}</p>

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 18px;">Your Color Story</p>
    ${paletteHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 18px;">Your Caption Pack</p>
    ${captionHtml}

    ${celebrationHtml}

    ${destHtml ? `<hr style="border:none;border-top:1px solid #222;margin:32px 0;"><p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 8px;">Birthday Destinations</p><p style="font-size:12px;color:#777;margin:0 0 18px;line-height:1.5;">Tap any destination to open it in Google Maps.</p>${destHtml}` : ""}

    ${restaurantHtml ? `<hr style="border:none;border-top:1px solid #222;margin:32px 0;"><p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 8px;">Where to Eat & Drink</p><p style="font-size:12px;color:#777;margin:0 0 18px;line-height:1.5;">Tap any restaurant to find it on Google Maps.</p>${restaurantHtml}` : ""}

    ${activityHtml ? `<hr style="border:none;border-top:1px solid #222;margin:32px 0;"><p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 8px;">What to Do</p><p style="font-size:12px;color:#777;margin:0 0 18px;line-height:1.5;">Tap any activity to find its venue on Google Maps.</p>${activityHtml}` : ""}

    ${cosmicHtml}

    <hr style="border:none;border-top:1px solid #222;margin:40px 0 32px;">

    <div style="text-align:center;padding:8px 0 16px;">
      <a href="${esc(data.dashboardUrl)}" target="_blank" rel="noopener" style="display:inline-block;padding:13px 32px;background:#f5f0eb;color:#0a0a0b;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;letter-spacing:0.02em;">View Your Dashboard →</a>
    </div>

    <p style="font-size:10px;color:#555;text-align:center;margin:32px 0 0;line-height:1.6;">
      <a href="https://youthebirthday.app" style="color:#888;text-decoration:none;">youthebirthday.app</a> — Your personalized birthday experience
    </p>
    ${
      data.isSubscription
        ? `<p style="font-size:10px;color:#555;text-align:center;margin:10px 0 0;">
      <a href="https://youthebirthday.app/api/stripe/manage?email=${encodeURIComponent(data.buyerEmail ?? "")}" style="color:#d4af37;text-decoration:none;">Manage your subscription</a>
    </p>`
        : ""
    }

          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
