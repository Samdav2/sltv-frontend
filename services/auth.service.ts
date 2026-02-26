import api from "@/lib/api";

export const authService = {
    verifyEmail: async (token: string) => {
        const response = await api.post(`/auth/verify-email?token=${token}`);
        return response.data;
    },
};
