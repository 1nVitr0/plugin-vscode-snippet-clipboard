import { DynamicSnippetService } from "../services/DynamicSnippetService";
import { SnippetClipboardService } from "../services/SnippetClipboardService";
import { SnippetEditorService } from "../services/SnippetEditorService";
import { ExtensionContext, Disposable } from 'vscode';
import { ConfigurationProvider } from './ConfigurationProvider';
import { SnippetClipboardFileSystemProvider } from "./SnippetClipboardFileSystemProvider";

export class SnippetServiceProvider implements Disposable {
  public readonly dynamicSnippet: DynamicSnippetService;
  public readonly clipboard: SnippetClipboardService;
  public readonly editor: SnippetEditorService;

  public constructor(
    context: ExtensionContext,
    config: ConfigurationProvider,
    fileSystemProvider: SnippetClipboardFileSystemProvider
  ) {
    this.dynamicSnippet = new DynamicSnippetService(this, config);
    this.clipboard = new SnippetClipboardService(context, config);
    this.editor = new SnippetEditorService(config, fileSystemProvider);
  }

  public dispose() {
    this.dynamicSnippet.dispose();
    this.clipboard.dispose();
    this.editor.dispose();
  }
}