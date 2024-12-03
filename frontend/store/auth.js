import {create} from 'zustand';

const useAuthStore = create((set, get ) => ({
    allUserData: null,
    loading: false,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),

    setUser: (user) => set({
        allUserData: user,
    }),

    setLoading: (loading) => set({loading}),

    isLoggedIn: () => get().allUserData !== null,
}));


export {useAuthStore};