# WebCodecs VideoDecoder.ondequeue Bug Report

## Install and run

To run the repro script run `yarn && yarn start`

## Repro

Open `localhost:9000` in Chrome
Open dev tools
Result:
- notice log: `ondequeue fired, queue size: 4`
- no frames outputted i.e. no `output frame` logs
- queue does not decrease

In `worker.js` comment the line where decoder gets reset
Result:
- notice log: `ondequeue fired, queue size: 0`
- two `output frame` logs
- queue decreases to zero

## Other observations
The follow also result in correct dequeing behaviour:
- Running the same script on the main thread
- Reading chunks after the first `decoder.configure`