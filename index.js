import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import admin from "firebase-admin";
import dotenv from "dotenv";
import multer from 'multer';
import path from 'path';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { sendMessageTest, sendOrderInProgressMessage } from "./services/whatsapp/messages.js";
import {dicomToJpg} from "./services/utils/dicomToImageAndInfo.js"
import{newMedicalTest, findMedicalTest} from './services/medicalTest/Medicaltest.js'
admin.initializeApp({
  credential: admin.credential.cert(`./${process.env.ADMIN_FIREBASE_JSON}`),
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
});
const bucket = admin.storage().bucket();

var dataBase = admin.database();
var dataBaseFire = admin.firestore();
var Auth = admin.auth();
admin.messaging();

app.use(cors());
app.use(
  bodyParser.json({
    limit: "200mb",
    verify: function (req, res, buf) {
      req.rawBody = buf;
    }
  })
);
app.set("trust proxy", true);

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);
app.use(function (req, res, next) {
  var allowedOrigins = [, "http://localhost:3000"];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: function(req, file, cb) {
    // Puedes usar Date.now() para nombres únicos o mantener el nombre original con file.originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));

  }
});

const upload = multer({ storage: storage });


app.get("/x", function (req, res) {
  sendOrderInProgressMessage('Roberto', '+523317478004','dsfd','Omaka')
  res.send("Que pasa perro? ___ooO_(_o__o_)_Ooo___");
});
app.get("/x", function (req, res) {
  sendOrderInProgressMessage('Roberto', '+523317478004','dsfd','Omaka')
  res.send("Que pasa perro? ___ooO_(_o__o_)_Ooo___");
});

app.post("/new-medical-test", function(req, res){
  const data=req.body;
  const resqMedicalTest= newMedicalTest(data, dataBaseFire,admin,bucket);
  res.send(resqMedicalTest);

})

app.post('/upload-dicom', upload.single('dicomFile'), async (req, res) => {
  if (req.file) {
    const dataDiacom=await dicomToJpg(req.file.path,'/finish', bucket);
    const dataFormulario=req.body;
    const uploadataBase= await newMedicalTest(dataFormulario,dataDiacom,dataBaseFire,admin)
    res.send('Archivo DICOM cargado con éxito');
  } else {
    res.status(400).send('No se cargó ningún archivo.');
  }
});

app.post("/response-whats", function(req, res){
  const data=req.query; 
  const responseWhats= findMedicalTest(data, dataBaseFire,admin);
  res.send(responseWhats);
})



//Write firebase const

app.use((req, _res, next) => {
  req.db = dataBaseFire; // Tu instancia de Firestore
  req.admin = admin; // Tu instancia de Firebase Admin
  next();
});


app.listen(parseInt(process.env.PORT_SERVER), function () {
  console.log("up and running on port " + process.env.PORT_SERVER);
});

