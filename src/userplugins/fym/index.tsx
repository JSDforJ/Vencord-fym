/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {
    ApplicationCommandInputType,
    ApplicationCommandOptionType,
} from "@api/Commands";
import {
    addContextMenuPatch,
    findGroupChildrenByChildId,
    NavContextMenuPatchCallback,
    removeContextMenuPatch,
} from "@api/ContextMenu";
import { DownArrow } from "@components/Icons";
import { insertTextIntoChatInputBox, sendMessage } from "@utils/discord";
import definePlugin from "@utils/types";
import { Menu } from "@webpack/common";

const messageContextMenuPatch: NavContextMenuPatchCallback = (
    children,
    props,
) => {
    // props contains: message, channel, guildId, etc.
    const { message, channel } = props;

    // Find an existing group to insert into
    const group = findGroupChildrenByChildId("copy-text", children);

    if (group) {
        group.push(
            <Menu.MenuItem
                id="fym-action"
                label="Fuck you mean"
                action={() => {
                    sendMessage(channel.id, {
                        content: `fym "${message.content}"`,
                    });
                }}
                icon={DownArrow}
            />,
        );
    }
};

export default definePlugin({
    name: "FYM",
    description:
        'Fuck you mean. Adds a /fym command to write fym "[text]" messages',
    authors: [
        {
            name: "jsdfj",
            id: 953369091975024735n,
        },
    ],
    start() {
        addContextMenuPatch("message", messageContextMenuPatch);
    },

    stop() {
        removeContextMenuPatch("message", messageContextMenuPatch);
    },
    commands: [
        {
            inputType: ApplicationCommandInputType.BUILT_IN,
            name: "fym",
            description: "Fuck you mean.",
            options: [
                {
                    name: "text",
                    description: "the text to fym",
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                },
            ],
            execute: async (opts, cmdCtx) => {
                setTimeout(() => {
                    insertTextIntoChatInputBox(`fym "${opts[0].value}"`);
                }, 1);
            },
        },
    ],
});
