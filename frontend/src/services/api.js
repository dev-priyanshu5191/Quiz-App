const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

const getErrorMessage = (status, body) => {
  if (!body) {
    if (status >= 500) return "Backend server error. Please try again.";
    return "Unable to complete the request.";
  }

  if (status === 401) return body.msg || "Please log in again.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return body.msg || "This account already exists.";
  if (status >= 500) return "Backend server error. Please try again.";
  return body.msg || body.errors?.[0]?.msg || "Unable to complete the request.";
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error("Backend server is not running. Start it on http://localhost:5000.");
  }
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    throw new Error(getErrorMessage(response.status, body));
  }
  return body;
};

const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
};

export default api;