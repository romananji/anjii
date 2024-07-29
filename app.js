const express=require("express");
const app=express();
const {open}=require("sqlite");
const path=require("path");
const sqlite3=require("sqlite3");
app.use(express.json());
const dbPath=path.join(__dirname,"notesDatabase.db");
let db=null;
const initializeDBAndServer=async ()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3000,()=>{
            console.log(`app is running on the server http://localhost:${3000}`);
        })
    }catch(e){
        console.log(`DB Error:${e.message}`)
        process.exit(1);
    }
    
}
initializeDBAndServer();
app.get("/",(request,response)=>{
    response.sendFile("./app.html",{root:__dirname});
})
app.post("/notes/",async (request,response)=>{
    const {contentt}=request.body
    const {id,content,createdAt}=contentt;
    const postQuery=`
        INSERT INTO notes 
            (id,content,created_at)
        VALUES 
            (${id},'${content}','${createdAt}')
    `
    await db.run(postQuery,[content],async (error)=>{
        if (error){
            response.status(500)
            response.json({error:error.message})
        }else{
            response.json({id:this.lastId,content,created_at:new Date()});
        }
    });
})
app.get('/notes', (request, response) => {
    const getQuery=`
        SELECT * FROM notes;
    `;
    db.all(getQuery, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

module.exports=app;