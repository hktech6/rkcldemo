var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var cons = require('consolidate');
var cookieParser = require('cookie-parser'); // module for parsing cookies
var app = express();
app.use(cookieParser());
var users = require('./controllers/user-controller.js');
var auth = require('./controllers/authenticate-controller.js');
var sessionstorage = require('sessionstorage');
//app.set('views', __dirname + '/app/server/views');
//app.set('view engine', 'html');
//console.log(__dirname);
//var app = require('./app');
//var Connection = require('Connection');

//require('./dist/user_data')(Connection);

//var firstParameter = {
//    config: __dirname + resolveURL('/config.json'),
//    logs: __dirname + resolveURL('/logs.json')
//};

require('rtcmulticonnection-server')(null, function (request, response, config, root, BASH_COLORS_HELPER, pushLogs, resolveURL, getJsonFile) {
    try {
        var uri, filename;

//        MongoClient.connect(mongo_url, function(err, db) {
//          console.log("test user");
//        });
            console.log(request.url);
        if (request.url == '/users/logout') {
            logout = users.logOut();
            console.log("ss");
            response.writeHead(302, {
                'Location': '/users/login'
            });
            response.end();
            return;
        }
        if (request.url == '/demos/users/list') {

            mdata = rooms.getUsersList();

//            response.writeHead(200, {
//                 'Content-Type': 'text/plain'
            //});
            mdata = JSON.stringify(mdata);
            response.write(mdata, 'binary');
            response.end();
            return;

        }

        if (request.url == '/users/register') {
            response.writeHead(200, {
                'Content-Type': "application/json; charset=utf-8"
            });

            authdata = auth.register(request, function (data) {

                authdata = JSON.stringify(data);
                response.write(authdata, 'binary');
                response.end();
            });
            return;
        }

        if (request.url == '/users/editprofile') {
            response.writeHead(200, {
                'Content-Type': "application/json; charset=utf-8"
            });

            profile = users.edit_profile(request, function (data) {
                profile_data = JSON.stringify(data);
                response.write(profile_data, 'binary');
                response.end();
            });
            return;
        }
        if (request.url == '/users/update_class') {
            response.writeHead(200, {
                'Content-Type': "application/json; charset=utf-8"
            });

            users.updateClass(request, function (data) {
                update_data = JSON.stringify(data);
                response.write(update_data, 'binary');
                response.end();
            });
            return;
        }
        if (request.url == '/users/changepassword') {
            response.writeHead(200, {
                'Content-Type': "application/json; charset=utf-8"
            });

            users.changepassword(request, function (data) {
                pass_data = JSON.stringify(data);
                response.write(pass_data, 'binary');
                response.end();
            });
            return;
        }

        try {
            if (!config.dirPath || !config.dirPath.length) {
                config.dirPath = null;
            }

            uri = url.parse(request.url).pathname;

            filename = path.join(config.dirPath ? resolveURL(config.dirPath) : process.cwd(), uri);

            if (request.url == '/demos/users') {

                // filename = filename.replace(resolveURL('/demos'), '');
                filename += resolveURL('/register.html');

                fs.readFile(filename, 'binary', function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                        response.end();
                        return;
                    }

                    response.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    response.write(file, 'binary');
                    response.end();
                    return;
                });
                return;
            }

            if (request.url == '/users/login') {

            console.log("hel");
                if (sessionstorage.getItem('users') != null) {

                    response.writeHead(302, {
                        'Location': '/users/profile'
                    });
                    response.end();
                    return;
                }

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    login = auth.login(request, function (data) {
                        authdata = JSON.stringify(data);
                        response.write(authdata, 'binary');
                        response.end();
                    });
                    return;
                } else {

                    filename = filename.replace(resolveURL('/users/login'), '');
                    filename += resolveURL('/demos/users/login.html');

                    fs.readFile(filename, 'binary', function (err, file) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                            response.end();
                            return;
                        }

                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        response.write(file, 'binary');
                        response.end();
                        return;
                    });
                    return;
                }
            }

            if (request.url == '/users/attendees') {

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    attendees = users.attendees(request, function (data) {
                        attendeesdata = JSON.stringify(data);
                        response.write(attendeesdata, 'binary');
                        response.end();
                    });
                    return;
                } else {

                    filename = filename.replace(resolveURL('/users/attendees'), '');
                    filename += resolveURL('/demos/users/attendees.html');

                    fs.readFile(filename, 'binary', function (err, file) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                            response.end();
                            return;
                        }

                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        response.write(file, 'binary');
                        response.end();
                        return;
                    });
                    return;
                }
            }

            if (request.url == '/users/classes/delete') {

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    users.deleteClasses(request, function (data) {

                        classesdata = JSON.stringify(data);
                        response.write(classesdata, 'binary');
                        response.end();
                    });
                    return;
                }
            }

            if (request.url.indexOf("classes/list") > -1) {
                if (sessionstorage.getItem('users').role == 1) {
                    users.getClassListByPresenter(function (class_data) {
                        classesdata = JSON.stringify(class_data);
                        response.write(classesdata, 'binary');
                        response.end();
                        return;
                    });
                } else {
                    users.getClassListByLearner(function (class_data) {
                        classesdata = JSON.stringify(class_data);
                        response.write(classesdata, 'binary');
                        response.end();
                        return;
                    });
                }

                return;
            }


            if (request.url == '/users/classes') {

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    users.addClasses(request, function (data) {
                        console.log(data);
                        classesdata = JSON.stringify(data);
                        console.log(classesdata);
                        response.write(classesdata, 'binary');
                        response.end();
                    });
                    return;
                } else {

                    filename = filename.replace(resolveURL('/users/classes'), '');
                    header_file = resolveURL(filename + '/demos/users/header.html');
                    filename += resolveURL('/demos/users/classes.html');

                    cons.swig(filename, {user_role: sessionstorage.getItem('users').role}, function (err, file) {
                        //fs.readFile(filename, 'binary', function (err, file) {
                            var file_html = file;
                            fs.readFile(header_file, 'binary', function (err, html) {
                                html += file_html;
                                response.writeHead(200, {
                                    'Content-Type': 'text/html'
                                });
                                response.write(html, 'binary');
                                response.end();
                                return;
                            });
                       // });
                    });


                    return;
                }
            }

            if (request.url.indexOf("invite/list") > -1) {
                users.getLearnersList(function (class_data) {
                    classesdata = JSON.stringify(class_data);
                    response.write(classesdata, 'binary');
                    response.end();
                    return;
                });
                return;
            }

            if (request.url.indexOf("classes/view") > -1) {
                qstring = request.url.split('view?id=');
                var class_id = qstring[1];
                var filename = filename.replace(resolveURL('/users/classes/view'), '');
                var header_file = resolveURL(filename + '/demos/users/header.html');
                filename += resolveURL('/demos/users/classes/view.html');

                users.getClassById(class_id, function (class_data) {
                    
                    cons.swig(filename, {class_data: class_data,'user_data' : sessionstorage.getItem('users')}, function (err, file) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                            response.end();
                            return;
                        }

                        var file_html = file;
                        fs.readFile(header_file, 'binary', function (err, html) {
                            html += file_html;
                            response.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            response.write(html, 'binary');
                            response.end();
                            return;
                        });


//                        response.write(html, 'binary');
//                        response.end();
//                        return;
                    });
                });


                /*fs.readFile(filename, 'binary', function (err, file) {
                 var file_html = file;
                 fs.readFile(header_file, 'binary', function (err, html) {
                 html += file_html;
                 response.writeHead(200, {
                 'Content-Type': 'text/html'
                 });
                 response.write(html, 'binary');
                 response.end();
                 return;
                 });
                 });*/

                return;
            }

            if (request.url == '/users/invite') {

                if (request.method == 'POST') {
                    response.writeHead(200, {
                        'Content-Type': "application/json; charset=utf-8"
                    });

                    users.sendInvites(request, function (data) {
                        // console.log(data);
                        classesdata = JSON.stringify(data);
                        //console.log(classesdata);
                        response.write(classesdata, 'binary');
                        response.end();
                    });
                    return;
                } else {

                    filename = filename.replace(resolveURL('/users/invite'), '');
                    header_file = resolveURL(filename + '/demos/users/header.html');
                    filename += resolveURL('/demos/users/invite.html');

                    fs.readFile(filename, 'binary', function (err, file) {
                        var file_html = file;
                        fs.readFile(header_file, 'binary', function (err, html) {
                            html += file_html;
                            response.writeHead(200, {
                                'Content-Type': 'text/html'
                            });
                            response.write(html, 'binary');
                            response.end();
                            return;
                        });
                    });

                    return;
                }
            }

            if (request.url == '/users/profile/setting') {
                filename = filename.replace(resolveURL('/users/profile/setting'), '');
                // filename = filename.replace(resolveURL('/demos'), '');

                filename += resolveURL('/demos/users/profile_edit.html');

                users.getUserData(function (userdata) {

                    cons.swig(filename, {user: userdata.data}, function (err, html) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                            response.end();
                            return;
                        }

                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        response.write(html, 'binary');
                        response.end();
                        return;
                    });
                });

                return;
            }

            if (request.url == '/users/profile') {

                filename = filename.replace(resolveURL('/users/profile'), '');

                filename += resolveURL('/demos/users/profile.html');

                users.getUserData(function (userdata) {

                    cons.swig(filename, {user: userdata.data}, function (err, html) {
                        if (err) {
                            response.writeHead(500, {
                                'Content-Type': 'text/plain'
                            });
                            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                            response.end();
                            return;
                        }

                        response.writeHead(200, {
                            'Content-Type': 'text/html'
                        });
                        response.write(html, 'binary');
                        response.end();
                        return;
                    });
                });

                return;
            }


        } catch (e) {
            pushLogs(root, 'url.parse', e);
        }

        filename = (filename || '').toString();

        if (request.method !== 'GET' || uri.indexOf('..') !== -1) {
            try {
                response.writeHead(401, {
                    'Content-Type': 'text/plain'
                });
                response.write('401 Unauthorized: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '!GET or ..', e);
            }
        }

        if (filename.indexOf(resolveURL('/admin/')) !== -1 && config.enableAdmin !== true) {
            try {
                response.writeHead(401, {
                    'Content-Type': 'text/plain'
                });
                response.write('401 Unauthorized: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '!GET or ..', e);
            }
            return;
        }

        var matched = false;
        ['/demos/', '/dev/', '/dist/', '/routes/', 'connection', '/socket.io/', '/node_modules/canvas-designer/', '/admin/'].forEach(function (item) {
            if (filename.indexOf(resolveURL(item)) !== -1) {
                matched = true;
            }
        });

        // files from node_modules
        ['RecordRTC.js', 'FileBufferReader.js', 'getStats.js', 'getScreenId.js', 'adapter.js', 'MultiStreamsMixer.js'].forEach(function (item) {
            if (filename.indexOf(resolveURL('/node_modules/')) !== -1 && filename.indexOf(resolveURL(item)) !== -1) {
                matched = true;
            }
        });


        if (filename.search(/.js|.json/g) !== -1 && !matched) {
            try {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            } catch (e) {
                pushLogs(root, '404 Not Found', e);
            }
        }

        ['Video-Broadcasting', 'Screen-Sharing', 'Switch-Cameras'].forEach(function (fname) {
            try {
                if (filename.indexOf(fname + '.html') !== -1) {
                    filename = filename.replace(fname + '.html', fname.toLowerCase() + '.html');
                }
            } catch (e) {
                pushLogs(root, 'forEach', e);
            }
        });

        var stats;

        try {
            stats = fs.lstatSync(filename);

            if (filename.search(/demos/g) === -1 && filename.search(/admin/g) === -1 && stats.isDirectory() && config.homePage === '/demos/index.html') {

                if (response.redirect) {

                    response.redirect('/demos/');
                } else {

                    response.writeHead(301, {
                        'Location': '/demos/'
                    });
                }
                response.end();
                return;
            }
        } catch (e) {

            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        try {


            if (fs.statSync(filename).isDirectory()) {
                response.writeHead(404, {
                    'Content-Type': 'text/html'
                });


                if (filename.indexOf(resolveURL('/demos/MultiRTC/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/MultiRTC/'), '');
                    filename += resolveURL('/demos/MultiRTC/index.html');
                } else if (filename.indexOf(resolveURL('/admin/')) !== -1) {
                    filename = filename.replace(resolveURL('/admin/'), '');
                    filename += resolveURL('/admin/index.html');
                } else if (filename.indexOf(resolveURL('/demos/dashboard/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/dashboard/'), '');
                    filename += resolveURL('/demos/dashboard/index.html');
                } else if (filename.indexOf(resolveURL('/demos/video-conference/')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/video-conference/'), '');
                    filename += resolveURL('/demos/video-conference/index.html');
                } else if (filename.indexOf(resolveURL('/demos')) !== -1) {
                    filename = filename.replace(resolveURL('/demos/'), '');
                    filename = filename.replace(resolveURL('/demos'), '');
                    filename += resolveURL('/demos/index.html');
                } else {

                    filename += resolveURL(config.homePage);
                }

            }
        } catch (e) {
            pushLogs(root, 'statSync.isDirectory', e);
        }

        var contentType = 'text/plain';
        if (filename.toLowerCase().indexOf('.html') !== -1) {
            contentType = 'text/html';
        }
        if (filename.toLowerCase().indexOf('.css') !== -1) {
            contentType = 'text/css';
        }
        if (filename.toLowerCase().indexOf('.png') !== -1) {
            contentType = 'image/png';
        }
        if (filename.indexOf(resolveURL('/demos/dashboard/')) !== -1) {
            //filename = filename.replace(resolveURL('/demos/dashboard/'), '');

        }
        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                response.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                response.write('404 Not Found: ' + path.join('/', uri) + '\n');
                response.end();
                return;
            }

            try {
                file = file.replace('connection.socketURL = \'/\';', 'connection.socketURL = \'' + config.socketURL + '\';');
            } catch (e) {
            }

            response.writeHead(200, {
                'Content-Type': contentType
            });
            response.write(file, 'binary');
            response.end();
        });
    } catch (e) {
        pushLogs(root, 'Unexpected', e);

        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: Unexpected error.\n' + e.message + '\n\n' + e.stack);
        response.end();
    }
});
