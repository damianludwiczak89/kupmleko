import {create} from 'zustand';
import i18n from '../i18n';

export const useAuthStore = create((set, get ) => ({
    allUserData: null,

    user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
    }),

    setUser: (user) => set({
        allUserData: user,
    }),


    isLoggedIn: () => get().allUserData !== null,

    setLanguage: (language) => {
        i18n.locale = language;
        set({ language });
  },
}));


export const useRefreshStore = create(set => ({
    shoppingListsToken: 0,
    draftsToken: 0,
    friendsToken: 0,
    invitesToken: 0,
    historyToken: 0,
    triggerShoppingListsRefresh: () =>
      set(state => ({ shoppingListsToken: state.shoppingListsToken + 1 })),
    triggerDraftsRefresh: () =>
        set(state => ({ draftsToken: state.draftsToken + 1 })),
    triggerFriendsRefresh: () =>
        set(state => ({ friendsToken: state.friendsToken + 1 })),
    triggerInvitesRefresh: () =>
        set(state => ({ invitesToken: state.invitesToken + 1 })),
    triggerHistoryRefresh: () =>
        set(state => ({ historyToken: state.historyToken + 1 })),
  }));