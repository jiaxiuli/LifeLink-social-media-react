const userInfo = {};

export function userInfoReducer (preState = userInfo, action) {
    const { type, data } = action;

    switch (type) {
    case 'update':
        return data;
    default:
        return preState;
    }
}
