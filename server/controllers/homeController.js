exports.authenticate = (req, res) => {
    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
    },
})};