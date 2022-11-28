//https://github.com/richardgirges/express-fileupload
// Importing express module
//var express = require("express");
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import multer from 'multer';
import path from 'path';
import bodyParser  from 'body-parser';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

//const port = 80;
const port = process.env.PORT || 3001;
const app = express();
const server = createServer(app); 
const io = new Server(server);

app.use(express.json());
   
// For serving static HTML files
//app.use(express.static("public"));
//app.use(express.urlencoded({ extended: true }));
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}));



app.set("view engine", "ejs");
app.use('/static', express.static(path.join(__dirname, 'uploads')));

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//var initializeApp = require("firebase/app");
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { collection, doc, addDoc,getDocs, query, where ,setDoc , updateDoc, deleteDoc } from "firebase/firestore"; 
//var collection =  require("firebase/firestore");
//var addDoc =  require("firebase/firestore");

/*
// Starting the server on the 80 port
app.listen(port, () => {
  console.log(`The application started
  successfully on port ${port}`);
});
*/
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});
io.on('connection', (socket) => {
  console.log('a user connected');
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', (data) => {
	  console.log("new message:"+JSON.stringify(data))
	  console.log("new message socket.roomId:"+socket.roomId);
    // we tell the client to execute 'new message'
	/*
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
	*/
	//broadcast to all room
	io.sockets.in(socket.roomId).emit('new message', {
      username: socket.username,
      message: data,
	  senderId: socket.userId,
	  senderIcon: socket.userIcon
    });
	//broadcast to room. no this sender
	/*
	socket.broadcast.to(socket.roomId).emit('new message', {
      username: socket.username,
      message: data,
	  senderId: socket.userId
    });
	*/
  });
	socket.on('youtube', (data) => {
	  console.log("new message:"+JSON.stringify(data))
	});
	

});
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDerfhVFoZE4bfhqO_BxPX0t49KfErH5yQ",
  authDomain: "qninodejs.firebaseapp.com",
  projectId: "qninodejs",
  storageBucket: "qninodejs.appspot.com",
  messagingSenderId: "1076917610874",
  appId: "1:1076917610874:web:a128b9071ac6b1a8e9cec3"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(appFirebase);

app.get("/", async function (req, res) {
  res.set({
    "Allow-access-Allow-Origin": "*",
  });
	//var arrayServer = ["VPS1","VPS2","VPS3","VPS4"];
	var arrayServer = [];
	var arServerTypes = [];
	var name = "";
	const querySnapshot = await getDocs(collection(db, "servers"));
	querySnapshot.forEach((doc) => {
	  //console.log(`${doc.id} => ${doc.data()}`);
	  //console.log(`${doc.id} => ${doc.data().name}`);
	  arrayServer.push(doc.data());
	  if (!arServerTypes.includes(doc.data().type))
	  {
		  arServerTypes.push(doc.data().type);
	  }
	  //arrayServer.push(doc.data().name);
	});
	arServerTypes.forEach((arServerType) =>
	{
		console.log(arServerType);
	});
  // res.send("Hello World");
  //return res.redirect("index.html");
  //res.render("index"); // index refers to index.ejs
  res.render("index.ejs", {
      username: name,
	  servers:arrayServer,
	  types:arServerTypes,
    });
});

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var uploadFile = "";
/*
var storageLocal = multer.diskStorage({
    destination: function (req, file, cb) {
  
		console.log("storage destination: function ");
        // Uploads is the Upload_folder_name
        //cb(null, "D:\\Windows ScreenReader\\QniNodeHeroku\\uploads");
		//cb(null, "uploads");
		cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
		console.log("storage filename:"+file.fieldname);
		uploadFile = Date.now() + file.fieldname +path.extname(file.originalname);//Appending extension
		console.log("uploadFile = "+uploadFile);
      	//cb(null, file.fieldname + "-" + Date.now()+".jpg")
		  cb(null, uploadFile) 
    }
  })

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 10 * 1000 * 1000;

var upload = multer({ 
    storage: storageLocal,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
		console.log("fileFilter");
		
		return cb(null, true);
			
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
				
      }
  
// mypic is the name of file attribute
}).single("mypic");       
*/



/*
app.post('/formFillUp1', (req, res) => {
	console.log("raw");
	// output the headers
	console.log(req.headers);
  
	// capture the encoded form data
	req.on('data', (data) => {
		console.log("data");
	  	console.log(data.toString());
		  console.log("req.body");
		console.log(req.body);
	});
  
	// send a response when finished reading
	// the encoded form data
	req.on('end', () => {
	  res.send('ok');
	});
  });

app.post("/uploadProfilePicture", async function (req, res) {
	console.log("uploadProfilePicture: ");
	//console.log(req);
	
	
});
*/
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, "uploads");
	},
	filename: function (req, file, cb) {
	  cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
	},
  });
   
  //var upload = multer({ storage: storage });
  var upload = multer();
var uploadMultiple = upload.fields([{ name: 'commentfile', maxCount: 10 }, { name: 'imagefile', maxCount: 10 }])

app.post('/formFillUp1', uploadMultiple, function (req, res, next) {
 
    if(req.files){
        console.log(req.files)
 
        console.log("files uploaded")
    }
    console.log("formFillUp:");
	console.log(req.body);
})
//https://codingshiksha.com/javascript/how-to-upload-multiple-files-in-multiple-form-fields-in-node-js-and-express-using-multer-library-full-example-for-beginners/
app.post("/formFillUp",uploadMultiple, async function (req, res) {
	/*
	if(req.files){
        console.log(req.files)
 
        console.log("files uploaded")
    }

	
	req.body.files = JSON.stringify(req.files);
	for (var i = 0; i < req.files.length; i++) {
		console.log(myStringArray[i]);
		//Do something
	}
	*/
	
	console.log("formFillUp:");
	console.log(req.body);

	var arrayServer = [];
	var arServerTypes = [];
	var name = "Toi la ta";
	const querySnapshot = await getDocs(collection(db, "servers"));
	querySnapshot.forEach((doc) => {
		//console.log(`${doc.id} => ${doc.data()}`);
		//console.log(`${doc.id} => ${doc.data().name}`);
		arrayServer.push(doc.data());
		if (!arServerTypes.includes(doc.data().type))
		{
			arServerTypes.push(doc.data().type);
		}
		//arrayServer.push(doc.data().name);
	});
	arServerTypes.forEach((arServerType) =>
	{
		console.log(arServerType);
	});
	
	var inputValue = req.body.tonode;
	console.log("inputValue = "+inputValue);
	if (inputValue == "qniremote") {
		// console.log("qniremote");
		/*
		try {
		//req.body.time
		
		const docRef = await addDoc(collection(db, "remoteCommands"), req.body);
		  console.log("Document written with ID: ", docRef.id);
		} catch (e) {
		  console.error("Error adding document: ", e);
		}
		*/
		io.emit('youtube', req.body);
		//res.render("complete.ejs");
		res.render("index.ejs", {
			username: "Bạn vừa gửi request thành công!!!",
			servers:arrayServer,
			types:arServerTypes,
		  });
	}
	if (inputValue == "updatedb") {
		req.body.servers.forEach(async  (server) =>{
			if (server != "xxxxxxxxxxxxxxxxx")
			{
				const q = query(collection(db, "servers"), where("name", "==", server));
				const querySnapshot = await getDocs(q);
				querySnapshot.forEach(async (docNow) => {
				  // doc.data() is never undefined for query doc snapshots
				  console.log(docNow.id, " => ", docNow.data());
				  
				  const serverRef = doc(db, "servers", docNow.id);

					// Atomically add a new region to the "regions" array field.
					await updateDoc(serverRef, {
						type: req.body.types 
					});
				});
			}
		});
		console.log("updatedb");
		var arrayServer = [];
		var arServerTypes = [];
		var name = "Toi la ta";
		const querySnapshot = await getDocs(collection(db, "servers"));
		querySnapshot.forEach((doc) => {
		  //console.log(`${doc.id} => ${doc.data()}`);
		  //console.log(`${doc.id} => ${doc.data().name}`);
		  arrayServer.push(doc.data());
		  if (!arServerTypes.includes(doc.data().type))
		  {
			  arServerTypes.push(doc.data().type);
		  }
		  //arrayServer.push(doc.data().name);
		});
		arServerTypes.forEach((arServerType) =>
		{
			console.log(arServerType);
		});
	  // res.send("Hello World");
	  //return res.redirect("index.html");
	  //res.render("index"); // index refers to index.ejs
	  res.render("index.ejs", {
		  username: name,
		  servers:arrayServer,
		  types:arServerTypes,
		});
	}
	if (inputValue == "delete") {
		console.log("delete");
		
		req.body.servers.forEach(async  (server) =>{
			if (server != "xxxxxxxxxxxxxxxxx")
			{
				const q = query(collection(db, "servers"), where("name", "==", server));
				const querySnapshot = await getDocs(q);
				querySnapshot.forEach(async (docNow) => {
				  // doc.data() is never undefined for query doc snapshots
				  console.log(docNow.id, " => ", docNow.data());
					await deleteDoc(doc(db, "servers", docNow.id));
				});
			}
		});
		
	  // res.send("Hello World");
	  //return res.redirect("index.html");
	  //res.render("index"); // index refers to index.ejs
	  console.log("name = "+name);
	  console.log("arrayServer = "+arrayServer);
	  console.log("arServerTypes = "+arServerTypes);
	  res.render("index.ejs", {
		  username: name,
		  servers:arrayServer,
		  types:arServerTypes,
		});
	}
	if (inputValue == "kill") {
		console.log("kill");

		io.emit('kill', req.body);
		res.render("index.ejs", {
		  username: name,
		  servers:arrayServer,
		  types:arServerTypes,
		});
	}
});

app.get("/chat", async function (req, res) {
  res.set({
    "Allow-access-Allow-Origin": "*",
  });

  res.render("chat.ejs", {

    });
});
/*
try {
  const docRef = await addDoc(collection(db, "users"), {
    first: "Ada",
    last: "Lovelace",
    born: 1815
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}
*/

app.get('/edittype', async (req, res) => {
	console.log("edittype");
	console.log(req.query);
	console.log(req.query.name);
	
	var arrayServer = [];
	var arServerTypes = [];
	var name = "Toi la ta";
	const querySnapshot = await getDocs(collection(db, "servers"));
	querySnapshot.forEach((doc) => {
	  //console.log(`${doc.id} => ${doc.data()}`);
	  //console.log(`${doc.id} => ${doc.data().name}`);
	  arrayServer.push(doc.data());
	  if (!arServerTypes.includes(doc.data().type))
	  {
		  arServerTypes.push(doc.data().type);
	  }
	  //arrayServer.push(doc.data().name);
	});
	arServerTypes.forEach((arServerType) =>
	{
		console.log(arServerType);
	});
  // res.send("Hello World");
  //return res.redirect("index.html");
  //res.render("index"); // index refers to index.ejs
  res.render("index.ejs", {
      username: name,
	  servers:arrayServer,
	  types:arServerTypes,
    });
});
