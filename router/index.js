const router = require("express").Router();
const { compare } = require("bcrypt");
const users = require("../model/allUser");
const customers = require("../model/allUser");
const historyModel = require("../model/histoyModel");

// app.post('/authenticate', (req, res) =>{

//     const {userName, password} = req.body;

//     User.findOne({usuario},(err , user) =>{
//         if(err){

//             res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');

//         }else if(!user){
//             res.status(500).send('EL USUARIO NO EXISTE');
//         }else{
//            user.isCorrectPassword(password, (err, result) =>{

//                 if(err){
//                     res.status(500).send('ERROR al AUNTENTICAR');
//                 }else if(result){
//                     res.status(200).send('USUARIO AUNTENTICADO CORRECTAMENTE');
//                 }else{

//                     res.status(500).send('USUARIO O CONTRASENA INCORRECTOS')
//                 }

//            });
//         }
//     });
// });

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/home", (req, res) => {
  res.render("home");
});

const credentials = {
  username: "ADMINB",

  password: "ADMINB",
};

// Login admin

router.post("/login", (req, res) => {
  if (
    req.body.username == credentials.username &&
    req.body.password == credentials.password
  ) {
    req.session.user = req.body.username;

    res.redirect("/router/home");
  } else {
    res.end("Incorrect credentials.");
  }
});

router.get("/home", (req, res) => {
  if (req.session.user) {
    res.render("home", { user: req.session.user });
  } else {
    res.send("Unauthorize user.");
  }
});

// router.get('/login', (req,res)=> {
//     res.render('login', {title: "login", msg:''})
// });

//  ADD USER
router.get("/adduser", (req, res) => {
  res.render("addUser", { title: "Add User", msg: "" });
});

router.post("/adduser", (req, res) => {
  const {
    userName,
    usuarioNombre,
    numeroCuenta,
    dpiNumber,
    address,
    NumeroTel,
    email,
    password,
    workName,
    ingresosMensuales,
    userAmount,
  } = req.body;

  const User = new customers({
    name: userName,
    usuario: usuarioNombre,
    accountNumber: numeroCuenta,
    dpi: dpiNumber,
    direccion: address,
    numeroTelefono: NumeroTel,
    correo: email,
    contraseña: password,
    nombreTrabajo: workName,
    ingresos: ingresosMensuales,
    amount: userAmount,
  });
  User.save()
    .then(() => {
      res.render("addUser", {
        title: "Add User",
        msg: "User Added Successfully",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//- View All User
router.get("/data", (req, res) => {
  const allData = customers.find({});
  allData.exec((err, data) => {
    if (err) {
      throw err;
    } else {
      res.render("viewUser", { title: "View Users", data: data });
    }
  });
});

// Delete User
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const updateData = customers.findByIdAndDelete({ _id: id });
  updateData.exec((err, data) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/data");
    }
  });
});

router.get("/view/:id", (req, res) => {
  const id = req.params.id;
  const Sender = customers.find({ _id: id });
  const allUser = customers.find({});
  Sender.exec((err, uData) => {
    if (err) {
      throw err;
    } else {
      allUser.exec((err, rData) => {
        if (err) {
          throw err;
        } else {
          res.render("view", { title: "view", data: uData, records: rData });
        }
      });
    }
  });
});

// Transfer
router.post("/transfer", (req, res) => {
  const {
    SenderID,
    SenderName,
    SenderDPI,
    SenderNumeroCuenta,
    reciverName,
    reciverDPI,
    reciverNumeroCuenta,
    transferAmount,
  } = req.body;
  console.log(transferAmount);
  const history = new historyModel({
    sName: SenderName,
    sDPI: SenderDPI,
    sNumeroCuenta: SenderNumeroCuenta,
    rName: reciverName,
    rDPI: reciverDPI,
    rNumeroCuenta: reciverNumeroCuenta,
    amount: transferAmount,
  });

  if (
    reciverName === "Selecciona el nombre del destinatario" ||
    reciverDPI === "Selecciona el DPI del destinatario" ||
    reciverNumeroCuenta === "Selecciona el Numero de cuenta del destinatario"
  ) {
    res.render("sucess", {
      title: "sucess",
      value: "",
      msg: "",
      errmsg: "All fields are require!",
    });
  } else {
    const Sender = customers.find({ _id: SenderID });
    const Reciver = customers.find({
      name: reciverName,
      dpi: reciverDPI,
      accountNumber: reciverNumeroCuenta,
    });

    Promise.all([Sender, Reciver])
      .then(([senderData, reciverData]) => {
        senderData.forEach(async (c) => {
          if (
            c.name === reciverName ||
            c.dpi === reciverDPI ||
            c.accountNumber === reciverNumeroCuenta ||
            c.amount < transferAmount
          ) {
            res.render("sucess", {
              title: "sucess",
              value: "",
              msg: "",
              errmsg: "Process Not Complete due to incorrect reciver details!",
            });
          } else {
            let updateAmount = parseInt(c.amount) - parseInt(transferAmount);
            await customers.findOneAndUpdate(
              { name: SenderName },
              { $set: { amount: updateAmount } }
            );
            history
              .save()
              .then((r) => {})
              .catch((err) => {
                console.log(err);
              });

            reciverData.forEach(async (e) => {
              let updateAmount = parseInt(e.amount) + parseInt(transferAmount);

              await customers.findOneAndUpdate(
                { name: reciverName },
                { $set: { amount: updateAmount } }
              );
            });
          }

          res.render("sucess", {
            title: "sucess",
            value: "True",
            msg: "Transfer Sucessfull",
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// History
router.get("/history", (req, res) => {
  const hist = historyModel.find({});
  hist.exec((err, hdata) => {
    if (err) {
      throw err;
    } else {
      res.render("history", { title: "History", data: hdata });
    }
  });
});

router.get("/remove/:id", (req, res) => {
  const id = req.params.id;
  const updateData = historyModel.findByIdAndDelete({ _id: id });
  updateData.exec((err, data) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/history");
    }
  });
});

module.exports = router;
