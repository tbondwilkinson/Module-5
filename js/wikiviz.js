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

    var linksLayer = new Kinetic.Layer();

    var startX, startY, padX, padY, sizeOfFont;

    if (pageLinks.length < 15) {
        padX = 100;
        padY = 100;
        sizeOfFont = 26;
    }
    else if (pageLinks.length < 25) {
        padX = 60;
        padY = 60;
        sizeOfFont = 24;
    }
    else if (pageLinks.length < 50) {
        padX = 40;
        padY = 40;
        sizeOfFont = 21;
    }
    else if (pageLinks.length < 100) {
        padX = 25;
        padY = 25;
        sizeOfFont = 18;
    }
    else if (pageLinks.length < 200) {
        padY = 12;
        padX = 12;
        sizeOfFont = 12;
    }
    else if (pageLinks.length < 300) {
        padY = 5;
        padX = 5;
        sizeOfFont = 10;
    }
    else if (pageLinks.length < 500) {
        padY = 1;
        padX = 1;
        sizeOfFont = 9;
    }
    else {
        padY = 0;
        padX = 0;
        sizeOfFont = 6;
    }

    startX = padX;
    startY = 50 + padY;

    for (var i = 0; i < pageLinks.length; i++) {
        var text = sanitize(pageLinks[i]);
        if (pageLinks[i].length > 15) {
            text = text.substring(0, 12);
            text += "...";
        }
        var link = new Kinetic.Text({
            x: startX,
            y: startY,
            stroke: "black",
            fontSize: sizeOfFont,
            fontFamily: "monospace",
            strokeWidth: "2",
            fill: "#ddd",
            text: text,
            cornerRadius: 8.5,
            textFill: "black",
            align: "center",
            padding: 5
        });

        link.on("click", bindText(pageLinks[i]));

        linksLayer.add(link);

        if (startX + link.getWidth() > stage.getWidth()) {
            startY += link.getHeight();
            startY += padY;
            link.setX(padX);
            link.setY(startY);
            startX = link.getWidth() + padX;
            startX += padX;
        }
        else {
            startX += link.getWidth();
            startX += padX;
        }
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
