const userInfo = {};
const followedUserInfo = [];

export function userInfoReducer (preState = userInfo, action) {
    const { type, data } = action;

    switch (type) {
    case 'update':
        return data;
    default:
        return preState;
    }
}

export function followedUserInfoReducer (preState = followedUserInfo, action) {
    const { type, data } = action;

    switch (type) {
    case 'update':
        return data;
    default:
        return preState;
    }
}
