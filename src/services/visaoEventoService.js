import axios from "axios";

const API_URL = "http://localhost:8080";

export async function getVisaoDoShow(id) {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/visao-evento/show/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
