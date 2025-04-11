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

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const userRepository = dataSource.getRepository(User);
    
    
    const currentUser = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ['friends']
    });
    
    
    const users = await userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query AND user.id != :currentUserId', {
        query: `%${query}%`,
        currentUserId: req.user.id
      })
      .getMany();
    
    
    const friendIds = currentUser.friends.map(friend => friend.id);
    const results = users.map(user => ({
      id: user.id,
      username: user.username,
      isFriend: friendIds.includes(user.id),
      isCurrentUser: user.id === req.user.id
    }));
    
    res.json(results);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error while searching users' });
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    const userRepository = dataSource.getRepository(User);
    
    
    const currentUser = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ['friends']
    });
    
    
    const friend = await userRepository.findOne({
      where: { id: friendId }
    });
    
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    
    const alreadyFriends = currentUser.friends.some(f => f.id === friend.id);
    if (alreadyFriends) {
      return res.status(400).json({ message: 'Already friends with this user' });
    }
    
    
    currentUser.friends.push(friend);
    await userRepository.save(currentUser);
    
    
    const friendUser = await userRepository.findOne({
      where: { id: friendId },
      relations: ['friends']
    });
    
    if (!friendUser.friends.some(f => f.id === currentUser.id)) {
      friendUser.friends.push(currentUser);
      await userRepository.save(friendUser);
    }
    
    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error('Error adding friend:', error);
    res.status(500).json({ message: 'Server error while adding friend' });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    const userRepository = dataSource.getRepository(User);
    
    
    const currentUser = await userRepository.findOne({
      where: { id: req.user.id },
      relations: ['friends']
    });
    
    
    currentUser.friends = currentUser.friends.filter(friend => friend.id !== parseInt(friendId));
    await userRepository.save(currentUser);
    
    
    const friendUser = await userRepository.findOne({
      where: { id: friendId },
      relations: ['friends']
    });
    
    if (friendUser) {
      friendUser.friends = friendUser.friends.filter(friend => friend.id !== req.user.id);
      await userRepository.save(friendUser);
    }
    
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ message: 'Server error while removing friend' });
  }
}; 