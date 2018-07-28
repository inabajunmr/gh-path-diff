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
        
        // get diff
        // change visual

    });




}

gh_diff.main()
