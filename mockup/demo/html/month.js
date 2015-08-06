(function(window, document) {
    var document = window.document,
        support = {
            transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
            touch: ("ontouchstart" in window)
        };

    var unit = (function () {
        var fn = {};

        fn.addEvent = function (el, type, fn) {
            el.addEventListener(type, fn, false);
        };

        fn.removeEvent = function (el, type, fn) {
            el.removeEventListener(type, fn, false);
        };

        fn.getPage = function (event, page) {
            return event.changedTouches[0][page];
        };

        fn.getTranslate = function (x, y) {
            var distX = x,
                distY = y;

            return support.transform3d ? "translate3d(" + distX + "px, " + distY + "px, 0)" : "translate(" + distX + "px, " + distY + "px)";
        };

        fn.eventStop = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };

        fn.getTriangleSide = function(x1, y1, x2, y2){
            var x = Math.abs(x1 - x2),
                y = Math.abs(y1 - y2),
                z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            return {
                x: x,
                y: y,
                z: z
            };
        };

        fn.getAngle = function (triangle) {
            var cos = triangle.y / triangle.z,
                radina = Math.acos(cos);

            return 180 / (Math.PI / radina);
        };

        return fn;
    })();



    var modifyDate = {
        init: function () {
            var self = this,
                $that = document.querySelector('.js_click');

            self._createHtml();

            $that.addEventListener('click', function () {
                var m = parseInt(this.dataset.month, 0) || 0,
                    y = parseInt(this.dataset.year, 0) || 0;

                self._update({
                    month: m,
                    year: y
                });
            }, false);
        },

        _update: function (params) {
            var self = this,
                $month  = document.querySelector('.js_month'),
                $monthd = document.querySelector('.js_month_d'),
                $year   = document.querySelector('.js_year'),
                $yeard  = document.querySelector('.js_year_d');

            var tDate = new Date(),
                month = tDate.getMonth() + 1,
                year  = parseInt(tDate.getFullYear(), 0),
                i,
                options = {
                    month: month,
                    year: year
                };

            if (params.month && params.year) {
                for(i in options) options[i] = params[i];
            }

            $month.style.setProperty('top', ((3 - options.month) * 30) +'px');
            $monthd.style.setProperty('top', ((1 - options.month) * 30) +'px');
            $year.style.setProperty('top', ((2 - (options.year - year)) * 30) +'px');
            $yeard.style.setProperty('top', ((year - options.year) * 30) +'px');

            self._showSelect();
        },

        _createHtml: function () {
            var tDate  = new Date(),
                year   = parseInt(tDate.getFullYear(), 0),
                $year  = document.querySelector('.js_year'),
                $yeard = document.querySelector('.js_year_d'),
                str    = "";

            for (var i=0; i<=30; i++) {
                var tmp = year + i;
                str = str + '<li>'+ (year + i) +'</li>';
            }

            $year.innerHTML = str;
            $yeard.innerHTML = str;
        },

        _showSelect: function () {
            var self = this;

            var $that = document.querySelector('.js_select');

            $that.className = "js_select date_list animate_show";
        }

    };

    modifyDate.init();

    /*
    * @params:
    *     el: dom
    */
    var dateScroll = function(el) {
        var self = this;

        self.dname = el;
        self.wrapper = typeof el == 'string' ? document.querySelector(el) : el;

        console.log(self.wrapper);

        self.newY = 0;

        self._init();
    };

    dateScroll.prototype = {
        _init: function () {
            var self = this;

            self._initEvents();
        },

        _start: function (e) {
            var self = this;

            self.basePageX = unit.getPage(e, "pageX");
            self.basePageY = unit.getPage(e, "pageY");

            self.scrolling = true;
            self.moveReady = false;
        },

        _move: function (e) {
            var self = this;

            if (!self.scrolling) {
                return;
            }

            var pageX = unit.getPage(e, "pageX"),
                pageY = unit.getPage(e, "pageY"),
                distX,
                distY,
                moveY = 0;

            // if (self.moveReady) {
                unit.eventStop(e);

                distY = pageY - self.basePageY;

                self.moveY = distY;

                moveY = distY + self.newY;

                self._refresh({
                    'e': e,
                    'x': 0,
                    'y': moveY,
                    'timer': '0s',
                    'type': 'ease'
                });

            // } else {
            //     var triangle = unit.getTriangleSide(self.basePageX, self.basePageY, pageX, pageY);

            //     if (triangle.z > 5) {

            //         if (unit.getAngle(triangle) > 55) {
                        
            //             self.moveReady = true;

            //         } else {

            //             self.scrolling = false;

            //         }
            //     }
            // }
        },

        _end: function (e) {
            var self = this;

            // if (self.moveX < 0) {
            //     if (self.moveX < - 80) {
            //         if (self.current < self.len - 1) {
            //             self.current++;
            //         }
            //     }
            // } else {
            //     if (self.moveX > 80) {
            //         if (self.current > 0) {
            //             self.current--;
            //         }
            //     }
            // }

            self._refresh({
                'e': e,
                'x': 0,
                'y': self.moveY,
                'timer': '0.5s',
                'type': 'ease-in-out'
            });

            self.newY = self.moveY;
        },

        _refresh: function (params) {
            var self = this,
                el = self.wrapper;

            el.style.setProperty('-webkit-transition', '-webkit-transform '+ params.timer +' '+ params.type);
            el.style.setProperty('-webkit-transform', unit.getTranslate(params.x, params.y));

            var $that = document.querySelector(self.dname+'_d');
            $that.style.setProperty('-webkit-transition', '-webkit-transform '+ params.timer +' '+ params.type);
            $that.style.setProperty('-webkit-transform', unit.getTranslate(params.x, params.y));
        },

        _initEvents: function (remove) {
            var eventType = remove ? unit.removeEvent : unit.addEvent;

            eventType(this.wrapper, 'touchstart', this);
            eventType(this.wrapper, 'touchmove', this);
            eventType(this.wrapper, 'touchend', this);
        },

        handleEvent: function (e) {
            var self = this;

            switch (e.type) {
                case 'touchstart':
                    self._start(e);
                break;
                case 'touchmove':
                    self._move(e);
                break;
                case 'touchend':
                    self._end(e);
                break;
            }
        }
    }

    window.dateScroll = dateScroll;

})(window, document);

new dateScroll('.js_month');
new dateScroll('.js_year');