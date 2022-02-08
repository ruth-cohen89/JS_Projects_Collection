//Routes handlers
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Validate ID MW
exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID🥲',
    });
  }
  next();
};

//CheckBody middleware
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price!',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  //calling res ends the middleware cycle
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};
exports.getTour = (req, res) => {
  //Conver string to number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  //console.log(req.body);
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  //New variable in order not to change the original
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.log(err);
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};
    
    
    //Demo
    exports.updateTour=(req,res)=>{
  
      res.status(200).json({
       status: 'success',
       data: { 
         tour: '<updated tour here...>'
       }
  })
  }
  exports.deleteTour=(req,res)=>{
  
      res.status(204).json({
       status: 'success',
       data: null
      });
  }

