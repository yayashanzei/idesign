(function (window, document) {

    //var _i$ = window.i$;

    var i$ = window.i$ = function (selector) {

        var ide = new iDesign;

        switch (selector) {

            case "a":
                return ide.a;
                break;

            case "ai":
                return ide.ai;
                break;

            case "c":
                return ide.c;
                break;

            case "d":
                return ide.d;
                break;

            case "e":
                return ide.e;
                break;

            default:
                throw new Error('Error, please give in "a,ai,c,d,e"! ');
                break;
        }

    };

    //var _iDesign = window.iDesign;

    var iDesign = window.iDesign = function () {
        this.f = iDesign.prototype;
    };

    iDesign.prototype = {
        constructor: iDesign,
        a: new F_ajax(),
        ai: new F_animate(),
        c: new F_client(),
        d: new F_dom(),
        e: new F_event()
    };

    function F_ajax() {

        this.f = F_ajax.prototype;

        this.f.ajax = function (obj) {


            var xhr = this.createXHR(), state = 1;
            var url = this.uquery(obj.url, obj.param, obj.data);

            xhr.onreadystatechange = function () {

                switch (xhr.readyState) {

                    case 1:
                        if (state) {
                            obj.beforeSend();
                            state = null;
                        }
                        break;

                    case 4:
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

                            var data = i$('a').httpData(xhr, obj.dataType);
                            obj.success(data);

                            obj.complete();
                        } else {
                            obj.complete();
                            alert('request is not unsucessfull:' + xhr.status);
                        }
                        break;
                }
            };

            switch (obj.type) {

                case 'get':
                    xhr.open('get', url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader("contentType", "text/html;charset=uft-8");
                    xhr.send(null);
                    break;

                case 'post':

                    var rs = (/(.*)\?(.*)/g).exec(url);
                    url = rs ? rs[1] : url;
                    var data = rs ? rs[2] : 'null';

                    xhr.open('post', url, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(data);
                    break;

                default:
                    throw new Error("type bad!");
                    break;
            }


        };

        this.f.httpData = function (xhr, type, filter) {
            var ct = xhr.getResponseHeader("content-type"),
                xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.tagName == "parsererror") {
                throw "parsererror";
            }
            // Allow a pre-filtering function to sanitize the response
            if (filter) {
                data = filter(data, type);
            }
            // If the type is "script", eval it in global context
            if (type == "script") {
                this.globalEval(data);
            }
            // Get the JavaScript object, if JSON is used.
            if (type == "json") {
                data = eval("(" + data + ")");
            }
            return data;
        };

        this.f.globalEval = function (data) {
            data = this.trim(data);

            if (data) {
                // Inspired by code by Andrea Giammarchi
                // http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");

                script.type = "text/javascript";
                if (i$('c').browser.ie) {
                    script.text = data;
                } else {
                    script.appendChild(document.createTextNode(data));
                }
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709).
                head.insertBefore(script, head.firstChild);
                head.removeChild(script);
            }
        };

        this.f.trim = function (text) {
            return (text || "").replace(/^\s+|\s+$/g, "");
        };


        this.f.uquery = function (url, param, data) {

            var rs = (/(.*)\?(.*)/g).exec(url);

            var result;
            if (rs) {
                result = rs[1];
                var query = rs[2].split('&');
                for (var i = 0; i < query.length; i++) {
                    var querys = query[i].split('=');
                    result = this.addUrlParam(result, querys[0], querys[1]);
                }

            } else {
                result = url;
            }

            if (param) {
                for (var j in param) {
                    result = this.addUrlParam(result, j, param[j]);
                }
            }
            if (data) {

                switch (typeof data) {
                    case 'string':
                        result += (result.indexOf('?') == -1 ? '?' : '&');
                        result += data;
                        break;

                    case 'object':
                        for (var k in data) {
                            result = this.addUrlParam(result, k, data[k]);
                        }
                        break;

                    default:
                        throw new Error('data type is wrong!');
                }

            }

            return result;
        };

        this.f.addUrlParam = function (url, name, value) {
            url += (url.indexOf('?') == -1 ? '?' : '&');
            url += encodeURIComponent(name) + '=' + encodeURIComponent(value);

            return url;
        };

        this.f.createXHR = function () {
            var createXHR;
            if (typeof XMLHttpRequest != 'undefined') {
                createXHR = function () {
                    return new XMLHttpRequest();
                };
            } else if (typeof ActiveXObject != 'undefined') {
                createXHR = function () {
                    if (typeof arguments.callee.activeXString != 'string') {
                        var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'], i, len;

                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {

                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                };
            } else {
                createXHR = function () {
                    throw new Error('no xhr object available.');
                };
            }

            return createXHR();
        };


        return this;
    }

    function F_animate() {
        this.f = F_animate.prototype;

        this.f.animate = function () {

        };

        return this;
    }

    function F_client() {

        this.f = F_client.prototype;

        this.engine = {
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera: 0,

            //complete version
            ver: null
        };

        //browsers
        this.browser = {

            //browsers
            ie: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,

            //specific version
            ver: null
        };


        //platform/device/OS
        this.system = {
            win: false,
            mac: false,
            x11: false,

            //mobile devices
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,

            //game systems
            wii: false,
            ps: false
        };

        //detect rendering engines/browsers
        var ua = navigator.userAgent;
        if (window.opera) {
            this.engine.ver = this.browser.ver = window.opera.version();
            this.engine.opera = this.browser.opera = parseFloat(this.engine.ver);
        } else if (/AppleWebKit\/(\S+)/.test(ua)) {
            this.engine.ver = RegExp["$1"];
            this.engine.webkit = parseFloat(this.engine.ver);

            //figure out if it's Chrome or Safari
            if (/Chrome\/(\S+)/.test(ua)) {
                this.browser.ver = RegExp["$1"];
                this.browser.chrome = parseFloat(this.browser.ver);
            } else if (/Version\/(\S+)/.test(ua)) {
                this.browser.ver = RegExp["$1"];
                this.browser.safari = parseFloat(this.browser.ver);
            } else {
                //approximate version
                var safariVersion = 1;
                if (this.engine.webkit < 100) {
                    safariVersion = 1;
                } else if (this.engine.webkit < 312) {
                    safariVersion = 1.2;
                } else if (this.engine.webkit < 412) {
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }

                this.browser.safari = this.browser.ver = safariVersion;
            }
        } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
            this.engine.ver = this.browser.ver = RegExp["$1"];
            this.engine.khtml = this.browser.konq = parseFloat(this.engine.ver);
        } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
            this.engine.ver = RegExp["$1"];
            this.engine.gecko = parseFloat(this.engine.ver);

            //determine if it's Firefox
            if (/Firefox\/(\S+)/.test(ua)) {
                this.browser.ver = RegExp["$1"];
                this.browser.firefox = parseFloat(this.browser.ver);
            }
        } else if (/MSIE ([^;]+)/.test(ua)) {
            this.engine.ver = this.browser.ver = RegExp["$1"];
            this.engine.ie = this.browser.ie = parseFloat(this.engine.ver);
        }

        //detect this.browsers
        this.browser.ie = this.engine.ie;
        this.browser.opera = this.engine.opera;


        //detect platform
        var p = navigator.platform;
        this.system.win = p.indexOf("Win") == 0;
        this.system.mac = p.indexOf("Mac") == 0;
        this.system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

        //detect windows operating this.systems
        if (this.system.win) {
            if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                if (RegExp["$1"] == "NT") {
                    switch (RegExp["$2"]) {
                        case "5.0":
                            this.system.win = "2000";
                            break;
                        case "5.1":
                            this.system.win = "XP";
                            break;
                        case "6.0":
                            this.system.win = "Vista";
                            break;
                        case "6.1":
                            this.system.win = "7";
                            break;
                        default:
                            this.system.win = "NT";
                            break;
                    }
                } else if (RegExp["$1"] == "9x") {
                    this.system.win = "ME";
                } else {
                    this.system.win = RegExp["$1"];
                }
            }
        }

        //mobile devices
        this.system.iphone = ua.indexOf("iPhone") > -1;
        this.system.ipod = ua.indexOf("iPod") > -1;
        this.system.ipad = ua.indexOf("iPad") > -1;
        this.system.nokiaN = ua.indexOf("NokiaN") > -1;

        //windows mobile
        if (this.system.win == "CE") {
            this.system.winMobile = this.system.win;
        } else if (this.system.win == "Ph") {
            if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
                this.system.win = "Phone";
                this.system.winMobile = parseFloat(RegExp["$1"]);
            }
        }


        //determine iOS version
        if (this.system.mac && ua.indexOf("Mobile") > -1) {
            if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                this.system.ios = parseFloat(RegExp.$1.replace("_", "."));
            } else {
                this.system.ios = 2;  //can't really detect - so guess
            }
        }

        //determine Android version
        if (/Android (\d+\.\d+)/.test(ua)) {
            this.system.android = parseFloat(RegExp.$1);
        }

        //gaming this.systems
        this.system.wii = ua.indexOf("Wii") > -1;
        this.system.ps = /playstation/i.test(ua);

        return this;

    }

    function F_dom() {

        this.f = F_dom.prototype;

        this.isReady = false;
        this.readyBound = false;
        this.readyList = [];

        //var ruleQuick = /<+.+?>|\/>/gi;
        //var ruleSimple = /(^[.#]*?)([A-Za-z_$]+)(.*)/;

        var rule = /(?:[A-Za-z0-9_\-\*]+)|(?:\(\:[A-Za-z0-9_\s\+\-\*\$\/\(\)]+\))|(?:\([A-Za-z0-9_\s\+\-\*\$\/\[\]=~|"']+\))|(?:\[[A-Za-z0-9\-_=~\s\*\$\^!|"']+\])|(?:[.#:>\+~,\s]+?)/gi
            , ruleFour = /[\[|\]]+|[A-Za-z0-9\-_]+|[|~$*^=]+?/gi
            , ruleFive = /[\(\)]|[A-Za-z0-9\-_]+|[\|~$*^=+:\[\]]+?/gi
            , matchList = [];


        //|(?:\:[A-Za-z0-9_\s\+\-\*\$\/]+)

        this.f.$ = function (selector, context) {

            selector = selector || document;

            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            if (typeof selector == 'string') {

                i$('d').find(selector, context);

                /*var simples = isSimple.exec(i$('d').trim(sec));

                 if(simples && ! /\S/gi.exec(simples[3]) ){

                 switch(simples[1]){

                 case '#':
                 this[0] = (context || document).getElementById(simples[2]);
                 this.length = 1;
                 return this;
                 break;

                 case '.':
                 var nodeList = (context || document).querySelectorAll(simples[1]+simples[2]);
                 this.length = nodeList.length;
                 for (var i=0; i<this.length; i+=1) {
                 this[i] = nodeList[i];
                 }
                 return this;
                 break;



                 default:
                 alert(3);
                 break;

                 }
                 }*/

            }

            return matchList;

        };

        this.f.relation = null;

        /*
         *   '   ' -- 1
         *   ' > ' -- 2
         *   ' ~ ' -- 3
         *   ' + ' -- 4
         */
        /*
         符号    type
         #       -1
         .        1
         >+ ~     2
         :        3
         [xx]     4
         (xx)     5
         ([])     6
         (:xxx)   7
         *|xxxx   8

         */
        this.f.find = function (sec, con) {

            if (typeof sec == 'string') {
                i$('d').rEgx(sec, con);
                return;
            }

            this.rs = [];
            var pSec = i$('d').part(sec), pSecLength = pSec.length;

            if (pSecLength > 1) {

                for (var i = 0; i < pSecLength; i++) {

                    if (pSec[i + 1] && pSec[i + 1][0]['type'] == 2) {
                        i$('d').relation = pSec[i + 1][0][0];
                        matchList = (i == 0 ? i$('d').getMatchList(pSec[i], pSec[i + 2]) : i$('d').getMatchList(matchList, pSec[i + 2]));
                        i++;
                    }

                }

            } else if (pSecLength == 1) {

                i$('d').relation = -2;

                matchList = i$('d').getMatchList(pSec[0], false);

            }

        };

        this.f.getMatchList = function (pre, next) {

            switch (i$('d').relation) {
                case ' ':

                    if (pre[0]['type'] == -1 || next[0]['type'] == -1) {
                        pre[0]['type'] == -1 ? matchList = i$('d').gType(pre) : matchList = i$('d').gType(next);
                    } else {
                        matchList = i$('d').gType(pre, matchList);
                        matchList = i$('d').gType(next, matchList);
                    }

                    break;

                case '>':

                    if (pre[0]['type'] == -1 || next[0]['type'] == -1) {
                        pre[0]['type'] == -1 ? matchList = i$('d').gType(pre) : matchList = i$('d').gType(next);
                    } else {
                        matchList = i$('d').gType(pre, matchList);
                        matchList = i$('d').gType(next, matchList);
                    }
                    //console.log(matchList);
                    break;

                case '~':

                    if (pre[0]['type'] == -1 || next[0]['type'] == -1) {
                        pre[0]['type'] == -1 ? matchList = i$('d').gType(pre) : matchList = i$('d').gType(next);
                    } else {
                        matchList = i$('d').gType(pre, matchList);
                        matchList = i$('d').gType(next, matchList);
                    }

                    break;

                case '+':

                    if (pre[0]['type'] == -1 || next[0]['type'] == -1) {
                        pre[0]['type'] == -1 ? matchList = i$('d').gType(pre) : matchList = i$('d').gType(next);
                    } else {
                        matchList = i$('d').gType(pre, matchList);
                        matchList = i$('d').gType(next, matchList);
                    }

                    break;

                case -2:

                    if (pre[0]['type'] == -1 || next[0]['type'] == -1) {
                        pre[0]['type'] == -1 ? matchList = i$('d').gType(pre) : matchList = i$('d').gType(next);
                    } else {
                        matchList = i$('d').gType(pre, matchList);
                        matchList = i$('d').gType(next, matchList);
                    }

                    break;
            }

            return matchList;
        };

        /*
         符号    type
         #       -1
         .        1
         >+ ~     2
         :        3
         [xx]     4
         (xx)     5
         ([])     6
         (:xxx)   7
         *|xxxx   8

         */

        this.f.gType = function (item, con) {

            switch (item[0]['type']) {
                case -1:
                    matchList = i$('d').gId(item[0][2]);
                    break;

                case 1:
                    matchList = i$('d').gClass(item[0][2], con);
                    break;

                case 4:
                    break;

                case 8:
                    matchList = i$('d').gTag(item[0][0], con);
                    break;

                default:

                    break;
            }

            return matchList;

        };

        this.f.gId = function (id) {

            this[0] = document.getElementById(id);
            this.length = 1;
            return this;
        };

        this.f.gClass = function (gClass, con) {

            var nodeList = [], className = '', nodeTemp = [], conLength = con.length, i, j, k;

            if (conLength > 0) {

                switch (i$('d').relation) {
                    case 1:
                        for (i = 0; i < conLength; i++) {
                            nodeList.push(con[i].getElementsByTagName('*'));
                        }
                        break;
                    case 2:

                        for (i = 0, k = 0; i < conLength; i++) {
                            nodeTemp = con[i].parentNode;
                            className = nodeTemp.className.split(/\s+/i);
                            if (i$('d').inArray(gClass, className) > -1) {
                                this[k] = con[i];
                                k++;
                            }
                        }
                        break;
                }

            } else {

                nodeList = (con[0] || document).getElementsByTagName('*');

                for (i = 0, k = 0; i < nodeList.length; i++) {

                    if (nodeList[i].length >= 1) {
                        for (j = 0; j < nodeList[i].length; j++) {

                            if (nodeList[i][j] && nodeList[i][j].className) {

                                className = nodeList[i][j].className.split(/\s+/i);

                                if (i$('d').inArray(gClass, className) > -1) {
                                    this[k] = nodeList[i][j];
                                    k++;
                                }

                            }

                        }
                    } else {
                        if (nodeList[i] && nodeList[i].className) {

                            className = nodeList[i].className.split(/\s+/i);

                            if (i$('d').inArray(gClass, className) > -1) {
                                this[k] = nodeList[i];
                                k++;
                            }

                        }
                    }
                }

            }

            this.length = k;
            return this;
        };

        this.f.gTag = function (gTag, con) {
            var nodeList = [], nodeTemp = [];
            if (con.length > 1) {
                nodeList = [];
                for (var i = 0; i < con.length; i++) {
                    nodeTemp = con[i].getElementsByTagName(gTag);
                    if (nodeTemp.length > 0) {
                        switch (i$('d').relation) {
                            case 1:
                                for (var j = 0; j < nodeTemp.length; j++) {
                                    nodeList.push(nodeTemp[j]);
                                }
                                break;
                            case 2:
                                nodeList.push(nodeTemp[0]);
                                break;

                        }
                    }
                }
            } else {
                nodeList = (con[0] || document).getElementsByTagName(gTag);
            }

            this.length = nodeList.length;

            return nodeList;
        };
        /*
         符号    type
         #       -1
         .        1
         >+ ~     2
         :        3
         [xx]     4
         (xx)     5
         ([])     6
         (:xxx)   7
         *|xxxx   8

         */
        this.f.part = function (sec) {
            var tPart = [], partMatch, secLength = sec.length;
            for (var i = 0, j = 0; i < secLength; i++) {
                if (sec[i] == '#') {
                    tPart[j] = [];
                    tPart[j]['type'] = -1;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i] + sec[i + 1];
                    tPart[j][1] = sec[i];
                    tPart[j][2] = sec[i + 1];
                    i++;
                    j++;
                    continue;
                }

                if (sec[i] == '.') {
                    tPart[j] = [];
                    tPart[j]['type'] = 1;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i] + sec[i + 1];
                    tPart[j][1] = sec[i];
                    tPart[j][2] = sec[i + 1];
                    i++;
                    j++;
                    continue;
                }

                if (i$('d').inArray(sec[i], [' ', '>', '+', '~']) > -1) {
                    tPart[j] = [];
                    tPart[j]['type'] = 2;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i];
                    j++;
                    continue;
                }

                if (sec[i] == ':') {
                    tPart[j] = [];
                    tPart[j]['type'] = 3;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i] + sec[i + 1];
                    tPart[j][1] = sec[i];
                    tPart[j][2] = sec[i + 1];
                    i++;
                    j++;
                    continue;
                }
                if (/^\[/.exec(sec[i])) {
                    tPart[j] = [];
                    tPart[j]['type'] = 4;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i];
                    partMatch = sec[i].match(ruleFour);
                    tPart[j]['key'] = partMatch[1];
                    tPart[j]['mark'] = partMatch[2];
                    if (partMatch.length > 5) {
                        tPart[j]['mark2'] = partMatch[3];
                        tPart[j]['value'] = partMatch[4];
                    } else {
                        tPart[j]['value'] = partMatch[3];
                    }
                    j++;
                    continue;
                }
                if (/^\(/.exec(sec[i])) {
                    tPart[j] = [];
                    tPart[j]['type'] = 5;
                    tPart[j]['index'] = i;
                    tPart[j][0] = sec[i];
                    partMatch = sec[i].match(ruleFive);

                    if (i$('d').inArray('[', partMatch) > -1 /*&& !i$('d').inArray('|', partMatch)*/) {
                        tPart[j]['type'] = 6;
                        tPart[j]['index'] = i;
                        switch (partMatch.length) {
                            case 5:
                                tPart[j]['value'] = partMatch[2];
                                break;
                            case 7:
                                tPart[j]['key'] = partMatch[2];
                                tPart[j]['mark'] = partMatch[3];
                                tPart[j]['value'] = partMatch[4];
                                break;
                            case 8:
                                tPart[j]['key'] = partMatch[2];
                                tPart[j]['mark'] = partMatch[3];
                                tPart[j]['mark2'] = partMatch[4];
                                tPart[j]['value'] = partMatch[5];
                                break;
                            case 9:
                                tPart[j]['key'] = partMatch[3];
                                tPart[j]['mark'] = partMatch[4];
                                tPart[j]['mark2'] = partMatch[5];
                                tPart[j]['value'] = partMatch[6];
                                break;
                            default:
                                throw new Error('type right value');
                                break;
                        }
                        j++;
                        continue;
                    }

                    if (i$('d').inArray(':', partMatch) > -1) {
                        tPart[j]['type'] = 7;
                        tPart[j]['index'] = i;
                        switch (partMatch.length) {
                            case 4:
                                tPart[j]['condition'] = partMatch[2];
                                break;
                            case 7:
                                tPart[j]['condition'] = partMatch[2];
                                tPart[j]['value'] = partMatch[4];
                                break;
                            case 9:
                                tPart[j]['condition'] = partMatch[2];
                                tPart[j]['value'] = partMatch[4];
                                tPart[j]['mark'] = partMatch[5];
                                tPart[j]['value2'] = partMatch[6];
                                break;
                            default:
                                throw new Error('type right value');
                                break;
                        }
                        j++;
                        continue;
                    }

                    tPart[j]['value'] = partMatch[1];

                    j++;
                    continue;
                }

                tPart[j] = [];
                tPart[j]['type'] = 8;
                tPart[j]['index'] = i;
                tPart[j][0] = sec[i];
                j++;
            }

            tPart = i$('d').sortPart(tPart);
            return tPart;
        };

        this.f.sortPart = function (sec) {
            var tSec = [];
            for (var i = sec.length - 1, j = 0, k = 0, m = 0; i > -1; i--) {

                if (!i$('d').isArray(tSec[j])) {
                    tSec[j] = [];
                }

                if (sec[i]['type'] == 2) {
                    j++;
                    tSec[j] = [];
                    tSec[j][0] = sec[i];
                    k = 0;
                    j++;
                    continue;
                }

                if (sec[i]['type'] == -1) {
                    if (!i$('d').isArray(tSec['max'])) {
                        tSec['max'] = [];
                    }
                    tSec['max'][m] = sec[i];
                    m++;
                }

                tSec[j][k] = sec[i];
                k++;
            }


            return tSec;

        };

        this.f.inArray = function (param, array) {
            for (var i = 0; i < array.length; i++) {
                if (param == array[i]) {
                    return i;
                }
            }
        };
        this.f.isArray = function (v) {
            return Object.prototype.toString.call(v) === '[object Array]';
        };
        this.f.rEgx = function (selector, context) {
            var sec = i$('d').trim(selector);

            if (/^<.*>$/.exec(sec) && !isXML(sec)) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            var rMatch = sec.match(rule), rGroup = [], matchGroup = [], rMatchLength = rMatch.length;

            for (var i = 0, j = 0, k = 0; i < rMatchLength; i++, j++) {

                if (!rGroup[k]) {
                    rGroup[k] = [];
                    context = context || document;
                }

                if (i > 0 && /^\s/.exec(rMatch[i]) && (/^[\s,>~+]/.exec(rMatch[i - 1]) || /^[\s,\[\(>~+]/.exec(rMatch[i + 1]) )) {
                    rMatch[i] = null;
                    j--;
                    continue;
                }

                if (rMatch[i] == ',') {
                    matchGroup[k] = i$('d').find(rGroup[k], context);
                    k++;
                    j = -1;
                    rGroup[k] = [];
                    continue;
                }

                rGroup[k][j] = rMatch[i];

                if (i == rMatch.length - 1) {
                    matchGroup[k] = i$('d').find(rGroup[k], context);
                }

            }
        };

        this.f.isXML = function (document) {
            return (!!document.xmlVersion) || (!!document.xml) ||
                (Object.prototype.toString.call(document) === '[object XMLDocument]') ||
                (document.nodeType === 9 && document.documentElement.nodeName !== 'HTML');
        };

        this.f.trim = function (str) {
            return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
        };

        this.f.each = function (fn) {
            var i = 0, length = this.length;
            for (; i < length; i++) {
                fn.call(this[i], i, this[i]);
            }
            return this;
        };


        this.f.createOption = function (arg) {

            var args = arg.match(/(<[A-z]+.+?>.*?<\/[A-z]+>)+?/g), opts = [], i, j;

            for (i = 0; i < args.length; i++) {
                var opt = args[i].match(/<[A-z]+.+?value\s*?=\s*?['|"](.*)['|"].*?>(.*)<\/[A-z]+>/i);
                opts[i] = [opt[1], opt[2]];
            }

            for (j = 0; j < this.length; j++) {
                for (i = 0; i < opts.length; i++) {
                    this[j].add(new Option(opts[i][1], opts[i][0]));
                }
            }

            return this;
        };

        this.f.removeAll = function () {
            this.each(function () {
                this.options.length = 0;
            });

            return this;
        };

        this.f.parseDom = function (arg) {
            var objE = document.createElement("div");
            objE.innerHTML = arg;
            return objE.childNodes;
        };

        this.f.ready = function (fn) {
            i$('d').readyList.push(fn);
            i$('d').bindReady();
        };
        this.f.readyDo = function () {
            if (i$('d').isReady) {

                for (var i = 0; i < i$('d').readyList.length; i++) {
                    if (typeof i$('d').readyList[i] == 'function') {
                        i$('d').readyList[i].call(document);
                    }
                }
                i$('d').readyList = [];
                i$('d').isReady = false;
                i$('d').readyBound = false;
            }
        };

        this.f.bindReady = function () {
            if (i$('d').readyBound) {
                return;
            }
            i$('d').readyBound = true;

            if (document.addEventListener && !i$('c').browser.opera) {
                document.addEventListener("DOMContentLoaded", i$('d').readyDo, false);
                i$('d').isReady = true;
            } else if (i$('c').browser.ie && window == top) {
                (function () {

                    if (i$('d').isReady) {
                        return;
                    }
                    try {
                        document.documentElement.doScroll("left");
                    } catch (error) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                    i$('d').isReady = true;
                    i$('d').readyDo();
                })();
            } else if (i$('c').browser.opera) {
                document.addEventListener("DOMContentLoaded", function () {
                    if (i$('d').isReady) {
                        return;
                    }
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        if (document.styleSheets[i].disabled) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                    }
                    i$('d').isReady = true;
                    i$('d').readyDo();
                }, false);
            } else if (i$('c').browser.safari) {
                var numStyles;
                (function () {
                    if (i$('d').isReady) {
                        return;
                    }
                    if (document.readyState != "loaded" && document.readyState != "complete") {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                    if (numStyles === undefined) {
                        //numStyles = jQuery("style, link[rel=stylesheet]").length;
                    }
                    if (document.styleSheets.length != numStyles) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }

                    i$('d').isReady = true;
                    i$('d').readyDo();
                })();
            } else {
                i$('d').isReady = true;
                i$('e').addHandler(window, "load", i$('d').readyDo);
            }
        };


        this.f.serialize = function () {

            var parts = [],
                field = null,
                i,
                len,
                j,
                optLen,
                option,
                form = this[0],
                optValue;

            for (i = 0, len = form.elements.length; i < len; i++) {
                field = form.elements[i];

                switch (field.type) {
                    case "select-one":
                    case "select-multiple":

                        if (field.name.length) {
                            for (j = 0, optLen = field.options.length; j < optLen; j++) {
                                option = field.options[j];
                                if (option.selected) {
                                    optValue = "";
                                    if (option.hasAttribute) {
                                        optValue = (option.hasAttribute("value") ? option.value : option.text);
                                    } else {
                                        optValue = (option.attributes["value"].specified ? option.value : option.text);
                                    }
                                    parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                                }
                            }
                        }
                        break;

                    case undefined:     //fieldset
                    case "file":        //file input
                    case "submit":      //submit button
                    case "reset":       //reset button
                    case "button":      //custom button
                        break;

                    case "radio":       //radio button
                    case "checkbox":    //checkbox
                        if (!field.checked) {
                            break;
                        }
                    /* falls through */

                    default:
                        //don't include form fields without names
                        if (field.name.length) {
                            parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                        }
                }
            }

            return parts.join("&");
        };

        this.f.say = function () {
        };
        this.f.say2 = function () {
        };
        return this;

    }


    function F_event() {

        this.f = F_event.prototype;

        this.f.addHandler = function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        };

        this.f.getButton = function (event) {
            if (document.implementation.hasFeature("MouseEvents", "2.0")) {
                return event.button;
            } else {
                switch (event.button) {
                    case 0:
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                        return 0;
                    case 2:
                    case 6:
                        return 2;
                    case 4:
                        return 1;
                }
            }
        };

        this.f.getCharCode = function (event) {
            if (typeof event.charCode == "number") {
                return event.charCode;
            } else {
                return event.keyCode;
            }
        };

        this.f.getClipboardText = function (event) {
            var clipboardData = (event.clipboardData || window.clipboardData);
            return clipboardData.getData("text");
        };

        this.f.getEvent = function (event) {
            return event ? event : window.event;
        };

        this.f.getRelatedTarget = function (event) {
            if (event.relatedTarget) {
                return event.relatedTarget;
            } else if (event.toElement) {
                return event.toElement;
            } else if (event.fromElement) {
                return event.fromElement;
            } else {
                return null;
            }

        };

        this.f.getTarget = function (event) {
            return event.target || event.srcElement;
        };

        this.f.getWheelDelta = function (event) {
            if (event.wheelDelta) {
                return (i$('c').engine.opera && i$('c').engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
            } else {
                return -event.detail * 40;
            }
        };

        this.f.preventDefault = function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        };

        this.f.removeHandler = function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        };

        this.f.setClipboardText = function (event, value) {
            if (event.clipboardData) {
                event.clipboardData.setData("text/plain", value);
            } else if (window.clipboardData) {
                window.clipboardData.setData("text", value);
            }
        };

        this.f.stopPropagation = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        };

        return this;
    }


})(window, document);