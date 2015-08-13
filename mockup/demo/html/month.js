(function(window, document) {
    var document = window.document,
        support = {
            transform3d: ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix()),
            touch: ("ontouchstart" in window)
        };

    var $month, $monthd, $year, $yeard, $select, $current;

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

        fn.formatDate = function () {
            var tDate = new Date(),
                month = tDate.getMonth() + 1,
                year  = parseInt(tDate.getFullYear(), 0);

            return {
                month: month,
                year: year
            };
        };

        fn.addZero = function (num) {
            if (num < 10) {
                num = '0' + num;
            }

            return num;
        };

        return fn;
    })();



    var modifyDate = {
        init: function () {
            var self = this,
                $that = document.querySelectorAll('.js_input_ym');

            self._createMonth();
            self._createYear();
            self._cancelDate();
            self._submitDate();

            var handler = function (e) {
                var m = parseInt(this.dataset.month, 0) || unit.formatDate().month,
                    y = parseInt(this.dataset.year, 0) || unit.formatDate().year;

                $current = this;

                self._update({
                    month: m,
                    year: y
                });

                e.stopPropagation();
            };

            for (var i=0; i<$that.length; i++) {
                $that[i].removeEventListener('click', handler, false);
                $that[i].addEventListener('click', handler, false);
            }

            self._hide();
        },

        _update: function (params) {
            var self = this;

            var month = unit.formatDate().month,
                year  = unit.formatDate().year,
                i,
                options = {
                    month: month,
                    year: year
                };

            for(i in options) options[i] = params[i];

            var m  = (3 - options.month) * 30 - 60,
                md = (1 - options.month) * 30 - 60,
                y  = (2 - (options.year - year)) * 30 - 60,
                yd = (year - options.year) * 30 - 60;

            $month.style.setProperty('-webkit-transform', 'translate3d(0, '+ m +'px, 0)');
            $monthd.style.setProperty('-webkit-transform', 'translate3d(0, '+ md +'px, 0)');
            $year.style.setProperty('-webkit-transform', 'translate3d(0, '+ y +'px, 0)');
            $yeard.style.setProperty('-webkit-transform', 'translate3d(0, '+ yd +'px, 0)');

            $month.dataset.y = m;
            $year.dataset.y = y;

            self._showSelect();
        },

        _createMonth: function () {
            var str = "<li>&nbsp;</li><li>&nbsp;</li>";

            $month  = document.querySelector('.js_date_month'),
            $monthd = document.querySelector('.js_date_month_d');
                
            for (var i=1; i<=12; i++) {
                var tmp = i;
                if (i < 10) {
                    tmp = '0'+i;
                }
                str = str + '<li>'+ tmp +'</li>';
            }

            $month.innerHTML = str +"<li>&nbsp;</li><li>&nbsp;</li>";
            $monthd.innerHTML = str;
        },

        _createYear: function () {
            var tDate  = new Date(),
                year   = parseInt(tDate.getFullYear(), 0),
                str    = "<li>&nbsp;</li><li>&nbsp;</li>";

            $year  = document.querySelector('.js_date_year'),
            $yeard = document.querySelector('.js_date_year_d');

            for (var i=0; i<=30; i++) {
                var tmp = year + i;
                str = str + '<li>'+ (year + i) +'</li>';
            }

            $year.innerHTML = str +"<li>&nbsp;</li><li>&nbsp;</li>";
            $yeard.innerHTML = str;
        },

        /**
         * @params:
         *     month: 月份移动距离
         *     year: 年份移动距离
         */
        _showSelect: function (params) {
            var self = this;

            $select = document.querySelector('.js_date_select');
            $select.className = "js_date_select date_list animate_show";

            var mScroll = new dateScroll('.js_date_month', { type: 'month' }),
                yScroll = new dateScroll('.js_date_year', { type: 'year' });
        },

        _cancelDate: function () {
            var $that = document.querySelector('.js_date_cancel'),
                handler = function (e) {
                    $current.dataset.month = '';
                    $current.dataset.year = '';
                    $current.innerHTML = '请输入有效期';
                    $select.className = "js_date_select date_list animate_hide";

                    e.stopPropagation();
                };

            $that.removeEventListener('click', handler, false);
            $that.addEventListener('click', handler, false);
        },

        _submitDate: function () {
            var $that = document.querySelector('.js_date_submit'),
                handler = function (e) {
                    var m = $current.dataset.month || unit.formatDate().month,
                        y = $current.dataset.year || unit.formatDate().year;

                    $select.className = "js_date_select date_list animate_hide";

                    $current.innerHTML = unit.addZero(m) + ' / ' + y;
                    $current.dataset.month = m;
                    $current.dataset.year = y;

                    e.stopPropagation();
                };

            $that.removeEventListener('click', handler, false);
            $that.addEventListener('click', handler, false);
        },

        _hide: function () {
            document.addEventListener('click', function (e) {
                if ($select) {
                    $select.className = "js_date_select date_list animate_hide";
                }
            }, false);
        }

    };

    modifyDate.init();

    /*
    * @params:
    *     el: dom
    */
    var dateScroll = function(el, params) {
        var self = this;

        self.dname = el;
        self.itype = params.type;
        self.wrapper = typeof el == 'string' ? document.querySelector(el) : el;

        self._init();
    };

    dateScroll.prototype = {
        _init: function () {
            var self = this;

            self._initEvents();
        },

        _start: function (e) {
            var self = this,
                $that = e.target.parentNode;

            unit.eventStop(e);

            self.newY = parseInt($that.dataset.y, 0);
            self.len  = $that.querySelectorAll('li').length;
            self.h    = (self.len - 5) * 30;

            self.basePageY = unit.getPage(e, "pageY");
        },

        _move: function (e) {
            var self = this,
                pageY = unit.getPage(e, "pageY"),
                distY,
                moveY = 0;

            unit.eventStop(e);

            distY      = pageY - self.basePageY;
            self.moveY = distY;
            moveY      = distY + self.newY;

            if (moveY <= 0 && moveY >= -self.h) {
                moveY = moveY;
            } else if (moveY > 0) {
                moveY = moveY/3;
            } else if (moveY < -self.h) {
                moveY = (moveY+self.h)/3 - self.h;
            }

            self._refresh({
                'e': e,
                'x': 0,
                'y': moveY,
                'timer': '0s',
                'type': 'ease',
                'move': true
            });
        },

        _end: function (e) {
            var self = this,
                $that = e.target.parentNode;

            if (!self.moveY) return;

            var moveY = self.moveY + self.newY;

            if (moveY >= 0) {
                moveY = 0;
            } else if (moveY <= -self.h) {
                moveY = -self.h;
            }
            
            self.newY = moveY;
            $that.dataset.y = self.newY;

            self._refresh({
                'e': e,
                'x': 0,
                'y': moveY,
                'timer': '0.5s',
                'type': 'ease-in-out',
                'move': false
            });
        },

        _refresh: function (params) {
            var self = this;

            var el    = self.wrapper,
                timer = params.timer,
                type  = params.type,
                x     = params.x,
                y     = params.y;

            if (!params.move) {
                var num = Math.round(Math.abs(y) / 30),
                    tmp = num + 1,
                    mtmp = parseInt($current.dataset.month, 0),
                    ytmp = parseInt($current.dataset.year, 0);

                if (!mtmp) {
                    mtmp = unit.formatDate().month;
                }

                if (!ytmp) {
                    ytmp = unit.formatDate().year;
                }

                if (self.itype == 'month') {
                    tmp = unit.addZero(tmp);

                    $current.dataset.month = num + 1;
                    $current.dataset.year = ytmp;
                    $current.innerHTML = tmp + ' / ' + ytmp;
                } else {
                    $current.dataset.month = mtmp;
                    $current.dataset.year = unit.formatDate().year + num;
                    $current.innerHTML = unit.addZero(mtmp) + ' / ' + (unit.formatDate().year + num);
                }

                y = -(num * 30);
            }

            el.style.setProperty('-webkit-transition', '-webkit-transform '+ timer +' '+ type);
            el.style.setProperty('-webkit-transform', unit.getTranslate(x, y));
            el.style.setProperty('z-index', 1);

            var $that = document.querySelector(self.dname+'_d');
            $that.style.setProperty('-webkit-transition', '-webkit-transform '+ timer +' '+ type);
            $that.style.setProperty('-webkit-transform', unit.getTranslate(x, y - 60));
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

    // window.dateScroll = dateScroll;

})(window, document);