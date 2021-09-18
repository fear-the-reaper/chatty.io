// keeping the track of the users and in which rooms they are in
// addingUsers, removingUsers, getUsers, and getUsersInRoom
const users = [];
const addingUsers = ({id, username, room}) => {
    // Clean the data:
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Validate the data:
    if (!username || !room) {
        return {
            error: "Username and room required!!!"
        };
    }
    // checking for existing user:
    const existingUser = users.find(user => user.room === room && user.username === username);
    if (existingUser) {
        return {
            error: `${username} already taken....try another one!`
        };
    }
    // store user:
    const user = {
        id,
        username,
        room
    };
    users.push(user);
    
    return user;
};
const removingUsers = id => {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return {
            error: `${id} is not in the rooom!!!!!!!`
        };
    }
    return users.splice(index, 1)[0];
};
const user1 = {
    id: `456`,
    username: `Nigga`,
    room: `Fathers Of FAST`
};
const user2 = {
    id: `457`,
    username: `Niggito`,
    room: `Fathers Of FAST`
};
// ================= CHALLENGE ============================
const getUser = id => users.find(user => user.id === id);
const getUsersInRoom = room => {
    // CAN USE FILTER AS IT'LL DO THIS WITHOUT THE HASSLE REMEMBER ALWAYS SEE MAP, REDUCE, FILTER!!!!!!
    return users.filter(user => user.room === room.trim().toLowerCase());
};
module.exports = {
    addingUsers,
    removingUsers,
    getUser,
    getUsersInRoom
};