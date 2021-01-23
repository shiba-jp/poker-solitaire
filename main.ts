namespace SpriteKind {
    export const card = SpriteKind.create()
    export const dummy = SpriteKind.create()
    export const cursor = SpriteKind.create()
    export const animeCard = SpriteKind.create()
    export const handName = SpriteKind.create()
    export const score = SpriteKind.create()
}
function initFields () {
    columns = [24, 40, 56, 72, 88]
    rows = [24, 40, 56, 72, 88]
}
function initCursor () {
    cursor = sprites.create(img`
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 . . . . . . . . . . . . 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
        2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2
    `, SpriteKind.cursor)
    cursor.setFlag(SpriteFlag.ShowPhysics, false)
    posX = 0
    posY = 0
    moveSprite(cursor, posX, posY)
}
function drawCard () {
    //before drawing card status.
    if(status == 2) {
        throwCard = sprites.create(img_throwCard, SpriteKind.animeCard)
        throwCard.setPosition(32, 110)
        girl.say("Draw!", 500)
        pause(200)
        
        throwCard.setPosition(75, 110)
        pause(300)
        //throwCard.ax = 400

        /**
        currentCardNo = getCardNo()
        putCardNoList.push(currentCardNo)
        currentCard = sprites.create(imageList[currentCardNo], SpriteKind.card)
        currentCard.setPosition(75, 110)
        status = 1 //After drawing card status.

        if (putCardNoList.length > 25) {
            finishGame()
        }
         */
    }
}
sprites.onOverlap(SpriteKind.animeCard, SpriteKind.dummy, function (sprite, otherSprite) {
    throwCard.destroy()
    currentCardNo = getCardNo()
    putCardNoList.push(currentCardNo)
    currentCard = sprites.create(imageList[currentCardNo], SpriteKind.card)
    currentCard.setPosition(75, 110)
    status = 1 //After drawing card status.

    if (putCardNoList.length > 25) {
        finishGame()
    }
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if(cursor == null){
        return
    }
    
    if (posY - 1 >= 0) {
        posY += -1
    }else if (posY - 1 == -1) {
        posY = 4
    }
    moveSprite(cursor, posX, posY)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if(cursor == null){
        return
    }
    
    if (posY + 1 <= 4) {
        posY += 1
    }else if (posY + 1 == 5) {
        posY = 0
    }
    moveSprite(cursor, posX, posY)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if(cursor == null){
        return
    }
    if (posX - 1 >= 0) {
        posX += -1
    }else if (posX - 1 == -1) {
        posX = 4
    }
    moveSprite(cursor, posX, posY)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if(cursor == null){
        return
    }
    if (posX + 1 <= 4) {
        posX += 1
    }else if (posX + 1 == 5) {
        posX = 0
    }
    moveSprite(cursor, posX, posY)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if(status == 1 && currentHandsList != null) {
        let hands: string = ""

        if(currentHandsList.length == 0) {
            hands = "No hand."
        }else{
            for(let i = 0; i < currentHandsList.length; i++) {
                if(i == currentHandsList.length -1) {
                    hands = hands + currentHandsList[i]
                }else{
                    hands = hands + currentHandsList[i] + "\n"
                }
            }
        }

        game.showLongText(hands, DialogLayout.Center)
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    //After drawing card status.
    if(status == 1) {
        let success = moveSprite(currentCard, posX, posY)
        if(success) {
            //calc score evrytime
            calcScore()

            //before drawing card status.
            status = 2
            drawCard()
        }
    }
})
function initHandCounter() {
    counter_1pair = 0
    counter_2pair = 0
    counter_3card = 0
    counter_4card = 0
    counter_fullHouse = 0
    counter_flush = 0
    counter_straight = 0
    counter_sf = 0
}
function calcScore() {
    console.log("calcScore start.")
    initHandCounter()
    currentHandsList = []
    let existSimpleHand: boolean = false
    
    for(let way = 0; way < 12; way++){
        let h:number[] = []
        for(let i = 0; i < 5; i++){
            h[i] = putCardMap[mx[way][i]][my[way][i]]
        }
        let k: number = 0
        for(let i = 0; i < 4; i++) {
            for(let j = i + 1; j < 5; j++) {
                if(h[i] == null) continue
                if(h[j] == null) continue

                if(getRank(h[i]) == getRank(h[j])) {
                    k++
                }
            }
        }

        if(k == 1){
            counter_1pair++
            currentHandsList.push(wayName[way] + "1pair")
            drawHandMark(way, img_handmark_1pair)
            console.logValue("1pair way", way)
            existSimpleHand = true
        }
        if(k == 2){
            counter_2pair++
            currentHandsList.push(wayName[way] + "2pair")
            drawHandMark(way, img_handmark_2pair)
            console.logValue("2pair way", way)
            existSimpleHand = true
        }
        if(k == 3){
            counter_3card++
            currentHandsList.push(wayName[way] + "3card")
            drawHandMark(way, img_handmark_3card)
            console.logValue("3card way", way)
            existSimpleHand = true
        }
        if(k == 4){
            counter_fullHouse++
            currentHandsList.push(wayName[way] + "FullHouse")
            drawHandMark(way, img_handmark_fullHouse)
            console.logValue("fullhouse way", way)
            existSimpleHand = true
        }
        if(k == 6){
            counter_4card++
            currentHandsList.push(wayName[way] + "4card")
            drawHandMark(way, img_handmark_4card)
            console.logValue("4card way", way)
            existSimpleHand = true
        }

        //カードが5枚以下、もしくは上の役がすでにある場合は処理をスキップ
        if(h.indexOf(null) > -1 || existSimpleHand) {
            existSimpleHand = false
            continue;    
        }

        for(let i = 4; i >= 0; i--) {
            for(let j = 0; j < i; j++) {
                if(h[j] > h[j+1]) {
                    h = swap(h, j, (j + 1))
                }
            }
        }

        let sf: number = 0
        if((getRank(h[4]) - getRank(h[0])) == 4) {
            
            sf = 1
        }

        if(getRank(h[0]) == 0 && getRank(h[1]) == 9) {
            sf = 1
        }

        k = 0
        for(let i = 0; i < 4; i++) {
            if(getSuit(h[i]) == getSuit(h[i+1])) {
                k++
            }
        } 

        if(k == 4) {
            sf = sf + 2
        }

        if(sf == 1) {
            counter_straight++
            currentHandsList.push(wayName[way] + "Straight")
            drawHandMark(way, img_handmark_straight)
            console.logValue("Straight way", way)
        }
        if(sf == 2) {
            counter_flush++
            currentHandsList.push(wayName[way] + "Flush")
            drawHandMark(way, img_handmark_flush)
            console.logValue("Flush way", way)
        }
        if(sf == 3) {
            counter_sf++
            currentHandsList.push(wayName[way] + "S.F")
            drawHandMark(way, img_handmark_straightFlush)
            console.logValue("S.F way", way)
        }
    }

    displayHandCounter()

    info.setScore(getScore())

    console.log("calcScore end.")
}
function swap(arr:number[], i:number, j:number){
  arr[i] = [arr[j], arr[j] = arr[i]][0];
  return arr;
}
function getScore() {
    let score: number = 0

    score = score + counter_1pair * 2
    score = score + counter_2pair * 5
    score = score + counter_3card * 10
    score = score + counter_straight * 15
    score = score + counter_flush * 20
    score = score + counter_fullHouse * 25
    score = score + counter_4card * 50
    score = score + counter_sf * 75

    if(score > info.score()) {
        music.baDing.play(volume)
    }

    return score
}
function getRank(cardNo: number) {
    return　Math.floor(cardNo / 4)
}
function getSuit(cardNo: number) {
    return cardNo % 4
}
function displayHandCounter() {
    onePair_num_tp.setImage(imgNumList[Math.floor(counter_1pair / 10)])
    onePair_num_fp.setImage(imgNumList[counter_1pair % 10])
    twoPair_num_tp.setImage(imgNumList[Math.floor(counter_2pair / 10)])
    twoPair_num_fp.setImage(imgNumList[counter_2pair % 10])
    threeCard_num_tp.setImage(imgNumList[Math.floor(counter_3card / 10)])
    threeCard_num_fp.setImage(imgNumList[counter_3card % 10])
    fourCard_num_tp.setImage(imgNumList[Math.floor(counter_4card / 10)])
    fourCard_num_fp.setImage(imgNumList[counter_4card % 10])
    fullHouse_num_tp.setImage(imgNumList[Math.floor(counter_fullHouse / 10)])
    fullHouse_num_fp.setImage(imgNumList[counter_fullHouse % 10])
    flush_num_tp.setImage(imgNumList[Math.floor(counter_flush / 10)])
    flush_num_fp.setImage(imgNumList[counter_flush % 10])
    straight_num_tp.setImage(imgNumList[Math.floor(counter_straight / 10)])
    straight_num_fp.setImage(imgNumList[counter_straight % 10])
    sf_num_tp.setImage(imgNumList[Math.floor(counter_sf / 10)])
    sf_num_fp.setImage(imgNumList[counter_sf % 10])
}
function finishGame() {
    status = 3 //Finish Status
    effects.confetti.startScreenEffect()
    pause(2000)
    game.showLongText(
        "Score: " + info.score() + "P" + 
        "\n     " + 
        //"\nHi: " + info.highScore() + "P" +
        "\n1pair:2Px" + counter_1pair +
        "\n2pair:5Px" + counter_2pair +
        "\n3card:10Px" + counter_3card +
        "\nStraight:15Px" + counter_straight +
        "\nFlush:20Px" + counter_flush +
        "\nFullHouse:25Px" + counter_fullHouse +
        "\n4card:50Px" + counter_4card +
        "\nS.F:75Px" + counter_sf
        , DialogLayout.Center)
    
    game.over((info.score() > info.highScore()))
}
game.onUpdateInterval(5000, function() {
    if(girl != null) {
        girl.say(girlsDialogue[randint(0, (girlsDialogue.length-1))], 1000)
    }
})
function isUsedPalce (posX: number, posY: number) {
    let result: boolean = false
    for (let i = 0; i <= putPosX.length - 1; i++) {
        if (putPosX[i] == posX && putPosY[i] == posY) {
            result = true
            break;
        }
    }
    return result
}
function getCardNo() : number {
    let buffNo: number = randint(0, imageList.length - 1)
    if (putCardNoList.indexOf(buffNo) == -1) {
        return buffNo
    } else {
        return getCardNo()
    }
}

function moveSprite (sprite: Sprite, posX: number, posY: number) {
    if (sprite.kind() == SpriteKind.card) {
        if (isUsedPalce(posX, posY)) {
            //game.showLongText("There's already a card in that spot.", DialogLayout.Bottom)
            return false
        } else {
            sprite.x = columns[posX]
            sprite.y = rows[posY]            
            scene.backgroundImage().drawTransparentImage(sprite.image, sprite.x - 8, sprite.y - 8)
            sprite.destroy()

            putPosX.push(posX)
            putPosY.push(posY)
            putCardMap[posX][posY] = currentCardNo
            
            /** 
            for(let i = 0; i < 5; i++){
                let logLine: string = ""
                
                for(let j = 0; j < 5; j++) {
                    let val = ""
                    if(putCardMap[j][i] != null){
                        val = putCardMap[j][i].toString()
                    }else{
                        val = "null"
                    }
                    logLine = logLine + val + ","
                }
                console.logValue("Row" + i + ":", logLine)
            }
            */
            return true
        }
    } else {
        sprite.x = columns[posX]
        sprite.y = rows[posY]
        return true
    }
}
function initNumImage() {
    imgNumList = [
        img_n0 = img`
            f f f f f f
            f f 1 1 f f
            f 1 f f 1 f
            f 1 f f 1 f
            f 1 f f 1 f
            f 1 f f 1 f
            f f 1 1 f f
            f f f f f f
        `,
        img_n1 = img`
            f f f f f f
            f f 1 f f f
            f 1 1 f f f
            f f 1 f f f
            f f 1 f f f
            f f 1 f f f
            f 1 1 1 f f
            f f f f f f
        `,
        img_n2 = img`
            f f f f f f
            f f 1 1 f f
            f 1 f f 1 f
            f f f f 1 f
            f f f 1 f f
            f f 1 f f f
            f 1 1 1 1 f
            f f f f f f
        `,
        img_n3 = img`
            f f f f f f
            f 1 1 1 1 f
            f f f 1 f f
            f f 1 1 f f
            f f f f 1 f
            f f f f 1 f
            f 1 1 1 f f
            f f f f f f
        `,
        img_n4 = img`
            f f f f f f
            f f f 1 f f
            f f 1 1 f f
            f 1 f 1 f f
            1 f f 1 f f
            1 1 1 1 1 f
            f f f 1 f f
            f f f f f f
        `,
        img_n5 = img`
            f f f f f f
            f 1 1 1 1 f
            f 1 f f f f
            f 1 1 1 f f
            f f f f 1 f
            f f f f 1 f
            f 1 1 1 f f
            f f f f f f
        `,
        img_n6 = img`
            f f f f f f
            f f 1 1 f f
            f 1 f f f f
            f 1 1 1 f f
            f 1 f f 1 f
            f 1 f f 1 f
            f f 1 1 f f
            f f f f f f
        `,
        img_n7= img`
            f f f f f f
            f 1 1 1 1 f
            f f f f 1 f
            f f f f 1 f
            f f f 1 f f
            f f 1 f f f
            f f 1 f f f
            f f f f f f
        `,
        img_n8 = img`
            f f f f f f
            f f 1 1 f f
            f 1 f f 1 f
            f f 1 1 f f
            f 1 f f 1 f
            f 1 f f 1 f
            f f 1 1 f f
            f f f f f f
        `,
        img_n9 = img`
            f f f f f f
            f f 1 1 f f
            f 1 f f 1 f
            f 1 f f 1 f
            f f 1 1 1 f
            f f f f 1 f
            f f 1 1 f f
            f f f f f f
        `
    ]

    onePair_num_tp = sprites.create(img_n0, SpriteKind.score)
    onePair_num_fp = sprites.create(img_n0, SpriteKind.score)
    twoPair_num_tp = sprites.create(img_n0, SpriteKind.score)
    twoPair_num_fp = sprites.create(img_n0, SpriteKind.score)
    threeCard_num_tp = sprites.create(img_n0, SpriteKind.score)
    threeCard_num_fp = sprites.create(img_n0, SpriteKind.score)
    fourCard_num_tp = sprites.create(img_n0, SpriteKind.score)
    fourCard_num_fp = sprites.create(img_n0, SpriteKind.score)
    fullHouse_num_tp = sprites.create(img_n0, SpriteKind.score)
    fullHouse_num_fp = sprites.create(img_n0, SpriteKind.score)
    flush_num_tp = sprites.create(img_n0, SpriteKind.score)
    flush_num_fp = sprites.create(img_n0, SpriteKind.score)
    straight_num_tp = sprites.create(img_n0, SpriteKind.score)
    straight_num_fp = sprites.create(img_n0, SpriteKind.score)
    sf_num_tp = sprites.create(img_n0, SpriteKind.score)
    sf_num_fp = sprites.create(img_n0, SpriteKind.score)

    onePair_num_tp.setPosition(120, 24)
    onePair_num_fp.setPosition(126, 24)

    twoPair_num_tp.setPosition(120, 40)
    twoPair_num_fp.setPosition(126, 40)

    threeCard_num_tp.setPosition(120, 56)
    threeCard_num_fp.setPosition(126, 56)

    straight_num_tp.setPosition(120, 72)
    straight_num_fp.setPosition(126, 72)

    flush_num_tp.setPosition(151, 24)
    flush_num_fp.setPosition(157, 24)

    fullHouse_num_tp.setPosition(151, 40)
    fullHouse_num_fp.setPosition(157, 40)

    fourCard_num_tp.setPosition(151, 56)
    fourCard_num_fp.setPosition(157, 56)

    sf_num_tp.setPosition(151, 72)
    sf_num_fp.setPosition(157, 72)
}
function initCardImage () {
    imageList = [
        img_SpA = img`
            . . . . . . . . . . . . . . . .
            . . . c c c c c c c c c c . . .
            . . c 1 1 1 1 1 1 1 1 1 1 c . .
            . . c 1 c c c 1 1 1 1 1 1 c . .
            . . c 1 c 1 c 1 1 1 1 1 1 c . .
            . . c 1 c c c 1 1 1 1 1 1 c . .
            . . c 1 c 1 c 1 1 1 1 1 1 c . .
            . . c 1 c 1 c 1 1 1 1 1 1 c . .
            . . c 1 1 1 1 1 1 c 1 1 1 c . .
            . . c 1 1 1 1 1 c c c 1 1 c . .
            . . c 1 1 1 1 c c c c c 1 c . .
            . . c 1 1 1 1 c c c c c 1 c . .
            . . c 1 1 1 1 1 1 c 1 1 1 c . .
            . . c 1 1 1 1 1 1 1 1 1 1 c . .
            . . . c c c c c c c c c c . . .
            . . . . . . . . . . . . . . . .
        `,
        img_HtA = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_DiA = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_CbA = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        imb_Sp2 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht2 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di2 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        imb_Cb2 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp3 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht3 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di3 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb3 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp4 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht4 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di4 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb4 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp5 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht5 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di5 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb5 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp6 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht6 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di6 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb6 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp7 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht7 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di7 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb7 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp8 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht8 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di8 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb8 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp9 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht9 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di9 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb9 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Sp10 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c c c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c c 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Ht10 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 2 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 2 2 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Di10 = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 2 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 2 1 1 1 1 2 . . 
            . . 2 1 2 1 2 2 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_Cb10 = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c c c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c 1 c 1 1 1 1 c . . 
            . . c 1 c 1 c c 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_SpJ = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c 1 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_HtJ = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_DiJ = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_CbJ = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c 1 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_SpQ = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 c 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_HtQ = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 2 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_DiQ = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 2 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_CbQ = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c c 1 1 1 1 1 1 c . . 
            . . c 1 1 c 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_SpK = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c c 1 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 c c c c c 1 c . . 
            . . c 1 1 1 1 1 1 c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_HtK = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 2 2 1 2 2 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_DiK = img`
            . . . . . . . . . . . . . . . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 2 1 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 2 1 2 1 1 1 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 2 2 2 2 2 1 2 . . 
            . . 2 1 1 1 1 1 2 2 2 1 1 2 . . 
            . . 2 1 1 1 1 1 1 2 1 1 1 2 . . 
            . . 2 1 1 1 1 1 1 1 1 1 1 2 . . 
            . . . 2 2 2 2 2 2 2 2 2 2 . . . 
            . . . . . . . . . . . . . . . . 
            `,
        img_CbK = img`
            . . . . . . . . . . . . . . . . 
            . . . c c c c c c c c c c . . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c c 1 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 c 1 c 1 1 1 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 c c 1 1 c c 1 c . . 
            . . c 1 1 1 1 1 c c 1 1 1 c . . 
            . . c 1 1 1 1 1 1 1 1 1 1 c . . 
            . . . c c c c c c c c c c . . . 
            . . . . . . . . . . . . . . . . 
            `
    ]
}
function initHandMarkImage() {
    img_handmark_1pair = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . a a . . . . . . .
        . . . . . . a d a a . . . . . .
        . . . . . a a a a a a . . . . .
        . . . . . a d a a a a . . . . .
        . . . . . . a d a a . . . . . .
        . . . . . . . a a . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_2pair = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 8 8 . . . . . . .
        . . . . . . 8 d 8 8 . . . . . .
        . . . . . 8 8 8 8 8 8 . . . . .
        . . . . . 8 d 8 8 8 8 . . . . .
        . . . . . . 8 d 8 8 . . . . . .
        . . . . . . . 8 8 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_3card = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 4 4 . . . . . . .
        . . . . . . 4 d 4 4 . . . . . .
        . . . . . 4 4 4 4 4 4 . . . . .
        . . . . . 4 d 4 4 4 4 . . . . .
        . . . . . . 4 d 4 4 . . . . . .
        . . . . . . . 4 4 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_4card = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 3 3 . . . . . . .
        . . . . . . 3 1 3 3 . . . . . .
        . . . . . 3 3 3 3 3 3 . . . . .
        . . . . . 3 1 3 3 3 3 . . . . .
        . . . . . . 3 1 3 3 . . . . . .
        . . . . . . . 3 3 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_fullHouse = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . e e . . . . . . .
        . . . . . . e d e e . . . . . .
        . . . . . e e e e e e . . . . .
        . . . . . e d e e e e . . . . .
        . . . . . . e d e e . . . . . .
        . . . . . . . e e . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_flush = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 5 5 . . . . . . .
        . . . . . . 5 1 5 5 . . . . . .
        . . . . . 5 5 5 5 5 5 . . . . .
        . . . . . 5 1 5 5 5 5 . . . . .
        . . . . . . 5 1 5 5 . . . . . .
        . . . . . . . 5 5 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_straight = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 6 6 . . . . . . .
        . . . . . . 6 1 6 6 . . . . . .
        . . . . . 6 6 6 6 6 6 . . . . .
        . . . . . 6 1 6 6 6 6 . . . . .
        . . . . . . 6 1 6 6 . . . . . .
        . . . . . . . 6 6 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_handmark_straightFlush = img`
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . 2 2 . . . . . . .
        . . . . . . 2 1 2 2 . . . . . .
        . . . . . 2 2 2 2 2 2 . . . . .
        . . . . . 2 1 2 2 2 2 . . . . .
        . . . . . . 2 1 2 2 . . . . . .
        . . . . . . . 2 2 . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `
}
function drawHandMark(way: number, img: Image) {
    let bgImage = scene.backgroundImage()

    if(way == 0) { bgImage.drawTransparentImage(img, 2, 16) }
    if(way == 1) { bgImage.drawTransparentImage(img, 2, 32) }
    if(way == 2) { bgImage.drawTransparentImage(img, 2, 48) }
    if(way == 3) { bgImage.drawTransparentImage(img, 2, 64) }
    if(way == 4) { bgImage.drawTransparentImage(img, 2, 80) }
    if(way == 5) { bgImage.drawTransparentImage(img, 16, 2) }
    if(way == 6) { bgImage.drawTransparentImage(img, 32, 2) }
    if(way == 7) { bgImage.drawTransparentImage(img, 48, 2) }
    if(way == 8) { bgImage.drawTransparentImage(img, 64, 2) }
    if(way == 9) { bgImage.drawTransparentImage(img, 80, 2) }
    if(way == 10) { bgImage.drawTransparentImage(img, 4, 92) }
    if(way == 11) { bgImage.drawTransparentImage(img, 92, 92) }
}
function initHandImage() {
    img_hand_1pair = img`
        . . . . . . . . . . . . . . . .
        . . . . . . a a a a . . . . . .
        . . . . a a a a a a a a . . . .
        . . . a a a b b b b a a a . . .
        . . a a b b b b b b b b a a . .
        . . a a b b 1 b b 1 1 b a a . .
        . a a b b 1 1 b b 1 b 1 b a a .
        . a a b b b 1 b b 1 b 1 b a a .
        . a a b b b 1 b b 1 1 b b a a .
        . a a b b b 1 b b 1 b b b a a .
        . . a a b 1 1 1 b 1 b b a a . .
        . . a a b b b b b b b b a a . .
        . . . a a a b b b b a a a . . .
        . . . . a a a a a a a a . . . .
        . . . . . . a a a a . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_2pair = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 8 8 8 8 . . . . . .
        . . . . 8 8 8 8 8 8 8 8 . . . .
        . . . 8 8 8 6 6 6 6 8 8 8 . . .
        . . 8 8 6 6 6 6 6 6 6 6 8 8 . .
        . . 8 8 6 1 1 6 6 1 1 6 8 8 . .
        . 8 8 6 1 6 6 1 6 1 6 1 6 8 8 .
        . 8 8 6 6 6 6 1 6 1 6 1 6 8 8 .
        . 8 8 6 6 6 1 6 6 1 1 6 6 8 8 .
        . 8 8 6 6 1 6 6 6 1 6 6 6 8 8 .
        . . 8 8 1 1 1 1 6 1 6 6 8 8 . .
        . . 8 8 6 6 6 6 6 6 6 6 8 8 . .
        . . . 8 8 8 6 6 6 6 8 8 8 . . .
        . . . . 8 8 8 8 8 8 8 8 . . . .
        . . . . . . 8 8 8 8 . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_3card = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 4 4 4 4 . . . . . .
        . . . . 4 4 4 4 4 4 4 4 . . . .
        . . . 4 4 4 5 5 5 5 4 4 4 . . .
        . . 4 4 5 5 5 5 5 5 5 5 4 4 . .
        . . 4 4 c c c c 5 5 c c 4 4 . .
        . 4 4 5 5 5 c 5 5 c 5 5 c 4 4 .
        . 4 4 5 5 c c 5 5 c 5 5 5 4 4 .
        . 4 4 5 5 5 5 c 5 c 5 5 5 4 4 .
        . 4 4 5 5 5 5 c 5 c 5 5 c 4 4 .
        . . 4 4 c c c 5 5 5 c c 4 4 . .
        . . 4 4 5 5 5 5 5 5 5 5 4 4 . .
        . . . 4 4 4 5 5 5 5 4 4 4 . . .
        . . . . 4 4 4 4 4 4 4 4 . . . .
        . . . . . . 4 4 4 4 . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_4card = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 3 3 3 3 . . . . . .
        . . . . 3 3 3 3 3 3 3 3 . . . .
        . . . 3 3 3 d d d d 3 3 3 . . .
        . . 3 3 d d d d d d d d 3 3 . .
        . . 3 3 d d c d d d c c 3 3 . .
        . 3 3 d d c c d d c d d c 3 3 .
        . 3 3 d c d c d d c d d d 3 3 .
        . 3 3 c d d c d d c d d d 3 3 .
        . 3 3 c c c c c d c d d c 3 3 .
        . . 3 3 d d c d d d c c 3 3 . .
        . . 3 3 d d d d d d d d 3 3 . .
        . . . 3 3 3 d d d d 3 3 3 . . .
        . . . . 3 3 3 3 3 3 3 3 . . . .
        . . . . . . 3 3 3 3 . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_fullHouse = img`
        . . . . . . . . . . . . . . . .
        . . . . . . e e e e . . . . . .
        . . . . e e e e e e e e . . . .
        . . . e e e b b b b e e e . . .
        . . e e b b b b b b b b e e . .
        . . e e 1 1 1 b b 1 b 1 e e . .
        . e e b 1 b b b b 1 b 1 b e e .
        . e e b 1 1 1 b b 1 1 1 b e e .
        . e e b 1 b b b b 1 b 1 b e e .
        . e e b 1 b b b b 1 b 1 b e e .
        . . e e 1 b b b b 1 b 1 e e . .
        . . e e b b b b b b b b e e . .
        . . . e e e b b b b e e e . . .
        . . . . e e e e e e e e . . . .
        . . . . . . e e e e . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_flush = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 5 5 5 5 . . . . . .
        . . . . 5 5 5 5 5 5 5 5 . . . .
        . . . 5 5 5 d d d d 5 5 5 . . .
        . . 5 5 d d d d d d d d 5 5 . .
        . . 5 5 c c c d d c d d 5 5 . .
        . 5 5 d c d d d d c d d d 5 5 .
        . 5 5 d c c c d d c d d d 5 5 .
        . 5 5 d c d d d d c d d d 5 5 .
        . 5 5 d c d d d d c d d d 5 5 .
        . . 5 5 c d d d d c c c 5 5 . .
        . . 5 5 d d d d d d d d 5 5 . .
        . . . 5 5 5 d d d d 5 5 5 . . .
        . . . . 5 5 5 5 5 5 5 5 . . . .
        . . . . . . 5 5 5 5 . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_straight = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 6 6 6 6 . . . . . .
        . . . . 6 6 6 6 6 6 6 6 . . . .
        . . . 6 6 6 7 7 7 7 6 6 6 . . .
        . . 6 6 7 7 7 7 7 7 7 7 6 6 . .
        . . 6 6 7 c c 7 7 c c c 6 6 . .
        . 6 6 7 c 7 7 c 7 7 c 7 7 6 6 .
        . 6 6 7 7 c 7 7 7 7 c 7 7 6 6 .
        . 6 6 7 7 7 c 7 7 7 c 7 7 6 6 .
        . 6 6 7 c 7 7 c 7 7 c 7 7 6 6 .
        . . 6 6 7 c c 7 7 7 c 7 6 6 . .
        . . 6 6 7 7 7 7 7 7 7 7 6 6 . .
        . . . 6 6 6 7 7 7 7 6 6 6 . . .
        . . . . 6 6 6 6 6 6 6 6 . . . .
        . . . . . . 6 6 6 6 . . . . . .
        . . . . . . . . . . . . . . . .
    `
    img_hand_straightFlush = img`
        . . . . . . . . . . . . . . . .
        . . . . . . 2 2 2 2 . . . . . .
        . . . . 2 2 2 2 2 2 2 2 . . . .
        . . . 2 2 2 d d d d 2 2 2 . . .
        . . 2 2 d d d d d d d d 2 2 . .
        . . 2 2 d 2 2 d d 2 2 2 2 2 . .
        . 2 2 d 2 d d 2 d 2 d d d 2 2 .
        . 2 2 d d 2 d d d 2 2 2 d 2 2 .
        . 2 2 d d d 2 d d 2 d d d 2 2 .
        . 2 2 d 2 d d 2 d 2 d d d 2 2 .
        . . 2 2 d 2 2 d d 2 d d 2 2 . .
        . . 2 2 d d d d d d d d 2 2 . .
        . . . 2 2 2 d d d d 2 2 2 . . .
        . . . . 2 2 2 2 2 2 2 2 . . . .
        . . . . . . 2 2 2 2 . . . . . .
        . . . . . . . . . . . . . . . .
    `

    let bkImg: Image = scene.backgroundImage()
    bkImg.drawTransparentImage(img_hand_1pair, 100, 16)
    bkImg.drawTransparentImage(img_hand_2pair, 100, 32)
    bkImg.drawTransparentImage(img_hand_3card, 100, 48)
    bkImg.drawTransparentImage(img_hand_straight, 100, 64)
    
    bkImg.drawTransparentImage(img_hand_flush, 131, 16)
    bkImg.drawTransparentImage(img_hand_fullHouse, 131, 32)
    bkImg.drawTransparentImage(img_hand_4card, 131, 48)
    bkImg.drawTransparentImage(img_hand_straightFlush, 131, 64)
}
function initGirl() {
    girl = sprites.create(img`
    66666666666f...............6f777
    666666666eccfffffffffff6.6f67777
    6666666ee77777777777776ff6777777
    f6666ee77777777777777776e7777777
    cc66c777777777777777777e27777777
    6f6c7777711177777777777227777777
    .ccc7777111777777777777227777777
    .6f77777777777777777777227777777
    ..f77777777777777777776e26777777
    .c66777777777777777776662e667777
    .f7777777777777777777777e2e66666
    .f77777777777777777777776eeeeeef
    .f777ccc777777cccc777777766eeef6
    .f77c6777777777776c77777776666f.
    .6f777777666777777777677777766f.
    ..f677ff6ddd66fff7776777777777f.
    ..6f6fcccd11dccccf667777777777f.
    ...fffffb1111bffbbff6777777777f.
    ...fdf6c1111117c11fdd7777777766.
    ...f1fcc111111cc11f1177777777f..
    ...f1166111111661111177777777f..
    ...f1166111111661111177777777f..
    ...f331111111111113317777777f6..
    ...f331111111e11113317777776f...
    ...6f11111ecc11111116777766f....
    ....fd11111111111111666666f.....
    .....ffd111111111111dc66ff......
    ......6ffffff2ddddd2ffff6.......
    ............7fd11dddf6..........
    ...........6fe1111de2ff6........
    ..........ffeed11de2222ff.......
    .........fe222ee222222222f......
    `)
    girl.setPosition(144, 104)

    girlsDialogue[0] = "Good luck!";
    girlsDialogue[1] = "Awsome!";
    girlsDialogue[2] = "Is that good?";
    girlsDialogue[3] = "Cool!";
    girlsDialogue[4] = "Lovely!";
}
function initCardMap() {
    mx = [[],[]]
    my = [[],[]]

    for(let way = 0; way < 12; way++) {
        mx[way] = []
        my[way] = []
    }
    
    mx[0][0]= 0
    my[0][0]= 0
    mx[0][1]= 1
    my[0][1]= 0
    mx[0][2]= 2
    my[0][2]= 0
    mx[0][3]= 3
    my[0][3]= 0
    mx[0][4]= 4
    my[0][4]= 0

    mx[1][0]= 0
    my[1][0]= 1
    mx[1][1]= 1
    my[1][1]= 1
    mx[1][2]= 2
    my[1][2]= 1
    mx[1][3]= 3
    my[1][3]= 1
    mx[1][4]= 4
    my[1][4]= 1

    mx[2][0]= 0
    my[2][0]= 2
    mx[2][1]= 1
    my[2][1]= 2
    mx[2][2]= 2
    my[2][2]= 2
    mx[2][3]= 3
    my[2][3]= 2
    mx[2][4]= 4
    my[2][4]= 2

    mx[3][0]= 0
    my[3][0]= 3
    mx[3][1]= 1
    my[3][1]= 3
    mx[3][2]= 2
    my[3][2]= 3
    mx[3][3]= 3
    my[3][3]= 3
    mx[3][4]= 4
    my[3][4]= 3

    mx[4][0]= 0
    my[4][0]= 4
    mx[4][1]= 1
    my[4][1]= 4
    mx[4][2]= 2
    my[4][2]= 4
    mx[4][3]= 3
    my[4][3]= 4
    mx[4][4]= 4
    my[4][4]= 4

    mx[5][0]= 0
    my[5][0]= 0
    mx[5][1]= 0
    my[5][1]= 1
    mx[5][2]= 0
    my[5][2]= 2
    mx[5][3]= 0
    my[5][3]= 3
    mx[5][4]= 0
    my[5][4]= 4

    mx[6][0]= 1
    my[6][0]= 0
    mx[6][1]= 1
    my[6][1]= 1
    mx[6][2]= 1
    my[6][2]= 2
    mx[6][3]= 1
    my[6][3]= 3
    mx[6][4]= 1
    my[6][4]= 4

    mx[7][0]= 2
    my[7][0]= 0
    mx[7][1]= 2
    my[7][1]= 1
    mx[7][2]= 2
    my[7][2]= 2
    mx[7][3]= 2
    my[7][3]= 3
    mx[7][4]= 2
    my[7][4]= 4

    mx[8][0]= 3
    my[8][0]= 0
    mx[8][1]= 3
    my[8][1]= 1
    mx[8][2]= 3
    my[8][2]= 2
    mx[8][3]= 3
    my[8][3]= 3
    mx[8][4]= 3
    my[8][4]= 4

    mx[9][0]= 4
    my[9][0]= 0
    mx[9][1]= 4
    my[9][1]= 1
    mx[9][2]= 4
    my[9][2]= 2
    mx[9][3]= 4
    my[9][3]= 3
    mx[9][4]= 4
    my[9][4]= 4

    mx[10][0]= 0
    my[10][0]= 4
    mx[10][1]= 1
    my[10][1]= 3
    mx[10][2]= 2
    my[10][2]= 2
    mx[10][3]= 3
    my[10][3]= 1
    mx[10][4]= 4
    my[10][4]= 0

    mx[11][0]= 0
    my[11][0]= 0
    mx[11][1]= 1
    my[11][1]= 1
    mx[11][2]= 2
    my[11][2]= 2
    mx[11][3]= 3
    my[11][3]= 3
    mx[11][4]= 4
    my[11][4]= 4
}
function initWayName() {
    wayName = ["R1:", "R2:", "R3:", "R4:", "R5:", "C1:", "C2:", "C3:", "C4:", "C5:", "/:", "\\:"]
}
function initVariables () {
    putPosX = []
    putPosY = []
    putCardNoList = []

    putCardMap = [[],[]]
    for(let i = 0; i < 5; i++) {
        putCardMap[i] = []
        for(let j = 0; j < 5; j++) {
            putCardMap[i][j] = null
        }
    }
    status = 0
}

let status = 0;
let putPosY: number[] = []
let putPosX: number[] = []
let img_CbK: Image = null
let img_DiK: Image = null
let img_HtK: Image = null
let img_SpK: Image = null
let img_CbQ: Image = null
let img_DiQ: Image = null
let img_HtQ: Image = null
let img_SpQ: Image = null
let img_CbJ: Image = null
let img_DiJ: Image = null
let img_HtJ: Image = null
let img_SpJ: Image = null
let img_Cb10: Image = null
let img_Di10: Image = null
let img_Ht10: Image = null
let img_Sp10: Image = null
let img_Cb9: Image = null
let img_Di9: Image = null
let img_Ht9: Image = null
let img_Sp9: Image = null
let img_Cb8: Image = null
let img_Di8: Image = null
let img_Ht8: Image = null
let img_Sp8: Image = null
let img_Cb7: Image = null
let img_Di7: Image = null
let img_Ht7: Image = null
let img_Sp7: Image = null
let img_Cb6: Image = null
let img_Di6: Image = null
let img_Ht6: Image = null
let img_Sp6: Image = null
let img_Cb5: Image = null
let img_Di5: Image = null
let img_Ht5: Image = null
let img_Sp5: Image = null
let img_Cb4: Image = null
let img_Di4: Image = null
let img_Ht4: Image = null
let img_Sp4: Image = null
let img_Cb3: Image = null
let img_Di3: Image = null
let img_Ht3: Image = null
let img_Sp3: Image = null
let imb_Cb2: Image = null
let img_Di2: Image = null
let img_Ht2: Image = null
let imb_Sp2: Image = null
let img_CbA: Image = null
let img_DiA: Image = null
let img_HtA: Image = null
let img_SpA: Image = null
let img_n0: Image = null
let img_n1: Image = null
let img_n2: Image = null
let img_n3: Image = null
let img_n4: Image = null
let img_n5: Image = null
let img_n6: Image = null
let img_n7: Image = null
let img_n8: Image = null
let img_n9: Image = null

let img_hand_1pair: Image = null
let img_hand_2pair: Image = null
let img_hand_3card: Image = null
let img_hand_4card: Image = null
let img_hand_fullHouse: Image = null
let img_hand_flush: Image = null
let img_hand_straight: Image = null
let img_hand_straightFlush: Image = null
let imageList: Image[] = null
let imgNumList: Image[] = null

let img_handmark_1pair: Image = null
let img_handmark_2pair: Image = null
let img_handmark_3card: Image = null
let img_handmark_4card: Image = null
let img_handmark_fullHouse: Image = null
let img_handmark_flush: Image = null
let img_handmark_straight: Image = null
let img_handmark_straightFlush: Image = null

let img_empty: Image = (img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `)

let img_throwCard: Image = (img`
        . . . . . . . . . . . . . . . 
        . . 8 8 8 8 8 8 8 8 8 8 8 . . 
        . 8 8 1 1 1 1 1 1 1 1 1 8 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 1 8 8 8 8 8 8 8 8 8 1 8 . 
        . 8 8 1 1 1 1 1 1 1 1 1 8 8 . 
        . . 8 8 8 8 8 8 8 8 8 8 8 . . 
        . . . . . . . . . . . . . . . 
        `)

let currentCardNo = 0
let currentCard: Sprite = null
let putCardNoList: number[] = null
let putCardMap: number[][] = null
let mx: number[][] = null
let my: number[][] = null
let posY = 0
let posX = 0
let throwCard: Sprite = null

let onePair_num_fp: Sprite = null
let onePair_num_tp: Sprite = null
let twoPair_num_fp: Sprite = null
let twoPair_num_tp: Sprite = null
let threeCard_num_fp: Sprite = null
let threeCard_num_tp: Sprite = null
let fourCard_num_fp: Sprite = null
let fourCard_num_tp: Sprite = null
let fullHouse_num_fp: Sprite = null
let fullHouse_num_tp: Sprite = null
let flush_num_fp: Sprite = null
let flush_num_tp: Sprite = null
let straight_num_fp: Sprite = null
let straight_num_tp: Sprite = null
let sf_num_fp: Sprite = null
let sf_num_tp: Sprite = null


let girl: Sprite = null
let girlsDialogue: string[] = [];

let cursor: Sprite = null
let rows: number[] = null
let columns: number[] = null
let parentCard: Sprite = null

let counter_1pair: number = 0
let counter_2pair: number = 0
let counter_3card: number = 0
let counter_4card: number = 0
let counter_fullHouse: number = 0
let counter_flush: number = 0
let counter_straight: number = 0
let counter_sf: number = 0
let wayName: string[] = null
let currentHandsList: string[] = null

let volume: number = 148
scene.setBackgroundImage(img`
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777777777777777777777777777777777ffffff7777777777777777777777777777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777ffffffffff77777777777777777777ffffff7777777777777777777777777777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777ffffffffffff77777777777777777777ffff7777777777777777777777777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777777777ffff77fffff7777777777777777777fff77777777777777777777777777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777777777fff7777ffff777777777777777777ffff77777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777ffff7777ffff777777fffff7777777ffff77ffffff77777fffff777ffffff77ffff77777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777ffff7777ffff7777fffffffff77777ffff77ffffff777ffffffff777fffff7fffff77777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777ffff7777ffff777ffff777fff77777fff7777fff7777ffff77ffff777fffff77fff77777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777ffff777ffff777ffff7777ffff7777fff777ff77777ffff777ffff777ffff777fff77777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777ffff777fffff777ffff7777ffff777ffff77ff777777fff7777fff7777ffff77777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777fffffffffff777ffff77777ffff777ffff7ff777777ffff77fffff777fffff77777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777ffffffff777777ffff77777ffff777ffffffff77777fffffffff77777ffff777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777ffff7777777777ffff77777fff7777ffffffff77777fffffff7777777ffff777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777fff77777777777ffff7777ffff777ffff77ffff7777ffff7777777777ffff777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777777ffff77777777777ffff7777fff7777ffff77ffff7777ffff7777777777fff7777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777777ffff77777777777ffff777ffff7777ffff777ffff777ffff77777f777ffff7777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777ffffffff7777777777fffffffff77777fff7777fffff777fffffffff777ffff7777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777fffffffff77777777777ffffff7777777fff77777fffff7777fffff77777ffff7777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777777777777777777777ffffff77777ffff7777777777777777777777777777777ffff77777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777ffffff7777777777777777777ffffff77777ffff7777777777777777777777777777777ffff77777777777777777777777777777777777777777777777777777
    777777777777777777777777777777ffffffffff7777777777777777777ffff77777fff77777777ff7777777777777777777777fff777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777ffff777ffff7777777777777777777fff7777777777777777fff7777777777777777777777777777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777fff77777fff777777777777777777ffff777777777777777fff77777777777777777777777777777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777fff77777ff7777777fffff7777777ffff777ffffff7777ffffffff777777fffff7ff777ffffff777ffffff77ffff777777fffff7777777777777777777777777777
    77777777777777777777777777777ffff77777777777fffffffff77777ffff7777fffff7777ffffffff7777ffffffffff7777fffff7777fffff7fffff7777ffffffff777777777777777777777777777
    77777777777777777777777777777fffff777777777ffff777fff77777fff777777ffff77777ffff777777ffff777ffff77777ffff77777fffff77fff777ffff77ffff77777777777777777777777777
    777777777777777777777777777777ffffff777777ffff7777ffff7777fff777777ffff77777ffff777777fff7777ffff77777ffff77777ffff777fff77ffff777ffff77777777777777777777777777
    7777777777777777777777777777777ffffff77777ffff7777ffff777ffff777777fff777777fff777777ffff7777ffff77777fff777777ffff77777777fff7777fff777777777777777777777777777
    77777777777777777777777777777777ffffff777ffff77777ffff777ffff77777ffff77777ffff777777fff77777fff77777ffff77777fffff7777777ffff77fffff777777777777777777777777777
    7777777777777777777777777777777777fffff77ffff77777ffff777ffff77777ffff77777ffff77777ffff7777ffff77777ffff77777ffff77777777fffffffff77777777777777777777777777777
    77777777777777777777777777777777777ffff77ffff77777fff7777fff777777ffff77777ffff77777ffff7777ffff77777ffff77777ffff77777777fffffff7777777777777777777777777777777
    777777777777777777777777777fff77777ffff77ffff7777ffff777ffff777777ffff77777ffff77777ffff7777ffff77777ffff77777ffff77777777ffff7777777777777777777777777777777777
    77777777777777777777777777ffff77777ffff77ffff7777fff7777ffff777777fff777777fff777777ffff777fffff77777fff777777fff777777777ffff7777777777777777777777777777777777
    77777777777777777777777777ffff77777fff777ffff777ffff7777ffff777777fff777777fff777777ffff77ffffff77777fff77777ffff777777777ffff77777f7777777777777777777777777777
    777777777777777777777777777ffffffffff77777fffffffff77777fffffff777ffffff777fffffff777ffffff7ffffff777ffffff77ffff7777777777fffffffff7777777777777777777777777777
    77777777777777777777777777777fffffff7777777ffffff77777777ffff777777ffff77777ffff777777ffff777ffff77777ffff777ffff777777777777fffff777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    77777777777777777777777777777777777777777777777777777777777777777777777ddddddddddddddddddddddd777777777777777777777777777777777777777777777777777777777777777777
    777777777777777777777777777777777777777ddd7777777777777777777777777777d1dd11111111111111111111d777777777777777777777777777ddd77777777777777777777777777777777777
    7777777777777777777777777777777777777dd11d7777777777777777777777777777d1be11111111111111111111d77777777777777777777777777711ddd777777777777777777777777777777777
    77777777777777777777777777777777777bd11111d777777777777777777777777777d1bbd1111111111111111111d77777777777777777777777777d1dbdddb7777777777777777777777777777777
    7777777777777777777777777777777777d1111111d777777777777777777777777777ddddd1111111111111111111d7777777777777777777777777dd1bb1111d777777777777777777777777777777
    77777777777777777777777777777777dd111111111d77777777777777777777777777dbee31111111111111111111d7777777777777777777777777dbddd11111dd7777777777777777777777777777
    777777777777777777777777777777dd11111111111db7777777777777777777777777d1eb1ddddddddddddddd1111d777777777777777777777777d1b2bd1111111dd77777777777777777777777777
    7777777777777777777777777777dd11111111111111d7777777777777777777777777d1111ebde1111111111d1111d777777777777777777777777d1de3d111111111dd777777777777777777777777
    77777777777777777777777777dd11111111111d11111d777777777777777777777777d111dee2ed1111111111d111d77777777777777777777777d11111d11111111111dd7777777777777777777777
    7777777777777777777777777d11111111111ddddd111d777777777777777777777777d111dd2eb11111111111d111d77777777777777777777777d1111bbdd11111111111d777777777777777777777
    77777777777777777777777d11111111111dd1111d1111d77777777777777777777777d111d1db1111111d1d11d111d7777777777777777777777d1111d2edbdd11111111111d7777777777777777777
    777777777777777777777ddd111111111ddd111111d111d77777777777777777777777d111d11111111deeee4ed111d77777777777777777777771111d1b22e11dd1111111111dd77777777777777777
    77777777777777777777d1db11111111dd11111111dd111d7777777777777777777777d111d111111dbecb444bb111d777777777777777777777d1111d1deedd11dd11111111111d7777777777777777
    77777777777777777777d11bd11111dd111111111dbb111d7777777777777777777777d111d11111cbeeebe444d111d77777777777777777777d1111d111d11bd111dd111111111d7777777777777777
    77777777777777777777b11bdd11ddb1111111d1d22bd111d777777777777777777777d111d1111cb4444bce4dd111d77777777777777777777d111dd111111b4dbd11dd111111d77777777777777777
    777777777777777777777dddbe1ddd2d1111dbbeeeeeb111db77777777777777777777d111d111db4444d4be4dd111d7777777777777777777d1111d1111111e45ecd111d11111d77777777777777777
    7777777777777777777777de2e1b2e2b111dbee2e2eebd111d77777777777777777777d111d111be444444bcedd111d7777777777777777777d1111d11111dde4dd44bd1d1111d777777777777777777
    7777777777777777777777d1d11db2ed11db2ee22eeecb1111d7777777777777777777d111d111beee444eebf4d111d777777777777777777d1111dbb11dbeee4444bd11d1111d777777777777777777
    77777777777777777777777d111dd1dddb2ee24e2eeeecd111d7777777777777777777d111d111beece3bcecbeb111d777777777777777777d111dbbd1b4444e4eee1111d111d7777777777777777777
    77777777777777777777777d1111d111dee2e24eeeee4eb111db777777777777777777d111d111bebbbddbeeccb111d77777777777777777bd111dcd1de444444eee111d1111d7777777777777777777
    777777777777777777777777d111dd111be2e2eebeee44ebdddb777777777777777777d111bdddcebdd11ddefbb111d77777777777777777dddddbd11ee44d4444e4d1dd111d77777777777777777777
    777777777777777777777777d1111d111db2eee44beee4ebbdddb77777777777777777ddddb4dbfeedddddbeefbdddb7777777777777777bddddbb11deeee44d44eed1d111db77777777777777777777
    7777777777777777777777777d111dd111deeee4ddddbe4ebdddb77777777777777777bdddb4dbfeeebddeeeefcdddb7777777777777777ddddbcd1ddebbe4e444eedd1111d777777777777777777777
    7777777777777777777777777d1111d111deeebbd1dd4eebbbdddb7777777777777777bdddbdbdcfeefee4feefcdddb777777777777777bddddbbdddbeddddbe44eebd111d7777777777777777777777
    77777777777777777777777777d1111d1d1beedddbdbeeebbbdddb7777777777777777bdddbbbbbcefee5eeeefcdddb77777777777777bddddbcbdbbeedddddceeeeb1111d7777777777777777777777
    7777777777777777777777777771111dd4d1debddbd4eeeeeebdddb777777777777777bdddbeebdbefe4eebe4fcdddb77777777777777bdddbbbddbeeebddddbeeeed111d77777777777777777777777
    777777777777777777777777777d1111b441dbeeeefeeeeeeebddddb77777777777777bdddbdbdbb4eec7eeeeecdddb7777777777777bddddbbbbdbbefedddddeeeb1111d77777777777777777777777
    7777777777777777777777777777d111db4dddeeeeeeee77eeebdddb77777777777777bdddbddbebee4cbbefeecdddb7777777777777ddddb44eebbbbcfe4eeeeeed111d777777777777777777777777
    7777777777777777777777777777d1111debddeeeeeeeebcceebddbdb7777777777777bdddbddbeeb4e7c7eebfcdddb777777777777bddddb4dbfdddbcc4eee4eebd111d777777777777777777777777
    77777777777777777777777777777d11ddb4dddbceeee7b7ceebde2eb7777777777777bdddbd4eeee4ebb42ebcbdddb777777777777dddddbeebb1dbeeeeeeeeecbd11d7777777777777777777777777
    77777777777777777777777777777bddddbd4bddeee7ebbcbeebdeebbb777777777777bdddde4e2e77d422eedbddddb77777777777bdddddbefdddb4eeeeebbbdbddddb7777777777777777777777777
    777777777777777777777777777777ddddbebbbbee7bcbeddbbddbbbdb777777777777bddddbbbbbbbbbbbbbdbdeedb77777777777dddddddbbdd7ee744ecdbbbbdddb77777777777777777777777777
    7777777777777777777777777777777ddddbddbbeeebbeebbdddddbbddb77777777777bdddddddddddddddddddbeeeb7777777777bdddddddddbbce4443bddeebdddb777777777777777777777777777
    7777777777777777777777777777777bdddbbbeceebbbebddddddddebbb77777777777bddddddddddddddddddddbbbb7777777777bbdddddddddbbb3343ddeebddddb777777777777777777777777777
    77777777777777777777777777777777ddddbbeee24bbbdddddddddbb6777777777777bddddddddddddddddddddbbdb777777777776bddddddddddbbb21dbfcbdddb7777777777777777777777777777
    77777777777777777777777777777777bddddceeeebbddddddddddb677777777777777bddddddddddddddddddddebdb77777777777776bddddddddddbbdbffcbdddb7777777777777777777777777777
    777777777777777777777777777777777ddddbbebbddddddddddbb7777777777777777bddddddddddddddddddddbbdb777777777777777bbddddddddddbcfcbdddb77777777777777777777777777777
    777777777777777777777777777777777bdddddbddddddddddbb6777777777777777777bbbbbbbbbbbbbbbbbbbbbbb777777777777777776bbddddddddddbdddddb77777777777777777777777777777
    7777777777777777777777777777777777bdddddddddddddbb6777777777777777777777777777777777777777777777777777777777777776bbddddddddbbebdb777777777777777777777777777777
    7777777777777777777777777777777777bdddddddddddbb67777777777777777777777777777777777777777777777777777777777777777776bbddddddbb2bbb777777777777777777777777777777
    77777777777777777777777777777777777bdddddddddb677777777777777777777777777777777777777777777777777777777777777777777776bdddddbbbbb7777777777777777777777777777777
    777777777777777777777777777777777777dddddddbb77777777777777777777777777777777777777777777777777777777777777777777777777bbdddbbbb77777777777777777777777777777777
    777777777777777777777777777777777777bddddbb677777777777777777777777777777777777777777777777777777777777777777777777777776bbbbbbb77777777777777777777777777777777
    7777777777777777777777777777777777777ddbb6777777777777777777777777777777777777777777777777777777777777777777777777777777776bbbb777777777777777777777777777777777
    7777777777777777777777777777777777777bb67777777777777777777777777777777777777777777777777777777777777777777777777777777777776bb777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
`)
music.setVolume(volume)
for (let index = 0; index < 2; index++) {
    music.playMelody("B A G A G F A C5 ", 480)
}
scene.setBackgroundImage(img`
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    777777777777777716666666666666661666666666666666166666666666666616666666666666661666666666666666777777777777777777777777777777777777777777777777777777777777777.
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166166166166166616616616616616661661661661661666166166166166166616616616616616667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777166666666666666616666666666666661666666666666666166666666666666616666666666666667777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
    7777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777
`)
//tiles.setTilemap(tilemap`level`)
parentCard = sprites.create(img`
    .................
    ..88888888888....
    .8811111111188...
    .81888888888188..
    .818811111111188.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .818188888888818.
    .881188888888818.
    ..88188888888818.
    ...8811111111188.
    ....88888888888..
    .................
    `, SpriteKind.card)
parentCard.setPosition(32, 110)
let dummyCurrentCard = sprites.create(img`
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    `, SpriteKind.dummy)
dummyCurrentCard.setPosition(75, 110)
info.setScore(0)
initVariables()
initHandCounter()
initFields()
initCardMap()
initCardImage()
initNumImage()
initHandImage()
initHandMarkImage()
initWayName()
initCursor()
initGirl()
game.showLongText("Move the cursor. \nA: put a card.\nB: show hand info.", DialogLayout.Bottom)
status = 2 //before drawing card status.
drawCard()
