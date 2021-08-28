const del = require("del");
const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.task("clean", function () {
  del.sync(["./dist", "./dest"]);
});

gulp.task("compile", ["clean"], function () {
  return gulp.src("./src/**/*.js").pipe(babel()).pipe(gulp.dest("./dist"));
});

gulp.task("default", ["compile"]);
