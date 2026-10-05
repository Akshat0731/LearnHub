console.log("🟢 navbar.js loaded");

function initNavbar() {
  console.log("✅ Navbar initialized");

  const menuIcon = document.getElementById("menuIcon");
  const navbar = document.getElementById("navbar");
  const authLinks = document.getElementById("authLinks");
  const userSection = document.getElementById("userSection");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!menuIcon || !navbar) {
    console.error("❌ Navbar elements not found in DOM!");
    return;
  }

  // 🔸 Toggle for mobile
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("show");
    menuIcon.textContent = navbar.classList.contains("show") ? "✖" : "☰";
  });

  // 🔸 Check session
  fetch("/api/auth/session", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      console.log("Session check:", data);

      if (data.logged_in) {
        authLinks.style.display = "none";
        userSection.style.display = "flex";
        userName.textContent = data.name;

        // ✅ Dashboard redirect by role when clicking name
        userName.style.cursor = "pointer";
        userName.addEventListener("click", () => {
          if (data.role === "admin") {
            window.location.href = "/admin/dashboard";
          } else {
            window.location.href = "/student/dashboard";
          }
        });
      } else {
        authLinks.style.display = "flex";
        userSection.style.display = "none";
      }
    })
    .catch(err => console.error("❌ Session check error:", err));

  // 🔸 Logout functionality
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("/api/auth/logout", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        console.log("Logout:", data);
        if (data.status === "success") {
          authLinks.style.display = "flex";
          userSection.style.display = "none";
          window.location.href = "/login";
        }
      })
      .catch(err => console.error("❌ Logout error:", err));
  });
}