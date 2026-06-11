const storageKey = "gongyeonOnPortfolio";
const customKey = "gongyeonOnCustomEvents";
const selectedEventKey = "gongyeonOnSelectedEvent";

const pageRoutes = {
  list: "index.html",
  notice: "notice.html",
  applications: "applications.html",
  apply: "apply.html",
  register: "register.html"
};
const currentPage = document.body.dataset.page || "list";

function goToPage(pageName) {
  const target = pageRoutes[pageName] || "index.html";
  if (document.getElementById(`page-${pageName}`)) {
    setActivePage(pageName);
    return;
  }
  window.location.href = target;
}

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const today = new Date();
today.setHours(0, 0, 0, 0);

const dateAfter = (days) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const formatKoreanDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "");
};

const baseEvents = [
  {
    id: "event-001",
    title: "OO고등학교 축제 찬조 공연 모집",
    school: "OO고등학교",
    type: "고등학교 공연",
    region: "수원",
    category: "밴드",
    date: dateAfter(9),
    deadline: dateAfter(2),
    venue: "OO고등학교 강당",
    poster: "purple",
    description: "교내 축제의 오프닝 무대를 함께할 밴드팀을 모집합니다. 리허설은 공연 당일 오전에 진행되며 드럼, 앰프, 마이크 기본 장비가 제공됩니다.",
    requirements: "3인 이상 밴드팀 / 라이브 연주 가능 / 영상 링크 필수"
  },
  {
    id: "event-002",
    title: "△△대학교 축제 공연팀 모집",
    school: "△△대학교",
    type: "대학교 공연",
    region: "성남",
    category: "댄스",
    date: dateAfter(16),
    deadline: dateAfter(7),
    venue: "△△대학교 야외 특설무대",
    poster: "blue",
    description: "대학 축제 서브 스테이지에서 관객과 호흡할 댄스팀을 모집합니다. 팀별 공연 시간은 5분 내외이며 사전 음원 제출이 필요합니다.",
    requirements: "2인 이상 댄스팀 / 음원 파일 제출 / 리허설 참여 가능"
  },
  {
    id: "event-003",
    title: "☆수고등학교 체육대회 공연 모집",
    school: "☆수고등학교",
    type: "고등학교 공연",
    region: "화성",
    category: "보컬",
    date: dateAfter(21),
    deadline: dateAfter(12),
    venue: "☆수고등학교 운동장",
    poster: "gold",
    description: "체육대회 분위기를 끌어올릴 보컬 또는 어쿠스틱 팀을 찾습니다. 짧고 에너지 있는 무대를 선호합니다.",
    requirements: "보컬 솔로 또는 팀 / MR 또는 악기 준비 / 4분 내외 공연"
  },
  {
    id: "event-004",
    title: "수원 청소년 거리 버스킹 참가팀 모집",
    school: "수원청소년문화센터",
    type: "버스킹 공연",
    region: "수원",
    category: "기타",
    date: dateAfter(12),
    deadline: dateAfter(3),
    venue: "수원역 문화광장",
    poster: "rose",
    description: "청소년 공연팀이 자유롭게 참여하는 야외 버스킹 무대입니다. 밴드, 보컬, 댄스, 악기 연주 등 다양한 장르를 받습니다.",
    requirements: "청소년 팀 우대 / 야외 공연 가능 / 장비 일부 개인 준비"
  },
  {
    id: "event-005",
    title: "용인 지역 문화제 청소년 무대 모집",
    school: "용인문화재단",
    type: "지역 행사 공연",
    region: "용인",
    category: "밴드",
    date: dateAfter(28),
    deadline: dateAfter(19),
    venue: "용인시민공원 메인무대",
    poster: "green",
    description: "지역 문화제 청소년 스테이지에 참여할 공연팀을 모집합니다. 무대 경험을 쌓고 싶은 팀에게 적합합니다.",
    requirements: "팀 소개서 / 공연 영상 링크 / 6분 이내 무대"
  }
];

let customEvents = JSON.parse(localStorage.getItem(customKey) || "[]");
let uploadedPosterData = "";
let applications = JSON.parse(localStorage.getItem(storageKey) || "null") || [
  { id: "app-001", eventId: "event-001", team: "루미너스", field: "밴드", leader: "홍길동", phone: "010-1234-5678", email: "pluto@example.com", appliedAt: dateAfter(-1), status: "접수 완료" },
  { id: "app-002", eventId: "event-002", team: "스파크", field: "댄스", leader: "김민준", phone: "010-2222-3333", email: "spark@example.com", appliedAt: dateAfter(-3), status: "검토중" },
  { id: "app-003", eventId: "event-003", team: "새벽소리", field: "보컬", leader: "이서연", phone: "010-4444-5555", email: "voice@example.com", appliedAt: dateAfter(-5), status: "접수 완료" }
];

const getEvents = () => [...baseEvents, ...customEvents];
const findEvent = (id) => getEvents().find((event) => event.id === id);
const daysLeft = (deadline) => Math.ceil((new Date(`${deadline}T00:00:00`) - today) / 86400000);
const isCustomEvent = (eventId) => String(eventId).startsWith("custom-");
const isClosedEvent = (event) => !event || daysLeft(event.deadline) < 0;
const hasApplied = (eventId) => applications.some((application) => application.eventId === eventId);

function getEventCategories(event) {
  if (!event) return [];
  if (Array.isArray(event.categories)) return event.categories.filter(Boolean);
  return String(event.category || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatCategories(event) {
  const categories = getEventCategories(event);
  return categories.length ? categories.join(", ") : "미정";
}

function matchesCategory(event, selectedCategory) {
  return selectedCategory === "all" || getEventCategories(event).includes(selectedCategory);
}

function isUrgentEvent(event) {
  const left = daysLeft(event.deadline);
  return left >= 0 && left <= 3;
}

function deadlineBadge(event) {
  const left = daysLeft(event.deadline);
  if (left < 0) return { text: "마감", className: "danger" };
  if (left === 0) return { text: "오늘 마감", className: "warning urgent" };
  if (left <= 3) return { text: `마감 임박 D-${left}`, className: "warning urgent" };
  return { text: "모집중", className: "success" };
}

function setActivePage(pageName) {
  const targetSection = document.getElementById(`page-${pageName}`);
  if (!targetSection) {
    window.location.href = pageRoutes[pageName] || "index.html";
    return;
  }
  $$(".page").forEach((page) => page.classList.toggle("active", page.id === `page-${pageName}`));
  $$('[data-page-link]').forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === pageName);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (pageName === "apply") updateApplyInfo();
}

function escapeAttr(value = "") {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function posterMarkup(event, className = "poster") {
  if (event?.image) {
    return `<div class="${className} has-image" style="background-image: url(&quot;${escapeAttr(event.image)}&quot;)" aria-hidden="true"></div>`;
  }
  return `<div class="${className} ${event?.poster || "purple"}" aria-hidden="true"></div>`;
}

function setPosterElement(element, event) {
  element.className = `modal-poster ${event?.image ? "has-image" : event?.poster || "purple"}`;
  element.style.backgroundImage = event?.image ? `url("${event.image}")` : "";
}

function eventCard(event) {
  const badge = deadlineBadge(event);
  const alreadyApplied = hasApplied(event.id);
  const closed = isClosedEvent(event);
  const applyLabel = closed ? "마감" : alreadyApplied ? "신청 완료" : "신청";
  const urgent = isUrgentEvent(event);
  const ownerEvent = isCustomEvent(event.id);
  return `
    <article class="performance-card ${urgent ? "urgent-card" : ""} ${ownerEvent ? "owner-card" : ""}">
      ${posterMarkup(event)}
      <div class="performance-info">
        <h3>${event.title}</h3>
        <div class="meta-row">
          <span class="badge ${badge.className}">${badge.text}</span>
          ${ownerEvent ? `<span class="badge owner">내가 등록한 공고</span>` : ""}
          <span>${event.region}</span>
          <span>${formatCategories(event)}</span>
          <span>공연일 · ${formatKoreanDate(event.date)}</span>
          <span>마감 · ${formatKoreanDate(event.deadline)}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="small-btn" type="button" data-detail="${event.id}">상세 보기</button>
        ${ownerEvent ? "" : `<button class="small-btn primary" type="button" data-apply-now="${event.id}" ${closed || alreadyApplied ? "disabled" : ""}>${applyLabel}</button>`}
        ${ownerEvent ? `<button class="small-btn danger-outline" type="button" data-delete-event="${event.id}">공고 삭제</button>` : ""}
      </div>
    </article>
  `;
}

function noticeCard(event) {
  const badge = deadlineBadge(event);
  const urgent = isUrgentEvent(event);
  const ownerEvent = isCustomEvent(event.id);
  return `
    <article class="notice-card ${urgent ? "urgent-card" : ""} ${ownerEvent ? "owner-card" : ""}">
      ${posterMarkup(event)}
      <div class="notice-content">
        <span class="badge ${badge.className}">${badge.text}</span>
        ${ownerEvent ? `<span class="badge owner">내가 등록한 공고</span>` : ""}
        <h3>${event.title}</h3>
        <div class="meta-row">
          <span>${event.type}</span>
          <span>${event.region}</span>
          <span>${formatCategories(event)}</span>
        </div>
        <p>${event.description}</p>
        <div class="notice-footer">
          <span class="meta-row">${formatKoreanDate(event.date)} · ${event.venue}</span>
          <div class="card-actions">
            <button class="small-btn primary" type="button" data-detail="${event.id}">상세 보기</button>
            ${isCustomEvent(event.id) ? `<button class="small-btn danger-outline" type="button" data-delete-event="${event.id}">공고 삭제</button>` : ""}
          </div>
        </div>
      </div>
    </article>
  `;
}

function applicationCard(application) {
  const event = findEvent(application.eventId);
  if (!event) {
    return `
      <article class="application-card">
        <div class="poster purple" aria-hidden="true"></div>
        <div class="application-info">
          <h3>삭제된 공연 공고</h3>
          <div class="meta-row">
            <span class="badge danger">공고 없음</span>
            <span>팀명 · ${application.team}</span>
            <span>신청일 · ${formatKoreanDate(application.appliedAt)}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="small-btn danger-outline" type="button" data-cancel-application="${application.id}">내역 삭제</button>
        </div>
      </article>
    `;
  }

  const canCancel = !isClosedEvent(event);
  return `
    <article class="application-card">
      ${posterMarkup(event)}
      <div class="application-info">
        <h3>${event.title}</h3>
        <div class="meta-row">
          <span class="badge ${application.status === "접수 완료" ? "success" : "warning"}">${application.status}</span>
          <span>팀명 · ${application.team}</span>
          <span>분야 · ${application.field}</span>
          <span>공연 날짜 · ${formatKoreanDate(event.date)}</span>
          <span>신청일 · ${formatKoreanDate(application.appliedAt)}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="small-btn" type="button" data-detail="${event.id}">상세 보기</button>
        ${canCancel
          ? `<button class="small-btn danger-outline" type="button" data-cancel-application="${application.id}">신청 취소</button>`
          : `<button class="small-btn locked" type="button" disabled title="모집이 마감되어 신청 취소가 잠겨 있습니다.">취소 불가</button>`}
      </div>
    </article>
  `;
}

function renderEvents() {
  const searchInput = $("#searchInput");
  const categoryFilter = $("#categoryFilter");
  const regionFilter = $("#regionFilter");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const category = categoryFilter ? categoryFilter.value : "all";
  const region = regionFilter ? regionFilter.value : "all";
  const events = getEvents().filter((event) => {
    const keywordMatch = [event.title, event.school, event.region, event.venue, event.type, formatCategories(event)].join(" ").toLowerCase().includes(query);
    const categoryMatch = matchesCategory(event, category);
    const regionMatch = region === "all" || event.region === region;
    return keywordMatch && categoryMatch && regionMatch;
  });

  const performanceList = $("#performanceList");
  if (performanceList) performanceList.innerHTML = events.map(eventCard).join("");
  const emptyList = $("#emptyList");
  if (emptyList) emptyList.classList.toggle("hidden", events.length > 0);

  const noticeGrid = $("#noticeGrid");
  if (noticeGrid) noticeGrid.innerHTML = getEvents().map(noticeCard).join("");

  const totalCount = $("#totalCount");
  if (totalCount) totalCount.textContent = getEvents().length;
  const urgentCountValue = getEvents().filter((event) => daysLeft(event.deadline) >= 0 && daysLeft(event.deadline) <= 3).length;
  const urgentCount = $("#urgentCount");
  if (urgentCount) urgentCount.textContent = urgentCountValue;
  const urgentCountSide = $("#urgentCountSide");
  if (urgentCountSide) urgentCountSide.textContent = `${urgentCountValue}개`;
  const applicationCount = $("#applicationCount");
  if (applicationCount) applicationCount.textContent = applications.length;

  bindDynamicButtons();
}

function renderApplications() {
  const applicationList = $("#applicationList");
  if (applicationList) applicationList.innerHTML = applications.map(applicationCard).join("");
  const emptyApplications = $("#emptyApplications");
  if (emptyApplications) emptyApplications.classList.toggle("hidden", applications.length > 0);
  const applicationCount = $("#applicationCount");
  if (applicationCount) applicationCount.textContent = applications.length;
  bindDynamicButtons();
}

function renderApplyOptions() {
  const select = $("#applyEvent");
  if (!select) return;
  const events = getEvents();
  select.innerHTML = events.map((event) => {
    const unavailable = isClosedEvent(event) || hasApplied(event.id) || isCustomEvent(event.id);
    const suffix = isCustomEvent(event.id) ? " (내가 등록한 공고)" : isClosedEvent(event) ? " (마감)" : hasApplied(event.id) ? " (신청 완료)" : "";
    return `<option value="${event.id}" ${unavailable ? "disabled" : ""}>${event.title}${suffix}</option>`;
  }).join("");

  const storedId = localStorage.getItem(selectedEventKey);
  const storedEvent = events.find((event) => event.id === storedId && !isCustomEvent(event.id) && !isClosedEvent(event) && !hasApplied(event.id));
  const preferredEvent = storedEvent || events.find((event) => !isCustomEvent(event.id) && !isClosedEvent(event) && !hasApplied(event.id)) || events.find((event) => !isCustomEvent(event.id)) || events[0];
  if (preferredEvent) select.value = preferredEvent.id;
  updateApplyInfo();
}

function updateApplyInfo() {
  const applyEvent = $("#applyEvent");
  const applyDate = $("#applyDate");
  const applyVenue = $("#applyVenue");
  if (!applyEvent || !applyDate || !applyVenue) return;
  const fallbackEvent = getEvents().find((event) => !isClosedEvent(event) && !hasApplied(event.id)) || getEvents()[0];
  const selected = applyEvent.value || localStorage.getItem(selectedEventKey) || fallbackEvent?.id;
  const event = findEvent(selected) || fallbackEvent;
  if (!event) return;
  localStorage.setItem(selectedEventKey, event.id);
  applyDate.value = formatKoreanDate(event.date);
  applyVenue.value = event.venue;

  const status = $("#applyStatus");
  if (!status) return;
  if (isCustomEvent(event.id)) {
    status.textContent = "내가 등록한 공연 공고는 직접 신청할 수 없습니다.";
    status.className = "form-note danger";
  } else if (isClosedEvent(event)) {
    status.textContent = "이 공연은 모집이 마감되어 신청할 수 없습니다.";
    status.className = "form-note danger";
  } else if (hasApplied(event.id)) {
    status.textContent = "이미 신청한 공연입니다. 같은 공연은 중복 신청할 수 없습니다.";
    status.className = "form-note warning";
  } else {
    status.textContent = "신청 가능한 공연입니다. 이메일과 영상 링크는 선택 입력입니다.";
    status.className = "form-note success";
  }
}

function openDetail(eventId) {
  const event = findEvent(eventId);
  if (!event) {
    showToast("삭제되었거나 찾을 수 없는 공연 공고입니다.");
    return;
  }
  const badge = deadlineBadge(event);
  $("#modalTitle").textContent = event.title;
  $("#modalDesc").textContent = event.description;
  $("#modalBadge").textContent = badge.text;
  $("#modalBadge").className = `badge ${badge.className}`;
  setPosterElement($("#modalPoster"), event);
  $("#modalDetails").innerHTML = `
    <dt>공연 종류</dt><dd>${event.type}</dd>
    <dt>모집 분야</dt><dd>${formatCategories(event)}</dd>
    <dt>지역</dt><dd>${event.region}</dd>
    <dt>공연 날짜</dt><dd>${formatKoreanDate(event.date)}</dd>
    <dt>모집 마감</dt><dd>${formatKoreanDate(event.deadline)}</dd>
    <dt>장소</dt><dd>${event.venue}</dd>
    <dt>신청 조건</dt><dd>${event.requirements || "별도 신청 조건 없음"}</dd>
  `;
  const modalApply = $("#modalApply");
  modalApply.dataset.eventId = event.id;
  if (isCustomEvent(event.id)) {
    modalApply.classList.add("hidden");
    modalApply.disabled = true;
  } else {
    modalApply.classList.remove("hidden");
    modalApply.disabled = isClosedEvent(event) || hasApplied(event.id);
    modalApply.textContent = isClosedEvent(event) ? "모집 마감" : hasApplied(event.id) ? "이미 신청한 공연" : "이 공연 신청하기";
  }
  $("#modalBackdrop").classList.remove("hidden");
}

function closeDetail() {
  $("#modalBackdrop").classList.add("hidden");
}

function bindDynamicButtons() {
  $$('[data-detail]').forEach((button) => button.onclick = () => openDetail(button.dataset.detail));
  $$('[data-apply-now]').forEach((button) => button.onclick = () => {
    const event = findEvent(button.dataset.applyNow);
    if (!event) return showToast("삭제되었거나 찾을 수 없는 공연 공고입니다.");
    if (isClosedEvent(event)) return showToast("모집이 마감되어 신청할 수 없습니다.");
    if (hasApplied(event.id)) return showToast("이미 신청한 공연입니다. 중복 신청은 불가능합니다.");
    localStorage.setItem(selectedEventKey, event.id);
    renderApplyOptions();
    setActivePage("apply");
  });
  $$('[data-cancel-application]').forEach((button) => button.onclick = () => cancelApplication(button.dataset.cancelApplication));
  $$('[data-delete-event]').forEach((button) => button.onclick = () => deleteCustomEvent(button.dataset.deleteEvent));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function saveApplications() {
  localStorage.setItem(storageKey, JSON.stringify(applications));
}

function saveCustomEvents() {
  localStorage.setItem(customKey, JSON.stringify(customEvents));
}

function cancelApplication(applicationId) {
  const application = applications.find((item) => item.id === applicationId);
  if (!application) return;

  const event = findEvent(application.eventId);
  if (event && isClosedEvent(event)) {
    showToast("모집이 마감된 공연은 신청 취소가 잠겨 있습니다.");
    renderApplications();
    return;
  }

  const ok = window.confirm("이 공연 신청을 취소할까요?");
  if (!ok) return;

  applications = applications.filter((item) => item.id !== applicationId);
  saveApplications();
  renderApplications();
  renderEvents();
  renderApplyOptions();
  showToast("신청이 취소되었습니다.");
}

function deleteCustomEvent(eventId) {
  const event = findEvent(eventId);
  if (!event || !isCustomEvent(eventId)) {
    showToast("등록한 공연 공고만 삭제할 수 있습니다.");
    return;
  }

  const relatedApplications = applications.filter((application) => application.eventId === eventId).length;
  const message = relatedApplications > 0
    ? `“${event.title}” 공고를 삭제할까요? 관련 신청 내역 ${relatedApplications}건도 함께 정리됩니다.`
    : `“${event.title}” 공고를 삭제할까요?`;
  const ok = window.confirm(message);
  if (!ok) return;

  customEvents = customEvents.filter((item) => item.id !== eventId);
  applications = applications.filter((application) => application.eventId !== eventId);
  if (localStorage.getItem(selectedEventKey) === eventId) localStorage.removeItem(selectedEventKey);
  saveCustomEvents();
  saveApplications();
  renderEvents();
  renderApplications();
  renderApplyOptions();
  showToast(relatedApplications > 0 ? "공고와 관련 신청 내역이 삭제되었습니다." : "등록한 공연 공고가 삭제되었습니다.");
}

function updateOtherFieldInput() {
  const selectedField = $('input[name="field"]:checked')?.value;
  const wrapper = $("#otherFieldWrap");
  const input = $("#otherFieldInput");
  if (!wrapper || !input) return;

  const isOther = selectedField === "기타";
  wrapper.classList.toggle("hidden", !isOther);
  input.required = isOther;
  if (!isOther) input.value = "";
}

function getApplicationField(form) {
  const selectedField = String(form.get("field") || "").trim();
  const otherField = String(form.get("otherField") || "").trim();

  if (selectedField === "기타") {
    if (!otherField) {
      $("#otherFieldInput")?.focus();
      return "";
    }
    return `기타 · ${otherField}`;
  }

  return selectedField;
}

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("이미지를 읽지 못했습니다."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => resolve(reader.result);
      image.onload = () => {
        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }).catch(() => "");
}

function initForms() {
  const applyEvent = $("#applyEvent");
  if (applyEvent) applyEvent.addEventListener("change", updateApplyInfo);

  $$('input[name="field"]').forEach((input) => {
    input.addEventListener("change", updateOtherFieldInput);
  });
  updateOtherFieldInput();

  const applyForm = $("#applyForm");
  if (applyForm) {
    applyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const selectedEventId = form.get("eventId");
      const selectedEvent = findEvent(selectedEventId);

      if (!selectedEvent) {
        showToast("신청할 공연을 찾을 수 없습니다.");
        return;
      }
      if (isCustomEvent(selectedEvent.id)) {
        showToast("내가 등록한 공연 공고는 직접 신청할 수 없습니다.");
        goToPage("notice");
        return;
      }
      if (isClosedEvent(selectedEvent)) {
        showToast("모집이 마감되어 신청할 수 없습니다.");
        return;
      }
      if (hasApplied(selectedEventId)) {
        showToast("이미 신청한 공연입니다. 중복 신청은 불가능합니다.");
        goToPage("applications");
        return;
      }

      const applicationField = getApplicationField(form);
      if (!applicationField) {
        showToast("기타를 선택했다면 정확한 공연 종류를 입력해 주세요.");
        return;
      }

      const application = {
        id: `app-${globalThis.crypto?.randomUUID?.() || Date.now()}`,
        eventId: selectedEventId,
        team: form.get("team"),
        field: applicationField,
        leader: form.get("leader"),
        phone: form.get("phone"),
        email: form.get("email"),
        intro: form.get("intro"),
        video: form.get("video"),
        appliedAt: dateAfter(0),
        status: "접수 완료"
      };
      applications.unshift(application);
      saveApplications();
      renderApplications();
      renderEvents();
      event.currentTarget.reset();
      updateOtherFieldInput();
      renderApplyOptions();
      showToast("신청서가 제출되어 내 신청 내역에 추가되었습니다.");
      setTimeout(() => goToPage("applications"), 450);
    });

    applyForm.addEventListener("reset", () => {
      setTimeout(updateOtherFieldInput, 0);
    });
  }

  const registerForm = $("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const selectedCategories = form.getAll("categories").filter(Boolean);
      if (selectedCategories.length === 0) {
        showToast("모집 분야를 하나 이상 선택해 주세요.");
        return;
      }

      const newEvent = {
        id: `custom-${Date.now()}`,
        title: form.get("title"),
        school: form.get("venue").split(" ")[0] || "등록 기관",
        type: form.get("type"),
        region: form.get("region"),
        category: selectedCategories.join(", "),
        categories: selectedCategories,
        date: form.get("date"),
        deadline: form.get("deadline"),
        venue: form.get("venue"),
        poster: ["purple", "blue", "gold", "rose", "green"][customEvents.length % 5],
        image: uploadedPosterData,
        description: form.get("description"),
        requirements: form.get("requirements") || "별도 신청 조건 없음"
      };
      if (new Date(`${newEvent.deadline}T00:00:00`) > new Date(`${newEvent.date}T00:00:00`)) {
        showToast("모집 마감일은 공연 날짜보다 빠르거나 같아야 합니다.");
        return;
      }
      customEvents.unshift(newEvent);
      saveCustomEvents();
      event.currentTarget.reset();
      uploadedPosterData = "";
      const preview = $("#posterPreview");
      if (preview) {
        preview.removeAttribute("src");
        preview.classList.add("hidden");
      }
      renderEvents();
      renderApplyOptions();
      showToast("공연 공고가 등록되어 목록에 추가되었습니다.");
      setTimeout(() => goToPage("notice"), 450);
    });

    registerForm.addEventListener("reset", () => {
      uploadedPosterData = "";
      const preview = $("#posterPreview");
      if (preview) {
        preview.removeAttribute("src");
        preview.classList.add("hidden");
      }
    });
  }

  const posterInput = $("#posterInput");
  if (posterInput) {
    posterInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      const preview = $("#posterPreview");
      if (!file) {
        uploadedPosterData = "";
        if (preview) {
          preview.removeAttribute("src");
          preview.classList.add("hidden");
        }
        return;
      }

      uploadedPosterData = await resizeImageToDataUrl(file);
      if (preview) {
        preview.src = uploadedPosterData;
        preview.classList.remove("hidden");
      }
    });
  }
}

function initNavigation() {
  $$('[data-page]').forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.dataset.page;
      if (page) goToPage(page);
    });
  });

  ["#searchInput", "#categoryFilter", "#regionFilter"].forEach((selector) => {
    const element = $(selector);
    if (!element) return;
    element.addEventListener("input", renderEvents);
    element.addEventListener("change", renderEvents);
  });

  const modalClose = $("#modalClose");
  const modalCancel = $("#modalCancel");
  const modalBackdrop = $("#modalBackdrop");
  const modalApply = $("#modalApply");

  if (modalClose) modalClose.addEventListener("click", closeDetail);
  if (modalCancel) modalCancel.addEventListener("click", closeDetail);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (event) => {
      if (event.target.id === "modalBackdrop") closeDetail();
    });
  }
  if (modalApply) {
    modalApply.addEventListener("click", (event) => {
      const selectedEventId = event.currentTarget.dataset.eventId;
      const selectedEvent = findEvent(selectedEventId);
      if (!selectedEvent) return showToast("삭제되었거나 찾을 수 없는 공연 공고입니다.");
      if (isCustomEvent(selectedEvent.id)) return showToast("내가 등록한 공연 공고는 직접 신청할 수 없습니다.");
      if (isClosedEvent(selectedEvent)) return showToast("모집이 마감되어 신청할 수 없습니다.");
      if (hasApplied(selectedEventId)) return showToast("이미 신청한 공연입니다. 중복 신청은 불가능합니다.");
      localStorage.setItem(selectedEventKey, selectedEventId);
      closeDetail();
      renderApplyOptions();
      goToPage("apply");
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetail();
  });
}

function initDates() {
  const registerForm = $("#registerForm");
  if (!registerForm) return;
  registerForm.elements.date.value = dateAfter(14);
  registerForm.elements.deadline.value = dateAfter(7);
}

initNavigation();
initForms();
initDates();
renderApplyOptions();
renderEvents();
renderApplications();
