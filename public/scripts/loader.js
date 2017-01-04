// load will 'load' items by calling thingToDo for each item,
// before calling allDone when all the things to do have been done.
function loader(items, thingToDo, allDone) {
    if (!items) {
        // nothing to do.
        return;
    }

    if ("undefined" === items.length) {
        // convert single item to array.
        items = [items];
    }

    var count = items.length;

    // this callback counts down the things to do.
    var thingToDoCompleted = function (items, i) {
        count--;
        if (0 == count) {
            allDone(items);
        }
    };

    for (var i = 0; i < items.length; i++) {
        // 'do' each thing, and await callback.
        thingToDo(items, i, thingToDoCompleted);
    }
}


