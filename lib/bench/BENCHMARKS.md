# Benchmark Results

Generated on: 2024-11-16T04:13:40.386Z


## Array Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| max | 258.02µs | ±33.19µs | 3,875.67 |
| splitOn | 667.35µs | ±415.35µs | 1,498.46 |
| chunk | 1.07ms | ±202.72µs | 934.58 |
| rollingWindow | 9.35ms | ±1.43ms | 106.95 |


## Bits Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| bitsToNumber-16 | 175.90ns | ±147.14ns | 5,685,048.32 |
| bitsToNumber-32 | 210.00ns | ±416.41ns | 4,761,904.76 |
| bitStringToNumber-16 | 235.80ns | ±216.14ns | 4,240,882.1 |
| bitSubstring-small | 251.50ns | ±1.32µs | 3,976,143.14 |
| bitSubstring-medium | 272.70ns | ±736.98ns | 3,667,033.37 |
| bitsToNumber-53 | 287.60ns | ±671.03ns | 3,477,051.46 |
| bitStringToNumber-32 | 313.50ns | ±422.19ns | 3,189,792.66 |
| bitSubstring-large | 329.70ns | ±1.34µs | 3,033,060.36 |
| bitStringToNumber-53 | 388.00ns | ±204.83ns | 2,577,319.59 |
| hexToPaddedBinary-small | 438.10ns | ±740.92ns | 2,282,583.88 |
| hexToPaddedBinary-medium | 670.40ns | ±1.44µs | 1,491,646.78 |
| hexToPaddedBinary-large | 1.50µs | ±1.44µs | 666,666.67 |


## String-view Benchmarks

| Benchmark | Mean | Margin | Operations/sec |
|-----------|------|--------|---------------|
| create-small | 246.80ns | ±2.58µs | 4,051,863.86 |
| cached-segmentation | 273.50ns | ±1.26µs | 3,656,307.13 |
| complex-emoji-handling | 507.50ns | ±2.12µs | 1,970,443.35 |
| chopLeft-ascii | 521.50ns | ±2.87µs | 1,917,545.54 |
| chopLeft-unicode | 552.50ns | ±2.73µs | 1,809,954.75 |
| chopInt-simple | 654.70ns | ±4.52µs | 1,527,417.14 |
| chopInt-signed | 668.80ns | ±3.71µs | 1,495,215.31 |
| chopFloat-simple | 691.50ns | ±4.55µs | 1,446,131.6 |
| charAt-unicode | 691.80ns | ±871.44ns | 1,445,504.48 |
| trim-large | 726.20ns | ±3.81µs | 1,377,031.12 |
| create-large | 901.10ns | ±22.10µs | 1,109,754.74 |
| chopFloat-signed | 1.15µs | ±17.55µs | 869,565.22 |
| trim-small | 1.30µs | ±18.03µs | 769,230.77 |
| parseFloat | 2.75µs | ±27.66µs | 363,636.36 |
| parseInt | 3.19µs | ±4.07µs | 313,479.62 |
| charAt-ascii | 4.18µs | ±113.06µs | 239,234.45 |
| iterate-unicode | 5.59µs | ±32.04µs | 178,890.88 |
| iterate-ascii | 6.52µs | ±56.61µs | 153,374.23 |
| chopInt-mixed | 33.02µs | ±22.78µs | 30,284.68 |
| chopFloat-mixed | 42.43µs | ±98.93µs | 23,568.23 |

