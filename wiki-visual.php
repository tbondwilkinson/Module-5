<!DOCTYPE html>
<html>
<head>
    <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css" type="text/css" rel="Stylesheet" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>
    <script src="kinetic-v4.0.min.js"></script>

    <script type="text/javascript">
        var stage;
        var pageTitle;

        function sanitize(string) {
            return string.replace("_", " ");
        }

        function loadPageLinks(data) {
            var json = JSON.parse(data);

            var layer = new Kinetic.Layer();

            var oval = new Kinetic.Ellipse({
                x: stage.getWidth() / 2,
                y: stage.getHeight() / 2,
                radius: {
                    x: 80,
                    y: 30,
                },
                fill: "yellow",
                stroke: "black",
                strokeWidth: 1
            });

            // add the shape to the layer
            layer.add(oval);

            var label = new Kinetic.Text({
                x: oval.getX() - oval.getRadius().x,
                y: oval.getY() - 8,
                text: sanitize(pageTitle),
                fontSize: 16,
                fontFamily: "Calibri",
                textFill: "green",
                width: oval.getWidth(),
                align: 'center',
                padding: 0
            });

            layer.add(label)

            // add the layer to the stage
            stage.add(layer);
        }

        function loadCategory(event) {
        }

        window.onload = function() {
            // Get the list of images that we will be landmarking from the server.
            var randomPageTitle = "Adobe_Illustrator";
            pageTitle = randomPageTitle;
            $.get("getPageLinks.php", { post_title: randomPageTitle }, loadPageLinks);

            $.get("getCategory.php", { post_title: randomPageTitle }, loadCategory);

            stage = new Kinetic.Stage({
                container: "wiki-container",
                width: 600,
                height: 600
            });
        };
    </script>

</head>
<body>
    <div id="wiki-container"></div>
</html>

