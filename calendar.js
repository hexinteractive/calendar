
if (typeof calendar === 'undefined' || !calendar) {

var calendar = (function() {


        var today = new Date();
        var months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var thisMonth = months[today.getMonth()];

        getDayMarkup = function(i) {
            var theDay = new Date();
                theDay.setDate(today.getDate() + i);
            var dayClass = (days[theDay.getDay()]).toLowerCase();
            var todayClass = (i === 0) ? 'current' : '';
            var dayMarkup = [
           ' <li class="day ' + dayClass + ' ' + todayClass + '">',
           '     <time datetime="' + theDay.toDateString() + '">',
           '         <span class="name">'+ days[theDay.getDay()] +'</span>',
           '         <span class="date">' + theDay.getDate() + '</span>',
           '     </time>',
           '     <ol class="events">',
           '         <li class="add">+</li>',
           '     </ol>',
           ' </li>'
            ];
            return dayMarkup.join('');
        };


        $('h1').text(thisMonth);

        var allTheDays = '';
        for(var i=-2; i<14; i++) {
            allTheDays += getDayMarkup(i);
        }

        $('.calendar .month > ol').html(allTheDays);
        // console.log(allTheDays);


})();
}
