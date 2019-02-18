var connection = require('./../dbconnection');
var mail = require('./../sendEmail');
var passwordHash = require('password-hash');
var sessionstorage = require('sessionstorage');
var dateFormat = require('dateformat');


var req_count = 0;

getUserDataById = function (id, callback) {
    class_sql = "select * from users where id='" + id + "' limit 1";
    connection.query(class_sql, function (err, result, fields) {
        if (err) {

        } else {
            callback(result[0]);
            return;
        }
    });
}

module.exports.getClassById = function (id, callback) {
    var sql = "select * from classes where id= '" + id + "' limit 1";

    connection.query(sql, function (err, result, fields) {

        if (err) {
            return err;
        } else {
            callback(result);
        }

    });
}

module.exports.sendInvites = function (req, callback) {
    var presenter_id = sessionstorage.getItem('users').id;
    var body = '';
    var hostname = req.headers.host;
    req.on('data', chunk => {

        body += chunk.toString(); // convert Buffer to string
    });
    var response = '';

    req.on('end', function () {

        body = decodeURIComponent(body);
        var post = parseQuery2(body);

        var invite_ids = post.invite_send.split(",");

        var now = new Date();
        var created_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
        var sql = "insert into invite (user_id,invited_by,class_id,invited_at,status) values";
        for (i = 0; i < invite_ids.length; i++) {
            sql += '("' + invite_ids[i] + '","' + presenter_id + '","' + post.invite_class + '","' + created_at + '","1"),';
            //get class data

            getUserDataById(invite_ids[i], function (user_data) {

                var receiver_name = user_data['user_name'];
                var receiver_email = user_data['email'];
                class_sql = "select class_name,presenter_name,class_start_on,class_end_on from classes where id='" + post.invite_class + "' limit 1";
                connection.query(class_sql, function (err, class_result, fields) {

                    if (err) {

                    } else {

                        start = dateFormat(class_result[0].class_start_on, "dd/mm/yyyy h:MM:ss TT");
                        end = dateFormat(class_result[0].class_end_on, "dd/mm/yyyy h:MM:ss TT");
                        class_data = {'start': start, 'end': end, 'class_name': class_result[0].class_name, 'presenter_name': class_result[0].presenter_name};

                        class_data = {'class_data': class_data, 'email': receiver_email, 'user_name': receiver_name, 'class_link': hostname + '/users/classes/view?id=' + post.invite_class};

                        mail.sendInviteMail(class_data, function (data) {
                            //callback(data);
                        });
                    }
                });
            })
        }


         sql = sql.slice(0,-1);
        
        connection.query(sql, function (err, result) {

            if (err) {
                response = {
                    status: false,
                    message: 'there are some error with query'
                };
                callback(response);
            } else {
                response = {
                    status: 1,
                    message: "User invited successfuly"
                };
                callback(response);
            }

        });
    });

}

module.exports.getLearnersList = function (callback) {
    var presenter_id = sessionstorage.getItem('users').id;
    //var presenter_id = 9;

    var sql = "select * from users where role= '2' order by id desc";

    connection.query(sql, function (err, result, fields) {

        if (err) {
            return err;
        } else {
            //var result_data = {};
            var result_data = [];
            var result2 = {};
            var now = new Date();
            result.forEach(function (items) {
                mydata = [items.id,
                    (items.first_name + ' ' + items.last_name),
                    items.user_name,
                    items.email,
                    items.mobile_no,
                    items.id
                ];
                result_data.push(mydata);
            });


            result2.draw = req_count++;
            result2.recordsTotal = result_data.length;
            result2.recordsFiltered = result_data.length;
            result2.data = result_data;
            callback(result2);
        }

    });
}


module.exports.deleteClasses = function (req, callback) {
    var body = '';

    req.on('data', chunk => {

        body += chunk.toString(); // convert Buffer to string
    });
    var response = '';
    req.on('end', function () {
        var delete_ids = body;

        sql = "delete from classes where id IN (" + delete_ids + ")";
        //console.log(sql);
        connection.query(sql, function (err, result) {

            if (err) {
                response = {
                    status: false,
                    message: 'there are some error with query'
                };
                callback(response);
            } else {
                response = {
                    status: 1,
                    message: "Selected Classrooms deleted successfuly"
                };
                callback(response);
            }

        });

    });

}

module.exports.getClassListByLearner = function (callback) {
    var user_id = sessionstorage.getItem('users').id;
    
    var sql = "select cls.* from classes cls left join invite inv on inv.class_id = cls.id where inv.user_id=" + user_id + " order by id desc";

    connection.query(sql, function (err, result, fields) {

        if (err) {
            return err;
        } else {
            //var result_data = {};
            var result_data = [];
            var result2 = {};
            var now = new Date();
            result.forEach(function (items) {
                mydata = [items.id,
                    items.class_name,
                    items.class_type,
                    dateFormat(items.class_start_on, "dd/mm/yyyy h:MM:ss"),
                    dateFormat(items.class_end_on, "dd/mm/yyyy h:MM:ss"),
                    (items.status == 1) ? 'Active' : 'Inactive',
                    dateFormat(items.created_at, "dd/mm/yyyy h:MM:ss"),
                    items.id,
                    items.presenter_name,
                    items.status,
                    dateFormat(items.class_start_on, "yyyy/mm/dd h:MM:ss"),
                    dateFormat(items.class_end_on, "yyyy/mm/dd h:MM:ss"),
                    sessionstorage.getItem('users').role
                ];
                result_data.push(mydata);
            });


            result2.draw = req_count++;
            result2.recordsTotal = result_data.length;
            result2.recordsFiltered = result_data.length;
            result2.data = result_data;

            callback(result2);
        }

    });
}


module.exports.getClassListByPresenter = function (callback) {
    var presenter_id = sessionstorage.getItem('users').id;

    var sql = "select * from classes where presenter_id=" + presenter_id + " order by id desc";
    
    connection.query(sql, function (err, result, fields) {

        if (err) {
            return err;
        } else {
            //var result_data = {};
            var result_data = [];
            var result2 = {};
            var now = new Date();
            result.forEach(function (items) {
                mydata = [items.id,
                    items.class_name,
                    items.class_type,
                    dateFormat(items.class_start_on, "dd/mm/yyyy h:MM:ss"),
                    dateFormat(items.class_end_on, "dd/mm/yyyy h:MM:ss"),
                    (items.status == 1) ? 'Active' : 'Inactive',
                    dateFormat(items.created_at, "dd/mm/yyyy h:MM:ss"),
                    items.id,
                    items.presenter_name,
                    items.status,
                    dateFormat(items.class_start_on, "yyyy/mm/dd h:MM:ss"),
                    dateFormat(items.class_end_on, "yyyy/mm/dd h:MM:ss"),
                    sessionstorage.getItem('users').role
                ];
                result_data.push(mydata);
            });


            result2.draw = req_count++;
            result2.recordsTotal = result_data.length;
            result2.recordsFiltered = result_data.length;
            result2.data = result_data;

            callback(result2);
        }

    });
}

module.exports.addClasses = function (req, callback) {
    var presenter_id = sessionstorage.getItem('users').id;

    var body = '';

    req.on('data', chunk => {

        body += chunk.toString(); // convert Buffer to string
    });
    var response = '';

    req.on('end', function () {

        body = decodeURIComponent(body);

        var post = parseQuery2(body);

        connection.query('SELECT * FROM classes WHERE presenter_id = "' + presenter_id + '" and class_name="' + post.class_id + '"', function (error, results, fields) {

            if (error) {
                response = {
                    status: false,
                    message: 'there are some error with query'
                };
                callback(response);
            } else {
                if (results.length > 0) {
                    response = {
                        status: 0,
                        'error_type': 'class',
                        message: "Entered class already exist"
                    };
                    callback(response);
                } else {
                    var now = new Date();
                    var created_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                    var class_start_on = dateFormat(new Date(post.date_start.replace("+", " ")), "yyyy-mm-dd HH:MM:ss");
                    var class_end_on = dateFormat(new Date(post.date_end.replace("+", " ")), "yyyy-mm-dd HH:MM:ss");

                    var sql = "insert into classes (presenter_id,class_name,presenter_name,class_type,class_start_on,class_end_on,created_at)\n\
                        values('" + presenter_id + "','" + post.class_id + "','" + post.user_name + "','" + post.class_type + "', '" + class_start_on + "','" + class_end_on + "','" + created_at + "')";

                    connection.query(sql, function (err, result) {

                        if (err) {
                            response = {
                                status: false,
                                message: 'there are some error with query'
                            };
                            callback(response);
                        } else {
                            response = {
                                status: 1,
                                message: "Class room added successfuly"
                            };
                            callback(response);
                        }

                    });
                }
            }
        }
        );


    });
}


module.exports.updateClass = function (req, callback) {
    var presenter_id = sessionstorage.getItem('users').id;

    var body = '';

    req.on('data', chunk => {

        body += chunk.toString(); // convert Buffer to string
    });
    var response = '';

    req.on('end', function () {

        body = decodeURIComponent(body);

        var post = parseQuery2(body);

        connection.query('SELECT * FROM classes WHERE presenter_id = "' + presenter_id + '" and id !="' + post.edit_id + '" and class_name="' + post.class_id + '"', function (error, results, fields) {

            if (error) {
                response = {
                    status: false,
                    message: 'there are some error with query'
                };
                callback(response);
            } else {
                if (results.length > 0) {
                    response = {
                        status: 0,
                        'error_type': 'class',
                        message: "Entered class already exist"
                    };
                    callback(response);
                } else {
                    var now = new Date();
                    var updated_at = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
                    var class_start_on = dateFormat(new Date(post.date_start.replace("+", " ")), "yyyy-mm-dd HH:MM:ss");
                    var class_end_on = dateFormat(new Date(post.date_end.replace("+", " ")), "yyyy-mm-dd HH:MM:ss");

                    var sql = "update classes set class_name='" + post.class_id + "',presenter_name = '" + post.user_name + "',class_type='" + post.class_type + "',class_start_on='" + class_start_on + "',class_end_on='" + class_end_on + "',updated_on='" + updated_at + "' where id='" + post.edit_id + "'";


                    connection.query(sql, function (err, result) {

                        if (err) {
                            response = {
                                status: false,
                                message: 'there are some error with query'
                            };
                            callback(response);
                        } else {
                            response = {
                                status: 1,
                                message: "Class room updated successfuly"
                            };
                            callback(response);
                        }

                    });
                }
            }
        }
        );


    });
}

module.exports.logOut = function () {
    console.log("hellossss");
    sessionstorage.removeItem('users');
    sessionstorage.clear();
    return;
}
module.exports.getUserData = function (callback) {
    var user_id = sessionstorage.getItem('users').id;

    var sql = "select * from users where id=" + user_id;

    connection.query(sql, function (err, result, fields) {

        if (err) {
            return err;
        } else {
            result_data = {
                'data': result,
                'status': 1
            }

            callback(result_data);

        }

    });
}

module.exports.changepassword = function (req, callback) {
    if (req.method == 'POST') {
        var body = '';

        req.on('data', chunk => {

            body += chunk.toString(); // convert Buffer to string
        });


        req.on('end', function () {

            body = decodeURIComponent(body);
            var post = parseQuery2(body);
            var user_id = sessionstorage.getItem('users').id;

            //check current password is metching
            var sql = "select password from users where id = '" + user_id + "' limit 1";
            connection.query(sql, function (err, result, fields) {

                if (err) {
                    return err;
                } else {

                    if (result.length > 0) {

                        if (passwordHash.verify(post.current_password, result[0].password) == true) {
                            //update with new password
                            hashedPassword = passwordHash.generate(post.password);
                            update_pass = "update users set password = '" + hashedPassword + "' where id='" + user_id + "'";

                            connection.query(update_pass, function (err, result) {

                                if (err) {
                                    return err;
                                } else {
                                    result_data = {
                                        'affectedRows': result.affectedRows,
                                        'status': 1,
                                        'message': 'Password updated successfuly'
                                    }

                                    callback(result_data);
                                    return;
                                }

                            });


                        } else {
                            //cant update due to not matched old password
                            result_data = {
                                'data': '',
                                'status': 0,
                                'message': 'Current password does not matched'
                            }
                            callback(result_data);
                            return;
                        }
                    } else {
                        //record not found
                        result_data = {
                            'data': '',
                            'status': 0,
                            'message': 'Record not found'
                        }
                        callback(result_data);
                        return;
                    }


                }

            });
        });

    }
}
module.exports.edit_profile = function (req, callback) {

    if (req.method == 'POST') {
        var body = '';

        req.on('data', chunk => {

            body += chunk.toString(); // convert Buffer to string
        });
        var response = '';

        req.on('end', function () {

            body = decodeURIComponent(body);
            var post = parseQuery2(body);
            var user_id = sessionstorage.getItem('users').id;

            var sql = "update users set first_name='" + post.first_name + "',last_name='" + post.last_name + "',mobile_no='" + post.mobile_no + "',";
            sql += "country='" + post.country + "',state='" + post.state + "',city='" + post.city + "',zip='" + post.zip + "' where id='" + user_id + "'";

            connection.query(sql, function (err, result) {

                if (err) {
                    return err;
                } else {
                    result_data = {
                        'affectedRows': result.affectedRows,
                        'status': 1,
                        'message': 'Profile updated successfuly'
                    }
                    callback(result_data);

                }

            });
        });

    }


}



function parseQuery2(queryStr) {

    queryArr = queryStr.replace('?', '').split('&'),
            queryParams = {};
    var str = {};
    for (var q = 0, qArrLength = queryArr.length; q < qArrLength; q++) {
        var qArr = queryArr[q].split('=');
        //queryParams[qArr[0]] = qArr[1];
        //str{qArr[0]} = qArr[1];
        queryParams[qArr[0]] = qArr[1].replace("+", " ");

    }
    //queryParams.push(str);
    return queryParams;
}
