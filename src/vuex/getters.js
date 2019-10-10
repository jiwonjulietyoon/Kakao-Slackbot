export default {
  user: state => state.user,
  checkIfAdmin(state) {
    if (state.user) {
      if (state.user.email === "admin@admin.com") {
        return true;
      }
    }
    return false;
  },
  adminProfImg: state => state.adminProfImg,
  visitorProfImg: state => state.visitorProfImg,
  members: state => state.members,
  fullSizeImgDialog: state => state.fullSizeImgDialog,
  fullSizeImgURL: state => state.fullSizeImgURL,
};