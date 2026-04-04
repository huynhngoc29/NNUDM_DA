import axios from "axios";

export const getRoles = async () =>
  await axios.get(`${process.env.REACT_APP_API}/roles`);

export const getRole = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/role/${slug}`);

export const createRole = async (role, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/role`, role, {
    headers: {
      authtoken,
    },
  });

export const updateRole = async (slug, role, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/role/${slug}`, role, {
    headers: {
      authtoken,
    },
  });

export const removeRole = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/role/${slug}`, {
    headers: {
      authtoken,
    },
  });
