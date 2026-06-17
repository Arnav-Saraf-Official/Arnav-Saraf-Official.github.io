export interface AudioState {
	masterVolume: number;
	musicVolume: number;
	sfxVolume: number;
	isMuted: boolean;
	isLaunchMusicPlaying: boolean;
	isAmbientPlaying: boolean;
}

let _audioCtx = $state<AudioContext | null>(null);
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let launchSource: AudioBufferSourceNode | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const bufferCache = new Map<string, AudioBuffer>();

let _state = $state<AudioState>({
	masterVolume: 0.7,
	musicVolume: 1.0,
	sfxVolume: 1.0,
	isMuted: false,
	isLaunchMusicPlaying: false,
	isAmbientPlaying: false
});

export const getAudioState = () => _state;
export const getAudioCtx = () => _audioCtx;

export function initAudio(): void {
	if (_audioCtx) return;
	_audioCtx = new AudioContext();
	masterGain = _audioCtx.createGain();
	musicGain = _audioCtx.createGain();
	sfxGain = _audioCtx.createGain();
	masterGain.connect(_audioCtx.destination);
	musicGain.connect(masterGain);
	sfxGain.connect(masterGain);
	masterGain.gain.value = _state.masterVolume;
}

async function loadBuffer(url: string): Promise<AudioBuffer> {
	if (bufferCache.has(url)) return bufferCache.get(url)!;
	const resp = await fetch(url);
	const arrayBuf = await resp.arrayBuffer();
	const audioBuf = await _audioCtx!.decodeAudioData(arrayBuf);
	bufferCache.set(url, audioBuf);
	return audioBuf;
}

export async function playLaunchMusic(): Promise<void> {
	if (!_audioCtx) return;
	try {
		const buf = await loadBuffer('/audio/launch-music.mp3');
		launchSource = _audioCtx.createBufferSource();
		launchSource.buffer = buf;
		launchSource.loop = true;
		launchSource.connect(musicGain!);
		launchSource.start();
		_state = { ..._state, isLaunchMusicPlaying: true };
	} catch {
		// Audio file may not exist yet
	}
}

export function stopLaunchMusic(): void {
	if (!launchSource || !_audioCtx) return;
	musicGain!.gain.linearRampToValueAtTime(0, _audioCtx.currentTime + 0.5);
	setTimeout(() => {
		try {
			launchSource?.stop();
		} catch {
			// Already stopped
		}
		launchSource?.disconnect();
		launchSource = null;
		musicGain!.gain.value = _state.musicVolume;
		_state = { ..._state, isLaunchMusicPlaying: false };
	}, 500);
}

export async function playAmbientLoop(): Promise<void> {
	if (!_audioCtx) return;
	try {
		const buf = await loadBuffer('/audio/ambient-loop.mp3');
		ambientSource = _audioCtx.createBufferSource();
		ambientSource.buffer = buf;
		ambientSource.loop = true;
		ambientSource.connect(musicGain!);
		ambientSource.start();
		_state = { ..._state, isAmbientPlaying: true };
	} catch {
		// Audio file may not exist
	}
}

export function stopAmbientLoop(): void {
	if (!ambientSource || !_audioCtx) return;
	musicGain!.gain.linearRampToValueAtTime(0, _audioCtx.currentTime + 1);
	setTimeout(() => {
		try {
			ambientSource?.stop();
		} catch {
			// Already stopped
		}
		ambientSource?.disconnect();
		ambientSource = null;
		musicGain!.gain.value = _state.musicVolume;
		_state = { ..._state, isAmbientPlaying: false };
	}, 1000);
}

export async function playClick(): Promise<void> {
	if (!_audioCtx) return;
	try {
		const buf = await loadBuffer('/audio/click.wav');
		const src = _audioCtx.createBufferSource();
		src.buffer = buf;
		src.connect(sfxGain!);
		src.start();
	} catch {
		// Audio file may not exist
	}
}

export function toggleMute(): void {
	_state = { ..._state, isMuted: !_state.isMuted };
	if (masterGain) {
		masterGain.gain.value = _state.isMuted ? 0 : _state.masterVolume;
	}
}

export function setMasterVolume(v: number): void {
	_state = { ..._state, masterVolume: v };
	if (masterGain && !_state.isMuted) {
		masterGain.gain.value = v;
	}
}
