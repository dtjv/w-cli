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

export const wod = async (vfiles = []) => {
  const mdProcessor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeWrap, { wrapper: `div.workout` })
    .use(rehypeStringify)

  await Promise.all(
    vfiles.map(async (vfile) => await mdProcessor.process(vfile))
  )

  const htmlProcessor = unified()
    .use(rehypeParse)
    .use(rehypeAddClasses, { body: 'container' })
    .use(rehypeDocument, { style: css })
    .use(rehypeFormat)
    .use(rehypeStringify)

  return await htmlProcessor.process(
    vfiles.map((vfile) => vfile.toString()).join('')
  )
}
