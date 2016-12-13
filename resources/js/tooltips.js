

function constructTooltip(k, v) {
    var row = document.createElement("tr"),
        frag = new window.DocumentFragment();
    frag.appendChild(document.createElement("td"));
    frag.appendChild(document.createElement("td"));
    frag.children[0].textContent = k;
    frag.children[1].textContent = v;
    row.insertBefore(frag, null);
    return row;
}

function createTooltip(k, v) {
    switch (k) {
        case "hero_id":
            k = "hero";
            v = getHero(v);
            break;
        case "item_0":
        case "item_1":
        case "item_2":
        case "item_3":
        case "item_4":
        case "item_5":
            v = getItem(v);
            break;
    }
    k = capitalizeAll(k)
    v = capitalizeAll(v.toString());
    return constructTooltip(k, v);
}

function displayTooltip(obj) {
    toolTipBody.innerHTML = null;
    var frag = new window.DocumentFragment(),
        el;
    for (var i in obj.players) {
        if (infoList.indexOf(i) !== -1) {
            el = createTooltip(i, obj.players[i])
            frag.appendChild(el)
        }
    }
    el = createTooltip("match_time", matchTime(obj.start_time));
    frag.appendChild(el);
    toolTipBody.insertBefore(frag, null);
}
