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

            self.options = options;

            // $month.style.setProperty('top', ((3 - options.month) * 30) +'px');
            // $monthd.style.setProperty('top', ((1 - options.month) * 30) +'px');
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

            var $that = document.querySelector('.js_select'),
                state = false;

            $that.className = "js_select date_list animate_show";


            var $m = document.querySelector('.js_month_d'),
                y = (3 - self.options.month) * 30 - 60;

            $m.style.setProperty('-webkit-transform', 'translate3d(0, '+(y-60)+'px, 0)');

            var myScroll = new IScroll('#js_month', {
                probeType: 3,
                mouseWheel: true,
                startY: y
            });

            myScroll.on('scroll', function () {
                var y = this.y;
                $m.style.setProperty('-webkit-transform', 'translate3d(0, '+(y-60)+'px, 0)');
            });

            myScroll.on('scrollEnd', function () {
                console.log(1);
                var a = Math.round(-(this.y / 30));

                // myScroll.scrollTo(0, -a*30, 1000);
            });
        }

    };

    modifyDate.init();

})(window, document);

