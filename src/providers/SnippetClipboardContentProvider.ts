import { randomUUID } from 'crypto';
import {
  CancellationToken,
  CustomDocument,
  CustomDocumentBackup,
  CustomDocumentBackupContext,
  CustomDocumentContentChangeEvent,
  CustomDocumentEditEvent,
  CustomDocumentOpenContext,
  CustomEditorProvider,
  EventEmitter,
  TextEditorEdit,
  Uri,
  WebviewPanel,
} from "vscode";
import { StringTextEditProvider } from "./StringTextEditProvider";

export interface SnippetClipboardDocument extends CustomDocument {
  content: string;
}

export class SnippetClipboardContentProvider implements CustomEditorProvider<SnippetClipboardDocument> {
  public readonly scheme = "snippet-clipboard";
  private _onDidChangeCustomDocument = new EventEmitter<
    CustomDocumentEditEvent<SnippetClipboardDocument> | CustomDocumentContentChangeEvent<SnippetClipboardDocument>
  >();
  private documents = new Map<string, string>();

  public onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

  public saveCustomDocument(document: CustomDocument, cancellation: CancellationToken): Thenable<void> {
    throw new Error("Method not implemented.");
  }

  public saveCustomDocumentAs(
    document: SnippetClipboardDocument,
    destination: Uri,
    cancellation: CancellationToken
  ): Thenable<void> {
    throw new Error("Method not implemented.");
  }

  public revertCustomDocument(document: SnippetClipboardDocument, cancellation: CancellationToken): Thenable<void> {
    throw new Error("Method not implemented.");
  }

  public backupCustomDocument(
    document: SnippetClipboardDocument,
    context: CustomDocumentBackupContext,
    cancellation: CancellationToken
  ): Thenable<CustomDocumentBackup> {
    throw new Error("Method not implemented.");
  }

  public openCustomDocument(
    uri: Uri,
    openContext: CustomDocumentOpenContext,
    token: CancellationToken
  ): SnippetClipboardDocument | Thenable<SnippetClipboardDocument> {
    return {
      uri,
      dispose: this.disposeDocument.bind(this, uri),
      content: this.documents.get(uri.path) ?? "",
    };
  }

  public resolveCustomEditor(
    document: SnippetClipboardDocument,
    webviewPanel: WebviewPanel,
    token: CancellationToken
  ): void | Thenable<void> {
    throw new Error("Method not implemented.");
  }

  public registerSnippetDocument(text: string): Uri {
    const documentId = randomUUID();
    const uri = Uri.parse(`snippet-clipboard:${documentId}`);
    this.documents.set(uri.path, text);
    this._onDidChangeCustomDocument.fire(uri);

    return uri;
  }

  public replaceSnippetDocument(uri: Uri, text: string): void {
    this.documents.set(uri.path, text);
    this._onDidChangeCustomDocument.fire(uri);
  }

  public edit(uri: Uri, callback: (editor: TextEditorEdit) => void): boolean {
    const edit = new StringTextEditProvider(this.documents.get(uri.path) ?? "");
    callback(edit);
    const editedText = edit.apply();

    if (editedText === false) return false;

    this.replaceSnippetDocument(uri, editedText);
    return true;
  }

  public disposeDocument(uri: Uri): void {
    this.documents.delete(uri.path);
    this._onDidChangeCustomDocument.fire(uri);
  }
}