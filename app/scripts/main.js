`use strict`;

gh_diff = {};

gh_diff.get_targets = function(){
    return document.querySelectorAll(".file-info > a");
}

gh_diff.main = function() {
    
    // correct filepath diff elements(a tag)
    let targets = gh_diff.get_targets();

    Array.prototype.forEach.call(targets, target => {

        let title = target.title;
        let groups = title.match("^(.*) → (.*)$");
        if(groups == null){
            // no diff for file path
            return;
        }

        // get before and after file path
        let before = groups[1];
        let after = groups[2];
        let diff = JsDiff.diffChars(after, before);

        let diffBeforeNode = document.createDocumentFragment();
        let diffAfterNode = document.createDocumentFragment();

        diff.forEach(function(part){
            let afterNode = document.createElement('span');
            let beforeNode = document.createElement('span');
            if(part.added){
                afterNode.style.cssText = "background-color: #acf2bd;"; 
                afterNode.appendChild(document.createTextNode(part.value));
                diffAfterNode.appendChild(afterNode);
            }else if(part.removed){
                beforeNode.style.cssText = "background-color: #fdb8c0;"; 
                beforeNode.appendChild(document.createTextNode(part.value));
                diffBeforeNode.appendChild(beforeNode);
            }else{
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
}

gh_diff.observe = function(){
    // Files are lazy fetched so invoke main by each loading.
    var observer = new MutationObserver(records => {
        gh_diff.main()
    });

    var options = {
        childList: true
    };
    
    Array.prototype.forEach.call(document.getElementsByClassName("js-diff-progressive-container"), target => {
        observer.observe(target, options);
    });
}

gh_diff.observe();
gh_diff.main();
