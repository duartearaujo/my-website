"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import gsap from "gsap";
import { Html } from "@react-three/drei";
import { DirectionalLight, Group, MeshPhysicalMaterial, ShaderMaterial, SphereGeometry } from "three";
import { Mesh } from "three";
import { Text } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material";

import vertex from '@/app/shaders/vertex.glsl';
import fragment from '@/app/shaders/fragment.glsl';
import planetfrag1 from '@/app/shaders/planetfrag1.glsl';
import planetfrag2 from '@/app/shaders/planetfrag2.glsl';
import planetfrag3 from '@/app/shaders/planetfrag3.glsl';
import planetvert1 from '@/app/shaders/planetvert1.glsl';
import { useGSAP } from "@gsap/react";
import Ready from "./Ready";

const info = [
    { id: "About Me", position: [4, -1.5, 1] as [number, number, number], scale: 1, frag: planetfrag1, groupRtt: { x: 0, y: Math.PI/1.6, z: 0 }, groupPos: { x: 0.61, y: 1, z: 7 }, labelPos: [1.3, 0.5, 2] as [number, number, number] },
    { id: "Projects", position: [-6.5, -0.8, -3] as [number, number, number], scale: 0.8, frag: planetfrag2, groupRtt: { x: 0, y: -Math.PI/1.6, z: 0 }, groupPos: { x: -3, y: 0.7, z: 7 }, labelPos: [-8.5, 0, -3] as [number, number, number] },
    { id: "Contacts", position: [0.25, 1, -6.5] as [number, number, number], scale: 0.45, frag: planetfrag3, groupRtt: { x: Math.PI/4.8, y: 0, z: 0 }, groupPos: { x: -0.25, y: -3.6, z: 7.5 }, labelPos: [0.5, 0.5, -6] as [number, number, number] }
]

const sphereGeometry = new SphereGeometry(2.5, 64, 64);

function Title({ text }: { text: string }) {
    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
            <Text position={ [2, 3, -15] } font="/fonts/Climate_Crisis/ClimateCrisis-Regular-VariableFont_YEAR.ttf" fontSize={4} strokeColor={"black"} strokeWidth={0.05} rotation={[0, (Math.PI/12), 0]}>
                {text}
                <meshBasicMaterial color="white" />
            </Text>
        </Float>
    );
}

function Background() {

    const ref = useRef<Mesh>(null);

    useFrame((state) => {
        if (ref.current){
            const {clock} = state;
            (ref.current.material as ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
        }
    });
    
    const material = new ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            uTime: { value: 0 }
        },
        depthWrite: false,
        depthTest: false
    });
    
    return (
            <mesh ref={ref} material={material} position={[0, 0, -30]} renderOrder={-1}>
                <planeGeometry args={[2, 2]} />
            </mesh>
    );
}

type SphereProps = {
    id: string;
    scale: number;
    position: [number, number, number];
    frag: string;
    groupPos: { x: number; y: number; z: number };
    groupRtt: { x: number; y: number; z: number };
    labelPos: [number, number, number];
    selection: (id: string | null) => void;
    selected: string | null;
    setIsVisible: (id: string | null) => void;
    groupRef: React.RefObject<Group>;
};

function Sphere(props: SphereProps) {

    // const { viewport } = useThree();
    const sphereRef = useRef<Mesh>(null);
    const materialRef = useRef(null);
    const jointID = props.id.replace(' ', '');

    // Adjust the scale based on the viewport size
    // const new_scale = props.scale * (viewport.width / 1000);
    // const new_labelPos = props.labelPos.map(coord => coord * (viewport.width / 1000)) as [number, number, number];
    // const new_position = props.position.map(coord => coord * (viewport.width / 1000)) as [number, number, number];

    const onHover = () => {
        if (props.selected === null) {
            document.body.style.cursor = 'pointer';
        }
        gsap.to(`.${jointID}`, {
            duration: 0.5,
            scale: props.scale + .75,
            ease: "power2.inOut"
        });
    }

    const leaveHover = () => {
        document.body.style.cursor = 'default';
        gsap.to(`.${jointID}`, {
            duration: 0.5,
            scale: props.scale,
            ease: "power2.inOut"
        });
    }
    
    const sphereHandler = () => {
        props.setIsVisible(props.id);
        props.selection(props.id);
    }

    useFrame((state, delta) => {
        if (sphereRef.current && materialRef.current) {
            sphereRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            <mesh ref={sphereRef} geometry={sphereGeometry} position={ props.position } scale={ props.scale } onClick={sphereHandler} onPointerEnter={onHover} onPointerLeave={leaveHover}>
                <CustomShaderMaterial 
                    ref={materialRef}
                    baseMaterial={MeshPhysicalMaterial} 
                    vertexShader={planetvert1} 
                    fragmentShader={props.frag} 
                    uniforms={{
                        density: { value: 1.0 }
                    }}
                />
            </mesh>
            <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.3}>
                <Html position={props.labelPos} center>
                    <div className={`${jointID} w-36 text-center text-white font-sans font-bold text-lg rounded-md bg-violet-950/60 backdrop-blur-md p-2 pointer-events-none ${(props.selected !== null) ? 'animate-fadeOut opacity-0' : 'animate-fadeIn'}`} style={{ transform: `scale(${props.scale})`}}>
                        {props.id.toUpperCase()}
                    </div>
                </Html>
            </Float>
        </group>
    );
}

export default function Scene({ setIsLoaded, isLoaded, setIsVisible, selection, selected }: { setIsLoaded: (bool: boolean) => void; isLoaded: boolean; setIsVisible: (id: string | null) => void; selection: (id: string | null) => void; selected: string | null }) {

    const scene = useRef(null);
    const groupRef = useRef<Group>(new Group());
    
    const Light = () => {
        const directionalLight = useRef<DirectionalLight>(new DirectionalLight());
        return (
            <>
                <ambientLight intensity={0.2} />
                <directionalLight ref={directionalLight} position={[1.6, 10, 10]} intensity={2.5} castShadow />
            </>
        );
    }
    
    useGSAP(() => {
        if ((selected === null) && groupRef.current) {
            gsap.to(groupRef.current.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: "power2.inOut"
            });
            gsap.to(groupRef.current.position, {
                x: 0,
                y: 0,
                z: 0,
                duration: 1,
                ease: "power2.inOut"
            });
        } 
        else if (selected !== null && groupRef.current) {
            const selectedSphere = info.find(item => item.id === selected);
            if (selectedSphere) {
                gsap.to(groupRef.current.rotation, {
                    x: selectedSphere.groupRtt.x,
                    y: selectedSphere.groupRtt.y,
                    z: selectedSphere.groupRtt.z,
                    duration: 1,
                    ease: "power2.inOut"
                });
                gsap.to(groupRef.current.position, {
                    x: selectedSphere.groupPos.x,
                    y: selectedSphere.groupPos.y,
                    z: selectedSphere.groupPos.z,
                    duration: 1,
                    ease: "power2.inOut"
                });
            }
        }
    }, [selected]);

    return (
        <div ref={scene} className="fixed w-full h-full">
            <Canvas camera={{position: [0, 2, 5]}}>
                {!isLoaded && <Ready setIsLoaded={setIsLoaded} />}
                <Background />
                <group ref={groupRef}>
                    <Light />
                    <Title text="MY WEBSITE"/>
                    {info.map((item) => (
                        <Sphere 
                            key={item.id}
                            id={item.id} 
                            scale={item.scale} 
                            position={item.position} 
                            frag={item.frag}
                            groupPos={item.groupPos}
                            groupRtt={item.groupRtt}
                            labelPos={item.labelPos}
                            selected={selected}
                            selection={selection}
                            setIsVisible={setIsVisible}
                            groupRef={groupRef}
                        />    
                    ))}
                </group>
            </Canvas>
        </div>
    );
}