UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = ./node_modules/.bin/banner

dist/markers.min.js:
	cat src/start.js \
		src/markers.js \
		src/markers_interaction.js \
		src/markers_csv.js \
		src/simplestyle_factory.js \
		> dist/markers.js
	cat lib/*.js > dist/markers.externals.js
	$(UGLIFYJS) dist/markers.js > dist/markers.min.js

clean:
	rm dist/*

all: dist/markers.min.js

.PHONY: dist/markers.min.js
