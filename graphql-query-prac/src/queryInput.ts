/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { window } from 'vscode';
import * as vscode from 'vscode';

import {request} from 'graphql-request';

import * as hljs from 'highlight.js';
import * as codeHighlightLinenums from 'code-highlight-linenums';

export async function showInputBoxMine() {
	let urlStr;
	let queryStr;
	let variables;

	urlStr = await window.showInputBox({
		placeHolder: "Select your API End-point",
		validateInput: text => {
			return text.includes("http") ? null : "Type your API End-Point with 'http'";
        },
    });
    
	queryStr = await window.showInputBox({
        value: getSelectedText(window.activeTextEditor),
		placeHolder: "Select your Query",
		validateInput: text => {
			return text.includes("query") ? null : "Type your query with 'query'";
		}
    });
    
	variables = window.showInputBox({
		placeHolder: "Select your Variable",
    });
    
    window.showInformationMessage(String(variables));

	makeWebview(urlStr, queryStr, variables);
}

function getSelectedText(editor: vscode.TextEditor | undefined): string {
    let str = '';
    if(editor) {
		str = (editor.document.getText(new vscode.Range(
			editor.selections[0].start.line,
			editor.selections[0].start.character,
			editor.selections[0].end.line, 
			editor.selections[0].end.character)));
    }
    return str;
}

export function makeWebview(URL: any, QUERY: any, VARIABLE: any): void {
	let panel = window.createWebviewPanel(
		'graphqlResponse',
		'Graphql Response',
		vscode.ViewColumn.Two
    );

    if(VARIABLE) {
        request(URL, QUERY, VARIABLE)
        .then((res) => {
            console.log(JSON.stringify(res, null, 4));
            panel.webview.html = getWebviewContent(res);
        });
    } else {
        request(URL, QUERY)
        .then((res) => {
            console.log(JSON.stringify(res, null, 4)); 
            panel.webview.html = getWebviewContent(res);
        });
    }
}

export function getWebviewContent(response: any): string {
    let formattedCode = codeHighlightLinenums(JSON.stringify(response, null, 2), {
        hljs,
        lang: 'json',
        start: 1
	});

	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            @charset "UTF-8";

            body.vscode-light {
            background-color: inherit;
            }

            body.vscode-dark {
            background-color: inherit;
            }

            body.vscode-high-contrast {
            background-color: inherit;
            }

            pre .hljs-comment {
            color: #57A64A;
            font-style: italic;
            }

            .vscode-light pre .hljs-attribute {
            color: #c82829;
            }

            .vscode-dark pre .hljs-attribute {
            color: #cc6666;
            }

            .vscode-high-contrast pre .hljs-attribute {
            color: #ff9da4;
            }

            .vscode-light pre .hljs-attr {
            color: #eab700;
            }

            .vscode-dark pre .hljs-attr {
            color: #f0c674;
            }

            .vscode-high-contrast pre .hljs-attr {
            color: #ffeead;
            }

            .vscode-light pre .hljs-number,
            .vscode-light pre .hljs-literal {
            color: #f5871f;
            }

            .vscode-dark pre .hljs-number,
            .vscode-dark pre .hljs-literal {
            color: #de935f;
            }

            .vscode-high-contrast pre .hljs-number,
            .vscode-high-contrast pre .hljs-literal {
            color: #ffc58f;
            }

            .vscode-light pre .hljs-string {
            color: #718c00;
            }

            .vscode-dark pre .hljs-string {
            color: #b5bd68;
            }

            .vscode-high-contrast pre .hljs-string {
            color: #d1f1a9;
            }

            .vscode-light pre .hljs-name,
            .vscode-dark pre .hljs-name,
            .vscode-high-contrast pre .hljs-name {
            color: #007acc;
            }

            .vscode-light pre .hljs-meta,
            .vscode-light pre .hljs-tag,
            .vscode-light pre .hljs-keyword {
            color: #8959a8;
            }

            .vscode-dark pre .hljs-meta,
            .vscode-dark pre .hljs-tag,
            .vscode-dark pre .hljs-keyword {
            color: #b294bb;
            }

            .vscode-high-contrast pre .hljs-meta,
            .vscode-high-contrast pre .hljs-tag,
            .vscode-high-contrast pre .hljs-keyword {
            color: #ebbbff;
            }

            pre .hljs-emphasis {
            font-style: italic;
            }

            pre .hljs-strong {
            font-weight: bold;
            }

            code {
            display: block;
            background: inherit;
            font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", "Courier New", monospace, "Droid Sans Fallback";
            font-size: 13px;
            line-height: 1.5;
            padding: 10px;
            white-space: pre-wrap;
            word-break: break-all;
            }

            .vscode-light pre code {
            color: #4d4d4c;
            }

            .vscode-dark pre code {
            color: #c5c8c6;
            }

            .vscode-high-contrast pre code {
            color: white;
            }

            .line .icon {
            position: absolute;
            display: inline-block;
            left: calc(2ch + 3px);
            top: 0.15em;
            width: 1em;
            height: 1em;
            cursor: pointer;
            }

            .vscode-light .line .icon {
            background: url(expand.svg);
            background-size: 1.2em;
            background-repeat: no-repeat;
            }

            .vscode-dark .line .icon,
            .vscode-high-contrast .line .icon {
            background: url(expand-dark.svg);
            background-size: 1.2em;
            background-repeat: no-repeat;
            }

            .line.collapsed .icon {
            position: absolute;
            display: inline-block;
            left: calc(2ch + 3px);
            top: 0.15em;
            width: 1em;
            height: 1em;
            cursor: pointer;
            }

            .vscode-light .line.collapsed .icon {
            background: url(collapse.svg);
            background-size: 1.2em;
            background-repeat: no-repeat;
            }

            .vscode-dark .line.collapsed .icon,
            .vscode-high-contrast .line.collapsed .icon {
            background: url(collapse-dark.svg);
            background-size: 1.2em;
            background-repeat: no-repeat;
            }

            code .line {
            display: inline-block;
            position: relative;
            padding-left: calc(2ch + 20px );
            }

            code .line.hidden-line {
            display: none;
            }

            code .line:after {
            content: ' ';
            }

            code .line.collapsed:after {
            color: grey;
            margin: 0.1em 0.2em 0 0.2em;
            content: "⋯";
            display: inline;
            line-height: 1.5;
            }

            code .line:before {
            box-sizing: content-box;
            display: inline-block;
            position: absolute;
            top: 0;
            bottom: 0;
            text-align: right;
            width: 2ch;
            content: attr(start);
            padding-right: 9px;
            padding-left: 9px;
            margin-left: calc(-2ch + -30px );
            margin-right: 9px;
            color: #787878;
            background-color: inherit;
            }

            a {
            color: #4080D0;
            text-decoration: none;
            }

            a:hover {
            color: #4080D0;
            text-decoration: underline;
            }

            /* Copy from https://github.com/Microsoft/vscode-docs/blob/master/release-notes/css/inproduct_releasenotes.css */
            #scroll-to-top {
            position: fixed;
            width: 40px;
            height: 40px;
            right: 25px;
            bottom: 25px;
            background-color:#444444;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 1px 1px 1px rgba(0,0,0,.25);
            }

            #scroll-to-top:hover {
            background-color:#007acc;
            box-shadow: 2px 2px 2px rgba(0,0,0,.25);
            }

            /* Theme-specific colors */
            body.vscode-light #scroll-to-top {
            background-color: #949494;
            }
            body.vscode-light #scroll-to-top:hover {
            background-color: #007acc;
            }

            body.vscode-high-contrast #scroll-to-top {
            background-color: black;
            border: 2px solid #6fc3df;
            box-shadow: none;
            }
            body.vscode-high-contrast #scroll-to-top:hover {
            background-color: #007acc;
            }

            #scroll-to-top span.icon::before {
            content: "";
            /* Chevron up icon */
            background:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsbDpub25lO30KPC9zdHlsZT4KPHRpdGxlPnVwY2hldnJvbjwvdGl0bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik04LDUuMWwtNy4zLDcuM0wwLDExLjZsOC04bDgsOGwtMC43LDAuN0w4LDUuMXoiLz4KPHJlY3QgY2xhc3M9InN0MSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2Ii8+Cjwvc3ZnPgo=');
            width: 1.2rem;
            height: 1.2rem;
            position: absolute;
            left: calc(50% - 1.2rem / 2);
            top: calc(50% - 1.2rem / 2);
            }
        </style>
        <title>GraphQL Response</title>
    </head>
    <body>
        <pre><code>${formattedCode}</code>
        </pre>
    </body>
    </html>`;
}