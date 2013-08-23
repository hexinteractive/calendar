// should I name the object dateUtility shortcuted to dU.
if (typeof dateUtility === 'undefined' || !dateUtility) {

dateUtility = (function() {


    var units = {
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

    var Duration = {
        // put duration methods in here.
    };

    var api = {

        // TODO: create a zero-normalize function for things like date.getMonth()
        leadingZeros: function(number,size) {
          if(number.constructor === Number && !isNaN(number)) {
            // TODO: create the string of zeros based on the size passed in
            // TODO: dont allow the size be fewer digits than the number i.e. leadingZeros(39,1) ->  9. e.g. changew size to minSize.
            var absSize = Math.abs(size);
            var z = (Math.pow(10,absSize)).toString().slice(1);
            return (z + number).slice(absSize * -1);
          } else {
            //fail
            return false;
          }
        },

        // castToDate accepts an object to cast to a Date obj. If it is unable to cast the object into a Date it returns null.
        castToDate: function(raw) {
            if(raw.constructor === Date && raw.toString() !== 'Invalid Date') {
                return raw;
            } else if(raw.constructor === String || raw.constructor === Number ) {
                return this.castToDate( new Date(raw) );
            } else {
                return null;
            }
        },

        formateDateTimeString: function(date) {
            var confirmedDate = this.castToDate(date);
            if(confirmedDate) {
                dateTimeString = [
                    confirmedDate.getFullYear(),
                    '-',
                    this.leadingZeros(1+confirmedDate.getMonth(),2),
                    '-',
                    this.leadingZeros(confirmedDate.getDate(),2),
                    'T',
                    this.leadingZeros(confirmedDate.getHours(),2),
                    ':',
                    this.leadingZeros(confirmedDate.getMinutes(),2),
                    ':',
                    this.leadingZeros(confirmedDate.getSeconds(),2),
                    '.',
                    (confirmedDate.getTimezoneOffset()/60),
                    'Z'
                ];
                // YYYY-MM-DDThh:mm:ss.Z
                return dateTimeString.join('');
            } else {
                return null;
            }
        },

            // possible other names getMSAs('seocnds', 123) or convertMsTo('seconds',123) or getMsAs(unit, ms) or convertMs(ms, unit)
        // getMsAs requires two arguments
        //  ms -> the milliseconds you want converted
        //  unit -> the unit you want the milliseconds converted to.
        // old name was getValue
        getMsAs: function(unit, ms) {
            // TODO: check that ms.constructor === Number
            if( (units[unit]).constructor == Array) {
                // recurse
                // the units that makeup the requested unit divided by the number of those units in the requested unit
                return this.getMsAs( (units[unit])[0], ms ) / (units[unit])[1];
            } else {
                // only happens when it gets down to the smallest unit (ms)
                return ms;
            }
        },

        // getMsValueOf  requires two arguments
        // old name was getUnitValue
        getMsValueOf: function(n, unit) {
            // n = typeof n == 'Number' ? n : 1;
            if( (units[unit]).constructor == Array) {
                // recurse
                // the units that makeup the requested unit divided by the number of those units in the requested unit
                return this.getMsValueOf( n, (units[unit])[0] ) * (units[unit])[1];
            } else {
                // only happens when it gets down to the smallest unit (ms)
                return n;
            }
        },

        // convertUnits requires three arguments
        // unit1 -> the unit of the number passed in
        // n -> a number to convert to a different unit
        // unit2 -> the unit you want the number converted to
        convertUnits: function(unit1, n, unit2) {
            return this.getMsAs(unit2, this.getMsValueOf(n, unit1));
        },

        // getMsAsAllUnits requires the milliseconds you want converted to all available units.
        // returns an array
        // old name was getAllTheValues
        getMsAsAllUnits: function(n) {
            var a = [];

            for(var u=0; u<units.order.length; u++) {

                var value = this.getMsAs(units.order[u], n);
                a.push(value);
            }
            // return the array containing the the ms as all the units
            return a;
        },


        getDuration: function(date1, date2) {
            var d1 = this.castToDate(date1),
                d2 = this.castToDate(date2),
                units = {},
                time1,
                time2,
                delta;

            if(d1 && d2) {
                time1 = d1.getTime();
                time2 = d2.getTime();

                delta = time2 - time1;
            }
            // return getBestValue(getAllTheValues(delta));
            return this.getMsAsAllUnits(delta);
        },

        getBestValue: function(valueArray) {
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
        }

    };

    return api;
})();

}

