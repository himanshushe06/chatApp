import axiosInstance from "../api/axios";

export const getAllUsers = async () => {
    const { data } = await axiosInstance.get("/users");
    return data;
};

export const getAvailableUsers = async () => {
    const { data } = await axiosInstance.get("/users/available");
    return data;
};

export const getUserById = async (id) => {
    const { data } = await axiosInstance.get(`/users/${id}`);
    return data;
};

export const blockUser = async (blockedUserId) => {
    const { data } = await axiosInstance.patch("/users/block", {
        blockedUserId,
    });

    return data;
};

export const unblockUser = async (blockedUserId) => {
    const { data } = await axiosInstance.patch("/users/unblock", {
        blockedUserId,
    });

    return data;
};