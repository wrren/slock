# slock

Slock is a chrome extension that allows per-sender blocking of messages in Slack channels. Slock works by watching for DOM mutation events on the div containing messages, parsing the sender username and matching it against a stored block list. If the username is in the list, the message div will have the 'slock-filtered' and 'slock-filtered-$username' classes added to it. An injected stylesheet sets elements with this class to `display: none`; hiding them from the viewer.

In addition, message content is scanned for mentions of blocked users, and any messages containing such mentions are also blocked. Other messages from the same sender are unaffected as long as they don't mention a blocked user. This is done to prevent confusion when reading threads, as ideally we would like to hide all direct conversation with blocked users.

# Blocking

Slock watches for mutation events on the popup menu div that's made visible by clicking on a user's name in the message list. Normally this menu contains commands such as 'View Profile' and 'Direct Messages', Slock adds a 'Block' command to this list which adds the user to the block list and immediately hides their messages.

# Block List

Block lists are separated by domain, so common names blocked in one Slack team domain will not be blocked in others. Users can be unblocked by clicking on the page action icon and clicking on the user they'd like to unblock. At this point, the 'slock-filtered' and 'slock-filtered-$username' classes will be removed, and the user's messages will reappear.
