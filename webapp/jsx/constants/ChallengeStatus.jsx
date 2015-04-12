var keyMirror = require('keymirror');

module.exports = keyMirror({
    PENDING: null,
    NEEDS_NOTIFY: null,
    ACCEPTED: null,
    REQUESTED: null,
    CANCELLED: null
});
