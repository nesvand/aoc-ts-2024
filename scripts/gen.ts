import { access, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import * as ejs from 'ejs';
import chalk from 'chalk';
import z from 'zod';
import { fromZodError } from 'zod-validation-error';

const templateTargets = (dayName: string) => [
    ['scripts/templates/index.template.ejs', `src/${dayName}/index.ts`],
    ['scripts/templates/main.template.ejs', `src/${dayName}/main.ts`],
    ['scripts/templates/part1.template.ejs', `src/${dayName}/part1.ts`],
    ['scripts/templates/part2.template.ejs', `src/${dayName}/part2.ts`],
    ['scripts/templates/readme.template.ejs', `src/${dayName}/README.md`],
    ['scripts/templates/day.test.template.ejs', `test/${dayName}.test.ts`],
];

const inputTargetPath = (dayName: string): string => `src/${dayName}/resources/input.txt`;

const pipeAsync =
    (...funcs: CallableFunction[]) =>
    (input: any) =>
        funcs.reduce(async (v: any, func: CallableFunction) => func(await v), input);

// check it the file exists or not
const filePathExists = async (file: string): Promise<boolean> =>
    await access(file)
        .then(() => true)
        .catch(() => false);

// read the template file
async function readTemplate(templateFile: string): Promise<string> {
    return readFile(templateFile, 'utf8');
}

type TemplateData = {
    dayName: string;
    dayNumber: number;
};

// rendered the template with the data
function renderTemplate(templateData: TemplateData) {
    return async function (content: string) {
        return ejs.render(content, { data: templateData }, { async: true });
    };
}

// create the file with the rendered content
function createFile(filename: string) {
    return async function (content: string) {
        const fileExists = await filePathExists(filename);
        if (fileExists) {
            console.log(chalk.yellow('* ignoring ') + `${filename} already exists`);
            return;
        }

        try {
            const pathname = path.dirname(filename);
            const pathExist = await filePathExists(pathname);
            if (!pathExist) {
                await mkdir(pathname, { recursive: true });
            }
        } catch (err) {
            console.log(err);
        }

        await writeFile(filename, content);
        console.log(chalk.green('* creating ') + `${filename}`);
    };
}

const envSchema = z.object({
    AOC_YEAR: z.coerce.number().optional(),
    AOC_SESSION: z.string(),
});

// return the default year
function defaultYear(): number {
    const today = new Date();
    return today.getMonth() == 11 ? today.getFullYear() : today.getFullYear() - 1;
}

// fetch the puzzle input
async function fetchPuzzleInput(year: number, day: number, session: string) {
    if (session != '') {
        const url = `https://adventofcode.com/${year}/day/${day}/input`;
        const headers = { cookie: `session=${session}` };

        try {
            const content = await fetch(url, { headers });
            return content.status == 200 ? content.text() : '';
        } catch (err) {
            console.error(err);
        }
    }

    return '';
}

// (?<=day)  : positive lookbehind, match the string `day`
// \d+       : match one or more digits
// (?!\w)    : negative lookahead, match the end of the string
//             (the string must not be followed by a word character)
//             (e.g. day01, day02, day03, ...)
const DayArgumentValidator = /(?<=day)\d+(?!\w)/;

// run the main routine
(async function () {
    dotenv.config();

    const env = envSchema.safeParse(process.env);
    if (!env.success) {
        console.error(fromZodError(env.error));
        return;
    }

    // check if exists one only argument
    const dayName = process.argv[2];
    if (process.argv.length != 3) {
        console.log('--- `npm run gen` needs one only argument ---');
        return;
    }

    const dayValues = DayArgumentValidator.exec(dayName) || [];
    const dayNumber = dayValues.length == 1 ? parseInt(dayValues[0]) : 0;

    if (dayNumber == 0 || isNaN(dayNumber)) {
        console.log('--- The argument must be `day + NUM` (e.g. day01) ---');
        return;
    }

    const data = {
        dayName,
        dayNumber,
    } satisfies TemplateData;

    const { AOC_YEAR: year, AOC_SESSION: session } = env.data;
    const puzzleInput = await fetchPuzzleInput(year ?? defaultYear(), dayNumber, session);

    try {
        // create the input file
        await createFile(inputTargetPath(dayName))(puzzleInput);

        // create and render the template files
        templateTargets(dayName).forEach(([templatePath, targetPath]) => {
            pipeAsync(readTemplate, renderTemplate(data), createFile(targetPath))(templatePath);
        });
    } catch (err) {
        console.error(err);
    }
})();
