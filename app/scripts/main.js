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

        let diffNode = document.createDocumentFragment();
        diff.forEach(function(part){
            let node = document.createElement('span');
            node.appendChild(document.createTextNode(part.value));    
            if(part.added){
                node.style.cssText = "background-color: #acf2bd;"; 
            }else if(part.removed){
                node.style.cssText = "background-color: #fdb8c0;"; 
            }
            diffNode.appendChild(node);
          });

          target.removeChild(target.firstChild);
          target.appendChild(diffNode);
    });
}

gh_diff.main()
