var moment = require('moment');

/**
 * Figure out the next challenge day (which is Sunday)
 */
function getNextChallengeDay() {
    for (var i = 0; i < 8 ; i++ ) {
        var day = moment().add(i,'days');
        if (day.weekday() == 0) {
            return day.format('YYYY-MM-DD')
        }
    }
    console.error('Could not find next challenge date');
}

module.exports = {nextChallengeDate: getNextChallengeDay};
