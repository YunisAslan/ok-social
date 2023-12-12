import axios from "axios";

const BASE_URL = "https://656e3ec6bcc5618d3c24b6a6.mockapi.io";

export async function getAllUsers() {
  const { data } = await axios.get(`${BASE_URL}/users`);

  return data;
}

export async function getUserByID(id) {
  const { data } = await axios.get(`${BASE_URL}/users/${id}`);

  return data;
}

export async function createUserRequest(payload) {
  const { data } = await axios.post(`${BASE_URL}/users`, payload);

  return data;
}

export async function editUserRequest(id, payload) {
  const { data } = await axios.put(`${BASE_URL}/users/${id}`, payload);

  return data;
}
