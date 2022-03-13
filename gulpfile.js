const gulp = require("gulp")
const sass = require("gulp-sass")(require('node-sass'))
const cssnano = require("gulp-cssnano")
const rev = require("gulp-rev")
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const del = require("del");

gulp.task("css", function(done){
  console.log("Minifying CSS ...")
  gulp.src("./Assets/SASS/**/*.sass")
  .pipe(sass())
  .pipe(cssnano())
  .pipe(gulp.dest("./Public/Assets/CSS"))

  gulp.src("./Public/Assets/**/*.css")
  .pipe(rev())
  .pipe(gulp.dest("./Public/Assets"))
  .pipe(rev.manifest({
    // current working directory
    cwd: "Public",
    merge: true
  }))
  .pipe(gulp.dest("./Public/Assets"))
  done()
})

gulp.task('js', function(done){
  console.log('Minifying JS...');
   gulp.src('./Assets/**/*.js')
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('./Public/Assets'))
  .pipe(rev.manifest({
      cwd: "Public",
      merge: true
  }))
  .pipe(gulp.dest('./Public/Assets'));
  done()
});

gulp.task('images', function(done){
  console.log('Compressing Images...');
  gulp.src('./Assets/**/*.+(png|jpg|gif|svg|jpeg)')
  .pipe(imagemin())
  .pipe(rev())
  .pipe(gulp.dest('./Public/Assets'))
  .pipe(rev.manifest({
      cwd: 'Public',
      merge: true
  }))
  .pipe(gulp.dest('./Public/Assets'));
  done();
});


// empty the public/assets directory
gulp.task('clean:assets', function(done){
  del.sync('./Public/Assets')
  // del.sync("./rev-manifest.json")
  done();
});

gulp.task('build', gulp.series('clean:assets', 'js', 'images', 'css'), function(done){
  console.log('Building Assets');
  done();
});