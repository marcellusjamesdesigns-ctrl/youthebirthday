import { registerPage } from "@/lib/content/registry";
import type { ContentPage } from "@/lib/content/types";
import {
  zodiacLabels,
  zodiacDateRanges,
  zodiacRulingPlanets,
  zodiacElements,
  zodiacModalities,
  zodiacCompatible,
  zodiacElementGroups,
} from "@/lib/content/taxonomy";
import type { ZodiacSign } from "@/lib/content/taxonomy";

function articleFor(label: string): string {
  return /^[AEIOU]/i.test(label) ? "an" : "a";
}

// ─── Per-sign data ───────────────────────────────────────────────────────────

interface SignData {
  thesis: string;
  intro: string;
  birthdayVibe: string;
  activities: { title: string; description: string; vibeTag: string }[];
  dinnerStyle: string;
  colors: string;
  captionDirection: string;
  tripStyle: string;
}

const signData: Record<ZodiacSign, SignData> = {
  aries: {
    thesis: "An Aries birthday should feel bold, spontaneous, and slightly extra.",
    intro: "Aries doesn't want a quiet celebration — they want to feel the rush. The best Aries birthday is one that matches their energy: competitive, physical, loud, and unapologetically first. If you're planning for an Aries, build around action. If you are the Aries, give yourself permission to go big.",
    birthdayVibe: "Main character in motion. Aries birthdays are built for energy, not subtlety. Think: starting the night with a dare and ending it with a story.",
    activities: [
      { title: "Go-kart racing or adventure sport", description: "Aries thrives on competition and adrenaline. Book something physical — go-karts, rock climbing, boxing class, or an escape room with stakes.", vibeTag: "adventure" },
      { title: "Bar crawl with missions", description: "Not a boring pub crawl. Give each bar a challenge, a dare, or a costume rule. Aries wants the night to have a story arc.", vibeTag: "turn-up" },
      { title: "Surprise birthday with real surprise", description: "Not a 'surprise party' that everyone knows about. Actually surprise them. Different location, unexpected guests, spontaneous energy.", vibeTag: "intimate" },
      { title: "Rooftop pregame into late-night plans", description: "Start elevated, literally. Rooftop drinks at golden hour, then let the night unfold. Aries doesn't like knowing where the night ends.", vibeTag: "luxury" },
    ],
    dinnerStyle: "Lively and energetic — tapas, izakaya, chef's counter, anything where the energy is high and the food keeps coming. Aries doesn't want a hushed, formal meal. They want a dinner that feels like an event.",
    colors: "Red, scarlet, bold accents on black or white. Aries birthday palettes should feel powerful — not pastel, not quiet. Think: the outfit that makes people look twice.",
    captionDirection: "Confident, playful, slightly chaotic. First-person, action verbs, no softness. 'I showed up. I showed out. I'm showing no signs of slowing down.'",
    tripStyle: "Adventure cities and active trips. Think: Queenstown for skydiving, Barcelona for nightlife and architecture, Austin for live music and food. Aries wants the trip that sounds like a movie trailer.",
  },
  taurus: {
    thesis: "A Taurus birthday should feel indulgent, beautiful, and deeply comfortable.",
    intro: "Taurus doesn't want chaos — they want quality. The best Taurus birthday is one where every detail has been thought through: the food, the fabric, the lighting, the company. If you're planning for a Taurus, focus on sensory pleasure. If you are the Taurus, stop saying you don't need anything. You do. You deserve it.",
    birthdayVibe: "Soft luxury. Taurus birthdays are built for comfort and indulgence — not excess, but excellence. Think: the meal that ruins your standards for every restaurant after.",
    activities: [
      { title: "Spa day or wellness ritual", description: "Full body treatment, essential oils, heated stones. Taurus wants to be pampered without pretense. Book the good spa, not the cheap one.", vibeTag: "luxury" },
      { title: "Slow brunch with flowers on the table", description: "Linen, pastries, fresh juice, champagne. Set up a beautiful table and eat without rushing. The Taurus birthday brunch is an institution.", vibeTag: "soft-life" },
      { title: "Wine and cheese night done right", description: "Not grocery store cheese. Real selections, proper pairings, a beautiful board. Taurus appreciates craft. Honor that.", vibeTag: "intimate" },
      { title: "Pottery or floral arrangement class", description: "Taurus is the most tactile sign. Give them something to create with their hands. Pottery, flower arranging, or a cooking class with beautiful ingredients.", vibeTag: "creative" },
    ],
    dinnerStyle: "High-quality, ingredient-focused restaurants. Tasting menus, farm-to-table, wine bars with real sommeliers. Taurus wants to taste something they'll remember — not just something that photographs well.",
    colors: "Green, pink, soft earth tones. Taurus palettes are nature-inspired — think: garden party, not nightclub. Sage, blush, cream, copper. Everything should feel touchable.",
    captionDirection: "Sensory, grounded, cozy. Lots of 'favorite people,' 'slow mornings,' 'soft life.' Taurus captions read like a love letter to comfort.",
    tripStyle: "Countryside retreats and wine regions. Provence, Napa Valley, Tuscany, the Cotswolds. Taurus wants the trip that feels like moving into a painting. Beautiful, slow, and delicious.",
  },
  gemini: {
    thesis: "A Gemini birthday should feel social, unpredictable, and multi-layered.",
    intro: "Gemini wants variety — not just one plan, but three plans in one night. The best Gemini birthday moves between locations, conversations, and moods. If you're planning for a Gemini, build in transitions. If you are the Gemini, let yourself have the chaotic night you actually want.",
    birthdayVibe: "Social butterfly with a master plan. Gemini birthdays should feel like a curated adventure — not one event, but a progression. Think: three venues, three vibes, one great outfit.",
    activities: [
      { title: "Progressive dinner or bar hop", description: "Coffee at one spot, dinner at another, drinks at a third. Gemini thrives when the night keeps changing. Build in movement.", vibeTag: "turn-up" },
      { title: "Game or trivia night", description: "Gemini is the wordplay sign. Trivia, charades, card games with personality. They want to talk, compete, and make everyone laugh.", vibeTag: "intimate" },
      { title: "Gallery opening or cultural event", description: "Something with intellectual texture. An art opening, a reading, a comedy show. Gemini wants conversation material for the after-party.", vibeTag: "cultural" },
      { title: "Surprise guest or location", description: "The one friend who lives in another city. The venue nobody expected. Gemini loves a twist — plan at least one moment they didn't see coming.", vibeTag: "adventure" },
    ],
    dinnerStyle: "Conversation-friendly spots — wine bars, share-plate restaurants, speakeasy-style places with character. Gemini wants a table where the food is great but the real event is the talking.",
    colors: "Yellow, bright whites, airy hues. Gemini palettes are light and energetic — not heavy or moody. Think: citrus, sunshine, white linen, gold accents.",
    captionDirection: "Witty, meta, self-aware. Wordplay and double meanings. Gemini captions should feel like they were written by the cleverest person at the party.",
    tripStyle: "Cities dense with culture and neighborhoods. Tokyo, NYC, Lisbon, Mexico City. Gemini wants the trip where every block is different and there's always something new to discover.",
  },
  cancer: {
    thesis: "A Cancer birthday should feel warm, emotionally safe, and full of people who truly know them.",
    intro: "Cancer doesn't want a spectacle — they want to feel known. The best Cancer birthday is surrounded by people who actually see them, in a place that feels like home, with food that carries memory. If you're planning for a Cancer, make it personal. If you are the Cancer, let people show up for you the way you show up for them.",
    birthdayVibe: "Cozy, nostalgic, emotionally safe. Cancer birthdays are built for depth, not width. Think: the dinner where everyone says something real, the photo album that makes everyone cry.",
    activities: [
      { title: "Home dinner with real cooking", description: "Cook together or have it catered. Real plates, candles, a table set with care. Cancer wants a meal that feels like love made tangible.", vibeTag: "intimate" },
      { title: "Lake day or ocean picnic", description: "Water is Cancer's element. A day by the lake, a beach picnic, or a sunset boat ride. Being near water on their birthday resets something deep.", vibeTag: "healing" },
      { title: "Movie marathon or nostalgia night", description: "Their favorite childhood movies, snacks from when they were a kid, stories about where they've been. Cancer loves looking backward to appreciate forward.", vibeTag: "intimate" },
      { title: "Family-style gathering", description: "Not a party — a gathering. People who have known them longest, comfort food, no pressure to perform. Cancer's best birthday feels like Thanksgiving, not New Year's.", vibeTag: "soft-life" },
    ],
    dinnerStyle: "Comfort food elevated. Their mom's recipe but at a beautiful table, or the neighborhood restaurant that remembers their order. Cancer wants food that feels like a hug — not a flex.",
    colors: "Silver, white, soft blues. Cancer palettes are moonlit — calming, reflective, slightly ethereal. Think: pearl tones, ocean light, cloud-soft neutrals.",
    captionDirection: "Sentimental but not saccharine. Lots of 'home,' 'roots,' 'my people.' Cancer captions read like a grateful whisper, not a shout.",
    tripStyle: "Coastal towns, cabins, lakes. Places with strong emotional atmosphere. Cancer wants the trip where the scenery matches the feeling — not flashy, but moving.",
  },
  leo: {
    thesis: "A Leo birthday should feel cinematic, photogenic, and impossible to ignore.",
    intro: "Leo doesn't just celebrate — they curate an experience. The best Leo birthday is one where they feel seen, photographed, and celebrated by people who actually appreciate them. If you're planning for a Leo, make them the center of attention. If you are the Leo, stop apologizing for wanting a moment. It's your birthday. Own it.",
    birthdayVibe: "Main character in their own film. Leo birthdays are built for the feed, the memory, and the story. Think: golden hour, a dress code, and at least one moment where everyone is looking at them.",
    activities: [
      { title: "Birthday photo shoot", description: "Professional photographer, a stunning location, an outfit that makes a statement. Leo wants to be documented looking their absolute best.", vibeTag: "luxury" },
      { title: "Rooftop or venue takeover", description: "Rent the rooftop. Set the playlist. Send the invite with a dress code. Leo wants an event, not a hangout.", vibeTag: "turn-up" },
      { title: "Glam getting-ready party", description: "Start the celebration before the celebration. Hair, makeup, champagne, a speaker playing their song. The pregame is the event.", vibeTag: "luxury" },
      { title: "Karaoke or performance night", description: "Leo needs a stage. Karaoke, open mic, lip sync battle, or a dance floor with good lighting. Let them perform.", vibeTag: "turn-up" },
    ],
    dinnerStyle: "Statement restaurants with aesthetic plating, good lighting, and ideally a private dining room. Leo wants the dinner where the waiter knows it's their birthday and the dessert comes with a sparkler.",
    colors: "Gold, orange, sun colors. Leo palettes are warm and regal — nothing muted, nothing shy. Think: the outfit that catches every light in the room.",
    captionDirection: "Regal, witty, confident. Lots of 'spotlight,' 'golden hour,' 'main character.' Leo captions should feel like a coronation speech — short, powerful, and slightly self-aware.",
    tripStyle: "Social, colorful cities. Barcelona, Lisbon, Miami, NYC. Leo wants the trip where the nightlife is good, the architecture is beautiful, and there are plenty of photo opportunities.",
  },
  virgo: {
    thesis: "A Virgo birthday should feel intentional, detail-driven, and quietly impeccable.",
    intro: "Virgo doesn't want a messy surprise — they want a well-planned evening where everything works. The best Virgo birthday is one where the logistics are invisible and the quality is undeniable. If you're planning for a Virgo, sweat the details. If you are the Virgo, let someone else handle the planning for once.",
    birthdayVibe: "Curated elegance. Virgo birthdays are built for precision and taste — not excess, but thoughtfulness. Think: the dinner where the napkins are folded properly and the wine was actually researched.",
    activities: [
      { title: "Cooking class with great ingredients", description: "Virgo loves learning and craft. A hands-on cooking class with quality ingredients is both an experience and a meal. Pasta-making, sushi, or seasonal tasting.", vibeTag: "cultural" },
      { title: "Bookstore crawl + café afternoon", description: "Independent bookstores, a perfect flat white, maybe a vintage shop stop. Virgo's ideal birthday afternoon is unhurried intellectual browsing.", vibeTag: "soft-life" },
      { title: "Beautifully set home dinner", description: "Not takeout on paper plates. A proper tablescape, cloth napkins, individual courses. Virgo notices the effort in the details — honor that.", vibeTag: "intimate" },
      { title: "Volunteering or giving-back morning", description: "Some Virgos would rather start their birthday doing something meaningful. A morning volunteer shift followed by a beautiful lunch. Service-oriented and grounding.", vibeTag: "healing" },
    ],
    dinnerStyle: "Under-the-radar but excellent restaurants with great service. Virgo doesn't need the trendiest spot — they need the best food, the cleanest kitchen, and a server who remembers their water preference.",
    colors: "Soft browns, greens, neutrals. Virgo palettes are natural and composed — no neons, no glitter. Think: linen, sage, mushroom, cream. Everything should feel considered.",
    captionDirection: "Clean, clever, quietly flexy. Virgo captions use precise language — no extra words, no clichés. 'Systems,' 'curation,' 'small joys.' The caption that makes people think, not just double-tap.",
    tripStyle: "Cities with history and order. Copenhagen, Kyoto, Vienna. Virgo wants the trip where the public transit works, the museums are world-class, and the coffee is excellent.",
  },
  libra: {
    thesis: "A Libra birthday should feel beautiful, social, and aesthetically balanced.",
    intro: "Libra wants harmony — the birthday where the lighting is right, the guest list is curated, and everyone leaves saying 'that was perfect.' The best Libra birthday isn't the loudest — it's the most beautiful. If you're planning for a Libra, focus on aesthetics and connection. If you are the Libra, let yourself be celebrated instead of spending the whole party making sure everyone else is comfortable.",
    birthdayVibe: "Editorial elegance. Libra birthdays are built for beauty and balance — every element should feel intentional. Think: the party that looks like a photo shoot without trying.",
    activities: [
      { title: "Wine tasting with a beautiful view", description: "A vineyard, a rooftop, or a sunset bar. Libra wants something that engages taste and sight simultaneously. Make it gorgeous.", vibeTag: "luxury" },
      { title: "Garden party or styled picnic", description: "Flowers, charcuterie, lemonade, linen. Set up in a beautiful outdoor space and let the aesthetic do the work. Libra will style the rest.", vibeTag: "soft-life" },
      { title: "Art gallery or exhibition opening", description: "Libra is the aesthetics sign. An art opening, a design exhibition, or a photography show — followed by dinner at somewhere beautiful.", vibeTag: "cultural" },
      { title: "Themed dress-code dinner", description: "Pick a color, a decade, or a mood. Libra loves when everyone participates in the vision. The dress code turns a dinner into a curated moment.", vibeTag: "intimate" },
    ],
    dinnerStyle: "Aesthetic restaurants with good lighting and design. Libra cares about ambiance as much as food — beautiful plating, candles, interesting architecture. The restaurant should look like it was designed for them.",
    colors: "Pastel greens, pinks, soft blues. Libra palettes are balanced and romantic — nothing too heavy, nothing too loud. Think: the bouquet that complements every skin tone.",
    captionDirection: "Romantic, soft, slightly cheeky. Emphasis on connection and beauty. Libra captions feel like a love letter to the evening — 'main character with a supporting cast that deserves their own spinoff.'",
    tripStyle: "Romantic cities with charming neighborhoods. Paris, Florence, Santorini, Cartagena. Libra wants the trip where every street corner is worth a photo and the dinners feel like film scenes.",
  },
  scorpio: {
    thesis: "A Scorpio birthday should feel intimate, transformational, and slightly mysterious.",
    intro: "Scorpio doesn't want a crowd — they want the right 5 people. The best Scorpio birthday is intense in the best way: deep conversation, beautiful darkness, and the kind of night that changes something. If you're planning for a Scorpio, go moody. If you are the Scorpio, let people into the inner circle for once. They want to celebrate you.",
    birthdayVibe: "Magnetic and private. Scorpio birthdays are built for depth — not surface-level fun, but the kind of night where someone says something that stays with you. Think: velvet, candlelight, and the playlist that makes everyone confess.",
    activities: [
      { title: "Speakeasy or hidden bar night", description: "Find the bar behind the bookshelf. The one with no sign. Scorpio loves exclusivity — the birthday should feel like a secret.", vibeTag: "luxury" },
      { title: "Tarot or astrology session", description: "A private reading — not a party trick, but a genuine session. Scorpio treats their birthday as a portal. Give them the language for the next chapter.", vibeTag: "spiritual" },
      { title: "Night spa or hot spring", description: "Heated pools, steam rooms, darkness. Scorpio's ideal birthday activity involves water and low light. Find a late-night spa or onsen.", vibeTag: "healing" },
      { title: "Intimate dinner, no phones", description: "Four people maximum. No social media. Real conversation over dark wine and heavier food. Scorpio wants the dinner that nobody posts about.", vibeTag: "intimate" },
    ],
    dinnerStyle: "Dim-lit, moody restaurants with tasting menus, wine cellars, and low ceilings. Scorpio wants the dinner that feels like a scene from a European film — atmospheric and slightly secretive.",
    colors: "Deep red, burgundy, black. Scorpio palettes are dark and powerful — velvet, obsidian, oxblood. Nothing pastel. Nothing cute. Everything should feel like it has weight.",
    captionDirection: "Moody, powerful, slightly secretive. 'Rebirth,' 'plot twist,' 'off the record.' Scorpio captions should feel like a classified document someone accidentally leaked.",
    tripStyle: "Deep-culture destinations with spiritual depth. Bali, Oaxaca, Istanbul, Marrakech. Scorpio wants the trip that changes how they see the world — not a beach vacation, but a transformation.",
  },
  sagittarius: {
    thesis: "A Sagittarius birthday should feel expansive, spontaneous, and slightly unplanned.",
    intro: "Sagittarius doesn't want a perfectly organized evening — they want an adventure. The best Sagittarius birthday starts with a loose plan and ends somewhere nobody expected. If you're planning for a Sag, leave room for spontaneity. If you are the Sagittarius, stop saying 'I don't need a birthday.' You want the adventure. Take it.",
    birthdayVibe: "Open road energy. Sagittarius birthdays are built for movement, laughter, and the kind of night where 'one more stop' becomes the best decision. Think: passport-ready, playlist-deep, plan-light.",
    activities: [
      { title: "Road trip birthday", description: "Pick a direction. Drive. Stop when something looks interesting. The Sagittarius birthday road trip doesn't need a destination — it needs momentum.", vibeTag: "adventure" },
      { title: "Concert or live music night", description: "Sagittarius is drawn to live energy. A great show, a small venue, or even a street performance turned into a night out. Music makes their birthday feel cinematic.", vibeTag: "turn-up" },
      { title: "Hiking plus bonfire", description: "A daytime hike to a viewpoint, then a bonfire at night with close friends, stories, and something grilled. Sagittarius wants their birthday to span sunset to stars.", vibeTag: "adventure" },
      { title: "Last-minute trip somewhere new", description: "Book a flight the week before. Tell no one. Show up somewhere you've never been. The best Sagittarius birthday gift is a boarding pass.", vibeTag: "adventure" },
    ],
    dinnerStyle: "Global flavors, shared plates, low-fuss but high-flavor. Sagittarius doesn't need a reservation at the hottest spot — they need a street food tour or a hole-in-the-wall with soul.",
    colors: "Purple, saturated jewel tones. Sagittarius palettes are rich and expansive — think: the sunset over a new city, the deep purple sky before a storm. Bold without being aggressive.",
    captionDirection: "Philosophical but fun. 'Chapters,' 'quests,' 'passport stamps.' Sagittarius captions feel like the opening line of a travel memoir nobody wrote yet.",
    tripStyle: "Road trips, national parks, multi-stop itineraries, backpacking. Sagittarius wants the trip that covers the most ground — literally and emotionally. Think: Patagonia, Southeast Asia, the Pacific Coast Highway.",
  },
  capricorn: {
    thesis: "A Capricorn birthday should feel elevated, timeless, and quietly powerful.",
    intro: "Capricorn doesn't need a party — they need recognition. The best Capricorn birthday is the one where people who matter are present, the setting is impeccable, and the celebration matches the effort they've put into the year. If you're planning for a Capricorn, invest in quality over quantity. If you are the Capricorn, let yourself be celebrated. You've earned it.",
    birthdayVibe: "Understated power. Capricorn birthdays are built for elegance, not noise. Think: the dinner where the host anticipated every detail, the gift that proves someone listened all year.",
    activities: [
      { title: "Power lunch at the best restaurant", description: "Not a dinner. A daytime celebration with gravitas — the kind of lunch where you order the tasting menu at 1pm and don't leave until 4pm.", vibeTag: "luxury" },
      { title: "Rooftop drinks with a tight circle", description: "Five people who actually know them. Good whiskey. A view. No strangers. Capricorn wants the celebration that feels exclusive because it is.", vibeTag: "intimate" },
      { title: "Gallery or performance evening", description: "Something cultural and structured — a gallery opening, a classical concert, a jazz set. Capricorn appreciates art that requires skill.", vibeTag: "cultural" },
      { title: "Goal-setting birthday ritual", description: "Some Capricorns want their birthday to mean something strategic. A journaling session, a vision board, or a planning dinner where they map the year ahead.", vibeTag: "spiritual" },
    ],
    dinnerStyle: "Historic or iconic restaurants, steakhouses, private dining rooms. Capricorn wants the restaurant that's been open for 30 years and still earns its reputation — timeless, not trendy.",
    colors: "Charcoal, black, deep green. Capricorn palettes are serious and refined — no pastels, no whimsy. Think: the outfit that commands a room without trying. Cashmere, marble, iron.",
    captionDirection: "Understated flex, achievement-oriented. 'Quiet luxury,' 'earned this,' 'tradition.' Capricorn captions should feel like a CEO's memoir — minimal words, maximum weight.",
    tripStyle: "Cities with history and structure. Rome, London, Edinburgh, Zurich. Capricorn wants the trip that feels like walking through a legacy — architecture, institutions, and old-world craftsmanship.",
  },
  aquarius: {
    thesis: "An Aquarius birthday should feel unconventional, community-oriented, and intellectually interesting.",
    intro: "Aquarius doesn't want the expected birthday — they want the one nobody's done before. The best Aquarius birthday breaks a rule, tries something weird, or brings people together around an idea instead of just a party. If you're planning for an Aquarius, think outside the template. If you are the Aquarius, let your friends celebrate you their way. It'll surprise you.",
    birthdayVibe: "Offbeat genius energy. Aquarius birthdays are built for the unexpected — not random chaos, but intentional weirdness. Think: the party with a theme nobody else would choose, the dinner at a restaurant nobody else has heard of.",
    activities: [
      { title: "Themed night with a niche theme", description: "Not 'casino night.' Something weird and specific: 'worst outfit you own,' 'dress as your Spotify Wrapped,' 'bring a dish from a country you've never been to.' Aquarius wants the theme that creates stories.", vibeTag: "turn-up" },
      { title: "Immersive experience or interactive art", description: "Meow Wolf, escape rooms, VR experiences, interactive exhibitions. Aquarius wants their birthday to feel like stepping into a different world.", vibeTag: "cultural" },
      { title: "Supper club or pop-up dinner", description: "Not a restaurant — an event. A chef's pop-up in an unexpected location, a supper club in someone's apartment, a dinner series with strangers. Aquarius likes eating with purpose.", vibeTag: "adventure" },
      { title: "Cause-linked celebration", description: "Aquarius is the humanitarian sign. Some Aquarians want their birthday to matter beyond themselves — a fundraiser, a group volunteer day, or a party that benefits a cause.", vibeTag: "spiritual" },
    ],
    dinnerStyle: "Unusual cuisines, pop-ups, supper clubs, experimental menus. Aquarius doesn't want the 'best restaurant in the city' — they want the one nobody else knows about yet.",
    colors: "Electric blue, turquoise, silver. Aquarius palettes are futuristic and cool — not warm, not traditional. Think: the outfit that looks like it came from a decade that hasn't happened yet.",
    captionDirection: "Quirky, conceptual, internet-native. 'Glitch in the matrix,' 'alt timeline,' 'weird girl birthday.' Aquarius captions should feel like a meme that's also a manifesto.",
    tripStyle: "Unconventional itineraries and off-the-beaten-path destinations. Ubud, Tbilisi, Reykjavik, a random small town in Japan. Aquarius wants the trip that makes other people say 'why would you go there?' and then regret not going.",
  },
  pisces: {
    thesis: "A Pisces birthday should feel dreamy, artistic, and emotionally immersive.",
    intro: "Pisces doesn't want a birthday — they want a feeling. The best Pisces birthday washes over them like music: beautiful, slightly melancholic, deeply personal. If you're planning for a Pisces, create atmosphere. If you are the Pisces, let yourself be the main character in someone else's love letter to you.",
    birthdayVibe: "Soft cinematic energy. Pisces birthdays are built for beauty and emotion — not logistics. Think: the evening where the music was perfect, the lighting was unreal, and someone said something that made you tear up.",
    activities: [
      { title: "Live music or jazz night", description: "A small venue, a great band, low lighting. Pisces processes birthdays through sound. Give them a night where the music says what words can't.", vibeTag: "cultural" },
      { title: "Art workshop or creative day", description: "Painting, pottery, film photography, or creative writing. Pisces wants to make something on their birthday — something that captures how the day felt.", vibeTag: "creative" },
      { title: "Ocean or water day", description: "Pisces is the fish. A day by the ocean, a hot springs visit, or a sunset cruise. Water grounds them in a way nothing else does.", vibeTag: "healing" },
      { title: "Sound bath or meditation ceremony", description: "Crystal bowls, incense, intention-setting. Not every Pisces wants a party — some want a ritual. Give them the permission to go inward.", vibeTag: "spiritual" },
    ],
    dinnerStyle: "Atmospheric restaurants near water, candle-heavy, fusion or creative cuisine. Pisces wants the dinner where the room feels like being inside a painting — warm, artistic, and slightly otherworldly.",
    colors: "Turquoise, sea tones, soft lilac. Pisces palettes are oceanic and ethereal — nothing harsh, nothing industrial. Think: watercolor washes, mother-of-pearl, twilight at the coast.",
    captionDirection: "Poetic, dreamy, slightly surreal. Imagery of tides, dreams, portals. Pisces captions should feel like the last line of a poem — the one that stays with you.",
    tripStyle: "Culture-rich cities with art and history. Paris, Rome, Havana, Udaipur. Pisces wants the trip that feeds their soul — architecture, galleries, cobblestones, and the feeling of being somewhere timeless.",
  },
};

// ─── Generate pages ──────────────────────────────────────────────────────────

function createZodiacPage(sign: ZodiacSign): ContentPage {
  const label = zodiacLabels[sign];
  const dates = zodiacDateRanges[sign];
  const article = articleFor(label);
  const data = signData[sign];

  return {
    slug: `${sign}-birthday-ideas`,
    category: "zodiac",
    title: `${label} Birthday Ideas (2026) — How ${article} ${label} Should Celebrate`,
    description: `Birthday ideas, celebration styles, dinner vibes, color palettes, caption directions, and trip inspiration for ${label} (${dates}). A complete ${label} birthday guide.`,
    headline: `${label} Birthday Ideas`,
    subheadline: `${dates}. ${data.thesis}`,
    tags: { zodiac: sign },
    canonicalPath: `/zodiac-birthdays/${sign}-birthday-ideas`,
    schemaType: "Article",
    publishStatus: "published",
    publishedAt: "2026-04-13",
    updatedAt: "2026-04-13",
    sections: [
      { type: "hero", headline: `${label} Birthday Ideas`, subheadline: `${dates}. ${data.thesis}` },
      {
        type: "tip-list",
        heading: `${label} at a Glance`,
        tips: [
          { title: "Dates", body: dates },
          { title: "Ruling Planet", body: zodiacRulingPlanets[sign] },
          { title: "Element", body: `${zodiacElements[sign]} — ${zodiacElementGroups[zodiacElements[sign]]?.join(", ")}` },
          { title: "Modality", body: zodiacModalities[sign] },
          { title: "Most Compatible With", body: zodiacCompatible[sign].join(", ") },
        ],
      },
      { type: "paragraph", body: data.intro },
      { type: "paragraph", heading: `How ${article} ${label} Likes to Celebrate`, body: data.birthdayVibe },
      {
        type: "idea-list",
        heading: `Best ${label} Birthday Ideas`,
        ideas: data.activities,
      },
      { type: "inline-cta", text: `Generate a personalized ${label} birthday experience` },
      { type: "paragraph", heading: `${label} Birthday Dinner Style`, body: data.dinnerStyle },
      { type: "paragraph", heading: `${label} Birthday Colors & Theme`, body: data.colors },
      { type: "paragraph", heading: `${label} Caption Direction`, body: data.captionDirection },
      { type: "paragraph", heading: `${label} Birthday Trip Style`, body: data.tripStyle },
      { type: "paragraph", body: `If you're just browsing, use this as your ${label} birthday moodboard. If you want everything personalized — captions, palettes, destinations, and celebration style — the generator builds it all based on your exact age, city, and vibe.` },
      { type: "cta", headline: `Get a personalized ${label} birthday experience`, subheadline: `Our generator uses your exact birth date, location, and vibe to build a birthday dashboard made just for you.`, buttonText: "Generate My Birthday", buttonHref: "/onboarding" },
      { type: "related-content" },
    ],
  };
}

const zodiacSigns: ZodiacSign[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

zodiacSigns.map(createZodiacPage).forEach(registerPage);
