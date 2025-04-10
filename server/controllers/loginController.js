exports.login = (req, res) => {
    console.log("Endpoint reached");
    res.status(200).json({
      message: "Login successful",
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  };

exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logged out successfully' });
})};