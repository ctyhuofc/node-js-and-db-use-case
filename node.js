const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./Models/Student');

app.use(express.json()); 

app.use(express.urlencoded({extended: false}));
var numOfGets = 0;
var numOfPosts = 0;
var numOfDeletes = 0;
var numOfPuts = 0;
var numOfPatches = 0;



//Establish connetion to database
config.authenticate().then(function(){
    console.log('Database is connected');
}).catch(function(err){
    console.log(err);
});

//List indiv students
app.get('/:id', function(req, res,next){
    numOfGets++;
    let id = req.params.id;
    Student.findByPk(id).then(function(result){
        res.status(200).send(result);
        next();
    }).catch(function(err){
        res.status(500).send(err);
    });
});
//List ALL students
app.get('/', function(req, res, next){
    numOfGets++;
    Student.findAll().then(function(result){
        res.status(200).send(result);
        next()
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Create a new student
app.post('/', function(req, res, next){
    numOfPosts++;
    Student.create(req.body).then(function(result){
        next()
        res.redirect('/'); //Redirect to the get route to display all students
    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Update the nationality of a student
app.patch('/:id', function(req, res){
    numOfPatches++
    let id = req.params.id;

    //Find the student 
    Student.findByPk(id).then(function(result){
        //Check if student was found
        if(result){
            //Update student record
            result.nationality = req.body.nationality;

            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

//update a student by put

app.put('/:id', function(req, res, next){
    numOfPuts++
    let id = req.params.id;

    //Find the student 
    Student.findByPk(id).then(function(result){
        //Check if student was found
        if(result){
            //Update student record

            result.id = req.body.id;
            result.name = req.body.name;
            result.section = req.body.section,
            result.gpa = req.body.gpa,
            result.nationality = req.body.nationality

            //Save changes to DB
            result.save().then(function(){
                res.redirect('/');
                next()
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

//Delete a student record
app.delete('/:id', function(req, res, next){
    let id = req.params.id;
    numOfDeletes++
    //Find the student
    Student.findByPk(id).then(function(result){

        if(result){
            //Delete student from database
            result.destroy().then(function(){
                next()
                res.redirect('/');
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else {
            res.status(404).send('Student record not found');
        }

    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.use(custom_middleware);

function custom_middleware(req, res, next) {

    console.log(' GETS: '+numOfGets+'\n','POSTS: ' +numOfPosts+'\n','DELETES: '+numOfDeletes+'\n','PUTS: '+numOfPuts+'\n','PATCHES: '+numOfPatches);
    next();
};


app.listen(3000, function(){
    console.log('Server running on port 3000...');
});


// const express = require('express');
// const sequelize = require('./config');
// const app = express();

// sequelize.authenticate().
// then(()=>{console.log('connection has been established successfully');})
// .catch((err)=>{console.log(err);});


// app.use(express.json()); 

// app.get('/students', (req,res)=>{
//     res.send(students)
// });

// app.get('/students/:id', (req, res)=>{
//     const student = students.find((element)=>{
//     if (element.id === parseInt(req.params.id)) 
//     return true});
//     if (student) {return res.status(200).send(student);}
//     return res.status(404).send('Wrong ID, No Student Found ');
//     });

// app.post('/students/add_student', (req, res)=>{
//     const student = {
//         id: req.body.id,
//         name: req.body.name,
//         section: req.body.section,
//         gpa: req.body.gpa,
//         nationality: req.body.nationality
//     };
//     students.push(student);
//     res.status(200).send(student);
//     });

//     app.put('/students/overwrite_student/:id', (req, res)=>{
//         const student = students.find((element)=>{
//         if(element.id === parseInt(req.params.id) )
//             {return true;}
//         });
       
//         if(student){
//             student.id = req.body.id;
//             student.name = req.body.name;
//             section = req.body.section,
//             gpa = req.body.gpa,
//             nationality = req.body.nationality
//             return res.status(200).send(student);
//         }
//         return res.status(404).send('Wrong ID, No student Found');
//     });

//     app.patch('/students/update_student/:id', (req, res)=>{
//         const student = students.find((element)=>{
//         if (element.id === parseInt(req.params.id)) 
//         {return true;}
//         });
//         if (student) {
//         for (let i in req.body){
//         student[i] = req.body[i];
//         }
//         return res.status(200).send(student);
//         }
//         return res.status(404).send('Wrong ID, No Student Found');
//         });

//         app.delete('/students/delete/:id', (req, res)=>{

//             const student = students.find((element)=>{
//                 {return true;}
//             });
//             if(student){
//                 const index = students.indexOf(student);
//                 students.splice(index, 1);
//                 return res.status(200).send(student);
//             }
//             return res.status(404).send('Wrong ID, No Student Found');
//         });
// app.listen(3000, function(){
// console.log('at port 3000 server is ON')
// });

// const students = [{id: 1, name: "Donald Duck", section: 'Ducks', gpa: 3.0, nationality : 'German'},
// {id: 2, name: "Micky Mouse", section: 'Mice', gpa: 2.6, nationality : 'American'},
// {id: 3, name: "Goofy Dog", section: 'Dogs', gpa: 1.5, nationality : 'British'},
// {id: 4, name: "John Candy", section: 'Humans', gpa: 3.9, nationality : 'Canadian'},

// ]