const { decryptMedia, Client } = require('@open-wa/wa-automate')
const config = require('../config.json')


module.exports = msgHandler = async (client =  new Client(), message) => {
    try {
        const { type, id, fromMe, from, t, sender, buttons, selectedButtonId, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, chatId, mentionedJidList, author } = message
        let { body } = message
        const cmd = caption || body || ''
        const command = cmd.toLowerCase().split(' ')[0] || ''
        const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
        //untuk #perfix
        const args = body.trim().split(/ +/).slice(1)
        const q = args.join(' ')

        // validator
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
        const isQuotedVoice = quotedMsg && quotedMsg.type === 'ptt'
        const isImage = type === 'image'
        const isVideo = type === 'video'
        const isAudio = type === 'audio'
        const isVoice = type === 'ptt'
        const isGif = mimetype === 'image/gif'
        const uaOverride = config.uaOverride
        

        switch (command) {
            case 'holo': // Premium, chat VideFikri
                await client.reply(from, 'Tes', id)
            break

            case 'azar': // Premium, chat VideFikri
                await client.reply(from, 'Hai '+command, id)
            break

            case 'stiker':
                if (isMedia && isImage || isQuotedImage) {
                    await client.reply(from, "wait", id)
                    const encryptMedia = isQuotedImage ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    
                    await client.sendImageAsSticker(from, imageBase64, { author: "authorWm", pack: "packWm" })
                    console.log(`Sticker processed  seconds`)
                } else {
                    await client.reply(from, "gagal", id)
                }
            break

            case 'sgif':
                if (isMedia && isVideo || isGif || isQuotedVideo || isQuotedGif) {
                    await client.reply(from, "wait", id)
                    try {
                        const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const _mimetype = isQuotedVideo || isQuotedGif ? quotedMsg.mimetype : mimetype
                    const videoBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendMp4AsSticker(from, videoBase64, null, { stickerMetadata: true, author: "authorWm", pack: "packWm", keepScale: true, fps: 30, startTime: '00:00:00.0', endTime : '00:00:05.0', crop: false, loop: 0 })
                            .then(() => {
                                console.log(` seconds`)
                            })
                    } catch (err) {
                        console.error(err)
                        await client.reply(from," ind.videoLimit()", id)
                    }
                } else {
                    await client.reply(from, "ind.wrongFormat()", id)
                }
            break

            case 'bc':
                if (!q) return await client.reply(from, "ind.emptyMess()", id)
                const chats = await client.getAllChatIds()
                for (let bcs of chats) {
                    let cvk = await client.getChatById(bcs)
                    if (!cvk.isReadOnly) await client.sendText(bcs, `${q}\n\n- \n_Broadcasted message_`)
                }
                await client.reply(from, "ind.doneOwner()", id)
            break
        }

    } catch (err){
        console.error('error', err)
    }
}