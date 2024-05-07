'use client';

import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useGLTF, PerspectiveCamera, Preload, OrbitControls } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CanvasLoader from '@/components/canvas/Loader';
import { useCustomization } from './BigCrossContext';

type BigCrossProp = GLTF & {
  nodes: {
    ['1-4']: THREE.Mesh;
    ['1-1']: THREE.Mesh;
    ['1-3']: THREE.Mesh;
    ['2-3']: THREE.Mesh;
    ['2-1']: THREE.Mesh;
    ['2-4']: THREE.Mesh;
    ['2-5']: THREE.Mesh;
    ['2-2']: THREE.Mesh;
    ['3-4']: THREE.Mesh;
    ['3-1']: THREE.Mesh;
    ['3-3']: THREE.Mesh;
    ['3-2']: THREE.Mesh;
    ['1-2']: THREE.Mesh;
    w4: THREE.Mesh;
    w4_1: THREE.Mesh;
    w1: THREE.Mesh;
    w1_1: THREE.Mesh;
    w2: THREE.Mesh;
    w2_1: THREE.Mesh;
    w3: THREE.Mesh;
    w3_1: THREE.Mesh;
    w5: THREE.Mesh;
    w5_1: THREE.Mesh;
  };
  materials: {
    Lego11: THREE.MeshStandardMaterial;
    Lego12: THREE.MeshStandardMaterial;
    Lego13: THREE.MeshStandardMaterial;
    Lego14: THREE.MeshStandardMaterial;
    Lego21: THREE.MeshStandardMaterial;
    Lego22: THREE.MeshStandardMaterial;
    Lego23: THREE.MeshStandardMaterial;
    Lego24: THREE.MeshStandardMaterial;
    Lego25: THREE.MeshStandardMaterial;
    Lego31: THREE.MeshStandardMaterial;
    Lego32: THREE.MeshStandardMaterial;
    Lego33: THREE.MeshStandardMaterial;
    Lego34: THREE.MeshStandardMaterial;
    word1: THREE.MeshStandardMaterial;
    word2: THREE.MeshStandardMaterial;
    word3: THREE.MeshStandardMaterial;
    word4: THREE.MeshStandardMaterial;
    word5: THREE.MeshStandardMaterial;
  };
};

//type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>;
function BigCross(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/bigCross_compressed.gltf') as BigCrossProp;
  const { state } = useCustomization() as any;
  //const [active, setActive] = useState(false);

  // This reference gives us direct access to the THREE.Mesh object
  //const ref = useRef<THREE.Group>(null!);

  // Cursor showing current color
  //const [hovered, hover] = useState(false);

  //const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  //useFrame((state, delta) => (ref.current.rotation.x += delta))
  const snap = useSnapshot(state);

  const [hoveredItem, sethoveredItem] = useState('');
  const hoverColor = '#eab308';

  return (
    <group
      {...props}
      dispose={null}
      onPointerOver={(event) => {
        event.stopPropagation();
        sethoveredItem((event as any).object.material.name);
      }}
      onPointerOut={(event) => {
        event.intersections.length === 0 && sethoveredItem('');
      }}
      onPointerMissed={() => (state.current = null)}
      onPointerDown={(event) => {
        event.stopPropagation();
        state.current = (event as any).object.material.name;
        //console.log('userdata: ' + (event as any).object.userData[0] );
        //click(true);
      }}
    >
      <group position={[0.04838, 0.02456, 0.08138]} rotation={[Math.PI / 2, 0, 0]} scale={0.05648}>
        <mesh geometry={nodes.w1.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w1_1.geometry} material={materials.word1} />
      </group>
      <group position={[-0.07421, 0.02467, 0.14039]} rotation={[Math.PI / 2, 0, 0]} scale={0.05648}>
        <mesh geometry={nodes.w2.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w2_1.geometry} material={materials.word2} />
      </group>
      <group position={[-0.14154, 0.02429, 0.13916]} rotation={[Math.PI / 2, 0, 0]} scale={0.05648}>
        <mesh geometry={nodes.w3.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w3_1.geometry} material={materials.word3} />
      </group>
      <group position={[0.01567, 0.024, 0.08045]} rotation={[Math.PI / 2, 0, 0]} scale={0.05648}>
        <mesh geometry={nodes.w4.geometry} material={materials.word4} />
        <mesh geometry={nodes.w4_1.geometry} material-color={0xffffff} />
      </group>
      <group position={[0.1184, 0.02397, 0.13869]} rotation={[Math.PI / 2, 0, 0]} scale={0.05648}>
        <mesh geometry={nodes.w5.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w5_1.geometry} material={materials.word5} />
      </group>

      <mesh
        material-color={hoveredItem === 'Lego11' ? hoverColor : snap.items.Lego11}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['1-1'].geometry}
        material={materials.Lego11}
        position={[-0.40614, 0.05254, 0.20474]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego12' ? hoverColor : snap.items.Lego12}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['1-2'].geometry}
        material={materials.Lego12}
        position={[-0.9318, 0.05481, 0.1987]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego13' ? hoverColor : snap.items.Lego13}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['1-3'].geometry}
        material={materials.Lego13}
        position={[-0.40467, 0.05208, 0.20422]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego14' ? hoverColor : snap.items.Lego14}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['1-4'].geometry}
        material={materials.Lego14}
        position={[-0.40493, 0.05194, 0.20468]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />

      <mesh
        material-color={hoveredItem === 'Lego21' ? hoverColor : snap.items.Lego21}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['2-1'].geometry}
        material={materials.Lego21}
        position={[-0.66506, 0.02306, 0.20626]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego22' ? hoverColor : snap.items.Lego22}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['2-2'].geometry}
        material={materials.Lego22}
        position={[-0.66564, 0.02325, 0.20591]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego23' ? hoverColor : snap.items.Lego23}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['2-3'].geometry}
        material={materials.Lego23}
        position={[-0.6649, 0.02356, 0.20815]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego24' ? hoverColor : snap.items.Lego24}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['2-4'].geometry}
        material={materials.Lego24}
        position={[-0.6672, 0.02356, 0.20817]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego25' ? hoverColor : snap.items.Lego25}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['2-5'].geometry}
        material={materials.Lego25}
        position={[-0.66527, -0.00561, 0.20619]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />

      <mesh
        material-color={hoveredItem === 'Lego31' ? hoverColor : snap.items.Lego31}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['3-1'].geometry}
        material={materials.Lego31}
        position={[-0.93896, -0.00263, 0.1987]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego32' ? hoverColor : snap.items.Lego32}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['3-2'].geometry}
        material={materials.Lego32}
        position={[-0.93189, -0.00235, 0.19893]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego33' ? hoverColor : snap.items.Lego33}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['3-3'].geometry}
        material={materials.Lego33}
        position={[-0.9331, -0.00264, 0.19914]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
      <mesh
        material-color={hoveredItem === 'Lego34' ? hoverColor : snap.items.Lego34}
        onPointerOver={(event) => {
          event.stopPropagation();
          sethoveredItem((event as any).object.material.name);
        }}
        onPointerOut={(event) => {
          event.intersections.length === 0 && sethoveredItem('');
        }}
        geometry={nodes['3-4'].geometry}
        material={materials.Lego34}
        position={[-0.93797, -0.00264, 0.19914]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.05648}
      />
    </group>
  );
}
useGLTF.preload('/bigCross_compressed.gltf');

const BigCrossCanvas = () => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0.12337, 1, 0.67286], fov: 50 }}>
        <pointLight
          intensity={60000}
          decay={2}
          position={[45, 65, -30]}
          rotation={[-0.8, -0.2, -0.2]}
        />
        <ambientLight intensity={1} />
        <Suspense fallback={<CanvasLoader />}>
          <BigCross />
          <OrbitControls minDistance={0.16} maxDistance={1} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>

    /*
     <Canvas dpr={[1, 2]} frameloop="demand" shadows camera={{ position: [10, 15, 15], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.1} />

        <Suspense fallback={<CanvasLoader />}>
          <PresentationControls speed={-0.5} global polar={[-0.1, Math.PI / 4]} rotation={[Math.PI / 8, Math.PI / 4, 0]}>
            <Stage contactShadow shadows intensity={0} preset="rembrandt" makeDefault>
              <BigCrossModel />
            </Stage>
          </PresentationControls>
        </Suspense>

        <CameraShake
          maxYaw={0.1} // Max amount camera can yaw in either direction
          maxPitch={0.1} // Max amount camera can pitch in either direction
          maxRoll={0.1} // Max amount camera can roll in either direction
          yawFrequency={0.1} // Frequency of the the yaw rotation
          pitchFrequency={0.1} // Frequency of the pitch rotation
          rollFrequency={0.1} // Frequency of the roll rotation
          intensity={0} // initial intensity of the shake
          decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at />
        />
        <ContactShadows rotation-x={Math.PI / 2} position={[0, -0.8, 0]} opacity={0.25} width={10} height={10} blur={2} far={1} />
        <OrbitControls makeDefault enableZoom={true} enablePan={true} />
      </Canvas>
    */
  );
};
export default BigCrossCanvas;
