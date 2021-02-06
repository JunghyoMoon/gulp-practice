import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
// gulp의 이미지 변환 툴? 압축 툴? 다양한 옵션도 가지고 있음.
import image from "gulp-image";
import sass from "gulp-sass";
// 브라우저들의 호환성을 위해 사용.
import autoprefixer from "gulp-autoprefixer";
// stylesheet를 압축해 브라우저에서의 로딩 속도 향상
import minify from "gulp-csso";
// browserify: import문을 읽어올 수 있게 해줌
import bro from "gulp-bro";
import babelify from "babelify";

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
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js",
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
            autoprefixer({
                browsers: ["last 2 versions"],
            })
        )
        .pipe(minify())
        .pipe(gulp.dest(routes.scss.dest));

const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }],
                ],
            })
        )
        .pipe(gulp.dest(routes.js.dest));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, style);
    // 때때로 용량이 큰 이미지를 최적화할 경우 겁나게 오래 걸릴 수 있으니, watch 사용에 신경쓸 것
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.js.src, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, style, js]);
// gulp.series : 순차 실행
// gulp.parallel : 동시 실행
const live = gulp.parallel([server, watch]);

export const dev = gulp.series([prepare, assets, live]);
