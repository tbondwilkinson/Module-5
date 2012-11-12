var stage;
var pageTitle;

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

    var oval = new Kinetic.Ellipse({
        x: stage.getWidth() / 2,
        y: stage.getHeight() / 2,
        radius: {
            x: 80,
            y: 30
        },
        fill: "#C4898B",
        stroke: "black",
        strokeWidth: 1
    });

    // add the shape to the layer
    layer.add(oval);

    var fontSize = 16;
    var fontHeight = 8;
    if(sanitize(pageTitle).length > 16) {
        fontSize = 10;
        fontHeight = 5;
    }

    var label = new Kinetic.Text({
        x: oval.getX() - oval.getRadius().x,
        y: oval.getY() - fontHeight,
        text: sanitize(pageTitle),
        fontSize: fontSize,
        fontFamily: "Calibri",
        textFill: "black",
        width: oval.getWidth(),
        align: 'center',
        padding: 0
    });

    layer.add(label);

    // add the layer to the stage

    // Angle in between each pageLink
    var circleMax = 25;
    var angleConstant;
    var remaining = pageLinks.length;
    var total = 0;
    if (pageLinks.length <= circleMax) {
        angleConstant = 2 * Math.PI / pageLinks.length;
        remaining = 0;
        total += pageLinks.length;
    }
    else {
        remaining -= circleMax;
        total += circleMax;
        angleConstant = 2 * Math.PI / circleMax;
    }
    var angle = 0;

    var linksLayer = new Kinetic.Layer();
    var radius = stage.getWidth() / 8;
    for (var i = 0; i < pageLinks.length; i++) {
        var text = sanitize(pageLinks[i]);
        // if (pageLinks[i].length > 15) {
        //     text += "[...]";
        //     alert(text.length);
        // }
        var link = new Kinetic.Text({
            x: oval.getX() + Math.cos(angle) * radius - (text.length * 4),
            y: oval.getY() + Math.sin(angle) * radius - 10,
            stroke: "black",
            fontFamily: "monospace",
            strokeWidth: "2",
            fill: "#ddd",
            draggable: true,
            text: text,
            textFill: "black",
            align: "center",
            padding: 5
        });

        link.on("click", bindText(pageLinks[i]));

        linksLayer.add(link);
        angle += angleConstant;
        if (i == total - 1) {
            angle = 0;
            circleMax *= (radius + stage.getWidth() / 8) / radius;
            if (remaining <= circleMax) {
                angleConstant = 2 * Math.PI / remaining;
                remaining = 0;
                total = pageLinks.length;
            }
            else {
                angleConstant = 2 * Math.PI / circleMax;
                remaining -= circleMax;
                total += circleMax;
            }
            radius += stage.getWidth() / 8;
        }
    }

    stage.add(linksLayer);
    stage.add(layer);
}

function loadCategory(data) {
    
}

function bindText(text) {
    return function(event) {
        stage.clear();
        pageTitle = text;
        $.get("getPageLinks.php", { post_title: text }, loadPageLinks);
    };
}

function start(data) {
    pageTitle = data;
    $.get("getPageLinks.php", { post_title: data }, loadPageLinks);
    $.get("getCategory.php", { post_title: data }, loadCategory);
}

window.onload = function() {
    // Get the list of images that we will be landmarking from the server.

    $.get("randomPage.php", {}, start);
    stage = new Kinetic.Stage({
        container: "wiki-container",
        width: 960,
        height: 960
    });
};
