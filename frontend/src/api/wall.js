const apiBaseUrl = "http://localhost:3000/api/v1/walls";

function getTokenFromCookies() {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getHeaders() {
  const token = getTokenFromCookies();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createContribution(wallId, userId, content) {
  try {
    const response = await fetch(`${apiBaseUrl}/${wallId}/contributions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        contribution: {
          content,
          user_id: userId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create contribution");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function paintWall(wallId) {
  try {
    const response = await fetch(`${apiBaseUrl}/${wallId}/close`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to paint wall");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getWallById(wallId) {
  try {
    const response = await fetch(`${apiBaseUrl}/${wallId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get wall");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentlyOpenedWall() {
  try {
    const response = await fetch(`${apiBaseUrl}/current`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to get current wall");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
