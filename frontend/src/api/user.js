const apiBaseUrl = "http://localhost:3000/api/v1/users";

export async function login(email, password) {
  try {
    const response = await fetch(`${apiBaseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/;`;
      return data;
    } else {
      throw new Error("Login failed");
    }

  } catch (error) {
    console.error(error);
  }
}

export async function register(name, email, password) {
  try {
    const response = await fetch(`${apiBaseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      document.cookie = `token=${data.token}; path=/;`;
      return data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error(error);
  }
}

// export async function logout() {}

export async function getUserData(token) {
  try {
    const response = await fetch(`${apiBaseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch user data");
    }
  } catch (error) {
    console.error(error);
  }
}
