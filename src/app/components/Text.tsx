"use client";

import { JSX, useRef } from "react";

export default function Text({ children }: { children: JSX.Element | JSX.Element[] }) {
    const ref = useRef(null);

    return (
        <div ref={ref} className={`textcard group relative m-auto flex-col space-y-5 rounded-lg font-sans font-semibold bg-violet-950/60 backdrop-blur-md w-[90vw] max-w-lg p-5 fade`}>
            {children}
        </div>
    );
}