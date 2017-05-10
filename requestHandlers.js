var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function start(response, postData) {
    console.log("Request handler 'start' was called.");

    var body = '<!doctype html>' +
        '<html>' +
        '<head>' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="upload">' +
        '<input type="submit" value="Submit file" />' +
        '</form>' +
        '</body>' +
        '</html>';
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(body);
    response.end();

}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.uploadDir = "./tmp";
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "./tmp/test.png");
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("received image:<br/>");
        response.write("<img src='/show'/>");
        response.end();
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("./tmp/test.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, { "Content-Type": "image/png" });
            response.write(file, "binary");
            response.end();
        }
    });
}
exports.start = start;
exports.upload = upload;
exports.show = show;
