import axios from "axios";

export async function getAllUsers() {
  const { data } = await axios.get(`${process.env.BASE_URL}/users`);

  return data;
}

export async function getUserByID(id) {
  const { data } = await axios.get(`${process.env.BASE_URL}/users/${id}`);

  return data;
}

export async function createUserRequest(payload) {
  const { data } = await axios.post(`${process.env.BASE_URL}/users`, payload);

  return data;
}

export async function editUserRequest(id, payload) {
  const { data } = await axios.put(
    `${process.env.BASE_URL}/users/${id}`,
    payload
  );

  return data;
}
