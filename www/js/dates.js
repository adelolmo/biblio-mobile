var dates = {
    parseUnixDate: function (date) {

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var formattedDay = day + ' ' + month + ' ' + year;

        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2);
        return formattedDay + ' ' + formattedTime;
    }
};