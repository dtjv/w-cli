import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeParse from 'rehype-parse'
import rehypeDocument from 'rehype-document'
import rehypeFormat from 'rehype-format'
import rehypeWrap from 'rehype-wrap'
import rehypeAddClasses from 'rehype-add-classes'
import rehypeStringify from 'rehype-stringify'
import { css } from './css.js'

// TODO
// 1. add cli flags
// 1. read a markdown file
// 1. write result to output file

const workouts = [
  `
# john doe

## A

### push-ups
* 3 x 8-10

### bb squats
* 5 x 5 x 175#
`,
  `
# samantha gordon

## A

### push-ups
* 3 x 8-10

### bb squats
* 1 x 10 x 45#
* 1 x 10 x 90#
* 2 x 8 x 135#
* 5 x 5 x 175#

## B

### w.lunges
* 5 x 10e x 25#

### pull-ups
* 5 x 5 x 20#
`,
  `
# wilson fong

## A

### push-ups
* 3 x 8-10

### bb squats
* 1 x 10 x 45#
* 1 x 10 x 90#
* 2 x 8 x 135#
* 5 x 5 x 175#

## B

### w.lunges
* 5 x 10e x 25#

### pull-ups
* 5 x 5 x 20#

## C

### sprints
* 5 x 1min

### jump squats
* 1 x 20
* 1 x 30
* 1 x 40
`,
]

export const wod = async () => {
  const mdProcessor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeWrap, { wrapper: `div.workout` })
    .use(rehypeStringify)

  const wods = await Promise.all(
    workouts.map(async (workout) => await mdProcessor.process(workout))
  )

  const htmlProcessor = unified()
    .use(rehypeParse)
    .use(rehypeAddClasses, { body: 'container' })
    .use(rehypeDocument, { style: css })
    .use(rehypeFormat)
    .use(rehypeStringify)

  const w = await htmlProcessor.process(wods.map((w) => String(w)).join(''))

  console.log(String(w))

  process.exit(0)
}
