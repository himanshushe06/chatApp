import api from "../api/axios.js";

export const sendOTP = async (formData) => {
    const { data } = await api.post("/otp/send-otp", formData);
    return data;
};

export const verifyOTP = async (email, otp) => {
    const { data } = await api.post("/otp/verify-otp", {
        email,
        otp,
    });

    return data;
};