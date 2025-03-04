import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

export const getDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error.response?.data || error.message);
      throw error;
    }
  };

// ✅ Fetch aid record by ID
export const getAidRecord = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/blockchain/aid/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error(`❌ Error fetching aid record [ID: ${id}]:`, error.response?.data || error.message);
        throw error;
    }
};

// ✅ Add new aid record via backend API
export const addAidRecord = async (recipient, aidType, amount) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(`${API_BASE_URL}/blockchain/aid`, 
            { recipient, aidType, amount }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Error adding aid record:", error.response?.data || error.message);
        throw error;
    }
};

