import { API_BASE_URL } from "../config";

export const apiService = {
  async get(endpoint, token = null) {
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    });
    return handleResponse(response);
  },

  async post(endpoint, data, token = null) {
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Aggiungi altri metodi (PUT, DELETE, ecc.) secondo necessità
};

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Errore nella risposta del server");
  }
  return response.json();
}
