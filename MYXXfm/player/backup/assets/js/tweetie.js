(function(f) {
    f.fn.twittie = function(e, l) {
        var p = "function" === typeof e ? e : l,
            c = f.extend({
                username: null,
                list: null,
                hashtag: null,
                count: 10,
                hideReplies: !1,
                dateFormat: "%b/%d/%Y",
                template: "{{date}} - {{tweet}}",
                apiPath: "api/tweet.php"
            }, e instanceof Object ? e : {});
        c.list && !c.username && f.error("If you want to fetch tweets from a list, you must define the username of the list owner.");
        var m = function(c) {
                return c.replace(/(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig, '<a href="$1" target="_blank" title="Visit this link">$1</a>').replace(/#([a-zA-Z0-9_]+)/g,
                    '<a href="http://twitter.com/search?q=%23$1&amp;src=hash" target="_blank" title="Search for #$1">#$1</a>').replace(/@([a-zA-Z0-9_]+)/g, '<a href="http://twitter.com/$1" target="_blank" title="$1 on Twitter">@$1</a>')
            },
            q = function(g) {
                for (var d = c.template, a = "date tweet avatar url retweeted screen_name user_name".split(" "), h = 0, b = a.length; h < b; h++) d = d.replace(new RegExp("{{" + a[h] + "}}", "gi"), g[a[h]]);
                return d
            };
        this.html("<span>Loading...</span>");
        var n = this;
        f.getJSON(c.apiPath, {
            username: c.username,
            list: c.list,
            hashtag: c.hashtag,
            count: c.count,
            exclude_replies: c.hideReplies
        }, function(g) {
            n.find("span").fadeOut("fast", function() {
                n.html("<ul></ul>");
                for (var d = 0; d < c.count; d++) {
                    var a = !1;
                    if (g[d]) a = g[d];
                    else if (void 0 !== g.statuses && g.statuses[d]) a = g.statuses[d];
                    else break;
                    for (var h = a.user.name, b = a.created_at, b = b.split(" "), b = new Date(Date.parse(b[1] + " " + b[2] + ", " + b[5] + " " + b[3] + " UTC")), k = "January February March April May June July August September October November December".split(" "), b = {
                            "%d": b.getDate(),
                            "%m": b.getMonth() +
                                1,
                            "%b": k[b.getMonth()].substr(0, 3),
                            "%B": k[b.getMonth()],
                            "%y": String(b.getFullYear()).slice(-2),
                            "%Y": b.getFullYear()
                        }, k = c.dateFormat, f = c.dateFormat.match(/%[dmbByY]/g), e = 0, l = f.length; e < l; e++) k = k.replace(f[e], b[f[e]]);
                    a = {
                        user_name: h,
                        date: k,
                        tweet: a.retweeted ? m("RT @" + a.user.screen_name + ": " + a.retweeted_status.text) : m(a.text),
                        avatar: '<img src="' + a.user.profile_image_url + '" />',
                        url: "http://twitter.com/" + a.user.screen_name + "/status/" + a.id_str,
                        retweeted: a.retweeted,
                        screen_name: m("@" + a.user.screen_name)
                    };
                    n.find("ul").append("<li>" + q(a) + "</li>")
                }
                "function" === typeof p && p()
            })
        })
    }
})(jQuery);