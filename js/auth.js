// ===== UI helpers =====
function showView(id) {
  document.querySelectorAll(".view").forEach((v) => (v.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

function showError(elId, msg) {
  const el = document.getElementById(elId);
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

// ===== Sign up =====
document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("signup-error", "");
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const shopName = document.getElementById("signup-shopname").value.trim();

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    showError("signup-error", error.message);
    return;
  }

  // Create a profile row for this user
  if (data.user) {
    const { error: profileError } = await supabaseClient.from("profiles").insert({
      id: data.user.id,
      shop_name: shopName || email.split("@")[0],
      about: "",
      paid: false,
    });
    if (profileError) {
      console.warn("Profile creation issue:", profileError.message);
    }
  }

  alert("✅ Account created! Please check your email to confirm, then log in.");
  showView("login-view");
});

// ===== Log in =====
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("login-error", "");
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    showError("login-error", error.message);
    return;
  }

  await loadAccount();
});

// ===== Forgot password =====
document.getElementById("forgot-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("forgot-error", "");
  const email = document.getElementById("forgot-email").value.trim();

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

  if (error) {
    showError("forgot-error", error.message);
    return;
  }
  alert("📧 Password reset link sent to your email.");
  showView("login-view");
});

// ===== Logout =====
document.getElementById("logout-btn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showView("login-view");
});

// ===== Save profile (shop name / about) =====
document.getElementById("save-profile-btn").addEventListener("click", async () => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return;

  const shopName = document.getElementById("account-shopname").value.trim();
  const about = document.getElementById("account-about").value.trim();

  const { error } = await supabaseClient
    .from("profiles")
    .update({ shop_name: shopName, about })
    .eq("id", user.id);

  if (error) {
    alert("Error saving: " + error.message);
  } else {
    alert("✅ Saved!");
  }
});

// ===== Load account info after login or on page refresh =====
async function loadAccount() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    showView("login-view");
    return;
  }

  document.getElementById("account-email").textContent = user.email;

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) {
    document.getElementById("account-shopname").value = profile.shop_name || "";
    document.getElementById("account-about").value = profile.about || "";
    document.getElementById("account-status").textContent = profile.paid
      ? "✅ Paid"
      : "Not paid yet";
  }

  showView("account-view");
}

// ===== View switch links =====
document.getElementById("go-signup").addEventListener("click", (e) => {
  e.preventDefault();
  showView("signup-view");
});
document.getElementById("go-login-from-signup").addEventListener("click", (e) => {
  e.preventDefault();
  showView("login-view");
});
document.getElementById("go-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showView("forgot-view");
});
document.getElementById("go-login-from-forgot").addEventListener("click", (e) => {
  e.preventDefault();
  showView("login-view");
});

// ===== On page load, check if already logged in =====
loadAccount();
