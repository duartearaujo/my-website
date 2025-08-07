"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Float, RoundedBox } from "@react-three/drei";
import gsap from "gsap";
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
    { 
        id: "About Me", 
        position: {
                    'lg': [4, -1.5, 1] as [number, number, number],
                    'md': [2.5, -1.5, 1] as [number, number, number],
                    'sm': [1, -2.5, 1] as [number, number, number]
        }, 
        scale: 1, 
        frag: planetfrag1, 
        groupRtt: {
                    'lg': { x: 0, y: Math.PI/1.6, z: 0 },
                    'md': { x: 0, y: Math.PI/1.6, z: 0 },
                    'sm': { x: 0, y: Math.PI/1.6, z: 0 }
        }, 
        groupPos: {
                    'lg': { x: 0.61, y: 1, z: 7 },
                    'md': { x: 0, y: 1.5, z: 5.5 },
                    'sm': { x: -0.5, y: 2.5, z: 4 }
        }, 
        labelPos: [-2.5, 1.5, 1.5] as [number, number, number], 
        labelScale: 1.2,
        labelScaleHover: 1.5
    },
    { 
        id: "Projects", 
        position: {
                    'lg': [-6.5, -0.8, -3] as [number, number, number],
                    'md': [-3.5, -0.8, -3.5] as [number, number, number],
                    'sm': [-1.5, -1, -4.5] as [number, number, number]
        },
        scale: 0.8, 
        frag: planetfrag2, 
        groupRtt: {
                    'lg': { x: 0, y: -Math.PI/1.6, z: 0 },
                    'md': { x: 0, y: -Math.PI/1.6, z: 0 },
                    'sm': { x: 0, y: -Math.PI/1.6, z: 0 }
        }, 
        groupPos: {
                    'lg': { x: -3, y: 0.7, z: 7 },
                    'md': { x: -3, y: 0.7, z: 4 },
                    'sm': { x: -3.5, y: 1.5, z: 3 }
        },  
        labelPos: [2, 1, 3] as [number, number, number],
        labelScale: 1.2,
        labelScaleHover: 1.5
    },
    { 
        id: "Contacts", 
        position: {
                    'lg': [0.25, 1, -6.5] as [number, number, number], 
                    'md': [0.25, 1, -6.5] as [number, number, number],
                    'sm': [1.5, 1.3, -7] as [number, number, number]
        },
        scale: 0.45, 
        frag: planetfrag3, 
        groupRtt: {
                    'lg': { x: Math.PI/4.8, y: 0, z: 0 },
                    'md': { x: Math.PI/4.8, y: 0, z: 0 },
                    'sm': { x: Math.PI/4.8, y: 0, z: 0 }
        }, 
        groupPos: {
                    'lg': { x: -0.25, y: -3.6, z: 7.5 }, 
                    'md': { x: -0.25, y: -3.5, z: 7.8 }, 
                    'sm': { x: -1.5, y: -4, z: 8 }
        },  
        labelPos: [1, -2.5, 3] as [number, number, number],
        labelScale: 1.2,
        labelScaleHover: 1.5
    }
]

const sphereGeometry = new SphereGeometry(2.5, 64, 64);

function Title({ text }: { text: string }) {

    const { viewport } = useThree();
    const scalefactor = viewport.width < 4.5 ? 0.5 : viewport.width < 10 ? 0.6 : 1; 
    const defaultPos = [0.5 * viewport.width / 2, 0.7 * viewport.height / 2, -15] as [number, number, number];
    const smallPos = [0.7 * viewport.width / 2, 1.2 * viewport.height / 2, -22] as [number, number, number];
    const pos = viewport.width < 4.5 ? smallPos : defaultPos;

    return (
        <Float speed={1.5} rotationIntensity={0.2 * scalefactor} floatIntensity={0.2 * scalefactor}>
            <Text position={ pos } scale={1 * scalefactor} font="/fonts/Climate_Crisis/ClimateCrisis-Regular-VariableFont_YEAR.ttf" fontSize={4} strokeColor={"black"} strokeWidth={0.05 / scalefactor} rotation={[0, (Math.PI/(12*scalefactor)), 0]}>
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
            uTime: { value: 0 },
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

/*
function RoundedShape({width, height, radius, segments}: { width: number; height: number; radius: number; segments: number }) {
    
    const n = (segments + 1) * 4;
    let indices: number[] = [], positions: number[] = [], uvs: number[] = [];
    let quadrant, signx, signy, x, y;
    const geometry = new BufferGeometry();

    function draw(j: number) {
        quadrant = Math.trunc( 4 * j / n ) + 1;
        signx = (quadrant === 1 || quadrant === 4) ? 1 : -1;
        signy = quadrant < 3 ? 1 : -1;
        x = signx * (width / 2 - radius) + radius * Math.cos(2 * Math.PI  * (j - quadrant + 1) / (n - 4));
        y = signy * (height / 2 - radius) + radius * Math.sin(2 * Math.PI  * (j - quadrant + 1) / (n - 4));
        positions.push(x, y, 0);
        uvs.push(0.5 + x / width, 0.5 + y / height);
    }

    for (let i = 1; i < n+1; i++) indices.push(0, i, i + 1);
    indices.push(0, n, 1);
    positions.push(0, 0, 0);
    uvs.push(0.5, 0.5);
    for (let j = 1; j < n + 1; j++) draw(j);

    geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('uv', new BufferAttribute( new Float32Array(uvs), 2));
    return geometry;
}
*/

// Label for the spheres representing the different sections of the site
function Label({ hovered, selected, position, children }: { hovered: boolean; selected: string | null; position: [number, number, number]; children: string[] }) {

    const labelRef = useRef<Group>(null);

    useGSAP(() => {
        if (labelRef.current) {
            gsap.to(labelRef.current.scale, {
                duration: 0.5,
                x: hovered ? 1 : 0.6,
                y: hovered ? 1 : 0.6,
                z: hovered ? 1 : 0.6,
                ease: "power2.inOut"
            });
        }
    }, [hovered]);

    useGSAP(() => {
        if (labelRef.current) {
            for (const child of labelRef.current.children) {
                if (child instanceof Mesh) {
                    gsap.to(child.material, {
                        duration: 0.5,
                        opacity: (selected === null) ? (child.name === "box" ? 0.7 : 1) : 0,
                        ease: "power2.inOut",
                        delay: (selected === null) ? 0.5 : 0.1
                    });
                }
            }
        }
    }, [selected]);

    return (
        <Billboard scale={1}> 
            <Float speed={1.7} rotationIntensity={0.5} floatIntensity={0.5}>
                <group ref={labelRef} scale={0.4} position={position}>
                    <RoundedBox name="box" args={[2.8, 0.8, 0.1]} radius={0.1} bevelSegments={0} steps={0}>
                        <meshPhysicalMaterial color="#2e1065" transparent opacity={0.7} thickness={0.7}/>
                    </RoundedBox>
                    <Text  
                        fontWeight={800}
                        fontSize={0.4} 
                        color="white" 
                        position={[0, 0, 0.01]} 
                        fillOpacity={1}
                    >
                        { children }
                    </Text>
                </group>
            </Float>
        </Billboard>
    );
}

type SphereProps = {
    id: string;
    scale: number;
    position: {'sm': [number, number, number]; 'md': [number, number, number]; 'lg': [number, number, number]} | [number, number, number];
    frag: string;
    groupPos: { 'sm': { x: number; y: number; z: number }; 'md': { x: number; y: number; z: number }; 'lg': { x: number; y: number; z: number } } | { x: number; y: number; z: number };
    groupRtt: { 'sm': { x: number; y: number; z: number }; 'md': { x: number; y: number; z: number }; 'lg': { x: number; y: number; z: number } } | { x: number; y: number; z: number };
    labelPos: [number, number, number];
    selection: (id: string | null) => void;
    selected: string | null;
    setIsVisible: (id: string | null) => void;
    groupRef: React.RefObject<Group>;
};

function Sphere(props: SphereProps) {

    const { viewport } = useThree();
    const sphereRef = useRef<Mesh>(null);
    const materialRef = useRef(null);

    const [hovered, setHovered] = useState(false);

    const scalefactor = viewport.width < 4.5 ? 0.8 : viewport.width < 10 ? 0.8 : 1; 
    const viewSize = viewport.width < 4.5 ? 'sm' : viewport.width < 10 ? 'md' : 'lg';

    const new_pos = props.position[viewSize as keyof typeof props.position];

    const onHover = () => {
        setHovered(true);
        if (props.selected === null) {
            document.body.style.cursor = 'pointer';
        }
    }

    const leaveHover = () => {
        setHovered(false);
        document.body.style.cursor = 'default';
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
        <group position={ new_pos } scale={ props.scale * scalefactor } onClick={sphereHandler} onPointerEnter={onHover} onPointerLeave={leaveHover}>
            <mesh ref={sphereRef} geometry={sphereGeometry}  >
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
            <Label hovered={hovered} selected={props.selected} position={props.labelPos}> {props.id.toUpperCase()} </Label>
        </group>
    );
}

function MeshGroup({ setIsVisible, selection, selected }: { setIsVisible: (id: string | null) => void; selection: (id: string | null) => void; selected: string | null }) {

    const groupRef = useRef<Group>(new Group());
    const { viewport } = useThree();
    const size: 'sm' | 'md' | 'lg' = viewport.width <= 4.5 ? 'sm' : viewport.width <= 10 ? 'md' : 'lg';

    function getAnimationValues() {
        let groupPos = { x: 0, y: 0, z: 0 };
        let groupRtt = { x: 0, y: 0, z: 0 };

        const selectedSphere = info.find(item => item.id === selected);
        
        if (selectedSphere) {
            groupPos = selectedSphere.groupPos[size as keyof typeof selectedSphere.groupPos];
            groupRtt = selectedSphere.groupRtt[size as keyof typeof selectedSphere.groupRtt];
        }

        return { groupPos, groupRtt };
    }

    const Light = () => {
        const directionalLight = useRef<DirectionalLight>(new DirectionalLight());
        return (
            <>
                <ambientLight intensity={0.2} />
                <directionalLight ref={directionalLight} position={[1.6, 10, 10]} intensity={2.5} castShadow />
            </>
        );
    }

    useEffect(() => {
        if (selected !== null && groupRef.current) {
            const { groupPos, groupRtt } = getAnimationValues();
            groupRef.current.position.set(groupPos.x, groupPos.y, groupPos.z);
            groupRef.current.rotation.set(groupRtt.x, groupRtt.y, groupRtt.z);
        }
    }, [size]);

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
            const { groupPos, groupRtt } = getAnimationValues();
            
            gsap.to(groupRef.current.rotation, {
                x: groupRtt.x,
                y: groupRtt.y,
                z: groupRtt.z,
                duration: 1,
                ease: "power2.inOut"
            });
            gsap.to(groupRef.current.position, {
                x: groupPos.x,
                y: groupPos.y,
                z: groupPos.z,
                duration: 1,
                ease: "power2.inOut"
            });
            
        }
    }, [selected]);

    return (
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
    );
}

export default function Scene({ setIsLoaded, isLoaded, setIsVisible, selection, selected }: { setIsLoaded: (bool: boolean) => void; isLoaded: boolean; setIsVisible: (id: string | null) => void; selection: (id: string | null) => void; selected: string | null }) {

    const scene = useRef(null);

    return (
        <div ref={scene} className="fixed w-full h-full">
            <Canvas camera={{position: [0, 2, 5]}}>
                {!isLoaded && <Ready setIsLoaded={setIsLoaded} />}
                <Background />
                <MeshGroup setIsVisible={setIsVisible} selection={selection} selected={selected} />
            </Canvas>
        </div>
    );
}