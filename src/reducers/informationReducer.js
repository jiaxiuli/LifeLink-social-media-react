const defaultData = {
    userInfo: {},
    followedUserInfo: [],
    catagoryInfo: []
};

export default function infoReducer (preState = defaultData, action) {
    const { type, data } = action;
    switch (type) {
    case 'update_userInfo':
        preState.userInfo = { ...data };
        return preState;

    case 'update_followedUserInfo':
        preState.followedUserInfo = [...data];
        return preState;

    case 'update_catagoryInfo':
        preState.catagoryInfo = [...data];
        return preState;
    default:
        return preState;
    }
}
