import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
// gulp의 이미지 변환 툴? 압축 툴? 다양한 옵션도 가지고 있음.
import image from "gulp-image";

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
};

const pug = () =>
    gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const server = () =>
    gulp.src("build").pipe(ws({ livereload: true, open: true }));

const img = () =>
    gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);
// gulp.series : 순차 실행
// gulp.parallel : 동시 실행
const live = gulp.parallel([server, watch]);

export const dev = gulp.series([prepare, assets, live]);
