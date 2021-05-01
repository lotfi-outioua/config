const { src, dest, series, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const procsshtml = require('gulp-processhtml');
const server = require('browser-sync').create();

const paths = {
	src: {
		folder: './src',
		html: {
			folder: './src',
			glob: './src/**/*.html'
		},
		css: {
			folder: './src/css',
			glob: './src/css/**/*.css'
		},
		sass: {
			folder: './src/scss',
			glob: './src/sass/**/*.scss'
		},
		fonts: {
			folder: './src/fonts',
			glob: './src/fonts/**/*.{ttf,woff,woff2,eof,svg}'
		},
		img: {
			folder: './src/img',
			glob: './src/img/**/*'
		},
		scripts: {
			folder: './src/scripts',
			glob: './src/scripts/**/*.js'
		}
	},
	dist: {
		folder: './dest',
		html: {
			folder: './dist'
		},
		css: {
			folder: './dist/assets/css'
		},
		fonts: {
			folder: './dist/assets/fonts'
		},
		img: {
			folder: './dist/assets/img'
		},
		scripts: {
			folder: './dist/assets/scripts'
		}
	}
}

function defaultTask(o) {
	console.log('defaultTask');
	o();
}

const sassCompilation = () => {
	return src(paths.src.sass.glob)
	.pipe(sass())
	.pipe(dest(paths.src.css.folder))
	.pipe(server.stream())
}

function serve() {
	server.init({
		server: {
			baseDir: './src'
		}
	})

	watch(paths.src.sass.glob, sassCompilation)
	watch(paths.src.html.glob).on('change', server.reload)
	watch(paths.src.scripts.glob).on('change', server.reload)
}

// ++++++ BUILDERS ++++++

function buildHtml() {
	return src(paths.src.html.glob)
	.pipe(procsshtml())
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(dest(paths.dist.html.folder))
}

function buildCss() {
	return src(paths.src.css.glob)
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(dest(paths.dist.css.folder))
}

function buildFonts() {
	return src(paths.src.fonts.glob)
	.pipe(dest(paths.dist.fonts.folder))
}

function buildImg() {
	return src(paths.src.img.glob)
	.pipe(dest(paths.dist.img.folder))
}

function buildScripts() {
	return src(paths.src.scripts.glob)
	.pipe(uglify())
	.pipe(rename({ suffix: '.min' }))
	.pipe(dest(paths.dist.scripts.folder))
}

exports.default = defaultTask;

exports.serve = serve;
exports.sassCompilation = sassCompilation;

exports.build = parallel(
	buildHtml,
	buildCss,
	buildFonts,
	buildImg,
	buildScripts,
);