export default {
  setUser({ commit }, payload) {
    commit("setUser", {
      id: payload.user.uid,
      email: payload.user.email
    });
  },
  setUserAutoSignin({commit}, payload) {
    commit("setUser", {
      id: payload.uid,
      email: payload.email
    })
  },
  setUserNull({commit}, payload) {
    commit("setUser", null);
  },
  setFullSizeImgDialog({commit}, payload) {
    commit("setFullSizeImgDialog", payload);
  },
  setFullSizeImgURL({commit}, payload) {
    commit("setFullSizeImgURL", payload);
  },
}