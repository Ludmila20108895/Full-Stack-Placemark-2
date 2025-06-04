export const dashboardController = {
  async index(_request, h) {
    return h.view("dashboard", { title: "Explorer Dashboard" });
  },
};
