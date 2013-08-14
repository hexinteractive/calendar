

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
        //---
        // TODO: create a zero-normalize function for things like date.getMonth()
        function leadingZeros (number,size) {
          if(number.constructor === Number && !isNaN(number)) {
            // TODO: create the string of zeros based on the size passed in
            var absSize = Math.abs(size);
            var z = (Math.pow(10,absSize)).toString().slice(1);
            return (z + number).slice(absSize * -1);
          } else {
            //fail
            return false;
          }
        }

        // TODO: refactor using returnDate()
        // function formateDateTimeString(date){
        //   if(date.constructor === Date && date.toString() !== 'Invalid Date') {
        //     return (date.getFullYear() + '-' + leadingZeros(1+date.getMonth(),2) + '-' + leadingZeros(date.getDate(),2) + 'T' + leadingZeros(date.getHours(),2) + ':' + leadingZeros(date.getMinutes(),2) + ':' + leadingZeros(date.getSeconds(),2) + '.' + (date.getTimezoneOffset()/60) + 'Z');

        //   } else if(date.constructor === String) {

        //     return formateDateTimeString(new Date(date));

        //   } else if(date.constructor === Number) {

        //     return formateDateTimeString(new Date(date));

        //   } else {
        //     // maybe throw an error
        //     return false;
        //   }
        // }

        function formateDateTimeString(date) {
            var confirmedDate = returnDate(date);
            date = confirmedDate;   // TODO: figure out what i want to do with the variable
            if(confirmedDate) {
                return (date.getFullYear() + '-' + leadingZeros(1+date.getMonth(),2) + '-' + leadingZeros(date.getDate(),2) + 'T' + leadingZeros(date.getHours(),2) + ':' + leadingZeros(date.getMinutes(),2) + ':' + leadingZeros(date.getSeconds(),2) + '.' + (date.getTimezoneOffset()/60) + 'Z');
            } else {
                return false;
            }
        }

        // TODO: change name to returnDateObj
        function returnDate(date) {
            if(date.constructor === Date && date.toString() !== 'Invalid Date') {
                return date;
            } else if(date.constructor === String || date.constructor === Number ) {
                return returnDate( new Date(date) );
            } else {
                return false;
            }
        }

        function getDuration(date1, date2) {
            var d1 = returnDate(date1),
                d2 = returnDate(date2),
                units = {},
                time1,
                time2,
                delta,
                durationOf,
                x;

            if(d1 && d2) {

                durationOf = function(ms) {
                    var seconds = ms / 1000,
                        minutes = seconds / 60,
                        hours = minutes / 60,
                        days = hours / 24,
                        weeks = days / 7,
                        months = weeks / 4.34812, /*according to Google's calculator*/
                        years = months / 12,
                        units = {
                            'seconds': seconds,
                            'minutes': minutes,
                            'hours': hours,
                            'days': days,
                            'weeks': weeks,
                            'months': months,
                            'years': years
                        };
                    return units;
                };

                time1 = d1.getTime();
                time2 = d2.getTime();

                delta = time2 - time1;

                return durationOf(delta);
            }
        }

        function getBestDurationUnit(unitsObj) {
            var intUnits = {};
            for(var unit in unitsObj) {
                var unitValue = parseInt(unitsObj[unit],10);
                if(unitValue) {
                    intUnits[unit] = unitValue;
                }
            }

            var returnObj = {'minutes':0};
            for(var r in returnObj) {
                for(var u in intUnits) {
                    if(intUnits[u] < returnObj[r]) {
                        returnObj = {};
                        returnObj[u] = intUnits[u];
                        break;
                    }
                }
            }

            return returnObj;
            // TODO: make this return an obj with only one unit and its value
            // return intUnits;
        }
        // console.log('the duration of today and today + 2 days: ', getDuration(new Date(), new Date() ) );

        function printUnits(unitsObj) {
            var units = ['seconds',
                            'minutes',
                            'hours',
                            'days',
                            'weeks',
                            'months',
                            'years'];
            var str = '';
            for(var a=0; a<units.length; a++) {
                if(unitsObj[units[a]]) {
                    str += unitsObj[units[a]] + ' ' + units[a];
                }
                if(a < units.length-1) {
                    str += ' | ';
                }
            }
            return str;
        }

        function displayDuration(unitsObj) {
            var units = [];
            units[0] = ['seconds', 0];
            units[1] = ['minutes', 0];
            units[2] = ['hours', 0];
            units[3] = ['days', 0];
            units[4] = ['weeks', 0];
            units[5] = ['months', 0];
            units[6] = ['years', 0];

            for(var u=0; u<units.length; u++) {
                if(unitsObj[units[u][0]] >= 1) {
                    units[u][1] = unitsObj[units[u][0]];
                }
            }
        }

        function getDuration2(date1, date2) {
            var d1 = returnDate(date1),
                d2 = returnDate(date2),
                units = {},
                time1,
                time2,
                delta;

            if(d1 && d2) {


                time1 = d1.getTime();
                time2 = d2.getTime();

                delta = time2 - time1;

                // ms = delta,
                // seconds = ms / 1000,
                // minutes = seconds / 60,
                // hours = minutes / 60,
                // days = hours / 24,
                // weeks = days / 7,
                // months = weeks / 4.34812, /*according to Google's calculator*/
                // years = months / 12,
                // units = [];
                // units[0] = ['seconds', seconds];
                // units[1] = ['minutes', minutes];
                // units[2] = ['hours', hours];
                // units[3] = ['days', days];
                // units[4] = ['weeks', weeks];
                // units[5] = ['months', months];
                // units[6] = ['years', years];

                // ms = delta,
                // seconds = [ms , 1000],
                // minutes = [seconds , 60],
                // hours = [minutes , 60],
                // days = [hours , 24],
                // weeks = [days , 7],
                // months = [weeks , 4.34812], /*according to Google's calculator*/
                // years = [months , 12],
                // units = [];
                // units[0] = ['ms', ms],
                // units[1] = ['seconds', seconds[0]/seconds[1]];
                // units[2] = ['minutes', minutes[0]/minutes[1]];
                // units[3] = ['hours', hours[0]/hours[1]];
                // units[4] = ['days', days[0]/days[1]];
                // units[5] = ['weeks', weeks[0]/weeks[1]];
                // units[6] = ['months', months[0]/months[1]];
                // units[7] = ['years', years[0]/years[1]];




                units = {
                    'order': ['ms','seconds','minutes','hours','days','weeks','months','years'],
                    'ms': 1,
                    'seconds': ['ms' , 1000],
                    'minutes': ['seconds' , 60],
                    'hours': ['minutes' , 60],
                    'days': ['hours' , 24],
                    'weeks': ['days' , 7],
                    'months': ['weeks' , 4.34812],
                    'years': ['months' , 12]
                };

                getValue =function(unit, n) {
                    if( (units[unit]).constructor == Array) {
                        // recurse
                        // the units that makeup the requested unit divided by the number of those units in the requested unit
                        return getValue( (units[unit])[0], n ) / (units[unit])[1];
                    } else {
                        // only happens when it gets down to the smallest unit (ms)
                        return n;
                    }
                };

                getUnitValue = function(unit, n) {
                    // n = typeof n == 'Number' ? n : 1;
                    if( (units[unit]).constructor == Array) {
                        // recurse
                        // the units that makeup the requested unit divided by the number of those units in the requested unit
                        return getUnitValue( (units[unit])[0], n) * (units[unit])[1];
                    } else {
                        // only happens when it gets down to the smallest unit (ms)
                        return n;
                    }
                };

                convertUnits = function(unit1, n, unit2) {
                    return getValue(unit2, getUnitValue(unit1,n));
                };



                getAllTheValues = function(n) {
                    var a = [];

                    for(var u=0; u<units.order.length; u++) {

                        var value = getValue(units.order[u], n);
                        a.push(value);
                    }

                    return a;
                };

                getBestValue = function(valueArray) {
                    var bestIndex = 0,
                        returnObj = {};
                    for(var i=0; i< valueArray.length; i++) {
                        if(valueArray[i] >= 1) {
                            bestIndex = i;
                        }
                    }

                    returnObj.unit = units.order[bestIndex];
                    returnObj.value = valueArray[bestIndex];

                    return returnObj;
                };

            }
            return getBestValue(getAllTheValues(delta));
        }





        var now = new Date();

        console.log('now: ', formateDateTimeString( new Date() ) );
        console.log('now - 7 days: ', formateDateTimeString( new Date().setDate( now.getDate() - 7 ) ) );

        function makeApiCall() {
          gapi.client.load('calendar', 'v3', function() {
            var request = gapi.client.calendar.events.list({
              // 'calendarId': 'primary'
                // 'calendarId': 'usa__en@holiday.calendar.google.com',
                'calendarId': 'rnalnb0ke7oip14ph8gjdfp6k4@group.calendar.google.com', /* chores cal */
                'singleEvents': true,/* required to use timeMin */
                // 'timeMin': '2013-02-01T11:43:22.000Z',
                'timeMin': formateDateTimeString(new Date().setDate(now.getDate()-7)),
                'timeMax': formateDateTimeString(new Date().setDate(now.getDate()+21)),
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

                var durObj = getDuration2(startDT,endDT);
                var durStr = durObj.value + ' ' + (durObj.unit == 'ms' ? 'minutes' : durObj.unit);



                classes.push(allDay ? 'allDay' : '');
                classes.push(multiDay ? 'multiDay' : '');
                var str = [
                    // i + ') &nbsp; ',
                    item.summary,
                    // ': &nbsp; &nbsp; [',
                    // startDT,
                    ' - ',
                    // endDT,
                    // '] '
                    durStr
                ];
                console.log('duration: ', (getDuration2(startDT,endDT)) );
                // console.log('getBestDurationUnit: ', getBestDurationUnit(getDuration(startDT,endDT)) );
                console.log('printUnits: ', printUnits(getDuration(startDT,endDT)) );
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

