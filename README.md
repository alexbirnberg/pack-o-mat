# Pack-O-Mat: Optimizing String Views in SpiderMonkey

## Overview
Pack-O-Mat is an optimization project designed to reduce memory overhead in the SpiderMonkey JavaScript engine. It introduces targeted compression for `JSLinearString` objects, leveraging the LZ4 algorithm to improve memory efficiency while maintaining high performance. This repository contains the analysis scripts, benchmark results, and integration examples used in the research.

## Getting Started

### Prerequisites
- Python 3.x
- Node.js (for benchmarks)
- GNU Make (for build automation)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/alexbirnberg/pack-o-mat.git

2. Compile the code:
   ```bash
   make

3. Run the examples:
   ```bash
   make run

For instructions on compiling and running the benchmarks used in this project, refer to the <a href="https://github.com/v8/web-tooling-benchmark/tree/master">Web Tooling Benchmark repository</a>.