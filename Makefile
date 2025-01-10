all:
	cd mozilla-unified; \
	./mach build

run:
	mozilla-unified/mach run web-tooling-benchmark/dist/cli.js 
