

        var clientId = '806463035830.apps.googleusercontent.com';
        var apiKey = 'AIzaSyA_mP6FkPTbUMM2bHgqBAOfrWIZRQH9acs';
        var scopes = 'https://www.googleapis.com/auth/calendar';
        //---
        function handleClientLoad() {
          gapi.client.setApiKey(apiKey);
          window.setTimeout(checkAuth,1);
          // checkAuth(); // I dont know why he had this one in there too, but it was doing everything twice
        }

        function checkAuth() {
          gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true},
              handleAuthResult);
        }

        function handleAuthResult(authResult) {
          var authorizeButton = document.getElementById('authorize-button');
          if (authResult) {
            authorizeButton.style.visibility = 'hidden';
            makeApiCall();
          } else {
            authorizeButton.style.visibility = '';
            authorizeButton.onclick = handleAuthClick;
           }
        }

        function handleAuthClick(event) {
          gapi.auth.authorize(
              {client_id: clientId, scope: scopes, immediate: false},
              handleAuthResult);
          return false;
        }








        // ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== ====== ======






        var now = new Date();

        console.log('now: ', dateUtility.formateDateTimeString( new Date() ) );
        console.log('now - 7 days: ', dateUtility.formateDateTimeString( new Date().setDate( now.getDate() - 7 ) ) );

        function makeApiCall() {
          gapi.client.load('calendar', 'v3', function() {
            var request = gapi.client.calendar.events.list({
              // 'calendarId': 'primary'
                // 'calendarId': 'usa__en@holiday.calendar.google.com',
                'calendarId': 'rnalnb0ke7oip14ph8gjdfp6k4@group.calendar.google.com', /* chores cal */
                'singleEvents': true,/* required to use timeMin */
                // 'timeMin': '2013-02-01T11:43:22.000Z',
                'timeMin': dateUtility.formateDateTimeString(new Date().setDate(now.getDate()-7)),
                'timeMax': dateUtility.formateDateTimeString(new Date().setDate(now.getDate()+21)),
                'orderBy': 'startTime'
            });

            request.execute(function(resp) {
                console.log('execute called');
              for (var i = 0; i < resp.items.length; i++) {
                var li = document.createElement('li');
                var item = resp.items[i];
                var classes = [];
                var allDay = item.start.date? true : false;

                // if(allDay) {
                    // var firstDay = new Date(item.start.date);
                    // var lastDay = new Date(item.endate.date);
                    // i dont have any multi-day chores.
                    // var d=new Date("July 21, 1983 01:15:00");
                    // var x=document.getElementById("demo");
                    // date.setDate(date.getDate()+11);
                    // x.innerHTML=date.getDate();
                // }

                var startDT = allDay ? item.start.date : item.start.dateTime;
                    startDT = new Date(startDT);
                var endDT = allDay ? item.end.date : item.end.dateTime;
                    endDT = new Date(endDT);

                    // startDT = item.start.dateTime;
                    // endDT = item.end.dateTime;
                    console.log('startDT: ', startDT);
                    console.log('endDT: ', endDT);

                    console.log('startDT date: ', new Date(startDT));
                    console.log('endDT date: ', new Date(endDT));

                var multiDay = false;
                // var multiDay = startDT.setDate(startDT.getDate()+1) <= endDT ? true : false;

                var durObj = dateUtility.getBestValue( dateUtility.getDuration(startDT,endDT) );
                // var durStr = durObj.value + ' ' + (durObj.unit == 'ms' ? 'minutes' : durObj.unit);


                // condition the duration display
                var displayUnit = durObj.unit;
                if(durObj.value === 1) {
                    // this pattern will not work with 'ms' -- but i dont care because really who is going to have 1 millisecond long calendar events
                    displayUnit = ((durObj.unit).match(/(.+)(s$)/))[1];
                }
                if(durObj.unit == 'ms') { // if the unit is milliseconds then I want to just show that the event is 0 minutes. no more detail is needed.
                    displayUnit = 'minutes';
                }

                var displayValue = durObj.value;
                if(displayUnit === 'day') {
                    displayValue = 'all';
                }
                // var durStr = durObj.value + ' ' + (durObj.unit == 'ms' ? 'minutes' : durObj.unit);
                // var durStr = durObj.value + ' ' + displayUnit;

                var durStr = displayValue + ' ' + displayUnit;






                classes.push(allDay ? 'allDay' : '');
                classes.push(multiDay ? 'multiDay' : '');
                // var str = [
                //     // i + ') &nbsp; ',
                //     item.summary,
                //     // ': &nbsp; &nbsp; [',
                //     // startDT,
                //     ' - ',
                //     // endDT,
                //     // '] '
                //     durStr
                // ];

                var str = [
                    '<span class="eventSummary">',
                        item.summary,
                    '</span>',
                    ' - ',
                    '<time class="eventDuration">',
                        '<span class="eventDurValue">',
                            displayValue,
                            '&nbsp;',
                        '</span>',
                        '<span class="eventDurUnit">',
                            displayUnit,
                        '</span>',
                    '</time>'
                ];

                console.log('duration: ', (dateUtility.getDuration(startDT,endDT)) );
                // console.log('getBestDurationUnit: ', getBestDurationUnit(getDuration(startDT,endDT)) );
                // console.log('printUnits: ', printUnits(getDuration(startDT,endDT)) );
                console.log('-------------------------------');
                // li.appendChild(document.createTextNode(resp.items[i].summary));
                li.innerHTML = str.join('');
                li.setAttribute('class', classes.join(' '));
                // document.getElementById('events').appendChild(li);
                $('time[datetime="'+startDT.toDateString()+'"]+ol').prepend(li);

                // if(i == resp.items.length) {
                    // $('#events').append('<li class="length">'+ i +'</li>');
                // }
              }
            });
          });
        }


$(document).ready(function(){
    // $('h1').css('background','honeydew');


});

