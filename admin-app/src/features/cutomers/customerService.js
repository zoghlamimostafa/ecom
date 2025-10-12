import axios from "axios";
import { base_url } from "../../utils/baseUrl";
import { getConfig } from "../../utils/axiosConfig";

// Fonction pour récupérer tous les utilisateurs
const getUsers = async () => {
  const response = await axios.get(`${base_url}user/all-users`, getConfig());
  return response.data.users; // Correction: return response.data.users instead of response.data.data
};

// Fonction pour supprimer un utilisateur par son ID
const deleteUser = async (userId) => {
  const response = await axios.delete(`${base_url}user/delete-user/${userId}`, getConfig());
  return response.data;
};

// Fonction pour bloquer un utilisateur
const blockUser = async (userId) => {
  const response = await axios.put(`${base_url}user/block-user/${userId}`, {}, getConfig());
  return response.data;
};

// Fonction pour débloquer un utilisateur
const unblockUser = async (userId) => {
  const response = await axios.put(`${base_url}user/unblock-user/${userId}`, {}, getConfig());
  return response.data;
};

// Fonction pour modifier un utilisateur
const updateUser = async (userId, userData) => {
  const response = await axios.put(`${base_url}user/edit-user/${userId}`, userData, getConfig());
  return response.data;
};

const customerService = {
  getUsers,
  deleteUser,
  blockUser,
  unblockUser,
  updateUser,
};

export default customerService;
