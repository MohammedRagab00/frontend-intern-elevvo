document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar-container");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  const btnShowSidebar = document.querySelector(".navbar-sidebar-show-button");
  const btnHideSidebar = document.querySelector(".navbar-sidebar-hide-button");

  btnShowSidebar.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");
  });

  btnHideSidebar.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  });

  sidebarOverlay.addEventListener("click", function () {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  });
});
