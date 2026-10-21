# Task Note

A to-do app where every list is a card. Place cards anywhere on a board, resize them, group them into tabs, and tick items off. Built with React and Redux, talking to the [Task Note API](https://github.com/jonathan-portillo/todo-backend-).

Live site: https://task-notes-omega.vercel.app/
Earlier commits: https://github.com/jonathan-portillo/TODO

## Features

- **Checklist cards.** Each card has a coloured header with its title and a ruled checklist underneath. Press Enter for a new line, tick an item to cross it off, and use the × on a line to remove it. Changes save automatically.
- **A free-form board.** Drag a card by its header to put it anywhere in the window. Its position is saved. New cards open in the first free spot.
- **Resizable cards.** Drag the bottom-right corner to make a card wider or taller. The size is saved.
- **Tabs.** Group cards into tabs (for example Math and Science). Add, rename and delete tabs, and drag a card onto a tab to move it there.
- **Collapse.** Fold a card down to just its title to free up space.
- **Trash and undo.** Deleting a card moves it to the trash, with an Undo bar for a few seconds. The Trash page lets you restore a card or delete it forever.
- **Sign up and sign in** with inline errors (username taken, unknown username, wrong password).
- **Light and dark mode.** Follows your system setting the first time, then remembers your choice.
- **Landing page** with a typed headline and sample cards you can tick.

## Running it locally

You need Node and the API running.

1. Clone this repo: `git clone https://github.com/jonathan-portillo/todo-frontend-.git`
2. Install packages: `npm install`
3. Start the app: `npm start` (opens http://localhost:3000)
4. In another terminal, set up the API from https://github.com/jonathan-portillo/todo-backend- (its README has the steps). Run it on **port 4000**, since that is where the app looks by default.

### Pointing at a different API

The API address is read from `REACT_APP_API_URL` and falls back to `http://localhost:4000/`.

```
# local
npm start

# a deployed build (include the trailing slash)
REACT_APP_API_URL=https://your-api.example.com/ npm run build
```

### Scripts

| Command         | What it does                         |
| :-------------- | :----------------------------------- |
| `npm start`     | Development server on port 3000      |
| `npm run build` | Production build into `build/`       |
| `npm test`      | Runs the tests (Create React App)    |

## How it is organised

```
src/
  actions/todoActions.js     all API calls and Redux actions
  reducers/todoReducer.js    the single Redux store
  components/
    auth/                    sign in, sign up, shared layout
    dashboard/               page, tabs, header buttons, styles
    task/                    cards, the new-card form, the trash view
    notes/                   the checklist editor
    standardcomps/           landing page, theme toggle
  utils/
    canvas.js                card placement and overlap logic
    checklist.js             checklist text format
    tints.js                 card header colours
    theme.js                 light / dark mode
  theme.css                  colour variables for both themes
```

A few things that are not obvious from the code:

- **Checklists are plain text.** Each card's list is stored as one note, one item per line: `[ ] open item` or `[x] finished item`. Lines from older notes without those markers still load as unchecked items.
- **Card colour is stored in the browser.** The colour you pick for a new card and whether a card is collapsed are kept in `localStorage`, so they do not follow you to another browser or device. Position, size, tabs and the trash are stored by the API.
- **The board is a canvas.** Cards you have not moved yet flow into free space. The first time you move a card, the others are pinned where they are so nothing jumps.
- **Theme.** Colours are CSS variables in `src/theme.css`. A small script in `public/index.html` sets the saved theme before the page paints so it does not flash.

## Status

The app is feature complete for now. Recent work:

- Redesigned the landing, sign in, sign up and dashboard pages.
- Added the free-form board, resizable cards, tabs, trash with undo, and dark mode.
- Added clear sign in and sign up errors.

Not done yet:

- Moving a card between tabs from a menu (dragging works).
- Reordering tabs.
- Touch support for dragging and resizing has not been tried.
- The About page still has its original styling.

## Development log

Older notes from building the app, kept as written. Newest first.

- Planning on updating a few functions of the app to allow for better user interactivity. Want to ensure there is validation when signing in, some type of way to ensure that information submitted was wrong or succesful.
- Fully deployed looking to see if there are any leftover bugs
- No longer using local host now running API end points to run Task Note.
- Fixed a bug with editing multiple titles at the same time, you can now only edit one title at a time.
- Delete button now only shows up in a component when you toggle the delete button on the side navigation.
- Cancel delete option created to toggle off deleting components.
- Unexpected Hiatus over back to the grind.
- Resolved issue now back to styling
- Issues implementing a delete button that toggles delete option on all components.
- Ran into a few issues moved to 8/25
- Looking to shift from css to styled components.
- Deciding on a new color scheme to have more engagability.
- Started wifeframing a few new styles. Might implement a way to toggle between list view and notes view to add more user usability.
- Aiming to have everything completed by end of next week 8/18/23
- Bugs fixed. 95% of main features are running with no issues. Next focus is to implement a universal delete button that sets that once clicked allows the delete buttons to be enabled in components. After that our main focus is going to be usablity and accessiblity. Device view points are next, user interactions are important. Then I can deploy the final version of app. Its been a long time coming!
- Accidentally pushed commit with bugs. currently working on fixing bugs
- Forgot to mention next step is to update the notes of the task. Hopefully it isnt as tedius as it was to update the title. I have a bit of perspective this time around.
- I can offically update titles. It looks a bit sloppy but it works for just need to do some clean up on styling. While I was at it I fixed the flex box issue with the note boxes only going straight down the page and not wrapping. That's was a simple fix, looking away at the code and coming back is what really helped out there.
- Updating tasks work, now updating notes
- Started on working on updating tasks and notes
- Found a bug when it came to displaying notes, which was fixed through the reducer. I added a Modal whenever you click a create new button it prompts a form. Did a ton of clean up and file scaffolding it was a bit of a mess tbh. Working on styling the dashboar, the boxes for the notes have been created. Need to find a way to properly display the tasks, pagnation? Scrolling box? There are a few ways I can approach this. Also I have to be more careful making my commits, did git add . without realize on my last commit. Luckily they were all revolved around styling so not too bad.
- Fixed login rerendering and did a bit of refactoring, accidentally made on big commit without updating each commit message. In short I now have the store to check login creds so if page gets reset and resets state the app will know if the user is logged in or not helping with conditional rendering. Log out is now in the initial state, and a few changes with conditional rendering in the nav.
- Decided im going to stary stlying componenents I found alot of inspiriation from dribbble in the direction i want to go
- Alot to update, notes are properly displaying alongside adding conditional rendering, so that there is only one note added to each task while checking to see if there are any notes, if none then it will give the option to create a new note with the input. Was able to propely connect everything to the store, got alot of progress. I have a list of things I want to get done prior to styling. I need to create a way for users to update their notes while deleting them aswell as updating the titles. I also need to add a few more things like updating the state when logging in so that the user is routed to the dashboard. There may be a reason to just start styling now since updating really affect much other than adding an update pencil into the components.
- Went back to the drawing board, missed alot of things that was breaking the notes. Now I just need to make sure that I am properly submitting information to the API.
- New issue on notes, might have to do a bit of refactoring
- Resolved issue now only users notes are showing. Now need to allow for updating and deleting notes.
- For some reason, When creating a Task the notes from prior users are showing, trying to debug to figure out why. Last issue to hurdle over and then design is going to be a main priority.
- Alot of progress tonight, fixed issue with components not rerendering on submits. I complely missed updating allTask state. Created a delete button for my tasks. All thats really left now is to make sure that the descriptions are functioning, need to connect noteDescription to global state.
- Doing a bit of brain storming. Trying to figure out the design of the dashboard.
- Can now display all tasks created on dashboard. Next will be implementing fuctionality and working on rerendering pages when submitting a new task.
- Fixed issue with calling on todo_title end points. Next is going to be displaying a list of those titles.
- Created new components for Task Notes, going to return to log in route issue later. I want to focus on functionality for now. Having issues posting a new title however. Going to revist tomorrow after some rest.
- Created a log out button, however having issues routing on handleSubmit to a private route. Once I figure that out straight to notes functionality.
- Finished connecting log in and sign up to backend. Next I'm looking to add a few functions for functionality. Logging in will send to dashboard so with signing up. Also planning on adding verification, ex. wrong password/username, username already exists. Also need to create a PrivateRoute for dashboards. Ensure that users are logged in to even access that page.
- Finished styling landing page and sign up page. Connect Repository to have a running link https://task-notes-omega.vercel.app/ . Next step is to connect backend auth to front end so that we can have a working log in and sign up page.
