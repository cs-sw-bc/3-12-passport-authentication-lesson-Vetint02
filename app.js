import notesRoute from "./routes/notes.js"
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import connectDB from "./db.js"
import passport from "./passport.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to DB
connectDB();

//add session
app.use(session({
  secret: "Keyboard cat",
  resave: false,
  saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Create POST login
// If user calls /login, take them to passport local authentication
// If success go to dashboard. If failure, go to crash page.
app.post("/login", passport.authenticate(`local`, { failureRedirect: `/crash`, successRedirect: `/dashboard`}));

//Create logout

//Create a function to authenticate if a user logged in

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});


//Protecting routes
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/show-notes", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "show-notes.html"));
});


app.use((req, res, next)=>{
  console.log("Request received in this global middleware function");
  next();
});

app.use("/crash",(req,res,next)=>{
    const error = new Error("Authenticated failed");
    error.status =401;
    next(error);
})
app.use("/notes", notesRoute);

//4. Route not found middleware function
app.use((a,b,c) =>{
  const error = new Error("We don't have that route in our API listings");
  error.status = 404;
  c(error);
});

app.use((err, req, res, next)=>{
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    ERROR:{
      status: statusCode,
      message: err.message
    }
  })
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));