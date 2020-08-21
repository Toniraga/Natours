/* eslint-disable prettier/prettier */
const mongoose = require('mongoose')
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator')

const { Schema } = mongoose

  const tourSchema = new Schema({
    name: {
      type: String,
      required: [true, "A Tour Must Have A Name"],
      maxlength: [ 40, 'A Tour Name Must Have Less or Equal Than 40 Characters' ],
      minlength: [ 8, 'A Tour Name Must Have More Than 8 characters'],
      unique: true,
      trim: true,
      // validate: [validator.isAlpha, 'Tour Name Must Only Contain Characters']
    },
    slug : String,
    duration: {
      type: Number,
      required: [true, "A Tour Must Have A Duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour Must Have A Group Size"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour Must Have A Difficulty"],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty Can Either Be Easy, Medium or Difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 1.0'],
      max: [5, 'A rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour Must Have A Price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator : function(val) {
          // This function point to only current doc on NEW document creation
          return val < this.price
        },
        message: 'Discount Price ({VALUE}) Should Be Below Regular Price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour Must Have A Description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "An Tour Must Have A Cover Image"] 
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  }, 
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ price: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7
})

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})

// DOCUMENT MIDDLEWARE: runs before the .save() command and .create() but not on .insetMany()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next()
})

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises)
//   next()
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('document saved', doc)
//   next()
// })

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: {$ne: true} }) 

  this.start = Date.now();
  next()
});


tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next()
})


tourSchema.post(/^find/, function (docs, next) {
  console.log(` Query took : ${Date.now() - this.start} milliseconds`)
  // console.log(docs)
  next();
});


// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   // console.log(this.pipeline())
//   next()
// })

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour


