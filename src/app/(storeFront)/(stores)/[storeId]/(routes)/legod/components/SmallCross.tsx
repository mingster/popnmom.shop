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
import { useSmCrossCustomization } from './SmallCrossContext';

type SmallCrossProp = GLTF & {
  nodes: {
    ['1-1']: THREE.Mesh;
    ['1-2']: THREE.Mesh;
    ['1-3']: THREE.Mesh;
    ['2-1']: THREE.Mesh;
    ['2-2']: THREE.Mesh;
    ['2-3']: THREE.Mesh;
    ['3-1']: THREE.Mesh;
    ['3-2']: THREE.Mesh;
    ['3-3']: THREE.Mesh;
    lw1: THREE.Mesh;
    lw1_1: THREE.Mesh;
    lw2: THREE.Mesh;
    lw2_1: THREE.Mesh;
    lw3: THREE.Mesh;
    lw3_1: THREE.Mesh;
  };
  materials: {
    Lego23: THREE.MeshStandardMaterial;
    Lego21: THREE.MeshStandardMaterial;
    Lego22: THREE.MeshStandardMaterial;
    Lego31: THREE.MeshStandardMaterial;
    Lego11: THREE.MeshStandardMaterial;
    Lego13: THREE.MeshStandardMaterial;
    Lego12: THREE.MeshStandardMaterial;
    Lego32: THREE.MeshStandardMaterial;
    Lego33: THREE.MeshStandardMaterial;

    word1: THREE.MeshStandardMaterial;
    word2: THREE.MeshStandardMaterial;
    word3: THREE.MeshStandardMaterial;
  };
};

//type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>>

export function SmallCross(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/smCross_compressed4.gltf') as SmallCrossProp;
  const { state } = useSmCrossCustomization() as any;
  //const [active, setActive] = useState(false);

  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Group>(null!);

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
      name="smallCrossGroup"
      {...props}
      dispose={null}
      ref={ref}
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
        material={materials['Lego11']}
        position={[0.09048, 0.00917, 0.03488]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '1-1' }}
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
        position={[0.05554, 0.00898, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '1-2' }}
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
        position={[0.0326, 0.00916, 0.02671]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '1-3' }}
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
        position={[0.05535, 0.00411, 0.03489]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '2-1' }}
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
        position={[0.05554, 0.00389, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '2-2' }}
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
        position={[0.05531, -0.00089, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '2-3' }}
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
        position={[0.02476, -0.00101, 0.03489]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '3-1' }}
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
        position={[0.02485, -0.00099, 0.03476]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '3-2' }}
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
        position={[0.04082, -0.00102, 0.03475]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: '3-3' }}
      />

      <mesh
        geometry={nodes.lw1.geometry}
        position={[-0.07947, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        material={materials.word1}
      />

      <mesh
        geometry={nodes.lw2_1.geometry}
        position={[0.09084, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        material={materials.word2}
      />
      <mesh
        geometry={nodes.lw3_1.geometry}
        position={[0.09084, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        material={materials.word3}
      />

      <group
        position={[-0.07947, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: 'word1' }}
      >
        <mesh geometry={nodes.lw1_1.geometry} material-color={0xffffff} />
      </group>
      <group
        position={[0.09084, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: 'word2' }}
      >
        <mesh geometry={nodes.lw2.geometry} material-color={0xffffff} />
      </group>

      <group
        position={[0.09084, 0.00932, 0.03484]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
        userData={{ name: 'word3' }}
      >
        <mesh geometry={nodes.lw3.geometry} material-color={0xffffff} />
      </group>
    </group>
  );
}

useGLTF.preload('/smCross_compressed4.gltf');

const SmallCrossCanvas = () => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0.12337, 1, 0.67286], fov: 5 }}>
        <pointLight
          intensity={60000}
          decay={2}
          position={[45, 65, -30]}
          rotation={[-0.8, -0.2, -0.2]}
        />
        <ambientLight intensity={1} />
        <Suspense fallback={<CanvasLoader />}>
          <SmallCross />
          <OrbitControls minDistance={0.16} maxDistance={1} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};
export default SmallCrossCanvas;
