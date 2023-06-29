import * as vscode from 'vscode';

interface ConfigItem {
  trigger: string;
  description: string;
  hideName: boolean;
  format: string;
  prefix: string;
  suffix: string;
}

class GoCompletionItemProvider implements vscode.CompletionItemProvider {
  position?: vscode.Position;
  config: ConfigItem[];

  constructor(config: ConfigItem[]) {
    this.config = config;
  }

  public provideCompletionItems(
    _: vscode.TextDocument,
    position: vscode.Position
  ) {
    this.position = position;
    const completions = this.config.map((item) => {
      const snippetCompletion = new vscode.CompletionItem(
        item.trigger,
        vscode.CompletionItemKind.Operator
      );
      snippetCompletion.documentation = new vscode.MarkdownString(
        item.description
      );
      return snippetCompletion;
    });

    return completions;
  }

  public resolveCompletionItem(item: vscode.CompletionItem) {
    const label = item.label;
    if (this.position && this.config && typeof label === 'string') {
      const config = this.config.find((config) => config.trigger === label);
      item.command = {
        command: 'dot-usestate-replace',
        title: 'refactor',
        arguments: [this.position.translate(0, label.length + 1), config],
      };
      
    }

    return item;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const dotuseStateConfig: vscode.WorkspaceConfiguration =
    vscode.workspace.getConfiguration('dotuseState');

  const configList: ConfigItem[] | undefined = dotuseStateConfig.get('config');
  
  if (!configList) {
    return;
  }

  const options = vscode.languages.registerCompletionItemProvider(
    [
      'html',
      'javascript',
      'javascriptreact',
      'typescript',
      'typescriptreact',
      'vue',
    ],
    new GoCompletionItemProvider(configList),
    '.'
  );

  const command = 'dot-usestate-replace';

  const commandHandler = (
    editor: vscode.TextEditor,
    edit: vscode.TextEditorEdit,
    position: vscode.Position,
    config: ConfigItem
  ) => {
    const lineText = editor.document.lineAt(position.line).text;

    const matchVarReg = new RegExp(
      `\(\[^\\s\]*\[^\'\"\`\]\).${config.trigger}$`
    );

    const matchStrReg = new RegExp(
      `\(\[\'\"\`\]\)\(\[^\'\"\`\]*\)\\1\.${config.trigger}$`
    );

    let matchFlag: 'var' | 'str' = 'var';

    let text;
    let key;        
    let quote = "'";
    let insertVal = '';
    
    [text, key] = lineText.match(matchVarReg) || [];

    if (!key) {
      [text, quote, key] = lineText.match(matchStrReg) || [];
      matchFlag = 'str';
    }

    if (key) {
      const index = lineText.indexOf(text);
      edit.delete(
        new vscode.Range(
          position.with(undefined, index),
          position.with(undefined, index + text.length)
        )
      );
      const prefix = config.prefix || '';
      const suffix = config.suffix || '';

      if (matchFlag === 'var' && key.includes("'")) {
        quote = '"';
      }
      if (matchFlag === 'var') {
        if (config.hideName === true) {
          insertVal = `${config.format}(${key})`;
        } else {
          let setKey = "set" + key[0].toUpperCase() + key.slice(1);
          insertVal = `const [${key}, ${setKey}] = ${config.format}`;
        }
      }
      // if key is string format like console.log("xxx")
      if (matchFlag === 'str') {
        insertVal = `${config.format}(${quote}${key}${quote})`;
      }

      edit.insert(position.with(undefined, index), insertVal);
    }

    return Promise.resolve([]);
  };

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(command, commandHandler)
  );
  context.subscriptions.push(options);
}

export function deactivate() {}
