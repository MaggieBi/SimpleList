var list = [];
var loaded = false;

function updateDom() {
    var inputs = document.getElementsByTagName("div");
    while (inputs.length != 0) {
        for (var i = 0; i < inputs.length; i++) {
            document.body.removeChild(inputs[i]);
        }
    }
    sortList();
    if (list.length == 0) {
            console.log("Nothing in the list");
            var d = document.createElement("div");
            d.innerHTML = "No items in your list!";
            document.body.appendChild(d);
    } else {
        for (var i in list) {
            var item = list[i];
            var d = document.createElement("div");
            d.id = item.name;
            d.innerHTML = item.name;
            if (item.done) {
                d.className = d.className + " checked";
                d.onclick = removeItem.bind(null, item.name);
            } else {
                d.onclick = checkItem.bind(null, d);
            }
            document.body.appendChild(d);
        }
    }
}

function sortList() {
    list.sort(function(a, b) {
        if (a.done > b.done) {
            return 1;
        } else if (a.done < b.done) {
            return -1;
        } 
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
        }
        return -1;
    });
}

function checkItem(d) {
    console.log("Checking item " + d.id);
    d.className = d.className + " checked";
    for (var i = 0; i < list.length; i++) {
        if (list[i].name === d.id) {
            list[i].done = 1;
        }
    }
    updateDom();
    chrome.storage.sync.set({'list': list}, function() {});
}

function removeItem(name) {
    console.log("Removing " + name);
    for (var i in list) {
        var item = list[i];
        if (item.name === name) {
            list.splice(i, 1);
            break;
        }
    }
    if (loaded) {
        updateDom();
    }
    chrome.storage.sync.set({'list': list}, function() {});
}

function addItem(s) {
    list.push({name: s, done: 0});
    chrome.storage.sync.set({'list': list}, function() {});
    if (loaded) {
        updateDom();
    }
}

chrome.storage.local.get("list", function(o) {
    list = o.list;
     if (loaded) {
         updateDom();
     }
});

document.addEventListener('DOMContentLoaded', function () {
    console.log("Popup.js called!");
    chrome.storage.sync.get("list", function(o) {
        if (o.list == undefined) {
            list = [];
            return;
        }
        list = o.list;
        loaded = true;
        updateDom();
    });

    document.getElementById("input").onkeydown = function(e) {
        if (e.keyCode == 13) {
            addItem(document.getElementById("input").value);    
            document.getElementById("input").value = "";
        }
    }    
});
