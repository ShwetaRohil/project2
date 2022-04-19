let addDepartment = function(db, cname, obj_add, res, stringify) {
    try {
        let obj = obj_add;
        db.collection(cname).insertOne(obj, (err) => {
            let inserted_id = obj._id;
            if (err) {
                let obj = {};
                obj.msg = "department Already Exists";
                obj.error = 409;
                res
                    .code(409)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            } else {
                let obj = {};
                obj.msg = "department Added";
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

let removeDepartment = function(db, cname, id, res, stringify) {
    db.collection(cname).deleteOne({
        _id: id
    }, (err, result) => {
        if (result.deletedCount === 0) {
            let obj = {};
            obj.msg = "department doesnt exist";
            obj.error = 404;
            res
                .code(404)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(stringify(obj));
        } else {
            let obj = {};
            obj.msg = "Department Deleted and Deleted Count: " + result.deletedCount;
            obj.error = 0;
            res
                .code(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(stringify(obj))
        }
    })
}

let updateDepartment = function(db, cname, id, department, res, stringify) {
    try {
        let id_to_update = id;
        let myquery = {
            _id: id_to_update
        }
        let newvalues = {
            $set: {
                d: department
            }
        }

        db.collection(cname).updateOne(myquery, newvalues, (err, result) => {
            if (result.matchedCount === 0) {
                let obj = {};
                obj.msg = "Department doesn't exist",
                    obj.error = 404
                res
                    .code(404)
                    .header('Content-Type', 'application/json; charset=utf-8')
                    .send(stringify(obj))
            } else {
                let obj = {};
                obj.msg = "Department Updated";
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

let listDepartments = function(db, cname, res) {
    db.collection(cname).find({}).toArray((err, result) => {
        res.send(result);
    })
}


module.exports = {
    addDepartment,
    removeDepartment,
    updateDepartment,
    listDepartments
}