/**
* plugin
*/
const gulp = require('gulp');                // gulp v4
const plumber = require('gulp-plumber');     // 監視をストップしない
const notify = require('gulp-notify');       // エラー通知を表示
const sass = require('gulp-sass');           // Sassのコンパイル
const postcss = require("gulp-postcss");     // postCSS
const autoprefixer = require("autoprefixer");
const ejs = require('gulp-ejs');             // ejs
const rename = require('gulp-rename');       // ejsをhtmlnリネーム
const imagemin = require('gulp-imagemin');   // 画像ファイルの最適化
const browserSync = require("browser-sync"); // 自動リロード
const del = require( 'del' );                // 削除

/**
* path
*/
const SRC = "src/",
      DOCS = 'docs',
      BASE_PATH = '/',
      DEST = DOCS + BASE_PATH;

/**
* task
*/

// sass
gulp.task('sass', function(done) {
  // scssファイルの更新があった場合の処理
  //return (
    gulp
      // style.scssファイルを取得
      .src(SRC + 'scss/**/*.scss')
      .pipe(
        // 監視をストップしない
        plumber({
          // エラー通知を表示
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      // Sassのコンパイルを実行
      .pipe(
        sass({
          // 出力時のコードを整形
          outputStyle: 'expanded'
        })
        // Sassのコンパイルエラーを表示
        // (これがないと自動的に止まってしまう)
        .on('error', sass.logError)
      )
      .pipe(
        postcss([
          autoprefixer({
            cascade: false
          })
        ])
      )
      // 保存
      .pipe(gulp.dest(DEST + 'assets/css/'))
      // 自動リロード
      .pipe(browserSync.stream())
    //);
  //});

  // 明示的に終了を通知(エラー回避)
  done();
});


//ejs
gulp.task( 'ejs', function (done) {
  //return (
    gulp
      .src(
        [SRC + "ejs/**/*.ejs", '!' + SRC + "ejs/**/_*.ejs"]
      )
      .pipe(
        // 監視をストップしない
        plumber({
          // エラー通知を表示
          errorHandler: notify.onError("Error: <%= error.message %>")
        })
      )
      .pipe(ejs())
      // ejsをhtmlにリネーム
      .pipe(rename({extname: '.html'}))
      // 保存
      .pipe(gulp.dest(DOCS))
      // 自動リロード
      .pipe(browserSync.stream())
  //);

  // 明示的に終了を通知(エラー回避)
  done();
});


// 画像削除
gulp.task('delete', function(done) {
  del([
    DEST + 'assets/images/',
  ]);

  // 明示的に終了を通知(エラー回避)
  done();
});


// docsフォルダを全て削除
gulp.task('delete-all', function(done) {
  del([
    DEST + '**/*',
  ]);

  // 明示的に終了を通知(エラー回避)
  done();
});


// 画像書き出し・圧縮
gulp.task('imagemin', function(done) {
  return (
    gulp
      // 画像のマッチパターン
      .src(SRC + 'images/**/*')
      // 画像の最適化処理
      .pipe(imagemin())
      // 最適化済みの画像を書き出すディレクトリ
      .pipe(gulp.dest(DEST + 'assets/images/'))
      // 自動リロード
      .pipe(browserSync.stream())
  );

  // 明示的に終了を通知(エラー回避)
  done();
});


// lib
gulp.task('lib', function(done) {
  //return (
    gulp
      // マッチパターン
      .src(SRC + 'lib/**/*')
      .pipe(gulp.dest(DEST + 'assets/lib/'))
      // 自動リロード
      .pipe(browserSync.stream())
  //);

  // 明示的に終了を通知(エラー回避)
  done();
});


// json
gulp.task('json', function(done) {
  //return (
    gulp
      // マッチパターン
      .src(SRC + 'json/**/*')
      .pipe(gulp.dest(DEST + 'assets/json/'))
      // 自動リロード
      .pipe(browserSync.stream())
  //);

  // 明示的に終了を通知(エラー回避)
  done();
});

// js
gulp.task('js', function(done) {
  //return (
    gulp
      // マッチパターン
      .src(SRC + 'js/*')
      .pipe(gulp.dest(DEST + 'assets/js/'))
      // 自動リロード
      .pipe(browserSync.stream())
  //);

  // 明示的に終了を通知(エラー回避)
  done();
});


// BrowserSyncの設定
gulp.task('browser-sync', function(done) {
  browserSync({
    server: {
      proxy: "localhost:3000",
      baseDir: DOCS,
    },
    // BrowserSyncの通知を無効化
    notify: false
  });

  // 明示的に終了を通知(エラー回避)
  done();
});


/**
* watch
*/
gulp.task('watch', function (done) {
  // ejsファイルの更新を監視
  gulp.watch(SRC + 'ejs/**/*.ejs', gulp.parallel('ejs'));
  // scssファイルの更新を監視
  gulp.watch(SRC + 'scss/**/*.scss', gulp.parallel('sass'));
  // 画像ファイルの更新を監視
  gulp.watch(SRC + 'images/**/*', gulp.parallel('imagemin'));
  // libディレクトリの更新を監視
  gulp.watch(SRC + 'lib/**/*', gulp.parallel('lib'));
  // jsディレクトリの更新を監視
  gulp.watch(SRC + 'js/*', gulp.parallel('js'));

  // 明示的に終了を通知(エラー回避)
  done();
});


/**
* default
*/
gulp.task('default',
  gulp.series(
    'delete-all',
    'imagemin',
    'sass',
    'ejs',
    'js',
    'lib',
    'json',
    'browser-sync',
    'watch'
  )
);
