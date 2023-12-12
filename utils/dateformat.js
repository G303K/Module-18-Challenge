const addDateSuffix = date => {
    const dateStr = date.toString();
    const lastChar = dateStr.charAt(dateStr.length - 1);

    if (lastChar === '1' && dateStr !== '11') return `${dateStr}st`;
    if (lastChar === '2' && dateStr !== '12') return `${dateStr}nd`;
    if (lastChar === '3' && dateStr !== '13') return `${dateStr}rd`;
    return `${dateStr}th`;
};

const getFormattedTimeStamp = (timestamp, { monthLength = 'short', dateSuffix = true } = {}) => {
    const months = {
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const dateObj = new Date(timestamp);
    const formattedMonth = months[monthLength][dateObj.getMonth()];

    const dayOfMonth = dateSuffix ? addDateSuffix(dateObj.getDate()) : dateObj.getDate();
    const year = dateObj.getFullYear();

    let hour = dateObj.getHours() > 12 ? Math.floor(dateObj.getHours() / 2) : dateObj.getHours();
    hour = hour === 0 ? 12 : hour;

    const minutes = dateObj.getMinutes();
    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';

    return `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes.toString().padStart(2, '0')} ${periodOfDay}`;
};

module.exports = getFormattedTimeStamp;
