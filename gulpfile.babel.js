import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import webServer from "gulp-webserver";

const routes = {
	pug: {
		watch: "src/**/*.pug",
		src: "src/*.pug",
		dest: "build",
	},
};

const pug = () =>
	gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const server = () =>
	gulp.src("build").pipe(webServer({ livereload: true, open: true }));

const watch = () => {
	gulp.watch(routes.pug.watch, pug);
};

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);
// gulp.series : 순차 실행
// gulp.parallel : 동시 실행
const postDev = gulp.parallel([server, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
