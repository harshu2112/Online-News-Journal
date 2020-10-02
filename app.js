//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var nl2br  = require("nl2br");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var _ = require('lodash');

mongoose.connect("url", {userNewUrlParser : true}  )

//post schema
const postSchema = {
  title : String,
  content : String
}

//Aboutus schema
const infoSchema = {
  name : String,
  content : String
}

//creating a dbmodel(collection)
const Posts = mongoose.model("Posts" , postSchema)
const Info = mongoose.model("Info" , infoSchema)


const About = new Info({
  name : "about",
  content :"An online newspaper is the online version of a newspaper, either as a stand-alone publication or as the online version of a printed periodical.Going online created more opportunities for newspapers, such as competing with broadcast journalism in presenting breaking news in a more timely manner. The credibility and strong brand recognition of well established newspapers, and the close relationships they have with advertisers, are also seen by many in the newspaper industry as strengthening their chances of survival. The movement away from the printing process can also help decrease costs.Online newspapers, like printed newspapers, have legal restrictions regarding libel, privacy and copyright,[2] also apply to online publications in most countries as in the UK. Also, the UK Data Protection Act applies to online newspapers and news pages. Up to 2014, the PCC ruled in the UK, but there was no clear distinction between authentic online newspapers and forums or blogs. In 2007, a ruling was passed to formally regulate UK-based online newspapers, news audio, and news video websites covering the responsibilities expected of them and to clear up what is, and what isn't, an online news publication.News reporters are being taught to shoot video[5] and to write in the succinct manner necessary for internet news pages. Some newspapers have attempted to integrate the internet into every aspect of their operations, e.g., the writing of stories for both print and online, and classified advertisements appearing in both media, while other newspaper websites may be quite different from the corresponding printed newspaper."
})

About.save()


const postArray = [];

app.get('/',(req,res)=>{

  Posts.find({},(err,found)=>{
    if(err)
      console.log(err,"error during get journalDB collection documents")
    else
     var foundArray = found.reverse();
      res.render("home",{hSContent:homeStartingContent,pArray : foundArray})


  })

})

app.get('/about',(req,res)=>{
  Info.findOne({name : "about"},(err,found)=>{
    if(!err)
      res.render("about",{aContent:found.content})
  })

})

app.get('/contact',(req,res)=>{
  res.render("contact",{cContent:contactContent})
})

app.get('/compose',(req,res)=>{
  res.render("compose")
})

app.post('/compose',(req,res)=>{  
  
  //creating new documents with mongoose
  const Post1 = new Posts({
    title  : req.body.title,
    content : req.body.content
  })
  //console.log(req.body.content)
  
  Post1.save()
  res.redirect('/');
})

app.get('/post/:id',(req,res)=>{
  //console.log("working",(req.params.id))
  postId =  (req.params.id)
  Posts.findOne({_id :postId},(err,found)=>{

    if(err)
      console.log(err,"error during Readmore  journal documents")
    else if(found)
    {
      var Content = found.content;
      Content = Content.replace('\r\n',"")

      function escapeRegExp(string){
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }

      function replaceAll(str, term, replacement) {
        return str.replace(new RegExp(escapeRegExp(term), 'g'), replacement);
      }

      var Content = replaceAll(Content, '.\r\n\r\n', '.<br><br>')
      var Content = replaceAll(Content, '\r\n', '')
      var Content = replaceAll(Content, '.<br><br>', '.\r\n\r\n')

      console.log(Content)
      //Content = nl2br(Content)
      console.log("new ", Content)
      res.render("post",{title:found.title , content:Content})
    }
      

  })
/*   for(var i =0 ; i<postArray.length ; i++)
  {
    if(_.lowerCase(req.params.id) === _.lowerCase(postArray[i].title))
    {
      console.log("working",req.params.id)
      res.render("post",{title:postArray[i].title , content:postArray[i].content})
    }
  } */
})





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started ");
});
