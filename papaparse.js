(function (e) {
    "use strict";

    function t(e) {
        return typeof e === "function"
    }

    function n(e, t) {
        function a(n) {
            var r = s + n.target.result;
            s = "";
            if (r.length >= t.chunkSize) {
                var u = r.lastIndexOf("\n");
                if (u < 0) u = r.lastIndexOf("\r");
                if (u > -1) {
                    s = r.substring(u + 1);
                    r = r.substring(0, u)
                }
            }
            var a = o.parse(r);
            if (i >= e.size) return f(n);
            else if (a.errors.abort) return;
            else c()
        }

        function f(n) {
            if (typeof t.onComplete === "function") t.onComplete(undefined, e, t.inputElem, n)
        }

        function l() {
            if (typeof t.onFileError === "function") t.onFileError(u.error, e, t.inputElem)
        }

        function c() {
            if (i < e.size) {
                u.readAsText(e.slice(i, Math.min(i + t.chunkSize, e.size)), t.config.encoding);
                i += t.chunkSize
            }
        }
        if (!t) t = {};
        if (!t.chunkSize) t.chunkSize = 1024 * 1024 * 5;
        if (t.config.step) {
            var n = t.config.step;
            t.config.step = function (r) {
                return n(r, e, t.inputElem)
            }
        }
        var i = 0;
        var s = "";
        var o = new r(t.config);
        var u = new FileReader;
        u.onload = a;
        u.onerror = l;
        this.stream = function (e, n) {
            t.onComplete = e;
            t.onFileError = n;
            c()
        };
    }

    function r(e) {
        function c(e) {
            if (typeof e !== "object") e = {};
            if (typeof e.delimiter !== "string" || e.delimiter.length != 1) e.delimiter = f.delimiter;
            if (e.delimiter == '"' || e.delimiter == "\n") e.delimiter = f.delimiter;
            if (typeof e.header !== "boolean") e.header = f.header;
            if (typeof e.dynamicTyping !== "boolean") e.dynamicTyping = f.dynamicTyping;
            if (typeof e.preview !== "number") e.preview = f.preview;
            if (typeof e.step !== "function") e.step = f.step;
            return e
        }

        function h(e) {
            var t = String.fromCharCode(30);
            var n = String.fromCharCode(31);
            var i = [",", "	", "|", ";", t, n];
            var s, o, a;
            for (var f = 0; f < i.length; f++) {
                var l = i[f];
                var c = 0,
                    h = 0;
                var p = (new r({
                    delimiter: l,
                    header: false,
                    dynamicTyping: false,
                    preview: 10
                })).parse(e);
                for (var d = 0; d < p.results.length; d++) {
                    var v = p.results[d].length;
                    h += v;
                    if (typeof a === "undefined") {
                        a = v;
                        continue
                    } else if (v > 1) {
                        c += Math.abs(v - a);
                        a = v
                    }
                }
                h /= p.results.length;
                if ((typeof o === "undefined" || c < o) && h > 1.99) {
                    o = c;
                    s = l
                }
            }
            u.delimiter = s;
            return !!s
        }

        function p() {
            var e = a.i > 0 && g(a.i - 1) || a.i == 0;
            var t = a.i < i.length - 1 && g(a.i + 1) || a.i == i.length - 1;
            var n = a.i < i.length - 1 && i[a.i + 1] == '"';
            if (a.inQuotes && n) {
                a.fieldVal += '"';
                a.i++
            } else if (e || t) a.inQuotes = !a.inQuotes;
            else N("Quotes", "UnexpectedQuotes", "Unexpected quotes")
        }

        function d() {
            v()
        }

        function v() {
            a.fieldVal += a.ch
        }

        function m() {
            if (a.ch == u.delimiter) y();
            else if (a.ch == "\r" && a.i < i.length - 1 && i[a.i + 1] == "\n" || a.ch == "\n" && a.i < i.length - 1 && i[a.i + 1] == "\r") {
                b();
                a.i++
            } else if (a.ch == "\r" || a.ch == "\n") b();
            else v()
        }

        function g(e) {
            return i[e] == u.delimiter || i[e] == "\n" || i[e] == "\r"
        }

        function y() {	
	if (u.header)
	{
		if (a.lineNum == 1 && n == 1) {

			if ( a.fieldVal == "" || a.fieldVal == " " ){
				a.parsed.fields.push('EMPTY COL NAME');
			} else {
				a.parsed.fields.push(a.fieldVal);
			}					
		}
		else
		{
			var e = a.parsed.rows[a.parsed.rows.length - 1];

			var t = a.parsed.fields[a.field];

			if (t)
			{
				if (u.dynamicTyping)
					a.fieldVal = S(a.fieldVal);	
				
				// if undefined, then its NOT a duplicate
				if ( typeof e[t] === "undefined" ) {
					if ( t == "EMPTY COL NAME" ) {
						e[t+" #"+a.field] = a.fieldVal;	
					} else {
						e[t] = a.fieldVal;	
					}
					
				} else {
					e[t+" #"+a.field] = a.fieldVal;	
				}
				
			}
			else
			{
				if (typeof e.__parsed_extra === 'undefined')
					e.__parsed_extra = [];
				e.__parsed_extra.push(a.fieldVal);
				e[t] = "EMPTY";
				console.log('must be empty');
			}
		}
	}
	else
	{
		if (u.dynamicTyping)
			a.fieldVal = S(a.fieldVal);
		a.parsed[a.parsed.length - 1].push(a.fieldVal);
	}

	a.fieldVal = "";
	a.field ++;
}

        function b() {
            w();
            if (E()) {
                a.errors = {};
                a.errors.length = 0
            }
            if (u.header) {
                if (a.lineNum > 0) {
                    if (E()) a.parsed.rows = [{}];
                    else a.parsed.rows.push({})
                }
            } else {
                if (E()) a.parsed = [
                    []
                ];
                else if (!u.header) a.parsed.push([])
            }
            a.lineNum++;
            a.line = "";
            a.field = 0
        }

        function w() {
            if (o) return;
            y();
            var e = x();
            if (!e && u.header) T();
            if (E() && (!u.header || u.header && a.parsed.rows.length > 0)) {
                var t = u.step(C());
                if (t === false) o = true
            }
        }

        function E() {
            return typeof u.step === "function"
        }

        function S(e) {
            var t = l.floats.test(e);
            return t ? parseFloat(e) : e
        }

        function x() {
            if (l.empty.test(a.line)) {
                if (u.header) {
                    if (a.lineNum == 1) {
                        a.parsed.fields = [];
                        a.lineNum--
                    } else a.parsed.rows.splice(a.parsed.rows.length - 1, 1)
                } else a.parsed.splice(a.parsed.length - 1, 1);
                return true
            }
            return false
        }

        function T() {
            if (!u.header) return true;
            if (a.parsed.rows.length == 0) return true;
            var e = a.parsed.fields.length;
            var t = 0;
            var n = a.parsed.rows[a.parsed.rows.length - 1];
            for (var r in n)
                if (n.hasOwnProperty(r)) t++;
            if (t < e) return N("FieldMismatch", "TooFewFields", "Too few fields: expected " + e + " fields but parsed " + t);
            else if (t > e) return N("FieldMismatch", "TooManyFields", "Too many fields: expected " + e + " fields but parsed " + t);
            return true
        }

        function N(e, t, n, r) {
            var i = u.header ? a.parsed.rows.length ? a.parsed.rows.length - 1 : undefined : a.parsed.length - 1;
            var o = r || i;
            if (typeof a.errors[o] === "undefined") a.errors[o] = [];
            a.errors[o].push({
                type: e,
                code: t,
                message: n,
                line: a.lineNum,
                row: i,
                index: a.i + s
            });
            a.errors.length++;
            return false
        }

        function C() {
            return {
                results: a.parsed,
                errors: a.errors,
                meta: {
                    delimiter: u.delimiter
                }
            }
        }

        function k(e) {
            n++;
            if (n > 1 && E()) s += e.length;
            a = L();
            i = e
        }

        function L() {
            var e;
            if (u.header) {
                e = {
                    fields: E() ? a.parsed.fields || [] : [],
                    rows: E() && n > 1 ? [{}] : []
                }
            } else e = [
                []
            ];
            return {
                i: 0,
                lineNum: E() ? a.lineNum : 1,
                field: 0,
                fieldVal: "",
                line: "",
                ch: "",
                inQuotes: false,
                parsed: e,
                errors: {
                    length: 0
                }
            }
        }
        var t = this;
        var n = 0;
        var i = "";
        var s = 0;
        var o = false;
        var u = {};
        var a = L();
        var f = {
            delimiter: "",
            header: true,
            dynamicTyping: true,
            preview: 0
        };
        var l = {
            floats: /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,
            empty: /^\s*$/
        };
        e = c(e);
        u = {
            delimiter: e.delimiter,
            header: e.header,
            dynamicTyping: e.dynamicTyping,
            preview: e.preview,
            step: e.step
        };
        this.parse = function (e) {
            if (typeof e !== "string") return C();
            k(e);
            if (!u.delimiter && !h(e)) {
                N("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to comma", "config");
                u.delimiter = ","
            }
            for (a.i = 0; a.i < i.length; a.i++) {
                if (o || u.preview > 0 && a.lineNum > u.preview) break;
                a.ch = i[a.i];
                a.line += a.ch;
                if (a.ch == '"') p();
                else if (a.inQuotes) d();
                else m()
            }
            if (o) N("Abort", "ParseAbort", "Parsing was aborted by the user's step function", "abort");
            else {
                w();
                if (a.inQuotes) N("Quotes", "MissingQuotes", "Unescaped or mismatched quotes")
            }
            return C()
        };
        this.getOptions = function () {
            return {
                delimiter: u.delimiter,
                header: u.header,
                dynamicTyping: u.dynamicTyping,
                preview: u.preview,
                step: u.step
            }
        }
    }
    e.fn.parse = function (r) {
        function o(i) {
            var s = a,
                o;
            if (t(r.error)) o = function () {
                r.error(c.error, i.file, i.inputElem)
            };
            if (t(r.complete)) s = function (e, t, n, i) {
                r.complete(e, t, n, i);
                a()
            };
            if (t(r.before)) {
                var f = r.before(i.file, i.inputElem);
                if (typeof f === "object") i.instanceConfig = e.extend(i.instanceConfig, f);
                else if (f === "skip") return a();
                else if (f === false) {
                    u("AbortError", i.file, i.inputElem);
                    return
                }
            }
            if (i.instanceConfig.step) {
                var l = new n(i.file, {
                    inputElem: i.inputElem,
                    config: e.extend({}, i.instanceConfig)
                });
                l.stream(s, o)
            } else {
                var c = new FileReader;
                c.onerror = o;
                c.onload = function (t) {
                    var n = t.target.result;
                    var r = e.parse(n, i.instanceConfig);
                    s(r, i.file, i.inputElem, t)
                };
                c.readAsText(i.file, i.instanceConfig.encoding)
            }
        }

        function u(e, n, i) {
            if (t(r.error)) r.error({
                name: e
            }, n, i)
        }

        function a() {
            s.splice(0, 1);
            if (s.length > 0) o(s[0])
        }
        var i = r.config || {};
        var s = [];
        this.each(function (t) {
            var n = e(this).prop("tagName").toUpperCase() == "INPUT" && e(this).attr("type") == "file" && window.FileReader;
            if (!n) return true;
            var r = e.extend({}, i);
            if (!this.files || this.files.length == 0) {
                u("NoFileError", undefined, this);
                return true
            }
            for (var a = 0; a < this.files.length; a++) s.push({
                file: this.files[a],
                inputElem: this,
                instanceConfig: r
            });
            if (s.length > 0) o(s[0])
        });
        return this
    };
    e.parse = function (e, t) {
        var n = new r(t);
        return n.parse(e)
    }
})(jQuery);