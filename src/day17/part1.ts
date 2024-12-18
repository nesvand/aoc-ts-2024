// Advent of Code - Day 17 - Part One

export function createProgram(input: string) {
    const [registersInput, programInput] = input.trim().split('\n\n');
    let [a, b, c] = registersInput.split('\n').map((line) => BigInt(line.trim().split(': ')[1]));
    const program = programInput.split(': ')[1].split(',').map(BigInt)

    let output: bigint[] = [];
    let pointer = 0;

    // Select the appropriate value from the register based on the operand
    const comboOperand = () => [0n, 1n, 2n, 3n, a, b, c][Number(program[pointer + 1])];
    const operand = () => program[pointer + 1];

    const instructions = [
        // ADV
        () => { a = a >> comboOperand(); }, // Dividing by powers of 2 is equivalent to shifting by the same amount ie. a / 2**2 === a >> 2
        // BXL
        () => { b = b ^ operand(); },
        // BST
        () => { b = comboOperand() & 7n; }, // AND 7 is equivalent to mod 8 (and more-correct in this case than % 8)
        // JNZ
        () => {
            if (!a) return;
            pointer = Number(operand()) - 2; // Subtract 2 because the program pointer is incremented after the instruction
        },
        // BXC
        () => { b = b ^ c; },
        // OUT
        () => { output.push(comboOperand() & 7n); },
        // BDV
        () => { b = a >> comboOperand(); },
        // CDV
        () => { c = a >> comboOperand(); },
    ];

    function run() {
        output = []; // Reset output
        [pointer, b, c] = [0, 0n, 0n]; // Reset program pointer and B/C registers
        while (program[pointer] !== undefined) {
            instructions[Number(program[pointer])]();
            pointer += 2;
        }
    }

    function bruteForce(aVal = 0n) {
        a = aVal;
        run();
        let matches = 0;
        for (let i = 0; i < program.length; i++) {
            if (output[i] === program[i]) matches++;
        }
        console.log(`Output: ${output.join(',')} for a = ${aVal} (${aVal.toString(2)}) with ${matches} matches`);
        if (matches === program.length) {
            return aVal;
        }

        return -1n;
    }

    /*
      Inspecting the brute-force output of the test program, we can see the following:
      
      As the register A is incremented, the output only changes in increments of 8 ie.
      
      ```
      Output: 0 for a = 0 with 1 matches
      ...
      Output: 0 for a = 7 with 1 matches
      Output: 1,0 for a = 8 with 0 matches
      ...
      Output: 1,0 for a = 15 with 0 matches
      Output: 2,0 for a = 16 with 0 matches
      ...
      Output: 2,0 for a = 23 with 0 matches
      ```
      
      Additionally, the changes propogate from the end of the output; that is to say
      every time the output changes, only one value changes and the rest (the end) remains
      the same ie.
      
      ```
      Output: 3,1,1,2,0 for a = 8792 with 0 matches
      ...
      Output: 4,1,1,2,0 for a = 8800 with 0 matches
      ...
      Output: 5,1,1,2,0 for a = 8808 with 0 matches
      ...
      Output: 6,1,1,2,0 for a = 8816 with 0 matches
      ```
     
      Lastly, given the above we can log the outputs matching the end of the program and
      compare the initial values. Of note, the start of each of these numbers (as binary) is
      the same (shifted by 3 bits ie. << 3).
      
      This means we can use intial values with outputs matching the end of the program to skip
      (by a factor of 8) to the next potential initial value (and recursively iterating through
      the next 8 values as we can't guarantee that every test value will result in us getting
      to the correct value).
      
      For example, given:
      ```
      Output: 0 for a = 0 (0) with 1 matches
      Output: 3,0 for a = 24 (11000) with 0 matches
      Output: 4,3,0 for a = 224 (11100000) with 1 matches
      Output: 5,4,3,0 for a = 1832 (11100101000) with 0 matches
      Output: 3,5,4,3,0 for a = 14680 (11100101011000) with 0 matches
      Output: 0,3,5,4,3,0 for a = 117440 (11100101011000000) with 6 matches
      ```
      
      We can ignore the first value as while it matches, it's a trivial match. The next true
      match is 24 (11000). That means we can skip over all the values up to 24 << 3 (192) and
      start looking from there. The next match is 224 (11100000) so we can skip to 224 << 3 (1792)
      etc. until we reach the correct value (117440).
      
      As you can see this reduces the search space immensely as we only need to check the next
      8 possible values from a given initial value each time we find a match instead of every
      integer value.
      
      (Note: this should also allow you to sanity-check the minimum value of the initial value
      as we expect 3 bits per output value - with 16 instructions in the input, this means the
      minimum value is 15 * 3 + 1 (46) or )
    */
    function searchForA(nextVal = 0n, i = program.length - 1): bigint {
        if (i < 0) return nextVal;
        for (let aVal = nextVal << 3n; aVal < (nextVal << 3n) + 8n; aVal++) {
            a = aVal;
            run();
            if (output[0] === program[i]) {
                const finalVal = searchForA(aVal, i - 1);
                if (finalVal >= 0) {
                    return finalVal;
                }
            }
        }
        return -1n;
    };

    return { run, getOutput: () => output, bruteForce, searchForA };
}

export function part1(input: string): string {
    const { run, getOutput } = createProgram(input);
    run();
    return getOutput().join(',');
}
