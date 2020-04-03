let allUsers = [];
let allGroups = [];
let allRights = [];
let authenticatedUser;

const remove = (array, item) => array.filter(elem => item != elem);

const mustContain = (array, item) => {
    if (array.include(item))
        throw new Error();
}

const users = () => allUsers;

const groups = () => allGroups;

const rights = () => allRights;

const createUser = (username, password) => allUsers[allUsers.push({ username: username, password: password, groups: [] }) - 1];


const createGroup = () => allGroups[allGroups.push({ rights: [] }) - 1];

const createRight = () => allRights[allRights.push({}) - 1];

const deleteUser = user => {
    mustContain(allUsers, user);
    allUsers = remove(allUsers, user);
}

const deleteGroup = group => {
    mustContain(allGroups, group);
    allGroups = remove(allGroups, group);

    allUsers.forEach(user => user.groups = remove(user.groups, group));
}

const deleteRight = right => {
    mustContain(allRights, right);
    allRights = remove(allRights, right);
    allGroups.forEach(group => group.rights = remove(group.rights, right));
}

const addRightToGroup = (right, group) => {
    mustContain(allGroups, group);
    mustContain(allRights, right);
    group.rights.push(right);
}

const addUserToGroup = (user, group) => {
    mustContain(allGroups, group);
    mustContain(allUsers, user);
    user.groups.push(group);
}

const userGroups = user => {
    mustContain(allUsers, user);
    return user.groups;
}

const groupRights = group => {
    mustContain(allGroups, group);
    return group.rights;
}

const removeRightFromGroup = (right, group) => {
    mustContain(allGroups, group);
    mustContain(allRights, right);
    mustContain(group.rights, right);
    group.rights = remove(group.rights, right);
}

const removeUserFromGroup = (user, group) => {
    mustContain(allGroups, group);
    mustContain(allUsers, user);
    mustContain(user.groups, group);
    user.groups = remove(user.groups, group);
}

const login = (username, password) => {
    if (authenticatedUser) {
        return false;
    }

    let user = allUsers.find(user => {
        return user.username === username && user.password === password;
    });

    if (user) {
        authenticatedUser = user;
        return true;
    }
    return false;
}

const logout = () => authenticatedUser = undefined;


const currentUser = () => authenticatedUser;

const isAuthorized = (user, right) => {
    mustContain(allRights, right);
    mustContain(allUsers, user);

    return user.groups.reduce((result, group) => {
        return result.concat(group.rights);
    }, []).indexOf(right) !== -1;
}