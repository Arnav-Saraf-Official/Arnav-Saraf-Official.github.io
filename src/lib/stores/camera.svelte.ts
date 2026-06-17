import * as THREE from 'three';

let _camera = $state<THREE.PerspectiveCamera | null>(null);

export const getCamera = () => _camera;
export const setCamera = (cam: THREE.Camera | null) => {
	_camera = cam as THREE.PerspectiveCamera | null;
};
