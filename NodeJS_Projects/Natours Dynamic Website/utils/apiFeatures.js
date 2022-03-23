//Fetures that can be on the URL
//When user requests all tours he can specify some constraits/features
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //Implementing constraints on some fields (like: ?duration[gte]=5&difficulty=easy)
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // { difficulty: 'easy', duration: { $gte:5} }
    // { difficulty: 'easy', duration: { gte:5} }

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  //Implementing specific sorting (like: sort=price)
  sort() {
    if (this.queryString.sort) {
      //convert comma to whitespace
      //console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      //sort by 'createdAt' in a descending order
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  //The user chooses specific fields to be displayed only (like: fields=name,id)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      //select fields
      this.query = this.query.select(fields);
    } else {
      //If the user didn't specifiy fields - select all fields except version
      this.query = this.query.select('-__v');
    }
    return this;
  }

  //Representing only a certain page from all the pages of the documents
  //limit - how many docs can be inserted in a page, page - which page to display
  //If we have 9 docs, and the user choose 'page=2&limit=3',
  //then each page will have 3 docs, and the second one will be displayed
  paginate() {
    //Number in a query string is a string, so convert to number
    //If the user didnt specify a page, then page 1 will be dispalyed.
    const page = this.queryString.page * 1 || 1;

    // If the user didn't specify limit, then it's a 100 docs per page (max)
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // Selected page
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
