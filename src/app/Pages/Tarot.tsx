"use client"

import { useEffect, useState } from "react";

import { usePathname, useSearchParams } from "next/navigation";

import DropDown, { TDropDownOption } from "../Components/DropDown";
import Button from "../Components/Button";

type TTarotDraw = {
    spread: TTarotSpread
    , deck: Array<number>
    , draw: boolean
    , picked: number
}

const TarotSpreadCnt = {
    "Single": 1
    , "Past-Present-Future": 3
    , "Four-Elements": [2, 2]
    , "Chakras": 7
    , "Relationship": [3, 3]
    , "Twelve-House": [7, 7]
    , "Free": -1
};

const TarotSpreadPosName = {
    "Single": [""]
    , "Past-Present-Future": [
        "Past", "Present", "Future"
    ]
    , "Four-Elements": [
        "Fire", "Water"
        , "Wind", "Earth"
    ]
    , "Chakras": [
        "Sahasrara", "Ajna", "Vishuddha"
        , "Anahata"
        , "Manipura", "Svadhishthana", "Muladhara"
    ]
    , "Relationship": [
        "A-Past", "Rel-Past", "B-Past"
        , "A-Present", "Rel-Present", "B-Present"
        , "A-Future", "Rel-Future", "B-Future"
    ]
    , "Twelve-House": [
        "1 hse", "2 hse", "3 hse"
        , "4 hse", "5 hse", "6 hse"
        , "7 hse", "8 hse", "9 hse"
        , "10 hse", "11 hse", "12 hse"
    ]
    , "Free": []
}

const CardName = {
    Rider: []
    , Thoth: [
        'The Fool', 'The Magus', 'The Magus', 'The Magus'
        , 'The Priestess', 'The Empress', 'The Emperor', 'The Hierophant'
        , 'The Lovers', 'The Chariot', 'Adjustment', 'The Hermit', 'Fortune'

        , 'Lusts', 'The Hanged Man', 'Death', 'Arts', 'The Devil'
        , 'The Tower', 'The Star', 'The Moon', 'The Sun', 'The Aeon', 'The Universe'

        , 'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands'
        , 'Six of Wands', 'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands'
        , 'Princess of Wands', 'Prince of Wands', 'Queen of Wands', 'Knight of Wands'

        , 'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 'Five of Cups'
        , 'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups'
        , 'Princess of Cups', 'Prince of Cups', 'Queen of Cups', 'Knight of Cups'

        , 'Ace of Swords', 'Two of Swords', 'Three of Swords', 'Four of Swords', 'Five of Swords'
        , 'Six of Swords', 'Seven of Swords', 'Eight of Swords', 'Nine of Swords', 'Ten of Swords'
        , 'Princess of Swords', 'Prince of Swords', 'Queen of Swords', 'Knight of Swords'

        , 'Ace of Disks', 'Two of Disks', 'Three of Disks', 'Four of Disks', 'Five of Disks'
        , 'Six of Disks', 'Seven of Disks', 'Eight of Disks', 'Nine of Disks', 'Ten of Disks'
        , 'Princess of Disks', 'Prince of Disks', 'Queen of Disks', 'Knight of Disks'
    ]
};

const fnShare = (url: string, baseUrl: string = "") => {
    const encodedUrl = encodeURIComponent(url);
    const shareUrl = baseUrl === "" ? url : `${baseUrl}${encodedUrl}`;
    window.open(shareUrl, '_blank');
}

const fnGetShareTypes = (url: string): Array<TDropDownOption> => [
    { display: "Whatsapp", fnAction: () => fnShare(url, "https://api.whatsapp.com/send?text=") }
    , { display: "Telegram", fnAction: () => fnShare(url, "https://t.me/share/url?url=") }
    , { display: "Teams", fnAction: () => fnShare(url, "https://teams.microsoft.com/l/chat/0/0?message=") }
    , { display: "Skype", fnAction: () => fnShare(url, "https://web.skype.com/share?url=") }
    , { display: "URL", fnAction: () => fnShare(url) }
    , { display: "Clipboard", fnAction: async () => { await navigator.clipboard.writeText(url); } }
]

const TarotSpread = [...Object.keys(TarotSpreadPosName)] as const;
type TTarotSpread = typeof TarotSpread[number];

const fnShuffleRiffle = (oDeck: Array<number>): Array<number> => {
    const dkLenDec = Math.floor(oDeck.length / 10);
    const lLen = Math.floor(oDeck.length / 2) + (Math.floor(Math.random() * dkLenDec) - dkLenDec);
    const rLen = oDeck.length - lLen;
    let lPos = 0;
    let rPos = 0;
    let lr = '';

    let nDeck = new Array(oDeck.length);

    for (let i = 0; i < oDeck.length; i++) {
        lr = '';

        if (Math.floor(Math.random() * 2) == 1) {
            lr = (lPos < lLen ? 'l' : 'r');
        }
        else {
            lr = (rPos < rLen ? 'r' : 'l');
        }

        switch (lr) {
            case 'l':
                nDeck[i] = oDeck[lPos];
                lPos = lPos + 1;
                break;

            case 'r':
                nDeck[i] = oDeck[lLen + rPos];
                rPos = rPos + 1;
                break;
        }
    }

    return nDeck;
}

const fnShuffleOverhand = (oDeck: Array<number>): Array<number> => {
    var cutAt = Math.floor(Math.random() * oDeck.length);

    return oDeck.slice(cutAt).concat(oDeck.slice(0, cutAt));
}

const fnShuffle = (oDeck: Array<number>, riffle: number = 10, overhand: number = 5, overall: number = 10): Array<number> => {
    let nDeck = [...oDeck];

    for (let i = 0; i < overall; i++) {
        for (let j = 0; j < riffle; j++) {
            nDeck = [...fnShuffleRiffle(nDeck)];
        }

        for (let k = 0; k < overhand; k++) {
            nDeck = [...fnShuffleOverhand(nDeck)];
        }
    }

    return nDeck
}

const fnSpreadCardName = (tarotDraw: TTarotDraw, idx: number): string => (
    tarotDraw.spread === "Free"
        ? [...new Array(tarotDraw.picked).keys().map((v: number) => (v + 1).toString())][idx]
        : TarotSpreadPosName[tarotDraw.spread as keyof typeof TarotSpreadPosName][idx]
);

const fnImgUrl = (cardIdx?: number): string => (
    `\\img\\thoth\\${cardIdx === undefined ? "back" : `0${cardIdx}`.slice(-2)}.png`
)

const TarotRow: React.FC<{
    tarotDraw: TTarotDraw
    , rowId: number
    , cnt: number
    , fnSetView: (cardIdx: number) => void
}> = ({ tarotDraw, rowId, cnt, fnSetView }) => {
    const fnTwelveHseIdx = (x: number, y: number): number => (
        (y < 3 ? 6 - y : y) === (x > 3 ? 9 - x : x + 3)
            ? (y < 3 ? 12 - x : x)
            : -1
    )

    return <div key={`TarotRow_${rowId}`} className="flex flex-row flex-1 gap-1">
        {cnt > 0 && new Array(cnt).fill(cnt).map((vx: number, x: number) => {
            const cardIdx = tarotDraw.spread === "Twelve-House"
                ? fnTwelveHseIdx(x, rowId)
                : x + (rowId * vx);

            const cardName: string = fnSpreadCardName(tarotDraw, cardIdx);

            return <div key={`${rowId}-${x}`} className="relative flex flex-1">
                {(cardIdx === -1
                    ? <div>&nbsp;</div>
                    : [
                        <img key={`img_${cardIdx}`} onClick={() => { if (tarotDraw.draw) { fnSetView(cardIdx) } }} src={fnImgUrl(tarotDraw.draw ? tarotDraw.deck[cardIdx] : undefined)}
                            className={`absolute inset-0 m-auto max-w-full max-h-full object-cover ${tarotDraw.draw ? "cursor-zoom-in" : ""}`}
                        />
                        , <div key={`name_${cardIdx}`}
                            className={`absolute ${cardName.length === 0 ? "hidden" : ""} bottom-0 right-0 p-1 pr-2 bg-black bg-opacity-30`}
                        >
                            {cardName}
                        </div>
                    ]
                )}
            </div>
        })}
    </div>
}

const Tarot = () => {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const fnInitDeck = (nDeckType: string) => (
        [...[...new Array(CardName[nDeckType as keyof typeof CardName].length).keys()].map((v => (v + 1)))]
    );

    const [view, setView] = useState<number | undefined>(undefined);
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [tarotDrawArr, setTarotDrawArr] = useState<Array<TTarotDraw>>([{
        spread: "Relationship"
        , deck: [...fnShuffle(fnInitDeck("Thoth"))]
        , draw: false
        , picked: 0
    }]);

    const [tarotDrawIdx, setTarotDrawIdx] = useState<number>(0);

    const fnLastUpdTarotDraw = (nTarotDraw: TTarotDraw, newLog: boolean) => {
        const nArrIdx: number = tarotDrawArr.length;

        setTarotDrawArr(p => ([
            ...p.slice(0, p.length - 1)
            , ...(newLog ? [p[p.length - 1]] : [])
            , {
                ...nTarotDraw
                , ...(newLog || !p[p.length - 1].draw ? { deck: [...fnShuffle(nTarotDraw.deck)] } : {})
            }
        ]));

        if (newLog) {
            setTarotDrawIdx(nArrIdx);
        }
    }

    const spreadCardCnt: number | Array<number> = (
        tarotDrawArr[tarotDrawIdx].spread === "Free"
            ? tarotDrawArr[tarotDrawIdx].picked
            : TarotSpreadCnt[tarotDrawArr[tarotDrawIdx].spread as keyof typeof TarotSpreadCnt]
    );

    const fnDraw = () => {
        fnLastUpdTarotDraw(
            {
                ...tarotDrawArr[tarotDrawIdx]
                , draw: true
                , ...(
                    tarotDrawArr[tarotDrawArr.length - 1].spread === "Free"
                        ? { picked: tarotDrawArr[tarotDrawArr.length - 1].picked + 1 }
                        : {}
                )
            }
            , tarotDrawArr[tarotDrawArr.length - 1].spread === "Free"
                ? false
                : tarotDrawArr[tarotDrawArr.length - 1].draw
        );

    }

    const fnReset = () => {
        fnLastUpdTarotDraw(
            {
                ...tarotDrawArr[tarotDrawArr.length - 1]
                , draw: false
                , picked: 0
            }
            , tarotDrawArr[tarotDrawArr.length - 1].draw
        );
    }

    const shareUrl: string = `${baseUrl}${pathName}`
        + `?s=${tarotDrawArr[tarotDrawIdx].spread}`
        + `&d=${tarotDrawArr[tarotDrawIdx].deck
            .slice(0, typeof spreadCardCnt === "number"
                ? spreadCardCnt
                : spreadCardCnt.reduce((a: number, b: number) => (a + b), 0)
            ).join(",")}`
        + `&p=${tarotDrawArr[tarotDrawIdx].picked}`;

    const fnSpread = (nSpread: string) => {
        const nIdx: number = tarotDrawArr.length - 1 + (
            tarotDrawArr[tarotDrawArr.length - 1].draw ? 1 : 0
        )

        fnLastUpdTarotDraw(
            {
                ...tarotDrawArr[tarotDrawArr.length - 1]
                , spread: nSpread as TTarotSpread
                , draw: false
                , picked: 0
            }
            , tarotDrawArr[tarotDrawArr.length - 1].draw
        );

        setTarotDrawIdx(nIdx)
    }

    useEffect(() => {
        const pSpread = searchParams.get("s") ?? "";
        const pDeck = searchParams.get("d")?.split(",")?.map((v: string) => (parseInt(v))) ?? [];
        const pPicked = parseInt(searchParams.get("p") ?? "0");

        if (pSpread.length > 0 && pDeck.length > 0) {
            setTarotDrawArr([{ spread: pSpread, deck: [...pDeck], draw: true, picked: pPicked }])
        }

        setBaseUrl(window.location.origin);
    }, []);

    return <div className="w-screen h-screen bg-gray-950 p-5">
        <div className="w-full h-full relative bg-white bg-opacity-10 p-2 border-2 rounded-xl">
            <div className={`absolute inset-2 bg-black z-20 bg-opacity-80 flex flex-row flex-1 gap-1 ${view === undefined ? "hidden" : ""}`} onClick={() => setView(undefined)}>
                <div className="relative flex flex-1 m-5">
                    <img src={fnImgUrl(view !== undefined ? tarotDrawArr[tarotDrawIdx].deck[view] : undefined)}
                        className="absolute w-full h-full max-w-full max-h-full object-contain cursor-zoom-out"
                    />
                </div>
            </div>

            <div className="absolute left-2 flex flex-row z-10 gap-1 p-1 rounded-lg bg-black bg-opacity-30">
                <DropDown options={[...TarotSpread]} fnOnSelect={fnSpread}>{tarotDrawArr[tarotDrawIdx].spread}</DropDown>
                <Button fnOnClick={fnDraw}>Draw</Button>
                <Button fnOnClick={fnReset} classNames={[...(tarotDrawArr[tarotDrawIdx].spread !== "Free" ? ["hidden"] : [])]}>Reset</Button>
                <DropDown options={fnGetShareTypes(shareUrl)} disabled={!tarotDrawArr[tarotDrawIdx].draw}>Share</DropDown>
            </div>

            <div className="absolute right-2 flex flex-row z-10 gap-1 p-1 rounded-lg bg-black bg-opacity-30">
                <Button fnOnClick={() => setTarotDrawIdx(p => (p > 0 ? p - 1 : p))} disabled={tarotDrawIdx <= 0}>Previous</Button>
                <Button fnOnClick={() => setTarotDrawIdx(p => (p < (tarotDrawArr.length - 1) ? p + 1 : p))} disabled={(tarotDrawIdx >= (tarotDrawArr.length - 1)) || !tarotDrawArr[tarotDrawIdx + 1].draw}>Next</Button>
            </div>

            <div className={`w-full h-full flex flex-col flex-1 gap-1 p-2 text-white`}>
                {Array.isArray(spreadCardCnt) && !spreadCardCnt.some(isNaN)
                    ? new Array(spreadCardCnt[0]).fill(spreadCardCnt[0]).map((vy: number, y: number) => (
                        <TarotRow key={y} tarotDraw={tarotDrawArr[tarotDrawIdx]} rowId={y} cnt={spreadCardCnt[1]} fnSetView={setView} />
                    ))
                    : <TarotRow tarotDraw={tarotDrawArr[tarotDrawIdx]} rowId={0} cnt={spreadCardCnt as number} fnSetView={setView} />
                }
            </div>
        </div>
    </div>
};

export default Tarot;