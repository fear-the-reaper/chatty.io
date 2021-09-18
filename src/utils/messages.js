genMsg = (msg) => {
    return {
        msg,
        createdAt: new Date().getTime()
    }
};
module.exports = {
    genMsg
};

