/*
 *  Project: tweetTimeline
 *  Description: display the twitter timeline for a spe
 *  Author: Dots United GmbH
 *  License: GPL
 */

;(function($, window, document, undefined) {

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
        this.element   = element;

        this.options   = $.extend( {}, defaults, options);

        this._defaults = defaults;
        this._name     = pluginName;

        this.interval  = null;

        this.init();
    }

    Plugin.prototype.updateTweets = function(data) {
        var self = this;

        if (this.options.loader) {
            this.options.animateRemove($(this.options.loader, this.element));
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

        var self      = this,
            parameter = options || this.options.apiParameter;

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

        this.getTweets();
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
