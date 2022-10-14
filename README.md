# Parrot Perch

Parrot Perch is a single page web application which allows users to create rooms to share videos, watch streams, chat, and hang out in. 
It was developed by myself, [Ryan Fortin](https://github.com/rfll) and [Anthony Campbell](https://github.com/anthonycampbell) over the course of about a week and a weekend.

## Tech Stack

Front End: Reactjs
Backend: Node and Express, with socket.io for websocket functionality.
APIs: We have integrated both the Twitch and Youtube-Search APIs. Possible future development would be integrating Spotify or movies apps. 

Our app also uses:

* Bcrypt to hash room passwords in case we want to manage them with a database in the future, as well as implement user authentication
* [Unique-names-generator](https://www.npmjs.com/package/unique-names-generator#style) for the random names
* Axios
* bootstrap
* Sass
* Lodash

## Images
Front Page: Users can create rooms with or without a password, an alert will show if they are missing a password for a room that exists. Rooms are automatically purged when no users are in them.

![Front Page](https://i.imgur.com/2L3oeHp.png)

Alert: When a room already exists but has a password, instead of joining the room a user will see an alert they need to know the password.

![Alert](https://i.imgur.com/VbnACrw.png)

Room View: This is what a room on desktop looks like when you're inside. Our chat is on the right, and the videos will take up the screen width up to but not including chat if space is available.

![Room View](https://i.imgur.com/xGWc4wm.png)

![Multi-video view](https://i.imgur.com/rg6XOV7.png)

![Snake Game](https://i.imgur.com/iTzu1mz.png)

### Responsive Styles
Mobile View:

![Mobile View](https://i.imgur.com/dfrF5rf.png)

Tablet View:

![Tablet View](https://i.imgur.com/W1L4lLe.png)

## My Stake:
While developing this app, I created the chat functionality with websockets along with the styles for all components of the chat, as well as designing the CSS styles for the widget layouts and general layout of the rooms. I also created the logic and alert for letting users know when their chosen room name already exists with a password that they will need to get in. I also created the context provider to manage all the state required to run rooms.

## Future Development: 
These are all nice things to have but likely on pause while I work on other projects.
* Allowing users to resize things or move them by clicking and dragging
* Pausing chat autoscroll for when a user has scrolled up the chat and display an alert if there are new messages but they're scrolled up currently
* Allowing the videos to expand across the entire screen.
* Integrating other APis and allowing users to sign into things like spotify etc and play music in the room
* Allowing users to sign up and store them in a database so users can keep a name persistent (as fun as the random names can be!)

Known issues:
* If a user is heavily using the whiteboard in a room and a user joins that room, the room may stop functioning correctly.

If you do find an issue with our app, please let us know! We deployed it for fun at parrot-perch.herokuapp.com!
