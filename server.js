let express = require('express')
let bodyParser = require('body-parser')
let path = require('path')
let multer = require('multer')
let docxtopdf = require('docx-pdf')
const PDFDocument = require('pdfkit');
const fs = require('fs');
const imgToPDF = require('image-to-pdf')
app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('uploads'))


let storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads");
    },
    filename: function(req,file,cb){
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

var upload = multer({storage:storage})

app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/web/index.html')
})

app.post('/nodedocxpdf',upload.single('file'),(req,res)=>{
  
    try {
        let outputfilepath ='uploads/'+ Date.now()+"output.pdf"
        if(path.extname(req.file.path) == 'docx'){
            docxtopdf(req.file.path,outputfilepath,(err,result)=>{
                if(err){
                    res.json({'filetype':'not def'})
                }else{
                    res.download(outputfilepath)
                }
            })
        }else{

            res.json({'filetype':'not def'})
        }
     } catch (error) {
            
        res.json({'filetype':'not def'})
        }

    res.json({'filetype':'not def'})


})


app.post('/nodejpgpdf',upload.single('file'),async (req,res)=>{
    try {
        let outputfilepath ='uploads/'+ Date.now()+"output.pdf"
    const pages = [
        fs.readFileSync(req.file.path) // Buffer
    ]
    m = await imgToPDF(pages, imgToPDF.sizes.A4).pipe(fs.createWriteStream(outputfilepath))
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.download(outputfilepath)
    } catch (error) {
        res.json({'filetype':'not def'})
    }
    
    
    


})

app.listen(3000,()=>{
    console.log('listening on port 3000')
})