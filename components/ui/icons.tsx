/**
 * youthebirthday.app — Icon System
 * Built on Phosphor Icons (@phosphor-icons/react) v2
 *
 * Usage in Server Components:
 *   import { IconStar } from "@/components/ui/icons";
 *   <IconStar size={16} weight="duotone" />
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
  ShootingStar  as IconComet,       // Comet → ShootingStar
  Lightning     as IconLightning,
  Sparkle       as IconSparkle,
  Eye           as IconEye,

  // ── Zodiac signs (closest representational match) ───────────────
  Fire             as IconAries,       // Aries — fire
  Mountains        as IconTaurus,      // Taurus — earth/mountains
  ArrowsHorizontal as IconGemini,      // Gemini — duality/twins
  Moon             as IconCancer,      // Cancer — moon-ruled
  Sun              as IconLeo,         // Leo — sun-ruled
  Infinity         as IconVirgo,       // Virgo — infinite precision
  Scales           as IconLibra,       // Libra — literal scales
  Waves            as IconScorpio,     // Scorpio — water/intensity
  Wind             as IconSagittarius, // Sagittarius — free/wind
  StarFour         as IconCapricorn,   // Capricorn — mountain star
  Drop             as IconAquarius,    // Aquarius — water bearer
  Fish             as IconPisces,      // Pisces — fish

  // ── Luxury / Celebration ────────────────────────────────────────
  Crown      as IconCrown,
  Diamond    as IconDiamond,
  Gift       as IconGift,
  Confetti   as IconConfetti,
  Champagne  as IconChampagne,
  Cake       as IconCake,
  Flame      as IconCandle,       // Candle → Flame
  Balloon    as IconBalloon,
  DiscoBall  as IconParty,        // Party → DiscoBall

  // ── Travel / Destinations ───────────────────────────────────────
  MapPin    as IconMapPin,
  Compass   as IconCompass,
  Airplane  as IconAirplane,
  Suitcase  as IconSuitcase,
  Globe     as IconGlobe,

  // ── Color / Palette ─────────────────────────────────────────────
  Palette      as IconPalette,
  PaintBucket  as IconPaintBucket,
  Swatches     as IconSwatches,
  Eyedropper   as IconEyedropper,

  // ── Caption / Content ───────────────────────────────────────────
  PencilLine  as IconPencilLine,
  ChatCircle  as IconChat,
  Quotes      as IconQuotes,
  Note        as IconNote,

  // ── UI / Navigation ─────────────────────────────────────────────
  ArrowRight  as IconArrowRight,
  ArrowLeft   as IconArrowLeft,
  ArrowUp     as IconArrowUp,
  X           as IconClose,
  Check       as IconCheck,
  Copy        as IconCopy,
  Share       as IconShare,
  Link        as IconLink,
  DotsThree   as IconDotsThree,
  CaretDown   as IconCaretDown,
  CaretRight  as IconCaretRight,

  // ── Nature / Elements ───────────────────────────────────────────
  Fire      as IconFire,
  Wind      as IconWind,
  Drop      as IconDrop,
  Leaf      as IconLeaf,
  Flower    as IconFlower,
  Mountains as IconMountains,
  Waves     as IconWaves,

  // ── Misc ────────────────────────────────────────────────────────
  Timer      as IconTimer,
  Lock       as IconLock,
  SealCheck  as IconVerified,
  Info       as IconInfo,
} from "@phosphor-icons/react/dist/ssr";
