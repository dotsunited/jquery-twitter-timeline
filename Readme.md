twitterTimeline
================

twitterTimeline is a jQuery plugin to display the recent tweets of a twitter user that comes with a lot of configuration options.
Instead of the twitter search API this plugin uses the `GET statuses/user_timeline` from the API as the search does not return tweets older than a week.

If localStorage is supported by the client, the fetched tweets will be cached within the localStorage to ensure, that tweets are displayed as soon as possible.

Basic usage
-----------

To use twitterTimeline you have to include the latest jQuery build and the twitterTimeline source inside the `head` tag of your HTML document:

    <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script type="text/javascript" src="/path/to/jquery.twitterTimeline.js"></script>

The second step is to add a container element to your HTML where you want the tweets to appear, e.g. `div`:

    <div id="tweetContainer"></div>

Finally you have to initialize the plugin with your desired parameters:

    <script type="text/javascript">
        $(function() {
            $('#tweetContainer').twitterTimeline({
                //your configuration goes here
            });
        });
    </script>

Configuration options
---------------------

You can pass a set of these options to the initialize function to set a custom behaviour for the plugin.

<table>
    <tr>
        <th>Property (Type)</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>ajax</strong> (object)</td>
        <td><pre><code>{
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
}</code></pre></td>
        <td>Options passed to <code>$.ajax()</code>. Fot the <code>data</code> part, you can find a complete list of valid parameters [here](https://dev.twitter.com/docs/api/1/get/statuses/user_timeline)</td>
    </tr>
    <tr>
        <td><strong>count</strong> (integer)</td>
        <td>5</td>
        <td>Specifies the number of tweets that are displayed by the plugin.</td>
    </tr>
    <tr>
        <td><strong>refresh</strong> (boolean|integer)</td>
        <td>false</td>
        <td>If set to a numeric value, the timeline will be refreshed every x milliseconds. New tweets will be prepended to the list, and old tweets will be deleted to maintain the maximum number specified with the option count</td>
    </tr>
    <tr>
        <td><strong>tweetTemplate</strong> (object)</td>
        <td><pre><code>function(item) {
    return '<p>' + TwitterTimeline.parseTweet(item.text) + '</p>';
}</code></pre></td>
        <td>Function to render each tweet. The tweet data is passed as an argument, and the plugin is accessible via the <code>this</code> variable.</td>
    </tr>
    <tr>
        <td><strong>animateAdd</strong> (object)</td>
        <td><pre><code>function(el) { return el; }</code></pre></td>
        <td>Animate method to add elements. This method has to return the new element. If not, the element will not be added to the DOM.</td>
    </tr>
    <tr>
        <td><strong>animateRemove</strong> (object)</td>
        <td><pre><code>function(el) { el.remove(); }</code></pre></td>
        <td>Animate method to remove elements. This method has to remove the element from the DOM!</td>
    </tr>
</table>

Methods
------------------

The tweetTimeline plugin provieds the following public methods:

<table>
    <tr>
        <th>Method name</th>
        <th>Parameter</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>fetch(options)</strong></td>
        <td>(optional) ajax options</td>
        <td>Fetch new Tweets from the API and add them to the containert. The optional ajax parameter extends the plugins ajax options.</td>
    </tr>
    <tr>
        <td><strong>update(items)</strong></td>
        <td>array items</td>
        <td>Manually add tweets to the container.</td>
    </tr>
</table>

If you want to manually refresh the tweet list for example, you can use the following line to fetch new tweets:

    $('#tweetContainer').twitterTimeline('fetch');


Example settings
----------------

The following example is used for the tweet box you can find on our [website](http://dotsunited.de).

    <script type="text/javascript">
        $(function() {
            $('#tweetContainer').twitterTimeline({
                ajax: {
                    data: {
                        screen_name: 'dotsunited',
                        count: 1
                    }
                },
                count: 1,
                tweetTemplate: function(item) {
                    var dateRegEx = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) \+([0-9]{4}) ([0-9]{4})$/;
                    var date = dateRegEx.exec(item.created_at);
                    var tweet = '<p><div class="date">' + date[3] + ' '  + date[2] + ' '  + date[8] + '</div><p>' + $.twitterTimeline.parseTweet() + '</p></p>';
                    return tweet;
                },
                animateAdd: function(el) {
                    return el.hide().delay(300).slideDown(500);
                },
                animateRemove: function(el) {
                    el.slideUp(300, function() {
                        el.remove();
                    });
                }
            });
        });
    </script>

License
-------

Copyright (c) 2012 Dots United GmbH.
Licensed under the MIT license.
