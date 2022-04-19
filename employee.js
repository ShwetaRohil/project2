let addEmployee = function (db, cname, obj_add, res, stringify) {
    try {
        let obj = obj_add;
        db.collection(cname).insertOne(obj, (err) => {
            let inserted_id = obj._id;
            if (err) {
                let obj = {};
                obj.msg = "Employee Already Exists";
                obj.error = 409;
                res
                    .code(409)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            } else {
                let obj = {};
                obj.msg = "EMployee Added";
                obj.error = 0;
                obj._id = inserted_id
                res
                    .code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            }
        })
    } catch (e) {
        console.log(e);
    }
}

let removeEmployee = function (db, cname, id, res, stringify) {
    db.collection(cname).deleteOne({
        _id: id
    }, (err, result) => {
        if (result.deletedCount === 0) {
            let obj = {};
            obj.msg = "Employee doesnt exist";
            obj.error = 404;
            res
                .code(404)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(stringify(obj));
        } else {
            let obj = {};
            obj.msg = "Employee Deleted and Deleted Count: " + result.deletedCount;
            obj.error = 0;
            res
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(stringify(obj))
        }
    })
}

let updateEmployee = function (db, cname, id, firstname, lastname, dob, dept, res, stringify) {
    try {
        let id_to_update = id;
        let myquery = {
            _id: id_to_update
        }
        let newvalues = {
            $set: {
                fn: firstname,
                ln: lastname,
                dob:dob,
                d:dept
            }
        }

        db.collection(cname).updateOne(myquery, newvalues, (err, result) => {
            if (result.matchedCount === 0) {
                let obj = {};
                obj.msg = "Employee doesn't exist",
                    obj.error = 404
                res
                    .code(404)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            } else {
                let obj = {};
                obj.msg = "Employee Updated";
                obj.error = 0;
                res
                    .code(200)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            }
        })
    } catch (e) {
        console.log("Error occured in update_chat_room function : " + e)
    }
}

let listEmployees = function (db, cname, department, res) {
    try {

        if (typeof (department) === "undefined") {
            db.collection(cname).find({}).toArray((err, result) => {
                res.send(result);
            })
        } else {
            let dept = department;
            db.collection(cname).find({
                d: dept
            }).toArray((err, result) => {
                res.send(result);
            })
        }

    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    addEmployee,
    removeEmployee,
    updateEmployee,
    listEmployees
}