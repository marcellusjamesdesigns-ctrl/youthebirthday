/**
 * youthebirthday.app — Icon System
 * Built on Phosphor Icons (@phosphor-icons/react) v2
 *
 * Usage in Server Components:
 *   import { IconStar } from "@/components/ui/icons";
 *   <IconStar size={16} weight="duotone" />
 *
 * Usage in Client Components:
 *   Same import — these re-export from /dist/ssr which is isomorphic.
 *
 * Weight guide for this project:
 *   "duotone"  → hero moments, featured icons, zodiac
 *   "light"    → supporting UI, labels, metadata
 *   "regular"  → body text inline icons, nav
 *   "bold"     → emphasis, CTA-adjacent icons
 */

export {
  // ── Celestial / Cosmic ──────────────────────────────────────────
  Star          as IconStar,
  StarFour      as IconStarFour,
  Moon          as IconMoon,
  MoonStars     as IconMoonStars,
  Sun           as IconSun,
  Planet        as IconPlanet,
  Comet         as IconComet,
  Lightning     as IconLightning,
  Sparkle       as IconSparkle,
  Eye           as IconEye,

  // ── Zodiac signs (closest representational match) ───────────────
  Fire          as IconAries,       // Aries — fire
  Mountains     as IconTaurus,      // Taurus — earth/mountains
  GeminiLogo    as IconGemini,      // Gemini — twins/duality (Phosphor has this)
  Moon          as IconCancer,      // Cancer — moon-ruled
  Sun           as IconLeo,         // Leo — sun-ruled
  Infinity      as IconVirgo,       // Virgo — infinite precision
  Scales        as IconLibra,       // Libra — literal scales
  Scorpio       as IconScorpio,     // Scorpio — Phosphor has this
  Wind          as IconSagittarius, // Sagittarius — free/wind
  Mountains     as IconCapricorn,   // Capricorn — mountain goat
  Drop          as IconAquarius,    // Aquarius — water bearer
  Fish          as IconPisces,      // Pisces — fish

  // ── Luxury / Celebration ────────────────────────────────────────
  Crown         as IconCrown,
  Diamond       as IconDiamond,
  Gift          as IconGift,
  Confetti      as IconConfetti,
  Champagne     as IconChampagne,
  Cake          as IconCake,
  Candle        as IconCandle,
  Balloon       as IconBalloon,
  Party         as IconParty,

  // ── Travel / Destinations ───────────────────────────────────────
  MapPin        as IconMapPin,
  Compass       as IconCompass,
  Airplane      as IconAirplane,
  Suitcase      as IconSuitcase,
  Globe         as IconGlobe,

  // ── Color / Palette ─────────────────────────────────────────────
  Palette       as IconPalette,
  PaintBucket   as IconPaintBucket,
  Swatches      as IconSwatches,
  Eyedropper    as IconEyedropper,

  // ── Caption / Content ───────────────────────────────────────────
  PencilLine    as IconPencilLine,
  ChatCircle    as IconChat,
  Quotes        as IconQuotes,
  Note          as IconNote,

  // ── UI / Navigation ─────────────────────────────────────────────
  ArrowRight    as IconArrowRight,
  ArrowLeft     as IconArrowLeft,
  ArrowUp       as IconArrowUp,
  X             as IconClose,
  Check         as IconCheck,
  Copy          as IconCopy,
  Share         as IconShare,
  Link          as IconLink,
  DotsThree     as IconDotsThree,
  CaretDown     as IconCaretDown,
  CaretRight    as IconCaretRight,

  // ── Nature / Elements ───────────────────────────────────────────
  Fire          as IconFire,
  Wind          as IconWind,
  Drop          as IconDrop,
  Leaf          as IconLeaf,
  Flower        as IconFlower,
  Mountains     as IconMountains,

  // ── Misc ────────────────────────────────────────────────────────
  Timer         as IconTimer,
  Lock          as IconLock,
  SealCheck     as IconVerified,
  Info          as IconInfo,
} from "@phosphor-icons/react/dist/ssr";
