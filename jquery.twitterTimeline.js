/*
 *  Project: tweetTimeline
 *  Description: Display the recent tweets of a twitter user
 *  Author: Robert Fleischmann (Dots United GmbH)
 *  License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function($) {

    var TwitterTimeline = $.twitterTimeline = function(element, options) {
        this.element  = $(element);
        this.options  = $.extend(true, {}, this.options, options || {});

        this._init();
    };

    $.extend(TwitterTimeline.prototype, {
        options: {
            ajax: {
                url: 'http://api.twitter.com/1/statuses/user_timeline.json',
                data: {
                    screen_name     : 'twitter',
                    since_id        : null,
                    max_id          : null,
                    page            : 1,
                    trim_user       : true,
                    include_rts     : false,
                    exclude_replies : true
                },
                dataType: 'jsonp'
            },
            count: 5,

            refresh: false,
            tweetTemplate : function(item) {
                return '<p>' + TwitterTimeline.parseTweet(item.text) + '</p>';
            },
            animateAdd: function(el) {
                return el;
            },
            animateRemove: function(el) {
                el.remove();
            }
        },
        _refreshTimeout: null,
        _init: function() {
            this._useLocalStorage = typeof localStorage !== 'undefined' && typeof JSON !== 'undefined';
            this._localStorageKey = 'twitterTimeline_' + this.options.ajax.data.screen_name;

            //read localStorage and write tweets if there are cached ones
            if (this._useLocalStorage === true) {
                var cache = localStorage.getItem(this._localStorageKey);
                if (cache !== null) {
                    cache = JSON.parse(cache);
                    if (cache.length > 0 ) {
                        this.update(cache);
                    }
                }
            }

            //get new tweets
            this.fetch();
        },
        update: function(data) {
            var self = this;

            if (this._refreshTimeout) {
                clearTimeout(this._refreshTimeout);
            }

            // update localStorage
            if (this._useLocalStorage === true && data.length > 0) {
                var cache = localStorage.getItem(this._localStorageKey);
                cache = cache !== null ? JSON.parse(cache) : [];
                cache = data.concat(cache).splice(0, this.options.count);
                cache = JSON.stringify(cache);
                try {
                    localStorage.removeItem(this._localStorageKey); // http://stackoverflow.com/questions/2603682/is-anyone-else-receiving-a-quota-exceeded-err-on-their-ipad-when-accessing-local
                    localStorage.setItem(this._localStorageKey, cache);
                } catch (e) {
                    // local storage should not be used because of security reasons like private browsing
                    // disable for further updates
                    this._useLocalStorage = false;
                }
            }

            //add new tweets
            $.each(data.reverse(), function(idx, item) {
                //set since_id to current tweet for further updates
                self.options.ajax.data.since_id = item.id_str;

                //get tweet html from template and prepend to list
                var tweet = self.options.tweetTemplate.call(self, item);
                self.element.prepend(self.options.animateAdd($(tweet), idx));

                //remove last tweet if the number of elements is bigger than the defined count
                var tweets = self.element.children(self.options.el);
                if (tweets.length > self.options.count) {
                    self.options.animateRemove($(tweets[self.options.count]), idx);
                }
            });

            if (typeof this.options.refresh === 'number') {
                this._refreshTimeout = setTimeout($.proxy(this.fetch, this), this.options.refresh);
            }
        },
        fetch: function(options) {
            var ajax = $.extend(true, {}, this.options.ajax, options || {});
            
            var self = this,
                success = ajax.success;
                
            ajax.success = function(data) {
                self.update(data);
                if ($.isFunction(success)) {
                    success.apply(this, arguments);
                }
            };

            $.ajax(ajax);
        }
    });

    TwitterTimeline.parseTweet = function(text) {
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

    $.fn.twitterTimeline = function(options) {
        if (typeof options === 'string') {
            var instance = $(this).data('twitterTimeline');
            return instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));
        } else {
            return this.each(function() {
                var instance = $(this).data('twitterTimeline');

                if (instance) {
                    $.extend(true, instance.options, options || {});
                } else {
                    new TwitterTimeline(this, options);
                }
            });
        }
    };

})(jQuery);
