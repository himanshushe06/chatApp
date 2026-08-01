import api from "../api/axios.js";

export const sendOTP = async (email) => {
    const { data } = await api.post(
        "/otp/send-otp",
        { email }
    );

    return data;
};

export const verifyOTP = async ( email,otp ) => {
    const { data } = await api.post(
        "/otp/verify-otp",
        {
            email,
            otp,
        }
    );

    return data;
};