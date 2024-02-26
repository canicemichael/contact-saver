async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Send login request to the server
  const response = await fetch("http://localhost:5003/login", {
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
