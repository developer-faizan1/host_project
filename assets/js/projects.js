// ===============================
// DOM Elements
// ===============================

const projectContainer = document.getElementById("projectContainer");
const pagination = document.getElementById("pagination");
const categoryButtons = document.querySelectorAll(".category");
const statusFilter = document.getElementById("statusFilter");
let selectedSort = "Latest";
const searchInput = document.getElementById("searchInput");
let searchTimeout;

// ===============================
// State Variables
// ===============================
let searchText = "";
let selectedCategory = "All";
let selectedStatus = "All";
let projects = [];
let filteredProjects = [];
const cardsPerPage = 6;
let currentPage = 1;

// ===============================
// Fetch Data
// ===============================
fetch("./assets/js/projectsData.json")
  .then((res) => res.json())
  .then((data) => {
    projects = data;
    filteredProjects = [...projects];
    displayProjects();
    createPagination();
  });

// ===============================
// Rendering Functions
// ===============================

function displayProjects() {
  projectContainer.innerHTML = "";

  // If no projects found
  if (filteredProjects.length === 0) {
    projectContainer.innerHTML = `
      <div class="no-projects">
        <svg xmlns="http://www.w3.org/2000/svg"
             width="70"
             height="70"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <h3>No Projects Found</h3>

        <p>
          We couldn't find any projects matching your search or selected filters.
        </p>
      </div>
    `;

    pagination.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * cardsPerPage;
  const end = start + cardsPerPage;

  const pageProjects = filteredProjects.slice(start, end);

  pageProjects.forEach((project) => {
    const card = document.createElement("div");

    card.className = "project-card";

    const statusClass =
      {
        Completed: "completed",
        "Under Construction": "under",
        Upcoming: "upcoming",
      }[project.status] || "";

    card.innerHTML = `
    <div class="project-image">
      <img src="${project.image}" alt="${project.title} loading="lazy"">

      <span class="status ${statusClass}">
        ${project.status}
      </span>
    </div>

    <div class="project-content">
      <div>
        <h4 class="project-number">
          Project - ${project.projectNumber}
        </h4>

        <h3>${project.title}</h3>

        <div class="meta">
          📍 ${project.city}, ${project.state}
        </div>

        <div class="meta">
          🏗 ${project.projectType}
        </div>

        <div class="meta">
           ${project.projectValue}
        </div>

        <a
          href="project-details.html?id=${project.id}"
          class="link"
        >
          View Project Details →
        </a>
      </div>
    </div>
  `;

    projectContainer.appendChild(card);
  });
}

// ================================
// PAGINATION - ARROWS + PAGE INPUT
// ================================
function createPagination() {
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredProjects.length / cardsPerPage);

  // Hide pagination if only one page
  if (totalPages <= 1) {
    pagination.style.display = "none";
    return;
  }

  pagination.style.display = "flex";

  // ================================
  // PREVIOUS BUTTON
  // ================================
  const prevBtn = document.createElement("button");

  prevBtn.className = "pagination-arrow";
  prevBtn.innerHTML = `
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
`;
  prevBtn.disabled = currentPage === 1;
  prevBtn.setAttribute("aria-label", "Previous page");

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;

      displayProjects();
      createPagination();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });

  pagination.appendChild(prevBtn);

  // ================================
  // PAGE INPUT
  // ================================
  const pageWrapper = document.createElement("div");
  pageWrapper.className = "page-jump";

  const pageInput = document.createElement("input");

  pageInput.type = "number";
  pageInput.min = 1;
  pageInput.max = totalPages;
  pageInput.value = currentPage;
  pageInput.className = "page-input";
  pageInput.setAttribute("aria-label", "Jump to page");

  const pageTotal = document.createElement("span");

  pageTotal.className = "page-total";
  pageTotal.textContent = `/ ${totalPages}`;

  pageWrapper.appendChild(pageInput);
  pageWrapper.appendChild(pageTotal);

  pagination.appendChild(pageWrapper);

  // ================================
  // JUMP TO PAGE
  // ================================
  function jumpToPage() {
    let page = parseInt(pageInput.value);

    // If invalid
    if (isNaN(page)) {
      pageInput.value = currentPage;
      return;
    }

    // Keep page within range
    page = Math.max(1, Math.min(page, totalPages));

    currentPage = page;

    displayProjects();
    createPagination();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      jumpToPage();
    }
  });

  pageInput.addEventListener("change", jumpToPage);

  // ================================
  // NEXT BUTTON
  // ================================
  const nextBtn = document.createElement("button");

  nextBtn.className = "pagination-arrow";
  nextBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
`;
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.setAttribute("aria-label", "Next page");

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;

      displayProjects();
      createPagination();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });

  pagination.appendChild(nextBtn);
}

// ================================
// PAGE BUTTON
// ================================
function createPageButton(page) {
  const btn = document.createElement("button");

  btn.className = "pagination-page";
  btn.textContent = page;

  if (page === currentPage) {
    btn.classList.add("active");
    btn.setAttribute("aria-current", "page");
  }

  btn.addEventListener("click", () => {
    if (page === currentPage) return;

    currentPage = page;

    displayProjects();
    createPagination();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  return btn;
}

// ===============================
// Reset Filters
// ===============================

function resetFilters() {
  selectedCategory = "All";
  selectedStatus = "All";
  searchText = "";

  statusFilter.value = "All";
  searchInput.value = "";

  categoryButtons.forEach((btn) => btn.classList.remove("active"));
  document.querySelector('[data-category="All"]').classList.add("active");
}

// ===============================
// Filter & Sort Logic
// ===============================

function applyFilters() {
  filteredProjects = projects.filter((project) => {
    const categoryMatch =
      selectedCategory === "All" ||
      project.projectType === selectedCategory ||
      (project.projectType === "Commercial & Residential" &&
        ["Commercial", "Residential"].includes(selectedCategory));

    const statusMatch =
      selectedStatus === "All" || project.status === selectedStatus;

    // Search
    const searchableText = `
        ${project.projectNumber}
        ${project.title}
        ${project.projectLocation}
        ${project.projectType}
        ${project.client}
        ${project.consultant}
        ${project.city}
        ${project.state}
        ${project.country}
        ${project.status}
        `.toLowerCase();

    const searchMatch =
      searchText === "" || searchableText.includes(searchText);
    return categoryMatch && statusMatch && searchMatch;
  });

  currentPage = 1;

  displayProjects();
  createPagination();
}

// ===============================
// Event Listeners
// ===============================

// Category
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    selectedCategory = button.dataset.category;

    if (selectedCategory === "All") {
      resetFilters();
    }

    applyFilters();
  });
});

// Status
statusFilter.addEventListener("change", function () {
  selectedStatus = this.value;
  if (selectedStatus === "All") {
    resetFilters();
  }
  applyFilters();
});

// Search project by name, location, category, status
searchInput.addEventListener("input", function () {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchText = this.value.trim().toLowerCase();
    applyFilters();
  }, 300);
});
