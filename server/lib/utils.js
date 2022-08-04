module.exports = {
    validYear(str) {
        if(!/^2\d{3}$/.test(str)) {
            return false;
        }
        const year = new Date().getFullYear();
        const min = year - 4; // Minimum year
        const value = parseInt(str, 10);

        return (value >= min && value <= year);
    },
    validValue(str, type = 'month') {
        if(!/^\d{1,2}$/.test(str)) {
            return false;
        }
        const value = parseInt(str, 10);
        let valid = true;
        switch (type) {
            case 'month':
                if(value < 0 || value > 11) {
                    valid = false;
                }
                break;
            case 'day':
                if(value < 1 || value > 31) {
                    valid = false;
                }
                break;
            default:
                break;
        }

        return valid;
    }
}   