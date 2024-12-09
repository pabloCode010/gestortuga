function renderView(view) {
  return (req, res) => res.render(view);
}

function renderViewAdmin(req, res) {
  const user = req.user;
  res.render("admin", { user });
}

module.exports = {
  renderView,
  renderViewAdmin,
};
