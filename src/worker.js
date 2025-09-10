import { WebDemuxer } from 'web-demuxer';

const demuxer = new WebDemuxer({
    wasmFilePath:
        'https://cdn.jsdelivr.net/npm/web-demuxer@latest/dist/wasm-files/web-demuxer.wasm',
});

const fileName = 'small.mp4';
const arrayBuffer = await fetch(fileName).then(res => res.arrayBuffer());

const blob = new Blob([arrayBuffer], { type: 'video/mp4' });
const file = new File([blob], fileName);

await demuxer.load(file);

const videoDecoderConfig = await demuxer.getDecoderConfig('video');
const stream = demuxer.read('video');
const reader = stream.getReader();

const chunks = [];
const readChunks = async numberOfChunksToRead => {
    while (chunks.length < numberOfChunksToRead) {
        const { value: videoEncodedChunk } = await reader.read();
        if (videoEncodedChunk) {
            chunks.push(videoEncodedChunk);
        }
    }
};

const decodeChunks = () => {
    while (chunks.length > 0) {
        const chunk = chunks.shift();
        if (chunk) {
            decoder.decode(chunk);
        }
    }
};

const decoder = new VideoDecoder({
    output: frame => {
        console.log('output frame');
        frame.close();
    },
    error: e => {
        console.error('video decoder error:', e);
    },
});
decoder.ondequeue = () => {
    console.log('ondequeue fired, queue size:', decoder.decodeQueueSize);
};

await readChunks(4);

decoder.configure(videoDecoderConfig);

decoder.reset(); // <- comment this and dequeue will fire and frames get outputted
decoder.configure(videoDecoderConfig);

// OR uncomment this to add a delay before decoding. dequeue will fire and frames get outputted
// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// await sleep(1000);

decodeChunks();
