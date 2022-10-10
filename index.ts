import '@logseq/libs'
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin';
import ElizaNode from 'elizanode'

const settingsSchema: SettingSchemaDesc[] = [
  {
    key: "elizaShortcut",
    type: "string",
    default: "ctrl+shift+enter",
    title: "Shortcut",
    description: "Keyboard shortcut to call Eliza",
  },
]

async function settings_are_valid() {
  const shortcut = logseq.settings!["elizaShortcut"]
  if (!shortcut) {
    console.error("Keyboard shortcut not configured for Eliza.")
    logseq.UI.showMsg(
      "Please configure a keyboard shortcut for Eliza.",
      "error"
    )
    return false
  }
  return true
}

async function main() {
  logseq.useSettingsSchema(settingsSchema)
  if (!await settings_are_valid()) {
    console.error("Eliza settings are invalid, exiting.")
    return
  }

  var eliza = new ElizaNode()
  const shortcut = logseq.settings!["elizaShortcut"]

  logseq.App.registerCommandShortcut({
    binding: shortcut,
    mode: "global"
  },
    async () => {
      const current_block = await logseq.Editor.getCurrentBlock()
      const input = await logseq.Editor.getEditingBlockContent()

      if (input) {
        const output = eliza.transform(input)
        await logseq.Editor.insertBlock(current_block!.uuid, output, { sibling: false })
        await logseq.Editor.insertBlock(current_block!.uuid, "", { sibling: true })
      }
      else {
        console.log("Eliza: No input, skipping...")
      }
    }
  )

  console.log('Eliza: ready.')
}

logseq.ready(main).catch(console.error)
