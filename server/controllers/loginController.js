exports.login = (req, res) => {
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
    if (err) { 
      return res.status(500).json({ message: 'Logout failed', error: err.message }); 
    }
    req.session.destroy(function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session', error: err.message });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  });
};
