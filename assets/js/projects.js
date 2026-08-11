// ===============================
// DOM Elements
// ===============================

const projectContainer = document.getElementById("projectContainer");
const pagination = document.getElementById("pagination");
const locationFilter = document.getElementById("locationFilter");
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
let selectedLocation = "All";
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
      <img src="${project.image}" alt="${project.title}">

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
          💰 ${project.projectValue}
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
function createPagination() {
  pagination.innerHTML = "";

  const totalPages = Math.ceil(filteredProjects.length / cardsPerPage);

  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "&larr;";
  prevBtn.disabled = currentPage === 1;

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayProjects();
      createPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  pagination.appendChild(prevBtn);

  const maxVisible = 5;

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  // First page
  if (start > 1) {
    pagination.appendChild(createPageButton(1));

    if (start > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  // Middle pages
  for (let i = start; i <= end; i++) {
    pagination.appendChild(createPageButton(i));
  }

  // Last page
  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }

    pagination.appendChild(createPageButton(totalPages));
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "&rarr;";
  nextBtn.disabled = currentPage === totalPages;

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayProjects();
      createPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  pagination.appendChild(nextBtn);
}

function createPageButton(page) {
  const btn = document.createElement("button");

  btn.textContent = page;

  if (page === currentPage) {
    btn.classList.add("active");
  }

  btn.addEventListener("click", () => {
    currentPage = page;
    displayProjects();
    createPagination();
    window.scrollTo({ top: 500, behavior: "smooth" });
  });

  return btn;
}

// ===============================
// Reset Filters
// ===============================

function resetFilters() {
  selectedCategory = "All";
  selectedLocation = "All";
  selectedStatus = "All";
  searchText = "";

  locationFilter.value = "All";
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
      selectedCategory === "All" || project.projectType === selectedCategory;

    const locationMatch =
      selectedLocation === "All" || project.city === selectedLocation;

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
    return categoryMatch && locationMatch && statusMatch && searchMatch;
  });

  // Sorting
  // if (selectedSort === "Latest") {
  //   filteredProjects.sort((a, b) => b.year - a.year);
  // } else if (selectedSort === "Oldest") {
  //   filteredProjects.sort((a, b) => a.year - b.year);
  // } else {
  //   filteredProjects = filteredProjects.filter(
  //     (project) => project.year == selectedSort,
  //   );
  // }

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

// Location
locationFilter.addEventListener("change", function () {
  selectedLocation = this.value;
  if (selectedLocation === "All") {
    resetFilters();
  }
  applyFilters();
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
