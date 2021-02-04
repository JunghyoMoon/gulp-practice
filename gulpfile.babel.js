import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
// gulp의 이미지 변환 툴? 압축 툴? 다양한 옵션도 가지고 있음.
import image from "gulp-image";
import sass from "gulp-sass";
import autop from "gulp-autoprefixer";

sass.compiler = require("node-sass");

const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build",
    },
    img: {
        src: "src/img/*",
        dest: "build/img",
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css",
    },
};

const pug = () =>
    gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const server = () =>
    gulp.src("build").pipe(ws({ livereload: true, open: true }));

const img = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const style = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(
            autop({
                browsers: ["last 2 versions"],
            })
        )
        .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, style);
    // 때때로 용량이 큰 이미지를 최적화할 경우 겁나게 오래 걸릴 수 있으니, watch 사용에 신경쓸 것
    gulp.watch(routes.img.src, img);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, style]);
// gulp.series : 순차 실행
// gulp.parallel : 동시 실행
const live = gulp.parallel([server, watch]);

export const dev = gulp.series([prepare, assets, live]);
