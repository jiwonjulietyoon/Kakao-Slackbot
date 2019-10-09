export default {
  user: state => state.user,
  checkIfAdmin(state) {
    // return true if current user is either 1. 관리자 or 2. 팀원; otherwise return false
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
};