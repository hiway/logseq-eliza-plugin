import '@logseq/libs'
import ElizaNode from 'elizanode'

async function main() {
  var eliza = new ElizaNode()

  logseq.App.registerCommandShortcut({
    binding: "ctrl+shift+enter",
    mode: "global"
  },
    async () => {
      const current_block = await logseq.Editor.getCurrentBlock()
      const input = await logseq.Editor.getEditingBlockContent()

      if (input) {
        const output = eliza.transform(input)
        const formatted_output = `Eliza: *${output}*`
        const reply_block = await logseq.Editor.insertBlock(current_block!.uuid, formatted_output, { sibling: true })
        await logseq.Editor.insertBlock(reply_block!.uuid, "", { sibling: true })
      }
      else {
        console.log("Eliza: No input, skipping...")
      }
    }
  )

  console.log('Eliza: ready.')
}

logseq.ready(main).catch(console.error)
