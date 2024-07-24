const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

const getTimeOfDay = (date) => {
    const hours = date.getHours();
    if (hours < 12) {
        return 'Morning';
    }

    else if (hours < 18) {
        return 'Afternoon';
    }
    return 'Evening';
}

const getMonthOfYear = (date) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return months[date.getMonth()];

}

module.exports = { getDayOfWeek, getMonthOfYear, getTimeOfDay };