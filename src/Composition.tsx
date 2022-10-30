import {AbsoluteFill, staticFile, useCurrentFrame, Video} from 'remotion';

const scrollRate = 6;
const doxLines: string[] = JSON.parse(
	process.env.REMOTION_DOX_LINES || '[]'
).map((line: string) => line.trim());

export const MyComposition = () => {
	const frame = useCurrentFrame();

	const offset = frame * scrollRate - doxLines.length * 72;

	return (
		<AbsoluteFill className="bg-gray-100 items-center">
			<style>
				{`
				.text-border-black {
					text-shadow: 0 0 8px #000;
				}
					`}
			</style>
			<div
				className="relative left-0 bottom-0 z-10"
				style={{
					transform: `translateY(${offset}px)`,
				}}
			>
				{doxLines.map((line) => (
					<span className="block text-gray-200 text-border-black font-extrabold font-sans w-full text-center my-6 text-4xl">
						{line}
					</span>
				))}
			</div>
			<div className="absolute top-0 left-0 z-0">
				<Video src={staticFile('bg.webm')} />
			</div>
		</AbsoluteFill>
	);
};
