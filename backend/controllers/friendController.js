const User = require('../models/user');


exports.getAllFriends = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const friendlist = await User.findById(userId);
        if (!friendlist) {
            return res.status(404).json({ error: 'No friend list found for this user' });
        }
        const friends = friendlist.friends;
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllFriendRequests = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const friendlist = await User.findById(userId);
        if (!friendlist) {
            return res.status(404).json({ error: 'No friend list found for this user' });
        }
        const friendRequests = friendlist.friendRequests;
        res.status(200).json(friendRequests);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addFriend = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { friendUsername } = req.body;
        console.log(`Adding friend: ${friendUsername} to user: ${userId}`);

        let user = await User.findById(userId);
        console.log(`User:`, user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friend = await User.findOne({ username: friendUsername });
        console.log(`Found friend:`, friend);

        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        const existingRequest = friend.friendRequests.find(request => request.username === user.username);
        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        friend.friendRequests.push({ username: user.username, accepted: false });
        await friend.save();
        res.status(200).json({ message: 'Friend request sent successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log('Error:', error);
    }
};

exports.deleteFriend = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { friendUsername } = req.body;
        console.log(`Deleting friend request from: ${friendUsername} for user: ${userId}`);

        let user = await User.findById(userId);
        console.log(`User:`, user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friendRequestIndex = user.friendRequests.findIndex(request => request.username === friendUsername);
        if (friendRequestIndex === -1) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        user.friendRequests.splice(friendRequestIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Friend request deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log('Error:', error);
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { friendUsername } = req.body;
        console.log(`Accepting friend request from: ${friendUsername} for user: ${userId}`);

        let user = await User.findById(userId);
        console.log(`User:`, user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friendRequest = user.friendRequests.find(request => request.username === friendUsername);
        if (!friendRequest) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        if (friendRequest.accepted) {
            return res.status(400).json({ error: 'Friend request already accepted' });
        }

        friendRequest.accepted = true;
        user.friends.push(friendUsername);
        await user.save();

        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        const existingFriendRequest = friend.friendRequests.find(request => request.username === user.username);
        if (existingFriendRequest) {
            existingFriendRequest.accepted = true;
        }

        friend.friends.push(user.username);
        await friend.save();

        res.status(200).json({ message: 'Friend request accepted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log('Error:', error);
    }
};

exports.refuseFriend = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { friendUsername } = req.body;
        console.log(`Removing friend request from: ${friendUsername} for user: ${userId}`);

        let user = await User.findById(userId);
        console.log(`User:`, user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const friendRequestIndex = user.friendRequests.findIndex(request => request.username === friendUsername);
        if (friendRequestIndex === -1) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        if (user.friendRequests[friendRequestIndex].refused) {
            return res.status(400).json({ error: 'Friend request already refused' });
        }

        user.friendRequests.splice(friendRequestIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Friend request removed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.log('Error:', error);
    }
};