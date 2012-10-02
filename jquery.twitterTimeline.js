/*
 *  Project: tweetTimeline
 *  Description: Display the recent tweets of a twitter user
 *  Author: Robert Fleischmann (Dots United GmbH)
 *  License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

;(function($) {

    // Create the defaults once
    var pluginName = 'twitterTimeline',
        defaults = {
            apiParameter    : {
                screen_name     : 'twitter',
                since_id        : null,
                max_id          : null,
                page            : 1,
                trim_user       : true,
                include_rts     : false,
                exclude_replies : true
            },
            apiUrl          : 'http://api.twitter.com/1/statuses/user_timeline.json',

            count           : 5,

            refresh         : false,
            el              : 'p',
            tweetTemplate   : function(item) {
                return this.parseTweet(item.text);
            },
            loader          : false,
            animateAdd      : function(el) {
                return el;
            },
            animateRemove   : function(el) {
                el.remove();
            }
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element  = element;
        this.options  = $.extend( {}, defaults, options);
        this.interval = null;

        this.useLocalStorage = typeof localStorage !== 'undefined' && typeof JSON !== 'undefined';
        this.localStorageKey = pluginName + '_' + this.options.apiParameter.screen_name;

        this.init();
    }

    Plugin.prototype.updateTweets = function(data) {
        var self = this;

        if (this.options.loader) {
            this.options.animateRemove($(this.options.loader, this.element));
        }

        // update localStorage
        if (this.useLocalStorage === true && data.length > 0) {
            var cache = localStorage.getItem(self.localStorageKey);
            cache = cache !== null ? JSON.parse(cache) : [];
            cache = data.concat(cache).splice(0, this.options.count);
            cache = JSON.stringify(cache);
            try {
                localStorage.removeItem(self.localStorageKey); // http://stackoverflow.com/questions/2603682/is-anyone-else-receiving-a-quota-exceeded-err-on-their-ipad-when-accessing-local
                localStorage.setItem(self.localStorageKey, cache);
            } catch (e) {
                // local storage should not be used because of security reasons like private browsing
                // disable for further updates
                self.useLocalStorage = false;
            }
        }

        //add new tweets
        $(data.reverse()).each(function(idx, item) {

            //set since_id to current tweet for further updates
            self.options.apiParameter.since_id = item.id_str;

            //get tweet html from template and prepend to list
            var tweet = self.options.tweetTemplate.call(self, item);
            if (self.options.el) {
                tweet = '<' + self.options.el + '>' + tweet + '</' + self.options.el + '>';
            }
            $(self.element).prepend(self.options.animateAdd($(tweet), idx));

            //remove last tweet if the number of elements is bigger than the defined count
            var tweets = $(self.element).children(self.options.el);
            if (tweets.length > self.options.count) {
                self.options.animateRemove($(tweets[self.options.count]), idx);
            }

        });

    };

    Plugin.prototype.parseTweet = function(text) {

        text = text.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });

        text = text.replace(/(^|\s)@(\w+)/g, function(u) {
            return '<a href="http://twitter.com/' + $.trim(u.replace("@","")) + '" target="_blank">' + u + '</a>';
        });

        text = text.replace(/(^|\s)#(\w+)/g, function(t) {
            return '<a href="http://search.twitter.com/search/' + $.trim(t.replace("#","%23")) + '" target="_blank">' + t + '</a>';
        });

        return text;
    };

    Plugin.prototype.getTweets = function(options) {

        var parameter = options || this.options.apiParameter;

        $.ajax({
            url         : this.options.apiUrl,
            crossDomain : true,
            data        : parameter,
            dataType    : 'jsonp',
            success     : $.proxy(this.updateTweets, this)
        });
    };

    Plugin.prototype.init = function() {

        if (typeof this.options.refresh === 'number') {
            this.interval = setInterval($.proxy(this.getTweets, this), this.options.refresh * 1000);
        }

        //read localStorage and write tweets if there are cached ones
        if (this.useLocalStorage === true) {
            var cache = localStorage.getItem(this.localStorageKey);
            if (cache !== null) {
                cache = JSON.parse(cache);
                if (cache.length > 0 ) {
                    this.updateTweets(cache);
                }
            }
        }

        //get new tweets
        this.getTweets();
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery);
