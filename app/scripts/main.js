`use strict`;

gh_diff = {};

gh_diff.get_targets = function() {
  return document.querySelectorAll(".file-info > a");
};

gh_diff.show_diff = function() {
  // correct filepath diff elements(a tag)
  let targets = gh_diff.get_targets();
  if (targets == null) {
    return;
  }

  Array.prototype.forEach.call(targets, target => {
    let title = target.title;
    let groups = title.match("^(.*) → (.*)$");
    if (groups == null) {
      // no diff for file path
      return;
    }

    // get before and after file path
    let before = groups[1];
    let after = groups[2];
    let diff = JsDiff.diffChars(after, before);

    let diffBeforeNode = document.createDocumentFragment();
    let diffAfterNode = document.createDocumentFragment();

    diff.forEach(function(part) {
      let afterNode = document.createElement("span");
      let beforeNode = document.createElement("span");
      if (part.added) {
        beforeNode.style.cssText = "background-color: #fdb8c0;";
        beforeNode.appendChild(document.createTextNode(part.value));
        diffBeforeNode.appendChild(beforeNode);
      } else if (part.removed) {
        afterNode.style.cssText = "background-color: #acf2bd;";
        afterNode.appendChild(document.createTextNode(part.value));
        diffAfterNode.appendChild(afterNode);
      } else {
        beforeNode.appendChild(document.createTextNode(part.value));
        afterNode.appendChild(document.createTextNode(part.value));

        diffBeforeNode.appendChild(beforeNode);
        diffAfterNode.appendChild(afterNode);
      }
    });

    target.innerHTML = "";

    target.appendChild(diffBeforeNode);
    target.appendChild(document.createTextNode(" → "));
    target.appendChild(diffAfterNode);
  });
};

gh_diff.hook_files_changes_link = function() {
  // hook only no files window. (Not only directly access to Files changes.)
  if (document.querySelector("#files") != null) {
    return;
  }

  if (document.querySelector(".tabnav.tabnav-pr .tabnav-tabs") == null) {
    return;
  }

  // not load contents as soon as click so observe tab and polling to show diff contents.
  let observer = new MutationObserver(records => {
    var id = setInterval(function() {
      if (document.querySelector("#files") == null) {
        return;
      }
      gh_diff.show_diff();
      gh_diff.observe();

      if (document.querySelector("#files") != null) {
        clearInterval(id);
      }
    }, 200);
  });
  observer.observe(document.querySelector(".tabnav.tabnav-pr .tabnav-tabs"), {
    childList: true
  });
};

gh_diff.observe = function() {
  // Files are lazy fetched so invoke show_diff by each loading.
  let observer = new MutationObserver(records => {
    gh_diff.show_diff();
  });

  Array.prototype.forEach.call(
    document.getElementsByClassName("js-diff-progressive-container"),
    target => {
      observer.observe(target, { childList: true });
    }
  );
};

gh_diff.main = function() {
  gh_diff.hook_files_changes_link();
  gh_diff.observe();
  gh_diff.show_diff();
};

gh_diff.main();

// GitHub has async compile dom so kick script by ajax http access via background
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if ("gh-path-diff" === message) {
    gh_diff.main();
  }
  return;
});
