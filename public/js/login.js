async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Send login request to the server
  const response = await fetch("https://contact-saver-bfxb.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();

    // Store the token in local storage
    localStorage.setItem("token", data.token);

    // Redirect or perform other actions as needed
    console.log("Login successful");
  } else {
    console.error("Login failed");
  }
}

document.getElementById("homeHome").addEventListener("click", function() {
  // Redirect to another page
  window.location.href = "https://contact-saver-bfxb.onrender.com";
});

document.getElementById("homeLogin").addEventListener("click", function() {
  // Redirect to another page
  window.location.href = "https://contact-saver-bfxb.onrender.com/login";
});

document.getElementById("homeSignup").addEventListener("click", function() {
  // Redirect to another page
  window.location.href = "https://contact-saver-bfxb.onrender.com/register";
});