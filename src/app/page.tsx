"use client"

import { Suspense } from "react";

import Tarot from "./Pages/Tarot";

const Page = () => {
    return <Suspense>
        <Tarot />
    </Suspense>
}

export default Page;