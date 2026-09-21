class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advance Filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // sorting function
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort.replaceAll(',', ' '));
      // sort('price ratingAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // 3) FIELD LIMITING
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // 4) PAGINATION
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = limit * (page - 1);

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
