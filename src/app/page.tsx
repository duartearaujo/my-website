"use client";

import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";

import Profile from "./components/Profile";
import Text from "./components/Text";
import Scene from "./components/Scene";
import LinkCard from "./components/LinkCard";
import Section from "./components/Section";
import { useEffect, useState } from "react";
import ProjectCard from "./components/ProjectCard";
import ContactForm from "./components/ContactForm";
import Header from "./components/Header";
import Loading from "./components/Loading";

export default function Home() {

	const [selected, setSelected] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState<string | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		console.log("Selected:", selected);
	}, [selected]);

	return (
		<>	
			<Loading isLoaded={isLoaded} />
			<Scene setIsLoaded={setIsLoaded} isLoaded={isLoaded} setIsVisible={setIsVisible} selection={setSelected} selected={selected} /> 
			{selected !== null ? <Header fun={setIsVisible} /> : null}
			<Section id={'About Me'} selection={setSelected} selected={selected} isVisible={isVisible} >
				<Text>
					<Profile image="/foto1.jpg" />
					<h1 className="text-4xl">Duarte Araújo</h1>
					<hr className="w-5/6 border-1 border-white" />
					<p>
						My name is Duarte Araújo, and I'm a recent Software Engineering graduate from Braga, Portugal, currently pursuing a Master's degree in the field at University of Minho.
						<br />
						Throughout my academic journey I've developed the habit of constantly raising my ceiling, as a programmer and as a person. This desire to learn and hone my skills also led me to
						contribute to my course's student organization.
						<br />
						I'm also passionate about stories and everything creative, so being able to incorporate that into my work and making something unique is always exciting to me!
						If you want to reach out, you can do so by clicking the links below, or send me a message through the Contact section of this website.
					</p>
					<div className="flex flex-row gap-2 sm:gap-5 items-center justify-center text-sm sm:text-lg ">
						<LinkCard link="https://www.linkedin.com/in/duarte-araújo-91a168307" download={false}>
							<FaLinkedin className="text-2xl sm:text-4xl"/>
							<h1>LinkedIn</h1>
						</LinkCard>
						<LinkCard link="https://github.com/duartearaujo" download={false}>
							<FaGithub className="text-2xl sm:text-4xl" />
							<h1>GitHub</h1>
						</LinkCard>
						<LinkCard link="/DuarteAraujo_CV.pdf" download={true}>
							<FaFileDownload className="text-2xl sm:text-4xl" />
							<h1>Resume</h1>
						</LinkCard>
					</div>
				</Text>
			</Section>
			<Section id={'Projects'} selection={setSelected} selected={selected} isVisible={isVisible} >
				<div className="project-card-wrapper flex flex-row flex-wrap-reverse md:flex-nowrap gap-5 h-full w-full justify-center opacity-1">
					{/*}
					<div className="flex flex-col gap-5 w-3/4 opacity-1">
						<ProjectCard>
							<Image src="/projects/1.png" alt="Project" width={300} height={200} className="rounded-lg" />
							<p>A brief description of project.</p>
						</ProjectCard>
					</div>
					*/}
					<div className="project-card-container flex flex-col gap-5 h-full w-2/3 opacity-1">
						<ProjectCard link="https://github.com/duartearaujo/PEL_2026">
							<Image src="/projects/pel/foto4.png" alt="Project" width={300} height={200} className="rounded-lg" />
							<div className="space-y-2">
								<h2 className="text-2xl">Language Processing Project - LL1 Parser Generator</h2>
								<hr className="w-full border-1 border-white" />
								<p>
									Application with a web interface for LL1 grammar checking and respective parsergeneration, with both recursive-descent and table-driven options. 
									It also includes a conflict detection component based on ontology generation and SPARQL queries.
								</p>
							</div>
						</ProjectCard>
						{/*
						<ProjectCard link="/projects/1">
							<Image src="/projects/1.png" alt="Project" width={300} height={200} className="rounded-lg" />
							<p>A brief description of project.</p>
						</ProjectCard>
						<ProjectCard link="/projects/1">
							<Image src="/projects/1.png" alt="Project" width={300} height={200} className="rounded-lg" />
							<p>A brief description of project.</p>
						</ProjectCard>
						*/}
					</div>
        		</div>
			</Section>
			<Section id={'Contacts'} selection={setSelected} selected={selected} isVisible={isVisible} >
				<ContactForm />
			</Section>
		</>
	);
}

