'use client';

import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { useGLTF, CameraControls, PerspectiveCamera, Preload } from '@react-three/drei';

import { useSnapshot } from 'valtio';
import React, { PointerEvent, useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, ThreeEvent, ThreeElements, useFrame, MeshProps } from '@react-three/fiber';
import { random } from 'maath';
import {
  OrbitControls,
  Stage,
  PresentationControls,
  CameraShake,
  ContactShadows,
} from '@react-three/drei';
//import { CrossPreset, DefaultBigCrossPreset } from '@/constants';
import CanvasLoader from '@/components/canvas/Loader';
import { useCustomization } from './BigCrossContext';

type GLTFResult = GLTF & {
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
export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/bigCross_compressed.gltf') as GLTFResult;
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
      <group position={[0.00746, 0.0035, 0.01487]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.w1.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w1_1.geometry} material={materials.word1} />
      </group>
      <group position={[-0.01425, 0.00352, 0.02532]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.w2.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w2_1.geometry} material={materials.word2} />
      </group>
      <group position={[-0.02617, 0.00345, 0.0251]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.w3.geometry} material-color={0xffffff} />
        <mesh geometry={nodes.w3_1.geometry} material={materials.word3} />
      </group>
      <group position={[0.00167, 0.0034, 0.0147]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh geometry={nodes.w4.geometry} material={materials.word4} />
        <mesh geometry={nodes.w4_1.geometry} material-color={0xffffff} />
      </group>
      <group position={[0.01986, 0.00339, 0.02501]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
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
        position={[-0.07302, 0.00845, 0.03671]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.16609, 0.00885, 0.03564]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.07275, 0.00837, 0.03662]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.0728, 0.00834, 0.0367]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.11885, 0.00323, 0.03685]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.11896, 0.00326, 0.03691]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.11883, 0.00332, 0.03731]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.11924, 0.00332, 0.03731]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.11894, -0.00184, 0.03692]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.16735, -0.00132, 0.03564]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.1661, -0.00127, 0.03568]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.16632, -0.00132, 0.03572]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
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
        position={[-0.16718, -0.00132, 0.03572]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
    </group>
  );
}

useGLTF.preload('/bigCross_compressed.gltf');

const TestCanvas = () => {
  //const cameraControlRef = useRef<CameraControls | null>(null);

  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera
          makeDefault={true}
          far={1000}
          near={0.1}
          fov={50}
          position={[0.00816, 0.12007, 0.04826]}
          rotation={[-0.79273, -0.21686, -0.21572]}
        />
        <ambientLight intensity={1} />
        <directionalLight position={[3.3, 1.0, 4.4]} intensity={2} />
        <Suspense fallback={<CanvasLoader />}>
          <Model />

          <axesHelper args={[5]} />
          <Preload all />
        </Suspense>{' '}
        <OrbitControls />
      </Canvas>
    </div>
  );
  /*


  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 0, 1], fov: 10 }}>
        <CameraControls ref={cameraControlRef} />
        <ambientLight intensity={0.5} />
        <Suspense fallback=<CanvasLoader />>
          <PresentationControls global>
            <Stage shadows>
              <BigCross />
            </Stage>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
  
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 0, 1], fov: 30 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={<CanvasLoader />}>
          <OrbitControls />
          <Model /><axesHelper args={[5]} />
          <Preload all /><Stats />
        </Suspense>
      </Canvas>
    </div>
  );

*/
};
export default TestCanvas;
