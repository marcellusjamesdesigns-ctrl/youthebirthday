import type {
  ColorPalette,
  CaptionCategory,
  Destination,
  CelebrationStyle,
  CosmicProfile,
  Restaurant,
  Activity,
} from "@/lib/db/schema";

interface ReportData {
  name: string;
  ageTurning: number;
  birthdayTitle: string;
  birthdayArchetype: string;
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

export function buildReportEmailHtml(data: ReportData): string {
  const paletteHtml = data.palettes.map((p) => `
    <div style="margin-bottom:20px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:#a8a39d;margin:0 0 8px;">${p.name} — ${p.mood}</p>
      <div style="display:flex;gap:4px;">
        ${p.colors.map((c) => `<div style="width:40px;height:40px;border-radius:8px;background:${c.hex};" title="${c.name}"></div>`).join("")}
      </div>
      <p style="font-size:11px;color:#666;margin:4px 0 0;">${p.colors.map((c) => c.hex).join("  ")}</p>
    </div>
  `).join("");

  const captionHtml = data.captions.map((cat) => `
    <div style="margin-bottom:16px;">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#d4af37;margin:0 0 8px;">${cat.category}</p>
      ${cat.captions.map((c) => `<p style="font-size:14px;color:#f5f0eb;margin:0 0 6px;padding:8px 12px;background:#1a1a1d;border-radius:8px;">${c}</p>`).join("")}
    </div>
  `).join("");

  const destHtml = data.destinations.map((d) => `
    <div style="padding:12px;background:#1a1a1d;border-radius:8px;margin-bottom:8px;">
      <p style="font-size:14px;font-weight:600;color:#f5f0eb;margin:0;">${d.city}, ${d.country}</p>
      <p style="font-size:12px;color:#a8a39d;margin:4px 0 0;">${d.whyItFitsYou}</p>
      <p style="font-size:11px;color:#d4af37;margin:4px 0 0;">${d.timingNote}</p>
    </div>
  `).join("");

  const restaurantHtml = data.restaurants.map((r) => `
    <div style="padding:12px;background:#1a1a1d;border-radius:8px;margin-bottom:8px;">
      <p style="font-size:14px;font-weight:600;color:#f5f0eb;margin:0;">${r.name} · ${r.priceRange}</p>
      <p style="font-size:12px;color:#a8a39d;margin:4px 0 0;">${r.cuisine}</p>
      <p style="font-size:12px;color:#a8a39d;margin:4px 0 0;">${r.whyItFitsYou}</p>
    </div>
  `).join("");

  const activityHtml = data.activities.map((a) => `
    <div style="padding:12px;background:#1a1a1d;border-radius:8px;margin-bottom:8px;">
      <p style="font-size:14px;font-weight:600;color:#f5f0eb;margin:0;">${a.name}</p>
      <p style="font-size:12px;color:#a8a39d;margin:4px 0 0;">${a.description}</p>
      <p style="font-size:12px;color:#d4af37;margin:4px 0 0;">${a.neighborhood} · ${a.priceRange} · ${a.bestTimeOfDay}</p>
    </div>
  `).join("");

  const cosmicHtml = data.cosmicProfile ? `
    <div style="margin-top:32px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#9b72cf;margin:0 0 12px;">Your Cosmic Layer</p>
      <div style="display:flex;gap:16px;margin-bottom:12px;">
        <span style="font-size:13px;color:#f5f0eb;">☉ ${data.cosmicProfile.sunSign}</span>
        ${data.cosmicProfile.moonSign ? `<span style="font-size:13px;color:#f5f0eb;">☽ ${data.cosmicProfile.moonSign}</span>` : ""}
        ${data.cosmicProfile.risingSign ? `<span style="font-size:13px;color:#f5f0eb;">↑ ${data.cosmicProfile.risingSign}</span>` : ""}
      </div>
      <p style="font-size:14px;color:#f5f0eb;font-style:italic;line-height:1.6;">${data.cosmicProfile.birthdayMessage}</p>
    </div>
  ` : "";

  const celebrationHtml = data.celebrationStyle ? `
    <div style="margin-top:32px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 8px;">Your Celebration</p>
      <p style="font-size:18px;font-weight:600;color:#f5f0eb;margin:0 0 8px;">${data.celebrationStyle.primaryStyle}</p>
      <p style="font-size:14px;color:#a8a39d;line-height:1.6;margin:0 0 12px;">${data.celebrationStyle.description}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${[data.celebrationStyle.aesthetic, data.celebrationStyle.outfit, data.celebrationStyle.playlist].map((t) => `<span style="font-size:11px;padding:4px 10px;border:1px solid #333;border-radius:999px;color:#a8a39d;">${t}</span>`).join("")}
      </div>
    </div>
  ` : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.35em;color:#a8a39d;text-align:center;margin:0 0 24px;">You the Birthday</p>

    <h1 style="font-size:28px;font-weight:400;color:#f5f0eb;text-align:center;margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;">${data.birthdayTitle}</h1>

    <div style="text-align:center;margin:16px 0;">
      <span style="font-size:11px;padding:4px 12px;border:1px solid #d4af3740;border-radius:999px;color:#d4af37;">${data.birthdayArchetype}</span>
      <span style="font-size:11px;padding:4px 12px;border:1px solid #333;border-radius:999px;color:#a8a39d;margin-left:8px;">${data.birthdayEra}</span>
    </div>

    <p style="font-size:13px;color:#a8a39d;text-align:center;margin:0 0 24px;">${data.name} · turning ${data.ageTurning}</p>

    <p style="font-size:14px;color:#f5f0eb;line-height:1.7;font-style:italic;text-align:center;padding:0 16px;margin:0 0 32px;">${data.celebrationNarrative}</p>

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 16px;">Your Color Story</p>
    ${paletteHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 16px;">Your Caption Pack</p>
    ${captionHtml}

    ${celebrationHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 16px;">Birthday Destinations</p>
    ${destHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 16px;">Where to Eat & Drink</p>
    ${restaurantHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;margin:0 0 16px;">What to Do</p>
    ${activityHtml}

    ${cosmicHtml}

    <hr style="border:none;border-top:1px solid #222;margin:32px 0;">

    <div style="text-align:center;padding:24px 0;">
      <a href="${data.dashboardUrl}" style="display:inline-block;padding:12px 32px;background:#f5f0eb;color:#0a0a0b;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;">View Your Dashboard</a>
    </div>

    <p style="font-size:10px;color:#555;text-align:center;margin:24px 0 0;">
      youthebirthday.app — Your personalized birthday experience
    </p>
  </div>
</body>
</html>`;
}
