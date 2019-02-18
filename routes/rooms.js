var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "demo"
});



exports.getUsersList = function () {
    var sql = "select * from wp_users";
    con.query(sql, function (err, result) {
        if (err)
            throw err;
        console.log(result.affectedRows + " record(s) updated");
        console.log(result);
    });

    mdata = {
        "name": "Sara bh",
        "age": 23,
        "gender": "Female",
        "department": "History",
        "car": "Honda"
    };

    return mdata;

}


