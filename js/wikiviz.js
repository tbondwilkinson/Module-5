var stage;
var pageTitle;
var isCategory;
var isCategoryView;

function sanitize(string) {
    var temp = string;
    var index = temp.indexOf("_");
    while (index != -1) {
        temp = temp.replace("_", " ");
        index = temp.indexOf("_");
    }
    return temp;
}

function loadPageLinks(data) {
    var pageLinks = JSON.parse(data);

    var layer = new Kinetic.Layer();

    var fillColor;
    if (isCategory) {
        fillColor = "#89C499";
    }
    else {
        fillColor =  "#C4898B";
    }

    var fontSize = 16;
    var fontHeight = 8;
    if(sanitize(pageTitle).length > 16) {
        fontSize = 10;
        fontHeight = 5;
    }

    var label = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: 20,
        text: sanitize(pageTitle),
        fontSize: 14,
        fontFamily: "Calibri",
        strokeWidth: 2,
        fill: fillColor,
        textFill: "black",
        align: 'center',
        padding: 5
    });

    label.setX(label.getX() - label.getWidth()/2);

    label.on("click", function() {
        var url = "http://simple.wikipedia.org/wiki/";
        if (isCategory) {
            url += "Category:";
        }
        window.open(url + pageTitle);
    });

    layer.add(label);

    // add the layer to the stage

    linksLayer = new Kinetic.Layer();

    var startX = 2;
    var startY = 60;

    for (var i = 0; i < pageLinks.length; i++) {
        var text = sanitize(pageLinks[i]);
        if (pageLinks[i].length > 15) {
            text += "[...]";
        }
        var link = new Kinetic.Text({
            x: startX,
            y: startY,
            stroke: "black",
            fontFamily: "monospace",
            strokeWidth: "2",
            fill: "#ddd",
            text: text,
            textFill: "black",
            align: "center",
            padding: 5
        });

        link.on("click", bindText(pageLinks[i]));

        linksLayer.add(link);

        if (startX + link.getWidth() > stage.getWidth) {
            startY += link.getHeight();
            link.setX(0);
            link.setY(startY);
            startX = link.getWidth();
        }

        startX += link.getWidth();
    }

    // // Angle in between each pageLink
    // var circleMax = 25;
    // var angleConstant;
    // var remaining = pageLinks.length;
    // var total = 0;
    // if (pageLinks.length <= circleMax) {
    //     angleConstant = 2 * Math.PI / pageLinks.length;
    //     remaining = 0;
    //     total += pageLinks.length;
    // }
    // else {
    //     remaining -= circleMax;
    //     total += circleMax;
    //     angleConstant = 2 * Math.PI / circleMax;
    // }
    // var angle = 0;

    // var linksLayer = new Kinetic.Layer();
    // var radius = stage.getWidth() / 8;
    // for (var i = 0; i < pageLinks.length; i++) {
    //     var text = sanitize(pageLinks[i]);
    //     if (pageLinks[i].length > 15) {
    //         text += "[...]";
    //     }
    //     var link = new Kinetic.Text({
    //         x: label.getX() + Math.cos(angle) * radius - (text.length * 4),
    //         y: label.getY() + Math.sin(angle) * radius - 10,
    //         stroke: "black",
    //         fontFamily: "monospace",
    //         strokeWidth: "2",
    //         fill: "#ddd",
    //         text: text,
    //         textFill: "black",
    //         align: "center",
    //         padding: 5
    //     });

    //     link.on("click", bindText(pageLinks[i]));

    //     linksLayer.add(link);
    //     angle += angleConstant;
    //     if (i == total - 1) {
    //         angle = 0;
    //         circleMax *= (radius + stage.getWidth() / 8) / radius;
    //         if (remaining <= circleMax) {
    //             angleConstant = 2 * Math.PI / remaining;
    //             remaining = 0;
    //             total = pageLinks.length;
    //         }
    //         else {
    //             angleConstant = 2 * Math.PI / circleMax;
    //             remaining -= circleMax;
    //             total += circleMax;
    //         }
    //         radius += stage.getWidth() / 8;
    //     }
    // }

    stage.add(linksLayer);
    stage.add(layer);
}

function bindText(text) {
    return function(event) {
        stage.reset();
        pageTitle = text;
        if (isCategoryView) {
            isCategory = true;
            $.get("getCategorySubCategories.php", { category: text}, loadPageLinks);
        }
        else {
            isCategory = false;
            $.get("getPageLinks.php", { post_title: text }, loadPageLinks);
        }
    };
}

function start(data) {
    pageTitle = data;
    $.get("getPageLinks.php", { post_title: data }, loadPageLinks);
}

function setLastPlace(data) {
    var lastPage = JSON.parse(data);
    if (lastPage.random) {
        $.get("randomPage.php", {}, start);
    }
    else if (lastPage.isCategory) {
        isCategory = true;
        pageTitle = lastPage.category;
        $.get("getCategoryPages.php", { category: lastPage.category}, loadPageLinks);
    }
    else {
        pageTitle = lastPage.page;
        $.get("getPageLinks.php", { post_title: lastPage.page}, loadPageLinks);
    }
}

window.onload = function() {
    // Get the list of images that we will be landmarking from the server.

    $('#pages').click(function() {
        stage.reset();
        isCategoryView = false;
        if (isCategory) {
            $.get("getCategoryPages.php", { category: pageTitle }, loadPageLinks);
        } else {
            $.get("getPageLinks.php", { post_title: pageTitle }, loadPageLinks);
        }
    });
    $('#categories').click(function() {
        stage.reset();
        isCategoryView = true;
        if (isCategory) {
            $.get("getCategorySubCategories.php", { category: pageTitle }, loadPageLinks);
        } else {
            $.get("getCategory.php", { post_title: pageTitle }, loadPageLinks);
        }
    });
    $('#random').click(function() {
        stage.reset();
        isCategory = false;
        isCategoryView = false;
        $.get("randomPage.php", {}, start);
    });

    $.get("getLastPageOrCategory", {}, setLastPlace);

    isCategoryView = false;
    isCategory = false;

    stage = new Kinetic.Stage({
        container: "wiki-container",
        width: 960,
        height: 960
    });
};
