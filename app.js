import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const topic_arr=[];
const blog_content=[];
let topic_number=0;

//initial page
app.get("/", (req, res) => {
  res.render("index.ejs",
  {
    topics:topic_arr,
    topic_num:topic_number
  });
});

//creating a blog
app.get("/create", (req, res) => {
  res.render("create.ejs");
});

//uploading a blog
app.post("/upload",(req,res)=>{
  topic_arr.push(req.body.title);
  blog_content.push(req.body.content);
  topic_number+=1;
  res.render("blog.ejs",{
    title:req.body.title,
    content:req.body.content,
    topic_num:topic_number
  });
});

//getting input to view a blog
app.get("/view",(req,res)=>{
  res.render("view.ejs");
});

//viewing a blog based on the given topic
let topic_num_to_display;
app.post("/blogtoview",(req,res)=>{
  console.log(req.body.topic_name);
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.topic_name){
      topic_num_to_display=i;
    }
    if(i==topic_arr.length-1 && topic_arr[i]!=req.body.topic_name){
      res.render("notfound.ejs");
    }
  }
  res.render("blog.ejs",{
    title:topic_arr[topic_num_to_display],
    content:blog_content[topic_num_to_display],
    topic_num:topic_num_to_display+1,
  });
});

//getting input to view a blog
app.get("/delete",(req,res)=>{
  res.render("delete.ejs");
});

//deleting a blog
app.post("/deleting",(req,res)=>{ 
  let topic_num_to_delete;
  //getting blog index 
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.topic_name){
      topic_num_to_delete=i;
    }
  }
  topic_number-=1;
  //replacing that partciular blog and then consecutive blogs until end of both arrays and then poping last elements
  for(let j=topic_num_to_delete;j<topic_arr.length;j++){
    topic_arr[j]=topic_arr[j+1];
    blog_content[j]=blog_content[j+1];
  }
  blog_content.pop();
  topic_arr.pop();
  res.render("deleted.ejs");
});

//getting input to update a existing blog
app.get("/update",(req,res)=>{
  res.render("update.ejs");
});

//to show previous content
app.post("/toupdate",(req,res)=>{
  let content;
  let temp;
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.title){
      content=blog_content[i];
      temp=i;
    }
  }
  res.render("toupdate.ejs",{
    title:req.body.title,
    previous_content:content,  
    topic_num:temp+1,  
  })
})

//updating a blog
app.post("/updated",(req,res)=>{ 
  let temp;
  let content_to_be_added=req.body.content;  
  for(let i=0;i<topic_arr.length;i++){
    if(topic_arr[i]==req.body.title){
      blog_content[i]=content_to_be_added;
      temp=i;
    }
  }
  res.render("blog.ejs",{
    title:req.body.title,
    content:blog_content[temp],
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

