
/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onUpdate() {
  console.log(`Item disabled or enabled`);
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

// Create the new entry in the tab context menu
browser.menus.create({
  id: "close-left-tabs",
  title: "Close Tabs to the Left",
  contexts: ["tab"]
}, onCreated);

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
// Global Variable to keep track of the selected tab
var selectedBrowserTab;

// Add the click listener for our context menu item
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "close-left-tabs":
      selectedBrowserTab = tab;
      closeTabsToTheLeft(tab);
      break;
  }
});

//Query all available tabs from the current window
function closeTabsToTheLeft(tab) {
  return browser.tabs.query({currentWindow: true})
  .then(getTabsToTheLeft, onError);
}

// Figure out all tabs to the left of the selected one
function getTabsToTheLeft(tabs) {
  var tabsToClose = [];
  for (let tab of tabs) {
    if (!tab.pinned && tab.index < selectedBrowserTab.index) {
        tabsToClose.push(tab.id);
    }
  }
  closeTabsById(tabsToClose);
}

// Remove all tabs that were found to be on the left side of the selected one
function closeTabsById(tabsToClose) {
  browser.tabs.remove(tabsToClose).then(onRemoved, onError)
}


// Helper for disabling / enabling the menu item, not needed right now.
/*
function deactivateCloseLeftTabsMenuItem() {
  var updating = browser.menus.update("close-left-tabs", {
    enabled: false
  }).then(onUpdate, onError);
}

function activateCloseLeftTabsMenuItem() {
  var updating = browser.menus.update("close-left-tabs", {
    enabled: true
  }).then(onUpdate, onError);
}
*/
