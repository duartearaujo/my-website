import Link from "next/link";
import { JSX } from "react";

export default function ProjectCard({ link, children }: { link: string; children?: JSX.Element | JSX.Element[] }) {
    return (
        <Link href={link} target="_blank">
            <div className="project-card group relative flex flex-row rounded-lg font-sans font-semibold bg-violet-950/60 backdrop-blur-md w-full h-full p-5 gap-5 fade">
                {children}
            </div>
        </Link>
    );
}