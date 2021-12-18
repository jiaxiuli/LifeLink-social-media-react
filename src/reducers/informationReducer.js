const userInfo = {};
const studentInfo = {};

export function userInfoReducer (preState = userInfo, action) {
    const { type, data } = action;

    switch (type) {
    case 'update':
        return data;
    default:
        return preState;
    }
}

export function studentInfoReducer (preState = studentInfo, action) {
    const { type, data } = action;

    switch (type) {
    case 'update':
        return data;
    default:
        return preState;
    }
}
