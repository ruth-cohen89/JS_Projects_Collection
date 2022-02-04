///Testing API using files,
///The server fetches the data from a file, not a DB
const fs=require('fs');
const express = require('express');

const app = express();

//Middleware 
//Can modify the incoming request data
//The step a request goes through when processed
app.use(express.json());

const tours=JSON.parse(
    fs.readFileSync('./dev-data/data/tours-simple.json')
);

const getAllTours= (req,res)=>{
  res.status(200).json({
    status: 'success', 
    results: tours.length,
    data: { 
      tours: tours
    }
});
}

const getTour=(req,res)=>{

  //Conver string to number
  const id=req.params.id*1;
  const tour= tours.find(el=>el.id===id);

  //Valdiate user input
  // if(id>tours.length){
  //Other way, if no tour was not found.
  if(!tour){
    return res.status(404).json({
    status: 'fail',
    message: 'Invalid ID🥲'
    });
  }

  res.status(200).json({
  status: 'success', 
  data: { 
  tour
  }
});
}

const createTour=(req,res)=>{
   //console.log(req.body);
    
    const newId= tours[tours.length-1].id +1;
  
    //New variable in order not to change the original
    const newTour= Object.assign({ id:newId }, req.body);
   
    tours.push(newTour);
    fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(tours),err=>{
      if(err){
          console.log(err)
      }
      res.status(201).json({
          status: "success",
          data: { 
              tour: newTour
          }
      });
    });
}
  
  
  //Demo
const updateTour=(req,res)=>{

 //Valdiate user input
    if(req.params.id * 1 >tours.length){
     return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID🥲'
    });
   }

    res.status(200).json({
     status: 'success',
     data: { 
       tour: '<updated tour here...>'
     }
})
}
const deleteTour=(req,res)=>{

  //Valdiate user input
    if(req.params.id * 1 >tours.length){
     return res.status(404).json({
     status: 'fail',
     message: 'Invalid ID🥲'
     });
    }

    res.status(204).json({
     status: 'success',
     data: null
    });
}


//app.get('/api/v1/tours',getAllTours);
//app.get('/api/v1/tours/:id',getTour);
//app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.delete('/api/v1/tours/:id',deleteTour);

app
 .route('/api/v1/tours')
 .get(getAllTours)
 .post(createTour);

app
 .route('/api/v1/tours/:id')
 .get(getTour)
 .patch(updateTour)
 .delete(deleteTour);

const port = 3000;
//Start a server 
//on our local machine 127.0.0.1
app.listen(port, ()=>{
   console.log(`App running on port ${port}...`);
});

















//Routing
// app.get('/', (req, res)=>{
//     res.status(200).json({message:'Hello from the server side'});
// });

// app.post('/',(req,res)=>{
//   res.send('You can post to this endpoint...')
// })
//Specifing a route (http method + endpoint)