var gulp = require('gulp'),
	lp = require('gulp-load-plugins')();

gulp.task('styl', function () {
    return gulp.src('src/main.styl')
		.pipe(lp.sourcemaps.init())
        //.pipe(lp.stylus())
        .pipe(lp.stylus().on( 'error', lp.notify.onError(
			  {
				message: "<%= error.message %>",
				title  : "Stylus Error!"
			  } ) )
		  )
        .pipe(lp.csso({restructure: false}))
        .pipe(lp.sourcemaps.write('maps'))	
        .pipe(gulp.dest('relise'))
});

gulp.task('pug', function () {
    return gulp.src('src/index.pug')
		.pipe(lp.pug({
			pretty: true
		}))
        .pipe(gulp.dest('relise'))
});

gulp.task('js', function () {
    return gulp.src([
    	    'libs/jquery/dist/jquery.min.js',
    	    'libs/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
    	    'libs/Accordeon/MFSAccordeon.js',
    	    'src/**/*.js'])
		.pipe(lp.sourcemaps.init())
        .pipe(lp.babel({presets: ['env']}))
		.pipe(lp.concat('main.js'))
		.pipe(lp.sourcemaps.write('maps'))
		.pipe(gulp.dest('relise'))
});

gulp.task('img', function () {
	return gulp.src(['src/*.svg', 'src/*.png'])
		.pipe(gulp.dest('relise'));
});

gulp.task('json', function () {
	return gulp.src('src/*.json')
		.pipe(gulp.dest('relise'));
});

gulp.task('default', ['styl', 'pug', 'js', 'img', 'json'], function () {
    gulp.watch('src/**/*.styl', ['styl']);
    gulp.watch('src/**/*.pug', ['pug']);
    gulp.watch('src/**/*.js', ['js']);
    gulp.watch('src/**/*.json', ['json']);
});