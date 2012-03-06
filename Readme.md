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

Configutation options
---------------------

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
