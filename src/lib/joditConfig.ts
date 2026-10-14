import type { Config } from "jodit/esm/config";
import type { DeepPartial } from "jodit/esm/types";

const joditConfig: DeepPartial<Config> = {
  readonly: false,
  height: 350,
  toolbarSticky: false,
  spellcheck: true,
  buttons: [
    "bold",
    "italic",
    "underline",
    "|",
    "ul",
    "ol",
    "|",
    "font",
    "fontsize",
    "brush",
    "|",
    "align",
    "outdent",
    "indent",
    "|",
    "link",
    "image",
    "table",
    "|",
    "source", // Enable HTML source/code editing
    "|",
    "undo",
    "redo",
    "|",
    "hr",
    "eraser",
    "fullsize",
  ],
  statusbar: true,
  placeholder: "Describe your product...",
};

export default joditConfig;
