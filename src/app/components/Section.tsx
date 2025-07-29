import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { JSX, useRef } from "react";

export default function Section({ children, isVisible, selected, selection, id }: { children: JSX.Element | JSX.Element[]; isVisible: string | null; selected: string | null; selection: (id: string | null) => void; id?: string }) {

    const sectionRef = useRef(null);

    useGSAP(() => {
        if((isVisible === id) && (selected === id)) {
            gsap.from('.fade', {
                duration: 0.5,
                opacity: 0,
                ease: "power3.out",
                delay: 0.5
            });
            console.log("Section is visible:", isVisible);
        }
        else if((isVisible !== id) && (selected === id)) {
            gsap.to('.fade', {
                duration: 0.3,
                opacity: 0,
                ease: "power3.in",
                onComplete: () => {
                    selection(isVisible);
                }
            });
        }
    }, [isVisible, selected]);

    return (
        <>
            {selected === id ? (
                <section className="section flex flex-col w-full min-h-[calc(100vh-4rem)] shrink-0 p-5" ref={sectionRef}> 
                    {children}
                </section>
            ) : null}
        </>
    );
}