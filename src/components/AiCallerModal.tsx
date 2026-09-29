import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PhoneOff,
  PhoneCall,
  Shirt,
  Building2,
  Languages,
  Sparkles,
  MapPin,
  CheckCircle2,
  Globe
} from "lucide-react";
import { ThreeHolographicSphere } from "./ThreeHolographicSphere";
import { useTheme } from "../context/ThemeContext";

export type SupportedLanguage = "en" | "hi" | "ja" | "de" | "fr" | "es" | "ar";

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  flag: string;
  region: string;
  bcp47: string;
}

export const IIGF_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", flag: "🇬🇧", region: "Global / UK / USA", bcp47: "en-GB" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳", region: "India & South Asia", bcp47: "hi-IN" },
  { code: "ja", label: "日本語", flag: "🇯🇵", region: "Japan (Tokyo Delegation)", bcp47: "ja-JP" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", region: "Germany & Central Europe", bcp47: "de-DE" },
  { code: "fr", label: "Français", flag: "🇫🇷", region: "France & Luxury Retail", bcp47: "fr-FR" },
  { code: "es", label: "Español", flag: "🇪🇸", region: "Spain & Latin America", bcp47: "es-ES" },
  { code: "ar", label: "العربية", flag: "🇦🇪", region: "UAE & GCC Sourcing", bcp47: "ar-SA" },
];

export interface ToolActionData {
  toolType: "calendar" | "crm" | "whatsapp" | "banking" | "triage";
  title: string;
  subtitle?: string;
  badge?: string;
  doctorName?: string;
  specialty?: string;
  slots?: { time: string; label: string; status: "free" | "booked" | "selected"; badge?: string }[];
  crmFields?: { label: string; value: string; highlight?: boolean }[];
  whatsappMessage?: { to: string; text: string; time?: string };
}

export interface DemoStep {
  step: number;
  speaker: "Buyer" | "Serali";
  speakerType: "user" | "agent";
  text: Record<SupportedLanguage, string>;
  speakerLabels: Record<SupportedLanguage, string>;
  statusBadges: Record<SupportedLanguage, string>;
  toolAction?: ToolActionData;
}

// ── SCENARIO 1: GLOBAL BUYER SOURCING & B2B MATCHMAKING (75TH IIGF) ──
const SOURCING_STEPS: DemoStep[] = [
  {
    step: 1,
    speaker: "Buyer",
    speakerType: "user",
    speakerLabels: {
      en: "BUYER",
      hi: "BUYER",
      ja: "バイヤー",
      de: "EINKÄUFER",
      fr: "ACHETEUR",
      es: "COMPRADOR",
      ar: "المشتري"
    },
    statusBadges: {
      en: "CALLING IN",
      hi: "कॉलिंग इन",
      ja: "発信中",
      de: "ANRUF",
      fr: "APPEL EN COURS",
      es: "LLAMANDO",
      ar: "جارٍ الاتصال"
    },
    text: {
      en: "Hello IIGF Support! I am a UK retail buyer looking for certified organic cotton knitwear with low MOQ below 500 pieces for SS27.",
      hi: "नमस्ते आई.आई.जी.एफ सपोर्ट! मैं यूके से एक खरीदार हूं और मुझे 500 से कम MOQ में 100% ऑर्गेनिक कॉटन निटवियर निर्माता चाहिए।",
      ja: "こんにちは、IIGFサポート！SS27向けにMOQ 500枚以下の認証オーガニックコットンニットを探している英国のバイヤーです。",
      de: "Hallo IIGF Support! Ich bin Einkäufer aus Großbritannien und suche zertifizierte Bio-Baumwoll-Strickwaren mit niedriger MOQ unter 500 Stück.",
      fr: "Bonjour l'assistance IIGF ! Je suis un acheteur britannique à la recherche de tricots en coton biologique certifié avec un faible MOQ de moins de 500 pièces.",
      es: "¡Hola soporte de IIGF! Soy un comprador minorista del Reino Unido que busca prendas de punto de algodón orgánico con MOQ inferior a 500 unidades.",
      ar: "مرحباً بدعم IIGF! أنا مشتري تجزئة بريطاني أبحث عن ملابس تريكو قطنية عضوية معتمدة بحد أدنى للطلب أقل من 500 قطعة."
    },
    toolAction: {
      toolType: "triage",
      title: "AI Multimodal Sourcing Triage",
      subtitle: "75th IIGF Matchmaker Engine",
      crmFields: [
        { label: "BUYER QUERY", value: "100% GOTS Organic Cotton Knits", highlight: true },
        { label: "TARGET MOQ", value: "≤ 500 pcs · Lead Time: 45 Days" },
        { label: "MATCHED CLUSTER", value: "Tirupur Knitwear Export Hub" },
        { label: "BUYER DOSSIER", value: "Sarah Williams (Meridian Apparel UK)" },
      ],
    },
  },
  {
    step: 2,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "CONNECTED",
      hi: "कनेक्टेड",
      ja: "接続中",
      de: "VERBUNDEN",
      fr: "CONNECTÉ",
      es: "CONECTADO",
      ar: "متصل"
    },
    text: {
      en: "Namaste Sarah, welcome to the 75th India International Garment Fair. I have matched you with ABC Textiles at Hall 2, Stall B-17, who specialize in GOTS single jersey knits with MOQ 300.",
      hi: "नमस्ते सारा, 75वें इंडिया इंटरनेशनल गारमेंट फेयर में आपका स्वागत है। मैंने आपको हॉल 2, स्टॉल B-17 पर ABC टेक्सटाइल्स से मैच किया है, जो 300 MOQ में ऑर्गेनिक निट्स बनाते हैं।",
      ja: "ナマステ、サラ様。第75回IIGFへようこそ。ホール2、ブースB-17のABCテキスタイル（MOQ 300のGOTSジャージー専門）とマッチングしました。",
      de: "Namaste Sarah, willkommen zur 75. IIGF. Ich habe Sie mit ABC Textiles in Halle 2, Stand B-17 gematcht – spezialisiert auf GOTS-Jersey mit MOQ 300.",
      fr: "Namasté Sarah, bienvenue à la 75e IIGF. Je vous ai associée à ABC Textiles, Hall 2, Stand B-17, spécialiste du jersey GOTS avec un MOQ de 300.",
      es: "Namaste Sarah, bienvenida a la 75ª IIGF. Te he emparejado con ABC Textiles en el Hall 2, Stand B-17, especializados en punto GOTS con MOQ 300.",
      ar: "نمستي سارة، مرحباً بك في المعرض الدولي الـ75 للملابس. لقد قمت بربطك مع شركة ABC Textiles في القاعة 2، الجناح B-17، المتخصصة في أقمشة GOTS بحد أدنى 300 قطعة."
    },
    toolAction: {
      toolType: "crm",
      title: "Exhibitor Dossier & Audit",
      subtitle: "Bharat Mandapam Registry",
      crmFields: [
        { label: "MATCHED MANUFACTURER", value: "ABC Textiles (Tirupur Cluster)", highlight: true },
        { label: "HALL & STALL", value: "Hall 2 · Stall B-17 (Knitwear Bay)" },
        { label: "COMPLIANCE & AUDITS", value: "GOTS, OEKO-TEX Standard 100, SEDEX" },
        { label: "FIDELITY MATCH", value: "94% Compatibility Score" },
      ],
    },
  },
  {
    step: 3,
    speaker: "Buyer",
    speakerType: "user",
    speakerLabels: {
      en: "BUYER",
      hi: "BUYER",
      ja: "バイヤー",
      de: "EINKÄUFER",
      fr: "ACHETEUR",
      es: "COMPRADOR",
      ar: "المشتري"
    },
    statusBadges: {
      en: "SLOT QUERY",
      hi: "स्लॉट जांच",
      ja: "スロット照会",
      de: "TERMINANFRAGE",
      fr: "DEMANDE CRÉNEAU",
      es: "CONSULTA HORARIO",
      ar: "استفسار الموعد"
    },
    text: {
      en: "That sounds ideal. Can you book a 30-minute private meeting with their export director on the opening day, 14th July around 11:30 AM?",
      hi: "यह बिल्कुल सही है! क्या आप 14 जुलाई को सुबह 11:30 बजे उनके एक्सपोर्ट डायरेक्टर के साथ मेरी 30 मिनट की मीटिंग बुक कर सकती हैं?",
      ja: "理想的ですね。開幕初日の7月14日午前11時30分頃に、輸出担当取締役との30分間の個別商談を予約できますか？",
      de: "Das klingt ideal. Können Sie ein 30-minütiges Treffen mit dem Exportdirektor am Eröffnungstag, dem 14. Juli um 11:30 Uhr buchen?",
      fr: "C'est parfait. Pouvez-vous réserver un rendez-vous de 30 minutes avec leur directeur export le jour de l'ouverture, le 14 juillet vers 11h30 ?",
      es: "Suena perfecto. ¿Puedes reservar una reunión de 30 minutos con su director de exportación el día de apertura, 14 de julio a las 11:30?",
      ar: "هذا ممتاز. هل يمكنك حجز اجتماع خاص لمدة 30 دقيقة مع مدير التصدير في يوم الافتتاح، 14 يوليو حوالي الساعة 11:30 صباحاً؟"
    },
    toolAction: {
      toolType: "calendar",
      title: "Hall 2 B2B Schedule Engine",
      subtitle: "Tuesday, 14 July 2026",
      doctorName: "Rajesh Kumar (Export Director)",
      specialty: "ABC TEXTILES · STALL B-17",
      slots: [
        { time: "10:30 AM", label: "B2B Consultation", status: "free" },
        { time: "11:00 AM", label: "B2B Consultation", status: "free" },
        { time: "11:30 AM", label: "B2B Consultation", status: "free" },
      ],
    },
  },
  {
    step: 4,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "LOCKING REAL SLOT",
      hi: "स्लॉट लॉकिंग",
      ja: "スロット確保中",
      de: "BUCHUNG LÄUFT",
      fr: "VERROUILLAGE CRÉNEAU",
      es: "BLOQUEANDO HORARIO",
      ar: "جارٍ تثبيت الموعد"
    },
    text: {
      en: "Certainly! I am locking the 11:30 AM private slot on Tuesday 14th July with Export Director Rajesh Kumar in Hall 2. Shall I confirm this for you?",
      hi: "बिल्कुल! मैं 14 जुलाई को सुबह 11:30 बजे एक्सपोर्ट डायरेक्टर राजेश कुमार के साथ हॉल 2 में आपका स्लॉट लॉक कर रही हूं। क्या मैं इसे कन्फर्म कर दूं?",
      ja: "承知いたしました！7月14日火曜日午前11時30分、ホール2でのラジェシュ・クマール取締役との商談枠を確保しています。確定してよろしいですか？",
      de: "Natürlich! Ich reserviere den Termin am Dienstag, 14. Juli um 11:30 Uhr mit Exportdirektor Rajesh Kumar in Halle 2. Soll ich bestätigen?",
      fr: "Certainement ! Je verrouille le créneau du mardi 14 juillet à 11h30 avec le directeur export Rajesh Kumar dans le Hall 2. Dois-je confirmer ?",
      es: "¡Por supuesto! Estoy bloqueando la reunión privada del martes 14 de julio a las 11:30 con Rajesh Kumar en el Hall 2. ¿La confirmo?",
      ar: "بالتأكيد! أقوم بتثبيت الموعد الخاص يوم الثلاثاء 14 يوليو الساعة 11:30 صباحاً مع مدير التصدير راجيش كومار. هل أؤكد ذلك لك؟"
    },
    toolAction: {
      toolType: "calendar",
      title: "Hall 2 B2B Schedule Engine",
      subtitle: "Tuesday, 14 July 2026",
      doctorName: "Rajesh Kumar (Export Director)",
      specialty: "ABC TEXTILES · STALL B-17",
      slots: [
        { time: "10:30 AM", label: "B2B Consultation", status: "free" },
        { time: "11:00 AM", label: "B2B Consultation", status: "free" },
        { time: "11:30 AM", label: "B2B Consultation", status: "selected", badge: "LOCKING..." },
      ],
    },
  },
  {
    step: 5,
    speaker: "Buyer",
    speakerType: "user",
    speakerLabels: {
      en: "BUYER",
      hi: "BUYER",
      ja: "バイヤー",
      de: "EINKÄUFER",
      fr: "ACHETEUR",
      es: "COMPRADOR",
      ar: "المشتري"
    },
    statusBadges: {
      en: "MEETING CONFIRMED",
      hi: "मीटिंग कन्फर्म",
      ja: "商談確定",
      de: "TERMIN BESTÄTIGT",
      fr: "RÉUNION CONFIRMÉE",
      es: "REUNIÓN CONFIRMADA",
      ar: "تم تأكيد الاجتماع"
    },
    text: {
      en: "Yes please, confirm the slot and dispatch the VIP digital badge and booth coordinates.",
      hi: "हां कृपया कन्फर्म करें और मुझे डिजिटल बैज व लोकेशन भेज दीजिए।",
      ja: "はい、お願いします。枠を確定して、VIPデジタルバッジとブースの位置情報を送信してください。",
      de: "Ja bitte, bestätigen Sie den Termin und senden Sie mir den digitalen VIP-Ausweis sowie die Standkoordinaten.",
      fr: "Oui s'il vous plaît, confirmez le créneau et envoyez le badge numérique VIP et les coordonnées du stand.",
      es: "Sí, por favor, confirma el horario y envía el pase digital VIP con la ubicación del stand.",
      ar: "نعم من فضلك، أكد الموعد وأرسل الشارة الرقمية VIP وإحداثيات الجناح."
    },
    toolAction: {
      toolType: "calendar",
      title: "Hall 2 B2B Schedule Engine",
      subtitle: "Tuesday, 14 July 2026",
      doctorName: "Rajesh Kumar (Export Director)",
      specialty: "ABC TEXTILES · STALL B-17",
      slots: [
        { time: "10:30 AM", label: "B2B Consultation", status: "free" },
        { time: "11:00 AM", label: "B2B Consultation", status: "free" },
        { time: "11:30 AM", label: "B2B Consultation", status: "booked", badge: "CONFIRMED ✓" },
      ],
    },
  },
  {
    step: 6,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "DISPATCHING WHATSAPP DOSSIER",
      hi: "व्हाट्सएप व बैज भेजा गया",
      ja: "WhatsApp書類送信済み",
      de: "WHATSAPP DOSSIER VERSENDET",
      fr: "DOSSIER WHATSAPP ENVOYÉ",
      es: "DOSSIER ENVIADO POR WHATSAPP",
      ar: "تم إرسال الملف عبر واتساب"
    },
    text: {
      en: "All set! Your B2B meeting is confirmed. I have dispatched ABC Textiles' SS27 product catalog, swatch specs, and Gate 4 VIP fast-track directions to your WhatsApp.",
      hi: "बहुत बढ़िया! आपकी मीटिंग कन्फर्म हो गई है। मैंने ABC टेक्सटाइल्स का कैटलॉग, स्वैच डिटेल्स और गेट 4 VIP रूट आपके WhatsApp पर भेज दिया है।",
      ja: "完了しました！商談が確定しました。ABCテキスタイルのSS27カタログ、スワッチ詳細、Gate 4 VIPファストトラック案内をWhatsAppにお送りしました。",
      de: "Alles bereit! Ihr B2B-Treffen ist bestätigt. Ich habe den SS27-Katalog von ABC Textiles, Stoffmuster-Details und die VIP-Wegbeschreibung per WhatsApp gesendet.",
      fr: "C'est prêt ! Votre réunion B2B est confirmée. J'ai envoyé le catalogue SS27 d'ABC Textiles, les détails d'échantillons et l'itinéraire VIP Porte 4 sur votre WhatsApp.",
      es: "¡Listo! Tu reunión B2B está confirmada. He enviado el catálogo SS27 de ABC Textiles, especificaciones de muestras y acceso VIP por Puerta 4 a tu WhatsApp.",
      ar: "كل شيء جاهز! تم تأكيد الاجتماع. لقد أرسلت كتالوج ABC Textiles لموسم SS27 وتفاصيل العينات ومسار VIP من البوابة 4 إلى تطبيق واتساب الخاص بك."
    },
    toolAction: {
      toolType: "whatsapp",
      title: "IIGF WhatsApp VIP Gateway",
      subtitle: "Twilio Cloud API · Sent",
      whatsappMessage: {
        to: "+44 7911 123456 (Sarah Williams)",
        text: "Hi Sarah, 75th IIGF B2B Meeting Confirmed with ABC Textiles (Hall 2, Stall B-17) on Tuesday 14 July at 11:30 AM. VIP Fast-Track Pass: https://iigf.in/pass/v892",
        time: "11:32 AM",
      },
    },
  },
];

// ── SCENARIO 2: VIP BUYER HOSPITALITY & HOTEL LOGISTICS ──
const LOGISTICS_STEPS: DemoStep[] = [
  {
    step: 1,
    speaker: "Buyer",
    speakerType: "user",
    speakerLabels: {
      en: "BUYER",
      hi: "BUYER",
      ja: "バイヤー",
      de: "EINKÄUFER",
      fr: "ACHETEUR",
      es: "COMPRADOR",
      ar: "المشتري"
    },
    statusBadges: {
      en: "CALLING IN",
      hi: "कॉलिंग इन",
      ja: "発信中",
      de: "ANRUF",
      fr: "APPEL EN COURS",
      es: "LLAMANDO",
      ar: "جارٍ الاتصال"
    },
    text: {
      en: "Hello! My flight arrives at Delhi Airport Terminal 3 tomorrow at 8:15 AM. How do I access the official IIGF VIP limousine to The Taj Mahal Hotel?",
      hi: "नमस्ते! मेरी फ्लाइट कल सुबह 8:15 बजे दिल्ली एयरपोर्ट T3 पर आ रही है। ताज महल होटल के लिए IIGF VIP कार कैसे मिलेगी?",
      ja: "こんにちは！明日の朝8時15分にデリー空港T3に到着します。タージマハルホテル行きの公式IIGF VIP送迎車はどこで利用できますか？",
      de: "Hallo! Mein Flug landet morgen um 8:15 Uhr am Flughafen Delhi T3. Wie erreiche ich die offizielle IIGF-VIP-Limousine zum The Taj Mahal Hotel?",
      fr: "Bonjour ! Mon vol arrive demain à 8h15 à l'aéroport de Delhi T3. Comment accéder à la limousine VIP officielle de l'IIGF vers l'hôtel The Taj Mahal ?",
      es: "¡Hola! Mi vuelo llega mañana a las 8:15 al aeropuerto de Delhi T3. ¿Cómo accedo a la limusina VIP oficial de IIGF hacia The Taj Mahal Hotel?",
      ar: "مرحباً! ستصل رحلتي إلى مطار دلهي المبنى 3 غداً الساعة 8:15 صباحاً. كيف أصل إلى سيارة ليموزين IIGF VIP الرسمية إلى فندق تاج محل؟"
    },
    toolAction: {
      toolType: "triage",
      title: "Overseas Buyer Hospitality Record",
      subtitle: "Ministry of Textiles Delegate",
      crmFields: [
        { label: "DELEGATE", value: "Karan Sharma (+91 98201 44021)", highlight: true },
        { label: "FLIGHT", value: "BA 143 · London Heathrow (LHR) ➔ DEL T3" },
        { label: "ALLOCATED HOTEL", value: "The Taj Mahal Hotel, Man Singh Road" },
        { label: "HOSPITALITY STATUS", value: "Complimentary VIP Protocol" },
      ],
    },
  },
  {
    step: 2,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "CONNECTED",
      hi: "कनेक्टेड",
      ja: "接続中",
      de: "VERBUNDEN",
      fr: "CONNECTÉ",
      es: "CONECTADO",
      ar: "متصل"
    },
    text: {
      en: "Welcome Karan! Chauffeur Ramesh (+91 98110 55210) will be waiting at Terminal 3 Gate 5 with an IIGF VIP placard. Your express hotel check-in has been pre-cleared.",
      hi: "स्वागत है करण! T3 गेट 5 पर ड्राइवर रमेश (+91 98110 55210) IIGF प्लेकार्ड के साथ तैयार रहेंगे। आपके होटल का एक्सप्रेस चेक-इन एक्टिव कर दिया गया है।",
      ja: "ようこそカラン様！運転手のラメシュ（+91 98110 55210）がターミナル3ゲート5にてIIGF案内板を持ってお待ちしております。ホテルへの優先チェックインも完了しています。",
      de: "Willkommen Karan! Chauffeur Ramesh (+91 98110 55210) wartet an Terminal 3 Gate 5 mit einem IIGF-Schild. Ihr Express-Hotel-Check-in ist bereits vorbereitet.",
      fr: "Bienvenue Karan ! Le chauffeur Ramesh (+91 98110 55210) vous attendra au Terminal 3 Porte 5 avec une pancarte IIGF. Votre enregistrement à l'hôtel est pré-validé.",
      es: "¡Bienvenido Karan! El chófer Ramesh (+91 98110 55210) te esperará en la Terminal 3 Puerta 5 con un cartel de IIGF. Tu check-in exprés en el hotel está listo.",
      ar: "أهلاً بك كاران! السائق راميش (+91 98110 55210) سيكون في انتظارك عند البوابة 5 في المبنى 3 مع لوحة IIGF VIP. تم اعتماد تسجيل الوصول السريع في الفندق."
    },
    toolAction: {
      toolType: "crm",
      title: "GPS Chauffeur Telemetry",
      subtitle: "VIP Priority Corridor",
      crmFields: [
        { label: "PICKUP POINT", value: "Terminal 3 International Gate 5", highlight: true },
        { label: "ASSIGNED VEHICLE", value: "Toyota Innova Crysta (DL 1Z B 8920)" },
        { label: "TRANSIT ETA", value: "20 mins via Dedicated Fair Lane" },
      ],
    },
  },
  {
    step: 3,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "DISPATCHING WHATSAPP",
      hi: "व्हाट्सएप भेजा गया",
      ja: "WhatsApp送信完了",
      de: "WHATSAPP VERSENDET",
      fr: "WHATSAPP ENVOYÉ",
      es: "WHATSAPP ENVIADO",
      ar: "تم الإرسال عبر واتساب"
    },
    text: {
      en: "Your RFID Smart Badge will be presented at hotel check-in, and the private electric coach departs every 20 minutes from the hotel porch to Bharat Mandapam Gate 4.",
      hi: "आपका RFID स्मार्ट बैज होटल चेक-इन पर मिल जाएगा, और भारत मंडपम गेट 4 के लिए हर 20 मिनट पर होटल से प्राइवेट इलेक्ट्रिक बस चलेगी।",
      ja: "RFIDスマートバッジはホテルチェックイン時にお渡しします。また、ホテル前からバーラト・マンダパムGate 4へ直行する専用EVバスが20分間隔で運行しています。",
      de: "Ihr RFID-Smart-Badge wird Ihnen beim Hotel-Check-in überreicht, und der private Elektro-Shuttlebus fährt alle 20 Minuten direkt zum Bharat Mandapam Tor 4.",
      fr: "Votre badge RFID vous sera remis à l'hôtel, et la navette électrique privée part toutes les 20 minutes du parvis de l'hôtel vers la Porte 4 de Bharat Mandapam.",
      es: "Tu tarjeta RFID te será entregada en el check-in del hotel, y el autobús eléctrico privado sale cada 20 minutos hacia la Puerta 4 de Bharat Mandapam.",
      ar: "سيتم تسليم شارة RFID الذكية الخاصة بك عند تسجيل الوصول، وتنطلق الحافلة الكهربائية الخاصة كل 20 دقيقة من الفندق إلى البوابة 4 في بهارات ماندابام."
    },
    toolAction: {
      toolType: "whatsapp",
      title: "WhatsApp Logistics Dispatch",
      subtitle: "Chauffeur & Smart Badge Info",
      whatsappMessage: {
        to: "+91 98201 44021 (Karan Sharma)",
        text: "IIGF VIP Transfer Confirmed: Chauffeur Ramesh (DL 1Z B 8920) at DEL T3 Gate 5. Taj Mahal Hotel Check-in: #TMH-8812. Have a wonderful fair!",
        time: "8:20 AM",
      },
    },
  },
];

// ── SCENARIO 3: MASTER WEAVER & MULTILINGUAL TRANSLATION ──
const TRANSLATION_STEPS: DemoStep[] = [
  {
    step: 1,
    speaker: "Buyer",
    speakerType: "user",
    speakerLabels: {
      en: "BUYER",
      hi: "BUYER",
      ja: "バイヤー",
      de: "EINKÄUFER",
      fr: "ACHETEUR",
      es: "COMPRADOR",
      ar: "المشتري"
    },
    statusBadges: {
      en: "CALLING IN",
      hi: "कॉलिंग इन",
      ja: "発信中",
      de: "ANRUF",
      fr: "APPEL EN COURS",
      es: "LLAMANDO",
      ar: "جارٍ الاتصال"
    },
    text: {
      en: "Konnichiwa! We want to order 800 hand-block vegetable dyed silk scarves. Can the artisan guarantee natural indigo fastness for Japanese standards?",
      hi: "नमस्ते! हम 800 हैंड-ब्लॉक नेचुरल डाइड सिल्क स्कार्फ ऑर्डर करना चाहते हैं। क्या यह जापानी स्टैंडर्ड्स के अनुसार कलर-फास्ट है?",
      ja: "こんにちは！草木染め・手捺染シルクスカーフを800枚発注したいのですが、日本のJIS規格に適合する天然藍染めの色落ち堅牢度を保証できますか？",
      de: "Konnichiwa! Wir möchten 800 pflanzengefärbte Handblock-Seidenschals bestellen. Kann der Kunsthandwerker die Indigo-Echtheit nach japanischem Standard garantieren?",
      fr: "Konnichiwa ! Nous souhaitons commander 800 foulards en soie imprimés au tampon végétal. L'artisan garantit-il la solidité de l'indigo selon les normes japonaises ?",
      es: "¡Konnichiwa! Queremos pedir 800 bufandas de seda teñidas con tintes vegetales. ¿Puede el artesano garantizar la solidez del índigo según los estándares japoneses?",
      ar: "كونيتشوا! نريد طلب 800 وشاح حريري مصبوغ يدوياً بألوان نباتية. هل يضمن الحرفي ثبات لون النيلة الطبيعية وفقاً للمعايير اليابانية؟"
    },
    toolAction: {
      toolType: "triage",
      title: "Speech & Dialect Translation",
      subtitle: "Japanese / English ➔ Hindi Dialect",
      crmFields: [
        { label: "BUYER QUERY", value: "Vegetable Dye Silk Scarves (800 pcs)", highlight: true },
        { label: "TESTING STANDARD", value: "JIS L 0844 Japanese Color Fastness" },
        { label: "EXHIBITOR", value: "FashionWorks India (Jaipur Artisan Collective)" },
        { label: "TRANSLATION ACCURACY", value: "99.4% Domain Fidelity" },
      ],
    },
  },
  {
    step: 2,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "CONNECTED",
      hi: "कनेक्टेड",
      ja: "接続中",
      de: "VERBUNDEN",
      fr: "CONNECTÉ",
      es: "CONECTADO",
      ar: "متصل"
    },
    text: {
      en: "Master Weaver Ramkishan confirms that their Bagru natural indigo uses organic harda mordants meeting JIS Level 4 colorfastness. Lab dip swatches can be shipped via DHL today.",
      hi: "मास्टर बुनकर रामकिशन जी ने पुष्टि की है कि उनकी बगरू नेचुरल डाई जापानी JIS लेवल 4 मानकों को पूरा करती है। आज ही टेस्टेड स्वैच भेजे जा सकते हैं।",
      ja: "人間国宝の織物匠ラムキシャン氏より回答です。バグルー天然藍染めは有機ハルダ媒染を用い、JIS 4級以上の染色堅牢度を満たしています。本日中にDHLで検査用スワッチを発送可能です。",
      de: "Meisterweber Ramkishan bestätigt, dass ihr Bagru-Naturindigo JIS-Stufe-4-Farbechtheit erfüllt. Labor-Farbmuster können heute per DHL versendet werden.",
      fr: "Le maître tisserand Ramkishan confirme que leur indigo naturel de Bagru respecte la norme JIS niveau 4. Des échantillons de test peuvent être expédiés via DHL dès aujourd'hui.",
      es: "El maestro tejedor Ramkishan confirma que su índigo natural de Bagru cumple con la solidez de color JIS Nivel 4. Se pueden enviar muestras certificadas por DHL hoy mismo.",
      ar: "يؤكد كبير النساجين رامكيشان أن صبغة الباغرو النيلية الطبيعية تلبي معايير JIS اليابانية من المستوى 4 لثبات اللون. يمكن شحن عينات مخبرية عبر DHL اليوم."
    },
    toolAction: {
      toolType: "crm",
      title: "Lab Dip & Courier Protocol",
      subtitle: "DHL Global Express Bay",
      crmFields: [
        { label: "ARTISAN MASTER", value: "Ramkishan Chippa (National Awardee)", highlight: true },
        { label: "FABRIC SPEC", value: "100% Chanderi Silk 60 GSM" },
        { label: "AIR COURIER TRACKING", value: "DHL Express #7729-1092-JP" },
      ],
    },
  },
  {
    step: 3,
    speaker: "Serali",
    speakerType: "agent",
    speakerLabels: {
      en: "SERALI",
      hi: "SERALI",
      ja: "セラリ",
      de: "SERALI",
      fr: "SERALI",
      es: "SERALI",
      ar: "سيرالي"
    },
    statusBadges: {
      en: "COMMERCIAL LOI DISPATCHED",
      hi: "ऑर्डर लेटर व अनुबंध जारी",
      ja: "商業LOI発行済み",
      de: "LOI-VERTRAG VERSENDET",
      fr: "LETTRE D'INTENTION ÉMISE",
      es: "CARTA DE INTENCIÓN EMITIDA",
      ar: "تم إصدار خطاب النوايا التجاري"
    },
    text: {
      en: "The bilingual Letter of Intent (LOI) with Tokyo FOB terms of $18.50 per piece has been generated and sent to both parties for digital signing.",
      hi: "टोक्यो FOB $18.50 प्रति पीस की दर से डिजिटल लेटर ऑफ इंटेंट (LOI) तैयार करके दोनों पक्षों को हस्ताक्षर हेतु भेज दिया गया है।",
      ja: "東京FOB単価18.50ドルの日英バイリンガル意向表明書（LOI）を作成し、双方の電子署名用に送信いたしました。",
      de: "Die zweisprachige Absichtserklärung (LOI) mit Tokio-FOB-Konditionen von 18,50 $ pro Stück wurde erstellt und zur digitalen Signatur versandt.",
      fr: "La lettre d'intention bilingue avec des conditions FOB Tokyo de 18,50 $ par pièce a été générée et transmise aux deux parties pour signature numérique.",
      es: "La Carta de Intención bilingüe con términos FOB Tokio a $18.50 por pieza ha sido generada y enviada a ambas partes para firma digital.",
      ar: "تم إنشاء خطاب النوايا التجاري ثنائي اللغة بسعر FOB طوكيو 18.50 دولار للقطعة الواحدة وإرساله للطرفين للتوقيع الرقمي."
    },
    toolAction: {
      toolType: "whatsapp",
      title: "Bilingual Contract Gateway",
      subtitle: "Digital Signature Ready",
      whatsappMessage: {
        to: "kenji@tokyofashion.jp / +81 90 1234 5678",
        text: "IIGF Contract Dossier: 800 pcs Bagru Silk Scarves FOB Tokyo $18.50. Sign LOI: https://iigf.in/sign/jp894",
        time: "3:45 PM",
      },
    },
  },
];

interface AiCallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCallerModal: React.FC<AiCallerModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [scenarioKey, setScenarioKey] = useState<"sourcing" | "logistics" | "translation">("sourcing");
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<"simulation" | "live-voice">("simulation");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Live Mic Voice Call state
  const [isCalling, setIsCalling] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const [isAgentSpeakingLive, setIsAgentSpeakingLive] = useState(false);
  const [isUserSpeakingLive, setIsUserSpeakingLive] = useState(false);

  const recognitionRef = useRef<any>(null);
  const currentUtterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playbackTimerRef = useRef<any>(null);

  const steps = useMemo(() => {
    switch (scenarioKey) {
      case "sourcing": return SOURCING_STEPS;
      case "logistics": return LOGISTICS_STEPS;
      case "translation": return TRANSLATION_STEPS;
    }
  }, [scenarioKey]);

  const currentStep = steps[stepIndex] || steps[0];

  const isUserSpeaking = activeMode === "live-voice" 
    ? isUserSpeakingLive 
    : (isPlaying && currentStep.speakerType === "user");

  const isAgentSpeaking = activeMode === "live-voice" 
    ? isAgentSpeakingLive 
    : (isPlaying && currentStep.speakerType === "agent");

  // Dynamic texts based on active language
  const activeMainText = currentStep.text[language] || currentStep.text.en;
  const activeTranslationText = language === "en" ? currentStep.text.hi : currentStep.text.en;
  const activeSpeakerLabel = currentStep.speakerLabels[language] || currentStep.speakerLabels.en;

  const handleSelectScenario = (key: "sourcing" | "logistics" | "translation") => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    setScenarioKey(key);
    setStepIndex(0);
    setIsPlaying(false);
  };

  // Voice library cache
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setAvailableVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Safe Cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isOpen, onClose]);

  // Select the most natural, human-like neural voice available for each persona and language
  const getHumanVoice = useCallback((voices: SpeechSynthesisVoice[], speakerType: "user" | "agent", lang: SupportedLanguage) => {
    if (!voices || voices.length === 0) return null;

    if (lang === "ja") {
      // Japanese (Kyoko, Otoya, Nanami, Google 日本語)
      return (
        voices.find(v => v.lang && v.lang.startsWith("ja") && v.name.includes("Natural")) ||
        voices.find(v => v.lang && v.lang.startsWith("ja") && (v.name.includes("Kyoko") || v.name.includes("Nanami") || v.name.includes("Google"))) ||
        voices.find(v => v.lang && v.lang.startsWith("ja")) ||
        voices[0]
      );
    } else if (lang === "de") {
      // German (Katja, Stefan, Google Deutsch)
      return (
        voices.find(v => v.lang && v.lang.startsWith("de") && v.name.includes("Natural")) ||
        voices.find(v => v.lang && v.lang.startsWith("de") && (v.name.includes("Katja") || v.name.includes("Google") || v.name.includes("Marlene"))) ||
        voices.find(v => v.lang && v.lang.startsWith("de")) ||
        voices[0]
      );
    } else if (lang === "fr") {
      // French (Audrey, Thomas, Google Français)
      return (
        voices.find(v => v.lang && v.lang.startsWith("fr") && v.name.includes("Natural")) ||
        voices.find(v => v.lang && v.lang.startsWith("fr") && (v.name.includes("Audrey") || v.name.includes("Thomas") || v.name.includes("Google"))) ||
        voices.find(v => v.lang && v.lang.startsWith("fr")) ||
        voices[0]
      );
    } else if (lang === "es") {
      // Spanish (Monica, Jorge, Google Español)
      return (
        voices.find(v => v.lang && v.lang.startsWith("es") && v.name.includes("Natural")) ||
        voices.find(v => v.lang && v.lang.startsWith("es") && (v.name.includes("Monica") || v.name.includes("Google") || v.name.includes("Jorge"))) ||
        voices.find(v => v.lang && v.lang.startsWith("es")) ||
        voices[0]
      );
    } else if (lang === "ar") {
      // Arabic (Laila, Maged, Google العربية)
      return (
        voices.find(v => v.lang && v.lang.startsWith("ar") && v.name.includes("Natural")) ||
        voices.find(v => v.lang && v.lang.startsWith("ar") && (v.name.includes("Laila") || v.name.includes("Maged") || v.name.includes("Google"))) ||
        voices.find(v => v.lang && v.lang.startsWith("ar")) ||
        voices[0]
      );
    } else if (lang === "hi") {
      if (speakerType === "agent") {
        return (
          voices.find(v => v.name.includes("Natural") && (v.lang.startsWith("hi") || v.lang === "en-IN")) ||
          voices.find(v => v.name.includes("Swara") || v.name.includes("Neerja") || v.name.includes("Google हिन्दी")) ||
          voices.find(v => v.lang.startsWith("hi")) ||
          voices.find(v => v.lang === "en-IN") ||
          voices[0]
        );
      } else {
        return (
          voices.find(v => v.name.includes("Madhur") || v.name.includes("Prabhat") || v.name.includes("Hemant")) ||
          voices.find(v => v.lang.startsWith("hi")) ||
          voices.find(v => v.lang === "en-IN") ||
          voices[0]
        );
      }
    } else {
      if (speakerType === "agent") {
        return (
          voices.find(v => v.name.includes("Natural") && (v.lang === "en-IN" || v.name.includes("India"))) ||
          voices.find(v => v.name.includes("Neerja") || v.name.includes("Heera") || v.name.includes("Google Indian English")) ||
          voices.find(v => v.lang === "en-IN") ||
          voices.find(v => v.name.includes("Natural") && v.lang.startsWith("en")) ||
          voices.find(v => v.name.includes("Google") && (v.lang.startsWith("en-GB") || v.lang.startsWith("en-US"))) ||
          voices.find(v => v.lang.startsWith("en")) ||
          voices[0]
        );
      } else {
        return (
          voices.find(v => v.name.includes("Natural") && (v.lang === "en-GB" || v.name.includes("Libby") || v.name.includes("Sonia") || v.name.includes("Aria") || v.name.includes("Jenny"))) ||
          voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Victoria") || v.name.includes("Karen")) ||
          voices.find(v => v.lang === "en-GB") ||
          voices.find(v => v.lang === "en-US") ||
          voices.find(v => v.lang.startsWith("en")) ||
          voices[0]
        );
      }
    }
  }, []);

  // Speech synthesis with human prosody and cadence
  const speakCurrentStep = useCallback((step: DemoStep, lang: SupportedLanguage) => {
    if (typeof window === "undefined" || !window.speechSynthesis || isAudioMuted) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const textToSpeak = step.text[lang] || step.text.en;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterRef.current = utter;

      const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
      const isAgent = step.speakerType === "agent";

      const selectedVoice = getHumanVoice(voices, step.speakerType, lang);
      if (selectedVoice) {
        utter.voice = selectedVoice;
        utter.lang = selectedVoice.lang;
      } else {
        const langObj = IIGF_LANGUAGES.find(l => l.code === lang);
        utter.lang = langObj ? langObj.bcp47 : "en-US";
      }

      if (lang === "ja") {
        utter.rate = 1.0;
        utter.pitch = isAgent ? 1.08 : 1.0;
      } else if (lang === "de" || lang === "fr" || lang === "es") {
        utter.rate = 0.98;
        utter.pitch = isAgent ? 1.06 : 1.0;
      } else if (lang === "hi") {
        utter.rate = isAgent ? 0.96 : 0.98;
        utter.pitch = isAgent ? 1.08 : 0.98;
      } else {
        utter.rate = isAgent ? 0.98 : 1.02;
        utter.pitch = isAgent ? 1.08 : 1.02;
      }

      utter.volume = 1.0;

      utter.onend = () => {
        if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
        playbackTimerRef.current = setTimeout(() => {
          setStepIndex(prev => {
            if (prev < steps.length - 1) {
              return prev + 1;
            } else {
              setIsPlaying(false);
              return prev;
            }
          });
        }, 900);
      };

      utter.onerror = () => {};

      window.speechSynthesis.speak(utter);
    } catch {}
  }, [isAudioMuted, availableVoices, getHumanVoice, steps.length]);

  // Play loop
  useEffect(() => {
    if (!isOpen) return;

    if (!isPlaying) {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      return;
    }

    speakCurrentStep(currentStep, language);

    const text = currentStep.text[language] || currentStep.text.en;
    const fallbackDuration = Math.max(4500, (text.length / 10) * 1000 + 2000);

    const safetyTimer = setTimeout(() => {
      setStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, fallbackDuration);

    return () => {
      clearTimeout(safetyTimer);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, [isOpen, isPlaying, stepIndex, language, scenarioKey, isAudioMuted, currentStep, speakCurrentStep, steps.length]);

  // Live Speech Recognition
  const handleToggleLiveCall = () => {
    if (isCalling) {
      setIsCalling(false);
      setIsUserSpeakingLive(false);
      setIsAgentSpeakingLive(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    } else {
      setIsCalling(true);
      setUserTranscript("Listening for your voice... speak now (e.g., 'Find organic cotton knitwear in Hall 2')");
      setAgentResponse("IIGF Voice Neural Core Connected · Ready for your sourcing request");

      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          const langObj = IIGF_LANGUAGES.find(l => l.code === language);
          recognition.lang = langObj ? langObj.bcp47 : "en-US";

          recognition.onstart = () => {
            setIsUserSpeakingLive(true);
          };

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            setUserTranscript(transcript);

            if (event.results[current].isFinal) {
              setIsUserSpeakingLive(false);
              setIsAgentSpeakingLive(true);

              let reply = "I have located certified Indian manufacturers in Hall 2 matching your requirements. ABC Textiles at Stall B-17 has GOTS organic cotton samples ready.";
              if (transcript.toLowerCase().includes('hotel') || transcript.toLowerCase().includes('airport')) {
                reply = "The official IIGF VIP limousine is waiting at Terminal 3 Gate 5, and your Taj Mahal Hotel check-in is confirmed.";
              } else if (transcript.toLowerCase().includes('badge') || transcript.toLowerCase().includes('gate')) {
                reply = "Your Fast-Track Overseas Buyer RFID badge is ready for collection at Gate 4 VIP lounge.";
              }

              setAgentResponse(reply);

              if (typeof window !== "undefined" && window.speechSynthesis && !isAudioMuted) {
                try {
                  const utter = new SpeechSynthesisUtterance(reply);
                  const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
                  const agentVoice = getHumanVoice(voices, "agent", language);
                  if (agentVoice) {
                    utter.voice = agentVoice;
                    utter.lang = agentVoice.lang;
                  } else {
                    const langObj = IIGF_LANGUAGES.find(l => l.code === language);
                    utter.lang = langObj ? langObj.bcp47 : "en-US";
                  }
                  utter.rate = 0.98;
                  utter.pitch = 1.08;
                  utter.onend = () => setIsAgentSpeakingLive(false);
                  window.speechSynthesis.speak(utter);
                } catch {
                  setTimeout(() => setIsAgentSpeakingLive(false), 3000);
                }
              } else {
                setTimeout(() => setIsAgentSpeakingLive(false), 3000);
              }
            }
          };

          recognition.onerror = () => {
            setIsUserSpeakingLive(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
        } else {
          setUserTranscript("Voice simulation connected: 'Looking for organic cotton knits MOQ 300'");
          setTimeout(() => {
            setIsUserSpeakingLive(false);
            setIsAgentSpeakingLive(true);
            const reply = "Matched with ABC Textiles (Tirupur Cluster, Stall B-17). Booking your 11:30 AM appointment now.";
            setAgentResponse(reply);
            if (typeof window !== "undefined" && window.speechSynthesis && !isAudioMuted) {
              try {
                const utter = new SpeechSynthesisUtterance(reply);
                utter.onend = () => setIsAgentSpeakingLive(false);
                window.speechSynthesis.speak(utter);
              } catch {
                setTimeout(() => setIsAgentSpeakingLive(false), 3000);
              }
            }
          }, 2000);
        }
      } catch (err) {
        console.warn("Speech recognition notice:", err);
      }
    }
  };

  const selectedLangObj = IIGF_LANGUAGES.find(l => l.code === language) || IIGF_LANGUAGES[0];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#07090D",
        color: "#F8FAFC",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* ── EXACT PHOTO BACKGROUND: DEEP OBSIDIAN WITH WARM GOLD BLEND AT BOTTOM ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse 120% 70% at 50% 100%, rgba(223, 183, 74, 0.38) 0%, rgba(223, 183, 74, 0.20) 35%, rgba(14, 16, 22, 0.85) 65%, #07090D 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, #07090D 0%, #07090D 55%, rgba(7, 9, 13, 0.75) 75%, rgba(223, 183, 74, 0.22) 100%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* ── TOP HEADER / CONTROLS (75th IIGF IDENTITY) ── */}
      <header
        style={{
          position: "relative",
          zIndex: 30,
          padding: "14px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          gap: 12,
        }}
      >
        {/* Left: IIGF Brand Logo & Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="https://www.indiaapparelfair.com/75th/img/logo.png"
            alt="75th IIGF"
            style={{ height: 30, width: "auto", objectFit: "contain", filter: "brightness(1.15)" }}
            onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
          />
          <div style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.18)", paddingLeft: 12 }}>
            <span style={{ color: "#E6005C", fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", display: "block" }}>
              75TH IIGF AI VOICE AGENT
            </span>
            <span style={{ color: "#94A3B8", fontSize: 9, fontWeight: 600 }}>
              Autonomous Sourcing & Fair Concierge
            </span>
          </div>
        </div>

        {/* Center: Scenario Switcher + Multilingual Delegation Picker + Mode */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Scenarios */}
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.04)",
              padding: 3,
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {[
              { id: "sourcing", label: "B2B Sourcing", icon: Shirt },
              { id: "logistics", label: "VIP Logistics", icon: Building2 },
              { id: "translation", label: "Weaver Translation", icon: Languages },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = scenarioKey === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectScenario(tab.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.03em",
                    background: isSelected ? "#DFB74A" : "transparent",
                    color: isSelected ? "#07090D" : "#94A3B8",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── MULTILINGUAL DELEGATION LANGUAGE PICKER (7 IIGF LANGUAGES) ── */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 10,
                border: "1px solid rgba(223, 183, 74, 0.4)",
                background: "rgba(223, 183, 74, 0.12)",
                color: "#DFB74A",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.2s ease",
              }}
            >
              <Globe size={13} color="#DFB74A" />
              <span>{selectedLangObj.flag} {selectedLangObj.label}</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: 6,
                  background: "#0D1117",
                  border: "1px solid rgba(223, 183, 74, 0.3)",
                  borderRadius: 12,
                  padding: 4,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
                  zIndex: 100,
                  width: 220,
                  backdropFilter: "blur(16px)",
                }}
              >
                <div style={{ padding: "6px 8px 4px", fontSize: 9, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Official IIGF Delegation Languages
                </div>
                {IIGF_LANGUAGES.map(langItem => (
                  <button
                    key={langItem.code}
                    onClick={() => {
                      setLanguage(langItem.code);
                      setIsLangDropdownOpen(false);
                      if (isPlaying) speakCurrentStep(currentStep, langItem.code);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 10px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: language === langItem.code ? "rgba(223, 183, 74, 0.2)" : "transparent",
                      color: language === langItem.code ? "#DFB74A" : "#CBD5E1",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: language === langItem.code ? 700 : 500,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{langItem.flag}</span>
                      <span>{langItem.label}</span>
                    </div>
                    <span style={{ fontSize: 9, color: "#64748B" }}>{langItem.region.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mode Switcher */}
          <div
            style={{
              display: "flex",
              background: "rgba(255, 255, 255, 0.04)",
              padding: 3,
              borderRadius: 10,
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <button
              onClick={() => {
                if (isCalling) handleToggleLiveCall();
                setActiveMode("simulation");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                background: activeMode === "simulation" ? "rgba(223, 183, 74, 0.2)" : "transparent",
                color: activeMode === "simulation" ? "#DFB74A" : "#64748B",
              }}
            >
              Story Demo
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                if (typeof window !== "undefined" && window.speechSynthesis) {
                  try { window.speechSynthesis.cancel(); } catch {}
                }
                setActiveMode("live-voice");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                background: activeMode === "live-voice" ? "rgba(0, 212, 255, 0.2)" : "transparent",
                color: activeMode === "live-voice" ? "#00D4FF" : "#64748B",
              }}
            >
              Live Mic
            </button>
          </div>
        </div>

        {/* Right Close & Audio Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 8,
              padding: 8,
              color: isAudioMuted ? "#EF4444" : "#94A3B8",
              cursor: "pointer",
            }}
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.speechSynthesis) {
                try { window.speechSynthesis.cancel(); } catch {}
              }
              onClose();
            }}
            title="Close"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: 8,
              padding: "6px 14px",
              color: "#E2E8F0",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </header>

      {/* ── MAIN STAGE: EXACT MATCH OF THE ATTACHED PHOTO ── */}
      <main
        onClick={() => setIsLangDropdownOpen(false)}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "0 40px",
        }}
      >
        {/* Center Spheres Container */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: 1100,
            position: "relative",
            zIndex: 5,
            margin: "0 auto",
          }}
        >
          {/* ── LEFT SPHERE: BUYER (GOLD) ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              position: "relative",
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 360,
                height: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThreeHolographicSphere variant="gold" isSpeaking={Boolean(isUserSpeaking)} isDark={true} />
            </div>

            {/* Label Below Left Sphere: BUYER / CALLING IN */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#DFB74A",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: "'Outfit', 'Montserrat', sans-serif",
                }}
              >
                {currentStep.speakerLabels[language] || "BUYER"}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {isUserSpeaking ? "SPEAKING..." : currentStep.statusBadges[language] || "CALLING IN"}
              </div>
            </div>
          </div>

          {/* ── CENTRAL CONNECTING PARTICLE WAVEFORM BRIDGE (FLOATING PARTICLES ONLY) ── */}
          <div
            style={{
              flex: 1,
              height: 40,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 0px",
              zIndex: 2,
              overflow: "hidden",
            }}
          >
            {/* Dynamic floating audio particle dots */}
            <div style={{ position: "relative", width: "100%", height: 30 }}>
              {[...Array(24)].map((_, i) => {
                const isSpeakingActive = isUserSpeaking || isAgentSpeaking;
                const flowDirection = isUserSpeaking ? 1 : -1;
                const pSize = i % 4 === 0 ? 2.5 : i % 2 === 0 ? 2.0 : 1.5;
                const pColor = flowDirection > 0
                  ? (isDark ? (i % 3 === 0 ? "#DFB74A" : "#F59E0B") : (i % 3 === 0 ? "#B45309" : "#D97706"))
                  : (isDark ? (i % 3 === 0 ? "#38BDF8" : "#6366F1") : (i % 3 === 0 ? "#0284C7" : "#4338CA"));

                return (
                  <motion.div
                    key={`${i}-${isUserSpeaking ? "user" : isAgentSpeaking ? "agent" : "idle"}`}
                    initial={
                      isSpeakingActive
                        ? {
                            left: flowDirection > 0 ? "0%" : "100%",
                            opacity: 0,
                            scale: 0.6,
                          }
                        : {
                            left: `${(i / 24) * 100}%`,
                            opacity: 0.35,
                            scale: 1,
                          }
                    }
                    animate={
                      isSpeakingActive
                        ? {
                            left: flowDirection > 0 ? ["0%", "100%"] : ["100%", "0%"],
                            y: [Math.sin(i * 0.7) * 5, Math.cos(i * 0.7) * -5, Math.sin(i * 0.7) * 5],
                            opacity: [0, 0.85, 0.85, 0],
                            scale: [0.7, 1.1, 0.7],
                          }
                        : {
                            y: [Math.sin(i * 0.8) * 3, Math.cos(i * 0.8) * -3, Math.sin(i * 0.8) * 3],
                            opacity: 0.35,
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      delay: isSpeakingActive ? (i / 24) * 2.2 : 0,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      top: "45%",
                      width: pSize,
                      height: pSize,
                      borderRadius: "50%",
                      background: pColor,
                      boxShadow: `0 0 4px ${pColor}`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* ── RIGHT SPHERE: SERALI (CYAN) ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              position: "relative",
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 360,
                height: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThreeHolographicSphere variant="cyan" isSpeaking={Boolean(isAgentSpeaking)} isDark={true} />
            </div>

            {/* Label Below Right Sphere: SERALI / CONNECTED */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#38bdf8",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: "'Outfit', 'Montserrat', sans-serif",
                }}
              >
                {currentStep.speakerLabels[language] === "BUYER" ? "SERALI" : (currentStep.speakerLabels[language] || "SERALI")}
              </div>
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {isAgentSpeaking ? "ANSWERING..." : "CONNECTED"}
              </div>
            </div>
          </div>
        </div>

        {/* ── FLOATING TOOL CARD ON THE RIGHT ── */}
        <div
          style={{
            position: "absolute",
            right: 48,
            top: "50%",
            transform: "translateY(-50%)",
            width: 350,
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            {currentStep.toolAction && (
              <motion.div
                key={`${scenarioKey}-${stepIndex}-${currentStep.toolAction.title}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "rgba(10, 19, 30, 0.82)",
                  border: "1px solid rgba(56, 189, 248, 0.25)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.1)",
                  borderRadius: 16,
                  padding: "20px 24px",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar size={14} color="#38bdf8" />
                    <span style={{ color: "#38bdf8", fontSize: 13, fontWeight: 700 }}>
                      {currentStep.toolAction.title}
                    </span>
                  </div>
                  <span style={{ color: "#64748B", fontSize: 11, fontWeight: 500 }}>
                    {currentStep.toolAction.subtitle || "75th IIGF AI"}
                  </span>
                </div>

                {/* Fields */}
                {currentStep.toolAction.crmFields && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {currentStep.toolAction.crmFields.map((field, fIdx) => (
                      <div key={fIdx}>
                        <div style={{ color: "#64748B", fontSize: 9.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                          {field.label}
                        </div>
                        <div
                          style={{
                            color: field.highlight ? "#DFB74A" : "#F8FAFC",
                            fontSize: 13,
                            fontWeight: field.highlight ? 700 : 500,
                            lineHeight: 1.35,
                          }}
                        >
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Doctor/Exhibitor Header & Slots */}
                {currentStep.toolAction.doctorName && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 800 }}>
                      {currentStep.toolAction.doctorName}
                    </div>
                    <div style={{ color: "#38bdf8", fontSize: 10, fontWeight: 800, textTransform: "uppercase", marginTop: 2 }}>
                      {currentStep.toolAction.specialty}
                    </div>
                  </div>
                )}

                {currentStep.toolAction.slots && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                    {currentStep.toolAction.slots.map((slot, sIdx) => {
                      const isSelected = slot.status === "selected";
                      const isBooked = slot.status === "booked";
                      return (
                        <div
                          key={sIdx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: isBooked
                              ? "rgba(0, 150, 120, 0.25)"
                              : isSelected
                                ? "rgba(223, 183, 74, 0.2)"
                                : "rgba(255, 255, 255, 0.03)",
                            border: isBooked
                              ? "1px solid rgba(0, 150, 120, 0.5)"
                              : isSelected
                                ? "1px solid rgba(223, 183, 74, 0.6)"
                                : "1px solid rgba(255, 255, 255, 0.05)",
                          }}
                        >
                          <span style={{ color: isSelected || isBooked ? "#FFFFFF" : "#CBD5E1", fontSize: 11, fontWeight: 700 }}>
                            <span style={{ color: "#38bdf8", marginRight: 6 }}>{slot.time}</span> {slot.label}
                          </span>
                          <span
                            style={{
                              color: isBooked ? "#00E5A3" : isSelected ? "#DFB74A" : "#64748B",
                              fontSize: 9,
                              fontWeight: 800,
                            }}
                          >
                            {slot.badge || "FREE"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* WhatsApp Message */}
                {currentStep.toolAction.whatsappMessage && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    <div style={{ color: "#64748B", fontSize: 10, fontWeight: 700 }}>
                      To: {currentStep.toolAction.whatsappMessage.to}
                    </div>
                    <div
                      style={{
                        background: "rgba(0, 150, 120, 0.15)",
                        borderLeft: "2px solid #00E5A3",
                        padding: "8px 10px",
                        borderRadius: 4,
                        color: "#E2E8F0",
                        fontSize: 10,
                        lineHeight: 1.4,
                      }}
                    >
                      {currentStep.toolAction.whatsappMessage.text}
                    </div>
                    <div style={{ textAlign: "right", color: "#00E5A3", fontSize: 8, fontWeight: 800 }}>
                      ✓✓ DELIVERED
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── BOTTOM TRANSCRIPTION BAR ── */}
      <footer
        onMouseEnter={() => setIsFooterHovered(true)}
        onMouseLeave={() => setIsFooterHovered(false)}
        style={{
          position: "relative",
          zIndex: 20,
          padding: "24px 64px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ maxWidth: 960 }}>
          {/* Speaker Tag in Gold or Cyan */}
          <div
            style={{
              color: currentStep.speakerType === "user" ? "#DFB74A" : "#38bdf8",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Outfit', 'Montserrat', sans-serif",
              marginBottom: 8,
            }}
          >
            {activeSpeakerLabel}
          </div>

          {/* Primary Transcript Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenarioKey}-${stepIndex}-${language}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {activeMainText}
              </div>

              {/* Subtitle Translation in Italic */}
              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 14,
                  fontStyle: "italic",
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {activeTranslationText}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hover Controls (Play / Pause / Next / Seek) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 960,
            paddingTop: 8,
            opacity: isFooterHovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Step Dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setStepIndex(idx);
                  setIsPlaying(false);
                }}
                style={{
                  width: idx === stepIndex ? 28 : 14,
                  height: 4,
                  borderRadius: 2,
                  border: "none",
                  cursor: "pointer",
                  background: idx === stepIndex ? "#DFB74A" : idx < stepIndex ? "rgba(223, 183, 74, 0.4)" : "rgba(255, 255, 255, 0.15)",
                  transition: "all 0.2s ease",
                }}
              />
            ))}
          </div>

          {/* Playback Controls */}
          {activeMode === "simulation" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  if (stepIndex > 0) {
                    setStepIndex(prev => prev - 1);
                    setIsPlaying(false);
                  }
                }}
                disabled={stepIndex === 0}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: stepIndex === 0 ? "#64748B" : "#CBD5E1",
                  cursor: stepIndex === 0 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={() => {
                  if (!isPlaying && stepIndex === steps.length - 1) {
                    setStepIndex(0);
                  }
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: "#DFB74A",
                  color: "#07090D",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  letterSpacing: "0.08em",
                }}
              >
                {isPlaying ? <><Pause size={13} /> PAUSE</> : <><Play size={13} /> PLAY DEMO</>}
              </button>

              <button
                onClick={() => {
                  if (stepIndex < steps.length - 1) {
                    setStepIndex(prev => prev + 1);
                    setIsPlaying(false);
                  }
                }}
                disabled={stepIndex === steps.length - 1}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: stepIndex === steps.length - 1 ? "#64748B" : "#CBD5E1",
                  cursor: stepIndex === steps.length - 1 ? "not-allowed" : "pointer",
                }}
              >
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => {
                  setStepIndex(0);
                  setIsPlaying(true);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginLeft: 8,
                }}
              >
                <RefreshCw size={12} /> Restart
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                onClick={handleToggleLiveCall}
                style={{
                  background: isCalling ? "#EF4444" : "#00D4FF",
                  color: "#07090D",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 20px",
                  cursor: "pointer",
                  fontWeight: 900,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  letterSpacing: "0.08em",
                }}
              >
                {isCalling ? <><PhoneOff size={14} /> END CALL</> : <><PhoneCall size={14} /> START LIVE CALL</>}
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
