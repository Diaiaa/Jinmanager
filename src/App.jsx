import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  User,
  ShieldCheck,
  Clock,
  Package,
  Copy,
  Check,
  Bell,
  Search,
  Plus,
  Minus,
  Trash2,
  Pencil,
  Save,
  X,
  Calculator,
  ShoppingCart,
  FileText,
  Lock,
  Unlock,
  Image as ImageIcon,
  Loader2,
  GripVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import Tesseract from "tesseract.js";

const ADMIN_PASSWORD = "1575210";
const CHANNEL_PLUGIN_KEY_STORAGE = "d4-chat-channel-plugin-key";
const DEFAULT_CHANNEL_PLUGIN_KEY = "bc2809e8-2542-4534-bd25-94d9dc9c20fd";
const LOGO_SRC = `${import.meta.env.BASE_URL}logo.png`;
const RUNE_OPTIONS = ["티리엘", "영벌", "별반", "샤코", "한아비", "셀리그", "수의"];
const GEM_OPTIONS = ["해골", "루비", "사파이어", "에메랄드", "다이아몬드", "자수정", "토파즈"];

function LogoImage({ className = "" }) {
  return (
    <img
      src={LOGO_SRC}
      alt="진매니저"
      className={`h-full w-full object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.parentElement.textContent = "진";
      }}
    />
  );
}

function LogoButton({ className = "", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="로고 크게 보기"
      className={`overflow-hidden bg-zinc-100 text-zinc-950 flex items-center justify-center font-black ${className}`}
      title="로고 크게 보기"
    >
      <LogoImage />
    </button>
  );
}

const INITIAL_MESSAGES = [
  { id: 1, from: "bot", text: "안녕하세요. 디아블로4 거래 문의는 여기서 바로 남겨주세요.", time: "방금" },
  { id: 2, from: "bot", text: "물품을 여러 개 선택하면 금액이 자동 합산됩니다.", time: "방금" },
];

const DEFAULT_PRODUCTS = [
  { id: 1, category: "옵두 버스", name: "옵두 버스 2만개", price: 10000 },
  { id: 2, category: "옵두 버스", name: "옵두 버스 5만개", price: 22000 },
  { id: 3, category: "옵두 버스", name: "옵두 버스 10만개", price: 40000 },
  { id: 4, category: "지하도시 신화병기공물", name: "지하도시 신화병기공물 1회", price: 6000 },
  { id: 5, category: "지하도시 신화병기공물", name: "지하도시 신화병기공물 5회", price: 20000 },
  { id: 6, category: "지하도시 신화병기공물", name: "지하도시 신화병기공물 10회", price: 36000 },
  { id: 7, category: "지하도시 신화병기공물", name: "지하도시 신화병기공물 20회", price: 50000 },
  { id: 8, category: "잊힌영혼", name: "잊힌영혼 1,000개", price: 7000 },
  { id: 9, category: "잊힌영혼", name: "잊힌영혼 3,000개", price: 19000 },
  { id: 10, category: "잊힌영혼", name: "잊힌영혼 5,000개", price: 33000 },
  { id: 11, category: "골드", name: "골드 100억", price: 10000 },
  { id: 12, category: "골드", name: "골드 200억", price: 13000 },
  { id: 13, category: "골드", name: "골드 500억", price: 22000 },
  { id: 14, category: "골드", name: "골드 900억", price: 35000 },
  { id: 15, category: "상급열쇠 소굴", name: "상급열쇠 소굴 100개", price: 11000 },
  { id: 16, category: "상급열쇠 소굴", name: "상급열쇠 소굴 200개", price: 14000 },
  { id: 17, category: "상급열쇠 소굴", name: "상급열쇠 소굴 500개", price: 23000 },
  { id: 18, category: "상급열쇠 소굴", name: "상급열쇠 소굴 1000개", price: 37000 },
  { id: 19, category: "하급열쇠 소굴", name: "하급열쇠 소굴 100개", price: 11000 },
  { id: 20, category: "하급열쇠 소굴", name: "하급열쇠 소굴 200개", price: 14000 },
  { id: 21, category: "하급열쇠 소굴", name: "하급열쇠 소굴 500개", price: 23000 },
  { id: 22, category: "하급열쇠 소굴", name: "하급열쇠 소굴 1000개", price: 37000 },
  { id: 23, category: "벨리알 껍데기", name: "벨리알 껍데기 50개", price: 13000 },
  { id: 24, category: "벨리알 껍데기", name: "벨리알 껍데기 100개", price: 20000 },
  { id: 25, category: "벨리알 껍데기", name: "벨리알 껍데기 200개", price: 30000 },
  { id: 26, category: "벨리알 껍데기", name: "벨리알 껍데기 300개", price: 40000 },
  { id: 27, category: "벨리알 껍데기", name: "벨리알 껍데기 500개", price: 55000 },
  { id: 28, category: "웅장한 보석", name: "웅장한 보석 10개", price: 5000 },
  { id: 29, category: "웅장한 보석", name: "웅장한 보석 20개", price: 8000 },
  { id: 30, category: "웅장한 보석", name: "웅장한 보석 50개", price: 15000 },
  { id: 31, category: "웅장한 보석", name: "웅장한 보석 100개", price: 25000 },
  { id: 32, category: "온전한 호라드림", name: "온전한 호라드림 1개", price: 12000 },
  { id: 33, category: "온전한 호라드림", name: "온전한 호라드림 5개", price: 27000 },
  { id: 34, category: "온전한 호라드림", name: "온전한 호라드림 10개", price: 45000 },
  { id: 35, category: "온전한 호라드림", name: "온전한 호라드림 20개", price: 80000 },
  { id: 36, category: "룬셋", name: "룬셋 1셋", price: 5000 },
  { id: 37, category: "룬셋", name: "룬셋 3셋", price: 9000 },
  { id: 38, category: "룬셋", name: "룬셋 5셋", price: 13000 },
  { id: 39, category: "룬셋", name: "룬셋 10셋", price: 20000 },
  { id: 40, category: "기타", name: "1-70레벨", price: 6000 },
  { id: 41, category: "기타", name: "정복자1 - 100레벨", price: 20000 },
  { id: 42, category: "기타", name: "만랩 + 정복자1-100", price: 25000 },
  { id: 43, category: "기타", name: "시즌13 메인퀘 클", price: 30000 },
  { id: 44, category: "기타", name: "나락100단 1시간", price: 10000 },
  { id: 45, category: "기타", name: "고행8 릴리트 1회", price: 5000 },
  { id: 46, category: "기타", name: "고행10 메피스토 1회", price: 8000 },
];

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatWon(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}

function safeNumber(value) {
  const onlyNumber = String(value).replace(/[^0-9]/g, "");
  return Number(onlyNumber || 0);
}

function loadProducts() {
  try {
    const saved = localStorage.getItem("d4-chat-products-v3");
    if (!saved) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PRODUCTS;
    return parsed;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

function loadChannelTalkScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("브라우저에서만 사용할 수 있습니다."));

  return new Promise((resolve, reject) => {
    if (!window.ChannelIO) {
      const channel = function () {
        channel.c(arguments);
      };
      channel.q = [];
      channel.c = function (args) {
        channel.q.push(args);
      };
      window.ChannelIO = channel;
    }

    if (window.ChannelIOInitialized) {
      resolve();
      return;
    }

    window.ChannelIOInitialized = true;
    const script = document.createElement("script");
    script.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
    script.async = true;
    script.dataset.channelTalkSdk = "true";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function cleanCategoryName(line) {
  return String(line)
    .replace(/[-─=]{3,}/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/^▶/g, "")
    .trim();
}

function parsePriceTable(rawText) {
  const lines = String(rawText || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = [];
  let currentCategory = "";
  let nextId = 1;

  for (const line of lines) {
    if (/^[-─=]{3,}$/.test(line)) {
      currentCategory = "";
      continue;
    }

    if (/^\(.+\)$/.test(line)) continue;

    const hasPrice = line.includes("=") && line.includes("원");
    if (!hasPrice) {
      const category = cleanCategoryName(line);
      if (category) currentCategory = category;
      continue;
    }

    const parts = line.split("=");
    const left = (parts.shift() || "").trim();
    const right = parts.join("=").trim();
    const price = safeNumber(right);
    if (!left || price <= 0) continue;

    const category = currentCategory || "기타";
    const optionName = left.replace(/\([^)]*\)/g, "").trim();
    const fullName = category === "기타" || optionName.includes(category) ? optionName : `${category} ${optionName}`;

    parsed.push({ id: nextId++, category, name: fullName, price });
  }

  return parsed;
}

function normalizeVendorCategory(text) {
  const raw = String(text || "")
    .replace(/✅/g, "")
    .replace(/⭐/g, "")
    .replace(/▶/g, "")
    .replace(/➡️/g, "")
    .replace(/➡/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/바닥거래/g, "")
    .replace(/교차선택 가능/g, "")
    .trim();

  if (!raw) return "기타";
  if (raw.includes("골드") || raw.includes("금화")) return "골드";
  if (raw.includes("잊힌영혼")) return "잊힌영혼";
  if (raw.includes("옵두")) return "옵두 버스";
  if (raw.includes("상급") && raw.includes("소굴")) return "상급열쇠 소굴";
  if ((raw.includes("소굴") || raw.includes("열쇠")) && !raw.includes("상급")) return "하급열쇠 소굴";
  if (raw.includes("배신자") || raw.includes("껍데기") || raw.includes("껍떼기")) return "벨리알 껍데기";
  if (raw.includes("호라드림")) return "온전한 호라드림";
  if (raw.includes("보석")) return "웅장한 보석";
  if (raw.includes("룬셋") || raw === "룬") return "룬셋";
  if (raw.includes("신화병기공물")) return "지하도시 신화병기공물";
  if (raw.includes("신화꾸러")) return "신화꾸러미";
  if (raw.includes("보물") && raw.includes("틈새")) return "보물의틈새";
  if (raw.includes("분광경")) return "분광경";
  if (raw.includes("십자가") || raw.includes("매피스토") || raw.includes("메피스토")) return "거짓된 선지자의 십자가";
  if (raw.includes("레벨") || raw.includes("문양") || raw.includes("정복자") || raw.includes("나락")) return "기타";
  return raw;
}

function detectVendorCategory(text) {
  const raw = String(text || "")
    .replace(/✅/g, "")
    .replace(/⭐/g, "")
    .replace(/▶/g, "")
    .replace(/➡️/g, "")
    .replace(/➡/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/바닥거래/g, "")
    .replace(/교차선택 가능/g, "")
    .trim();

  if (!raw) return "";
  if (raw.includes("골드") || raw.includes("금화")) return "골드";
  if (raw.includes("잊힌영혼")) return "잊힌영혼";
  if (raw.includes("옵두")) return "옵두 버스";
  if (raw.includes("상급") && raw.includes("소굴")) return "상급열쇠 소굴";
  if ((raw.includes("소굴") || raw.includes("열쇠")) && !raw.includes("상급")) return "하급열쇠 소굴";
  if (raw.includes("배신자") || raw.includes("껍데기") || raw.includes("껍떼기")) return "벨리알 껍데기";
  if (raw.includes("호라드림")) return "온전한 호라드림";
  if (raw.includes("보석")) return "웅장한 보석";
  if (raw.includes("룬셋") || raw === "룬") return "룬셋";
  if (raw.includes("신화병기공물")) return "지하도시 신화병기공물";
  if (raw.includes("신화꾸러")) return "신화꾸러미";
  if (raw.includes("보물") && raw.includes("틈새")) return "보물의틈새";
  if (raw.includes("분광경")) return "분광경";
  if (raw.includes("십자가") || raw.includes("매피스토") || raw.includes("메피스토")) return "거짓된 선지자의 십자가";
  if (raw.includes("레벨") || raw.includes("문양") || raw.includes("정복자") || raw.includes("나락")) return "기타";
  return "";
}

function cleanVendorOption(text) {
  const clean = String(text || "")
    .replace(/✅/g, "")
    .replace(/⭐/g, "")
    .replace(/➡️/g, "")
    .replace(/➡/g, "")
    .replace(/=/g, " ")
    .replace(/:/g, " ")
    .replace(/원/g, "")
    .replace(/세트/g, "셋")
    .replace(/판당/g, "판")
    .replace(/시간 당/g, "1시간")
    .replace(/시간당/g, "1시간")
    .replace(/판매합니다/g, "")
    .replace(/가격문의/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return clean.replace(/([1-9][0-9]{4,})개/g, (_, value) => {
    const count = Number(value);
    if (count >= 10000 && count % 10000 === 0) return `${count / 10000}만개`;
    return `${value}개`;
  });
}

function makeVendorProductName(category, option) {
  const clean = cleanVendorOption(option);
  if (!clean) return "";
  if (/^\d+(?:,\d+)?(?:\s|$)/.test(clean)) return "";
  if (/^\d+$/.test(clean)) return "";
  if (category === "기타" || clean.includes(category)) return clean;
  return `${category} ${clean}`;
}

function extractVendorOptionPrices(text, fallbackOption = "") {
  const pairs = [];
  const source = String(text || "").replace(/원/g, " ");
  const pricePattern = /([^:=➡]*?)(?:[:=]?\s*)(\d{1,3}(?:,\d{3})+|\d{4,})(?!\s*(?:개|억|판|셋|세트|레벨|단))/g;
  let match;

  while ((match = pricePattern.exec(source)) !== null) {
    const price = safeNumber(match[2]);
    if (price < 1000) continue;
    const option = cleanVendorOption(match[1]) || cleanVendorOption(fallbackOption);
    if (!option || option.includes("가격문의")) continue;
    pairs.push({ option, price });
  }

  return pairs;
}

function extractVendorArrowEntries(text, defaultCategory) {
  const entries = [];
  const segments = String(text || "")
    .replace(/→/g, "➡")
    .replace(/=>/g, "➡")
    .replace(/➡️/g, "➡")
    .split("➡")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length < 2) return entries;

  const firstPairs = extractVendorOptionPrices(segments[0]);
  const firstCategory = detectVendorCategory(segments[0]);
  const firstIsCategoryOnly = firstCategory && firstCategory !== "기타" && firstPairs.length === 0;
  let category = firstIsCategoryOnly ? firstCategory : defaultCategory || "기타";
  let pendingOption = firstIsCategoryOnly ? "" : cleanVendorOption(segments[0]);

  if (firstPairs.length) {
    for (const pair of firstPairs) entries.push({ category, option: pair.option, price: pair.price });
    pendingOption = "";
  }

  for (let index = 1; index < segments.length; index += 1) {
    const segment = segments[index];
    const segmentCategory = detectVendorCategory(segment);
    const pairs = extractVendorOptionPrices(segment, pendingOption);

    if (pairs.length) {
      for (const pair of pairs) entries.push({ category, option: pair.option, price: pair.price });
      pendingOption = "";
      continue;
    }

    if (segmentCategory && segmentCategory !== "기타") {
      category = segmentCategory;
      pendingOption = "";
      continue;
    }

    const option = cleanVendorOption(segment);
    if (option && !option.includes("랜덤드랍") && !option.includes("신화템드랍")) pendingOption = option;
  }

  return entries;
}

function splitVendorSections(rawText) {
  const text = String(rawText || "")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ");
  const sections = [];
  const pattern = /✅([^✅]+)✅/g;
  let match;
  let lastMatch = null;

  while ((match = pattern.exec(text)) !== null) {
    if (lastMatch) {
      sections.push({
        title: lastMatch[1],
        body: text.slice(lastMatch.index + lastMatch[0].length, match.index),
      });
    }
    lastMatch = match;
  }

  if (lastMatch) {
    sections.push({
      title: lastMatch[1],
      body: text.slice(lastMatch.index + lastMatch[0].length),
    });
  }

  return sections;
}

function parseVendorBlob(rawText) {
  const sections = splitVendorSections(rawText);
  if (!sections.length) return [];

  const parsed = [];
  let nextId = 1;

  for (const section of sections) {
    const baseCategory = normalizeVendorCategory(section.title);
    const chunks = section.body
      .split("⭐")
      .map((chunk) => chunk.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      const entries = extractVendorArrowEntries(chunk, baseCategory);
      for (const entry of entries) {
        const name = makeVendorProductName(entry.category, entry.option);
        if (name && entry.price >= 1000) parsed.push({ id: nextId++, category: entry.category, name, price: entry.price });
      }
    }
  }

  return parsed;
}

function extractVendorEntries(line) {
  const text = String(line || "")
    .split(",").join("")
    .split("→").join("➡")
    .split("=>").join("➡")
    .split("세트").join("셋");

  const entries = [];
  const parts = text.split("➡").join("=").split("=").map((v) => v.trim()).filter(Boolean);

  if (parts.length >= 2) {
    let pending = cleanVendorOption(parts[0]);
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i];
      const nums = part.match(/[0-9]+/g) || [];
      if (!nums.length) {
        const label = cleanVendorOption(part);
        if (label && !label.match(/[0-9]/)) pending = label;
        continue;
      }
      const lastNumber = nums[nums.length - 1];
      const price = Number(lastNumber);
      const pricePos = part.lastIndexOf(lastNumber);
      const option = cleanVendorOption(part.slice(0, pricePos)) || pending;
      if (option && price >= 1000) entries.push({ option, price });
      pending = "";
    }
    if (entries.length) return entries;
  }

  const compact = text.split("✅").join(" ").split("⭐").join(" ").split("원").join("").trim();
  const tokens = compact.split(" ").map((v) => v.trim()).filter(Boolean);
  let pendingWords = [];

  for (const token of tokens) {
    const numeric = Number(token.split("").filter((ch) => ch >= "0" && ch <= "9").join(""));
    if (numeric >= 1000) {
      const option = cleanVendorOption(pendingWords.join(" "));
      if (option) entries.push({ option, price: numeric });
      pendingWords = [];
    } else {
      pendingWords.push(token);
    }
  }

  return entries;
}

function parseAnyPriceTable(rawText) {
  const vendorParsed = parseVendorBlob(rawText);
  if (vendorParsed.length) return vendorParsed;
  if (String(rawText || "").includes("✅") || String(rawText || "").includes("⭐") || String(rawText || "").includes("➡")) return [];

  const lines = String(rawText || "")
    .split(String.fromCharCode(13)).join("")
    .split(String.fromCharCode(10))
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = [];
  let currentCategory = "";
  let nextId = 1;

  for (const line of lines) {
    if (line.split("").every((ch) => ch === "-" || ch === "─" || ch === "=")) continue;

    const entries = extractVendorEntries(line);
    if (entries.length) {
      const category = currentCategory || "기타";
      for (const entry of entries) {
        const name = makeVendorProductName(category, entry.option);
        if (name) parsed.push({ id: nextId++, category, name, price: entry.price });
      }
      continue;
    }

    const lineNoComma = line.split(",").join("");
    const numbers = lineNoComma.match(/[0-9]+/g) || [];
    const hasBigPrice = numbers.some((n) => Number(n) >= 1000);
    const noise = line.includes("루비,") || line.includes("별반/") || line.includes("다채로운/") || line.includes("신화템드랍") || line.includes("랜덤드랍");

    if (!hasBigPrice && !noise) {
      currentCategory = normalizeVendorCategory(line.split("➡")[0].split("→")[0].split("=")[0]);
    }
  }

  return parsed.length ? parsed : parsePriceTable(rawText);
}

export default function SimpleChatSite() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [orderMemo, setOrderMemo] = useState("");
  const [battleTag, setBattleTag] = useState("");
  const [depositor, setDepositor] = useState("");
  const [products, setProducts] = useState(loadProducts);
  const [cart, setCart] = useState([]);
  const [selectedRunes, setSelectedRunes] = useState({});
  const [selectedGems, setSelectedGems] = useState({});
  const [copied, setCopied] = useState(false);
  const [copyPanelOpen, setCopyPanelOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("d4-chat-admin") === "yes");
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [channelPluginKey, setChannelPluginKey] = useState(DEFAULT_CHANNEL_PLUGIN_KEY);
  const [channelStatus, setChannelStatus] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ category: "", name: "", price: "" });
  const [bulkText, setBulkText] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkResult, setBulkResult] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [draggingProductId, setDraggingProductId] = useState(null);
  const bottomRef = useRef(null);
  const orderCopyRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("d4-chat-products-v3", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CHANNEL_PLUGIN_KEY_STORAGE, channelPluginKey.trim());
  }, [channelPluginKey]);

  useEffect(() => {
    const pluginKey = channelPluginKey.trim();
    if (!pluginKey) {
      setChannelStatus("");
      return;
    }

    let cancelled = false;
    setChannelStatus("채널톡 연결 준비 중");
    loadChannelTalkScript()
      .then(() => {
        if (cancelled || !window.ChannelIO) return;
        window.ChannelIO("shutdown");
        window.ChannelIO("boot", { pluginKey }, (error) => {
          if (cancelled) return;
          if (error) {
            setChannelStatus("채널톡 연결 실패");
            return;
          }
          window.ChannelIO("hideChannelButton");
          setChannelStatus("채널톡 연결됨");
        });
      })
      .catch(() => {
        if (!cancelled) setChannelStatus("채널톡 스크립트 로드 실패");
      });

    return () => {
      cancelled = true;
    };
  }, [channelPluginKey]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => `${p.category} ${p.name} ${p.price}`.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  const orderText = useMemo(() => {
    const itemLines = cart.length
      ? cart.map((item, index) => {
          const runeText = item.category === "룬셋" && selectedRunes[item.id]?.length
            ? ` / 선택룬: ${selectedRunes[item.id].join(", ")}`
            : "";
          const gemText = isGemItem(item) && selectedGems[item.id]?.length
            ? ` / 선택보석: ${selectedGems[item.id].join(", ")}`
            : "";
          return `${index + 1}. ${item.name} x ${item.qty} = ${formatWon(item.price * item.qty)}${runeText}${gemText}`;
        }).join("\n")
      : "선택된 물품 없음";

    return `[주문문의]\n주문목록:\n${itemLines}\n\n총금액: ${formatWon(totalPrice)}\n배틀태그: ${battleTag || "미입력"}\n입금자성함: ${depositor || "미입력"}\n추가문의: ${orderMemo || "없음"}`;
  }, [cart, selectedRunes, selectedGems, totalPrice, battleTag, depositor, orderMemo]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function adminLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setAdminPanelOpen(false);
      setLoginError("");
      setPassword("");
      localStorage.setItem("d4-chat-admin", "yes");
      return;
    }
    setLoginError("비밀번호가 틀렸습니다.");
  }

  function adminLogout() {
    setIsAdmin(false);
    setEditMode(false);
    setEditingId(null);
    localStorage.removeItem("d4-chat-admin");
  }

  function sendMessage(customText) {
    const text = (customText ?? input).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text, time: nowTime() }]);
    setInput("");
    if (channelPluginKey.trim() && window.ChannelIO) {
      window.ChannelIO("openChat", undefined, text);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: "채널톡 대화창으로 연결했습니다. 채널톡 입력창에서 전송을 눌러주세요.", time: nowTime() }]);
      }, 300);
      return;
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: "bot", text: "문의 접수됐습니다. 상담원이 확인 후 답변드립니다.", time: nowTime() }]);
    }, 700);
  }

  function addToCart(product) {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)));
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setSelectedRunes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedGems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function clearCart() {
    setCart([]);
    setSelectedRunes({});
    setSelectedGems({});
  }

  function toggleRuneOption(itemId, rune) {
    setSelectedRunes((prev) => {
      const current = prev[itemId] || [];
      const exists = current.includes(rune);
      return {
        ...prev,
        [itemId]: exists ? current.filter((v) => v !== rune) : [...current, rune],
      };
    });
  }

  function isGemItem(item) {
    return item.category.includes("보석") || item.category.includes("호라드림") || item.name.includes("보석") || item.name.includes("호라드림");
  }

  function toggleGemOption(itemId, gem) {
    setSelectedGems((prev) => {
      const current = prev[itemId] || [];
      const exists = current.includes(gem);
      return {
        ...prev,
        [itemId]: exists ? current.filter((v) => v !== gem) : [...current, gem],
      };
    });
  }

  function sendOrderTemplate() {
    sendMessage(orderText);
  }

  function selectOrderCopyText() {
    setCopyPanelOpen(true);
    setTimeout(() => {
      orderCopyRef.current?.focus();
      orderCopyRef.current?.select();
    }, 0);
  }

  async function copyOrder() {
    setCopyMessage("");
    selectOrderCopyText();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(orderText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = orderText;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copiedText = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copiedText) throw new Error("copy failed");
      }
      setCopied(true);
      setCopyMessage("복사 완료");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setCopyMessage("자동 복사가 막혔습니다. 선택된 주문서를 Ctrl+C로 복사하세요.");
    }
  }

  function manualCopyOrder() {
    selectOrderCopyText();
    try {
      const copiedText = document.execCommand("copy");
      if (!copiedText) throw new Error("copy failed");
      setCopied(true);
      setCopyMessage("복사 완료");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setCopyMessage("선택된 주문서를 Ctrl+C로 복사하세요.");
    }
  }

  function startAddProduct() {
    if (!isAdmin) return;
    setEditingId("new");
    setDraft({ category: "", name: "", price: "" });
  }

  function startEditProduct(product) {
    if (!isAdmin) return;
    setEditingId(product.id);
    setDraft({ category: product.category, name: product.name, price: String(product.price) });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({ category: "", name: "", price: "" });
  }

  function saveProduct() {
    if (!isAdmin) return;
    const category = draft.category.trim() || "기타";
    const name = draft.name.trim();
    const price = safeNumber(draft.price);
    if (!name || price <= 0) return;

    if (editingId === "new") {
      const nextId = Math.max(0, ...products.map((p) => Number(p.id) || 0)) + 1;
      setProducts((prev) => [...prev, { id: nextId, category, name, price }]);
    } else {
      setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...p, category, name, price } : p)));
      setCart((prev) => prev.map((item) => (item.id === editingId ? { ...item, category, name, price } : item)));
    }
    cancelEdit();
  }

  function deleteProduct(id) {
    if (!isAdmin) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function moveProductBox(fromId, toId) {
    if (!isAdmin || !editMode || !fromId || !toId || String(fromId) === String(toId)) return;
    setProducts((prev) => {
      const fromIndex = prev.findIndex((p) => String(p.id) === String(fromId));
      const toIndex = prev.findIndex((p) => String(p.id) === String(toId));
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function startDragProduct(event, id) {
    if (!isAdmin || !editMode) return;
    setDraggingProductId(id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(id));
  }

  function dropProduct(event, id) {
    if (!isAdmin || !editMode) return;
    event.preventDefault();
    const fromId = event.dataTransfer.getData("text/plain") || draggingProductId;
    moveProductBox(fromId, id);
    setDraggingProductId(null);
  }

  function resetProducts() {
    if (!isAdmin) return;
    setProducts(DEFAULT_PRODUCTS);
    setCart([]);
    cancelEdit();
  }

  function importBulkPriceTable() {
    if (!isAdmin) return;
    const parsed = parseAnyPriceTable(bulkText);
    if (parsed.length === 0) {
      setBulkResult("인식된 시세가 없습니다. '물품 = 10,000원' 형식인지 확인하세요.");
      return;
    }
    setProducts(parsed);
    setCart([]);
    cancelEdit();
    setBulkResult(`${parsed.length}개 시세를 불러왔습니다.`);
  }

  function appendBulkPriceTable() {
    if (!isAdmin) return;
    const parsed = parseAnyPriceTable(bulkText);
    if (parsed.length === 0) {
      setBulkResult("인식된 시세가 없습니다. '물품 = 10,000원' 형식인지 확인하세요.");
      return;
    }
    const startId = Math.max(0, ...products.map((p) => Number(p.id) || 0)) + 1;
    const withIds = parsed.map((p, index) => ({ ...p, id: startId + index }));
    setProducts((prev) => [...prev, ...withIds]);
    setBulkResult(`${parsed.length}개 시세를 추가했습니다.`);
  }

  async function readImageText(event) {
    if (!isAdmin) return;
    const file = event.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrProgress(0);
    setBulkResult("이미지 글자 인식 중입니다. 잠시 기다려주세요.");
    try {
      const result = await Tesseract.recognize(file, "kor+eng", {
        logger: (m) => {
          if (m.status === "recognizing text") setOcrProgress(Math.round((m.progress || 0) * 100));
        },
      });
      const text = result?.data?.text || "";
      setBulkText((prev) => (prev ? `${prev}\n${text}` : text));
      const parsedCount = parseAnyPriceTable(text).length;
      setBulkResult(`OCR 완료. 인식된 가격 항목: ${parsedCount}개. 내용 확인 후 전체 교체를 누르세요.`);
    } catch {
      setBulkResult("OCR 실패. 이미지가 흐리면 텍스트로 복사해서 붙여넣어야 합니다.");
    } finally {
      setOcrLoading(false);
      setOcrProgress(0);
      event.target.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="fixed right-3 top-3 z-50">
        <button
          onClick={() => setAdminPanelOpen((v) => !v)}
          className="h-7 w-7 rounded-md border border-zinc-800 bg-zinc-950/70 text-zinc-600 hover:text-zinc-200 hover:border-zinc-600 flex items-center justify-center"
          title="관리자"
        >
          {isAdmin ? <Unlock size={13} /> : <Lock size={13} />}
        </button>
        {adminPanelOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
            {isAdmin ? (
              <div className="space-y-2">
                <div className="text-sm font-bold text-zinc-200">관리자 모드</div>
                <label className="block">
                  <span className="text-xs text-zinc-500">채널톡 플러그인 키</span>
                  <input
                    value={channelPluginKey}
                    readOnly
                    placeholder="예: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="mt-1 w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none text-xs text-zinc-400"
                  />
                </label>
                {channelStatus && <div className="text-xs text-zinc-400">{channelStatus}</div>}
                <button onClick={adminLogout} className="w-full rounded-xl border border-zinc-700 py-2 text-sm font-bold hover:bg-zinc-800">로그아웃</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-bold text-zinc-200">관리자 로그인</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") adminLogin(); }}
                  placeholder="비밀번호"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:border-zinc-500 text-sm"
                />
                {loginError && <div className="text-xs text-red-300">{loginError}</div>}
                <button onClick={adminLogin} className="w-full rounded-xl bg-zinc-100 text-zinc-950 py-2 text-sm font-black">확인</button>
              </div>
            )}
          </div>
        )}
      </div>
      {logoModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/85 p-4 flex items-center justify-center" onClick={() => setLogoModalOpen(false)}>
          <button onClick={() => setLogoModalOpen(false)} className="absolute right-4 top-4 h-10 w-10 rounded-full bg-zinc-900/90 border border-zinc-700 flex items-center justify-center text-zinc-100 hover:bg-zinc-800" title="닫기"><X size={20}/></button>
          <img src={LOGO_SRC} alt="진매니저 로고 확대" className="max-h-[92vh] max-w-[92vw] rounded-3xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoButton onClick={() => setLogoModalOpen(true)} className="h-11 w-11 rounded-2xl" />
            <div>
              <h1 className="text-xl font-black tracking-tight">진매니저 1:1 거래방</h1>
              <p className="text-sm text-zinc-400">물품 여러 개 선택 · 금액 자동합산 · 관리자 시세수정</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-zinc-300">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-3 py-1"><ShieldCheck size={15}/> 안전거래 안내</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-3 py-1"><Clock size={15}/> 빠른 응답</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5">
        <section className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2"><Package size={20} /><h2 className="text-lg font-bold">주문 정보</h2></div>
              <div className="inline-flex items-center gap-1 rounded-full bg-zinc-950 border border-zinc-800 px-3 py-1 text-sm text-zinc-300"><Calculator size={15}/>{formatWon(totalPrice)}</div>
            </div>

            <div className="space-y-3">
              <label className="block"><span className="text-sm text-zinc-400">주문목록 / 추가요청</span><textarea value={orderMemo} onChange={(e) => setOrderMemo(e.target.value)} placeholder="예: 루비 5개, 다이아 5개 섞어서 가능할까요?" rows={3} className="mt-1 w-full resize-none rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" /></label>
              <label className="block"><span className="text-sm text-zinc-400">배틀태그</span><input value={battleTag} onChange={(e) => setBattleTag(e.target.value)} placeholder="예: Diablo#1234" className="mt-1 w-full rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" /></label>
              <label className="block"><span className="text-sm text-zinc-400">입금자성함</span><input value={depositor} onChange={(e) => setDepositor(e.target.value)} placeholder="예: 홍길동" className="mt-1 w-full rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" /></label>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 font-bold"><ShoppingCart size={18}/> 선택한 물품</div><button onClick={clearCart} className="text-xs text-zinc-400 hover:text-zinc-100">전체삭제</button></div>
                {cart.length === 0 ? <div className="text-sm text-zinc-500 py-3">아래 시세표에서 물품을 클릭하면 여기에 추가됩니다.</div> : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
                        <div className="flex items-start justify-between gap-2"><div><div className="font-bold text-sm">{item.name}</div><div className="text-xs text-zinc-400">{formatWon(item.price)} x {item.qty}</div></div><button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-zinc-100"><Trash2 size={16}/></button></div>
                        <div className="mt-2 flex items-center justify-between gap-2"><div className="flex items-center gap-2"><button onClick={() => changeQty(item.id, -1)} className="h-8 w-8 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"><Minus size={14}/></button><span className="min-w-8 text-center font-bold">{item.qty}</span><button onClick={() => changeQty(item.id, 1)} className="h-8 w-8 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"><Plus size={14}/></button></div><div className="font-black">{formatWon(item.price * item.qty)}</div></div>
                        {item.category === "룬셋" && (
                          <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-2">
                            <div className="mb-2 text-xs font-bold text-zinc-400">룬 선택</div>
                            <div className="flex flex-wrap gap-1.5">
                              {RUNE_OPTIONS.map((rune) => {
                                const active = selectedRunes[item.id]?.includes(rune);
                                return (
                                  <button
                                    key={rune}
                                    onClick={() => toggleRuneOption(item.id, rune)}
                                    className={`rounded-full px-3 py-1 text-xs font-bold border ${active ? "bg-zinc-100 text-zinc-950 border-zinc-100" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}`}
                                  >
                                    {rune}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {isGemItem(item) && (
                          <div className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-2">
                            <div className="mb-2 text-xs font-bold text-zinc-400">보석 선택</div>
                            <div className="flex flex-wrap gap-1.5">
                              {GEM_OPTIONS.map((gem) => {
                                const active = selectedGems[item.id]?.includes(gem);
                                return (
                                  <button
                                    key={gem}
                                    onClick={() => toggleGemOption(item.id, gem)}
                                    className={`rounded-full px-3 py-1 text-xs font-bold border ${active ? "bg-zinc-100 text-zinc-950 border-zinc-100" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}`}
                                  >
                                    {gem}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="pt-2 flex items-center justify-between text-lg font-black"><span>총금액</span><span>{formatWon(totalPrice)}</span></div>
                  </div>
                )}
              </div>

              <button onClick={sendOrderTemplate} className="w-full rounded-2xl bg-zinc-100 text-zinc-950 py-3 font-black hover:bg-white transition">주문서로 문의하기</button>
              <button onClick={copyOrder} className="w-full rounded-2xl border border-zinc-700 py-3 font-bold hover:bg-zinc-800 transition flex items-center justify-center gap-2">{copied ? <Check size={18}/> : <Copy size={18}/>} {copied ? "복사 완료" : "주문서 복사"}</button>
              {copyPanelOpen && (
                <div className="rounded-3xl border border-zinc-700 bg-zinc-950 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-bold text-zinc-200">주문서 복사</div>
                    <button onClick={() => setCopyPanelOpen(false)} className="text-zinc-500 hover:text-zinc-100"><X size={16}/></button>
                  </div>
                  <textarea
                    ref={orderCopyRef}
                    readOnly
                    value={orderText}
                    onFocus={(e) => e.target.select()}
                    rows={8}
                    className="w-full resize-none rounded-2xl bg-zinc-900 border border-zinc-800 px-3 py-3 text-sm outline-none focus:border-zinc-500"
                  />
                  {copyMessage && <div className="text-xs text-zinc-400">{copyMessage}</div>}
                  <button onClick={manualCopyOrder} className="w-full rounded-2xl bg-zinc-100 text-zinc-950 py-2 text-sm font-black hover:bg-white transition">전체 선택 / 다시 복사</button>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between gap-2 mb-3"><div className="flex items-center gap-2"><Search size={18}/><h2 className="text-lg font-bold">시세표</h2></div>{isAdmin ? <button onClick={() => setEditMode((v) => !v)} className={`rounded-full px-3 py-1 text-sm font-bold border ${editMode ? "bg-zinc-100 text-zinc-950 border-zinc-100" : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}`}>{editMode ? "수정중" : "수정"}</button> : <span className="inline-flex items-center gap-1 text-xs text-zinc-500"><Lock size={14}/> 관리자 잠금</span>}</div>

            {isAdmin && (
              <div className="mb-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-400 leading-relaxed">
                <div className="flex items-center justify-between gap-2"><span className="inline-flex items-center gap-1"><Unlock size={14}/> 관리자 모드</span><button onClick={adminLogout} className="underline text-zinc-200">로그아웃</button></div>
                {editMode && <div className="mt-2">물품 수정/삭제, 시세표 붙여넣기, 이미지 OCR 수정 가능. <button onClick={resetProducts} className="ml-2 underline text-zinc-200">기본값 초기화</button><button onClick={() => setBulkOpen((v) => !v)} className="ml-2 underline text-zinc-200">시세표 일괄수정/OCR</button></div>}
              </div>
            )}

            <div className="flex gap-2 mb-3"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="상품 검색" className="flex-1 rounded-2xl bg-zinc-950 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" />{isAdmin && editMode && <button onClick={startAddProduct} className="shrink-0 rounded-2xl bg-zinc-100 text-zinc-950 px-4 font-black hover:bg-white flex items-center gap-2"><Plus size={18}/> 박스 추가</button>}</div>

            {isAdmin && editMode && bulkOpen && (
              <div className="mb-3 rounded-3xl border border-zinc-700 bg-zinc-950 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold"><FileText size={18}/> 시세표 일괄 수정 / 이미지 OCR</div>
                <div className="text-xs text-zinc-400 leading-relaxed">텍스트 시세표를 붙여넣거나, 이미지 시세표를 업로드하면 OCR로 글자를 읽어옵니다. OCR 결과는 100% 정확하지 않으니 확인 후 전체 교체를 누르세요.</div>
                <label className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-bold hover:bg-zinc-800 cursor-pointer"><ImageIcon size={18}/>{ocrLoading ? `OCR 인식중 ${ocrProgress}%` : "시세표 이미지 업로드"}<input type="file" accept="image/*" onChange={readImageText} className="hidden" disabled={ocrLoading} /></label>
                {ocrLoading && <div className="flex items-center gap-2 text-sm text-zinc-300"><Loader2 size={16} className="animate-spin"/> 이미지에서 글자 읽는 중</div>}
                <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder={`옵두 버스\n2만개 = 10,000원\n5만개 = 22,000원\n---------------------------------\n골드 (999억 맥스)\n100억 = 5,000원`} rows={10} className="w-full resize-none rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500 text-sm" />
                {bulkResult && <div className="text-sm text-zinc-300">{bulkResult}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"><button onClick={importBulkPriceTable} className="rounded-2xl bg-zinc-100 text-zinc-950 py-3 font-black hover:bg-white transition">전체 교체</button><button onClick={appendBulkPriceTable} className="rounded-2xl border border-zinc-700 py-3 font-bold hover:bg-zinc-800 transition">기존에 추가</button></div>
              </div>
            )}

            {isAdmin && editingId !== null && (
              <div className="mb-3 rounded-3xl border border-zinc-700 bg-zinc-950 p-4 space-y-2">
                <div className="font-bold">{editingId === "new" ? "물품 추가" : "물품 수정"}</div>
                <input value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))} placeholder="분류 예: 골드" className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" />
                <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="물품명 예: 골드 900억" className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" />
                <input value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} placeholder="금액 예: 35000" className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" />
                <div className="flex gap-2"><button onClick={saveProduct} className="flex-1 rounded-2xl bg-zinc-100 text-zinc-950 py-3 font-black flex items-center justify-center gap-2"><Save size={17}/> 저장</button><button onClick={cancelEdit} className="flex-1 rounded-2xl border border-zinc-700 py-3 font-bold flex items-center justify-center gap-2"><X size={17}/> 취소</button></div>
              </div>
            )}

            <div className="space-y-4 max-h-[620px] overflow-auto pr-1">
              {Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category}>
                  <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur py-2 text-sm font-black text-zinc-300">{category}</div>
                  <div className="space-y-2">
                    {items.map((p) => (
                      <div
                        key={p.id}
                        draggable={isAdmin && editMode}
                        onDragStart={(event) => startDragProduct(event, p.id)}
                        onDragOver={(event) => { if (isAdmin && editMode) event.preventDefault(); }}
                        onDrop={(event) => dropProduct(event, p.id)}
                        onDragEnd={() => setDraggingProductId(null)}
                        className={`rounded-2xl border bg-zinc-950 p-3 transition ${draggingProductId === p.id ? "border-zinc-100 opacity-60" : "border-zinc-800 hover:border-zinc-500"}`}
                      >
                        <div className="flex items-start justify-between gap-2">{isAdmin && editMode && <div className="mt-1 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-100" title="드래그해서 위치 이동"><GripVertical size={18}/></div>}<button onClick={() => addToCart(p)} className="flex-1 text-left"><div className="font-bold">{p.name}</div><div className="mt-1 text-sm text-zinc-400">{formatWon(p.price)}</div></button>{isAdmin && editMode ? <div className="flex gap-1"><button onClick={() => startEditProduct(p)} className="h-9 w-9 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"><Pencil size={15}/></button><button onClick={() => deleteProduct(p.id)} className="h-9 w-9 rounded-xl border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 text-zinc-400"><Trash2 size={15}/></button></div> : <button onClick={() => addToCart(p)} className="h-9 w-9 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-white"><Plus size={16}/></button>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden min-h-[720px] flex flex-col">
          <div className="border-b border-zinc-800 p-5 flex items-center justify-between"><div className="flex items-center gap-3"><LogoButton onClick={() => setLogoModalOpen(true)} className="h-12 w-12 rounded-2xl" /><div><h2 className="text-xl font-black">진매니저</h2><p className="text-sm text-zinc-400">1:1 거래방</p></div></div><div className="flex items-center gap-2 text-sm text-zinc-300"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>상담 가능</div></div>
          <div className="flex-1 overflow-auto p-5 space-y-4 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_35%)]">
            {messages.map((m) => <div key={m.id} className={`flex gap-3 ${m.from === "user" ? "justify-end" : "justify-start"}`}>{m.from === "bot" && <LogoButton onClick={() => setLogoModalOpen(true)} className="h-9 w-9 rounded-xl shrink-0" />}<div className={`max-w-[78%] rounded-3xl px-4 py-3 ${m.from === "user" ? "bg-zinc-100 text-zinc-950 rounded-br-md" : "bg-zinc-800 text-zinc-100 rounded-bl-md"}`}><p className="whitespace-pre-wrap leading-relaxed">{m.text}</p><p className={`mt-1 text-xs ${m.from === "user" ? "text-zinc-600" : "text-zinc-500"}`}>{m.time}</p></div></div>)}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-zinc-800 p-4 bg-zinc-950">
            <div className="flex gap-2 mb-3 overflow-auto pb-1">{["거래 가능하세요?", "입금했습니다", "배틀태그 보냈습니다", "주문서 확인 부탁드립니다"].map((t) => <button key={t} onClick={() => sendMessage(t)} className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 transition">{t}</button>)}</div>
            <div className="flex items-end gap-3"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="문의 내용을 입력하세요" rows={2} className="flex-1 resize-none rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500" /><button onClick={() => sendMessage()} className="h-[52px] w-[52px] rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center hover:bg-white transition"><Send size={20}/></button></div>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><Bell size={14}/> {channelPluginKey.trim() ? "채널톡 연결 시 문의 내용은 채널톡 입력창에 자동 입력됩니다." : "관리자에서 채널톡 플러그인 키를 넣으면 보내기 버튼이 채널톡으로 연결됩니다."}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
