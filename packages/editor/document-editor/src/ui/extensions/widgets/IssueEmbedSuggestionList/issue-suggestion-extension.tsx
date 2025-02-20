import { Extension, Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import { Editor } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

export const IssueEmbedSuggestions = Extension.create({
  name: "issue-embed-suggestions",

  addOptions() {
    return {
      suggestion: {
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        char: "#issue_",
        pluginKey: new PluginKey("issue-embed-suggestions"),
        editor: this.editor,
        allowSpaces: true,

        ...this.options.suggestion,
      }),
    ];
  },
});
