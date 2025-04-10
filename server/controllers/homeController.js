const dataSource = require("../db/dataSource");
const User = require("../db/entities/User");

exports.authenticate = (req, res) => {
    res.status(200).json({
      user: {
        id: req.user.id,
        username: req.user.username,
    },
})};

exports.getUser = (req, res) => {
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
};

exports.getFriends = async (req, res) => {
  try {
    
    const userId = req.user.id;
    
    
    const userRepository = dataSource.getRepository(User);
    
    
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['friends']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    
    res.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Error fetching friends' });
  }
};
