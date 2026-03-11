const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxvOF8PBJJKdhZ4btx5Hj512rPYYD08qrEcghl6QkwvIgBF_u2hH4Dq5hxUDcMZ2J8hQfe0WcZD6ME/pub?gid=616639481&single=true&output=csv";
const MENTOR_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-rBG0znKuERnIsYqSnSC9g2Idu-_-gLjHkAa1aOL8oXoeriN28h_OMEo-2Tb9OXC_uR-c9MH5W668/pub?gid=408235901&single=true&output=csv";
const REGISTRATION_GOAL = 500;
const REFRESH_INTERVAL_MS = 60_000;

const FIELD_LABELS = {
  timestamp: "Timestamp",
  university: "University",
  levelOfStudy: "Level of Study",
  majors: "Program(s) of Study (Majors)?",
  minors: "Minors?",
  codingSkill:
    "How would you categorize your familiarity/skill set with coding and data analytics (e.g. Python, Java, etc.)?",
  embeddedSkill:
    "How would you categorize your familiarity/skill set with embedded programming and systems (e.g. Arduino)?",
  uiuxSkill:
    "How would you categorize your familiarity/skill set with UI/UX design and web development (e.g. Figma)?",
  productSkill:
    "How would you categorize your familiarity/skill set with product design, management, and presentations?",
  teamMatch:
    "Teams can be of sizes 1-4. Would you like our assistance in matching you with potential teammates?\n\n(We will have several mixers, before and at the start of the event to help students form teams).",
  ds3Member: "Are you a Data Science Student Society (DS3) Member?",
  tqtMember: "Are you a Triton Quantitative Trading (TQT) Member?",
  startupMember: "Are you a Startup Incubator Club Member?",
  gdgMember: "Are you a Google Developers Group @ UC San Diego (GDG) Member?",
  awsMember: "Are you an AWS Cloud Club @ UC San Diego Member?",
  bmesMember: "Are you a Biomedical Engineering Society (BMES) Member?",
  tracks:
    "Pick 1-2 Domain Tracks that you'd be interesting in signing up for. View full track descriptions on the website!\n\nNote: You are NOT required to be skilled in a specific domain to sign up for that track. All tracks are open to all skill levels. Your project will be judged against other project submissions within that track.",
  food:
    "Do you have any food allergies or dietary restrictions?\n\nNote: We can not guarantee accommodations for all allergies dietary restrictions, but we will try our best.",
  firstHack: "Is DataHacks 2026 your first university-level hackathon?",
  shirtSize:
    "Please indicate your preferred T-shirt size.\n\nNote: We do not guarantee that we can get your preferred size.",
  overnight:
    "Do you plan on staying in the venue overnight?\n\nNote: We suggest you bring your own sleeping bag and/or any other sleeping accommodations. Overnight stay is welcome to all participants, including UCSD students.",
  lookingForward: "What part of DataHacks 2026 are you looking forward to the most?",
  referral: "How did you hear about this hackathon?",
  activities:
    "If it were up to you, what’s one fun activity you’d love to see during the hackathon? (Midnight mini-games? Poker tournament? Mario Kart tournament? Churro cart? Be creative! 👀)",
  biotechFocus:
    "If you expressed interest in the biotechnology track, what broad category would your project mostly likely fall under?",
  phone: "Phone Number",
  pmClub: "Are you a Product Management Club Member?"
};

const MENTOR_FIELD_LABELS = {
  employer: "Current Employer/Affiliation (e.g. Apple or HDSI)",
  title: "Current Job Title",
  participation: "Are you interested in mentorship, judging, or both?",
  ucsd: "Are you a UCSD student, alumni, or faculty member?"
};

const CLUB_FIELDS = [
  { key: "ds3Member", label: "DS3" },
  { key: "tqtMember", label: "TQT" },
  { key: "startupMember", label: "Startup Incubator" },
  { key: "gdgMember", label: "GDG @ UCSD" },
  { key: "awsMember", label: "AWS Cloud Club" },
  { key: "bmesMember", label: "BMES" },
  { key: "pmClub", label: "Product Management Club" }
];

const topElements = {
  dashboard: document.getElementById("dashboard"),
  errorPanel: document.getElementById("error-panel"),
  refreshButton: document.getElementById("refresh-button"),
  statusLine: document.getElementById("status-line"),
  totalRegistrations: document.getElementById("total-registrations"),
  goalProgress: document.getElementById("goal-progress"),
  universityCount: document.getElementById("university-count"),
  firstHackCount: document.getElementById("first-hack-count"),
  goalCaption: document.getElementById("goal-caption"),
  goalBar: document.getElementById("goal-bar"),
  mentorStatus: document.getElementById("mentor-status")
};

const SKILL_ORDER = ["1", "2", "3", "4", "5"];
const SHIRT_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
const LOOKING_FORWARD_ORDER = [
  "Networking with Industry Professionals",
  "Networking with Other Students",
  "Developing New Skills",
  "Using an Existing Skillset",
  "Free Food",
  "Fun Activities",
  "Prizes + Post-Hackathon LinkedIn Posts",
  "Other"
];
const BIOTECH_ORDER = [
  "Therapeutic Research and Development",
  "Medical Device Mechanical Design"
];
const MENTOR_PARTICIPATION_ORDER = [
  "Mentorship, April 18",
  "Mentorship, April 19",
  "Judging, April 19",
  "Both",
  "Mentorship",
  "Judging"
];

const COMPANY_ALIASES = [
  { pattern: /\bapple\b|\baiml\b/i, label: "Apple" },
  { pattern: /\bamazon web services\b|\bamazon aws\b|\baws\b/i, label: "Amazon Web Services" },
  { pattern: /\bamazon\b/i, label: "Amazon" },
  { pattern: /\bgoogle deepmind\b/i, label: "Google DeepMind" },
  { pattern: /\bgoogle\b/i, label: "Google" },
  { pattern: /\bmicrosoft\b/i, label: "Microsoft" },
  { pattern: /\bnetflix\b/i, label: "Netflix" },
  { pattern: /\bdoordash\b/i, label: "DoorDash" },
  { pattern: /\bpaypal\b/i, label: "PayPal" },
  { pattern: /\bqualcomm\b/i, label: "Qualcomm" },
  { pattern: /\blinkedin\b/i, label: "LinkedIn" },
  { pattern: /\bintuit\b/i, label: "Intuit" },
  { pattern: /\bvisa\b/i, label: "Visa" },
  { pattern: /\buber\b/i, label: "Uber" },
  { pattern: /\blyft\b/i, label: "Lyft" },
  { pattern: /\bsonos\b/i, label: "Sonos" },
  { pattern: /\bnvidia\b/i, label: "NVIDIA" },
  { pattern: /\boracle health and ai\b/i, label: "Oracle Health and AI" },
  { pattern: /\boracle\b/i, label: "Oracle" },
  { pattern: /\bhyundai autoever\b/i, label: "Hyundai AutoEver America" },
  { pattern: /\bthe datajam\b/i, label: "The DataJam" },
  { pattern: /\botter\.ai\b/i, label: "Otter.ai" },
  { pattern: /\bwalmart labs\b/i, label: "Walmart Labs" },
  { pattern: /\bwalmart\b/i, label: "Walmart" },
  { pattern: /\byahoo\b/i, label: "Yahoo" },
  { pattern: /\bdisney\+\b|\bdisney\b/i, label: "Disney+" },
  { pattern: /\bsalesforce\b/i, label: "Salesforce" },
  { pattern: /\bmarvell\b/i, label: "Marvell Technology" },
  { pattern: /\bnutanix\b/i, label: "Nutanix" },
  { pattern: /\bibm\b/i, label: "IBM" },
  { pattern: /\balbertsons\b/i, label: "Albertsons" },
  { pattern: /\bsan jose state university\b/i, label: "San Jose State University" },
  { pattern: /\bucsd\b|\buniversity of california san diego\b/i, label: "UC San Diego" }
];

const ROLE_CATEGORY_ORDER = [
  "Software Engineering",
  "Machine Learning / AI",
  "Data / Analytics",
  "Product",
  "Research",
  "Engineering Leadership",
  "Founder / Executive",
  "Security",
  "Student / Academic",
  "Investment",
  "Other"
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        value += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => cell.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function normalizeRows(csvText) {
  const rows = parseCsv(csvText);
  const [headers = [], ...body] = rows;
  return body.map((cells) => {
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = cells[index] ?? "";
    });
    return entry;
  });
}

function cleanValue(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedKey(value) {
  return cleanValue(value).toLowerCase();
}

function toTitleCase(text) {
  return cleanValue(text)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function splitMultiValue(value) {
  const raw = cleanValue(value);
  if (!raw) {
    return [];
  }

  return raw
    .split(/\s*(?:,|;|\band\b|\n)\s*/i)
    .map(cleanValue)
    .filter(Boolean)
    .filter((item) => normalizedKey(item) !== "n/a" && normalizedKey(item) !== "none");
}

function buildCounts(values, options = {}) {
  const counts = new Map();

  values.forEach((value) => {
    const cleaned = cleanValue(value);
    if (!cleaned) {
      return;
    }

    const label = options.transform ? options.transform(cleaned) : cleaned;
    const count = counts.get(label) || 0;
    counts.set(label, count + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, options.limit || Number.POSITIVE_INFINITY);
}

function buildMultiCounts(values, options = {}) {
  return buildCounts(
    values.flatMap((value) => splitMultiValue(value)),
    options
  );
}

function buildMappedMultiCounts(values, mapper, options = {}) {
  return buildCounts(
    values.flatMap((value) => splitMultiValue(value).map(mapper).filter(Boolean)),
    options
  );
}

function isAffirmative(value) {
  const normalized = normalizedKey(value);
  return (
    normalized.startsWith("yes") ||
    normalized === "true" ||
    normalized === "y" ||
    normalized === "interested"
  );
}

function summarizeFood(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "Other";
  }
  if (["no", "none", "n/a", "na", "nope"].includes(normalized)) {
    return "None";
  }
  if (normalized.includes("vegetarian") || normalized.includes("veggie")) {
    return "Vegetarian";
  }
  if (normalized.includes("halal")) {
    return "Halal";
  }
  return "Other";
}

function normalizeTrack(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (
    normalized.includes("ui") ||
    normalized.includes("ux") ||
    normalized.includes("web development") ||
    normalized.includes("web dev")
  ) {
    return "UI/UX Design & Web Development";
  }
  return toTitleCase(value);
}

function aggregateWithOther(items, limit) {
  if (items.length <= limit) {
    return items;
  }

  const visible = items.slice(0, Math.max(0, limit - 1));
  const otherCount = items.slice(Math.max(0, limit - 1)).reduce((sum, item) => sum + item.count, 0);
  return [...visible, { label: "Other", count: otherCount }];
}

function aggregateBelowThreshold(items, minimumCount) {
  const kept = items.filter((item) => item.count >= minimumCount);
  const otherCount = items
    .filter((item) => item.count < minimumCount)
    .reduce((sum, item) => sum + item.count, 0);

  if (otherCount === 0) {
    return kept;
  }

  return [...kept, { label: "Other", count: otherCount }];
}

function orderByList(items, order) {
  const rank = new Map(order.map((value, index) => [value, index]));
  return [...items].sort((left, right) => {
    const leftRank = rank.has(left.label) ? rank.get(left.label) : Number.POSITIVE_INFINITY;
    const rightRank = rank.has(right.label) ? rank.get(right.label) : Number.POSITIVE_INFINITY;
    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }
    return right.count - left.count || left.label.localeCompare(right.label);
  });
}

function normalizeSkillLevel(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) {
    return "";
  }

  const match = cleaned.match(/\b([1-5])\b/);
  if (match) {
    return match[1];
  }

  const normalized = normalizedKey(cleaned);
  if (normalized.includes("beginner")) return "1";
  if (normalized.includes("novice")) return "2";
  if (normalized.includes("intermediate")) return "3";
  if (normalized.includes("advanced")) return "4";
  if (normalized.includes("expert")) return "5";
  return cleaned;
}

function normalizeShirtSize(value) {
  const normalized = normalizedKey(value).replace(/\s+/g, "");
  if (["x-small", "xs"].includes(normalized)) return "XS";
  if (normalized === "s" || normalized === "small") return "S";
  if (normalized === "m" || normalized === "medium") return "M";
  if (normalized === "l" || normalized === "large") return "L";
  if (["xl", "xlarge"].includes(normalized)) return "XL";
  if (["xxl", "2xl", "xx-large", "2xlarge"].includes(normalized)) return "XXL";
  return cleanValue(value).toUpperCase();
}

function classifyLookingForward(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (normalized.includes("networking with industry")) return "Networking with Industry Professionals";
  if (normalized.includes("networking with other students")) return "Networking with Other Students";
  if (normalized.includes("developing new skills")) return "Developing New Skills";
  if (normalized.includes("using an existing skillset")) return "Using an Existing Skillset";
  if (normalized.includes("free food")) return "Free Food";
  if (normalized.includes("fun activities")) return "Fun Activities";
  if (normalized.includes("prizes")) return "Prizes + Post-Hackathon LinkedIn Posts";
  if (normalized.startsWith("other")) return "Other";
  return "Other";
}

function classifyFoodItem(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (["no", "none", "n/a", "na", "nope"].includes(normalized)) {
    return "None";
  }
  if (normalized.includes("vegetarian") || normalized.includes("veggie")) {
    return "Vegetarian";
  }
  if (normalized.includes("halal")) {
    return "Halal";
  }
  return "Other";
}

function classifyActivity(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (/mario/.test(normalized)) return "Mario Kart";
  if (/poker|blackjack|casino/.test(normalized)) return "Poker/Casino";
  if (/karaoke/.test(normalized)) return "Karaoke";
  if (/mini.?game/.test(normalized)) return "Mini-Games";
  if (/smash/.test(normalized)) return "Smash Bros";
  if (/ice cream|pizookie|pizookies/.test(normalized)) return "Ice Cream/Pizookies";
  if (/boba/.test(normalized)) return "Boba";
  if (/churro/.test(normalized)) return "Churro Cart";
  if (/popcorn/.test(normalized)) return "Popcorn";
  if (/tournament/.test(normalized)) return "Tournament";
  if (/food|snack|snacks/.test(normalized)) return "Food";
  return "Other";
}

function normalizeEmployer(value) {
  const cleaned = cleanValue(value);
  if (!cleaned) {
    return "";
  }
  const compact = cleaned
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\([^)]*\)/g, "")
    .trim();
  const directMatch = COMPANY_ALIASES.find((entry) => entry.pattern.test(compact));
  if (directMatch) {
    return directMatch.label;
  }

  const primary = compact
    .split(/\s*,\s*|\s+and\s+|\s*\/\s*/i)
    .map(cleanValue)
    .find(Boolean);

  if (!primary || /^n\/a$/i.test(primary)) {
    return "Other / Unspecified";
  }

  const primaryMatch = COMPANY_ALIASES.find((entry) => entry.pattern.test(primary));
  if (primaryMatch) {
    return primaryMatch.label;
  }

  return primary;
}

function normalizeRoleCategory(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (/founder|ceo|cto|cpo|director|head of/.test(normalized)) return "Founder / Executive";
  if (/engineering manager|staff engineer|principal engineer|lead software engineer|senior engineering manager|manager/.test(normalized)) {
    return "Engineering Leadership";
  }
  if (/machine learning|ml engineer|ai engineer|ai scientist|agentic ai|computational designer/.test(normalized)) {
    return "Machine Learning / AI";
  }
  if (/data scientist|data engineer|data & ai architect|analytics/.test(normalized)) {
    return "Data / Analytics";
  }
  if (/product manager|product operations|technical program manager/.test(normalized)) {
    return "Product";
  }
  if (/research engineer|researcher/.test(normalized)) {
    return "Research";
  }
  if (/security engineer/.test(normalized)) {
    return "Security";
  }
  if (/student|mentor|faculty|alumni|academic/.test(normalized)) {
    return "Student / Academic";
  }
  if (/investor|portfolio manager|ventures/.test(normalized)) {
    return "Investment";
  }
  if (/software engineer|software development engineer|sde|member of technical staff|cad engineer|engineer/.test(normalized)) {
    return "Software Engineering";
  }
  return "Other";
}

function normalizeParticipation(value) {
  const normalized = normalizedKey(value);
  if (!normalized) {
    return "";
  }
  if (normalized.includes("mentorship, april 18")) return "Mentorship, April 18";
  if (normalized.includes("mentorship, april 19")) return "Mentorship, April 19";
  if (normalized.includes("judging, april 19")) return "Judging, April 19";
  if (normalized.includes("both")) return "Both";
  if (normalized.includes("mentor")) return "Mentorship";
  if (normalized.includes("judge")) return "Judging";
  return cleanValue(value);
}

function renderBarChart(targetId, items, meta = "") {
  const target = document.getElementById(targetId);
  if (!target) {
    return;
  }

  if (!items.length) {
    target.innerHTML = '<p class="empty-state">No data available.</p>';
    return;
  }

  const max = items[0].count || 1;
  const rows = items
    .map(({ label, count }) => {
      const width = Math.max(6, Math.round((count / max) * 100));
      return `
        <div class="chart-row">
          <div class="chart-label-line">
            <strong>${escapeHtml(label)}</strong>
            <span>${count}</span>
          </div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${width}%"></div>
          </div>
        </div>
      `;
    })
    .join("");

  target.innerHTML = `<div class="chart">${meta ? `<p class="chart-meta">${escapeHtml(meta)}</p>` : ""}${rows}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function computeMetrics(rows) {
  const allUniversityCounts = buildCounts(rows.map((row) => row[FIELD_LABELS.university]), {
    transform: toTitleCase
  });
  const universities = allUniversityCounts;
  const firstHackCounts = buildCounts(rows.map((row) => row[FIELD_LABELS.firstHack]), {
    transform: toTitleCase
  });

  const firstHackYes = rows.filter((row) => isAffirmative(row[FIELD_LABELS.firstHack])).length;

  return {
    universities,
    uniqueUniversities: allUniversityCounts.length,
    firstHackCounts,
    firstHackYes,
    total: rows.length
  };
}

function updateTopMetrics(metrics) {
  const percent = metrics.total === 0 ? 0 : Math.min(100, Math.round((metrics.total / REGISTRATION_GOAL) * 100));

  topElements.totalRegistrations.textContent = metrics.total.toLocaleString();
  topElements.goalProgress.textContent = `${percent}%`;
  topElements.universityCount.textContent = metrics.uniqueUniversities.toLocaleString();
  topElements.firstHackCount.textContent = metrics.firstHackYes.toLocaleString();
  topElements.goalCaption.textContent = `${metrics.total.toLocaleString()} of ${REGISTRATION_GOAL.toLocaleString()} registrations`;
  topElements.goalBar.style.width = `${percent}%`;
}

function renderDashboard(rows) {
  const metrics = computeMetrics(rows);
  updateTopMetrics(metrics);

  renderBarChart(
    "tracks-chart",
    buildMultiCounts(rows.map((row) => row[FIELD_LABELS.tracks]), {
      transform: normalizeTrack,
      limit: 12
    }),
    "Each registrant may pick up to two tracks."
  );
  renderBarChart(
    "majors-chart",
    aggregateWithOther(
      buildMultiCounts(rows.map((row) => row[FIELD_LABELS.majors]), {
        transform: toTitleCase
      }),
      12
    )
  );
  renderBarChart(
    "minors-chart",
    aggregateWithOther(
      buildMultiCounts(rows.map((row) => row[FIELD_LABELS.minors]), {
        transform: toTitleCase
      }),
      12
    )
  );
  renderBarChart(
    "study-chart",
    buildCounts(rows.map((row) => row[FIELD_LABELS.levelOfStudy]), {
      transform: toTitleCase
    })
  );
  renderBarChart("university-chart", aggregateWithOther(metrics.universities, 12));
  renderBarChart(
    "referral-chart",
    buildCounts(rows.map((row) => row[FIELD_LABELS.referral]), {
      transform: toTitleCase,
      limit: 10
    })
  );
  renderBarChart("first-hack-chart", metrics.firstHackCounts);
  renderBarChart(
    "shirt-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.shirtSize]), {
        transform: normalizeShirtSize
      }),
      SHIRT_ORDER
    )
  );
  renderBarChart(
    "overnight-chart",
    buildCounts(rows.map((row) => row[FIELD_LABELS.overnight]), {
      transform: toTitleCase
    })
  );
  renderBarChart(
    "food-chart",
    orderByList(
      buildMappedMultiCounts(rows.map((row) => row[FIELD_LABELS.food]), classifyFoodItem),
      ["None", "Vegetarian", "Halal", "Other"]
    )
  );
  renderBarChart(
    "looking-forward-chart",
    orderByList(
      buildMappedMultiCounts(rows.map((row) => row[FIELD_LABELS.lookingForward]), classifyLookingForward),
      LOOKING_FORWARD_ORDER
    )
  );
  renderBarChart(
    "biotech-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.biotechFocus]), {
        transform: cleanValue
      }),
      BIOTECH_ORDER
    )
  );
  renderBarChart(
    "activities-chart",
    buildCounts(rows.map((row) => classifyActivity(row[FIELD_LABELS.activities])))
  );
  renderBarChart(
    "clubs-chart",
    CLUB_FIELDS.map((club) => ({
      label: club.label,
      count: rows.filter((row) => isAffirmative(row[FIELD_LABELS[club.key]])).length
    })).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label)),
    "Counts show how many registrants answered yes for each club."
  );
  renderBarChart(
    "coding-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.codingSkill]), { transform: normalizeSkillLevel }),
      SKILL_ORDER
    )
  );
  renderBarChart(
    "embedded-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.embeddedSkill]), { transform: normalizeSkillLevel }),
      SKILL_ORDER
    )
  );
  renderBarChart(
    "uiux-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.uiuxSkill]), { transform: normalizeSkillLevel }),
      SKILL_ORDER
    )
  );
  renderBarChart(
    "product-chart",
    orderByList(
      buildCounts(rows.map((row) => row[FIELD_LABELS.productSkill]), { transform: normalizeSkillLevel }),
      SKILL_ORDER
    )
  );
}

function renderMentorDashboard(rows) {
  renderBarChart(
    "mentor-company-chart",
    aggregateBelowThreshold(
      buildCounts(rows.map((row) => row[MENTOR_FIELD_LABELS.employer]), {
        transform: normalizeEmployer
      }),
      3
    )
  );
  renderBarChart(
    "mentor-role-chart",
    orderByList(
      buildCounts(rows.map((row) => row[MENTOR_FIELD_LABELS.title]), {
        transform: normalizeRoleCategory
      }),
      ROLE_CATEGORY_ORDER
    )
  );
  renderBarChart(
    "mentor-participation-chart",
    orderByList(
      buildCounts(rows.map((row) => row[MENTOR_FIELD_LABELS.participation]), {
        transform: normalizeParticipation
      }),
      MENTOR_PARTICIPATION_ORDER
    )
  );
  renderBarChart(
    "mentor-ucsd-chart",
    buildCounts(rows.map((row) => row[MENTOR_FIELD_LABELS.ucsd]), {
      transform: toTitleCase
    })
  );
  topElements.mentorStatus.textContent = `${rows.length.toLocaleString()} mentor/judge registrations loaded.`;
}

async function fetchAndRender() {
  topElements.refreshButton.disabled = true;
  topElements.statusLine.textContent = "Refreshing registrations...";
  topElements.errorPanel.classList.add("hidden");

  try {
    const [registrationResponse, mentorResponse] = await Promise.all([
      fetch(CSV_URL, { cache: "no-store" }),
      fetch(MENTOR_CSV_URL, { cache: "no-store" })
    ]);

    if (!registrationResponse.ok) {
      throw new Error(`Registration request failed with status ${registrationResponse.status}`);
    }
    if (!mentorResponse.ok) {
      throw new Error(`Mentor request failed with status ${mentorResponse.status}`);
    }

    const [registrationCsvText, mentorCsvText] = await Promise.all([
      registrationResponse.text(),
      mentorResponse.text()
    ]);
    const rows = normalizeRows(registrationCsvText);
    const mentorRows = normalizeRows(mentorCsvText);
    renderDashboard(rows);
    renderMentorDashboard(mentorRows);
    topElements.dashboard.classList.remove("hidden");

    const timestamp = new Date();
    topElements.statusLine.textContent = `Last updated ${timestamp.toLocaleString()}. Auto-refresh every 60 seconds.`;
  } catch (error) {
    topElements.errorPanel.innerHTML = `
      <h2>Unable to load registrations</h2>
      <p class="empty-state">${escapeHtml(error.message)}</p>
      <p class="empty-state">Confirm the sheet stays published as CSV and serve this site over http://localhost rather than opening it as a file.</p>
    `;
    topElements.errorPanel.classList.remove("hidden");
    topElements.statusLine.textContent = "Refresh failed.";
  } finally {
    topElements.refreshButton.disabled = false;
  }
}

topElements.refreshButton.addEventListener("click", fetchAndRender);
fetchAndRender();
window.setInterval(fetchAndRender, REFRESH_INTERVAL_MS);
