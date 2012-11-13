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

function displayImageAndSumary(data) {
    var json = JSON.parse(data);
    articlepopmanager.show(articlepopmanager.in_canvas, articlepopmanager.x, articlepopmanager.y, json.title, json.img, json.summary);
}

function loadPageOrCategoryLinks(data) {
    //setup title
    $('#hmessage').text(sanitize(pageTitle));

    var links = JSON.parse(data);

    var layer = new Kinetic.Layer();

    var fillColor;
    if (isCategory) {
        fillColor = "#89C499";
    }
    else {
        fillColor =  "#C4898B";
    }

    // The page or category text
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

    // Center the title
    label.setX(label.getX() - label.getWidth()/2);

    // Open the category or page in a new window
    label.on("click", function() {
        var url = "http://simple.wikipedia.org/wiki/";
        if (isCategory) {
            url += "Category:";
        }
        window.open(url + pageTitle);
    });

    label.on("mouseover", function () {
        if (!isCategory) {
            $.get("wikiParse", { title: pageTitle }, displayImageAndSummary);
        }
    });

    label.on("mouseout", function() {
        articlepopmanager.hide();
    });

    layer.add(label);

    var linksLayer = new Kinetic.Layer();

    var startX, startY, padX, padY, sizeOfFont;

    // Variable sizing depending on how many links we have to display
    if (links.length < 5) {
        padX = 150;
        padY = 150;
        sizeOfFont = 40;
    }
    else if (links.length < 10) {
        padX = 100;
        padY = 100;
        sizeOfFont = 30;
    }
    else if (links.length < 15) {
        padX = 100;
        padY = 100;
        sizeOfFont = 26;
    }
    else if (links.length < 25) {
        padX = 60;
        padY = 60;
        sizeOfFont = 24;
    }
    else if (links.length < 50) {
        padX = 40;
        padY = 40;
        sizeOfFont = 21;
    }
    else if (links.length < 100) {
        padX = 20;
        padY = 20;
        sizeOfFont = 17;
    }
    else if (links.length < 200) {
        padY = 12;
        padX = 12;
        sizeOfFont = 12;
    }
    else if (links.length < 300) {
        padY = 5;
        padX = 5;
        sizeOfFont = 10;
    }
    else if (links.length < 500) {
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

    // Draw each link on the canvas
    for (var i = 0; i < links.length; i++) {
        var text = sanitize(links[i]);

        // If the title is too long, shorten it
        if (links[i].length > 15) {
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

        // Will reload the canvas with the clicked link as the center
        link.on("click", reloadVisualizer(links[i]));

        linksLayer.add(link);

        // Determine whether we want to start placing links on a new line
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

    stage.add(linksLayer);
    stage.add(layer);
}

function reloadVisualizer(text) {
    return function(event) {
        stage.reset();
        pageTitle = text;
        // Depending on whether we're viewing categories, update our flags
        if (isCategoryView) {
            isCategory = true;
            $.get("getCategorySubCategories.php", { category: text}, loadPageOrCategoryLinks);
        }
        else {
            isCategory = false;
            $.get("getPageLinks.php", { post_title: text }, loadPageOrCategoryLinks);
        }
    };
}

function reloadVisualizerForPage(text) {
    return function(event) {
        //reload!
        isCategoryView=false;
        reloadVisualizer(text)();
    };
}

function loadRandomPage(data) {
    pageTitle = data;
    $.get("getPageLinks.php", { post_title: data }, loadPageOrCategoryLinks);
}

function firstLoad(data) {
    var lastPage = JSON.parse(data);

    // Load the links depending on whether we have a saved spot or not
    if (lastPage.random) {
        $.get("randomPage.php", {}, loadRandomPage);
    }
    else if (lastPage.isCategory) {
        isCategory = true;
        pageTitle = lastPage.category;
        $.get("getCategoryPages.php", { category: lastPage.category}, loadPageOrCategoryLinks);
    }
    else {
        pageTitle = lastPage.page;
        $.get("getPageLinks.php", { post_title: lastPage.page}, loadPageOrCategoryLinks);
    }
}

function testCallback(data) {
    var images = JSON.parse(data);
}

window.onload = function() {

    // Bind click functions to our three buttons
    $('#pages').click(function() {
        stage.reset();
        isCategoryView = false;
        if (isCategory) {
            $.get("getCategoryPages.php", { category: pageTitle }, loadPageOrCategoryLinks);
        } else {
            $.get("getPageLinks.php", { post_title: pageTitle }, loadPageOrCategoryLinks);
        }
    });
    $('#categories').click(function() {
        stage.reset();
        isCategoryView = true;
        if (isCategory) {
            $.get("getCategorySubCategories.php", { category: pageTitle }, loadPageOrCategoryLinks);
        } else {
            $.get("getCategory.php", { post_title: pageTitle }, loadPageOrCategoryLinks);
        }
    });
    $('#random').click(function() {
        stage.reset();
        isCategory = false;
        isCategoryView = false;
        $.get("randomPage.php", {}, start);
    });

    // Check to see if we have a saved spot
    $.get("getLastPageOrCategory", {}, firstLoad);

    isCategoryView = false;
    isCategory = false;

    // Construct the stage
    stage = new Kinetic.Stage({
        container: "wiki-container",
        width: 960,
        height: 960
    });
};
