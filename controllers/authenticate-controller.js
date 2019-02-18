var connection = require('./../dbconnection');
var passwordHash = require('password-hash');
var sessionstorage = require('sessionstorage');
var dateFormat = require('dateformat');

module.exports.login = function (req, callback) {
    if (req.method == 'POST') {
        var body = '';

        req.on('data', chunk => {

            body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', function () {
            body = decodeURIComponent(body);
            var post = parseQuery2(body);

            connection.query('SELECT * FROM users WHERE email = "' + post.email + '"', function (error, results, fields) {
                //console.log(results.length);
                if (results.length < 1) {
                    response = {
                        'status': 0,
                        'message': 'Entered email does not exist',
                        'data': ''
                    }

                } else {


                    if (passwordHash.verify(post.password, results[0].password) == true) {

//                        sessionstorage.setItem('email', results[0].email);
//                        sessionstorage.setItem('id', results[0].email);
//                        sessionstorage.setItem('loggedin', '1');
                        sessionstorage.setItem('users', results[0]);

                        response = {
                            'status': 1,
                            'message': '',
                            'data': results
                        }

                    } else {
                        response = {
                            'status': 0,
                            'message': 'Password does not match',
                            'data': ''
                        }
                    }

                }
                //console.log(response);
                callback(response);
            });

        });
    }
}
module.exports.register = function (req, callback) {

    if (req.method == 'POST') {
        var body = '';

        req.on('data', chunk => {

            body += chunk.toString(); // convert Buffer to string
        });
        var response = '';

        req.on('end', function () {

            body = decodeURIComponent(body);
            var post = parseQuery2(body);

            connection.query('SELECT * FROM users WHERE email = ?', [post.email], function (error, results, fields) {

                if (error) {
                    response = {
                        status: false,
                        message: 'there are some error with query'
                    };
                    callback(response);
                } else {

                    if (results.length > 0) {

                        response = {
                            status: false,
                            'error_type': 'email',
                            message: "Entered Email already exist"
                        };
                        callback(response);
                    } else {
                        hashedPassword = passwordHash.generate(post.password);
                        var now = new Date();
                        var created_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                        role = post.user_type;
                        
                                var sql = "insert into users (user_name,first_name,last_name,email,password,mobile_no,created_at,role) values('" + post.user_name + "','" + post.first_name + "','" + post.last_name + "', '" + post.email + "','" + hashedPassword + "','" + post.mobile_no + "','" + created_at + "','" + role + "')";
                        
                        connection.query(sql, function (err, result) {

                            if (err) {
                                return err;
                            } else {
                                result_data = {
                                    'affectedRows': result.affectedRows,
                                    'insertId': result.insertId,
                                    'status': 1
                                }
                                callback(result_data);

                            }

                        });
                    }
                }
            });


        });

    }


}

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function parseQuery2(queryStr) {

    queryArr = queryStr.replace('?', '').split('&'),
            queryParams = {};
    var str = {};
    for (var q = 0, qArrLength = queryArr.length; q < qArrLength; q++) {
        var qArr = queryArr[q].split('=');
        //queryParams[qArr[0]] = qArr[1];
        //str{qArr[0]} = qArr[1];
        queryParams[qArr[0]] = qArr[1];

    }
    //queryParams.push(str);
    return queryParams;
}
