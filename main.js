"use strict";
const e = require("./employee");
const d = require("./department")
const path = require('path');

const {
    MongoClient,
    ObjectId
} = require("mongodb");

const uri = "mongodb+srv://shweta:shweta1234@brizy.3dxsj.mongodb.net/test?authSource=admin&replicaSet=atlas-qkjtw3-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var db = client.db("office");

const fastify = require('fastify')({
    logger: false
});

fastify.register(require('fastify-cors'), {
    // put your options here
    origin: "*"
});

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public')
});

const fastJson = require('fast-json-stringify')

const stringify = fastJson({
    title: 'Response',
    type: 'object',
    properties: {
        msg: {
            type: 'string'
        },
        error: {
            type: 'integer'
        },
        _id: {
            type: 'string'
        }
    }
})

client.connect(() => {

    fastify.listen(80, (err) => {
        if (err) {
            console.log(err)
            console.log("Error occured in listening to server")
        } else {
            console.log("Listening at port 80")
        }
    })

    fastify.get('/addemployee', (req, res) => {
        let firstname = req.query.fn;
        let lastname = req.query.ln;
        let dob = req.query.dob;
        let department = req.query.d;
        let obj = {};
        obj.fn = firstname;
        obj.ln = lastname;
        obj.dob = dob;
        obj.d = department;
        e.addEmployee(db, "employees", obj, res, stringify);
    })

    fastify.get('/removeemployee', (req, res) => {
        let _id = ObjectId(req.query._id);
        e.removeEmployee(db, "employees", _id, res, stringify)
    })

    fastify.get('/updateemployee', (req, res) => {
        let _id = ObjectId(req.query._id);
        let firstname = req.query.fn;
        let lastname = req.query.ln;
        let dob = req.query.dob;
        let dept = req.query.d;

        console.log(_id);
        console.log(firstname);
        console.log(lastname);
        console.log(dob);
        console.log(dept);
        // console.log(_id);
        // console.log(firstname);
        e.updateEmployee(db, "employees", _id, firstname, lastname, dob, dept, res, stringify)
    })


    fastify.get('/updatedepartment', (req, res) => {
        let _id = ObjectId(req.query._id);
        let department = req.query.department;
        d.updateDepartment(db, "department", _id, department, res, stringify)
    })

    fastify.get('/adddepartment', (req, res) => {
        let department = req.query.department;
        let obj = {};
        obj.d = department;
        d.addDepartment(db, "department", obj, res, stringify);
    })

    fastify.get('/removedepartment', (req, res) => {
        let _id = ObjectId(req.query._id);
        d.removeDepartment(db, "department", _id, res, stringify)
    })

    fastify.get('/listemployees', (req, res) => {
        let department = req.query.department;
        // console.log(department);
        // console.log(typeof(department));
        e.listEmployees(db, "employees", department, res)
    })

    fastify.get('/listdepartment', (req, res) => {
        d.listDepartments(db, "department", res)
    })

    fastify.get('/ui/showemployees', (req, res) => {
        res.sendFile("showemployeestabulator.html")
    })

    fastify.get('/dummy', (req, res) => {
        res.sendFile("dummy.html")
    })

})