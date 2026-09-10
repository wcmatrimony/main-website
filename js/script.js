const supabaseUrl = "https://ziceiwtxuunwzpvmslki.supabase.co";
const supabaseKey = "sb_publishable_rlkl8BDgVGN0meYPSezyPA_DspoM2Eh";

const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ---------- Sample data (replace with API calls to your backend) ----------
const profiles = [
  { id: 1, name: "Ananya Rao",      age: 27, gender: "F", city: "Bengaluru", profession: "Software Engineer", community: "Hindu" },
  { id: 2, name: "Rohan Mehta",     age: 30, gender: "M", city: "Mumbai",    profession: "Chartered Accountant", community: "Hindu" },
  { id: 3, name: "Fatima Sheikh",   age: 29, gender: "F", city: "Hyderabad", profession: "Doctor", community: "Muslim" },
  { id: 4, name: "Sarah Thomas",    age: 31, gender: "F", city: "Kochi",     profession: "Lawyer", community: "Christian" },
  { id: 5, name: "Jaspreet Singh",  age: 28, gender: "M", city: "Delhi",     profession: "Entrepreneur", community: "Sikh" },
  { id: 6, name: "Arjun Nair",      age: 32, gender: "M", city: "Chennai",   profession: "Architect", community: "Hindu" },
];

const avatarColors = ["#5C1A34", "#C89B3C", "#C6555A", "#7A2A46", "#B98A2E", "#8C3A50"];
const shortlisted = new Set();

const grid = document.getElementById("profiles-grid");
const resultsNote = document.getElementById("results-note");
const shortlistNum = document.getElementById("shortlist-num");

function initials(name) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function renderProfiles(list) {
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p class="no-results">No profiles match those filters yet. Try widening your search.</p>`;
    resultsNote.textContent = "0 profiles found";
    return;
  }

  resultsNote.textContent = list === profiles
    ? "Showing all profiles"
    : `${list.length} profile${list.length === 1 ? "" : "s"} found`;

  list.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "profile-card";

    const isShortlisted = shortlisted.has(p.id);
    const color = avatarColors[i % avatarColors.length];

    card.innerHTML = `
      <div class="card-top">
        <div class="avatar" style="background:${color}" role="img" aria-label="${p.name} avatar">${initials(p.name)}</div>
        <div>
          <div class="card-name">${p.name}, ${p.age}</div>
          <div class="card-sub">${p.city}</div>
        </div>
      </div>
      <div class="card-meta">
        <span>${p.profession}</span>
        <span>&middot;</span>
        <span>${p.community}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-outline" type="button">View profile</button>
        <button class="heart-btn" type="button" aria-pressed="${isShortlisted}" aria-label="Shortlist ${p.name}" data-id="${p.id}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="${isShortlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 20.5s-7.5-4.6-10-9.2C.6 8 2 4.5 5.4 3.6c2.1-.5 4.2.4 5.6 2.3 1.4-1.9 3.5-2.8 5.6-2.3C20 4.5 21.4 8 20 11.3c-2.5 4.6-10 9.2-10 9.2z"/>
          </svg>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll(".heart-btn").forEach(btn => {
    btn.addEventListener("click", () => toggleShortlist(btn));
  });
}

function toggleShortlist(btn) {
  const id = Number(btn.dataset.id);
  const nowActive = !shortlisted.has(id);

  if (nowActive) {
    shortlisted.add(id);
  } else {
    shortlisted.delete(id);
  }

  btn.setAttribute("aria-pressed", String(nowActive));
  const path = btn.querySelector("path");
  path.setAttribute("fill", nowActive ? "currentColor" : "none");
  shortlistNum.textContent = shortlisted.size;
}

// ---------- Search / filter ----------
const form = document.getElementById("search-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const lookingFor = data.get("lookingFor");
  const ageFrom = Number(data.get("ageFrom")) || 0;
  const ageTo = Number(data.get("ageTo")) || 200;
  const community = data.get("community");
  const location = (data.get("location") || "").trim().toLowerCase();

  const filtered = profiles.filter(p => {
    if (lookingFor !== "any" && p.gender !== lookingFor) return false;
    if (p.age < ageFrom || p.age > ageTo) return false;
    if (community !== "any" && p.community !== community) return false;
    if (location && !p.city.toLowerCase().includes(location)) return false;
    return true;
  });

  renderProfiles(filtered);
  document.getElementById("browse").scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- Mobile nav ----------
const navToggle = document.getElementById("nav-toggle");
const header = document.querySelector(".site-header");

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// ---------- Init ----------
renderProfiles(profiles);
