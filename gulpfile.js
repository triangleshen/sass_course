///////////////////////////////////////////
// 基本語法

const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

function defaultTask(cb) {
    console.log('gulp ok');
    cb(); //callback function
}

exports.default = defaultTask;

///////////////////////////////////////////
// 任務種類

function missionA(cb) {
    console.log('missionA');
    cb();
}
function missionB(cb) {
    console.log('missionB');
    cb();
}

//順序
exports.async = series(missionA , missionB);

//同時
exports.sync = parallel(missionA , missionB);





///////////////////////////////////////////
//搬家函數
//src(來源檔案) dest(資料夾位置),會自動新增一個資料夾搬過去

//自己寫的搬家程式(搬HTML)
// function move() {
//     return src('./src/*.html').pipe(dest('dist'))
// }
// exports.m = move

//用gulp-file-include合併html順便搬家
const fileinclude = require('gulp-file-include');
function includeHTML() {
    return src('src/*.html') //來源
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist')); //目的地
}
exports.html = includeHTML;


// js move
function moveJs() {
    return src('./src/js/*.js').pipe(dest('dist/js'))
}

//css move
function moveCss() {
    return src('./src/css/*.css').pipe(dest('dist/css'))
}


//用SourceMap打包SASS和監看CSS
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
function styleSass() {
    return src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(dest('dist/css'));
}

///////////////////////////////////////////
//監看檔案
//搬家+監看 = 打包
function watchfile(){
    //監看html(用自己寫的程式)
    // watch('./src/*.html', move);

    //監看html(用gulp-file-include)
    //同時監看兩個要用陣列
    watch(['src/*.html', 'src/**/*.html'], includeHTML); 

    watch('./src/js/*.js', moveJs); //監看JS
    watch('./src/css/*.css', moveCss); //監看css
    watch(['./src/sass/*.scss' ,'./src/sass/**/*.scss'], styleSass);
}


//先打包之後再監看
exports.w = series(includeHTML,styleSass,watchfile);



