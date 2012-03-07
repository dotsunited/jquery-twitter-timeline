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
            username        : 'twitter',
            count           : 5,
            since_id        : null,
            max_id          : null,
            page            : 1,
            trim_user       : true,
            include_rts     : false,
            exclude_replies : true,

            refresh         : false,
            url             : 'http://api.twitter.com/1/statuses/user_timeline.json',
            el              : 'p',
            tweetTemplate   : function(item) {
                return item.text.parseTweet();
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

            //set since_id for further updates
            self.options.since_id = item.id_str;

            //get tweet html from template and prepend to list
            var tweet = self.options.tweetTemplate.call(self, item);
            if (self.options.el) {
                tweet = '<' + self.options.el + '>' + tweet + '</' + self.options.el + '>';
            }
            $(self.element).prepend(self.options.animateAdd($(tweet), idx));

            //remove last tweet if the number of elements is bigger than the defined count
            var tweets = $('>' + self.options.el, self.element);
            if (tweets.size() > self.options.count) {
                self.options.animateRemove(tweets.last(), idx);
            }

        });

    };

    //http://www.simonwhatley.co.uk/parsing-twitter-usernames-hashtags-and-urls-with-javascript
    if (typeof String.parseURL === 'undefined') {
        String.prototype.parseURL = function() {
            return this.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z0-9+&@#\/%=~_|])/ig, function(url) {
                return '<a href="' + url + '" target="_blank">' + url + '</a>';
            });
        };
    }
    if (typeof String.parseUsername === 'undefined') {
        String.prototype.parseUsername = function() {
            return this.replace(/(^|\s)@(\w+)/g, function(u) {
                return '<a href="http://twitter.com/' + u.replace("@","") + '" target="_blank">' + u + '</a>';
            });
        };
    }
    if (typeof String.parseHashtag === 'undefined') {
        String.prototype.parseHashtag = function() {
            return this.replace(/(^|\s)#(\w+)/g, function(t) {
                return '<a href="http://search.twitter.com/search?q=' + t.replace("#","%23") + '" target="_blank">' + t + '</a>';
            });
        };
    }
    if (typeof String.parseTweet === 'undefined') {
        String.prototype.parseTweet = function() {
            return this.parseURL().parseUsername().parseHashtag();
        };
    }

    Plugin.prototype.getTweets = function() {

        var self = this,
            requestParameter = {
                screen_name     : this.options.username,
                count           : this.options.count,
                page            : this.options.page,
                trim_user       : this.options.trim_user,
                include_rts     : this.options.include_rts,
                exclude_replies : this.options.exclude_replies
            };

        if (this.options.since_id) {
            requestParameter = $.extend( {}, requestParameter, {
                since_id: this.options.since_id
            });
        }

        if (this.options.max_id) {
            requestParameter = $.extend( {}, requestParameter, {
                max_id: this.options.max_id
            });
        }

        $.ajax({
            url         : this.options.url,
            crossDomain : true,
            data        : requestParameter,
            dataType    : 'jsonp',
            success     : function(data, textStatus, jqXHR) {
                self.updateTweets.call(self, data, textStatus, jqXHR);
            }
        });
    };

    Plugin.prototype.init = function() {
        var self = this;

        if (typeof this.options.refresh === 'number') {
            this.interval = setInterval(function() {
                self.getTweets.call(self);
            }, this.options.refresh * 1000);
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
