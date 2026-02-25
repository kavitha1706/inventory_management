var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var models = require('./models');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var authRoutes = require("./routes/auth.routes");
var categoryRoutes = require("./routes/category.route");
var productRoutes = require("./routes/product.route");
var dashboardRoutes = require("./routes/dashboard.route");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Load master doc
const swaggerDocument = YAML.load('./api-doc/swagger.yaml');

// Load and merge separate docs
const authDocs = YAML.load('./api-doc/auth.yaml');
const categoryDocs = YAML.load('./api-doc/category.yaml');
const productDocs = YAML.load('./api-doc/product.yaml');
const dashboardDocs = YAML.load('./api-doc/dashboard.yaml');

swaggerDocument.paths = {
  ...authDocs,
  ...categoryDocs,
  ...productDocs,
  ...dashboardDocs
};

var app = express();

// ---- CORS: allow React frontend ----
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:3000"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/v1', indexRouter);

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/dashboard", dashboardRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Database connection
models.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
//table creation
models.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
