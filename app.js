import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const topic_arr=[];
const Note_content=[];
let topic_number=0;

//initial page
app.get("/", (req, res) => {
  res.render("index.ejs",
  {
    topics:topic_arr,
    topic_num:topic_number
  });
});

//creating a Note
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

//uploading a Note
app.post("/upload",(req,res)=>{
  topic_arr.push(req.body.title);
  Note_content.push(req.body.content);
  topic_number+=1;
  res.render("Note.ejs",{
    title:req.body.title,
    content:req.body.content,
    topic_num:topic_number
  });
});

//getting input to view a Note
app.get("/view",(req,res)=>{
  res.render("view.ejs");
});

//viewing a Note based on the given topic

app.post("/Notetoview", (req, res) => {
  let topic_num_to_display = -1;
  console.log(req.body.topic_name);

  for (let i = 0; i < topic_arr.length; i++) {
    if (topic_arr[i] === req.body.topic_name) {
      topic_num_to_display = i;
      break; // Exit the loop as soon as the topic is found
    }
  }

  if (topic_num_to_display === -1) {
    res.redirect("/notenotfound");
  } else {
    res.render("Note.ejs", {
      title: topic_arr[topic_num_to_display],
      content: Note_content[topic_num_to_display],
      topic_num: topic_num_to_display + 1,
    });
  }
});


//note not found
app.get('/notenotfound',(req,res)=>{
  res.render("notenotfound.ejs");
})

//getting input to view a Note
app.get("/delete",(req,res)=>{
  res.render("delete.ejs");
});

//deleting a Note
app.post("/deleting",(req,res)=>{ 
  let topic_num_to_delete;
  //getting Note index 
  if(req.body.topic_name){
    for(let i=0;i<topic_arr.length;i++){
      if(topic_arr[i]==req.body.topic_name){
        topic_num_to_delete=i;
        break;
      }
    }
    topic_number-=1;
    //replacing that partciular Note and then consecutive Notes until end of both arrays and then poping last elements
    for(let j=topic_num_to_delete;j<topic_arr.length;j++){
      topic_arr[j]=topic_arr[j+1];
      Note_content[j]=Note_content[j+1];
    }
    Note_content.pop();
    topic_arr.pop();
    return res.render("deleted.ejs");
  }
    res.render("nothingtodelete.ejs");
});

//getting input to update a existing Note
app.get("/update",(req,res)=>{
  res.render("update.ejs");
});

//to show previous content
app.post("/toupdate",(req,res)=>{
  let content;
  let temp=0;
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.title){
      content=Note_content[i];
      temp=i;
    }
  }
  if(temp==0){
    return res.render("notenotfound.ejs");
  }
  res.render("toupdate.ejs",{
    title:req.body.title,
    previous_content:content,  
    topic_num:temp+1,  
  })
})

//updating a Note
app.post("/updated",(req,res)=>{ 
  let temp;
  let content_to_be_added=req.body.content;  
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.title){
      Note_content[i]=content_to_be_added;
      temp=i;
    }
  }
  res.render("Note.ejs",{
    title:req.body.title,
    content:Note_content[temp],
    topic_num:temp+1,
  });
});

//listening to port
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${port}`);
});

