twitter timeline
================

Twitter timeline is a jQuery Plugin to displays the last tweets of a twitter user that comes with a lot of configuration options

Basic usage
-----------

To use twitterTimeline you have to include the latest jQuery build and the twitterTimeline source inside the `head` tag of your HTML document:

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
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
        <th>Property</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>username</td>
        <td>string</td>
        <td>`twitter`</td>
        <td>The screen name of the user for whom to return results for</td>
    </tr>
    <tr>
        <td>count</td>
        <td>integer</td>
        <td>`5`</td>
        <td>Specifies the number of tweets to try and retrieve, up to a maximum of 200.</td>
    </tr>
    <tr>
        <td>since_id</td>
        <td>integer|string</td>
        <td>`null`</td>
        <td>Returns results with an ID greater than (that is, more recent than) the specified ID.</td>
    </tr>
    <tr>
        <td>max_id</td>
        <td>integer|string</td>
        <td>`null`</td>
        <td>Returns results with an tweet-ID less than (that is, older than) or equal to the specified ID.</td>
    </tr>
    <tr>
        <td>page</td>
        <td>integer</td>
        <td>`1`</td>
        <td>Specifies the page of results to retrieve.</td>
    </tr>
    <tr>
        <td>trim_user</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>When set to either true each tweet returned in a timeline will include a user object including only the status authors numerical ID</td>
    </tr>
    <tr>
        <td>include_rts</td>
        <td>boolean</td>
        <td>`false`</td>
        <td>When set to either true, the timeline will contain native retweets (if they exist) in addition to the standard stream of tweets</td>
    </tr>
    <tr>
        <td>exclude_replies</td>
        <td>boolean</td>
        <td>`true`</td>
        <td>This parameter will prevent replies from appearing in the returned timeline</td>
    </tr>
    <tr>
        <td>refresh</td>
        <td>boolean|integer</td>
        <td>`60`</td>
        <td>If set to a numeric value, the timeline will be refreshed every `x` seconds. New tweets will be prepended to the list, and old tweets will be deleted to maintain the maximum number specified with the option `count`</td>
    </tr>
    <tr>
        <td>url</td>
        <td>string</td>
        <td>`http://api.twitter.com/1/statuses/user_timeline.json`</td>
        <td>URL of the API that will be called with a JSONP-Call</td>
    </tr>
    <tr>
        <td>el</td>
        <td>string</td>
        <td>`p`</td>
        <td>Wrap this element around each tweet</td>
    </tr>
    <tr>
        <td>tweetTemplate</td>
        <td>object</td>
        <td>`function(item) { return item.text.parseTweet(); }`</td>
        <td>Function to render each tweet. The tweet data is passed as an argument, and the plugin is accessible via the `this` variable.</td>
    </tr>
    <tr>
        <td>loader</td>
        <td>string</td>
        <td>`.loader`</td>
        <td>Class name of a loader placeholder that is inside the tweet container. Every element with this class will be removed with the `animateRemove` method on the first fetch call</td>
    </tr>
    <tr>
        <td>animateAdd</td>
        <td>object</td>
        <td>`function(el) { return el; }`</td>
        <td>Animate method to add elements. This method has to return the new element. If not, the element will not be added to the DOM.</td>
    </tr>
    <tr>
        <td>animateRemove</td>
        <td>object</td>
        <td>`function(el) { el.remove(); }`</td>
        <td>Animate method to remove elements. This method has to remove the element from the DOM!</td>
    </tr>
</table>

Methods
------------------

If you want to manually refresh the tweet list, you can use the following method to fetch new tweets:

    $('#tweetContainer').data('plugin_twitterTimeline').getTweets();


The tweetTimeline plugin extends JavaScripts `String`-Object by the following methods that each can be called on any string:

<table>
    <tr>
        <th>Method name</th>
        <th>Example call</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>parseTweet</td>
        <td>`someString.parseTweet();`</td>
        <td>Parse a string (preferably the tweet text) and change all urls to links, all @usernames to profile links and link all #hashtags to the twitter search for that hashtag.</td>
    </tr>
    <tr>
        <td>parseHashtag</td>
        <td>`someString.parseHashtag()`</td>
        <td>Parse a string (preferably the tweet text) and link all #hashtags to the twitter search for that hashtag</td>
    </tr>
    <tr>
        <td>parseUsername</td>
        <td>`someString.parseUsername()`</td>
        <td>Parse a string (preferably the tweet text) and change all @usernames to profile links</td>
    </tr>
    <tr>
        <td>parseURL</td>
        <td>`someString.parseURL()`</td>
        <td>Parse a string (preferably the tweet text) and change all urls to links</td>
    </tr>
</table>



Example settings
----------------

The following example is used for the tweet box you can find on our [website](http://dotsunited.de).

    <script type="text/javascript">
        $(function() {
            $('#tweetContainer').twitterTimeline({
                username: 'dotsunited',
                count: 1,
                el: 'div',
                tweetTemplate: function(item) {
                    var dateRegEx = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) \+([0-9]{4}) ([0-9]{4})$/;
                    var date = dateRegEx.exec(item.created_at);
                    var tweet = '<div class="date">' + date[3] + ' '  + date[2] + ' '  + date[8] + '</div><p>' + item.text.parseTweet() + '</p>';
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